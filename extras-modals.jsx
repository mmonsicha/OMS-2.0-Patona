// extras-modals.jsx — Discount & order note modals reached from the cart's
// "Add discount" / "Order note" buttons. Shared modal chrome with the
// checkout flow (scrim, pop animation, Esc-to-close).

const emStyles = {
  scrim: {
    position: 'fixed', inset: 0,
    background: 'rgba(15, 23, 42, .45)',
    backdropFilter: 'blur(4px)',
    display: 'grid', placeItems: 'center',
    padding: 24, zIndex: 100,
    animation: 'cm-fade .15s ease',
  },
  modal: {
    width: 'min(480px, 100%)',
    maxHeight: 'min(680px, 92vh)',
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
  titleWrap: { flex: 1, display: 'flex', flexDirection: 'column', lineHeight: 1.25 },
  title: { fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-primary)' },
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
    display: 'flex', flexDirection: 'column', gap: 14,
  },

  // Segmented mode picker
  modeRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    padding: 4,
    background: 'var(--bg-subtle)',
    borderRadius: 'var(--d-radius)',
  },
  modeBtn: (active) => ({
    appearance: 'none', border: 0,
    background: active ? 'var(--bg-surface)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    borderRadius: 6,
    padding: '8px 6px',
    fontFamily: 'inherit', fontSize: 'var(--fs-body)',
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    boxShadow: active ? 'var(--shadow-xs)' : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  }),

  sectionLabel: {
    fontSize: 11, fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 6,
  },

  // Input row
  inputWrap: { display: 'flex', alignItems: 'stretch', gap: 0 },
  inputPrefix: {
    minWidth: 44,
    display: 'grid', placeItems: 'center',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--stroke)',
    borderRight: 0,
    borderRadius: 'var(--d-radius) 0 0 var(--d-radius)',
    color: 'var(--text-tertiary)',
    fontWeight: 700, fontSize: 'var(--fs-body-lg)',
  },
  input: (hasPrefix, hasSuffix) => ({
    flex: 1,
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: hasPrefix && hasSuffix ? 0 : hasPrefix ? '0 var(--d-radius) var(--d-radius) 0' : hasSuffix ? 'var(--d-radius) 0 0 var(--d-radius)' : 'var(--d-radius)',
    padding: '10px 14px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-h4)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    outline: 'none',
    minHeight: 44,
    minWidth: 0,
    width: '100%',
  }),
  inputSuffix: {
    minWidth: 44,
    display: 'grid', placeItems: 'center',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--stroke)',
    borderLeft: 0,
    borderRadius: '0 var(--d-radius) var(--d-radius) 0',
    color: 'var(--text-tertiary)',
    fontWeight: 700, fontSize: 'var(--fs-body-lg)',
  },

  // Quick presets
  presets: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  presetBtn: (active) => ({
    appearance: 'none',
    border: `1px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    borderRadius: 999,
    padding: '6px 14px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    fontWeight: 600,
    cursor: 'pointer',
  }),

  // Reason
  reasonWrap: {
    display: 'flex', flexWrap: 'wrap', gap: 6,
  },
  reasonChip: (active) => ({
    appearance: 'none',
    border: `1px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    borderRadius: 999,
    padding: '5px 12px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-caption)',
    fontWeight: 500,
    cursor: 'pointer',
  }),

  // Coupon validation message
  couponMsg: (state) => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 10px',
    fontSize: 'var(--fs-caption)',
    borderRadius: 'var(--d-radius-sm)',
    background:
      state === 'valid'   ? 'var(--emerald-50)' :
      state === 'invalid' ? 'var(--rose-50)' :
      'transparent',
    color:
      state === 'valid'   ? 'var(--emerald-700)' :
      state === 'invalid' ? 'var(--rose-700)' :
      'var(--text-tertiary)',
    fontWeight: 500,
  }),

  // Live preview
  preview: {
    padding: 12,
    background: 'var(--bg-muted)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  previewRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 'var(--fs-body)',
    color: 'var(--text-secondary)',
  },
  previewDisc: { color: 'var(--emerald-700)' },
  previewGrand: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    paddingTop: 6, marginTop: 2,
    borderTop: '1px dashed var(--stroke-strong)',
  },
  previewGrandLbl: { fontWeight: 700, color: 'var(--text-primary)' },
  previewGrandVal: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-h3)' },

  // Textarea (note)
  textarea: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '12px 14px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'vertical',
    minHeight: 120,
    lineHeight: 1.45,
  },
  charCount: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 'var(--fs-caption)',
    color: 'var(--text-tertiary)',
  },
  noteTagsWrap: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  noteTag: {
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    borderRadius: 999,
    padding: '4px 10px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-caption)',
    fontWeight: 500,
    cursor: 'pointer',
  },

  foot: {
    display: 'flex', gap: 10, justifyContent: 'space-between',
    padding: '14px 20px',
    borderTop: '1px solid var(--stroke)',
    background: 'var(--bg-muted)',
  },
  footLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  removeBtn: {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    color: 'var(--rose-700)',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '6px 8px',
  },
  cancelBtn: {
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '0 18px',
    height: 42,
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  applyBtn: (disabled) => ({
    appearance: 'none',
    border: 0,
    background: disabled ? 'var(--bg-subtle)' : 'var(--brand-500)',
    color: disabled ? 'var(--text-tertiary)' : '#fff',
    borderRadius: 'var(--d-radius)',
    padding: '0 18px',
    height: 42,
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    fontWeight: 700,
    boxShadow: disabled ? 'none' : '0 4px 14px -2px color-mix(in srgb, var(--brand-500) 45%, transparent)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  }),
};

// Mock coupon book — real build will validate against API.
const COUPON_BOOK = {
  PATONA10: { kind: 'percent', value: 10, name: '10% off everything' },
  WELCOME:  { kind: 'percent', value: 5,  name: 'Welcome 5% off' },
  FREE50:   { kind: 'amount',  value: 50, name: '฿50 off' },
  STAFF20:  { kind: 'percent', value: 20, name: 'Staff appreciation' },
};

const DISCOUNT_REASONS = ['Manager override', 'Damaged item', 'Price match', 'Loyalty gift', 'Birthday'];

// ── Discount modal ───────────────────────────────────────────
function DiscountModal({ open, onClose, onApply, onRemove, current, subtotal }) {
  const [mode, setMode] = React.useState(current?.kind || 'percent');
  const [pct, setPct]   = React.useState(current?.kind === 'percent' ? String(current.value) : '');
  const [amt, setAmt]   = React.useState(current?.kind === 'amount'  ? String(current.value) : '');
  const [code, setCode] = React.useState(current?.kind === 'coupon'  ? current.code : '');
  const [reason, setReason] = React.useState(current?.reason || '');

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Compute the resulting discount value + a state-of-input flag.
  const pctNum = Math.max(0, Math.min(100, parseFloat(pct) || 0));
  const amtNum = Math.max(0, Math.min(subtotal, parseFloat(amt) || 0));
  const upperCode = (code || '').toUpperCase().trim();
  const coupon = upperCode ? COUPON_BOOK[upperCode] : null;
  const couponState = !upperCode ? 'idle' : coupon ? 'valid' : 'invalid';
  const couponDisc = coupon
    ? coupon.kind === 'percent' ? Math.round(subtotal * coupon.value / 100) : Math.min(subtotal, coupon.value)
    : 0;

  let discountValue = 0;
  let isReady = false;
  if (mode === 'percent') {
    discountValue = Math.round(subtotal * pctNum / 100);
    isReady = pctNum > 0;
  } else if (mode === 'amount') {
    discountValue = amtNum;
    isReady = amtNum > 0;
  } else {
    discountValue = couponDisc;
    isReady = couponState === 'valid';
  }
  const newTotal = Math.max(0, subtotal - discountValue);

  const apply = () => {
    if (!isReady) return;
    if (mode === 'percent') onApply({ kind: 'percent', value: pctNum, amount: discountValue, reason });
    else if (mode === 'amount') onApply({ kind: 'amount', value: amtNum, amount: discountValue, reason });
    else onApply({ kind: 'coupon', code: upperCode, name: coupon.name, amount: discountValue });
    onClose();
  };

  return (
    <div style={emStyles.scrim} onClick={onClose}>
      <div style={{ ...emStyles.modal, animation: 'cm-pop .18s ease' }} onClick={(e) => e.stopPropagation()}>
        <div style={emStyles.head}>
          <span style={{ ...emStyles.titleWrap }}>
            <span style={emStyles.title}>Add discount</span>
            <span style={emStyles.subtitle}>Applied to subtotal ฿{subtotal.toLocaleString()}</span>
          </span>
          <button style={emStyles.closeBtn} onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>

        <div style={emStyles.body}>
          {/* Mode picker */}
          <div style={emStyles.modeRow} role="tablist">
            <button style={emStyles.modeBtn(mode === 'percent')} onClick={() => setMode('percent')}>
              <Icon name="discount" size={14} /> Percent
            </button>
            <button style={emStyles.modeBtn(mode === 'amount')}  onClick={() => setMode('amount')}>
              <Icon name="banknote" size={14} /> Amount
            </button>
            <button style={emStyles.modeBtn(mode === 'coupon')}  onClick={() => setMode('coupon')}>
              <Icon name="receipt" size={14} /> Coupon
            </button>
          </div>

          {/* Percent input */}
          {mode === 'percent' && (
            <div>
              <div style={emStyles.sectionLabel}>Discount percent</div>
              <div style={emStyles.inputWrap}>
                <input
                  autoFocus
                  style={emStyles.input(false, true)}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={pct}
                  onChange={(e) => setPct(e.target.value)}
                />
                <span style={emStyles.inputSuffix}>%</span>
              </div>
              <div style={{ ...emStyles.presets, marginTop: 8 }}>
                {[5, 10, 15, 20, 25, 50].map(v => (
                  <button key={v} style={emStyles.presetBtn(pctNum === v)} onClick={() => setPct(String(v))}>
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount input */}
          {mode === 'amount' && (
            <div>
              <div style={emStyles.sectionLabel}>Discount amount</div>
              <div style={emStyles.inputWrap}>
                <span style={emStyles.inputPrefix}>฿</span>
                <input
                  autoFocus
                  style={emStyles.input(true, false)}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="0"
                  value={amt}
                  onChange={(e) => setAmt(e.target.value)}
                />
              </div>
              <div style={{ ...emStyles.presets, marginTop: 8 }}>
                {[20, 50, 100, 200, 500].map(v => (
                  <button key={v} style={emStyles.presetBtn(amtNum === v)} onClick={() => setAmt(String(v))}>
                    ฿{v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coupon input */}
          {mode === 'coupon' && (
            <div>
              <div style={emStyles.sectionLabel}>Coupon code</div>
              <div style={emStyles.inputWrap}>
                <input
                  autoFocus
                  style={{ ...emStyles.input(false, false), textTransform: 'uppercase', letterSpacing: '.04em' }}
                  type="text"
                  placeholder="ENTER CODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>
              {couponState !== 'idle' && (
                <div style={{ ...emStyles.couponMsg(couponState), marginTop: 8 }}>
                  <Icon name={couponState === 'valid' ? 'check' : 'warn'} size={13} />
                  <span>
                    {couponState === 'valid'
                      ? `${coupon.name} — saves ฿${couponDisc.toLocaleString()}`
                      : 'Invalid or expired coupon'}
                  </span>
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <div style={{ ...emStyles.sectionLabel, marginTop: 6 }}>Try sample codes</div>
                <div style={emStyles.presets}>
                  {Object.keys(COUPON_BOOK).map(c => (
                    <button
                      key={c}
                      style={emStyles.presetBtn(upperCode === c)}
                      onClick={() => setCode(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reason — manager-override-style audit trail */}
          {mode !== 'coupon' && (
            <div>
              <div style={emStyles.sectionLabel}>Reason (optional)</div>
              <div style={emStyles.reasonWrap}>
                {DISCOUNT_REASONS.map(r => (
                  <button
                    key={r}
                    style={emStyles.reasonChip(reason === r)}
                    onClick={() => setReason(reason === r ? '' : r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          <div style={emStyles.preview}>
            <div style={emStyles.previewRow}>
              <span>Subtotal</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ ...emStyles.previewRow, ...emStyles.previewDisc }}>
              <span>Discount</span>
              <span>−฿{discountValue.toLocaleString()}</span>
            </div>
            <div style={emStyles.previewGrand}>
              <span style={emStyles.previewGrandLbl}>New total</span>
              <span style={emStyles.previewGrandVal}>฿{newTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={emStyles.foot}>
          <div style={emStyles.footLeft}>
            {current && (
              <button style={emStyles.removeBtn} onClick={() => { onRemove(); onClose(); }}>
                Remove discount
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={emStyles.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              style={emStyles.applyBtn(!isReady)}
              disabled={!isReady}
              onClick={apply}
            >
              <Icon name="check" size={14} />
              <span>Apply{isReady ? ` −฿${discountValue.toLocaleString()}` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Note modal ───────────────────────────────────────────────
const NOTE_SUGGESTIONS = [
  'Gift wrap',
  'No straw',
  'Less ice',
  'For dine-in',
  'Customer in a rush',
  'Call before delivery',
];

function NoteModal({ open, onClose, onSave, onRemove, current }) {
  const [text, setText] = React.useState(current || '');
  React.useEffect(() => { if (open) setText(current || ''); }, [open, current]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const max = 280;
  const trimmed = text.trim();

  return (
    <div style={emStyles.scrim} onClick={onClose}>
      <div style={{ ...emStyles.modal, animation: 'cm-pop .18s ease' }} onClick={(e) => e.stopPropagation()}>
        <div style={emStyles.head}>
          <span style={emStyles.titleWrap}>
            <span style={emStyles.title}>Order note</span>
            <span style={emStyles.subtitle}>Visible to staff on the pack queue + receipt</span>
          </span>
          <button style={emStyles.closeBtn} onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>

        <div style={emStyles.body}>
          <textarea
            autoFocus
            style={emStyles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, max))}
            placeholder="e.g. Gift wrap with red ribbon, customer pickup at 6pm"
            rows={5}
          />
          <div style={emStyles.charCount}>
            <span>Press Cmd/Ctrl+Enter to save</span>
            <span>{text.length} / {max}</span>
          </div>

          <div>
            <div style={emStyles.sectionLabel}>Quick add</div>
            <div style={emStyles.noteTagsWrap}>
              {NOTE_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  style={emStyles.noteTag}
                  onClick={() => {
                    const next = text.trim() ? `${text.trim()} · ${s}` : s;
                    setText(next.slice(0, max));
                  }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={emStyles.foot}>
          <div style={emStyles.footLeft}>
            {current && (
              <button style={emStyles.removeBtn} onClick={() => { onRemove(); onClose(); }}>
                Clear note
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={emStyles.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              style={emStyles.applyBtn(!trimmed)}
              disabled={!trimmed}
              onClick={() => { onSave(trimmed); onClose(); }}
            >
              <Icon name="check" size={14} />
              <span>Save note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DiscountModal, NoteModal });
