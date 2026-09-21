// channel.jsx — Channel + fulfillment selector. Plain React + CSS tokens.
//   variant "tabs"     — segmented pill (default)
//   variant "dropdown" — popover menu
//   variant "cards"    — 4-col card grid
// FulfillmentPills + LinkBillBlock are shared across all variants.

const channelStyles = {
  // ── segmented tabs ──
  tabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    padding: 4,
    background: 'var(--bg-subtle)',
    borderRadius: 'var(--d-radius)',
  },
  tab: (active) => ({
    appearance: 'none',
    border: 0,
    background: active ? 'var(--bg-surface)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontFamily: 'inherit',
    fontWeight: active ? 600 : 500,
    fontSize: 'var(--fs-body)',
    padding: '8px 6px',
    minHeight: 36,
    borderRadius: 6,
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
    transition: 'background .12s, color .12s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 0,
  }),

  // ── dropdown ──
  dropWrap: { position: 'relative' },
  dropBtn: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    fontWeight: 600,
    textAlign: 'left',
    minHeight: 46,
  },
  dropIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: 'var(--brand-50)',
    color: 'var(--brand-600)',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
  },
  dropList: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0, right: 0,
    background: 'var(--bg-surface)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
    boxShadow: 'var(--shadow-lg)',
    padding: 4,
    zIndex: 20,
    display: 'flex', flexDirection: 'column',
  },
  dropOpt: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 6,
    background: active ? 'var(--brand-50)' : 'transparent',
    color: active ? 'var(--brand-700)' : 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: active ? 600 : 500,
    border: 0,
    fontFamily: 'inherit',
    textAlign: 'left',
  }),

  // ── card grid ──
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 8,
  },
  card: (active) => ({
    appearance: 'none',
    border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    minHeight: 72,
    fontFamily: 'inherit',
    textAlign: 'left',
    boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 18%, transparent)' : 'none',
    transition: 'border-color .12s, box-shadow .12s',
    minWidth: 0,
  }),
  cardIcon: (active) => ({
    width: 26, height: 26, borderRadius: 6,
    background: active ? 'var(--brand-500)' : 'var(--bg-subtle)',
    color: active ? '#fff' : 'var(--text-secondary)',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
  }),
  cardLabel: {
    fontSize: 13, fontWeight: 600, color: 'inherit',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    width: '100%',
  },
  cardSub: {
    fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    width: '100%',
  },

  // ── fulfillment pills — vertical, narrow-fit ──
  pills: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(0, 1fr)',
    gap: 6,
  },
  pill: (active) => ({
    appearance: 'none',
    border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 0,
    minHeight: 56,
    fontFamily: 'inherit',
    textAlign: 'left',
    boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 16%, transparent)' : 'none',
    transition: 'border-color .12s, box-shadow .12s',
    overflow: 'hidden',
  }),
  pillIcon: (active) => ({
    width: 22, height: 22, borderRadius: 5,
    background: active ? 'var(--brand-500)' : 'var(--bg-subtle)',
    color: active ? '#fff' : 'var(--text-secondary)',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  }),
  pillLabel: {
    fontSize: 13, fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    width: '100%', lineHeight: 1.2,
  },
  pillSub: {
    fontSize: 11, fontWeight: 400,
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    width: '100%', lineHeight: 1.2,
  },

  // ── Sub-channel picker (ONLINE source / LINK_BILL source) ─────────
  subWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  subGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 6,
  },
  subBtn: (active) => ({
    appearance: 'none',
    border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '8px 8px',
    display: 'flex', alignItems: 'center', gap: 8,
    minWidth: 0,
    fontFamily: 'inherit',
    boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 14%, transparent)' : 'none',
    transition: 'border-color .12s, box-shadow .12s',
    cursor: 'pointer',
    textAlign: 'left',
  }),
  subDot: (color) => ({
    width: 18, height: 18,
    borderRadius: 5,
    background: color,
    color: '#fff',
    display: 'grid', placeItems: 'center',
    fontSize: 10, fontWeight: 800,
    flexShrink: 0,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
  }),
  subBody: { display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.15 },
  subLabel: {
    fontSize: 12, fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  subHint: {
    fontSize: 10, color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },

  // ── LINK_BILL ──
  linkBox: {
    display: 'flex', flexDirection: 'column', gap: 8,
    padding: 12,
    background: 'var(--brand-50)',
    border: '1px dashed var(--brand-300)',
    borderRadius: 'var(--d-radius)',
  },
  linkRow: { display: 'flex', gap: 8, alignItems: 'center' },
  phoneInput: {
    flex: 1,
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius-sm)',
    padding: '8px 12px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    color: 'var(--text-primary)',
    minHeight: 38,
    outline: 'none',
  },
  linkMeta: {
    fontSize: 'var(--fs-caption)',
    color: 'var(--brand-700)',
    display: 'flex', alignItems: 'center', gap: 6,
  },
};

