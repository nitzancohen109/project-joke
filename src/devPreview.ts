// Dev-only layout check for the joke card: ?preview=long-he or ?preview=long-en.
// Guarded by import.meta.env.DEV, so the sample text is stripped from production builds.
export function getDevPreviewJoke(): string | null {
  if (!import.meta.env.DEV) return null;

  const preview = new URLSearchParams(window.location.search).get('preview');
  if (preview === 'long-he') {
    return (
      '[טקסט בדיקה] זהו טקסט ארוך שנועד רק לבדוק שהכרטיס מתמודד עם תוכן ארוך בלי לגלוש לצדדים. ' +
      'הוא חוזר על עצמו כמה פעמים כדי למלא את הכרטיס. '.repeat(8) +
      '\nשורה חדשה לבדיקת מעברי שורה.'
    );
  }
  if (preview === 'long-en') {
    return (
      '[Test text] This is a long English sample used only to check left-to-right layout in the card. ' +
      'It repeats a few times to fill the card. '.repeat(6) +
      'Averyveryverylongwordwithoutanyspacesthatmustwrapinsteadofcausinghorizontalscrolling.'
    );
  }
  return null;
}
