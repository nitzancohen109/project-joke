# Milestone 3 — חוויית שימוש שלמה והפעלת PWA

**מקורות:** MILESTONES (Milestone 3), PRD FR-04/FR-05, ARCHITECTURE 2.3, 2.4, 2.5, 2.6, 2.7, DESIGN 1.2, 2.4.1.

## מצב נוכחי (נקודת פתיחה)
- `src/App.tsx`: נעילה פנימית בלבד (`useRef`) בלי חיווי; בכשל לא קורה כלום (ADR-3).
- `src/api.ts`: מחזיר רק `ok: true/false`, בלי הבחנה בין Offline/שגיאה ובלי Timeout.
- `src/texts.ts`: כל הודעות המצבים כבר קיימות (`loading`, `genericError`, `topicTooLong`, `offline`).
- אין `vite-plugin-pwa`, אין תיקיית `public/`, אין אייקונים.
- `spec/assets/kitten.png` עדיין לא סופק → האייקונים יהיו האייקון הזמני מ-DESIGN 2.4.1 (עיגול Blush Pink עם לב Rose, בלי טקסט). התמונה בכותרת נשארת האיור הזמני.

## חלק א — מצבי המסך (DESIGN 1.2)

### `src/api.ts` — הבחנה בין תוצאות
החלפת הטיפוס ל:
```ts
type JokeResult =
  | { kind: 'success'; joke: string }
  | { kind: 'offline' }
  | { kind: 'topicTooLong' }
  | { kind: 'error' };
```
לפי כלל ההבחנה ב-ARCHITECTURE 2.6:
1. `navigator.onLine === false` לפני השליחה → `offline`, בלי לשלוח בקשה.
2. `AbortController` עם `setTimeout` של `CLIENT_TIMEOUT_MS = 30_000`; Abort → `error` (לא offline).
3. `fetch` שנזרק בלי תשובה (TypeError, לא Abort) → `offline`.
4. סטטוס `400` → `topicTooLong`; כל סטטוס אחר שאינו `200`, או JSON לא תקין / `joke` ריק → `error`.
5. ה-Timeout מכסה גם את קריאת גוף התשובה (`res.json()`); `clearTimeout` ב-`finally`.
6. אין Retry אוטומטי. ממשיכים עם `cache: 'no-store'`.

### `src/App.tsx` — ניהול מצב
- `status: 'idle' | 'loading' | 'success' | 'error' | 'offline'` ו-`errorMessage: string | null` (ARCHITECTURE 2.3).
- הנעילה ב-`useRef` נשארת (מגן גם מפני שתי לחיצות באותו Frame לפני שה-State מתעדכן), ובנוסף הכפתור מקבל `disabled` כש-`status === 'loading'`.
- בלחיצה: `loading` (שורת הסטטוס מתחלפת להודעת טעינה). בהצלחה: מחליפים בדיחה, `success`, אין הודעה. בכשל: `error`/`offline` עם ההודעה המתאימה מ-`TEXTS`; הבדיחה הקודמת והנושא לא משתנים.
- `topicTooLong` מוצג עם `TEXTS.topicTooLong` (מצב `error`).

### רכיב חדש `src/components/StatusLine.tsx`
- ממוקם בין `GenerateButton` ל-`JokeCard`.
- עטיפה עם `role="status"` ו-`aria-live="polite"` שתמיד קיימת ב-DOM (כדי שקוראי מסך יכריזו), אבל בלי תוכן ובלי גובה כשאין הודעה (`:empty` / ללא margin).
- טעינה: הטקסט "מכין לך בדיחה" + שלוש נקודות מונפשות עדינות (CSS בלבד; `prefers-reduced-motion` → נקודות סטטיות). הטקסט הנגיש נשאר "מכין לך בדיחה...".
- שגיאה/Offline: "גלולה" — רקע לבן, מסגרת Rose דקה, טקסט Charcoal, פינות Pill.
- הסרת `aria-live` מכרטיס הבדיחה? — לא: הכרטיס נשאר `aria-live="polite"` כדי שהבדיחה החדשה תוקרא (ARCHITECTURE 2.6).

