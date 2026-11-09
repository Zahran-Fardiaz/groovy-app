Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$brandDir = Join-Path $projectRoot "public\brand"
if (!(Test-Path $brandDir)) {
    New-Item -ItemType Directory -Path $brandDir -Force | Out-Null
}

$sourceLogo = "..\Groovy-logo-versions\groovy-brandmark-transparent.png"
Copy-Item $sourceLogo (Join-Path $brandDir "groovy-brandmark.png") -Force
Copy-Item "..\Groovy-logo-versions\groovy-white-transparent.png" (Join-Path $brandDir "groovy-logo-white.png") -Force
Copy-Item "..\Groovy-logo-versions\groovy-dark-background.png" (Join-Path $brandDir "groovy-logo-dark.png") -Force

Write-Output "Brand assets copied to public/brand"

$fgSizes = [ordered]@{
    'mipmap-mdpi'    = 108
    'mipmap-hdpi'    = 162
    'mipmap-xhdpi'   = 216
    'mipmap-xxhdpi'  = 324
    'mipmap-xxxhdpi' = 432
}

$legacySizes = [ordered]@{
    'mipmap-mdpi'    = 48
    'mipmap-hdpi'    = 72
    'mipmap-xhdpi'   = 96
    'mipmap-xxhdpi'  = 144
    'mipmap-xxxhdpi' = 192
}

$srcPath = Join-Path $brandDir "groovy-brandmark.png"
$src = [System.Drawing.Image]::FromFile($srcPath)
$bgColor = [System.Drawing.ColorTranslator]::FromHtml('#0E1117')

foreach ($folder in $fgSizes.Keys) {
    $targetDir = Join-Path $projectRoot "android\app\src\main\res\$folder"
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # 1. Foreground adaptive icon (transparent background, centered logo)
    $dim = $fgSizes[$folder]
    $fgBmp = New-Object System.Drawing.Bitmap($dim, $dim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($fgBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $logoSize = [int]($dim * 0.62)
    $offset = [int](($dim - $logoSize) / 2)
    $g.DrawImage($src, $offset, $offset, $logoSize, $logoSize)
    $g.Dispose()

    $fgPath = Join-Path $targetDir "ic_launcher_foreground.png"
    if (Test-Path $fgPath) { Remove-Item $fgPath -Force }
    $fgBmp.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $fgBmp.Dispose()

    # 2. Legacy ic_launcher.png (Rounded rectangle with dark background)
    $lDim = $legacySizes[$folder]
    $lBmp = New-Object System.Drawing.Bitmap($lDim, $lDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $lg = [System.Drawing.Graphics]::FromImage($lBmp)
    $lg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $lg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $lg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $lg.Clear([System.Drawing.Color]::Transparent)

    $radius = [int]($lDim * 0.22)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $radius * 2, $radius * 2, 180, 90)
    $path.AddArc($lDim - $radius * 2, 0, $radius * 2, $radius * 2, 270, 90)
    $path.AddArc($lDim - $radius * 2, $lDim - $radius * 2, $radius * 2, $radius * 2, 0, 90)
    $path.AddArc(0, $lDim - $radius * 2, $radius * 2, $radius * 2, 90, 90)
    $path.CloseFigure()

    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $lg.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()

    $lLogoSize = [int]($lDim * 0.70)
    $lOffset = [int](($lDim - $lLogoSize) / 2)
    $lg.DrawImage($src, $lOffset, $lOffset, $lLogoSize, $lLogoSize)
    $lg.Dispose()

    $lPath = Join-Path $targetDir "ic_launcher.png"
    if (Test-Path $lPath) { Remove-Item $lPath -Force }
    $lBmp.Save($lPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $lBmp.Dispose()

    # 3. Legacy ic_launcher_round.png (Circle masked with dark background)
    $rBmp = New-Object System.Drawing.Bitmap($lDim, $lDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $rg = [System.Drawing.Graphics]::FromImage($rBmp)
    $rg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $rg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $rg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $rg.Clear([System.Drawing.Color]::Transparent)

    $rPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $rPath.AddEllipse(0, 0, $lDim, $lDim)
    $rBrush = New-Object System.Drawing.SolidBrush($bgColor)
    $rg.FillPath($rBrush, $rPath)
    $rBrush.Dispose()
    $rPath.Dispose()

    $rg.DrawImage($src, $lOffset, $lOffset, $lLogoSize, $lLogoSize)
    $rg.Dispose()

    $roundPath = Join-Path $targetDir "ic_launcher_round.png"
    if (Test-Path $roundPath) { Remove-Item $roundPath -Force }
    $rBmp.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $rBmp.Dispose()

    Write-Output "Successfully generated launcher icons for $folder"
}

# 4. Generate all splash screens
$splashItems = Get-ChildItem -Path (Join-Path $projectRoot "android\app\src\main\res") -Recurse -Filter "splash.png"
foreach ($sItem in $splashItems) {
    $tempImg = [System.Drawing.Image]::FromFile($sItem.FullName)
    $w = $tempImg.Width
    $h = $tempImg.Height
    $tempImg.Dispose()

    $sBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $sg = [System.Drawing.Graphics]::FromImage($sBmp)
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $sg.Clear($bgColor)

    # Centered logo size (take ~28% of the minimum dimension)
    $minDim = [Math]::Min($w, $h)
    $sLogoSize = [int]($minDim * 0.38)
    $xOffset = [int](($w - $sLogoSize) / 2)
    $yOffset = [int](($h - $sLogoSize) / 2)
    $sg.DrawImage($src, $xOffset, $yOffset, $sLogoSize, $sLogoSize)
    $sg.Dispose()

    Remove-Item $sItem.FullName -Force
    $sBmp.Save($sItem.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
    $sBmp.Dispose()

    Write-Output "Generated splash for $($sItem.Directory.Name) (${w}x${h})"
}

$src.Dispose()
Write-Output "All Groovy launcher icons and splash screens generated successfully!"
