-- ============================================================================
-- Groovy Database Schema: Production Catalog & Social Music Platform
-- Upstream Source: Apple Music Catalog API
-- Author: Groovy Core Team
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ARTISTS TABLE
-- Canonical artist registry storing external IDs alongside internal metadata
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    apple_music_id BIGINT UNIQUE,
    spotify_id TEXT UNIQUE,
    is_indonesian BOOLEAN NOT NULL DEFAULT true,
    country CHAR(2) NOT NULL DEFAULT 'ID',
    verified BOOLEAN NOT NULL DEFAULT false,
    city TEXT,
    era VARCHAR(32),                     -- '2020s', '2010s', '2000s', '90s', 'Legend'
    genres TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artists_apple_music_id ON artists(apple_music_id);
CREATE INDEX IF NOT EXISTS idx_artists_is_indonesian ON artists(is_indonesian);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON artists(verified);

-- 3. ALBUMS TABLE
-- Canonical albums/EPs/singles ingested and normalized from Apple Music
CREATE TABLE IF NOT EXISTS albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    apple_music_id BIGINT UNIQUE NOT NULL,
    upc TEXT,
    release_date DATE NOT NULL,
    artwork_url TEXT,
    release_type VARCHAR(16) NOT NULL CHECK (release_type IN ('lp', 'ep', 'single', 'compilation')),
    total_tracks INT DEFAULT 1,
    record_label TEXT,
    primary_genre TEXT,
    is_indonesian BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_albums_apple_music_id ON albums(apple_music_id);
CREATE INDEX IF NOT EXISTS idx_albums_release_date ON albums(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_albums_release_type ON albums(release_type);
CREATE INDEX IF NOT EXISTS idx_albums_is_indonesian ON albums(is_indonesian);

-- 4. ALBUM_ARTISTS JOIN TABLE
-- Many-to-many relationship supporting collaborations and explicit credit roles
CREATE TABLE IF NOT EXISTS album_artists (
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'featured', 'producer')),
    order_index INT NOT NULL DEFAULT 0,
    PRIMARY KEY (album_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_album_artists_artist_id ON album_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_album_artists_role ON album_artists(role);

-- 5. REVIEWS & RATINGS TABLE
-- Social reviews foreign-keyed directly to internal canonical album ID
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
    review_text TEXT,
    favorite_track TEXT,
    is_relisten BOOLEAN DEFAULT false,
    likes_count INT DEFAULT 0,
    listened_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_album_id ON reviews(album_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 6. DISCOVERY TRIAGE QUEUE (For auto-discovered candidate releases)
CREATE TABLE IF NOT EXISTS candidate_releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apple_music_collection_id BIGINT UNIQUE NOT NULL,
    apple_music_artist_id BIGINT NOT NULL,
    artist_name TEXT NOT NULL,
    album_title TEXT NOT NULL,
    release_date DATE NOT NULL,
    record_label TEXT,
    isrc_code TEXT,
    heuristic_score INT DEFAULT 0,
    detection_reasons TEXT[] DEFAULT '{}',
    status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_releases_status ON candidate_releases(status);

-- 7. OPTIMIZED STORED PROCEDURE / RPC: Get Indonesian Feed
CREATE OR REPLACE FUNCTION get_indonesian_feed(
    p_release_types TEXT[] DEFAULT ARRAY['lp', 'ep'],
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0
)
RETURNS TABLE (
    album_id UUID,
    title TEXT,
    apple_music_id BIGINT,
    release_date DATE,
    artwork_url TEXT,
    release_type VARCHAR(16),
    total_tracks INT,
    record_label TEXT,
    primary_genre TEXT,
    artists JSONB,
    average_rating NUMERIC(2, 1),
    total_reviews BIGINT
) 
LANGUAGE sql STABLE AS $$
    SELECT 
        a.id AS album_id,
        a.title,
        a.apple_music_id,
        a.release_date,
        a.artwork_url,
        a.release_type,
        a.total_tracks,
        a.record_label,
        a.primary_genre,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', ar.id,
                    'name', ar.name,
                    'apple_music_id', ar.apple_music_id,
                    'role', aa.role
                ) ORDER BY aa.order_index
            )
            FROM album_artists aa
            JOIN artists ar ON ar.id = aa.artist_id
            WHERE aa.album_id = a.id
        ) AS artists,
        COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0.0) AS average_rating,
        COUNT(r.id) AS total_reviews
    FROM albums a
    WHERE a.is_indonesian = true
      AND a.release_type = ANY(p_release_types)
    GROUP BY a.id
    ORDER BY a.release_date DESC
    LIMIT p_limit OFFSET p_offset;
$$;