### `src/components/GenerateButton.tsx` + CSS
- Prop חדש `disabled`. מצב מושבת: `opacity: 0.6`, `box-shadow: none`, `cursor: default` (DESIGN 1.2).

### בדיחות ארוכות וגלילה
- אין גובה מקסימלי לכרטיס — העמוד גולל. וידוא `overflow-x` תקין ו-padding תחתון (כולל `env(safe-area-inset-bottom)`) כדי שסוף בדיחה ארוכה לא ייחתך במכשיר עם פס בית.
- בדיקה עם `?preview=long-he` / `?preview=long-en` (קיים מ-Milestone 1).

## חלק ב — PWA (ARCHITECTURE 2.7)

### תלויות (devDependencies)
- `vite-plugin-pwa` — Manifest + Service Worker (Workbox).
- `@vite-pwa/assets-generator` — הפקה חד-פעמית של אייקוני PNG מקובץ SVG. הקבצים שנוצרים נשמרים ב-`public/` ונכנסים ל-Repository; לא רץ בכל Build.

### אייקונים — `public/`
- `public/icon.svg`: מקור — עיגול Blush Pink `#F7AEB8` עם לב Rose `#D13B6B` במרכז, בלי טקסט.
- נוצרים ממנו: `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png` (לב בתוך אזור בטוח, רקע Blush Pink מלא), `apple-touch-icon-180x180.png`, `favicon.ico`.
- סקריפט `npm run generate-icons` ב-`package.json` + קובץ `pwa-assets.config.ts`, כדי שאפשר יהיה להפיק מחדש כשתגיע תמונת החתלתול.

### `vite.config.ts` — הוספת `VitePWA`
- `registerType: 'prompt'` בלי להציג הודעה למשתמש: גרסה חדשה של ה-Service Worker ממתינה ונכנסת לפעולה רק אחרי שכל חלונות האפליקציה נסגרו — כך קבצים לא מוחלפים באמצע בקשה פעילה (ARCHITECTURE 2.7), ואין צורך ב-UI של "יש עדכון" (שאסור לפי PRD — מסך יחיד בלי הודעות נוספות). `injectRegister: 'auto'`.
- `manifest`: `name`/`short_name` "בדיחה בלחיצה", `lang: 'he'`, `dir: 'rtl'`, `display: 'standalone'`, `start_url: '/'`, `scope: '/'`, `theme_color: '#F7AEB8'`, `background_color: '#FFF4ED'`, אייקונים 192/512 + maskable.
- `workbox`:
  - `globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}']` — כולל גופני Heebo/Assistant ואיור החתלתול.
  - `navigateFallback: '/index.html'` + `navigateFallbackDenylist: [/^\/api\//]`.
  - **בלי `runtimeCaching`** — שום בקשת `/api/*` לא נשמרת במטמון (וממילא זו בקשת POST).
- `index.html`: הוספת `<link rel="icon">` ו-`<link rel="apple-touch-icon">`, ו-`<meta name="apple-mobile-web-app-title">`.
- הסרת ההערה "PWA plugin is added in Milestone 3".

### הגבלת הגופנים ל-Precache
`@fontsource` מייצר קובצי גופן לכל ה-Subsets (כולל קירילית/וייטנאמית). אם הגודל מכביד — לייבא רק את ה-Subsets `hebrew` ו-`latin` (למשל `@fontsource/heebo/hebrew-400.css` + `latin-400.css`). זה שינוי ייבוא בלבד, בלי שינוי במראה.

### `.gitignore`
- הוספת `dev-dist/` (אם ייווצר), אחרת אין שינוי.

## חלק ג — ADRs שיתווספו ל-ARCHITECTURE.md
- **ADR-4: עדכון Service Worker בלי הודעה** — `registerType: 'prompt'` ללא UI; גרסה חדשה נכנסת לתוקף בפתיחה הבאה אחרי סגירת כל החלונות. השלכה: אחרי Push, ייתכן שצריך לסגור ולפתוח את האפליקציה פעמיים כדי לראות את הגרסה החדשה.
- **ADR-5: אייקונים מוכנים מראש מ-SVG** — הפקה עם `@vite-pwa/assets-generator` ושמירה ב-`public/`; אייקון זמני עד לתמונת החתלתול.
- ADR-3 יעודכן בהערה שהוא הוחלף במימוש של Milestone 3 (רק הוספת שורת "עודכן", בלי מחיקה).

