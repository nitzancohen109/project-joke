import { TEXTS, TOPIC_MAX_LENGTH } from '../texts';
import { PawIcon } from './icons';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TopicField({ value, onChange }: Props) {
  return (
    <div className="topic">
      <label className="topic__label" htmlFor="topic">
        {TEXTS.topicLabel}
      </label>
      <div className="topic__box">
        <input
          id="topic"
          className="topic__input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={TOPIC_MAX_LENGTH}
          placeholder={TEXTS.topicPlaceholder}
          autoComplete="off"
          aria-describedby="topic-counter"
        />
        <PawIcon className="topic__paw" />
      </div>
      <div id="topic-counter" className="topic__counter">
        {value.length}/{TOPIC_MAX_LENGTH}
      </div>
    </div>
  );
}
