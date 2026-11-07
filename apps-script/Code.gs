/**
 * Aarogya Homeo — Google Sheet API (React website ke liye)
 * React app is URL par form data POST karta hai, ye script use Sheet mein likhta hai.
 *
 * SETUP:
 * 1. Nayi Google Sheet banayein → Extensions → Apps Script
 * 2. Ye poora code Code.gs mein paste karein → Save
 * 3. Function dropdown se "setup" chunein → Run → permission Allow karein
 * 4. Deploy → New deployment → type: Web app
 *      Execute as: Me   |   Who has access: Anyone
 * 5. Jo /exec URL mile, use React project ki .env file mein daalein:
 *      VITE_SHEET_API=https://script.google.com/macros/s/.../exec
 *
 * Code badalne ke baad: Deploy → Manage deployments → ✏️ → Version: New version → Deploy
 * (isse URL wahi rehta hai)
 */

// Script Sheet ke andar se bana hai to khali chhodein; alag script ho to Sheet ID daalein
const SPREADSHEET_ID = '';
const SHEET_NAME = 'Leads';
const HEADERS = [
  'Timestamp', 'Lead ID', 'Name', 'Phone', 'Email', 'City', 'Age',
  'Concern', 'Plan', 'Consult Mode', 'Message', 'Preferred Doctor', 'Language', 'Source'
];
// Naya lead aane par email chahiye to apna email daalein
const NOTIFY_EMAIL = '';

/** React app yahan form bhejta hai */
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return json_(saveLead(data));
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/** Browser mein URL kholne par status dikhata hai (test ke liye) */
function doGet() {
  return json_({ ok: true, service: 'Aarogya Homeo Leads API', time: new Date().toISOString() });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastColumn() < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#0f766e').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Text saaf karta hai + formula injection (=, +, -, @) se bachata hai */
function clean_(value, maxLen) {
  let s = String(value == null ? '' : value).trim().slice(0, maxLen || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function saveLead(data) {
  data = data || {};
  if (data.website) return { ok: true, id: 'OK' }; // honeypot — bots

  const name = clean_(data.name, 80);
  const phone = String(data.phone || '').replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  const email = clean_(data.email, 120);

  if (name.length < 2) throw new Error('Kripya apna sahi naam likhein.');
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('Kripya 10 ankon ka sahi mobile number daalein.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email sahi nahi lag raha.');

  // Ek hi number se 2 minute mein dobara form → duplicate na bane
  const cache = CacheService.getScriptCache();
  const dupKey = 'lead_' + phone;
  const prev = cache.get(dupKey);
  if (prev) return { ok: true, id: prev, duplicate: true };

  const id = 'AH-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
  const row = [
    new Date(), id, name, "'" + phone, email,
    clean_(data.city, 60), clean_(data.age, 3), clean_(data.concern, 60), clean_(data.plan, 40),
    clean_(data.mode, 20), clean_(data.message, 1000), clean_(data.doctor, 60),
    clean_(data.lang, 4), clean_(data.source, 80)
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { getSheet_().appendRow(row); } finally { lock.releaseLock(); }
  cache.put(dupKey, id, 120);

  if (NOTIFY_EMAIL) {
    try {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Naya Lead: ' + name + ' (' + id + ')',
        HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n'));
    } catch (err) { console.warn(err); }
  }
  return { ok: true, id: id };
}

/** Ek baar Run karein: permission milegi aur "Leads" sheet ban jaayegi */
function setup() { getSheet_(); }
