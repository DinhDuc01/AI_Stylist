# 🚀 Hướng Dẫn Setup API cho Smart Weather Outfit

## 📋 Tổng Quan
Để sử dụng đầy đủ tính năng AI gợi ý outfit thông minh, bạn cần setup 2 API:

1. **Weather API** - Lấy thời tiết thực (MIỄN PHÍ)
2. **OpenAI API** - AI gợi ý thông minh (TRẢ PHÍ, có thể bỏ qua)

---

## 🌤️ 1. WEATHER API SETUP (MIỄN PHÍ)

### Bước 1: Đăng ký WeatherAPI
1. Truy cập: https://www.weatherapi.com/
2. Click "Sign Up Free"
3. Điền thông tin đăng ký
4. Xác nhận email

### Bước 2: Lấy API Key
1. Đăng nhập vào dashboard
2. Vào mục "My API Keys"
3. Copy API key (dạng: `abc123def456...`)

### Bước 3: Cập nhật Code
Mở file `weather-ai-integration.js`, tìm dòng:
```javascript
this.weatherApiKey = 'YOUR_WEATHER_API_KEY';
```
Thay `YOUR_WEATHER_API_KEY` bằng API key vừa lấy:
```javascript
this.weatherApiKey = 'abc123def456...';
```

### ✅ Giới Hạn Miễn Phí
- **1 triệu calls/tháng** (đủ dùng cho app cá nhân)
- Dữ liệu thời tiết hiện tại + dự báo 3 ngày
- Hỗ trợ 80,000+ địa điểm toàn cầu

---

## 🤖 2. OPENAI API SETUP (TRẢ PHÍ - TÙY CHỌN)

### Bước 1: Đăng ký OpenAI
1. Truy cập: https://platform.openai.com/
2. Tạo tài khoản hoặc đăng nhập
3. Vào "API Keys" trong dashboard

### Bước 2: Tạo API Key
1. Click "Create new secret key"
2. Đặt tên cho key (vd: "Weather Outfit App")
3. Copy key (dạng: `sk-...`)
4. **⚠️ LƯU Ý**: Key chỉ hiển thị 1 lần, hãy lưu cẩn thận!

### Bước 3: Nạp Tiền
1. Vào "Billing" → "Payment methods"
2. Thêm thẻ tín dụng
3. Nạp tối thiểu $5 (đủ dùng vài tháng)

### Bước 4: Cập nhật Code
```javascript
this.openaiApiKey = 'sk-your-actual-key-here';
```

### 💰 Chi Phí Ước Tính
- **GPT-3.5-turbo**: $0.002/1K tokens
- 1 lần gợi ý outfit ≈ 200-500 tokens
- **Chi phí**: ~$0.001-0.002/lần gợi ý
- **$5 ≈ 2500-5000 lần gợi ý**

---

## 🔧 3. SETUP KHÔNG CẦN API (MIỄN PHÍ HOÀN TOÀN)

Nếu không muốn dùng API trả phí, bạn vẫn có thể:

### Option 1: Chỉ dùng Weather API
- Thời tiết thực từ WeatherAPI (miễn phí)
- Gợi ý outfit bằng rules logic (không cần AI API)

### Option 2: Dùng API miễn phí khác
```javascript
// Thay thế OpenAI bằng Hugging Face (miễn phí)
// Hoặc Google Gemini (có gói miễn phí)
```

### Option 3: Offline hoàn toàn
- Dữ liệu thời tiết giả lập
- Logic gợi ý dựa trên rules có sẵn

---

## 🛠️ 4. CÁCH CÀI ĐẶT

### Bước 1: Download Files
Đảm bảo bạn có các file:
- `weather-ai-integration.js`
- `smart-weather-outfit.html`
- File CSS và Bootstrap

### Bước 2: Cập nhật API Keys
Mở `weather-ai-integration.js` và thay đổi:
```javascript
constructor() {
    // Thay YOUR_API_KEY bằng key thật
    this.weatherApiKey = 'YOUR_WEATHER_API_KEY';
    this.openaiApiKey = 'YOUR_OPENAI_API_KEY';   // Có thể để trống nếu không dùng
}
```

### Bước 3: Test
1. Mở `smart-weather-outfit.html` trong browser
2. Nhập tên thành phố
3. Kiểm tra trạng thái API ở cuối trang

---

## 🔍 5. TROUBLESHOOTING

### Lỗi Weather API
```
❌ Weather API: Lỗi kết nối
```
**Giải pháp:**
- Kiểm tra API key đúng chưa
- Kiểm tra kết nối internet
- Xem console browser (F12) để debug

### Lỗi OpenAI API
```
❌ AI API: Lỗi kết nối
```
**Giải pháp:**
- Kiểm tra API key và billing
- Nếu không muốn dùng, tắt "Sử dụng AI thông minh"

### CORS Error
Nếu gặp lỗi CORS khi test local:
```bash
# Chạy local server
python -m http.server 8000
# Hoặc
npx serve .
```

---

## 📊 6. MONITORING & USAGE

### Theo dõi Usage
1. **WeatherAPI**: Dashboard → Usage
2. **OpenAI**: Platform → Usage

### Tối ưu Chi phí
- Cache kết quả thời tiết (10 phút)
- Giới hạn số lần gọi AI/ngày
- Dùng rules fallback khi cần

---

## 🎯 7. NÂNG CAP TÍNH NĂNG

### Tích hợp thêm:
- **Google Vision API**: Phân tích ảnh quần áo
- **Firebase**: Lưu trữ tủ đồ cloud
- **Gemini API**: AI miễn phí thay OpenAI
- **Weather forecast**: Dự báo 7-14 ngày

### Database Integration:
```javascript
// Kết nối với backend để lưu:
// - Lịch sử outfit
// - Sở thích người dùng  
// - Đánh giá và feedback
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Xem file log API
3. Test từng API riêng biệt
4. Liên hệ support của API provider

**Chúc bạn setup thành công! 🎉**
