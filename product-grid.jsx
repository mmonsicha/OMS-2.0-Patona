// product-grid.jsx — Left side: search bar, category chips, product grid.
// Plain React + CSS tokens. No web components.

const pgStyles = {
  pane: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 },

  toolbar: {
    display: 'flex', gap: 8, alignItems: 'center',
    padding: 'var(--d-pad-page)', paddingBottom: 8,
    flexShrink: 0,
  },
  search: { position: 'relative', flex: 1 },
  searchIcon: {
    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '10px 12px 10px 40px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body-lg)',
    color: 'var(--text-primary)',
    minHeight: 'var(--d-row-h)',
    outline: 'none',
  },
  scanBtn: {
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '0 14px',
    display: 'flex', alignItems: 'center', gap: 6,
    minHeight: 'var(--d-row-h)',
    fontFamily: 'inherit',
    fontWeight: 500,
  },
  // ── Column-density picker (segmented) ──
  colsGroup: {
    display: 'inline-flex',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)',
    padding: 2,
    gap: 2,
    minHeight: 'var(--d-row-h)',
    flexShrink: 0,
  },
  colsBtn: (active) => ({
    appearance: 'none',
    border: 0,
    background: active ? 'var(--bg-surface)' : 'transparent',
    color: active ? 'var(--brand-600)' : 'var(--text-tertiary)',
    borderRadius: 'calc(var(--d-radius) - 2px)',
    minWidth: 36,
    padding: '0 6px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    fontFamily: 'inherit',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active ? 'var(--shadow-xs)' : 'none',
    transition: 'background .12s, color .12s',
  }),
  kbd: {
    fontSize: 11, padding: '2px 6px',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--stroke)',
    borderRadius: 4,
    color: 'var(--text-tertiary)',
    fontFamily: 'ui-monospace, monospace',
  },

  chips: {
    display: 'flex', gap: 6, overflowX: 'auto', overflowY: 'hidden',
    padding: '4px var(--d-pad-page) 8px',
    flexShrink: 0,
    scrollbarWidth: 'none',
  },
  chip: (active) => ({
    appearance: 'none',
    border: `1px solid ${active ? 'transparent' : 'var(--stroke)'}`,
    background: active ? 'var(--text-primary)' : 'var(--bg-surface)',
    color: active ? 'var(--bg-surface)' : 'var(--text-secondary)',
    borderRadius: 999,
    padding: '6px 12px',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }),

  grid: {
    flex: 1, minHeight: 0, overflowY: 'auto',
    padding: '4px var(--d-pad-page) var(--d-pad-page)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
    alignContent: 'start',
  },

  card: (disabled) => ({
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: 10,
    display: 'flex', flexDirection: 'column', gap: 8,
    textAlign: 'left', fontFamily: 'inherit',
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform .08s, box-shadow .12s, border-color .12s',
    position: 'relative',
    minWidth: 0,
  }),
  swatch: (color) => ({
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: 'var(--d-radius-sm)',
    background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 60%, #000) 100%)`,
    position: 'relative', overflow: 'hidden',
  }),
  initials: {
    position: 'absolute', inset: 0,
    display: 'grid', placeItems: 'center',
    color: 'rgba(255,255,255,.85)',
    fontWeight: 700, fontSize: 22, letterSpacing: '.06em',
    textShadow: '0 1px 2px rgba(0,0,0,.2)',
  },
  stockBadge: (low, oos) => ({
    position: 'absolute', top: 6, right: 6,
    fontSize: 11, fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    background: oos ? 'var(--rose-500)' : low ? 'var(--amber-500)' : 'rgba(255,255,255,.92)',
    color: oos || low ? '#fff' : 'var(--text-secondary)',
    backdropFilter: 'blur(4px)',
  }),
  name: {
    fontWeight: 600, fontSize: 'var(--fs-body)',
    color: 'var(--text-primary)', lineHeight: 1.25,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden', minHeight: 'calc(2 * 1.25em)',
  },
  meta: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 },
  price: { fontWeight: 700, fontSize: 'var(--fs-h4)', color: 'var(--text-primary)' },
  sku: { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)', fontFamily: 'ui-monospace, monospace' },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: 60, color: 'var(--text-tertiary)', gap: 8,
  },
};

