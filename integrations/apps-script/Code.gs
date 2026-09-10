/** La Rose static-site form capture and token-gated lead administration. */
var SHEET_ID = '1fwL5rMeMLgUs2v9UHWu9c-PCeWtmfBW_YpZTG3RGbAI';
var SHEET_NAME = 'Sheet1';
var COLUMNS = [
  'Timestamp', 'Source', 'Name', 'Phone', 'Specialty', 'Doctor', 'Branch',
  'Preferred day', 'Preferred time', 'Message', 'Language', 'Page URL',
  'Status', 'Notes', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM content',
  'UTM term', 'Click ID', 'Landing page', 'Referrer', 'Device', 'First touch'
];
var ACCEPTED = [
  'source', 'name', 'phone', 'specialty', 'doctor', 'branch', 'preferredDay',
  'preferredTime', 'message', 'language', 'pageUrl', 'utmSource', 'utmMedium',
  'utmCampaign', 'utmContent', 'utmTerm', 'clickId', 'landingPage', 'referrer',
  'device', 'firstTouchSource'
];
var MAX_FIELD = 2000;
var PER_PHONE_PER_HOUR = 5;   // one person re-sending a form a few times is fine
/* The global cap exists to stop the sheet being flooded, and it is deliberately
   set far higher than the clinic will ever see in an hour. It used to be 120,
   which was low enough that a trivial script could exhaust it and every real
   patient for the rest of that hour got "try again later". That trade is the
   wrong way round: a flooded sheet is a few deleted rows, a refused booking is
   a lost patient who does not come back. Apps Script cannot see the caller's IP,
   so no cap can tell the two apart - given that, err towards accepting. */
var PER_HOUR_TOTAL = 600;
var FAILED_AUTH_PER_HOUR = 10;  // a token is pasted once; ten wrong tries in an hour is abuse

/* Sliding one-hour counters in the script cache (no sheet writes, no quota
   cost). Returns false once the key has hit its cap for this hour. */
function underLimit_(key, cap) {
  try {
    var cache = CacheService.getScriptCache();
    var id = 'rl:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(key), Utilities.Charset.UTF_8)).slice(0, 22);
    var count = Number(cache.get(id) || 0) + 1;
    cache.put(id, String(count), 3600);
    return count <= cap;
  } catch (err) { return true; } // cache trouble must never block a real patient
}

function json_(obj, callback) {
  var body = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][\w.$]*$/.test(callback)) return ContentService.createTextOutput(callback + '(' + body + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
function clean_(value) {
  if (value === null || value === undefined) return '';
  var s = String(value).replace(/[\x00-\x1f\x7f]/g, ' ').trim();
  return s.length > MAX_FIELD ? s.slice(0, MAX_FIELD) : s;
}
function sheet_() { var book = SpreadsheetApp.openById(SHEET_ID); return book.getSheetByName(SHEET_NAME) || book.getSheets()[0]; }
function ensureHeaders_(sheet) {
  var lastColumn = sheet.getLastColumn();
  if (!lastColumn || sheet.getLastRow() === 0) { sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]); return COLUMNS.slice(); }
  var headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  if (headers.every(function (h) { return !h; })) { sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]); return COLUMNS.slice(); }
  COLUMNS.forEach(function (header) { if (headers.indexOf(header) === -1) headers.push(header); });
  if (headers.length > lastColumn) sheet.getRange(1, lastColumn + 1, 1, headers.length - lastColumn).setValues([headers.slice(lastColumn)]);
  return headers;
}
/* Wrong tokens are slowed down, not locked out. authorised_ runs before every
   other check, so without this the one secret guarding every lead could be
   guessed as fast as Apps Script will answer. A lockout is the wrong tool here:
   Apps Script never sees the caller's IP, so "too many failures" would let
   anyone shut the clinic out of its own leads. Waiting instead costs a person
   who mistypes one second and caps a guessing script at a handful of tries an
   hour. A correct token never reaches the sleep. */
function authorised_(token) {
  var expected = PropertiesService.getScriptProperties().getProperty('READ_TOKEN') || '';
  if (expected && clean_(token) === expected) return true;
  Utilities.sleep(underLimit_('auth', FAILED_AUTH_PER_HOUR) ? 1000 : 5000);
  return false;
}
function stringValue_(value) {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime()) ? value.toISOString() : String(value === null || value === undefined ? '' : value).replace(/^'(\+?\d)/, '$1');
}

