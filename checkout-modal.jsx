// checkout-modal.jsx — Payment modal that opens after pressing Checkout.
// Shows order summary, payment method picker, amount tendered (for cash),
// and a big Confirm payment CTA. Closes on backdrop click / Esc / cancel.

const cmStyles = {
  scrim: {
    position: 'fixed', inset: 0,
    background: 'rgba(15, 23, 42, .45)',
    backdropFilter: 'blur(4px)',
    display: 'grid', placeItems: 'center',
    padding: 24, zIndex: 100,
    animation: 'cm-fade .15s ease',
  },
  modal: {
    width: 'min(560px, 100%)',
    maxHeight: 'min(720px, 92vh)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  head: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--stroke)',
  },
  titleWrap: { flex: 1, display: 'flex', flexDirection: 'column', lineHeight: 1.2 },
  title: { fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text-primary)' },
  subtitle: { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' },
  closeBtn: {
    appearance: 'none', border: 0,
    background: 'transparent',
    width: 32, height: 32, borderRadius: 8,
    display: 'grid', placeItems: 'center',
    color: 'var(--text-secondary)', cursor: 'pointer',
  },

  body: {
    flex: 1, minHeight: 0, overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },

  // Summary block
  summary: {
    background: 'var(--bg-muted)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
    padding: 14,
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    color: 'var(--text-secondary)', fontSize: 'var(--fs-body)',
  },
  summaryDisc: { color: 'var(--emerald-700)' },
  summaryGrand: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    paddingTop: 8, marginTop: 4,
    borderTop: '1px dashed var(--stroke-strong)',
  },
  summaryGrandLbl: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-h4)' },
  summaryGrandVal: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' },

  sectionLabel: {
    fontSize: 11, fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 8,
  },

  // Payment grid
  payments: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 10,
  },
  pay: (active) => ({
    appearance: 'none',
    border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '14px 10px 12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    minHeight: 88,
    fontFamily: 'inherit', fontSize: 'var(--fs-body)', fontWeight: 600,
    boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 16%, transparent)' : 'none',
    transition: 'border-color .12s, box-shadow .12s, background .12s',
    cursor: 'pointer',
  }),
  payIcon: (active) => ({
    width: 32, height: 32, borderRadius: 8,
    background: active ? 'var(--brand-500)' : 'var(--bg-subtle)',
    color: active ? '#fff' : 'var(--text-secondary)',
    display: 'grid', placeItems: 'center',
  }),

  // Tendered (cash) field
  tenderWrap: {
    display: 'flex', flexDirection: 'column', gap: 8,
    padding: 14,
    background: 'var(--bg-muted)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
  },
  tenderRow: { display: 'flex', alignItems: 'center', gap: 10 },
  tenderInput: {
    flex: 1,
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius-sm)',
    padding: '10px 12px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-h4)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textAlign: 'right',
    outline: 'none',
  },
  quickAmts: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  quickAmtBtn: {
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 999,
    padding: '6px 12px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  change: {
    display: 'flex', justifyContent: 'space-between',
    paddingTop: 8, borderTop: '1px dashed var(--stroke-strong)',
  },
  changeLbl: { fontWeight: 600, color: 'var(--text-secondary)' },
  changeVal: (positive) => ({
    fontWeight: 700,
    color: positive ? 'var(--emerald-700)' : 'var(--rose-600)',
    fontFamily: 'inherit', fontSize: 'var(--fs-h4)',
  }),

  // QR placeholder
  qrBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 10,
    padding: 16,
    background: 'var(--bg-muted)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
  },
  qr: {
    width: 180, height: 180,
    background: '#fff',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius-sm)',
    display: 'grid', placeItems: 'center',
    color: 'var(--gray-300)',
  },
  qrAmount: { fontWeight: 700, fontSize: 'var(--fs-h3)', color: 'var(--text-primary)' },
  qrNote: { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' },

  foot: {
    display: 'flex', gap: 10,
    padding: '16px 20px',
    borderTop: '1px solid var(--stroke)',
    background: 'var(--bg-muted)',
  },
  cancelBtn: {
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '0 18px',
    height: 48,
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  confirmBtn: (disabled) => ({
    appearance: 'none',
    flex: 1,
    border: 0,
    background: disabled ? 'var(--bg-subtle)' : 'var(--brand-500)',
    color: disabled ? 'var(--text-tertiary)' : '#fff',
    borderRadius: 'var(--d-radius)',
    height: 48,
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: disabled ? 'none' : '0 4px 14px -2px color-mix(in srgb, var(--brand-500) 45%, transparent)',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
};

// Inject keyframes once.
if (typeof document !== 'undefined' && !document.getElementById('cm-keyframes')) {
  const s = document.createElement('style');
  s.id = 'cm-keyframes';
  s.textContent = `
    @keyframes cm-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cm-pop  { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(s);
}

function CheckoutModal({
  open, onClose, onConfirm,
  channel, channels, paymentMethods,
  payment, setPayment,
  subtotal, vat, discount, total, cartCount,
}) {
  const [tendered, setTendered] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const ch = channels.find(c => c.id === channel);

  const tenderedNum = parseFloat(tendered) || 0;
  const change = tenderedNum - total;
  const isCash = payment === 'cash';
  const isQR   = payment === 'qr';
  const canConfirm = isCash ? tenderedNum >= total : true;

  return (
    <div style={cmStyles.scrim} onClick={onClose}>
      <div
        style={{ ...cmStyles.modal, animation: 'cm-pop .18s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={cmStyles.head}>
          <div style={cmStyles.titleWrap}>
            <span style={cmStyles.title}>Checkout</span>
            <span style={cmStyles.subtitle}>
              {ch.label} · {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button style={cmStyles.closeBtn} onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={cmStyles.body}>
          {/* Order summary */}
          <div style={cmStyles.summary}>
            <div style={cmStyles.summaryRow}>
              <span>Subtotal · {cartCount} items</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div style={{ ...cmStyles.summaryRow, ...cmStyles.summaryDisc }}>
                <span>Member discount (5%)</span>
                <span>−฿{discount.toLocaleString()}</span>
              </div>
            )}
            <div style={cmStyles.summaryRow}>
              <span>VAT 7% (included)</span>
              <span>฿{vat.toLocaleString()}</span>
            </div>
            <div style={cmStyles.summaryGrand}>
              <span style={cmStyles.summaryGrandLbl}>Total due</span>
              <span style={cmStyles.summaryGrandVal}>฿{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <div style={cmStyles.sectionLabel}>Payment method</div>
            <div style={cmStyles.payments}>
              {ch.payments.map(pid => {
                const pm = paymentMethods[pid];
                const active = payment === pid;
                return (
                  <button
                    key={pid}
                    style={cmStyles.pay(active)}
                    onClick={() => setPayment(pid)}
                  >
                    <span style={cmStyles.payIcon(active)}>
                      <Icon name={pm.icon} size={18} />
                    </span>
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method-specific body */}
          {isCash && (
            <div>
              <div style={cmStyles.sectionLabel}>Amount tendered</div>
              <div style={cmStyles.tenderWrap}>
                <div style={cmStyles.tenderRow}>
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>฿</span>
                  <input
                    autoFocus
                    style={cmStyles.tenderInput}
                    type="number"
                    inputMode="decimal"
                    placeholder={total.toString()}
                    value={tendered}
                    onChange={(e) => setTendered(e.target.value)}
                  />
                </div>
                <div style={cmStyles.quickAmts}>
                  {[total, 500, 1000, 2000].filter((v, i, a) => a.indexOf(v) === i).map(v => (
                    <button key={v} style={cmStyles.quickAmtBtn} onClick={() => setTendered(String(v))}>
                      ฿{v.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div style={cmStyles.change}>
                  <span style={cmStyles.changeLbl}>Change</span>
                  <span style={cmStyles.changeVal(change >= 0)}>
                    {change >= 0 ? '+' : ''}฿{Math.abs(change).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isQR && (
            <div>
              <div style={cmStyles.sectionLabel}>Scan to pay</div>
              <div style={cmStyles.qrBox}>
                <div style={cmStyles.qr}>
                  <Icon name="qr" size={64} />
                </div>
                <div style={cmStyles.qrAmount}>฿{total.toLocaleString()}</div>
                <div style={cmStyles.qrNote}>PromptPay · expires in 5:00</div>
              </div>
            </div>
          )}
        </div>

        <div style={cmStyles.foot}>
          <button style={cmStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={cmStyles.confirmBtn(!canConfirm)}
            disabled={!canConfirm}
            onClick={() => canConfirm && onConfirm({ payment, tendered: tenderedNum, change })}
          >
            <Icon name="check" size={16} />
            <span>
              {isCash && tenderedNum > 0
                ? `Confirm · change ฿${Math.max(0, change).toLocaleString()}`
                : `Confirm payment ฿${total.toLocaleString()}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

window.CheckoutModal = CheckoutModal;
