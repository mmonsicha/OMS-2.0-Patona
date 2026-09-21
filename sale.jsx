// sale.jsx — Patona OMS 2.0 Sale page.
// Layout: left sidebar (nav) + main column (header, optional store bar,
// product grid + cart pane). Owns global state for channel, cart, customer.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "selectorPattern": "tabs",
  "layout": "cart-right",
  "density": "regular",
  "theme": "light",
  "showStoreBar": true,
  "sidebarCollapsed": false,
  "primary": "#EC5E2A"
}/*EDITMODE-END*/;

const D = window.SALE_DATA;
const VAT_RATE = 0.07;

// Sidebar nav model — grouped by purpose so we can render section headers.
const NAV_GROUPS = [
  {
    id: 'selling',
    label: 'Selling',
    items: [
      { id: 'sale',      label: 'Sale',       icon: 'cart' },
      { id: 'orders',    label: 'Orders',     icon: 'receipt' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'packQueue', label: 'Pack Queue', icon: 'package', badge: 12 },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    items: [
      { id: 'products',  label: 'Products',   icon: 'grid' },
      { id: 'customers', label: 'Customers',  icon: 'customer' },
    ],
  },
];

// Sellsuki product family for the app switcher.
const SELLSUKI_APPS = [
  { id: 'patona',    label: 'Patona',     sub: 'OMS', icon: 'cart',     color: 'linear-gradient(135deg, #F58249, #B23C12)' },
  { id: 'ccs3',      label: 'CCS3',       sub: 'CRM', icon: 'customer', color: 'linear-gradient(135deg, #2E90FA, #175CD3)' },
  { id: 'akita',     label: 'Akita',      sub: 'PIS', icon: 'package',  color: 'linear-gradient(135deg, #12B76A, #027A48)' },
  { id: 'sukipay',   label: 'SukiPay',    sub: 'Pay', icon: 'card',     color: 'linear-gradient(135deg, #7A5AE0, #5B3FB8)' },
  { id: 'shipmunk',  label: 'Shipmunk',   sub: 'Ship', icon: 'truck',   color: 'linear-gradient(135deg, #F79009, #B54708)' },
  { id: 'oc2plus',   label: 'OC2 Plus',   sub: 'POS', icon: 'store',    color: 'linear-gradient(135deg, #475467, #1F2937)' },
];

const NOTIFICATIONS_SEED = [
  { id: 'n1', tone: 'rose',    icon: 'warn',    unread: true,  title: 'Pack Queue backed up', text: '12 orders waiting > 30 min. Reroute or add staff.', time: '2 min ago' },
  { id: 'n2', tone: 'amber',   icon: 'package', unread: true,  title: 'Low stock alert',      text: 'Almond Tart · 5 left at Sukhumvit 49.',              time: '14 min ago' },
  { id: 'n3', tone: 'emerald', icon: 'check',   unread: false, title: 'Daily target hit',     text: 'Sukhumvit 49 reached ฿42k by 14:00.',                time: '1 hr ago' },
  { id: 'n4', tone: 'sky',     icon: 'truck',   unread: false, title: 'Parcel delivered',     text: 'Order #2845 delivered to Praewa S.',                time: '2 hr ago' },
];

const appStyles = {
  shell: {
    display: 'flex',
    height: '100vh',
    background: 'var(--bg-page)',
    color: 'var(--text-primary)',
    overflow: 'hidden',
  },

  // ── Sidebar ──────────────────────────────────────────────
  sidebar: (collapsed) => ({
    width: collapsed ? 64 : 220,
    flexShrink: 0,
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--stroke)',
    display: 'flex', flexDirection: 'column',
    transition: 'width .15s ease',
    overflow: 'hidden',
  }),
  sidebarBrand: (collapsed) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: collapsed ? '0' : '0 16px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderBottom: '1px solid var(--stroke)',
    height: 57,
    flexShrink: 0,
  }),
  sidebarBrandText: { display: 'flex', flexDirection: 'column', lineHeight: 1.15, overflow: 'hidden', minWidth: 0 },
  sidebarNav: {
    flex: 1,
    padding: '8px 8px',
    display: 'flex', flexDirection: 'column', gap: 2,
    overflowY: 'auto',
  },
  navGroup: {
    fontSize: 10, fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    padding: '12px 12px 6px',
  },
  navItem: (active, collapsed) => ({
    appearance: 'none', border: 0,
    background: active ? 'var(--brand-50)' : 'transparent',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    fontWeight: active ? 600 : 500,
    padding: collapsed ? '10px 0' : '8px 12px',
    borderRadius: 'var(--d-radius)',
    display: 'flex', alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: 12,
    minHeight: 40,
    cursor: 'pointer',
    position: 'relative',
    width: '100%',
    textAlign: 'left',
  }),
  navItemLabel: { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  navBadge: {
    fontSize: 11, fontWeight: 700,
    padding: '2px 7px',
    background: 'var(--rose-500)',
    color: '#fff',
    borderRadius: 999,
    lineHeight: 1.4,
  },
  navBadgeCollapsed: {
    position: 'absolute', top: 4, right: 6,
    fontSize: 9, fontWeight: 700,
    padding: '1px 5px',
    background: 'var(--rose-500)',
    color: '#fff',
    borderRadius: 999,
    lineHeight: 1.4,
    minWidth: 14,
    textAlign: 'center',
  },
  sidebarFoot: {
    padding: 8,
    borderTop: '1px solid var(--stroke)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },

  // ── Main column ──────────────────────────────────────────
  mainColumn: {
    flex: 1, minWidth: 0,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },

  topbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '0 20px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--stroke)',
    flexShrink: 0,
    height: 57,
  },
  pageTitle: { fontWeight: 700, fontSize: 'var(--fs-h4)', color: 'var(--text-primary)' },
  pageSub:   { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' },
  navRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 },
  topIconBtn: {
    appearance: 'none', border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    width: 36, height: 36, borderRadius: 8,
    display: 'grid', placeItems: 'center',
    color: 'var(--text-secondary)',
    position: 'relative',
  },
  staffPill: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '4px 4px 4px 10px',
    border: '1px solid var(--stroke)',
    borderRadius: 999,
    color: 'var(--text-secondary)',
    fontSize: 'var(--fs-body)',
  },
  staffAvatar: {
    width: 26, height: 26, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
    color: '#fff', display: 'grid', placeItems: 'center',
    fontWeight: 700, fontSize: 11,
  },

  storeBar: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '8px 20px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--stroke)',
    fontSize: 'var(--fs-body)',
    color: 'var(--text-secondary)',
    flexShrink: 0,
    minHeight: 40,
  },
  storeChip: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontWeight: 600, color: 'var(--text-primary)',
  },
  storeDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-500)' },
  storeMeta: { color: 'var(--text-tertiary)' },

  // ── Store switcher (top bar) ──
  storeSwitch: { position: 'relative' },
  storeSwitchBtn: (open) => ({
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: open ? 'var(--bg-subtle)' : 'var(--bg-surface)',
    borderRadius: 999,
    padding: '4px 12px 4px 4px',
    display: 'flex', alignItems: 'center', gap: 10,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    minHeight: 40,
    cursor: 'pointer',
    transition: 'background .12s, border-color .12s, box-shadow .12s',
    boxShadow: open ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 14%, transparent)' : 'none',
  }),
  storeSwitchIcon: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
    color: '#fff',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
  },
  storeSwitchText: { display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0, textAlign: 'left', gap: 2 },
  storeSwitchName: { fontWeight: 600, fontSize: 'var(--fs-body)', color: 'var(--text-primary)', whiteSpace: 'nowrap' },
  storeSwitchMeta: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 11, color: 'var(--text-tertiary)',
  },
  storeSwitchDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: 'var(--emerald-500)',
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--emerald-500) 25%, transparent)',
    flexShrink: 0,
  },
  storeSwitchChev: (open) => ({
    display: 'inline-flex',
    transform: open ? 'rotate(180deg)' : 'rotate(0)',
    transition: 'transform .15s ease',
    color: 'var(--text-tertiary)',
  }),

  storeMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 340,
    background: 'var(--bg-surface)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: 6,
    zIndex: 50,
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  storeMenuHd: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 10, fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    padding: '10px 10px 6px',
  },
  storeMenuItem: (active) => ({
    appearance: 'none', border: 0,
    background: active ? 'var(--brand-50)' : 'transparent',
    borderRadius: 8,
    padding: '8px 10px',
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    width: '100%',
    transition: 'background .1s',
  }),
  storeMenuItemIcon: (active) => ({
    width: 32, height: 32, borderRadius: '50%',
    background: active
      ? 'linear-gradient(135deg, var(--brand-400), var(--brand-600))'
      : 'var(--bg-subtle)',
    color: active ? '#fff' : 'var(--text-secondary)',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
    boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,.25)' : 'none',
  }),
  storeMenuItemTextWrap: { flex: 1, display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0, gap: 2 },
  storeMenuItemName: { fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--fs-body)' },
  storeMenuItemMeta: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)',
  },

  body: { flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' },
  bodyReverse: { flexDirection: 'row-reverse' },

  topChannelBar: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 20px',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--stroke)',
    flexShrink: 0,
  },
  topChLabel: {
    fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
    textTransform: 'uppercase', letterSpacing: '.08em',
  },
};