function ChannelSelector({ variant, channels, channel, onChannel }) {
  if (variant === 'dropdown') {
    return <ChannelDropdown channels={channels} channel={channel} onChannel={onChannel} />;
  }
  if (variant === 'cards') {
    return (
      <div style={channelStyles.cards}>
        {channels.map(c => {
          const active = c.id === channel;
          return (
            <button key={c.id} style={channelStyles.card(active)} onClick={() => onChannel(c.id)}>
              <span style={channelStyles.cardIcon(active)}><Icon name={c.icon} size={14} /></span>
              <span style={channelStyles.cardLabel}>{c.label}</span>
              <span style={channelStyles.cardSub}>{c.sub}</span>
            </button>
          );
        })}
      </div>
    );
  }
  // tabs (default)
  return (
    <div style={channelStyles.tabs} role="tablist">
      {channels.map(c => {
        const active = c.id === channel;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            style={channelStyles.tab(active)}
            onClick={() => onChannel(c.id)}
          >
            <Icon name={c.icon} size={14} color={active ? 'var(--brand-500)' : 'currentColor'} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChannelDropdown({ channels, channel, onChannel }) {
  const [open, setOpen] = React.useState(false);
  const current = channels.find(c => c.id === channel);
  return (
    <div style={channelStyles.dropWrap}>
      <button style={channelStyles.dropBtn} onClick={() => setOpen(o => !o)}>
        <span style={channelStyles.dropIcon}><Icon name={current.icon} size={18} /></span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span>{current.label}</span>
          <span style={{ fontWeight: 400, fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' }}>{current.sub}</span>
        </span>
        <Icon name="chevD" size={16} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 19 }} />
          <div style={channelStyles.dropList}>
            {channels.map(c => (
              <button
                key={c.id}
                style={channelStyles.dropOpt(c.id === channel)}
                onClick={() => { onChannel(c.id); setOpen(false); }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 6, background: c.id === channel ? 'var(--brand-500)' : 'var(--bg-subtle)', color: c.id === channel ? '#fff' : 'var(--text-secondary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={c.icon} size={15} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{c.label}</span>
                  <span style={{ fontWeight: 400, fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' }}>{c.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FulfillmentPills({ options, value, onChange }) {
  return (
    <div style={channelStyles.pills}>
      {options.map(o => {
        const active = o.id === value;
        return (
          <button key={o.id} style={channelStyles.pill(active)} onClick={() => onChange(o.id)}>
            <span style={channelStyles.pillIcon(active)}><Icon name={o.icon} size={12} /></span>
            <span style={channelStyles.pillLabel}>{o.label}</span>
            <span style={channelStyles.pillSub}>{o.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function LinkBillBlock({ expiryMin }) {
  return (
    <div style={channelStyles.linkBox}>
      <div style={channelStyles.linkMeta}>
        <Icon name="info" size={13} color="var(--brand-700)" />
        <span>
          Buyer fills phone + address on the link. Expires in <b>{expiryMin} min</b>.
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { ChannelSelector, FulfillmentPills, LinkBillBlock, SubChannelPicker });

// Sub-channel picker — used by ONLINE (chat source / marketplace) and
// LINK_BILL (where the link was shared). Maps to backend enums per PAT-2297.
function SubChannelPicker({ options, value, onChange }) {
  return (
    <div style={channelStyles.subGrid}>
      {options.map(o => {
        const active = o.id === value;
        const initial = o.label.charAt(0).toUpperCase();
        return (
          <button key={o.id} style={channelStyles.subBtn(active)} onClick={() => onChange(o.id)}>
            <span style={channelStyles.subDot(o.color)}>{initial}</span>
            <span style={channelStyles.subBody}>
              <span style={channelStyles.subLabel}>{o.label}</span>
              <span style={channelStyles.subHint}>{o.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
