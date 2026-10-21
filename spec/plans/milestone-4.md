# תוכנית — Milestone 4: בדיקות קבלה סופיות ב-Production

**מקורות:** `MILESTONES.md` (Milestone 4), `ARCHITECTURE.md` 2.4–2.8 ו-3.2, `PRD.md`.
**מצב קיים:** האפליקציה פרוסה ב-Vercel מ-`main` (Milestones 1–3 אושרו). `vercel.json` כבר מגדיר `maxDuration: 30` ל-`api/joke.ts`.

## 1. קבצים שישתנו

| קובץ | שינוי |
|---|---|
| `vercel.json` | הוספת `headers` עם כותרות האבטחה לכל הנתיבים. `functions` נשאר כפי שהוא. |
| `vite.config.ts` | `preview.headers` שנקרא מתוך `vercel.json` — כך ש-`npm run preview` מקומי מחיל את אותן כותרות, ואפשר לבדוק את ה-CSP לפני פריסה. מקור אחד לכותרות, בלי כפילות. |
| `spec/MILESTONES.md` | סימון 🟡 בסיום הבנייה. |
| `spec/plans/milestone-4.md` | הוספת סעיף "תוצאות בדיקות קבלה" בסוף הבדיקות (כולל מגבלות iPhone שנצפו בפועל). |

אין שינוי בקוד ה-React, ב-API או בלוגיקת יצירת הבדיחה. אין Rate Limiting (PRD).

## 2. כותרות אבטחה (ARCHITECTURE 2.8)

