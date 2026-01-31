# 🚀 Quick Start - 3 Steps to Run

## Step 1: Configure API Key (REQUIRED)

Open the `.env` file and replace `your_openai_api_key_here` with your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

Get your API key from: https://platform.openai.com/api-keys

## Step 2: Run the Application

Open terminal and run:

```bash
npm run dev:all
```

## Step 3: Open in Browser

Open Chrome and go to: http://localhost:5173

---

## ✅ That's it! You're ready to use the translator.

### Usage:
1. Select language (English or Russian)
2. Click "Start Recording" 
3. Speak into your microphone
4. Click "Stop"
5. Get AI translation in both languages

---

## ⚠️ Troubleshooting

**If backend doesn't start:**
- Make sure you configured `.env` with your OpenAI API key
- Check port 3001 is not in use

**If speech recognition doesn't work:**
- Use Chrome browser
- Allow microphone permissions
- Check microphone is connected

**If AI translation fails:**
- Verify your OpenAI API key is valid
- Check you have credits in your OpenAI account
- Look at backend terminal for error messages

---

For detailed documentation, see `README.md` or `SETUP_GUIDE.md`