## חלק ד — בדיקות (Claude, לפני 🟡)
1. `npm run build` — ללא שגיאות TypeScript; קיימים `dist/sw.js` ו-`dist/manifest.webmanifest`; ב-Precache יש גופנים, איור חתלתול ואייקונים, ואין `/api`.
2. `npm run dev` בדפדפן במצב מובייל:
   - טעינה: לחיצה → "מכין לך בדיחה..." גלוי, הכפתור מושבת (opacity 0.6), לחיצה נוספת לא שולחת בקשה (בדיקה ב-Network) → בסיום הכפתור חוזר.
   - שגיאת שרת: הדמיה (החלפה זמנית של `fetch` מתוך כלי הבדיקה בדפדפן כך שיחזיר 502) → הודעה כללית, בדיחה קודמת ונושא נשארים, ניסיון חוזר מצליח.
   - 400 → "הנושא ארוך מדי...".
   - Timeout: `fetch` שלא חוזר → אחרי 30 שניות הודעה כללית.
   - Offline: `navigator.onLine=false` / `fetch` שנזרק → "נדרש חיבור לאינטרנט כדי ליצור בדיחה".
   - טקסט ארוך (`?preview=long-he`, `?preview=long-en`): גלילה אנכית, בלי גלילה אופקית, ב-375px.
3. `npm run build && npm run preview` (Service Worker פעיל רק ב-Build):
   - Manifest תקין, Service Worker רשום, מטמון מכיל את קובצי המעטפת.
   - ניתוק רשת → רענון → המסך נטען עם הגופנים והאיור; לחיצה → הודעת Offline, בלי בקשה.
   - אין רשומת `/api/joke` ב-Cache Storage.
   - הערה: שרת ה-preview לא מריץ את `/api/joke` (ה-Middleware הוא לפיתוח בלבד) — יצירת בדיחה נבדקת ב-`npm run dev`.
4. סגירת כל השרתים בסיום.

## חלק ה — בדיקה בטלפון (אחרי הבדיקות המקומיות)
התקנה ו-Offline אמיתיים אפשר לבדוק רק ב-HTTPS. אחרי 🟡 Claude עוצר ומבקש אישור ל-Push ל-`main` (לפי MILESTONES ו-CLAUDE.md). אחרי הפריסה — הדרכה צעד אחר צעד לבדיקה ב-Android (חלונית התקנה של Chrome) וב-iPhone (שיתוף ← הוספה למסך הבית), כולל פתיחה במצב טיסה.

## מחוץ לטווח
- כפתור/הודעת "התקן" או "יש עדכון" (PRD Out of Scope).
- שמירת בדיחות/נושא ב-localStorage או ב-Cache.
- כותרות אבטחה ו-CSP — Milestone 4.
- החלפת האיור הזמני בתמונת חתלתול — רק כשהקובץ יסופק.

## קבצים — סיכום
| קובץ | פעולה |
|---|---|
| `src/api.ts` | שינוי: תוצאות מובחנות, Timeout 30 שניות, זיהוי Offline |
| `src/App.tsx` | שינוי: `status` / `errorMessage`, חיבור לשורת הסטטוס ולכפתור |
| `src/components/StatusLine.tsx` | חדש |
| `src/components/GenerateButton.tsx` | שינוי: `disabled` |
| `src/styles/app.css` | שינוי: שורת סטטוס, גלולה, נקודות מונפשות, כפתור מושבת, safe-area תחתון |
| `src/main.tsx` | אולי: צמצום Subsets של גופנים |
| `vite.config.ts` | שינוי: `VitePWA` |
| `index.html` | שינוי: קישורי אייקונים |
| `public/icon.svg` + PNGs + `favicon.ico` | חדש |
| `pwa-assets.config.ts` | חדש |
| `package.json` | שינוי: 2 devDependencies + סקריפט `generate-icons` |
| `spec/ARCHITECTURE.md` | הוספת ADR-4, ADR-5 |
| `spec/MILESTONES.md` | 🟡 בסיום הבנייה |
