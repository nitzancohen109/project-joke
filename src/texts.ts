// All UI strings, copied verbatim from the texts table in spec/DESIGN.md (section 1.1).
export const TEXTS = {
  title: 'בדיחה בלחיצה',
  topicLabel: 'על מה תרצו בדיחה?',
  topicPlaceholder: 'לדוגמה: חתולים, עבודה, טכנולוגיה...',
  generateButton: 'צור בדיחה',
  jokeHeading: 'הבדיחה שלך',
  emptyCard: 'הבדיחה תופיע כאן לאחר הלחיצה',
  // Status messages — used from Milestone 2/3 onward.
  loading: 'מכין לך בדיחה...',
  genericError: 'לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב.',
  topicTooLong: 'הנושא ארוך מדי. אפשר עד 100 תווים.',
  offline: 'נדרש חיבור לאינטרנט כדי ליצור בדיחה',
} as const;

export const TOPIC_MAX_LENGTH = 100;
