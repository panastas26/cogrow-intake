export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data.businessName || !data.email) {
    return res.status(400).json({ error: 'Missing required fields (businessName, email)' });
  }

  // Log the submission for debugging
  console.log('Form submission received:', {
    businessName: data.businessName,
    email: data.email,
    timestamp: new Date().toISOString()
  });

  try {
    // For now, just acknowledge receipt
    // In production: integrate with Resend + Google Sheets here
    const acknowledgment = {
      success: true,
      message: 'Form submitted successfully',
      businessName: data.businessName,
      receivedAt: new Date().toISOString(),
      note: 'Emails and sheet integration pending'
    };

    // Try to send email if Resend API key is available
    if (process.env.RESEND_API_KEY) {
      try {
        // Send confirmation email to client
        const confirmResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'hello@cogrow.ai',
            to: data.email,
            subject: 'Welcome to CoGrow - We are setting up your account',
            html: `<h2>Welcome to CoGrow!</h2><p>Hi ${data.businessName},</p><p>Thank you for completing your onboarding. Our team will be in touch within 1 business day.</p>`,
          }),
        });

        if (confirmResponse.ok) {
          console.log('Confirmation email sent to:', data.email);
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError.message);
      }

      // Send to PJ
      try {
        const pjResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'hello@cogrow.ai',
            to: 'paul@anastascompanies.com',
            subject: `New CoGrow Client Intake: ${data.businessName}`,
            html: `<h2>New Intake Submission</h2><p>Business: ${data.businessName}</p><p>Contact: ${data.email}</p><p>Phone: ${data.phone || 'N/A'}</p>`,
          }),
        });

        if (pjResponse.ok) {
          console.log('PJ notification sent');
        }
      } catch (pjEmailError) {
        console.error('Failed to send PJ email:', pjEmailError.message);
      }
    }

    return res.status(200).json(acknowledgment);
  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ 
      error: 'Form submission failed',
      message: error.message 
    });
  }
}