function leads_(sinceText, callback) {
  var sheet = sheet_();
  var headers = ensureHeaders_(sheet);
  var values = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];
  var since = sinceText ? new Date(sinceText) : null;
  if (since && !isNaN(since.getTime())) values = values.filter(function (row) { var d = new Date(row[0]); return !isNaN(d.getTime()) && d >= since; });
  var rows = values.map(function (row) { return row.map(stringValue_); });
  return json_({ ok: true, headers: headers, rows: rows, updatedAt: rows.length ? rows[rows.length - 1][0] : '' }, callback);
}

function doGet(e) {
  var p = e && e.parameter || {};
  if (p.action !== 'leads') return json_({ ok: true, service: 'larose-forms' });
  // Kept for older dashboards; the current dashboard sends the token in a
  // POST body instead so it never sits in a URL (browser history, logs).
  if (!authorised_(p.token)) return json_({ ok: false, error: 'unauthorised' }, p.callback);
  return leads_(p.since, p.callback);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ ok: false, error: 'empty body' });
    var payload;
    try { payload = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'invalid JSON' }); }
    if (payload.action === 'leads') {
      if (!authorised_(payload.token)) return json_({ ok: false, error: 'unauthorised' });
      return leads_(payload.since);
    }
    lock.waitLock(20000);
    var sheet = sheet_();
    var headers = ensureHeaders_(sheet);
    if (payload.action === 'updateStatus') {
      if (!authorised_(payload.token)) return json_({ ok: false, error: 'unauthorised' });
      var rowNumber = Number(payload.row);
      if (!Number.isInteger(rowNumber) || rowNumber < 2 || rowNumber > sheet.getLastRow()) return json_({ ok: false, error: 'invalid row' });
      var statusColumn = headers.indexOf('Status') + 1, notesColumn = headers.indexOf('Notes') + 1;
      if (!statusColumn || !notesColumn) return json_({ ok: false, error: 'missing columns' });
      sheet.getRange(rowNumber, statusColumn).setValue(clean_(payload.status));
      sheet.getRange(rowNumber, notesColumn).setValue(clean_(payload.notes));
      return json_({ ok: true });
    }
    var data = {};
    ACCEPTED.forEach(function (key) { data[key] = clean_(payload[key]); });
    if (!data.phone && !data.message && !data.name) return json_({ ok: false, error: 'nothing to record' });
    // Honeypot filled (see site/assets/js/forms.js): answer ok, record nothing.
    if (clean_(payload.company_website) || payload.trapped) return json_({ ok: true });
    // Repetition caps. The endpoint is public by design, so bound what one
    // phone number and the endpoint as a whole can append per hour.
    if (!underLimit_('phone:' + (data.phone || data.name), PER_PHONE_PER_HOUR) || !underLimit_('all', PER_HOUR_TOTAL)) {
      return json_({ ok: false, error: 'too many submissions, try again later' });
    }
    var fields = {
      'Timestamp': new Date(), 'Source': data.source || 'website', 'Name': data.name, 'Phone': data.phone ? "'" + data.phone : '',
      'Specialty': data.specialty, 'Doctor': data.doctor, 'Branch': data.branch, 'Preferred day': data.preferredDay,
      'Preferred time': data.preferredTime, 'Message': data.message, 'Language': data.language, 'Page URL': data.pageUrl,
      'Status': 'new', 'Notes': '', 'UTM source': data.utmSource, 'UTM medium': data.utmMedium,
      'UTM campaign': data.utmCampaign, 'UTM content': data.utmContent, 'UTM term': data.utmTerm, 'Click ID': data.clickId,
      'Landing page': data.landingPage, 'Referrer': data.referrer, 'Device': data.device, 'First touch': data.firstTouchSource
    };
    sheet.appendRow(headers.map(function (header) { return Object.prototype.hasOwnProperty.call(fields, header) ? fields[header] : ''; }));
    return json_({ ok: true });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
  finally { try { lock.releaseLock(); } catch (ignored) {} }
}
