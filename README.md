# Aarogya Homeo — React Website + Google Sheet

React (Vite) website. Har form ka data aapki Google Sheet mein save hota hai,
jahan Apps Script ek chhote API ki tarah kaam karta hai.

```
React website  ──POST (JSON)──▶  Apps Script Web App  ──▶  Google Sheet ("Leads" tab)
```

## 1. Google Sheet + API (5 minute)

1. Nayi Google Sheet banayein → **Extensions → Apps Script**
2. `apps-script/Code.gs` ka poora code paste karein → Save
3. Upar function dropdown se **`setup`** chunein → **Run** → permission **Allow** karein
   ("Google hasn't verified this app" aaye to → *Advanced* → *Go to … (unsafe)* → Allow; ye aapki apni script hai)
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Jo `/exec` URL mile, use copy karein. Browser mein kholne par `{"ok":true,...}` dikhna chahiye.

> Code.gs badalne ke baad hamesha: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**
> (isse URL wahi rehta hai)

## 2. React project chalayein

Computer par [Node.js](https://nodejs.org) (v18 ya naya) hona chahiye.

```bash
npm install
cp .env.example .env        # Windows par: copy .env.example .env
# .env kholein aur VITE_SHEET_API = apna /exec URL daalein
npm run dev                 # http://localhost:5173 par site khulegi
```

`.env` mein URL na ho to site **demo mode** mein chalti hai: form "success" dikhata hai, par data Sheet mein nahi jaata.

## 3. Live karein (free hosting)

**Vercel** (aasaan): GitHub par code daalein → vercel.com → *New Project* → repo chunein →
*Environment Variables* mein `VITE_SHEET_API` daalein → Deploy. (`vercel.json` pehle se hai.)

**Netlify**: `npm run build` → `dist` folder ko app.netlify.com par drag-drop karein.
Pehle `.env` mein URL daal kar hi build karein. (`public/_redirects` pehle se hai.)

Dono par apna domain (jaise `aarogyahomeo.in`) muft jod sakte hain.

## Content kahan badlein

| Kya badalna hai | File |
|---|---|
| Phone, WhatsApp, email, plans, steps, tips, FAQ | `src/data/site.js` |
| Departments, doctors, bimariyan (poora content) | `src/data/content.js` |
| Buttons, headings, form labels (Hindi/English) | `src/data/strings.js` |
| Rang, font, animation | `src/styles.css` |

- **Doctor ki photo:** `content.js` mein doctor ke `photo:` mein image link daalein (ya photo `public/doctors/` mein rakh kar `"/doctors/neha.jpg"` likhein).
- **Nayi bimari:** `content.js` mein kisi bimari ki entry copy karke `id` aur content badlein. Sirf `id, dept, i, t, d, intro` zaroori hain; `types, keys, what, forms, facts, symptoms, fsym, care, faq` optional hain.

## Pages

| URL | Page |
|---|---|
| `/` | Home (hero, departments, process, doctors, plans, tips, FAQ, form) |
| `/conditions` | Saare departments + search (`?dept=skin`, `?q=piles`) |
| `/conditions/acne` | Bimari ka detail page + side form |
| `/doctors/neha` | Doctor profile |

## Sheet ke columns

Timestamp · Lead ID · Name · Phone · Email · City · Age · Concern · Plan · Consult Mode · Message · Preferred Doctor · Language · Source

Ek hi number se 2 minute ke andar dobara form aaye to nayi row nahi banti (duplicate se bachav).
Naye lead par email chahiye to `Code.gs` mein `NOTIFY_EMAIL` mein apna email daalein.
