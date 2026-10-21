# תוכנית — Milestone 1: הקמת פרויקט ומסך ראשי

**מקורות:** `MILESTONES.md` (Milestone 1), `DESIGN.md` (1.1, 1.2, 2.x), `ARCHITECTURE.md` (1, 2.2, 2.3, 2.6, 3.1), `PRD.md` (FR-01, FR-03), והתמונות `wireframes.png`, `mockups.png`, `style-guide.png`.

**מטרה:** אתר מובייל מקומי שמציג את המסך היחיד "בדיחה בלחיצה" במלוא עיצובו — כותרת, שדה נושא עם מונה, כפתור "צור בדיחה" וכרטיס בדיחה במצב ריק — בלי חיבור ל-AI.

---

## 0. דרישות מוקדמות (לפני הבנייה)

| פריט | מצב נוכחי | מה עושים |
|---|---|---|
| **Node.js (LTS) + npm** | **לא מותקן במחשב** (`node` / `npm` לא נמצאו) | בעלת המוצר מתקינה את גרסת ה-LTS מ-nodejs.org (מתקין רגיל ל-Mac). בלי זה אי אפשר להתקין חבילות או להריץ את האתר. |
| תמונת חתלתול `spec/assets/kitten.png` | לא קיימת (גם התיקייה `spec/assets/` לא קיימת) | אופציונלי. אם לא תסופק עד הבנייה — משתמשים באיור זמני (סעיף 5) ומציינים זאת בסיכום. |
| מפתחות / חשבונות | לא נדרשים ב-Milestone הזה | אין `.env` ואין `.env.example` עדיין — הם נוצרים ב-Milestone 2 כשנוסף `OPENAI_API_KEY`. |

---

## 1. קבצים ליצירה

```text
/
├── package.json             # scripts: dev, build, preview
├── tsconfig.json            # references to app + node configs
├── tsconfig.app.json        # strict TS for src/
├── tsconfig.node.json       # TS for vite.config.ts
├── vite.config.ts           # React plugin only (PWA added in M3, API middleware in M2)
├── index.html               # <html lang="he" dir="rtl">, viewport meta, title
└── src/
    ├── main.tsx             # React root + font & CSS imports
    ├── App.tsx              # the single screen; holds `topic` state
    ├── styles/
    │   ├── tokens.css       # CSS variables: palette, type scale, radii, shadows, spacing
    │   └── app.css          # layout and component styles
    ├── components/
    │   ├── Header.tsx       # H1 + kitten (image or placeholder) + decorative hearts/sparkles
    │   ├── TopicField.tsx   # H2 label + input + counter "<n>/100"
    │   ├── GenerateButton.tsx
    │   ├── JokeCard.tsx     # "הבדיחה שלך" heading + card (empty state / text)
    │   └── icons.tsx        # small inline SVGs: heart, sparkle, smiley, paw (decorative)
    ├── assets/
    │   └── kitten-placeholder.svg   # temporary kitten face (used only if kitten.png is missing)
    ├── texts.ts             # all UI strings in one place (exact copy from DESIGN table)
    └── vite-env.d.ts
```

- תיקיית `api/` **לא** נוצרת עכשיו — היא שייכת ל-Milestone 2. מבנה ה-Repository (Frontend ב-`src/`, Backend בעתיד ב-`api/`) כבר מאפשר את זה.
- `.gitignore` כבר מכסה `node_modules/` ו-`dist/`; לא צפוי צורך בשורות חדשות. אם יופיע קובץ/תיקייה שנוצרים אוטומטית ולא מכוסים — מוסיפים שורה (לא מחליפים את הקובץ).
- עדכון `CLAUDE.md` בסוף הבנייה, בסעיף **פקודות הרצה**: `npm run dev` להרצה, ובדיקות: "אין".

## 2. חבילות

| חבילה | סוג | סיבה |
|---|---|---|
| `react`, `react-dom` | dependency | Frontend |
| `@fontsource/heebo`, `@fontsource/assistant` | dependency | גופנים כקבצים מקומיים (ARCHITECTURE 1, DESIGN 2.2) — משקלים 400 ו-700 בלבד |
| `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom` | devDependency | כלי בנייה ו-TypeScript |

לא מוסיפים: ספריית UI, ספריית CSS, ESLint/Prettier, ספריית בדיקות, `vite-plugin-pwa` (נכנס ב-M3), OpenAI SDK (נכנס ב-M2).

Scripts:
- `dev` → `vite`
- `build` → `tsc -b && vite build` (כך שגיאת TypeScript מכשילה את הבנייה — תנאי ב-DoD)
- `preview` → `vite preview`

## 3. מבנה המסך (מלמעלה למטה, לפי ה-Wireframe)

