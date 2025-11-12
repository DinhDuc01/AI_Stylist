# PowerShell script để cập nhật tất cả file HTML với modern theme CSS
# Cập nhật màu sắc hiện đại cho dự án LookAI

$landingPath = ".\landing"
$cssLine = '        <!-- Modern Theme CSS -->' + "`n" + '        <link href="../assets/css/modern-theme.css" rel="stylesheet" type="text/css" />'

# Lấy tất cả file HTML trong thư mục landing
$htmlFiles = Get-ChildItem -Path $landingPath -Filter "*.html"

Write-Host "Đang cập nhật theme CSS cho $($htmlFiles.Count) file HTML..." -ForegroundColor Green

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $content = Get-Content -Path $filePath -Raw
    
    # Kiểm tra xem file đã có modern-theme.css chưa
    if ($content -notmatch "modern-theme\.css") {
        # Tìm vị trí để chèn CSS
        if ($content -match '(\s*<!-- Css -->\s*\n\s*<link href="\.\.\/assets\/css\/style\.min\.css"[^>]*>\s*)') {
            $replacement = $matches[1] + "`n" + $cssLine
            $newContent = $content -replace [regex]::Escape($matches[1]), $replacement
            
            # Ghi lại file
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "✓ Đã cập nhật: $($file.Name)" -ForegroundColor Cyan
        } else {
            Write-Host "⚠ Không tìm thấy vị trí chèn CSS trong: $($file.Name)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✓ Đã có modern theme: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "`nHoàn thành cập nhật theme CSS!" -ForegroundColor Green
Write-Host "Bảng màu mới:" -ForegroundColor White
Write-Host "• Nền: Trắng (#FFFFFF) và trắng ngà (#F8F9FA)" -ForegroundColor White
Write-Host "• Chữ: Đen xám đậm (#212529) và xám trung tính (#333333)" -ForegroundColor White  
Write-Host "• Màu nhấn: Cyan (#17D4E3) và (#00FFFF)" -ForegroundColor Cyan
