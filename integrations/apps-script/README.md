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

## Why "Anyone" is required, and why it is safe

A static site has no server and no way to prove who it is, so the endpoint must
accept an unauthenticated POST. The URL is therefore effectively public, and
the script is written for that. It **only ever appends**: there is no path that
reads, searches or returns anything from the spreadsheet, so knowing the URL
buys someone nothing but the ability to add a row. It also:

- accepts only the eleven known field names and discards everything else, so a
  crafted POST cannot invent columns or set `Status` itself
- caps every field at 2000 characters
- takes the timestamp from Google's clock, never from the caller
- takes a lock around the append, so two submissions in the same second cannot
  overwrite each other

**Do not add a `doGet` that returns sheet data.** That single change would turn
a harmless public endpoint into a data leak.

If the URL is ever abused: **Deploy -> Manage deployments -> Archive**, create a
new deployment, and put the new URL in the dashboard under Integrations. The old
URL dies immediately.

## Changing the script later

Apps Script deployments are versioned. After editing `Code.gs` use
**Deploy -> Manage deployments -> (pencil) -> Version: New version -> Deploy**.
Using "New deployment" instead gives you a *different* URL, and the site will
keep posting to the old one.

## If the endpoint is ever cleared

An empty `formsEndpoint` makes the site skip the POST entirely and silently.
Nothing breaks and nothing is lost: WhatsApp is the primary path that the
patient actually completes, and the sheet is a parallel record.
