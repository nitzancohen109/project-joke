import { TEXTS } from '../texts';
import { BurstIcon, HeartIcon } from './icons';
// Temporary illustration; replace with src/assets/kitten.png once spec/assets/kitten.png is provided.
import kittenSrc from '../assets/kitten-placeholder.svg';

export default function Header() {
  return (
    <header className="header">
      <HeartIcon className="deco heart heart--1" />
      <HeartIcon className="deco heart heart--2" />
      <HeartIcon className="deco heart heart--3" />
      <HeartIcon className="deco heart heart--4" />

      <div className="title-row">
        <BurstIcon className="burst burst--start" />
        <h1 className="title">{TEXTS.title}</h1>
        <BurstIcon className="burst burst--end" />
      </div>

      <img className="kitten" src={kittenSrc} alt="" width="180" height="162" />
    </header>
  );
}