1. **Header** — רקע Blush Pink עם קצה תחתון מעוגל/גלי כמו ב-Mockup; H1 "בדיחה בלחיצה" ב-Charcoal, Heebo Bold 36px, ממורכז; קווקווי "ניצוץ" קטנים ב-Rose משני צידי הכותרת; תמונת החתלתול מתחת לכותרת; לבבות לבנים-שקופים כקישוט. **אין אייקון תפריט** (DESIGN 1.1).
2. **שדה נושא** — `<label htmlFor="topic">` מעוצב כ-H2 (24px Bold, ממורכז כמו ב-Mockup): "על מה תרצו בדיחה?". מתחתיו `<input id="topic" type="text" maxLength={100}>` ברקע לבן, מסגרת ורודה דקה, רדיוס ~20px, צל עדין, Placeholder "לדוגמה: חתולים, עבודה, טכנולוגיה...", טקסט מיושר לימין. אייקון כף ורוד בצד שמאל של השדה — קישוטי בלבד (`aria-hidden`, לא לחיץ, `pointer-events: none`).
3. **מונה תווים** — מתחת לשדה, Caption 14px, צבע Cocoa (על Cream — מותר), בפורמט `<n>/100`; מתעדכן בכל הקלדה. עם `aria-live="off"` כדי שלא יקריא כל הקשה.
4. **כפתור "צור בדיחה"** — רוחב מלא (או כמעט), צורת קפסולה, רקע Rose `#D13B6B` (מותר מעבר גוון עדין לגוון מעט בהיר יותר — בתנאי שהטקסט קריא), טקסט לבן Bold 18–20px, אייקון ניצוץ לבן, צל מפוזר; קווקווי ניצוץ דקורטיביים בצדדים (`aria-hidden`).
5. **אזור הבדיחה** — כותרת H2 "הבדיחה שלך" (מיושרת לימין, כמו ב-Wireframe), ואחריה כרטיס Pale Pink, רדיוס 24px, צל עדין.
   - **מצב ריק:** אייקון סמיילי ורוד (Rose) עם קווקווים סביבו + "הבדיחה תופיע כאן לאחר הלחיצה" בצבע Charcoal (לא Cocoa — כי הרקע Pale Pink, DESIGN 2.1), ממורכז; לבבות דקורטיביים בפינות.
   - **מצב עם טקסט** (תשתית ל-M2): `<p dir="auto">` בגופן Body 16px Charcoal, עם `white-space: pre-wrap` ו-`overflow-wrap: anywhere` — כך טקסט אנגלי מוצג LTR, וטקסט ארוך או מילה ארוכה בלי רווחים נשברים במקום לגרום לגלילה אופקית. הטקסט מוצג כ-Plain Text (לא `dangerouslySetInnerHTML`).

**שורת הסטטוס** (DESIGN 1.2) לא נבנית עכשיו — אין הודעות טעינה/שגיאה ב-M1. היא נכנסת ב-M2/M3.

## 4. טקסטים

כל המחרוזות מרוכזות ב-`src/texts.ts`, בנוסח המדויק מטבלת הטקסטים ב-DESIGN 1.1. ב-M1 מוצגים בפועל: כותרת, תווית, Placeholder, מונה, כפתור, "הבדיחה שלך", טקסט הכרטיס הריק. הודעות הטעינה/שגיאה/Offline נכתבות בקובץ כבר עכשיו (לשימוש בהמשך) אך לא מוצגות.

## 5. תמונת החתלתול

- **אם `spec/assets/kitten.png` קיים בזמן הבנייה:** להעתיק אותו ל-`src/assets/kitten.png` ולייבא משם (כך Vite יכלול אותו ב-Build, ובהמשך גם ב-Precache של ה-PWA). `alt=""` (קישוטי — הכותרת כבר אומרת הכול), רוחב תצוגה ~160–180px, ממורכז, "נשען" על קצה ה-Header כמו ב-Mockup.
- **אם לא קיים:** `src/assets/kitten-placeholder.svg` — פרצוף חתול מעוגל ופשוט בצבעי הפלטה (ראש Cream/Cocoa, אוזניים עם פנים Blush Pink, עיניים ואף Charcoal), באותו גודל ומיקום. החלפה עתידית = הוספת הקובץ ושינוי שורת ה-import אחת ב-`Header.tsx`.

## 6. עיצוב (CSS)

