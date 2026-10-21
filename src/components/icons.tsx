// Small decorative inline SVG icons. All are aria-hidden — none of them is an action.

type IconProps = { className?: string };

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M10 2l1.8 5.7L17.5 9.5l-5.7 1.8L10 17l-1.8-5.7L2.5 9.5l5.7-1.8z" />
      <path fill="currentColor" d="M18.5 13l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
    </svg>
  );
}

export function SmileyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="17.5" cy="20" r="2.5" fill="currentColor" />
      <circle cx="30.5" cy="20" r="2.5" fill="currentColor" />
      <path d="M15.5 28.5c2 3.5 5 5 8.5 5s6.5-1.5 8.5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PawIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <ellipse cx="12" cy="16" rx="5" ry="4.2" />
        <ellipse cx="5.5" cy="10.5" rx="2.1" ry="2.6" />
        <ellipse cx="9.3" cy="6.5" rx="2.1" ry="2.7" />
        <ellipse cx="14.7" cy="6.5" rx="2.1" ry="2.7" />
        <ellipse cx="18.5" cy="10.5" rx="2.1" ry="2.6" />
      </g>
    </svg>
  );
}

// Three short "burst" strokes, used beside the title, the button and the smiley.
export function BurstIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="4" y1="5" x2="10" y2="8" />
        <line x1="3" y1="12" x2="10" y2="12" />
        <line x1="4" y1="19" x2="10" y2="16" />
      </g>
    </svg>
  );
}
