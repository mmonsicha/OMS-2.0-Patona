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
  // Walk-in customers who need delivery (from-store or standard courier)
  // often aren't members yet — D.customers is the static seed list, so new
  // walk-ins are appended here rather than mutating it.
  const [customerList, setCustomerList] = React.useState(D.customers);
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
    { id: 'g1', addressId: null, courierId: null, fee: '', pickupStoreId: storeId, fulfillmentId: D.channels[0].fulfillment[0].id, vehicleType: null },
  ]);
  const [groupOrderMode, setGroupOrderMode] = React.useState(false);
  // Which group newly-tapped products land in. Picking a product from the
  // grid always adds to this group, so the flow is: create groups first,
  // tap the one you want to fill, then shop for it — instead of adding
  // everything then reassigning after the fact.
  const [activeGroupId, setActiveGroupId] = React.useState('g1');
  const onChangeCustomer = (cid) => {
    setCustomerId(cid);
    const cust = customerList.find(c => c.id === cid);
    const defaultAddressId = cust.addresses[0] ? cust.addresses[0].id : null;
    setShipGroups(prev => prev.map(g => ({ ...g, addressId: defaultAddressId })));
  };
  // Lets a cashier attach a brand-new walk-in's details (name/phone) on the
  // spot — needed the moment a walk-in needs delivery (from-store pickup
  // group or a standard courier) since those require a recipient, and
  // there's no reason to send the cashier away from the cart/group drawer
  // to do it. Immediately selects the new customer, same as picking an
  // existing one.
  const addCustomer = ({ name, phone }) => {
    const newId = `c_${Date.now().toString(36)}`;
    const newCustomer = { id: newId, name: name.trim(), phone: phone.trim(), tier: null, addresses: [] };
    setCustomerList(prev => [...prev, newCustomer]);
    onChangeCustomer(newId);
  };
  const addShipGroup = () => {
    const ch = D.channels.find(c => c.id === channel);
    const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
    setShipGroups(prev => [
      ...prev,
      { id: newId, addressId: null, courierId: null, fee: '', pickupStoreId: storeId, fulfillmentId: ch.fulfillment[0].id, vehicleType: null },
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
    // A pre-order group has nothing to hand over today — "รับทันที" makes
    // no sense, and "รับภายหลัง" assumes a branch will have it to collect,
    // which is exactly what pre-order means it doesn't. Default to whichever
    // fulfillment ships to the customer instead (same courier-first instinct
    // as splitBulkyToShipping's SHIP_FROM_STORE preference), since that's
    // the only option that still works once stock arrives.
    if (items.length > 0 && items.every(i => i.cat === 'product' && D.isOutOfStockEverywhere(i))) {
      return (ch.fulfillment.find(f => f.needsCourier) || ch.fulfillment[0]).id;
    }
    // Out at THIS branch but not everywhere (see isOutOfStockAtBranch) —
    // there's nothing to hand over today, so lock onto รับภายหลัง (the
    // cashier still picks which OTHER branch, via the existing
    // PickupBranchSelector/PickupStockWarning flow) or, if this channel
    // doesn't offer that, straight to a courier fulfillment.
    if (items.some(i => i.cat === 'product' && D.isOutOfStockAtBranch(i, storeId) && !D.isOutOfStockEverywhere(i))) {
      return (ch.fulfillment.find(f => f.id === 'PICKUP_DEFERRED') || ch.fulfillment.find(f => f.needsCourier) || ch.fulfillment[0]).id;
    }
    return ch.fulfillment[0].id;
  };
  // Whether a group's CURRENT fulfillment still makes sense once it holds a
  // locally-out line — "รับทันที"/"รับที่ร้าน" assume the shelf here has it,
  // which is exactly what isOutOfStockAtBranch says it doesn't.
  const isFulfillmentLockedOut = (ch, fulfillmentId) => {
    const f = ch.fulfillment.find(x => x.id === fulfillmentId);
    return !f || (f.id !== 'PICKUP_DEFERRED' && !f.needsCourier);
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
      // Same rule as addToCart's pickGroupForItem — a pre-order group only
      // ever holds pre-order lines, so dragging one onto a group with
      // in-stock items (or an in-stock item onto a pre-order group) would
      // silently create the exact mixed group the pre-order flow exists to
      // avoid.
      const targetGroup = shipGroups.find(g => g.id === groupId);
      const movingIsPreorder = D.isOutOfStockEverywhere(movingItem);
      if ((movingIsPreorder && targetItems.length > 0 && !targetGroup?.isPreorder)
        || (!movingIsPreorder && targetGroup?.isPreorder)) {
        return prev; // would mix pre-order with ready-to-ship items — reject
      }
      const wasEmpty = targetItems.length === 0;
      const next = prev.map(i => i.lineId === lineId ? { ...i, groupId } : i);
      // A service item dropped into a group always makes it an on-site
      // visit, whether the group was empty or already had other items —
      // same rule as addToCart below. Same for a locally-out line landing
      // in a group whose current fulfillment can't hand it over (see
      // isFulfillmentLockedOut).
      const ch = D.channels.find(c => c.id === channel);
      const movingIsLocalOut = movingItem.cat === 'product' && D.isOutOfStockAtBranch(movingItem, storeId) && !movingIsPreorder;
      const needsLock = !wasEmpty && movingIsLocalOut && targetGroup && isFulfillmentLockedOut(ch, targetGroup.fulfillmentId);
      const forced = movingItem.cat === 'service' ? 'ON_SITE'
        : wasEmpty ? suggestFulfillmentId(ch, [movingItem])
        : needsLock ? suggestFulfillmentId(ch, [movingItem])
        : null;
      if (forced) {
        setShipGroups(gs => gs.map(g => g.id === groupId ? { ...g, fulfillmentId: forced } : g));
        if (!groupOrderMode) setFulfillment(forced);
      }
      if (wasEmpty && movingIsPreorder) {
        setShipGroups(gs => gs.map(g => g.id === groupId ? { ...g, isPreorder: true } : g));
      }
      return next;
    });
  };
  // Pickup-branch shortfall fix (see PickupStockWarning in cart.jsx) — pulls
  // just the short line out into a brand-new group picked up from whichever
  // branch actually has it, instead of forcing the whole order to move or
  // the customer to accept a substitute. Sets the new group's fulfillment
  // directly rather than through setItemGroup, since that would re-suggest
  // it from the channel default the moment the (now-empty) group gets its
  // first item, clobbering the PICKUP_DEFERRED + branch this exists for.
  const splitToBranch = (lineId, pickupStoreId) => {
    const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
    setShipGroups(gs => [...gs, {
      id: newId, addressId: null, courierId: null, fee: '', pickupStoreId,
      fulfillmentId: 'PICKUP_DEFERRED', vehicleType: null,
    }]);
    setCart(prev => prev.map(i => i.lineId === lineId ? { ...i, groupId: newId } : i));
    setGroupOrderMode(true);
    setActiveGroupId(newId);
  };
  // Weight/size-aware fulfillment suggestion (see BulkyItemBanner in
  // cart.jsx) — a walk-in cart mixing drinks with something like a coffee
  // machine or an XL ice bucket shouldn't force the whole order down one
  // path: the light items can go out the door with the customer right now,
  // the bulky ones are better off shipped from the store later. Pulls just
  // the bulky lines out into a new SHIP_FROM_STORE group, same shape as
  // splitToBranch above but keyed by "these lineIds", not "this one line".
  const splitBulkyToShipping = (lineIds) => {
    const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
    const ch = D.channels.find(c => c.id === channel);
    const bulkyFulfillmentId = (ch.fulfillment.find(f => f.id === 'SHIP_FROM_STORE') || ch.fulfillment.find(f => f.needsCourier) || ch.fulfillment[0]).id;
    setShipGroups(gs => [...gs, {
      id: newId, addressId: null, courierId: null, fee: '', pickupStoreId: storeId,
      fulfillmentId: bulkyFulfillmentId, vehicleType: null,
    }]);
    setCart(prev => prev.map(i => lineIds.includes(i.lineId) ? { ...i, groupId: newId } : i));
    setGroupOrderMode(true);
    setActiveGroupId(newId);
  };
  // Pre-order case 2.1 "แยกออเดอร์" (see cart.jsx PreorderBanner) — pulls
  // just the lines that are out of stock at every branch into their own
  // group marked `isPreorder`, so the rest of the order (already in stock)
  // ships on the normal timeline instead of waiting on the restock too.
  // Case 1 (the whole group is already just the out-of-stock item) and case
  // 2.2 "ไม่แยก" don't need a new group at all — they just flip `isPreorder`
  // on the existing one via setGroupField, same as any other group field.
  const splitPreorderItems = (lineIds) => {
    const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
    const sourceGroup = shipGroups.find(g => cart.some(i => lineIds.includes(i.lineId) && i.groupId === g.id)) || shipGroups[0];
    setShipGroups(gs => [...gs, {
      id: newId, addressId: sourceGroup.addressId, courierId: sourceGroup.courierId, fee: '',
      pickupStoreId: sourceGroup.pickupStoreId, fulfillmentId: sourceGroup.fulfillmentId, vehicleType: null,
      isPreorder: true,
    }]);
    setCart(prev => prev.map(i => lineIds.includes(i.lineId) ? { ...i, groupId: newId } : i));
    setGroupOrderMode(true);
    setActiveGroupId(newId);
  };
  // Same-day riders can only carry so many bulky items each (see
  // data.js vehicleTypes' maxBulkyItems — a motorcycle takes one suitcase,
  // not four). Once a group's bulky quantity exceeds the chosen vehicle's
  // capacity, this fans it out into N groups — the original plus N-1 new
  // ones, all cloned with the same courier/vehicle/address — and redistributes
  // just the bulky lines across them so each group stays within capacity.
  // Light items in the original group are left alone; they ride along with
  // vehicle #1.
  const splitVehicleGroups = (groupId, vehicleTypeId) => {
    const vt = D.vehicleTypes.find(v => v.id === vehicleTypeId);
    const group = shipGroups.find(g => g.id === groupId);
    if (!vt || !group) return;
    setCart(prevCart => {
      const groupItems = prevCart.filter(i => i.groupId === groupId);
      const bulkyItems = groupItems.filter(D.isBulkyItem);
      const totalBulkyQty = bulkyItems.reduce((s, i) => s + i.qty, 0);
      const vehiclesNeeded = Math.ceil(totalBulkyQty / vt.maxBulkyItems);
      if (vehiclesNeeded <= 1) return prevCart;

      const newGroups = [];
      for (let v = 1; v < vehiclesNeeded; v++) {
        newGroups.push({
          id: `${groupId}_v${v + 1}_${Date.now().toString(36)}${v}`,
          addressId: group.addressId, courierId: group.courierId, fee: group.fee,
          pickupStoreId: group.pickupStoreId, fulfillmentId: group.fulfillmentId,
          vehicleType: vehicleTypeId,
        });
      }
      setShipGroups(gs => [
        ...gs.map(g => g.id === groupId ? { ...g, vehicleType: vehicleTypeId } : g),
        ...newGroups,
      ]);
      setGroupOrderMode(true);

      const allGroupIds = [groupId, ...newGroups.map(g => g.id)];
      const remainingCapacity = allGroupIds.map(() => vt.maxBulkyItems);
      let nextCart = prevCart;
      bulkyItems.forEach(item => {
        let qtyLeft = item.qty;
        let firstAssignment = true;
        for (let gi = 0; gi < allGroupIds.length && qtyLeft > 0; gi++) {
          if (remainingCapacity[gi] <= 0) continue;
          const take = Math.min(qtyLeft, remainingCapacity[gi]);
          remainingCapacity[gi] -= take;
          qtyLeft -= take;
          const destGroupId = allGroupIds[gi];
          if (firstAssignment) {
            nextCart = nextCart.map(i => i.lineId === item.lineId ? { ...i, qty: take, groupId: destGroupId } : i);
            firstAssignment = false;
          } else {
            nextCart = [...nextCart, { ...item, lineId: `${item.lineId}_${destGroupId}`, qty: take, groupId: destGroupId }];
          }
        }
      });
      return nextCart;
    });
  };
  // Outside group-order mode there's exactly one group (shipGroups[0]), and
  // the header's fulfillment dropdown was only ever writing the separate
  // global `fulfillment` state — shipGroups[0].fulfillmentId sat stale at
  // whatever it was created with. Invisible while everything stayed in the
  // single-group flow (nothing there reads the group's own field), but the
  // moment something switches into group-order mode — splitToBranch above,
  // or just tapping "สร้างคำสั่งขายกลุ่ม" — the drawer starts trusting that
  // stale field and shows the wrong fulfillment. Keep them in sync instead.
  const onChangeFulfillment = (fid) => {
    setFulfillment(fid);
    setShipGroups(prev => prev.map((g, i) => i === 0 ? { ...g, fulfillmentId: fid } : g));
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

  // addToCart/setItemGroup re-lock a group's fulfillment the moment a
  // locally-out line JOINS it, but switching branches (StoreSwitcher) can
  // turn an already-in-cart line locally-out without either of those firing
  // — same lock, applied retroactively here instead. Deliberately keyed
  // only on `storeId`, not `cart`: the join-time checks above already cover
  // every case a cart change on its own would trigger.
  React.useEffect(() => {
    const ch = D.channels.find(c => c.id === channel);
    if (!ch) return;
    setShipGroups(prev => prev.map((g, gi) => {
      const items = cart.filter(i => i.groupId === g.id);
      if (items.length === 0) return g;
      const hasLocalOut = items.some(i => i.cat === 'product' && D.isOutOfStockAtBranch(i, storeId) && !D.isOutOfStockEverywhere(i));
      if (!hasLocalOut || !isFulfillmentLockedOut(ch, g.fulfillmentId)) return g;
      const fulfillmentId = suggestFulfillmentId(ch, items);
      if (gi === 0 && !groupOrderMode) setFulfillment(fulfillmentId);
      return { ...g, fulfillmentId };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

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

  // Some marketplace sub-channels mandate their own courier for the whole
  // order — Shopee ships only via SPX, Lazada only via LEX (see data.js'
  // `fixedCourierId`) — a seller can't pick anything else for those, so
  // picking one of these sub-channels immediately locks every group's
  // courier to it rather than leaving the old choice sitting there wrong.
  const onChangeSubChannel = (sid) => {
    setSubChannel(sid);
    const ch = D.channels.find(c => c.id === channel);
    const sub = ch.subChannels && ch.subChannels.find(s => s.id === sid);
    if (sub && sub.fixedCourierId) {
      setShipGroups(prev => prev.map(g => ({ ...g, courierId: sub.fixedCourierId })));
    }
  };

  // Digital items never share a group with physical/service ones — always
  // their own digital-only group, regardless of which group is "active".
  // Finds an existing all-digital (or empty) group to reuse before creating
  // a fresh one, and flips on group order mode automatically if that's what
  // it takes (the no-mixing rule holds even if the cashier never opted in).
  const pickGroupForItem = (p, cur) => {
    const isDigital = p.cat === 'digital';
    // Out of stock at every branch (see data.js isOutOfStockEverywhere) —
    // picking it up still adds a normal cart line (just badged "พรีออเดอร์",
    // see cart.jsx renderCartRow), but it can't ride along in a group with
    // in-stock items since that group would ship/pick-up today. It always
    // lands in a group made up of nothing but other pre-order items, same
    // way a digital item always lands in an all-digital group — created
    // fresh (and flagged `isPreorder`) the first time one shows up.
    const isPreorderItem = p.cat === 'product' && D.isOutOfStockEverywhere(p);
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
    if (isPreorderItem) {
      const existing = shipGroups.find(g => g.isPreorder && itemsOf(g.id).length > 0) || shipGroups.find(isEmpty);
      if (existing) return existing.id;
      return null; // caller creates a fresh pre-order group
    }
    const target = shipGroups.find(g => g.id === activeGroupId) || shipGroups[0];
    if (!isAllDigital(target) && !target.isPreorder) return target.id;
    const alt = shipGroups.find(g => !isAllDigital(g) && !g.isPreorder);
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
    const isPreorderItem = p.cat === 'product' && D.isOutOfStockEverywhere(p);
    setCart(prev => {
      let groupId = pickGroupForItem(p, prev);
      let groupIsNew = false;
      if (groupId === null) {
        const ch = D.channels.find(c => c.id === channel);
        const newId = `g${shipGroups.length + 1}_${Date.now().toString(36)}`;
        setShipGroups(gs => [...gs, {
          id: newId, addressId: null, courierId: null, fee: '', pickupStoreId: storeId,
          fulfillmentId: suggestFulfillmentId(ch, [p]),
          ...(isPreorderItem ? { isPreorder: true } : {}),
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
        const isLocalOut = p.cat === 'product' && D.isOutOfStockAtBranch(p, storeId) && !D.isOutOfStockEverywhere(p);
        const currentGroup = shipGroups.find(g => g.id === groupId);
        // Joining an already-non-empty group: only re-lock the fulfillment
        // if this new line makes the group's CURRENT pick invalid — a group
        // already on delivery/รับภายหลัง doesn't need to be touched, and one
        // already holding another locally-out line was locked when THAT
        // line joined.
        const needsLock = !wasEmpty && isLocalOut && currentGroup && isFulfillmentLockedOut(ch, currentGroup.fulfillmentId);
        const forced = p.cat === 'service' ? 'ON_SITE'
          : wasEmpty ? suggestFulfillmentId(ch, [p])
          : needsLock ? suggestFulfillmentId(ch, [p])
          : null;
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
        // Reusing an existing-but-empty group (pickGroupForItem's `isEmpty`
        // fallback) — e.g. the very first item on a fresh order — doesn't
        // go through the "create a group" branch above, so it needs its
        // own `isPreorder` flag set here instead.
        if (wasEmpty && isPreorderItem) {
          setShipGroups(gs => gs.map(g => g.id === groupId ? { ...g, isPreorder: true } : g));
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
  const currentCustomer = customerList.find(c => c.id === customer);
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
    setFulfillment: onChangeFulfillment,
    subChannel,
    setSubChannel: onChangeSubChannel,
    payment,
    setPayment,
    paymentMethods: D.paymentMethods,
    cart,
    setQty,
    removeItem,
    customer: currentCustomer,
    customers: customerList,
    setCustomer: onChangeCustomer,
    onAddCustomer: addCustomer,
    addresses: currentCustomer.addresses,
    stores: D.stores,
    storeId,
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
    splitToBranch,
    splitBulkyToShipping,
    splitPreorderItems,
    splitVehicleGroups,
    vehicleTypes: D.vehicleTypes,
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
            storeId={storeId}
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
