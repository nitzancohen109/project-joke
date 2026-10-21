import { useRef, useState } from 'react';
import Header from './components/Header';
import TopicField from './components/TopicField';
import GenerateButton from './components/GenerateButton';
import StatusLine from './components/StatusLine';
import JokeCard from './components/JokeCard';
import { getDevPreviewJoke } from './devPreview';
import { requestJoke } from './api';
import { TEXTS } from './texts';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline';

export default function App() {
  const [topic, setTopic] = useState('');
  // Starts with the dev-only layout preview (null in production); real jokes replace it.
  const [joke, setJoke] = useState<string | null>(getDevPreviewJoke);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Guards against two taps in the same frame, before the disabled button re-renders.
  const inFlight = useRef(false);

  async function handleGenerate() {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus('loading');
    setErrorMessage(null);
    try {
      const result = await requestJoke(topic);
      // On failure the previous joke and the topic stay as they are.
      switch (result.kind) {
        case 'success':
          setJoke(result.joke);
          setStatus('success');
          break;
        case 'offline':
          setStatus('offline');
          setErrorMessage(TEXTS.offline);
          break;
        case 'topicTooLong':
          setStatus('error');
          setErrorMessage(TEXTS.topicTooLong);
          break;
        case 'error':
          setStatus('error');
          setErrorMessage(TEXTS.genericError);
          break;
      }
    } finally {
      inFlight.current = false;
    }
  }

  const loading = status === 'loading';

  return (
    <main className="app">
      <Header />
      <div className="content">
        <TopicField value={topic} onChange={setTopic} />
        <GenerateButton onClick={handleGenerate} disabled={loading} />
        <StatusLine loading={loading} message={errorMessage} />
        <JokeCard joke={joke} />
      </div>
    </main>
  );
}
