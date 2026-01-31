import { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');

  const [translations, setTranslations] = useState({ en: '', ru: '' });
  const [suggestedReply, setSuggestedReply] = useState({ en: '', ru: '' });

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Live update controls
  const debounceTimerRef = useRef(null);
  const lastSentTextRef = useRef('');
  const abortControllerRef = useRef(null);

  const resetUI = () => {
    setError('');
    setTranscript('');
    setTranslations({ en: '', ru: '' });
    setSuggestedReply({ en: '', ru: '' });
    finalTranscriptRef.current = '';
    lastSentTextRef.current = '';
  };

  const cancelPending = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const scheduleAssist = (currentText) => {
    const cleaned = currentText.trim();

    // Anti-spam: don't call AI for tiny fragments
    if (cleaned.length < 12) return;

    // If same text already sent, skip
    if (cleaned === lastSentTextRef.current) return;

    // Debounce
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      lastSentTextRef.current = cleaned;
      sendToAI(cleaned);
    }, 1500);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Ваш браузер не поддерживает Web Speech API. Используйте Chrome.');
      return;
    }

    resetUI();
    cancelPending();

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscriptChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += chunk + ' ';
        } else {
          interimTranscript += chunk;
        }
      }

      if (finalTranscriptChunk) {
        finalTranscriptRef.current += finalTranscriptChunk;
      }

      const combined = (finalTranscriptRef.current + interimTranscript).trim();
      setTranscript(combined);

      // Live AI assist while speaking
      if (combined) scheduleAssist(combined);
    };

    recognition.onerror = (event) => {
      setError(`Ошибка распознавания: ${event.error}`);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);

      const finalText = finalTranscriptRef.current.trim();
      if (finalText && finalText !== lastSentTextRef.current) {
        // Ensure final request on stop (if something new appeared)
        lastSentTextRef.current = finalText;
        sendToAI(finalText);
      }
    };

    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    cancelPending();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const sendToAI = async (text) => {
    setIsProcessing(true);
    setError('');

    // Cancel previous in-flight request (so UI stays fresh)
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
    
      const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const response = await axios.post(
  `${WORKER_URL}/api/assist`,
  { text, sourceLang: language },
  { signal: abortControllerRef.current.signal }
);

      if (response.data?.success) {
        setTranslations({
          en: response.data.translations?.en || '',
          ru: response.data.translations?.ru || '',
        });

        setSuggestedReply({
          en: response.data.suggestedReply?.en || '',
          ru: response.data.suggestedReply?.ru || '',
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      // Ignore abort errors (expected during live updates)
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }

      const serverError = err.response?.data?.error;
      const serverDetails = err.response?.data?.details;

      setError(
        `Ошибка: ${serverError || err.message}${serverDetails ? ` | Details: ${serverDetails}` : ''}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Речевой переводчик</h1>
        <p className="subtitle">Speech Translator + Predicted Reply</p>

        <div className="controls">
          <div className="language-selector">
            <label htmlFor="language">Язык / Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isListening}
            >
              <option value="en-US">English</option>
              <option value="ru-RU">Русский</option>
            </select>
          </div>

          <div className="button-group">
            <button
              className={`btn btn-start ${isListening ? 'recording' : ''}`}
              onClick={startListening}
              disabled={isListening}
            >
              {isListening ? 'Запись...' : 'Начать запись'}
            </button>

            <button className="btn btn-stop" onClick={stopListening} disabled={!isListening}>
              Остановить
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="transcript-section">
          <h2>Транскрипт речи / Speech Transcript:</h2>
          <div className="transcript-box">
            {transcript || (isListening ? 'Говорите...' : 'Нажмите "Начать запись"')}
          </div>
        </div>

        {isProcessing && (
          <div className="processing">
            <div className="spinner"></div>
            <p>Обработка... / Processing...</p>
          </div>
        )}

        {(translations.en || translations.ru) && !isProcessing && (
          <div className="response-section">
            <h2>Перевод / Translation</h2>
            <div className="response-grid">
              <div className="response-box">
                <h3>English</h3>
                <p>{translations.en || '—'}</p>
              </div>
              <div className="response-box">
                <h3>Русский</h3>
                <p>{translations.ru || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {(suggestedReply.en || suggestedReply.ru) && !isProcessing && (
          <div className="response-section">
            <h2>Предполагаемый ответ собеседника / Predicted interlocutor reply</h2>
            <div className="response-grid">
              <div className="response-box">
                <h3>English</h3>
                <p>{suggestedReply.en || '—'}</p>
              </div>
              <div className="response-box">
                <h3>Русский</h3>
                <p>{suggestedReply.ru || '—'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="info-box">
          <p><strong>Как использовать:</strong></p>
          <ol>
            <li>Выберите язык</li>
            <li>Нажмите "Начать запись"</li>
            <li>Говорите — перевод и ответ будут обновляться автоматически</li>
            <li>Нажмите "Остановить"</li>
          </ol>
          <p className="note">Backend должен работать на порту 3001</p>
        </div>
      </div>
    </div>
  );
}

export default App;