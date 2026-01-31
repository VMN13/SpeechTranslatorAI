# 🎤 AI-Powered Speech Translator

A real-time speech recognition and translation application powered by OpenAI's GPT. Supports English and Russian languages with beautiful UI.

## ✨ Features

- 🎙️ Real-time speech recognition using Web Speech API
- 🤖 AI-powered translation using OpenAI GPT-3.5
- 🌐 Bilingual support (English ↔ Russian)
- 💬 Natural language responses
- 🎨 Modern, responsive UI
- 🔒 Secure API key handling via backend

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser (for Web Speech API support)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository** (or navigate to project directory)
   ```bash
   cd integrator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit the `.env` file and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key_here
   PORT=3001
   ```

### Running the Application

#### Option 1: Run both frontend and backend together (Recommended)
```bash
npm run dev:all
```

#### Option 2: Run separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 📖 How to Use

1. **Select Language**: Choose either English (🇺🇸) or Russian (🇷🇺)
2. **Start Recording**: Click "🎤 Начать запись" / "Start Recording"
3. **Speak**: Talk into your microphone
4. **Stop Recording**: Click "⏹️ Остановить" / "Stop"
5. **Get Translation**: The AI will automatically process and provide translations in both languages

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
- Axios
- Web Speech API

### Backend
- Node.js
- Express
- OpenAI API
- CORS

## 📁 Project Structure

```
integrator/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styling
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── server/
│   └── index.js         # Express backend server
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Backend server port (default: 3001)

### Supported Languages

- English (en-US)
- Russian (ru-RU)

## 🐛 Troubleshooting

### "Browser doesn't support Web Speech API"
- Use Google Chrome browser
- Ensure you're using HTTPS or localhost

### "OpenAI API key not configured"
- Check that `.env` file exists
- Verify `OPENAI_API_KEY` is set correctly
- Restart the backend server after changing `.env`

### "Failed to process translation"
- Check backend server is running on port 3001
- Verify your OpenAI API key is valid
- Check your OpenAI account has credits

### CORS Errors
- Ensure backend server is running
- Check that frontend is making requests to `http://localhost:3001`

## 💡 Tips

- Speak clearly and at a moderate pace
- Use Chrome for best speech recognition results
- Ensure microphone permissions are granted
- Keep sentences reasonably short for better accuracy

## 📝 API Endpoints

### Backend API

#### `GET /api/health`
Health check endpoint
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

#### `POST /api/translate`
Translate speech to both languages
```json
{
  "text": "Hello, how are you?",
  "sourceLang": "en-US"
}
```

Response:
```json
{
  "success": true,
  "translations": {
    "en": "Hello! I'm doing well, thank you!",
    "ru": "Привет! У меня всё хорошо, спасибо!"
  }
}
```

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key secure
- The backend server handles API calls to prevent key exposure
- Use environment variables for sensitive data

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using React, Node.js, and OpenAI

---

**Note**: This application requires an active internet connection and a valid OpenAI API key to function properly.
