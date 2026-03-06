import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './BookingPage.module.css';

const STEPS         = ['Review', 'Donation', 'Payment'];
const DONATION_OPTS = [0, 51, 101, 251, 501, 1001];

export default function BookingPage() {
  const { slotId } = useParams();
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const slot   = state?.slot;
  const temple = state?.temple;

  const [step,      setStep]      = useState(0);
  const [devotees,  setDevotees]  = useState(1);
  const [special,   setSpecial]   = useState('');
  const [donation,  setDonation]  = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [card,      setCard]      = useState({ num: '', name: '', expiry: '', cvv: '' });
  const [upiId,     setUpiId]     = useState('');
  const [loading,   setLoading]   = useState(false);

  if (!slot || !temple) {
    return (
      <div className="empty-state" style={{ paddingTop: 100 }}>
        <div className="eso">🎟️</div>
        <h3>Invalid booking session</h3>
        <p>Please select a slot from a temple page.</p>
      </div>
    );
  }

  const ticketAmt  = slot.pricePerDevotee * devotees;
  const serviceFee = 20;
  const totalAmt   = ticketAmt + donation + serviceFee;

  const Summary = () => (
    <div className={styles.summary}>
      <div className={styles.summaryTemple}>
        {temple.emoji} {temple.name}
      </div>
      {[
        ['Date',        slot.date],
        ['Time',        `${slot.startTime} – ${slot.endTime}`],
        ['Devotees',    `${devotees} devotee${devotees > 1 ? 's' : ''}`],
        ['Ticket',      `₹${slot.pricePerDevotee} × ${devotees} = ₹${ticketAmt}`],
        ...(donation > 0 ? [['Donation', `₹${donation}`]] : []),
        ['Service Fee', '₹20'],
      ].map(([l, v]) => (
        <div key={l} className={styles.summaryRow}>
          <span className={styles.summaryLbl}>{l}</span>
          <span className={styles.summaryVal}>{v}</span>
        </div>
      ))}
      <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
        <span>Total Payable</span>
        <span className={styles.summaryPrice}>₹{totalAmt}</span>
      </div>
    </div>
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        slotId,
        templeId:       temple._id,
        devotees,
        donationAmount: donation,
        paymentMethod:  payMethod,
        specialRequests: special,
      });
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking-success/${res.data.booking._id}`, {
        state: { booking: res.data.booking, temple },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <span className="eyebrow">✦ Darshan Booking</span>
        <h1>Book Your Slot</h1>
        <p>{temple.name} — {slot.date}</p>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 660 }}>

          {/* Step indicator */}
          <div className={styles.steps}>
            {STEPS.map((label, i) => (
              <div key={label} className={styles.stepItem} style={{ flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div className={`${styles.stepNum} ${i < step ? styles.done : i === step ? styles.active : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />
                )}
              </div>
            ))}
          </div>

          <div className="card card-body">

            {/* ── Step 0: Review ── */}
            {step === 0 && (
              <>
                <h3 className="card-title" style={{ marginBottom: 20 }}>Review Details</h3>
                <div className="form-group">
                  <label className="form-label">Number of Devotees</label>
                  <select
                    className="form-control"
                    value={devotees}
                    onChange={(e) => setDevotees(Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} Devotee{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests (optional)</label>
                  <input
                    className="form-control"
                    placeholder="Wheelchair access, prasad, etc."
                    value={special}
                    onChange={(e) => setSpecial(e.target.value)}
                  />
                </div>
                <Summary />
                <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep(1)}>
                  Continue →
                </button>
              </>
            )}

            {/* ── Step 1: Donation ── */}
            {step === 1 && (
              <>
                <h3 className="card-title" style={{ marginBottom: 6 }}>Make a Donation 🙏</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                  Your contribution helps maintain the temple.
                </p>
                <div className={styles.donationGrid}>
                  {DONATION_OPTS.map((amt) => (
                    <button
                      key={amt}
                      className={`${styles.donationBtn} ${donation === amt ? styles.donationSelected : ''}`}
                      onClick={() => setDonation(amt)}
                    >
                      {amt === 0 ? 'Skip' : `₹${amt}`}
                    </button>
                  ))}
                </div>
                <Summary />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <>
                <h3 className="card-title" style={{ marginBottom: 18 }}>Payment</h3>
                <Summary />

                <label className="form-label" style={{ marginBottom: 10 }}>Payment Method</label>
                <div className={styles.payMethods}>
                  {[
                    ['card',       '💳', 'Credit / Debit Card'],
                    ['upi',        '📱', 'UPI / GPay'],
                    ['netbanking', '🏦', 'Net Banking'],
                    ['wallet',     '👛', 'Wallet'],
                  ].map(([id, icon, lbl]) => (
                    <div
                      key={id}
                      className={`${styles.payMethod} ${payMethod === id ? styles.paySelected : ''}`}
                      onClick={() => setPayMethod(id)}
                    >
                      <span className={styles.payIcon}>{icon}</span>
                      <span className={styles.payLabel}>{lbl}</span>
                    </div>
                  ))}
                </div>

                {/* Card fields */}
                {payMethod === 'card' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        className="form-control"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={card.num}
                        onChange={(e) =>
                          setCard((p) => ({
                            ...p,
                            num: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim(),
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input className="form-control" placeholder="Name on card" value={card.name} onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry (MM/YY)</label>
                        <input className="form-control" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard((p) => ({ ...p, expiry: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input type="password" className="form-control" placeholder="•••" maxLength={3} value={card.cvv} onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))} />
                      </div>
                    </div>
                  </>
                )}

                {payMethod === 'upi' && (
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input className="form-control" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  </div>
                )}

                {payMethod === 'netbanking' && (
                  <div className="form-group">
                    <label className="form-label">Select Bank</label>
                    <select className="form-control">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)} disabled={loading}>
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className={styles.btnSpinner} /> Processing…</>
                    ) : (
                      `Pay ₹${totalAmt} & Confirm`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}