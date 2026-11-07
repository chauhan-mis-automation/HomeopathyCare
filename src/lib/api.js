/**
 * Google Sheet API (Apps Script Web App) ko form data bhejta hai.
 * .env file mein VITE_SHEET_API = aapka Apps Script /exec URL
 *
 * Content-Type "text/plain" jaan-boojh kar rakha hai: isse browser CORS
 * "preflight" request nahi bhejta, jo Apps Script support nahi karta.
 */
const API_URL = import.meta.env.VITE_SHEET_API;

export async function submitLead(payload) {
  if (!API_URL) {
    // URL set nahi hai → demo mode (local testing ke liye)
    console.warn('VITE_SHEET_API set nahi hai — demo mode, data Sheet mein nahi jaayega.');
    await new Promise((r) => setTimeout(r, 800));
    return { ok: true, id: 'AH-DEMO-0001', demo: true };
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Network error (' + res.status + ')');
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Server error');
  return data;
}
