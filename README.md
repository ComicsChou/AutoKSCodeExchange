# KINGSHOT Batch Redemption Helper — User Guide

Version 1.2.0. A local Chrome / Microsoft Edge extension for Windows. Available in English, German and Traditional Chinese. No Python, Node.js or server is needed for normal use. This is an independent tool, not an official KINGSHOT product.

## Install

1. Extract KingshotBatch.zip and keep the entire KingshotBatch folder.
2. In Chrome, enter chrome://extensions in the address bar. In Edge, enter edge://extensions.
3. Enable Developer mode, then click Load unpacked.
4. Select the folder containing manifest.json. Do not select the ZIP file or app.html.
5. Open the browser extensions menu and click KINGSHOT. Pin it if you want easy access.

Opening app.html directly only displays the installation guide. Normal operation requires the extension. If your organization blocks extensions, follow its administration rules.

## Update without losing records

Use Back up data first. Extract the new files over the **same folder** you originally loaded. Open the browser extensions page, click Reload on the KINGSHOT extension card, and reopen the tool tab. **Do not remove and reinstall the extension.** Keep the same browser profile and extension to retain your characters and history.

If updating from a version before 1.1.0, the browser may request access to kingshotoptimizer.com for the code list. No character data is sent to that source website.

## Language and help

Use the selector in the upper-right corner: English, Deutsch or 繁體中文. The choice is stored locally and reused when you reopen the tool. It does not modify characters, codes, redemption records or an active batch. Dates use the selected language's format. User guide opens the matching offline guide.

The interface language is separate from the **official redemption website**. The current form adapter requires the official site to be set to Traditional Chinese (繁體中文). Changing this tool to English or German does not change that site. Original website replies and browser diagnostic details may remain in their original language; status labels and tool messages are localized.

## Redeem codes

1. Click Add character. Enter the Player ID and Kingdom. A nickname is optional. The game avatar opens the governor profile where you can find these values.
2. Select the characters you want to use.
3. Wait for the latest code list, or click Refresh list. You can also type a single code manually. Preserve its capitalization.
4. Choose a delay: 10, 15, 30, 60, 120 or 300 seconds. The default is 30 seconds.
5. Click Redeem unused active codes, or Redeem entered code for the manual field.
6. Watch Redemption progress and History. Keep the browser open. Do not edit the tool's official redemption tab while the batch is running.

The delay starts after each item finishes. Page loading and response time are additional. Browser suspension, throttling or computer sleep can delay execution. The tool does not wake your computer.

## Automatic code list and saved code history

The extension reads [Kingshot Optimizer](https://kingshotoptimizer.com/gift-codes/) when you open the tool and every hour. It briefly opens a background source tab and closes it afterward. Refreshing loads codes only; **you start redemption with the batch button**.

Only the rendered Active codes section is used, ordered by the date added. The static page can contain an older list. Loaded code history retains each loaded code, first-loaded time, last-seen time and status across restarts.

- Codes in Expired codes are excluded. Previously loaded codes removed from the active list remain in history but are excluded.
- Usage is tracked per Player ID + Kingdom + Gift code. A code used by the main character can still be redeemed for an unused alternate character.
- Codes already used by every selected character are excluded. In mixed batches, completed character/code pairs are skipped and logged.
- If the official site reports an expired code, remaining characters for that code are skipped. Later batches also exclude it.
- If the source refresh fails, earlier records remain, but the latest-code batch button is disabled until a successful refresh. The source list does not guarantee that the official site will accept every code.

## Results, skipping and stopping

Only a clear new success message is recorded as success. The permanent page hint about reward delivery is not a success result.

Already redeemed / already claimed / already used responses are logged and skipped automatically. Verification challenges, rate limits, unknown replies, timeouts and interrupted attempts are logged as **Unknown result · Skipped**, then the batch continues. **There is no manual confirmation panel.** Challenges are not solved automatically.

An unknown result does not mean success or failure; the request may already have been submitted. Unknown attempts are not automatically resubmitted, including in later batches. Their original records remain available.

Stop batch prevents later items from starting. Requests already sent cannot be recalled. If a request is in progress, its result is recorded first. After a browser/background restart, a potentially submitted item is skipped; remaining unsent items can resume. Old paused batches are migrated to this behavior.

## Data, backup and import

Characters, loaded codes, progress and redemption history are stored in chrome.storage.local for this browser profile. Language is stored locally too. The tool sends Player ID, Kingdom and Gift code only to [the official redemption center](https://ks-giftcode.centurygame.com/). No game password is needed. No private backend or translation service is used.

Back up data downloads a JSON file containing characters, code records and redemption history. Import characters **only merges characters**: existing ID/Kingdom pairs are kept, and history or unfinished batches are not restored. The history table shows the latest 200 entries; the backup includes the complete history.

Removing the extension, clearing its storage or switching browser profiles can lose records. Importing only characters into a fresh profile will not restore the earlier automatic skip history. Keep the original extension installation when updating.

Example character import file — replace the sample values:

```json
[{"name":"Main","id":"123456789","kingdom":"123","enabled":true}]
```

## Troubleshooting and limitations

- A file:// / origin null / CORS error from an older version means app.html was opened directly. Load the extension instead. Do not disable browser security.
- If the source cannot be read, check its page and refresh later. The source may have changed or require verification.
- If the official form cannot be found, set that website to 繁體中文. A site redesign may require an updated adapter.js.
- Reload the extension and reopen its tool tab after replacing files, so you are not using an older interface.

The extension requests local storage, scheduling, and script access to the two specified websites. Local simulations and interface checks have been run. **Actual reward delivery with a real character and valid code, and a full installed-extension end-to-end run, have not been verified.** Try one character first and check the in-game mailbox.

## Developer files

app.html / app.js / style.css provide the interface. languages.js contains local translations. core.js handles validation and records, background.js runs the queue, adapter.js operates the official form, and source.js reads and filters source codes. The _locales folder localizes the browser's extension listing.

Developers with Node.js can run `node --test tests/*.mjs` from this folder. Tests use local fixtures and do not submit real redemptions.

## Report an issue

[ximoc001@gmail.com](mailto:ximoc001@gmail.com)
