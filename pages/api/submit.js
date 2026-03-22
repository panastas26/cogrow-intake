import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SPREADSHEET_ID = '1UszYydFylscHH2KMWStdwSSZt_w5E08vvVjvvqmIM5s';
const SHEET_NAME = 'Intake Submissions';
const PJ_EMAIL = 'paul@anastascompanies.com';
const FROM_EMAIL = 'hello@cogrow.ai';
const GOOGLE_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

function formatHours(businessHours) {
  if (!businessHours) return 'Not provided';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => {
    const h = businessHours[day];
    if (!h) return `${day}: Not set`;
    if (h.closed) return `${day}: Closed`;
    return `${day}: ${h.open || '--'} to ${h.close || '--'}`;
  }).join('\n');
}

function buildClientEmailHtml(data) {
  const bizName = data.businessName || 'your business';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; padding: 40px 20px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="font-size: 24px; font-weight: 800; color: #f97316; margin-bottom: 8px;">CoGrow</div>
    <h1 style="font-size: 22px; color: #1a1f36; margin-bottom: 16px;">Welcome to CoGrow!</h1>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
      Hi ${data.ownerName || 'there'},
    </p>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
      Thank you for completing your onboarding for <strong>${bizName}</strong>. We have everything we need to get started setting up your CoGrow system.
    </p>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
      Here is a summary of what you submitted:
    </p>

    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b; width: 40%;">Business</td><td style="color: #1e293b; font-weight: 500;">${data.businessName || ''}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Industry</td><td style="color: #1e293b;">${data.industry || 'Not specified'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Google Account</td><td style="color: #1e293b;">${data.googleEmail || ''}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Booking Tool</td><td style="color: #1e293b;">${data.bookingTool || 'Not specified'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Payment Processor</td><td style="color: #1e293b;">${data.paymentProcessor || 'None'}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Website Host</td><td style="color: #1e293b;">${data.websiteHost || 'Not specified'}</td></tr>
      </table>
    </div>

    <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
      Our team will review your setup and reach out within <strong>1 business day</strong> to kick things off.
    </p>
    <p style="color: #475569; line-height: 1.6; margin-bottom: 32px;">
      If you have any questions in the meantime, reply to this email or reach us at <a href="mailto:hello@cogrow.ai" style="color: #f97316;">hello@cogrow.ai</a>.
    </p>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
      CoGrow - AI Systems for Professional Services<br>
      <a href="https://cogrow.ai" style="color: #f97316;">cogrow.ai</a>
    </div>
  </div>
</body>
</html>`;
}

function buildPJEmailText(data) {
  const logo = data.logoBase64 ? `[Logo attached: ${data.logoName || 'logo'}]` : 'None';
  const apptLengths = (data.apptLengths || []).join(', ') + ' min';

  return `New CoGrow Client Intake Submission
=====================================

BUSINESS BASICS
---------------
Business Name:    ${data.businessName || ''}
Owner Name:       ${data.ownerName || ''}
Email:            ${data.email || ''}
Phone:            ${data.phone || ''}
Address:          ${data.address || ''}
Website:          ${data.websiteUrl || ''}
Industry:         ${data.industry || ''}

Business Hours:
${formatHours(data.businessHours)}

GOOGLE ACCESS
-------------
Google Email:         ${data.googleEmail || ''}
GBP URL:              ${data.gbpUrl || 'Not provided'}
Uses Workspace:       ${data.usesWorkspace || 'Not answered'}

BOOKING / SCHEDULING
---------------------
Booking Tool:         ${data.bookingTool || ''}
Bookable Services:    ${data.bookableServices || ''}
Appt Lengths:         ${apptLengths}
Buffer:               ${data.hasBuffer || 'No'} ${data.hasBuffer === 'yes' ? `(${data.bufferMinutes || '?'} min)` : ''}

PAYMENTS
--------
Accepts Online Payments: ${data.acceptsPayments || 'No'}
Payment Processor:       ${data.paymentProcessor || 'None'}
Stripe Pub Key:          ${data.stripePublishableKey || 'Not provided'}
Wants Stripe Setup:      ${data.wantsStripeSetup || 'No'}
Charges Deposits:        ${data.chargesDeposit || 'No'} ${data.chargesDeposit === 'yes' ? `($${data.depositAmount || '?'})` : ''}

DOMAIN AND HOSTING
------------------
Domain Registrar:   ${data.domainRegistrar || ''}
DNS Provider:       ${data.dnsProvider || ''}
Cloudflare Email:   ${data.cloudflareEmail || 'N/A'}
Website Host:       ${data.websiteHost || ''}
DNS Access OK:      ${data.dnsAccess || 'Not answered'}

BRANDING
--------
Logo:               ${logo}
Primary Color:      ${data.primaryColor || ''}
Secondary Color:    ${data.secondaryColor || ''}
Tagline:            ${data.tagline || ''}
Fonts:              ${data.fonts || ''}

SOCIAL AND REVIEWS
------------------
Facebook:           ${data.facebookUrl || 'Not provided'}
Instagram:          ${data.instagramHandle || 'Not provided'}
Yelp:               ${data.yelpUrl || 'Not provided'}
Wants Review Setup: ${data.wantsReviewSetup || 'Not answered'}

COMMUNICATION
-------------
Contact Method:      ${data.contactMethod || ''}
Best Time:           ${data.bestTime || ''}
Notification Name:   ${data.notifName || ''}
Notification Email:  ${data.notifEmail || ''}
Notification Phone:  ${data.notifPhone || ''}
Additional Notes:    ${data.notes || ''}
`;
}

async function appendToSheet(data) {
  const headers = [
    'Submitted At', 'Business Name', 'Owner', 'Email', 'Phone', 'Address', 'Website', 'Industry',
    'Google Email', 'GBP URL', 'Uses Workspace',
    'Booking Tool', 'Bookable Services', 'Appt Lengths', 'Buffer',
    'Accepts Payments', 'Payment Processor', 'Stripe Key', 'Wants Stripe Setup', 'Charges Deposit', 'Deposit Amount',
    'Domain Registrar', 'DNS Provider', 'Cloudflare Email', 'Website Host', 'DNS Access',
    'Logo Name', 'Primary Color', 'Secondary Color', 'Tagline', 'Fonts',
    'Facebook', 'Instagram', 'Yelp', 'Wants Review Setup',
    'Contact Method', 'Best Time', 'Notif Name', 'Notif Email', 'Notif Phone', 'Notes'
  ];

  const row = [
    new Date().toISOString(),
    data.businessName || '',
    data.ownerName || '',
    data.email || '',
    data.phone || '',
    data.address || '',
    data.websiteUrl || '',
    data.industry || '',
    data.googleEmail || '',
    data.gbpUrl || '',
    data.usesWorkspace || '',
    data.bookingTool || '',
    data.bookableServices || '',
    (data.apptLengths || []).join(', '),
    data.hasBuffer === 'yes' ? `Yes (${data.bufferMinutes || '?'} min)` : 'No',
    data.acceptsPayments || '',
    data.paymentProcessor || '',
    data.stripePublishableKey || '',
    data.wantsStripeSetup || '',
    data.chargesDeposit || '',
    data.depositAmount || '',
    data.domainRegistrar || '',
    data.dnsProvider || '',
    data.cloudflareEmail || '',
    data.websiteHost || '',
    data.dnsAccess || '',
    data.logoName || '',
    data.primaryColor || '',
    data.secondaryColor || '',
    data.tagline || '',
    data.fonts || '',
    data.facebookUrl || '',
    data.instagramHandle || '',
    data.yelpUrl || '',
    data.wantsReviewSetup || '',
    data.contactMethod || '',
    data.bestTime || '',
    data.notifName || '',
    data.notifEmail || '',
    data.notifPhone || '',
    data.notes || '',
  ];

  // Use Google Sheets API v4 via REST
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:A?key=${GOOGLE_API_KEY}`;
  
  // First, get existing data to check if sheet exists
  try {
    const getResp = await fetch(url);
    if (!getResp.ok) {
      throw new Error('Sheet not found, will create it');
    }
  } catch (e) {
    // Sheet doesn't exist, would need to create it - skip for now
    console.log('Sheet append skipped:', e.message);
    return;
  }

  // Append data using REST API
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:A:append?valueInputOption=RAW&key=${GOOGLE_API_KEY}`;
  const appendResp = await fetch(appendUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });

  if (!appendResp.ok) {
    const err = await appendResp.text();
    throw new Error(`Sheets API error: ${err}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data.businessName || !data.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const errors = [];

  // 1. Send confirmation email to client
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Welcome to CoGrow - We\'re setting up your account',
      html: buildClientEmailHtml(data),
    });
  } catch (e) {
    errors.push(`Client email failed: ${e.message}`);
  }

  // 2. Send full submission to PJ
  try {
    const attachments = [];
    if (data.logoBase64) {
      // data.logoBase64 is a data URL like data:image/png;base64,XXXX
      const base64Data = data.logoBase64.split(',')[1];
      const mimeType = data.logoBase64.split(';')[0].split(':')[1];
      attachments.push({
        filename: data.logoName || 'logo',
        content: base64Data,
        content_type: mimeType,
      });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: PJ_EMAIL,
      subject: `New CoGrow Client Intake: ${data.businessName}`,
      text: buildPJEmailText(data),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  } catch (e) {
    errors.push(`PJ email failed: ${e.message}`);
  }

  // 3. Append to Google Sheet
  try {
    await appendToSheet(data);
  } catch (e) {
    errors.push(`Sheet append failed: ${e.message}`);
  }

  if (errors.length > 0) {
    console.error('Submission errors:', errors);
    // Still return success to user -- log internally
    return res.status(200).json({ success: true, warnings: errors });
  }

  return res.status(200).json({ success: true });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
