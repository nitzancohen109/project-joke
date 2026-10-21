import { useRef, useState } from 'react';
import Header from './components/Header';
import TopicField from './components/TopicField';
import GenerateButton from './components/GenerateButton';
import JokeCard from './components/JokeCard';
import { getDevPreviewJoke } from './devPreview';
import { requestJoke } from './api';

export default function App() {
  const [topic, setTopic] = useState('');
  // Starts with the dev-only layout preview (null in production); real jokes replace it.
  const [joke, setJoke] = useState<string | null>(getDevPreviewJoke);
  // Ignore extra clicks while a request is in flight, so one double-tap doesn't bill twice.
  // Visible loading/error states come in Milestone 3.
  const inFlight = useRef(false);

  async function handleGenerate() {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const result = await requestJoke(topic);
      // On failure the previous joke and the topic stay as they are.
      if (result.ok) setJoke(result.joke);
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <main className="app">
      <Header />
      <div className="content">
        <TopicField value={topic} onChange={setTopic} />
        <GenerateButton onClick={handleGenerate} />
        <JokeCard joke={joke} />
      </div>
    </main>
  );
}
