import { useState } from 'react';
import Header from './components/Header';
import TopicField from './components/TopicField';
import GenerateButton from './components/GenerateButton';
import JokeCard from './components/JokeCard';
import { getDevPreviewJoke } from './devPreview';

export default function App() {
  const [topic, setTopic] = useState('');
  // No real jokes until the API is connected (Milestone 2); the dev-only preview text is for layout checks.
  const joke = getDevPreviewJoke();

  return (
    <main className="app">
      <Header />
      <div className="content">
        <TopicField value={topic} onChange={setTopic} />
        <GenerateButton />
        <JokeCard joke={joke} />
      </div>
    </main>
  );
}
