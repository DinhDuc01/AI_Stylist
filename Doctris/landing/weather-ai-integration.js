// Weather AI Integration - Tích hợp API thời tiết thực và AI gợi ý outfit
class WeatherOutfitAI {
    constructor() {
        // API Keys - Cần đăng ký để lấy
        this.weatherApiKey = 'd1ca006774aa4d9491d21940250611'; // WeatherAPI.com
        this.geminiApiKey = 'AIzaSyBYgj63cniNH6OyRmGifLNo7peqgU_L6k8';   // Google Gemini API
        
        // Cơ sở dữ liệu tủ đồ cá nhân
        this.personalWardrobe = this.loadWardrobe();
        
        // Cache để tránh gọi API quá nhiều
        this.weatherCache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 phút
    }

    // 1. LẤY THỜI TIẾT THỰC TỪ API
    async getRealWeather(city = 'Hanoi') {
        const cacheKey = `weather_${city}`;
        const cached = this.weatherCache.get(cacheKey);
        
        // Kiểm tra cache
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            // Sử dụng WeatherAPI (miễn phí 1M calls/tháng)
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${this.weatherApiKey}&q=${city}&lang=vi`
            );
            
            if (!response.ok) {
                throw new Error('Weather API error');
            }
            
            const data = await response.json();
            const weatherData = {
                temperature: data.current.temp_c,
                condition: data.current.condition.text,
                humidity: data.current.humidity,
                windSpeed: data.current.wind_kph,
                feelsLike: data.current.feelslike_c,
                uvIndex: data.current.uv,
                visibility: data.current.vis_km,
                icon: data.current.condition.icon,
                isDay: data.current.is_day,
                location: `${data.location.name}, ${data.location.country}`
            };
            
            // Lưu cache
            this.weatherCache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            
            return weatherData;
            
        } catch (error) {
            console.error('Lỗi lấy thời tiết:', error);
            // Fallback data cho demo
            return this.getFallbackWeather();
        }
    }

    // 2. AI GỢI Ý OUTFIT DỰA TRÊN THỜI TIẾT + TỦ ĐỒ
    async getAIOutfitSuggestion(weather, activity = 'work', userPreferences = {}) {
        try {
            // Chuẩn bị prompt cho AI
            const prompt = this.buildOutfitPrompt(weather, activity, userPreferences);
            
            // Gọi Google Gemini API (miễn phí)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Bạn là chuyên gia thời trang AI. ${prompt}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Gemini API error');
            }

            const aiResponse = await response.json();
            const suggestion = aiResponse.candidates[0].content.parts[0].text;
            
            // Parse và format kết quả
            return this.parseAISuggestion(suggestion, weather);
            
        } catch (error) {
            console.error('Lỗi Gemini AI:', error);
            // Fallback: Sử dụng logic rules đơn giản
            return this.getRuleBasedSuggestion(weather, activity);
        }
    }

    // 3. XÂY DỰNG PROMPT CHO AI
    buildOutfitPrompt(weather, activity, preferences) {
        const wardrobeItems = this.getAvailableClothes();
        
        return `
Thời tiết hiện tại:
- Nhiệt độ: ${weather.temperature}°C (cảm giác như ${weather.feelsLike}°C)
- Thời tiết: ${weather.condition}
- Độ ẩm: ${weather.humidity}%
- Gió: ${weather.windSpeed} km/h
- Tầm nhìn: ${weather.visibility} km

Hoạt động: ${activity}

Tủ đồ có sẵn:
${wardrobeItems}

Sở thích cá nhân:
- Màu sắc yêu thích: ${preferences.favoriteColors || 'Không có'}
- Phong cách: ${preferences.style || 'Thoải mái'}
- Tránh: ${preferences.avoid || 'Không có'}

Hãy gợi ý outfit cụ thể từ tủ đồ có sẵn, bao gồm:
1. Áo (loại, màu, chất liệu)
2. Quần/Váy (loại, màu)
3. Giày dép
4. Phụ kiện (nếu cần)
5. Lý do tại sao phù hợp

Format: JSON với các trường: top, bottom, shoes, accessories, reason, comfort_score (1-10)
        `;
    }

    // 4. LOGIC GỢI Ý DỰA TRÊN RULES (FALLBACK)
    getRuleBasedSuggestion(weather, activity) {
        const temp = weather.temperature;
        const isRaining = weather.condition.toLowerCase().includes('mưa');
        const isWindy = weather.windSpeed > 15;
        
        let suggestion = {
            top: '',
            bottom: '',
            shoes: '',
            accessories: [],
            reason: '',
            comfort_score: 8
        };

        // Logic dựa trên nhiệt độ
        if (temp < 10) {
            suggestion.top = 'Áo khoác dày, áo len cổ lọ';
            suggestion.bottom = 'Quần jeans dày hoặc quần tây';
            suggestion.shoes = 'Giày bốt cao cổ';
            suggestion.accessories = ['Khăn quàng cổ', 'Mũ len', 'Găng tay'];
            suggestion.reason = 'Thời tiết lạnh, cần giữ ấm toàn thân';
        } else if (temp < 20) {
            suggestion.top = 'Áo hoodie hoặc áo cardigan';
            suggestion.bottom = 'Quần jeans hoặc quần dài';
            suggestion.shoes = 'Sneaker hoặc giày bốt thấp';
            suggestion.accessories = ['Áo khoác nhẹ'];
            suggestion.reason = 'Thời tiết mát mẻ, phù hợp với trang phục nhiều lớp';
        } else if (temp < 30) {
            suggestion.top = 'Áo sơ mi hoặc áo thun dài tay';
            suggestion.bottom = 'Quần âu hoặc chân váy';
            suggestion.shoes = 'Giày da hoặc sneaker';
            suggestion.accessories = [];
            suggestion.reason = 'Thời tiết dễ chịu, thoải mái với trang phục nhẹ';
        } else {
            suggestion.top = 'Áo thun cotton hoặc áo tank top';
            suggestion.bottom = 'Quần short hoặc váy ngắn';
            suggestion.shoes = 'Sandal hoặc giày thể thao thoáng khí';
            suggestion.accessories = ['Mũ chống nắng', 'Kính râm'];
            suggestion.reason = 'Thời tiết nóng, cần trang phục thoáng mát';
        }

        // Điều chỉnh theo thời tiết đặc biệt
        if (isRaining) {
            suggestion.accessories.push('Áo mưa', 'Ô');
            suggestion.shoes = 'Giày chống nước hoặc ủng';
            suggestion.reason += '. Có mưa nên cần đồ chống thấm.';
        }

        if (isWindy) {
            suggestion.accessories.push('Áo khoác chống gió');
            suggestion.reason += '. Có gió mạnh nên cần áo khoác.';
        }

        // Điều chỉnh theo hoạt động
        if (activity === 'sport') {
            suggestion.top = 'Áo thể thao thấm hút mồ hôi';
            suggestion.bottom = 'Quần thể thao';
            suggestion.shoes = 'Giày thể thao chuyên dụng';
        } else if (activity === 'date') {
            suggestion.reason += ' Phong cách thanh lịch cho buổi hẹn.';
        }

        return suggestion;
    }

    // 5. QUẢN LÝ TỦ ĐỒ CÁ NHÂN
    loadWardrobe() {
        // Load từ localStorage hoặc database
        const saved = localStorage.getItem('personalWardrobe');
        return saved ? JSON.parse(saved) : this.getDefaultWardrobe();
    }

    saveWardrobe() {
        localStorage.setItem('personalWardrobe', JSON.stringify(this.personalWardrobe));
    }

    addClothingItem(item) {
        this.personalWardrobe.push({
            id: Date.now(),
            ...item,
            addedDate: new Date().toISOString()
        });
        this.saveWardrobe();
    }

    getAvailableClothes() {
        return this.personalWardrobe.map(item => 
            `- ${item.type}: ${item.name} (${item.color}, ${item.material || 'không rõ chất liệu'})`
        ).join('\n');
    }

    getDefaultWardrobe() {
        return [
            { type: 'Áo', name: 'Áo sơ mi trắng', color: 'Trắng', material: 'Cotton' },
            { type: 'Áo', name: 'Áo thun đen', color: 'Đen', material: 'Cotton' },
            { type: 'Áo', name: 'Áo hoodie xám', color: 'Xám', material: 'Nỉ' },
            { type: 'Áo', name: 'Áo len cổ lọ', color: 'Beige', material: 'Len' },
            { type: 'Quần', name: 'Quần jeans xanh', color: 'Xanh denim', material: 'Denim' },
            { type: 'Quần', name: 'Quần âu đen', color: 'Đen', material: 'Polyester' },
            { type: 'Giày', name: 'Sneaker trắng', color: 'Trắng', material: 'Da tổng hợp' },
            { type: 'Giày', name: 'Giày da nâu', color: 'Nâu', material: 'Da thật' },
            { type: 'Phụ kiện', name: 'Khăn quàng cổ', color: 'Đa màu', material: 'Len' }
        ];
    }

    // 6. HỌC TỪ SỞ THÍCH NGƯỜI DÙNG
    recordUserFeedback(suggestion, rating, actualChoice) {
        const feedback = {
            timestamp: Date.now(),
            weather: this.lastWeather,
            suggestion: suggestion,
            rating: rating, // 1-5 stars
            actualChoice: actualChoice
        };
        
        // Lưu feedback để cải thiện AI
        let feedbackHistory = JSON.parse(localStorage.getItem('outfitFeedback') || '[]');
        feedbackHistory.push(feedback);
        
        // Giữ tối đa 100 feedback gần nhất
        if (feedbackHistory.length > 100) {
            feedbackHistory = feedbackHistory.slice(-100);
        }
        
        localStorage.setItem('outfitFeedback', JSON.stringify(feedbackHistory));
    }

    // 7. FALLBACK DATA CHO DEMO
    getFallbackWeather() {
        return {
            temperature: 15,
            condition: 'Nhiều mây',
            humidity: 75,
            windSpeed: 10,
            feelsLike: 13,
            uvIndex: 3,
            visibility: 8,
            icon: '//cdn.weatherapi.com/weather/64x64/day/119.png',
            isDay: 1,
            location: 'Hà Nội, Vietnam'
        };
    }

    // 8. PARSE KẾT QUẢ TỪ AI
    parseAISuggestion(aiText, weather) {
        try {
            // Tìm JSON trong response
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('Không thể parse AI response:', error);
        }
        
        // Fallback nếu không parse được
        return this.getRuleBasedSuggestion(weather, 'casual');
    }
}

// CÁCH SỬ DỤNG
const weatherAI = new WeatherOutfitAI();

// Hàm chính để cập nhật gợi ý outfit
async function updateSmartOutfitSuggestion(city = 'Hanoi', activity = 'work') {
    try {
        // 1. Lấy thời tiết thực
        const weather = await weatherAI.getRealWeather(city);
        
        // 2. Cập nhật UI thời tiết
        updateWeatherUI(weather);
        
        // 3. Lấy gợi ý AI
        const suggestion = await weatherAI.getAIOutfitSuggestion(weather, activity);
        
        // 4. Cập nhật UI gợi ý
        updateOutfitUI(suggestion);
        
        console.log('Đã cập nhật gợi ý thông minh!');
        
    } catch (error) {
        console.error('Lỗi cập nhật gợi ý:', error);
    }
}

// Cập nhật UI thời tiết
function updateWeatherUI(weather) {
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('weatherDescription').textContent = weather.condition;
    document.getElementById('location').textContent = weather.location;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
    document.getElementById('windSpeed').textContent = `${weather.windSpeed} km/h`;
    document.getElementById('visibility').textContent = `${weather.visibility} km`;
    
    // Cập nhật icon thời tiết
    const weatherIcon = document.getElementById('weatherIcon');
    if (weather.icon) {
        weatherIcon.innerHTML = `<img src="https:${weather.icon}" alt="${weather.condition}" style="width: 64px; height: 64px;">`;
    }
}

// Cập nhật UI gợi ý outfit
function updateOutfitUI(suggestion) {
    const container = document.getElementById('outfitItems');
    if (!container) return;
    
    container.innerHTML = `
        <div class="outfit-item">
            <div class="flex-grow-1">
                <h6 class="mb-1">${suggestion.top}</h6>
                <small class="text-muted">Áo phù hợp với thời tiết</small>
            </div>
            <div class="text-end">
                <span class="badge bg-success">AI: ${suggestion.comfort_score}/10</span>
            </div>
        </div>
        
        <div class="outfit-item">
            <div class="flex-grow-1">
                <h6 class="mb-1">${suggestion.bottom}</h6>
                <small class="text-muted">Quần/váy phù hợp</small>
            </div>
            <div class="text-end">
                <span class="badge bg-success">Phù hợp</span>
            </div>
        </div>
        
        <div class="outfit-item">
            <div class="flex-grow-1">
                <h6 class="mb-1">${suggestion.shoes}</h6>
                <small class="text-muted">Giày dép phù hợp</small>
            </div>
            <div class="text-end">
                <span class="badge bg-info">Thoải mái</span>
            </div>
        </div>
        
        ${suggestion.accessories.length > 0 ? `
        <div class="outfit-item">
            <div class="flex-grow-1">
                <h6 class="mb-1">Phụ kiện</h6>
                <small class="text-muted">${suggestion.accessories.join(', ')}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-warning">Khuyên dùng</span>
            </div>
        </div>
        ` : ''}
        
        <div class="mt-3 p-3 bg-light rounded">
            <small><strong>Lý do:</strong> ${suggestion.reason}</small>
        </div>
    `;
}

// Export để sử dụng trong file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherOutfitAI, updateSmartOutfitSuggestion };
}