// Small glyph used by the column-density picker — N vertical bars matching the
// columns layout, so 3 bars / 4 bars / 5 bars reads instantly.
function ColsGlyph({ n, active }) {
  const fill = active ? 'var(--brand-500)' : 'var(--text-tertiary)';
  const bars = [];
  for (let i = 0; i < n; i++) bars.push(i);
  return (
    <svg width={n * 3 + (n - 1) * 1.5 + 2} height="12" viewBox={`0 0 ${n * 3 + (n - 1) * 1.5 + 2} 12`}>
      {bars.map(i => (
        <rect
          key={i}
          x={1 + i * 4.5}
          y={1}
          width={3}
          height={10}
          rx={1}
          fill={fill}
        />
      ))}
    </svg>
  );
}

function ProductCard({ p, onAdd }) {
  const oos = p.stock === 0;
  const low = !oos && p.stock <= 6;
  const initials = p.name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <button
      style={pgStyles.card(oos)}
      disabled={oos}
      onClick={() => !oos && onAdd(p)}
      onMouseEnter={(e) => { if (!oos) { e.currentTarget.style.borderColor = 'var(--brand-300)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--stroke)'; e.currentTarget.style.boxShadow = 'none'; }}
      onMouseDown={(e) => { if (!oos) e.currentTarget.style.transform = 'scale(0.985)'; }}
      onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={pgStyles.swatch(p.swatch)}>
        <span style={pgStyles.initials}>{initials}</span>
        <span style={pgStyles.stockBadge(low, oos)}>
          {oos ? 'Out' : low ? `Low · ${p.stock}` : p.stock}
        </span>
      </div>
      <span style={pgStyles.name}>{p.name}</span>
      <span style={pgStyles.meta}>
        <span style={pgStyles.price}>฿{p.price.toLocaleString()}</span>
        <span style={pgStyles.sku}>{p.sku}</span>
      </span>
    </button>
  );
}

function ProductGrid({ products, categories, onAdd }) {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [cols, setCols] = React.useState(4);

  const filtered = products.filter(p => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t);
  });

  return (
    <div style={pgStyles.pane}>
      <div style={pgStyles.toolbar}>
        <div style={pgStyles.search}>
          <span style={pgStyles.searchIcon}><Icon name="search" size={18} /></span>
          <input
            style={pgStyles.searchInput}
            placeholder="Search products by name or SKU..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button style={pgStyles.scanBtn}>
          <Icon name="barcode" size={18} />
          <span>Scan</span>
          <span style={pgStyles.kbd}>F2</span>
        </button>
        <div style={pgStyles.colsGroup} role="radiogroup" aria-label="Products per row">
          {[3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={cols === n}
              title={`${n} per row`}
              style={pgStyles.colsBtn(cols === n)}
              onClick={() => setCols(n)}
            >
              <ColsGlyph n={n} active={cols === n} />
            </button>
          ))}
        </div>
      </div>

      <div style={pgStyles.chips}>
        {categories.map(c => (
          <button key={c.id} style={pgStyles.chip(c.id === cat)} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div
        style={{
          ...pgStyles.grid,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
        className="scroll-y"
      >
        {filtered.length === 0 ? (
          <div style={pgStyles.emptyState}>
            <Icon name="search" size={32} color="var(--gray-400)" />
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No products match "{q}"</div>
            <div style={{ fontSize: 'var(--fs-caption)' }}>Try a different keyword or scan a barcode.</div>
          </div>
        ) : (
          filtered.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} />)
        )}
      </div>
    </div>
  );
}

window.ProductGrid = ProductGrid;
