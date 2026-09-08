/**
 * La Rose Wellness Hub — form capture endpoint.
 *
 * Deployed as a Google Apps Script Web App bound to the spreadsheet
 * "La Rose — Bookings & Enquiries". The website is a static site, so it cannot
 * hold a credential and cannot call the Sheets API directly. It POSTs here
 * instead, and this script is the only thing that can write.
 *
 * Because the deployment must be readable by "Anyone" for a static page to
 * reach it, this URL is effectively public. It therefore NEVER reads or returns
 * sheet contents. It only appends. Do not add a read path to it.
 *
 * See README.md for the deployment steps.
 */

var SHEET_ID = '1fwL5rMeMLgUs2v9UHWu9c-PCeWtmfBW_YpZTG3RGbAI';
/* The tab is currently called "Untitled"; the lookup below falls back to
   the first sheet, so renaming the tab either way cannot break capture. */
var SHEET_NAME = 'Sheet1';

/* Column order must match the spreadsheet header row exactly. */
var COLUMNS = [
  'Timestamp', 'Source', 'Name', 'Phone', 'Specialty', 'Doctor', 'Branch',
  'Preferred day', 'Preferred time', 'Message', 'Language', 'Page URL',
  'Status', 'Notes'
];

/* Only these arrive from the page. Anything else in the payload is discarded,
   so a crafted POST cannot inject extra columns or overwrite Status. */
var ACCEPTED = [
  'source', 'name', 'phone', 'specialty', 'doctor', 'branch',
  'preferredDay', 'preferredTime', 'message', 'language', 'pageUrl'
];

var MAX_FIELD = 2000;

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean_(value) {
  if (value === null || value === undefined) return '';
  var s = String(value);
  // strip control characters, then cap the length
  s = s.replace(/[\x00-\x1f\x7f]/g, ' ').trim();
  return s.length > MAX_FIELD ? s.slice(0, MAX_FIELD) : s;
}

function doGet() {
  // a liveness probe, so the dashboard can verify a deployment URL works
  return json_({ ok: true, service: 'larose-forms' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty body' });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      return json_({ ok: false, error: 'invalid JSON' });
    }

    var data = {};
    for (var i = 0; i < ACCEPTED.length; i++) {
      data[ACCEPTED[i]] = clean_(payload[ACCEPTED[i]]);
    }

    // a submission with neither a phone nor a message is noise
    if (!data.phone && !data.message && !data.name) {
      return json_({ ok: false, error: 'nothing to record' });
    }

    // Two people submitting at the same moment would otherwise race for the
    // same row and one write would be lost.
    lock.waitLock(20000);

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME) ||
                SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    sheet.appendRow([
      new Date(),               // server clock: never trust a client timestamp
      data.source || 'website',
      data.name,
      data.phone ? "'" + data.phone : '',   // leading quote keeps 010… intact
      data.specialty,
      data.doctor,
      data.branch,
      data.preferredDay,
      data.preferredTime,
      data.message,
      data.language,
      data.pageUrl,
      'new',
      ''
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}
