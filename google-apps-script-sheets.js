/**
 * Google Apps Script — Optin logger pour Rentimmo Academy
 * Déployer comme "Application web" → exécuter en tant que MOI → Tout le monde → Déployer
 * URL générée → mettre dans CF Pages env var : APPS_SCRIPT_URL
 */

const SHEET_ID = '1dqwUNZnHFyVZ-emSJYfQucif4uRLPjoWjBa8dnaqwPU';

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const { firstName, email, phone, source } = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];

    const date = Utilities.formatDate(new Date(), 'Europe/Paris', 'yyyy-MM-dd HH:mm:ss');
    const tag = source ? 'optin masterclass (' + source + ')' : 'optin masterclass';

    sheet.appendRow([date, firstName, '', email, phone, tag, '', '', '', '', '', '', '']);

    output.setContent(JSON.stringify({ ok: true }));
  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }

  return output;
}

// Test dans l'éditeur Apps Script :
function test() {
  const result = doPost({
    postData: {
      contents: JSON.stringify({
        firstName: 'Test',
        email: 'marwanafassi@gmail.com',
        phone: '0612345678',
        source: 'insta',
      }),
    },
  });
  Logger.log(result.getContent());
}
