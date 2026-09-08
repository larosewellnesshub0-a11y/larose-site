# Booking and enquiry forms -> Google Sheets

**This is deployed and working.** Nothing needs doing unless something breaks.

## What is live

| | |
|---|---|
| Google account | `larosewellnesshub0@gmail.com` (the clinic account) |
| Apps Script project | **La Rose forms** |
| Deployment | Web app, *Execute as* **Me**, *Who has access* **Anyone** |
| Endpoint | `content/site.json` -> `integrations.formsEndpoint` |
| Spreadsheet | **La Rose - Bookings & Enquiries**, id `1fwL5rMeMLgUs2v9UHWu9c-PCeWtmfBW_YpZTG3RGbAI` |
| Sheet tab | currently named `Untitled`; the script falls back to the first tab, so renaming it is safe |

Verified end to end on 2026-09-07: a POST from the live booking page appended a
row with the Arabic intact and the phone number's leading zero preserved.

The spreadsheet still contains two rows with `Source = website-test` from that
verification. Delete them whenever you like.

## How to check it is still alive

Open the `/exec` URL from `integrations.formsEndpoint` in a browser. A healthy
deployment answers exactly:

```json
{"ok":true,"service":"larose-forms"}
```

That probe only proves the script is reachable - it never touches the
spreadsheet. To prove capture still works you have to submit a real form and
look for the row.

## Why "Anyone" is required, and how reads are protected

A static site has no server and no way to prove who it is, so the endpoint must
accept an unauthenticated POST. The URL is therefore effectively public, and
the normal form path is written for that and only appends. Lead reads and status
updates use a separate non-empty `READ_TOKEN`. The token lives only in Apps
Script Properties and in the dashboard user's browser; it must never be added
to this repository, a page URL in the public site, or a content file. The script:

- accepts only the known field names and discards everything else, so a
  crafted POST cannot invent columns or set `Status` itself
- caps every field at 2000 characters
- takes the timestamp from Google's clock, never from the caller
- takes a lock around the append, so two submissions in the same second cannot
  overwrite each other

Set it in **Project Settings → Script Properties**: add property `READ_TOKEN`
with a long random value. Give that value only to dashboard users who need lead
access. To rotate it, replace the Script Property, save, update the value in the
authorised browser, and redeploy. The old token stops authorising reads and
updates. Calls without the exact non-empty token return only `unauthorised`.

`GET ?action=leads&token=...` returns the headers and data rows. Optional ISO
`since` filters by timestamp. An optional safe `callback` provides a JSONP
fallback. A POST with `action: updateStatus`, the token, a 1-based sheet `row`,
`status`, and `notes` updates only those two columns.

If the URL is ever abused: **Deploy -> Manage deployments -> Archive**, create a
new deployment, and put the new URL in the dashboard under Integrations. The old
URL dies immediately.

## Changing the script later

Apps Script deployments are versioned. After editing `Code.gs` use
**Deploy → Manage deployments → edit (pencil) → New version → Deploy**.
Using "New deployment" instead gives you a *different* URL, and the site will
keep posting to the old one.

## If the endpoint is ever cleared

An empty `formsEndpoint` makes the site skip the POST entirely and silently.
Nothing breaks and nothing is lost: WhatsApp is the primary path that the
patient actually completes, and the sheet is a parallel record.