// ── Sidebar component ──────────────────────────────────────
function Sidebar({ collapsed, onToggle, activeId }) {
  // Track which groups are expanded. Default: everything open so the cashier
  // sees all nav at a glance; user can collapse groups they don't need.
  const [openGroups, setOpenGroups] = React.useState(
    () => Object.fromEntries(NAV_GROUPS.map(g => [g.id, true]))
  );
  const toggleGroup = (id) => setOpenGroups(s => ({ ...s, [id]: !s[id] }));

  return (
    <aside style={appStyles.sidebar(collapsed)}>
      <div style={appStyles.sidebarBrand(collapsed)}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--brand-500)', color: '#fff',
          display: 'grid', placeItems: 'center',
          fontWeight: 800, fontSize: 17, flexShrink: 0,
        }}>P</div>
        {!collapsed && (
          <div style={appStyles.sidebarBrandText}>
            <span style={{ fontWeight: 700, fontSize: 'var(--fs-body-lg)' }}>Patona</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Sellercenter</span>
          </div>
        )}
      </div>

      <nav style={appStyles.sidebarNav} className="scroll-y">
        {NAV_GROUPS.map((g, gi) => {
          const isOpen = openGroups[g.id];
          return (
            <React.Fragment key={g.id}>
              {!collapsed && (
                <button
                  style={{
                    ...appStyles.navGroup,
                    appearance: 'none', border: 0, background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  onClick={() => toggleGroup(g.id)}
                  aria-expanded={isOpen}
                >
                  <span>{g.label}</span>
                  <span style={{ transform: isOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform .15s ease', display: 'inline-flex' }}>
                    <Icon name="chevD" size={12} />
                  </span>
                </button>
              )}
              {collapsed && gi > 0 && <div style={{ height: 1, background: 'var(--stroke)', margin: '6px 12px' }} />}
              {(collapsed || isOpen) && g.items.map(it => {
                const active = it.id === activeId;
                return (
                  <button
                    key={it.id}
                    style={appStyles.navItem(active, collapsed)}
                    title={collapsed ? it.label : undefined}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon name={it.icon} size={collapsed ? 20 : 18} />
                    {!collapsed && <span style={appStyles.navItemLabel}>{it.label}</span>}
                    {!collapsed && it.badge && <span style={appStyles.navBadge}>{it.badge}</span>}
                    {collapsed && it.badge && <span style={appStyles.navBadgeCollapsed}>{it.badge}</span>}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </nav>

      <div style={appStyles.sidebarFoot}>
        <button
          style={appStyles.navItem(false, collapsed)}
          title={collapsed ? 'Expand sidebar' : undefined}
          onClick={onToggle}
        >
          <Icon name={collapsed ? 'chevR' : 'chevL'} size={18} />
          {!collapsed && <span style={appStyles.navItemLabel}>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Store switcher (top bar) ───────────────────────────────
function StoreSwitcher({ stores, activeId, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const current = stores.find(s => s.id === activeId);
  const shortName = (current.label.split('—').pop() || current.label).trim();
  const closesAt = current.hours.match(/until\s+(\S+)/)?.[1] || '';

  return (
    <div style={appStyles.storeSwitch}>
      <button
        style={appStyles.storeSwitchBtn(open)}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'var(--bg-surface)'; }}
      >
        <span style={appStyles.storeSwitchIcon}><Icon name="store" size={15} /></span>
        <span style={appStyles.storeSwitchText}>
          <span style={appStyles.storeSwitchName}>{shortName}</span>
          <span style={appStyles.storeSwitchMeta}>
            <span style={appStyles.storeSwitchDot} />
            <span>Open · closes {closesAt}</span>
          </span>
        </span>
        <span style={appStyles.storeSwitchChev(open)}>
          <Icon name="chevD" size={14} />
        </span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
          <div style={appStyles.storeMenu}>
            <div style={appStyles.storeMenuHd}>
              <span>Switch store</span>
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 0, textTransform: 'none', fontSize: 11 }}>
                {stores.length} locations
              </span>
            </div>
            {stores.map(s => {
              const active = s.id === activeId;
              const short = (s.label.split('—').pop() || s.label).trim();
              return (
                <button
                  key={s.id}
                  style={appStyles.storeMenuItem(active)}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  onClick={() => { onSelect(s.id); setOpen(false); }}
                >
                  <span style={appStyles.storeMenuItemIcon(active)}><Icon name="store" size={15} /></span>
                  <span style={appStyles.storeMenuItemTextWrap}>
                    <span style={appStyles.storeMenuItemName}>{short}</span>
                    <span style={appStyles.storeMenuItemMeta}>
                      <span style={{ ...appStyles.storeSwitchDot, width: 4, height: 4 }} />
                      <span>{s.hours}</span>
                    </span>
                  </span>
                  {active && (
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--brand-500)', color: '#fff',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      <Icon name="check" size={12} />
                    </span>
                  )}
                </button>
              );
            })}
            <div style={{ height: 1, background: 'var(--stroke)', margin: '4px 6px' }} />
            <button
              style={appStyles.storeMenuItem(false)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={appStyles.storeMenuItemIcon(false)}><Icon name="settings" size={14} /></span>
              <span style={appStyles.storeMenuItemTextWrap}>
                <span style={{ ...appStyles.storeMenuItemName, color: 'var(--text-secondary)' }}>Manage stores</span>
                <span style={appStyles.storeMenuItemMeta}>Add, edit, transfer staff</span>
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [channel, setChannel]         = React.useState('POS');
  const [storeId, setStoreId]         = React.useState('s01');
  const currentStore = D.stores.find(s => s.id === storeId);
  const [fulfillment, setFulfillment] = React.useState(D.channels[0].fulfillment[0].id);
  const [subChannel, setSubChannel]   = React.useState(null);
  const [payment, setPayment]         = React.useState('cash');
  const [phone, setPhone]             = React.useState('');
  const [customer, setCustomerId]     = React.useState('c001');
  // Shipping is always N groups (N >= 1, starting at 1) — each with its own
  // address + courier + fee. Every cart line belongs to exactly one group
  // via `groupId`. `groupOrderMode` is off by default: the cashier sees the
  // plain, original single-destination flow (one address, one shipping
  // row) and nothing about groups. Only tapping "สร้างคำสั่งขายกลุ่ม" opts
  // into splitting the order into multiple sale-order groups — each still
  // paid together as one order/summary, just with separate address/courier/
  // fee per group. Dropping back to 1 group exits group mode automatically,
  // so the old single-destination flow is always just a removal away.
  const [shipGroups, setShipGroups]   = React.useState([
    { id: 'g1', addressId: null, courierId: null, fee: '', pickupStoreId: storeId, fulfillmentId: D.channels[0].fulfillment[0].id },
  ]);
  const [groupOrderMode, setGroupOrderMode] = React.useState(false);
  // Which group newly-tapped products land in. Picking a product from the
  // grid always adds to this group, so the flow is: create groups first,
  // tap the one you want to fill, then shop for it — instead of adding
  // everything then reassigning after the fact.
  const [activeGroupId, setActiveGroupId] = React.useState('g1');
  const onChangeCustomer = (cid) => {
    setCustomerId(cid);
    const cust = D.customers.find(c => c.id === cid);
    const defaultAddressId = cust.addresses[0] ? cust.addresses[0].id : null;
    setShipGroups(prev => prev.map(g => ({ ...g, addressId: defaultAddressId })));
  };
  const addShipGroup = () => {
    const ch = D.channels.find(c => c.id === channel);
    const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
    setShipGroups(prev => [
      ...prev,
      { id: newId, addressId: null, courierId: null, fee: '', pickupStoreId: storeId, fulfillmentId: ch.fulfillment[0].id },
    ]);
    setActiveGroupId(newId);
  };
  const enableGroupOrderMode = () => {
    setGroupOrderMode(true);
    addShipGroup();
  };
  const removeShipGroup = (gid) => {
    setShipGroups(prev => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter(g => g.id !== gid);
      const fallbackId = remaining[0].id;
      setCart(cur => cur.map(i => i.groupId === gid ? { ...i, groupId: fallbackId } : i));
      if (activeGroupId === gid) setActiveGroupId(fallbackId);
      if (remaining.length === 1) setGroupOrderMode(false);
      return remaining;
    });
  };
  const setGroupField = (gid, patch) => {
    setShipGroups(prev => prev.map(g => g.id === gid ? { ...g, ...patch } : g));
  };
  // Suggested fulfillment for a group based on what's in it — service items
  // are always an on-site visit, an all-digital group never needs a courier
  // trip, otherwise fall back to the channel's default. Only applied the
  // moment a group goes from empty to non-empty, so it never fights a
  // cashier's manual override once they've picked one for that group.
  const suggestFulfillmentId = (ch, items) => {
    if (items.some(i => i.cat === 'service')) return 'ON_SITE';
    if (items.length > 0 && items.every(i => i.cat === 'digital')) return 'DIGITAL';
    return ch.fulfillment[0].id;
  };
  // Drag-and-drop between groups (in the drawer) — blocked if it would mix
  // a digital item into a group with non-digital items or vice versa; the
  // rule holds no matter how the item got there. Addressed by `lineId`, not
  // product id, since the same product can now have a line in more than one
  // group at once.
  const setItemGroup = (lineId, groupId) => {
    setCart(prev => {
      const movingItem = prev.find(i => i.lineId === lineId);
      if (!movingItem) return prev;
      const targetItems = prev.filter(i => i.groupId === groupId && i.lineId !== lineId);
      const targetHasDigital = targetItems.some(i => i.cat === 'digital');
      const targetHasOther = targetItems.some(i => i.cat !== 'digital');
      const movingIsDigital = movingItem.cat === 'digital';
      if ((movingIsDigital && targetHasOther) || (!movingIsDigital && targetHasDigital)) {
        return prev; // would mix digital with physical/service — reject
      }
      const wasEmpty = targetItems.length === 0;
      const next = prev.map(i => i.lineId === lineId ? { ...i, groupId } : i);
      // A service item dropped into a group always makes it an on-site
      // visit, whether the group was empty or already had other items —
      // same rule as addToCart below.
      const ch = D.channels.find(c => c.id === channel);
      const forced = movingItem.cat === 'service' ? 'ON_SITE' : (wasEmpty ? suggestFulfillmentId(ch, [movingItem]) : null);
      if (forced) {
        setShipGroups(gs => gs.map(g => g.id === groupId ? { ...g, fulfillmentId: forced } : g));
        if (!groupOrderMode) setFulfillment(forced);
      }
      return next;
    });
  };
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [notifOpen, setNotifOpen]     = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [appsOpen, setAppsOpen]       = React.useState(false);
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS_SEED);
  const [manualDiscount, setManualDiscount] = React.useState(null);
  const [orderNote, setOrderNote] = React.useState('');
  const [discountOpen, setDiscountOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [cart, setCart]               = React.useState([]);
  React.useEffect(() => {
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.theme   = t.theme;
  }, [t.density, t.theme]);

  const onChangeChannel = (cid) => {
    setChannel(cid);
    const ch = D.channels.find(c => c.id === cid);
    setFulfillment(ch.fulfillment[0].id);
    setPayment(ch.payments[0]);
    // Default sub-channel to the first option (e.g. LINE_OA for ONLINE, LINE
    // for LINK_BILL); leave null when channel has no sub-channels (POS).
    setSubChannel(ch.subChannels ? ch.subChannels[0].id : null);
    // Each group's fulfillment options come from the channel's own list, so
    // re-suggest per group's current items against the new channel.
    setShipGroups(prev => prev.map(g => ({
      ...g,
      fulfillmentId: suggestFulfillmentId(ch, cart.filter(i => i.groupId === g.id)),
    })));
  };

  // Digital items never share a group with physical/service ones — always
  // their own digital-only group, regardless of which group is "active".
  // Finds an existing all-digital (or empty) group to reuse before creating
  // a fresh one, and flips on group order mode automatically if that's what
  // it takes (the no-mixing rule holds even if the cashier never opted in).
  const pickGroupForItem = (p, cur) => {
    const isDigital = p.cat === 'digital';
    const itemsOf = (gid) => cur.filter(i => i.groupId === gid);
    const isAllDigital = (g) => {
      const items = itemsOf(g.id);
      return items.length > 0 && items.every(i => i.cat === 'digital');
    };
    const isEmpty = (g) => itemsOf(g.id).length === 0;

    if (isDigital) {
      const existing = shipGroups.find(isAllDigital) || shipGroups.find(isEmpty);
      if (existing) return existing.id;
      return null; // caller creates a fresh group
    }
    const target = shipGroups.find(g => g.id === activeGroupId) || shipGroups[0];
    if (!isAllDigital(target)) return target.id;
    const alt = shipGroups.find(g => !isAllDigital(g));
    return alt ? alt.id : null; // caller creates a fresh group
  };

  // Tapping a product always adds into whichever group is currently active
  // (focus mode — see ShipGroupCard/ShipGroupSummaryCard's `onActivate`), so
  // the same product can end up as separate lines in separate groups, each
  // with its own qty and its own group's fulfillment (e.g. Iced Latte picked
  // up now in one group, Iced Latte shipped later in another). Existing qty
  // is only bumped when the product already has a line in THAT group, not
  // just anywhere in the cart.
  const addToCart = (p) => {
    setCart(prev => {
      let groupId = pickGroupForItem(p, prev);
      let groupIsNew = false;
      if (groupId === null) {
        const ch = D.channels.find(c => c.id === channel);
        const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
        setShipGroups(gs => [...gs, {
          id: newId, addressId: null, courierId: null, fee: '', pickupStoreId: storeId,
          fulfillmentId: suggestFulfillmentId(ch, [p]),
        }]);
        setGroupOrderMode(true);
        setActiveGroupId(newId);
        groupId = newId;
        groupIsNew = true;
      }

      const found = prev.find(i => i.id === p.id && i.groupId === groupId);
      if (found) return prev.map(i => i === found ? { ...i, qty: i.qty + 1 } : i);

      if (!groupIsNew) {
        const wasEmpty = prev.every(i => i.groupId !== groupId);
        const ch = D.channels.find(c => c.id === channel);
        // A service item always means an on-site visit for the WHOLE group,
        // whether it's the first thing added or joining items already
        // there — there's no such thing as "mostly shipped, but one item
        // needs a technician visit". Non-service items only get a fresh
        // suggestion when they're the first thing in an empty group, so
        // they never fight a fulfillment the cashier already picked.
        const forced = p.cat === 'service' ? 'ON_SITE' : (wasEmpty ? suggestFulfillmentId(ch, [p]) : null);
        if (forced) {
          setShipGroups(gs => gs.map(g => g.id === groupId
            ? { ...g, fulfillmentId: forced }
            : g));
          // Outside group-order mode there's just the one group, and the
          // cart's top fulfillment dropdown reads the separate global
          // `fulfillment` state, not this group's `fulfillmentId` — keep
          // them in sync so e.g. a service item actually flips the header
          // to "ON_SITE" (and reveals its address/travel-fee fields)
          // instead of leaving it stuck on whatever was picked before.
          if (!groupOrderMode) setFulfillment(forced);
        }
      }
      const lineId = `${p.id}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      return [...prev, { ...p, qty: 1, groupId, lineId }];
    });
  };
  const setQty = (lineId, qty) => {
    if (qty <= 0) return setCart(prev => prev.filter(i => i.lineId !== lineId));
    setCart(prev => prev.map(i => i.lineId === lineId ? { ...i, qty } : i));
  };
  const removeItem = (lineId) => setCart(prev => prev.filter(i => i.lineId !== lineId));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const currentCustomer = D.customers.find(c => c.id === customer);
  const memberDiscount = currentCustomer.tier === 'Gold' && subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const manualDiscountAmount = manualDiscount?.amount || 0;
  const discount = memberDiscount + manualDiscountAmount;
  const afterDisc = Math.max(0, subtotal - discount);
  const vat = Math.round(afterDisc * VAT_RATE / (1 + VAT_RATE));
  const total = afterDisc;

  const cartProps = {
    density: t.density,
    channels: D.channels,
    channel,
    setChannel: onChangeChannel,
    fulfillment,
    setFulfillment,
    subChannel,
    setSubChannel,
    payment,
    setPayment,
    paymentMethods: D.paymentMethods,
    cart,
    setQty,
    removeItem,
    customer: currentCustomer,
    customers: D.customers,
    setCustomer: onChangeCustomer,
    addresses: currentCustomer.addresses,
    stores: D.stores,
    phone,
    setPhone,
    subtotal,
    vat,
    discount,
    total,
    selectorPattern: t.layout === 'topbar' ? 'tabs' : t.selectorPattern,
    hideChannelHeader: t.layout === 'topbar',
    onCheckout: () => setCheckoutOpen(true),
    memberDiscount,
    manualDiscount,
    orderNote,
    onOpenDiscount: () => setDiscountOpen(true),
    onOpenNote: () => setNoteOpen(true),
    onRemoveDiscount: () => setManualDiscount(null),
    onRemoveNote: () => setOrderNote(''),
    couriers: D.couriers,
    shipGroups,
    groupOrderMode,
    enableGroupOrderMode,
    addShipGroup,
    removeShipGroup,
    setGroupField,
    setItemGroup,
    activeGroupId,
    setActiveGroupId,
  };

  return (
    <div className="app-shell" style={appStyles.shell}>
      <Sidebar
        collapsed={t.sidebarCollapsed}
        onToggle={() => setTweak('sidebarCollapsed', !t.sidebarCollapsed)}
        activeId="sale"
      />

      <div style={appStyles.mainColumn}>
        <header style={appStyles.topbar}>
          <div>
            <div style={appStyles.pageTitle}>Sale · Create Order</div>
            <div style={appStyles.pageSub}>POS / Online / LINK_BILL — universal checkout</div>
          </div>
          <div style={appStyles.navRight}>
            <StoreSwitcher
              stores={D.stores}
              activeId={storeId}
              onSelect={setStoreId}
            />
            <div style={{ position: 'relative' }}>
              <button
                style={appStyles.topIconBtn}
                onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); setAppsOpen(false); }}
                aria-label="Notifications"
              >
                <Icon name="bell" size={18} />
                {notifications.some(n => n.unread) && (
                  <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--rose-500)', border: '1.5px solid var(--bg-surface)' }} />
                )}
              </button>
              <NotificationsPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                items={notifications}
                onMarkAll={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button
                style={appStyles.topIconBtn}
                onClick={() => { setAppsOpen(o => !o); setProfileOpen(false); setNotifOpen(false); }}
                aria-label="App switcher"
              >
                <Icon name="grid" size={18} />
              </button>
              <AppSwitcher
                open={appsOpen}
                onClose={() => setAppsOpen(false)}
                apps={SELLSUKI_APPS}
                currentId="patona"
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button
                style={{ ...appStyles.staffPill, background: 'var(--bg-surface)', cursor: 'pointer' }}
                onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setAppsOpen(false); }}
              >
                <span>Praewa S.</span>
                <span style={appStyles.staffAvatar}>PS</span>
              </button>
              <ProfileMenu
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={{ name: 'Praewa Suwannakul', role: 'Cashier · Sukhumvit 49', initials: 'PS' }}
              />
            </div>
          </div>
        </header>

        {t.showStoreBar && (
          <div style={appStyles.storeBar}>
            <div style={appStyles.storeChip}>
              <Icon name="store" size={14} color="var(--text-secondary)" />
              <span>{currentStore.label}</span>
            </div>
            <span style={appStyles.storeDot} />
            <span style={appStyles.storeMeta}>{currentStore.hours}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={appStyles.storeMeta}>Today: <b style={{ color: 'var(--text-primary)' }}>฿42,180</b> · 38 orders</span>
            </span>
          </div>
        )}

        {t.layout === 'topbar' && (
          <div style={appStyles.topChannelBar}>
            <span style={appStyles.topChLabel}>Channel</span>
            <div style={{ flex: 1, maxWidth: 720 }}>
              <ChannelSelector
                variant={t.selectorPattern}
                channels={D.channels}
                channel={channel}
                onChannel={onChangeChannel}
              />
            </div>
            <span style={appStyles.topChLabel}>Fulfillment</span>
            <div style={{ flex: 1, maxWidth: 520 }}>
              <FulfillmentPills
                options={D.channels.find(c => c.id === channel).fulfillment}
                value={fulfillment}
                onChange={setFulfillment}
              />
            </div>
          </div>
        )}

        <main
          style={{
            ...appStyles.body,
            ...(t.layout === 'cart-left' ? appStyles.bodyReverse : {}),
          }}
        >
          <ProductGrid
            products={D.products}
            categories={D.categories}
            onAdd={addToCart}
          />
          <Cart {...cartProps} />
        </main>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={() => { setCheckoutOpen(false); setCart([]); setManualDiscount(null); setOrderNote(''); }}
        channel={channel}
        channels={D.channels}
        paymentMethods={D.paymentMethods}
        payment={payment}
        setPayment={setPayment}
        subtotal={subtotal}
        vat={vat}
        discount={discount}
        total={total}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
      />

      <DiscountModal
        open={discountOpen}
        onClose={() => setDiscountOpen(false)}
        onApply={(d) => setManualDiscount(d)}
        onRemove={() => setManualDiscount(null)}
        current={manualDiscount}
        subtotal={subtotal}
      />

      <NoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSave={(t) => setOrderNote(t)}
        onRemove={() => setOrderNote('')}
        current={orderNote}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakRadio
          label="Arrangement"
          value={t.layout}
          options={[
            { value: 'cart-right', label: 'Cart →' },
            { value: 'cart-left',  label: '← Cart' },
            { value: 'topbar',     label: 'Top bar' },
          ]}
          onChange={(v) => setTweak('layout', v)}
        />
        <TweakRadio
          label="Channel pattern"
          value={t.selectorPattern}
          options={[
            { value: 'tabs',     label: 'Tabs' },
            { value: 'dropdown', label: 'Dropdown' },
            { value: 'cards',    label: 'Cards' },
          ]}
          onChange={(v) => setTweak('selectorPattern', v)}
        />
        <TweakToggle
          label="Collapse sidebar"
          value={t.sidebarCollapsed}
          onChange={(v) => setTweak('sidebarCollapsed', v)}
        />

        <TweakSection label="Density & theme" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={[
            { value: 'compact',     label: 'Compact' },
            { value: 'regular',     label: 'Default' },
            { value: 'comfortable', label: 'Roomy' },
          ]}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="Theme"
          value={t.theme}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark',  label: 'Dark' },
          ]}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakToggle
          label="Show store bar"
          value={t.showStoreBar}
          onChange={(v) => setTweak('showStoreBar', v)}
        />
      </TweaksPanel>
    </div>
  );
}

window.App = App;
