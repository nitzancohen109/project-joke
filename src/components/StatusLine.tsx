import { TEXTS } from '../texts';

type Props = {
  loading: boolean;
  message: string | null;
};

// Single status row for loading, error and offline messages (DESIGN 1.2).
// The live region always stays in the DOM so screen readers announce changes; it takes no space when empty.
export default function StatusLine({ loading, message }: Props) {
  return (
    <div className="status" role="status" aria-live="polite">
      {loading ? (
        <p className="status__loading">
          <span className="visually-hidden">{TEXTS.loading}</span>
          <span aria-hidden="true">
            {TEXTS.loading.replace(/\.+$/, '')}
            <span className="status__dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
        </p>
      ) : message ? (
        <p className="status__pill">{message}</p>
      ) : null}
    </div>
  );
}
