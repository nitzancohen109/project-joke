import { TEXTS } from '../texts';
import { BurstIcon, HeartIcon, SmileyIcon } from './icons';

type Props = {
  joke: string | null;
};

export default function JokeCard({ joke }: Props) {
  return (
    <section className="joke" aria-labelledby="joke-heading">
      <h2 id="joke-heading" className="joke__heading">
        {TEXTS.jokeHeading}
      </h2>
      <div className="joke__card" aria-live="polite">
        <HeartIcon className="deco joke__heart joke__heart--1" />
        <HeartIcon className="deco joke__heart joke__heart--2" />
        <HeartIcon className="deco joke__heart joke__heart--3" />

        {joke ? (
          // Plain text only; dir="auto" lets English jokes render left-to-right.
          <p className="joke__text" dir="auto">
            {joke}
          </p>
        ) : (
          <div className="joke__empty">
            <div className="joke__smiley-row">
              <BurstIcon className="burst burst--start" />
              <SmileyIcon className="joke__smiley" />
              <BurstIcon className="burst burst--end" />
            </div>
            <p className="joke__empty-text">{TEXTS.emptyCard}</p>
          </div>
        )}
      </div>
    </section>
  );
}
