import { TEXTS } from '../texts';
import { BurstIcon, SparkleIcon } from './icons';

// Milestone 1: no click action yet — joke generation is wired up in Milestone 2.
export default function GenerateButton() {
  return (
    <div className="generate">
      <BurstIcon className="burst burst--start" />
      <button type="button" className="generate__button">
        <span>{TEXTS.generateButton}</span>
        <SparkleIcon className="generate__sparkle" />
      </button>
      <BurstIcon className="burst burst--end" />
    </div>
  );
}
