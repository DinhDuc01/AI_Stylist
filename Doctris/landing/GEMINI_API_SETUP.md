# 🤖 Hướng Dẫn Setup Google Gemini API (MIỄN PHÍ)

## 🎯 Tại Sao Chọn Gemini?

- ✅ **MIỄN PHÍ**: 15 requests/phút, 1500 requests/ngày
- ✅ **Chất lượng cao**: Tương đương GPT-3.5
- ✅ **Dễ setup**: Không cần thẻ tín dụng
- ✅ **Hỗ trợ tiếng Việt**: Rất tốt

---

## 🚀 SETUP GEMINI API

### Bước 1: Tạo Google AI Studio Account
1. Truy cập: https://aistudio.google.com/
2. Đăng nhập bằng tài khoản Google
3. Chấp nhận Terms of Service

### Bước 2: Lấy API Key
1. Click "Get API Key" ở sidebar
2. Click "Create API Key"
3. Chọn project hoặc tạo mới
4. Copy API key (dạng: `AIza...`)

### Bước 3: Cập nhật Code
Mở file `weather-ai-integration.js`:
```javascript
this.geminiApiKey = 'AIzaSyC...your-actual-key-here';
```

---

## 🧪 TEST GEMINI API

### Test đơn giản:
```javascript
async function testGemini() {
    const API_KEY = 'YOUR_GEMINI_KEY';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: 'Gợi ý outfit cho thời tiết 15°C, nhiều mây' }]
            }]
        })
    });
    
    const data = await response.json();
    console.log(data.candidates[0].content.parts[0].text);
}
```

---

## 📊 GIỚI HẠN MIỄN PHÍ

| Metric | Giới Hạn |
|--------|-----------|
| **Requests/phút** | 15 |
| **Requests/ngày** | 1,500 |
| **Tokens/request** | 30,000 |
| **Requests/tháng** | 45,000 |

**➡️ Đủ dùng cho app cá nhân!**

---

## 🔧 TROUBLESHOOTING

### Lỗi 403 - API Key Invalid
```json
{
  "error": {
    "code": 403,
    "message": "API key not valid"
  }
}
```
**Giải pháp:**
- Kiểm tra API key có đúng không
- Đảm bảo API key được enable

### Lỗi 429 - Rate Limit
```json
{
  "error": {
    "code": 429,
    "message": "Quota exceeded"
  }
}
```
**Giải pháp:**
- Đợi 1 phút rồi thử lại
- Giảm tần suất gọi API
- Dùng cache để tránh gọi lại

### Lỗi CORS
**Giải pháp:**
- Chạy từ server (không phải file://)
- Sử dụng proxy nếu cần

---

## 💡 TIPS TỐI ƯU

### 1. Cache Kết Quả
```javascript
const cache = new Map();
const cacheKey = `${weather.temperature}_${activity}`;
if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
}
```

### 2. Fallback Graceful
```javascript
try {
    return await getGeminiSuggestion();
} catch (error) {
    return getRuleBasedSuggestion(); // Fallback
}
```

### 3. Optimize Prompt
```javascript
const prompt = `Thời tiết: ${temp}°C, ${condition}. 
Hoạt động: ${activity}. 
Tủ đồ: ${wardrobe}. 
Gợi ý ngắn gọn outfit phù hợp.`;
```

---

## 🔄 SO SÁNH VỚI OPENAI

| Feature | Gemini | OpenAI GPT |
|---------|--------|------------|
| **Giá** | Miễn phí | $0.002/1K tokens |
| **Chất lượng** | Rất tốt | Xuất sắc |
| **Tiếng Việt** | Tốt | Tốt |
| **Rate Limit** | 15/phút | Tùy gói |
| **Setup** | Dễ | Cần thẻ tín dụng |

**➡️ Gemini là lựa chọn tốt nhất cho bắt đầu!**

---

## 🎯 NEXT STEPS

1. **Test API**: Dùng file `test-weather-api.html`
2. **Integrate**: Cập nhật `smart-weather-outfit.html`
3. **Optimize**: Thêm cache và error handling
4. **Scale**: Nâng cấp lên paid plan nếu cần

**Chúc bạn setup thành công! 🚀**
