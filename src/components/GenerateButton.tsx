import { TEXTS } from '../texts';
import { BurstIcon, SparkleIcon } from './icons';

type Props = {
  onClick: () => void;
};

export default function GenerateButton({ onClick }: Props) {
  return (
    <div className="generate">
      <BurstIcon className="burst burst--start" />
      <button type="button" className="generate__button" onClick={onClick}>
        <span>{TEXTS.generateButton}</span>
        <SparkleIcon className="generate__sparkle" />
      </button>
      <BurstIcon className="burst burst--end" />
    </div>
  );
}