- **Tokens** (`tokens.css`) — כל הצבעים מ-DESIGN 2.1 כמשתנים (`--blush`, `--pale-pink`, `--cream`, `--charcoal`, `--cocoa`, `--white`, `--rose`), גדלי טיפוגרפיה (36/24/16/14), רדיוסים (16–24px, קפסולה = 999px), צללים רכים ומרווחים.
- **גופנים** — `main.tsx` מייבא את `@fontsource/heebo` 400/700 ו-`@fontsource/assistant` 400. `font-family: 'Heebo', 'Assistant', sans-serif`.
- **כיווניות** — `<html lang="he" dir="rtl">`. שימוש ב-CSS logical properties (`padding-inline`, `margin-inline-start`) במקום left/right כשאפשר.
- **פריסה** — עמודה אחת: `max-width: 480px; margin-inline: auto;` רקע `body` ב-Cream (בהדרגה עדינה ל-Pale Pink כמו ב-Mockup, לא מחייב). ריווח פנימי צדדי 20–24px.
- **מניעת גלילה אופקית** — `box-sizing: border-box` לכל האלמנטים, `img/svg { max-width: 100% }`, קישוטים עם מיקום אבסולוטי נשארים בתוך מכל עם `overflow: hidden` (ה-Header והכרטיס) — לא `overflow-x: hidden` על ה-body כדי לא להסתיר באגים.
- **viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`; גודל טקסט בשדה 16px לפחות כדי שאייפון לא יעשה זום אוטומטי בהקלדה.
- **נגישות** — Focus גלוי (outline Rose) לשדה ולכפתור; כל הקישוטים `aria-hidden="true"`.

## 7. התנהגות הכפתור ב-M1

לפי MILESTONES ("הכפתור יישאר לא פעיל ... עד לחיבור השירות"): הכפתור מוצג במראה הרגיל שלו (Rose, טקסט לבן — תנאי ב-DoD), אבל **אין לו פעולה** ב-M1 — לחיצה לא עושה דבר ולא מוצגת שום בדיחה. אין הצגת בדיחות מזויפות. החיבור ל-`/api/joke` מתווסף ב-M2.
(לא משתמשים במצב "מושבת" של DESIGN 1.2 — שקיפות 60% — כי הוא מיועד לזמן טעינה, ויסתור את דרישת הקריאות.)

## 8. בדיקת טקסט ארוך בשלב הפיתוח

כדי לבדוק שכרטיס הבדיחה מתמודד עם טקסט ארוך ו-LTR (DoD), מוסיפים מצב תצוגה **לפיתוח בלבד**, שפועל רק כשהאתר רץ ב-`npm run dev` (`import.meta.env.DEV`) ולא קיים ב-Build:
- `?preview=long-he` — טקסט בדיקה ארוך בעברית, שמתחיל במפורש ב-"[טקסט בדיקה]".
- `?preview=long-en` — טקסט בדיקה ארוך באנגלית (LTR), כולל מילה ארוכה מאוד בלי רווחים, שמתחיל ב-"[Test text]".

זה לא נראה כמו בדיחה ולא מתחזה לתוצאת GPT-5. בלי הפרמטר — הכרטיס תמיד במצב ריק.

## 9. בדיקות עצמיות (במהלך הבנייה)

1. `npm install` ו-`npm run build` — עוברים בלי שגיאות TypeScript.
2. `npm run dev` ופתיחה בדפדפן המובנה בגודל מובייל (375×812) ובגודל צר (320px).
3. השוואה חזותית מול ה-Mockup וה-Wireframe: ארבעת הרכיבים בסדר הנכון, אין תפריט.
4. השוואת כל טקסט מוצג מול טבלת DESIGN, מילה במילה.
5. הקלדת 100 תווים → מתקבלים, המונה מראה `100/100`; ניסיון להקליד/להדביק תו 101 → לא מתקבל. המונה מתעדכן בכל הקשה ומתאפס כשמוחקים.
6. `document.documentElement.scrollWidth <= window.innerWidth` במצב ריק וב-`?preview=long-he` / `?preview=long-en`; טקסט אנגלי מוצג משמאל לימין.
7. בדיקת ניגודיות הכפתור (לבן על Rose ≈ 4.6:1).
8. חיפוש בקוד וב-`dist/` אחרי מפתחות/סודות (`sk-`, `OPENAI`, `API_KEY`) — אין.
9. וידוא שמצב ה-preview לא קיים ב-`dist/` (חיפוש "[Test text]").
10. סגירת שרת הפיתוח בסיום.

## 10. מיפוי ל-Definition of Done

| תנאי | איך מתקיים / נבדק |
|---|---|
| מותקן, נבנה בלי שגיאות TS ונטען מקומית | סעיף 2 (`tsc -b` ב-build), בדיקות 1–2 |
| ארבעת הרכיבים במסך יחיד, דומה לעיצוב, בלי תפריט | סעיף 3, בדיקה 3 |
| כל הטקסטים תואמים לטבלה ב-DESIGN | סעיף 4, בדיקה 4 |
| עברית ו-RTL; 100 תווים כן, 101 לא; מונה מתעדכן | סעיפים 3, 6, בדיקה 5 |
| כפתור Rose עם טקסט לבן קריא | סעיפים 3, 7, בדיקה 7 |
| אין גלילה אופקית; אפשר לבדוק טקסט ארוך | סעיפים 6, 8, בדיקה 6 |
| אין מפתחות או סודות בקוד או ב-Repository | אין `.env` ב-M1; בדיקה 8 |

## 11. בסיום הבנייה

- סימון 🟡 ליד כותרת Milestone 1 ב-`MILESTONES.md`.
- עדכון **פקודות הרצה** ב-`CLAUDE.md`.
- ADR רק אם התקבלה החלטה טכנית משמעותית שלא מופיעה כאן.
- בלי commit.
