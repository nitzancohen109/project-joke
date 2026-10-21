import { TEXTS } from '../texts';
import { BurstIcon, SparkleIcon } from './icons';

type Props = {
  onClick: () => void;
  disabled: boolean;
};

export default function GenerateButton({ onClick, disabled }: Props) {
  return (
    <div className="generate">
      <BurstIcon className="burst burst--start" />
      <button type="button" className="generate__button" onClick={onClick} disabled={disabled}>
        <span>{TEXTS.generateButton}</span>
        <SparkleIcon className="generate__sparkle" />
      </button>
      <BurstIcon className="burst burst--end" />
    </div>
  );
}