ב-`vercel.json`, `source: "/(.*)"`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`:
  ```
  default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
  font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self';
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  ```

עקרונות:
- הכול מאותו Origin: אין Google Fonts, אין CDN, וה-API ב-`/api/joke` באותו Domain — לכן `'self'` מספיק.
- `worker-src 'self'` ו-`script-src 'self'` מאפשרים את `sw.js` ואת `registerSW.js` (קובץ חיצוני, לא Inline). זו הדרישה "CSP שאינה חוסמת את ה-Service Worker".
- `data:` בתמונות ובגופנים — רק כי Vite עשוי להטמיע קבצים קטנים (למשל ה-SVG של החתלתול) כ-`data:`. בבנייה בודקים בפועל; אם אין `data:` ב-`dist` — מסירים אותו.
- בבנייה בודקים שב-`dist/index.html` אין `<script>` או `<style>` Inline ושאין `style=` בקוד. אם יימצא — מתקנים את המקור, לא מוסיפים `'unsafe-inline'`.
- הכותרות חלות גם על תגובות `/api/joke`; `Cache-Control: no-store` של ה-API נשאר כפי שהוא.

## 3. Function: `maxDuration` ו-Node.js Runtime

- `maxDuration: 30` קיים — רק מוודאים.
- `api/joke.ts` אינו מצהיר על Edge, ולכן Vercel מריץ אותו ב-Node.js (ברירת המחדל). מוודאים זאת גם בלוח הבקרה של Vercel (Function → Runtime) אחרי הפריסה. אין צורך בשינוי קוד.

## 4. בדיקות מקומיות (לפני Push)

1. `npm run build` — ללא שגיאות.
2. סריקת `dist`: אין Inline scripts/styles; אין `OPENAI_API_KEY`, אין `sk-` ואין `api.openai.com` ב-JS של ה-Frontend.
3. `git grep` ב-Repository: אין מפתח (`sk-`) ואין `.env` במעקב.
4. `npm run preview` (http://localhost:4173) בדפדפן המובנה: כותרות האבטחה מופיעות בתגובה; אין שגיאות CSP בקונסול; ה-Service Worker נרשם; טעינה Offline אחרי טעינה ראשונה עובדת עם הגופנים והתמונה.
5. `npm run dev` — יצירת בדיחה עדיין עובדת (בדיקה אחת או שתיים, כדי לחסוך בעלויות).

## 5. Push לבדיקה ב-Production

כותרות Vercel והתנהגות הטלפון אפשר לבדוק רק בכתובת ה-HTTPS. לכן, אחרי שהבדיקות המקומיות עוברות: מסמנים 🟡, **עוצרים ומבקשים אישור Push** (CLAUDE.md). ה-Push הזה הוא לצורך הבדיקה — ה-✅ ניתן רק אחרי שבעלת המוצר מאשרת את תוצאות הבדיקות בטלפונים. בשלב הזה מבקשים גם את כתובת ה-Vercel של Production (אם אינה ידועה).

## 6. בדיקות ב-Production שמבצע Claude

כנגד כתובת ה-Vercel (בעזרת `curl` ובדפדפן המובנה):

- **פריסה אוטומטית:** ה-Push יצר Deployment חדש בלי פעולה ידנית (הכותרות החדשות מופיעות).
- **כותרות:** קיימות ב-`/`, ב-`/sw.js` וב-`/api/joke`.
- **דף ו-Service Worker:** המסך נטען, אין שגיאות CSP, ה-Service Worker פעיל, `/` נפתח Offline לאחר טעינה.
- **API באותו Origin:**
  - נושא ריק / רווחים → `200`, בדיחה בעברית.
  - נושא בעברית → עברית; נושא באנגלית (משפט) → אנגלית; "iPhone" → עברית.
  - נושא בלתי הולם → בדיחה נקייה, לא סירוב.
  - 101 תווים → `400`; JSON שבור → `400`; גוף גדול → `413`; `GET` → `405`.
  - כל התגובות עם `Cache-Control: no-store`; אין מפתח בתגובות.
- **אין חשיפת מפתח:** סריקת ה-JS שהדפדפן מוריד מ-Production.

כל בקשת יצירה עולה כסף, ולכן מריצים כל בדיקה פעם אחת בלבד (כ-6–8 בדיחות בסך הכול).

## 7. בדיקות שמבצעת בעלת המוצר בטלפונים

Claude ייתן רשימת בדיקה פשוטה, צעד אחר צעד, ל-Chrome ב-Android ו-Chrome ב-iPhone:
- המסך בעברית ומימין לשמאל, בלי גלילה הצידה.
- יצירת בדיחה עם נושא ובלי נושא; לחיצה נוספת מחליפה את הבדיחה.
- מצב טיסה: ניסיון יצירה מציג "נדרש חיבור לאינטרנט כדי ליצור בדיחה".
- התקנה: Android — "התקן אפליקציה"; iPhone — שיתוף ← "הוספה למסך הבית" (אם Chrome ב-iOS מציע זאת).
- פתיחת האפליקציה המותקנת במצב טיסה: המסך נפתח עם הגופנים והתמונה.

את התוצאות (כולל מה לא עבד ב-iPhone ולמה) Claude מתעד בסוף הקובץ הזה.

## 8. עלויות ואישורים תפעוליים

- בעלת המוצר מאשרת שתקרת ההוצאה החודשית והתראת התקציב מוגדרות בחשבון OpenAI.
- Claude מבהיר בשפה פשוטה: כל בדיחה עולה כסף ב-OpenAI; האתר פתוח לכולם ללא מכסה, כך שכל אחד יכול לצרוך מהתקציב עד לתקרה (ואז מוצגת הודעת השגיאה הכללית); שימוש ב-Vercel עלול להיות כרוך בחיובים מעבר למכסות; Vercel Hobby מיועד לשימוש אישי לא מסחרי בלבד.

## 9. Definition of Done — איך כל תנאי נבדק

| תנאי | איך נבדק |
|---|---|
| HTTPS, מסך יחיד, API באותו Origin | סעיף 6 |
| בדיקות Milestones 1–3 עוברות ב-Production | סעיפים 6–7 |
| כותרות אבטחה, האפליקציה וה-SW עובדים | סעיפים 4 ו-6 |
| אין חשיפת `OPENAI_API_KEY` | סעיפים 4 ו-6; בעלת המוצר מאשרת שהמפתח מוגדר ב-Vercel |
| Push מוביל ל-Deployment אוטומטי | סעיף 6 |
| התקנה ו-Offline נבדקו, מגבלות iPhone תועדו | סעיף 7 |
| תקרת הוצאה, התראה והבהרת עלויות | סעיף 8 |
