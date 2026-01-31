import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY?.trim();

console.log('cwd:', process.cwd());
console.log('NEBIUS_API_KEY configured:', Boolean(NEBIUS_API_KEY));
console.log('NEBIUS_API_KEY length:', NEBIUS_API_KEY?.length || 0);

const client = new OpenAI({
  baseURL: 'https://api.tokenfactory.nebius.com/v1/',
  apiKey: NEBIUS_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/assist', async (req, res) => {
  try {
    const { text, sourceLang } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    if (!NEBIUS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Nebius API key not configured',
        details: 'Please add NEBIUS_API_KEY to your .env file and restart the server',
      });
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, error: 'Text is empty' });
    }

    const inputLang = sourceLang === 'en-US' ? 'English' : 'Russian';

    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      temperature: 0.35,
      max_tokens: 550,
      messages: [
        {
          role: 'system',
          content: [
            'You are a bilingual assistant for live conversations.',
            '',
            'You will be given one message said by Speaker A to Speaker B.',
            'Your tasks:',
            '1) Translate Speaker A message into BOTH English and Russian.',
            '2) Predict what Speaker B would likely reply next (short, natural). Provide that reply in BOTH English and Russian.',
            '',
            'Return ONLY valid JSON in this exact schema:',
            '{',
            '  "translations": { "en": string, "ru": string },',
            '  "suggestedReply": { "en": string, "ru": string }',
            '}',
            '',
            'Rules:',
            '- suggestedReply must sound like the other person (Speaker B) responding to Speaker A.',
            '- Keep suggestedReply concise (1-2 sentences).',
            '- Do not invent personal facts; if context is missing, reply neutrally and ask a clarifying question.',
            '- No extra keys, no markdown, JSON only.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: `Speaker A (${inputLang}) says: "${trimmed}"`,
        },
      ],
    });

    const content = completion?.choices?.[0]?.message?.content ?? '';

    // Extract JSON if needed
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : content;

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      return res.status(200).json({
        success: true,
        translations: { en: '', ru: '' },
        suggestedReply: { en: '', ru: '' },
        raw: content,
        warning: 'Model did not return valid JSON',
      });
    }

    return res.json({
      success: true,
      translations: {
        en: data?.translations?.en || '',
        ru: data?.translations?.ru || '',
      },
      suggestedReply: {
        en: data?.suggestedReply?.en || '',
        ru: data?.suggestedReply?.ru || '',
      },
    });
  } catch (error) {
    const status = error?.status ?? 500;
    const message = error?.error?.message || error?.message || 'Failed';

    console.error('Nebius/OpenAI error status:', status);
    console.error('Nebius/OpenAI error message:', message);

    return res.status(status).json({
      success: false,
      error: 'Failed to process assist request',
      details: message,
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});