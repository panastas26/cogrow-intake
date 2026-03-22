const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function formatField(key, value) {
  if (!value) return '';
  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#94a3b8;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 12px;color:#e2e8f0;">${value}</td></tr>`;
}

function buildEmailHtml(data) {
  const skip = ['logoData'];
  const sections = [
    { title: 'Business Basics', fields: ['businessName','ownerName','ownerEmail','ownerPhone','address','website','hours','industry'] },
    { title: 'Google Access', fields: ['googleEmail','gbpUrl','googleWorkspace'] },
    { title: 'Booking', fields: ['bookingTool','bookableServices','apptLengths','bufferTime'] },
    { title: 'Payments', fields: ['onlinePayments','paymentProcessor','stripeKey','setupStripe'] },
    { title: 'Domain & Hosting', fields: ['registrar','dnsProvider','cloudflareEmail','websiteHost','dnsAccess'] },
    { title: 'Branding', fields: ['color1','color2','color3','colorText','fonts','tagline','logoFilename'] },
    { title: 'Social & Reviews', fields: ['gbpLink','facebook','instagram','yelp','reviewSetup'] },
    { title: 'Communication', fields: ['contactMethod','bestTime','leadContact','notes'] },
  ];

  let body = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f172a;padding:32px;border-radius:12px;max-width:700px;margin:0 auto;">
    <div style="margin-bottom:24px;">
      <span style="font-size:22px;font-weight:800;color:#f97316;">co</span><span style="font-size:22px;font-weight:800;color:#e2e8f0;">grow</span>
      <span style="font-size:14px;color:#94a3b8;margin-left:12px;">New Client Intake Submission</span>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:16px;margin-bottom:24px;border:1px solid #334155;">
      <div style="font-size:18px;font-weight:700;color:#f1f5f9;">${data.businessName || 'Unknown Business'}</div>
      <div style="font-size:14px;color:#94a3b8;margin-top:4px;">${data.ownerName || ''} &bull; ${data.ownerEmail || ''}</div>
    </div>
  `;

  for (const section of sections) {
    const rows = section.fields.map(f => formatField(f, data[f])).filter(Boolean).join('');
    if (!rows) continue;
    body += `
    <div style="margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${section.title}</div>
      <table style="width:100%;border-collapse:collapse;background:#1e293b;border-radius:8px;overflow:hidden;border:1px solid #334155;">
        ${rows}
      </table>
    </div>`;
  }

  body += `</div>`;
  return body;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const clientEmail = data.ownerEmail;
    const clientName = data.ownerName || 'there';
    const businessName = data.businessName || 'your business';

    const html = buildEmailHtml(data);

    // Send to Paul
    await resend.emails.send({
      from: 'CoGrow Intake <hello@cogrow.ai>',
      to: 'paul@anastascompanies.com',
      subject: `New Intake: ${businessName}`,
      html: html,
    });

    // Send confirmation to client
    if (clientEmail) {
      await resend.emails.send({
        from: 'CoGrow <hello@cogrow.ai>',
        to: clientEmail,
        subject: 'Got it! CoGrow received your intake form',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f172a;padding:32px;border-radius:12px;max-width:600px;margin:0 auto;color:#e2e8f0;">
            <div style="margin-bottom:24px;">
              <span style="font-size:22px;font-weight:800;color:#f97316;">co</span><span style="font-size:22px;font-weight:800;color:#e2e8f0;">grow</span>
            </div>
            <h2 style="color:#f1f5f9;font-size:22px;margin-bottom:12px;">Hey ${clientName}, we got everything!</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;">Thanks for completing your CoGrow intake form for <strong style="color:#e2e8f0;">${businessName}</strong>.</p>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin-top:12px;">Our team will review your information and reach out within <strong style="color:#f97316;">1 business day</strong> to get things moving.</p>
            <div style="background:#1e293b;border-radius:8px;padding:20px;margin-top:24px;border:1px solid #334155;">
              <div style="font-size:13px;color:#64748b;">Questions? Reply to this email or reach us at</div>
              <div style="font-size:15px;color:#f97316;margin-top:4px;">paul@cogrow.ai</div>
            </div>
          </div>
        `,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
};
