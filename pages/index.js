import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  'Business Basics',
  'Google Access',
  'Booking / Scheduling',
  'Payments',
  'Domain and Hosting',
  'Branding',
  'Social and Reviews',
  'Communication',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Step1({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const updateHours = (day, field, val) => {
    const hours = { ...(data.businessHours || {}) };
    if (!hours[day]) hours[day] = { open: '', close: '', closed: false };
    hours[day][field] = val;
    update('businessHours', hours);
  };
  return (
    <div>
      <div className="field">
        <label>Business Name *</label>
        <input type="text" value={data.businessName || ''} onChange={e => update('businessName', e.target.value)} placeholder="ABC Accounting LLC" />
      </div>
      <div className="field">
        <label>Owner Name *</label>
        <input type="text" value={data.ownerName || ''} onChange={e => update('ownerName', e.target.value)} placeholder="Jane Smith" />
      </div>
      <div className="field">
        <label>Email *</label>
        <input type="email" value={data.email || ''} onChange={e => update('email', e.target.value)} placeholder="jane@example.com" />
      </div>
      <div className="field">
        <label>Phone *</label>
        <input type="tel" value={data.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="(555) 555-5555" />
      </div>
      <div className="field">
        <label>Business Address</label>
        <input type="text" value={data.address || ''} onChange={e => update('address', e.target.value)} placeholder="123 Main St, Boston MA 02101" />
      </div>
      <div className="field">
        <label>Website URL</label>
        <input type="url" value={data.websiteUrl || ''} onChange={e => update('websiteUrl', e.target.value)} placeholder="https://yourbusiness.com" />
      </div>
      <div className="field">
        <label>Industry</label>
        <select value={data.industry || ''} onChange={e => update('industry', e.target.value)}>
          <option value="">-- Select Industry --</option>
          <option value="CPA Firm">CPA Firm</option>
          <option value="Law Firm">Law Firm</option>
          <option value="Pest Control">Pest Control</option>
          <option value="HVAC">HVAC</option>
          <option value="Electrical Contractor">Electrical Contractor</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>Business Hours</label>
        <div className="hours-grid">
          {DAYS.map(day => {
            const h = (data.businessHours || {})[day] || {};
            return (
              <div key={day} className="hours-row">
                <span className="day-label">{day}</span>
                <label className="closed-check">
                  <input type="checkbox" checked={h.closed || false} onChange={e => updateHours(day, 'closed', e.target.checked)} />
                  Closed
                </label>
                {!h.closed && (
                  <>
                    <input type="time" value={h.open || ''} onChange={e => updateHours(day, 'open', e.target.value)} />
                    <span>to</span>
                    <input type="time" value={h.close || ''} onChange={e => updateHours(day, 'close', e.target.value)} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  return (
    <div>
      <div className="field">
        <label>Google Account Email *</label>
        <p className="hint">This is used to share Google Calendar and grant Google Business Profile access.</p>
        <input type="email" value={data.googleEmail || ''} onChange={e => update('googleEmail', e.target.value)} placeholder="you@gmail.com" />
      </div>
      <div className="field">
        <label>Google Business Profile URL (optional)</label>
        <input type="url" value={data.gbpUrl || ''} onChange={e => update('gbpUrl', e.target.value)} placeholder="https://g.page/yourbusiness" />
      </div>
      <div className="field">
        <label>Do you use Google Workspace? (G Suite)</label>
        <div className="radio-group">
          <label><input type="radio" name="usesWorkspace" value="yes" checked={data.usesWorkspace === 'yes'} onChange={e => update('usesWorkspace', e.target.value)} /> Yes</label>
          <label><input type="radio" name="usesWorkspace" value="no" checked={data.usesWorkspace === 'no'} onChange={e => update('usesWorkspace', e.target.value)} /> No</label>
        </div>
      </div>
    </div>
  );
}

function Step3({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleLength = (len) => {
    const current = data.apptLengths || [];
    const next = current.includes(len) ? current.filter(x => x !== len) : [...current, len];
    update('apptLengths', next);
  };
  return (
    <div>
      <div className="field">
        <label>Current Booking Tool</label>
        <select value={data.bookingTool || ''} onChange={e => update('bookingTool', e.target.value)}>
          <option value="">-- Select --</option>
          <option value="None">None</option>
          <option value="Calendly">Calendly</option>
          <option value="Acuity">Acuity</option>
          <option value="Google Calendar">Google Calendar</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>Services to Make Bookable</label>
        <p className="hint">List the services or appointment types you want clients to book online.</p>
        <textarea value={data.bookableServices || ''} onChange={e => update('bookableServices', e.target.value)} placeholder="Initial consultation (30 min), Tax review (60 min)..." rows={4} />
      </div>
      <div className="field">
        <label>Preferred Appointment Lengths</label>
        <div className="checkbox-group">
          {[15, 30, 60, 90].map(len => (
            <label key={len}>
              <input type="checkbox" checked={(data.apptLengths || []).includes(len)} onChange={() => toggleLength(len)} />
              {len} min
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Buffer Between Appointments?</label>
        <div className="radio-group">
          <label><input type="radio" name="hasBuffer" value="yes" checked={data.hasBuffer === 'yes'} onChange={e => update('hasBuffer', e.target.value)} /> Yes</label>
          <label><input type="radio" name="hasBuffer" value="no" checked={data.hasBuffer === 'no'} onChange={e => update('hasBuffer', e.target.value)} /> No</label>
        </div>
        {data.hasBuffer === 'yes' && (
          <div className="inline-field">
            <input type="number" value={data.bufferMinutes || ''} onChange={e => update('bufferMinutes', e.target.value)} placeholder="15" min="1" max="120" />
            <span>minutes</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Step4({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  return (
    <div>
      <div className="field">
        <label>Do you accept online payments now?</label>
        <div className="radio-group">
          <label><input type="radio" name="acceptsPayments" value="yes" checked={data.acceptsPayments === 'yes'} onChange={e => update('acceptsPayments', e.target.value)} /> Yes</label>
          <label><input type="radio" name="acceptsPayments" value="no" checked={data.acceptsPayments === 'no'} onChange={e => update('acceptsPayments', e.target.value)} /> No</label>
        </div>
      </div>
      <div className="field">
        <label>Payment Processor</label>
        <select value={data.paymentProcessor || ''} onChange={e => update('paymentProcessor', e.target.value)}>
          <option value="">-- Select --</option>
          <option value="None">None</option>
          <option value="Stripe">Stripe</option>
          <option value="Square">Square</option>
          <option value="PayPal">PayPal</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>Stripe Publishable Key (optional)</label>
        <p className="hint">This is your public key -- safe to share. Starts with pk_live_ or pk_test_</p>
        <input type="text" value={data.stripePublishableKey || ''} onChange={e => update('stripePublishableKey', e.target.value)} placeholder="pk_live_..." />
      </div>
      <div className="field">
        <label>Want CoGrow to set up Stripe for you?</label>
        <div className="radio-group">
          <label><input type="radio" name="wantsStripeSetup" value="yes" checked={data.wantsStripeSetup === 'yes'} onChange={e => update('wantsStripeSetup', e.target.value)} /> Yes</label>
          <label><input type="radio" name="wantsStripeSetup" value="no" checked={data.wantsStripeSetup === 'no'} onChange={e => update('wantsStripeSetup', e.target.value)} /> No</label>
        </div>
      </div>
      <div className="field">
        <label>Do you charge deposits?</label>
        <div className="radio-group">
          <label><input type="radio" name="chargesDeposit" value="yes" checked={data.chargesDeposit === 'yes'} onChange={e => update('chargesDeposit', e.target.value)} /> Yes</label>
          <label><input type="radio" name="chargesDeposit" value="no" checked={data.chargesDeposit === 'no'} onChange={e => update('chargesDeposit', e.target.value)} /> No</label>
        </div>
        {data.chargesDeposit === 'yes' && (
          <div className="inline-field">
            <span>$</span>
            <input type="number" value={data.depositAmount || ''} onChange={e => update('depositAmount', e.target.value)} placeholder="50" min="1" />
          </div>
        )}
      </div>
    </div>
  );
}

function Step5({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  return (
    <div>
      <div className="field">
        <label>Domain Registrar</label>
        <select value={data.domainRegistrar || ''} onChange={e => update('domainRegistrar', e.target.value)}>
          <option value="">-- Select --</option>
          <option value="GoDaddy">GoDaddy</option>
          <option value="Namecheap">Namecheap</option>
          <option value="Google Domains">Google Domains</option>
          <option value="Cloudflare">Cloudflare</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>DNS Provider</label>
        <select value={data.dnsProvider || ''} onChange={e => update('dnsProvider', e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Cloudflare">Cloudflare</option>
          <option value="GoDaddy">GoDaddy</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>Cloudflare Account Email (if applicable)</label>
        <input type="email" value={data.cloudflareEmail || ''} onChange={e => update('cloudflareEmail', e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label>Website Host / Platform</label>
        <select value={data.websiteHost || ''} onChange={e => update('websiteHost', e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Wix">Wix</option>
          <option value="Squarespace">Squarespace</option>
          <option value="WordPress">WordPress</option>
          <option value="Weebly">Weebly</option>
          <option value="Unknown">Unknown</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field">
        <label>OK with CoGrow having DNS access to make changes?</label>
        <div className="radio-group">
          <label><input type="radio" name="dnsAccess" value="yes" checked={data.dnsAccess === 'yes'} onChange={e => update('dnsAccess', e.target.value)} /> Yes</label>
          <label><input type="radio" name="dnsAccess" value="no" checked={data.dnsAccess === 'no'} onChange={e => update('dnsAccess', e.target.value)} /> No</label>
        </div>
      </div>
    </div>
  );
}

function Step6({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update('logoBase64', ev.target.result);
      update('logoName', file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="field">
        <label>Logo Upload (PNG, JPG, or SVG)</label>
        <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleFile} />
        {data.logoName && <p className="hint" style={{color:'#86efac'}}>Uploaded: {data.logoName}</p>}
      </div>
      <div className="field">
        <label>Primary Brand Color</label>
        <input type="text" value={data.primaryColor || ''} onChange={e => update('primaryColor', e.target.value)} placeholder="#1a1f36 or dark navy blue" />
      </div>
      <div className="field">
        <label>Secondary Brand Color</label>
        <input type="text" value={data.secondaryColor || ''} onChange={e => update('secondaryColor', e.target.value)} placeholder="#f97316 or orange" />
      </div>
      <div className="field">
        <label>Tagline (optional)</label>
        <input type="text" value={data.tagline || ''} onChange={e => update('tagline', e.target.value)} placeholder="We make the complicated simple." />
      </div>
      <div className="field">
        <label>Fonts to Keep (optional)</label>
        <input type="text" value={data.fonts || ''} onChange={e => update('fonts', e.target.value)} placeholder="Helvetica, Georgia..." />
      </div>
    </div>
  );
}

function Step7({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  return (
    <div>
      <div className="field">
        <label>Facebook URL (optional)</label>
        <input type="url" value={data.facebookUrl || ''} onChange={e => update('facebookUrl', e.target.value)} placeholder="https://facebook.com/yourbusiness" />
      </div>
      <div className="field">
        <label>Instagram Handle (optional)</label>
        <input type="text" value={data.instagramHandle || ''} onChange={e => update('instagramHandle', e.target.value)} placeholder="@yourbusiness" />
      </div>
      <div className="field">
        <label>Yelp URL (optional)</label>
        <input type="url" value={data.yelpUrl || ''} onChange={e => update('yelpUrl', e.target.value)} placeholder="https://yelp.com/biz/yourbusiness" />
      </div>
      <div className="field">
        <label>Want CoGrow to set up review profiles for you?</label>
        <p className="hint">Google, Yelp, BBB and others as appropriate for your industry.</p>
        <div className="radio-group">
          <label><input type="radio" name="wantsReviewSetup" value="yes" checked={data.wantsReviewSetup === 'yes'} onChange={e => update('wantsReviewSetup', e.target.value)} /> Yes</label>
          <label><input type="radio" name="wantsReviewSetup" value="no" checked={data.wantsReviewSetup === 'no'} onChange={e => update('wantsReviewSetup', e.target.value)} /> No</label>
        </div>
      </div>
    </div>
  );
}

function Step8({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  return (
    <div>
      <div className="field">
        <label>Preferred Contact Method</label>
        <div className="radio-group">
          {['Email', 'Phone', 'Text'].map(m => (
            <label key={m}><input type="radio" name="contactMethod" value={m} checked={data.contactMethod === m} onChange={e => update('contactMethod', e.target.value)} /> {m}</label>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Best Time to Reach</label>
        <div className="radio-group">
          {['Morning', 'Afternoon', 'Evening'].map(t => (
            <label key={t}><input type="radio" name="bestTime" value={t} checked={data.bestTime === t} onChange={e => update('bestTime', e.target.value)} /> {t}</label>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Lead Notification Recipient</label>
        <p className="hint">Who should receive alerts when you get a new lead or inquiry?</p>
        <input type="text" value={data.notifName || ''} onChange={e => update('notifName', e.target.value)} placeholder="Name" style={{marginBottom:'8px'}} />
        <input type="email" value={data.notifEmail || ''} onChange={e => update('notifEmail', e.target.value)} placeholder="Email" style={{marginBottom:'8px'}} />
        <input type="tel" value={data.notifPhone || ''} onChange={e => update('notifPhone', e.target.value)} placeholder="Phone" />
      </div>
      <div className="field">
        <label>Additional Notes</label>
        <textarea value={data.notes || ''} onChange={e => update('notes', e.target.value)} rows={5} placeholder="Anything else we should know..." />
      </div>
    </div>
  );
}

const STEPS = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8];

export default function Home() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [clientName, setClientName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('client');
      if (name) setClientName(decodeURIComponent(name));
    }
  }, []);

  const StepComponent = STEPS[step - 1];
  const progress = (step / TOTAL_STEPS) * 100;

  const validate = () => {
    if (step === 1) {
      if (!data.businessName) return 'Business name is required.';
      if (!data.ownerName) return 'Owner name is required.';
      if (!data.email) return 'Email is required.';
      if (!data.phone) return 'Phone is required.';
    }
    if (step === 2) {
      if (!data.googleEmail) return 'Google account email is required.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...data };
      // logo is already base64 in data.logoBase64
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      setSubmitted(true);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Head><title>CoGrow - Thank You</title></Head>
        <div className="page">
          <div className="container success">
            <div className="logo-text">CoGrow</div>
            <h1>You&apos;re all set!</h1>
            <p>Thanks for completing your onboarding. Our team will review your info and be in touch within 1 business day.</p>
            <p style={{color:'#94a3b8', fontSize:'14px'}}>Check your email for a confirmation from hello@cogrow.ai</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CoGrow - Client Onboarding</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="page">
        <div className="container">
          <div className="header">
            <div className="logo-text">CoGrow</div>
            <h1>
              {clientName
                ? `Welcome, ${clientName} - Let's get you set up`
                : 'Client Onboarding'}
            </h1>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-label">Step {step} of {TOTAL_STEPS}: {STEP_TITLES[step - 1]}</div>
          </div>

          <div className="step-content">
            <StepComponent data={data} setData={setData} />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="btn-row">
            {step > 1 && (
              <button className="btn btn-back" onClick={handleBack}>Back</button>
            )}
            {step < TOTAL_STEPS ? (
              <button className="btn btn-next" onClick={handleNext}>Next</button>
            ) : (
              <button className="btn btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #1a1f36;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
        }
        .page {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 24px 16px 60px;
        }
        .container {
          width: 100%;
          max-width: 640px;
          background: #1e2440;
          border-radius: 16px;
          padding: 32px 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .success { text-align: center; padding: 60px 28px; }
        .success h1 { font-size: 28px; margin: 16px 0 12px; }
        .success p { color: #cbd5e1; margin-bottom: 12px; line-height: 1.6; }
        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #f97316;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .header { margin-bottom: 24px; }
        .header h1 { font-size: 22px; font-weight: 700; color: #fff; line-height: 1.3; }
        .progress-bar-wrap { margin-bottom: 28px; }
        .progress-bar-track {
          background: #2d3561;
          border-radius: 99px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progress-bar-fill {
          background: #f97316;
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s ease;
        }
        .progress-label { font-size: 13px; color: #94a3b8; }
        .step-content { margin-bottom: 24px; }
        .field { margin-bottom: 20px; }
        .field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 6px;
        }
        .field input[type="text"],
        .field input[type="email"],
        .field input[type="tel"],
        .field input[type="url"],
        .field input[type="number"],
        .field input[type="time"],
        .field select,
        .field textarea {
          width: 100%;
          background: #2d3561;
          border: 1.5px solid #3d4880;
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus { border-color: #f97316; }
        .field input[type="file"] {
          background: #2d3561;
          border: 1.5px dashed #3d4880;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 14px;
          padding: 12px 14px;
          width: 100%;
          cursor: pointer;
        }
        .field select option { background: #1e2440; }
        .field textarea { resize: vertical; }
        .hint { font-size: 12px; color: #64748b; margin-bottom: 8px; line-height: 1.5; }
        .radio-group { display: flex; gap: 20px; flex-wrap: wrap; }
        .radio-group label { display: flex; align-items: center; gap: 6px; font-size: 15px; cursor: pointer; }
        .checkbox-group { display: flex; gap: 20px; flex-wrap: wrap; }
        .checkbox-group label { display: flex; align-items: center; gap: 6px; font-size: 15px; cursor: pointer; }
        .inline-field { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .inline-field input { width: 80px; flex-shrink: 0; }
        .inline-field span { font-size: 14px; color: #94a3b8; }
        .hours-grid { display: flex; flex-direction: column; gap: 8px; }
        .hours-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .day-label { width: 90px; font-size: 14px; color: #94a3b8; flex-shrink: 0; }
        .closed-check { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #64748b; cursor: pointer; }
        .hours-row input[type="time"] { width: auto; flex: 0 0 auto; }
        .hours-row span { font-size: 13px; color: #64748b; }
        .btn-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; }
        .btn {
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn:active { transform: scale(0.98); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-back {
          background: #2d3561;
          color: #cbd5e1;
        }
        .btn-next, .btn-submit {
          background: #f97316;
          color: #fff;
          margin-left: auto;
        }
        .btn-next:hover, .btn-submit:hover { opacity: 0.9; }
        .error-msg {
          background: #3b1f1f;
          border: 1px solid #dc2626;
          color: #fca5a5;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          margin-bottom: 16px;
        }
        @media (max-width: 480px) {
          .container { padding: 20px 16px; }
          .header h1 { font-size: 18px; }
          .hours-row { flex-wrap: wrap; }
          .day-label { width: 70px; }
        }
      `}</style>
    </>
  );
}
