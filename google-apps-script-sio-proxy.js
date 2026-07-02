/**
 * Google Apps Script — Proxy Sio pour Rentimmo Academy
 * Déployer comme "Application web" → "Tout le monde" → Déployer
 * URL générée → mettre dans CF Pages env var SIO_PROXY_URL
 */

const SIO_KEY = 'ip0v1l5e87ksptocftfp9b3b8h4olextue10n4rnfib0ucv8q2w2x1n44p4klahd';
const SIO = 'https://api.systeme.io/api';
const TAG_OPTIN = 1721885;
const TAG_SOURCES = { insta: 1054256, tiktok: 1057171, youtube: 1057170 };

function doPost(e) {
  const cors = ContentService.createTextOutput();
  cors.setMimeType(ContentService.MimeType.JSON);

  try {
    const { firstName, email, phone, source } = JSON.parse(e.postData.contents);

    const headers = { 'X-API-Key': SIO_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' };

    // 1. Cherche contact existant
    const search = JSON.parse(UrlFetchApp.fetch(`${SIO}/contacts?email=${encodeURIComponent(email)}`, { headers, muteHttpExceptions: true }).getContentText());
    let contact = (search.items || search['hydra:member'] || [])[0];

    // 2. Crée si inexistant
    if (!contact) {
      const fields = [{ slug: 'first_name', value: firstName }];
      if (phone) fields.push({ slug: 'phone_number', value: phone });
      const res = UrlFetchApp.fetch(`${SIO}/contacts`, {
        method: 'post',
        headers,
        payload: JSON.stringify({ email, fields }),
        muteHttpExceptions: true,
      });
      const data = JSON.parse(res.getContentText());
      if (!data.id) {
        cors.setContent(JSON.stringify({ ok: false, error: data.detail || 'create_failed' }));
        return cors;
      }
      contact = data;
    }

    // 3. Ajoute tags
    const tags = [TAG_OPTIN];
    const src = (source || '').toLowerCase();
    if (src.includes('insta') || src.startsWith('ig')) tags.push(TAG_SOURCES.insta);
    else if (src.includes('tiktok') || src.startsWith('tt')) tags.push(TAG_SOURCES.tiktok);
    else if (src.includes('youtube') || src.startsWith('yt')) tags.push(TAG_SOURCES.youtube);

    tags.forEach(tagId => {
      UrlFetchApp.fetch(`${SIO}/contacts/${contact.id}/tags`, {
        method: 'post', headers, payload: JSON.stringify({ tagId }), muteHttpExceptions: true,
      });
    });

    cors.setContent(JSON.stringify({ ok: true, contactId: contact.id }));
  } catch (err) {
    cors.setContent(JSON.stringify({ ok: false, error: err.message }));
  }
  return cors;
}

// Pour tester dans l'éditeur Apps Script :
function test() {
  const result = doPost({ postData: { contents: JSON.stringify({
    firstName: 'Test',
    email: 'marwanafassi@gmail.com',
    phone: '0612345678',
    source: 'insta',
  }) } });
  Logger.log(result.getContent());
}
