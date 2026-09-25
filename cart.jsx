// cart.jsx — Right pane: channel selector, customer row, line items, totals,
// payment methods, big Charge CTA. Plain React + CSS tokens.

const cartStyles = {
  pane: {
    width: 480,
    flexShrink: 0,
    background: 'var(--bg-surface)',
    borderLeft: '1px solid var(--stroke)',
    display: 'flex', flexDirection: 'column',
    // NOT overflow:hidden — popovers (shipping info, address selector,
    // customer picker) are absolutely positioned relative to a trigger that
    // can sit close to the pane's own bottom edge (little room left below
    // it), and clipping here cut them off along with their own internal
    // scroll list, making long option lists (e.g. couriers) unreachable.
    minHeight: 0, overflow: 'visible',
  },
  paneCompact: { width: 420 },
  paneRoomy:   { width: 540 },

  // Head + item list now share ONE scroll container (see `scrollRegion`
  // below) so the collapsible head's height never fights with the item
  // list's own scroll math — that mismatch was the root cause of the header
  // getting stuck collapsed (scrolling back to top could stop firing scroll
  // events once the freed-up space removed all overflow from a separately
  // scrolling item list).
  scrollRegion: {
    flex: 1, minHeight: 0,
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
  },
  head: {
    padding: '8px var(--d-pad-page) 6px',
    display: 'flex', flexDirection: 'column',
    borderBottom: '1px solid var(--stroke)',
    flexShrink: 0,
  },
  channelBlock: { display: 'flex', flexDirection: 'column', gap: 8 },
  // Sub-channel + fulfillment side by side (Online/LINK_BILL) — each dropdown
  // gets equal width, matching the Figma "wrap" row of two Selection Dropdowns.
  dropdownRow: { display: 'flex', gap: 8, width: '100%' },
  divider: { height: 1, background: 'var(--stroke)', width: '100%', flexShrink: 0 },
  formBlock: { display: 'flex', flexDirection: 'column', gap: 8 },
  formLabel: { fontSize: 'var(--fs-h3)', fontWeight: 500, color: 'var(--text-primary)' },
  requiredMark: { color: 'var(--rose-500)' },

  // ── Customer card (once a real customer is attached) — name/phone/email,
  // a "นำออก" remove link, and (when the order needs one) a nested address
  // selector styled as a dropdown-input with a primary/secondary badge. ──
  customerCard: {
    width: '100%',
    display: 'flex', flexDirection: 'column', gap: 8,
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '10px 16px',
  },
  customerCardTop: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  customerCardBody: {
    flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2,
    cursor: 'pointer',
  },
  customerCardName: {
    fontSize: 'var(--fs-h4)', fontWeight: 600, color: 'var(--text-primary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  customerCardMeta: {
    fontSize: 'var(--fs-body-sm)', color: 'var(--text-secondary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  customerCardRemove: {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'var(--sky-600)', fontSize: 'var(--fs-body-sm)', fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
    padding: '2px 0',
  },
  addrField: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '6px 12px',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
    minHeight: 40,
  },
  addrBadge: (primary) => ({
    flexShrink: 0,
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 11, fontWeight: 600,
    background: primary ? 'var(--emerald-50)' : 'var(--bg-subtle)',
    color: primary ? 'var(--emerald-700)' : 'var(--text-secondary)',
    border: `1px solid ${primary ? '#D1FAE5' : 'var(--stroke)'}`,
  }),
  addrFieldText: {
    flex: 1, minWidth: 0,
    fontSize: 'var(--fs-body)', color: 'var(--text-primary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  addrFieldPlaceholder: { color: 'var(--rose-500)', fontWeight: 500 },
  shipFeeInput: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius-sm)',
    padding: '8px 10px',
    fontFamily: 'inherit', fontSize: 'var(--fs-body-lg)',
    color: 'var(--text-primary)',
    marginBottom: 4,
    outline: 'none',
  },

  // ── Split shipment — multiple ship groups under one order/channel, each
  // with its own address + courier + fee, paid together in one summary. ──
  shipGroupsHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  splitBtn: {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'var(--brand-600)', fontSize: 'var(--fs-body-sm)', fontWeight: 600,
    fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 0',
  },
  // `dragOver` highlights the card as a valid drop target while an item is
  // being dragged over it. `active` marks the group new product taps land
  // in (focus mode) — tapping anywhere on the card (drawer only) makes it
  // the active one; dragOver wins visually if both are true at once.
  shipGroupCard: (dragOver, active) => ({
    display: 'flex', flexDirection: 'column', gap: 8,
    border: `1.5px dashed ${dragOver ? 'var(--brand-500)' : 'transparent'}`,
    outline: dragOver ? 'none' : `1px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: dragOver ? 'var(--brand-50)' : active ? 'var(--brand-50)' : 'var(--bg-muted)',
    borderRadius: 'var(--d-radius)',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'border-color .12s, background .12s, outline-color .12s',
  }),
  shipGroupHead: { display: 'flex', alignItems: 'center', gap: 8 },
  shipGroupLabel: { fontWeight: 600, fontSize: 'var(--fs-body)', color: 'var(--text-primary)', flex: 1, minWidth: 0 },
  shipGroupCount: { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' },
  shipGroupActiveBadge: {
    fontSize: 11, fontWeight: 600, color: 'var(--brand-700)',
    background: 'var(--brand-100)', borderRadius: 999,
    padding: '2px 8px', flexShrink: 0, whiteSpace: 'nowrap',
  },
  shipGroupRemove: {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'var(--rose-500)', cursor: 'pointer', flexShrink: 0,
    display: 'flex', padding: 2,
  },

  // Main-pane summary card — read-only overview (count, fulfillment,
  // courier/fee, total) with delete + "manage" (chevron) as the only
  // actions. Cards get breathing room from each other via `items`' gap.
  // `active` mirrors the drawer's focus-mode highlight so it's still
  // obvious which group new taps land in once the drawer is closed.
  shipGroupSummaryCard: (active) => ({
    width: '100%',
    border: `1px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    padding: '12px 14px',
    display: 'flex', flexDirection: 'column', gap: 8,
  }),
  shipGroupSummaryTop: { display: 'flex', alignItems: 'center', gap: 4 },
  shipGroupSummaryOpen: {
    appearance: 'none', border: 0, background: 'transparent',
    display: 'flex', padding: 4, cursor: 'pointer', flexShrink: 0,
  },
  shipGroupSummaryBadges: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  shipGroupSummaryBadge: {
    fontSize: 11, fontWeight: 600,
    color: 'var(--text-secondary)',
    background: 'var(--bg-subtle)',
    borderRadius: 999, padding: '3px 9px',
    flexShrink: 0, whiteSpace: 'nowrap',
  },
  shipGroupFulfillBadge: {
    fontSize: 11, fontWeight: 600,
    color: 'var(--sky-700)',
    background: 'var(--sky-50)',
    border: '1px solid #BAE0FD',
    borderRadius: 999, padding: '3px 9px',
    flexShrink: 0, whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220,
  },
  shipGroupSummaryMeta: {
    fontSize: 'var(--fs-caption)', color: 'var(--text-secondary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  shipGroupSummaryTotal: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 'var(--fs-body-sm)', fontWeight: 600,
    color: 'var(--text-primary)',
    paddingTop: 6,
    borderTop: '1px dashed var(--stroke)',
  },
  shipGroupSummaryList: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 },

  // Group-management drawer — slides in from the right, no scrim: the
  // product grid must stay tappable while it's open (that's the point of
  // "pick a group, then shop into it").
  // Animates via `right`, not `transform` — a transform on this ancestor
  // (even `translateX(0)` at rest) creates a new containing block, which
  // would make every `position: fixed` popover inside it (FulfillmentDropdown,
  // AddressSelector, ShippingInfoRow — see usePopoverFit) position itself
  // relative to the drawer instead of the viewport and render off-screen.
  drawer: (visible) => ({
    position: 'fixed', top: 0, bottom: 0,
    right: visible ? 0 : 'calc(-1 * min(440px, 92vw))',
    width: 'min(440px, 92vw)',
    background: 'var(--bg-surface)',
    borderLeft: '1px solid var(--stroke)',
    boxShadow: '-8px 0 24px rgba(15,23,42,.18)',
    zIndex: 150,
    display: 'flex', flexDirection: 'column',
    transition: 'right .22s cubic-bezier(.32,.72,0,1)',
  }),
  drawerHead: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--stroke)',
    flexShrink: 0,
  },
  drawerTitle: { flex: 1, fontSize: 'var(--fs-h4)', fontWeight: 700, color: 'var(--text-primary)' },
  drawerClose: {
    appearance: 'none', border: 0, background: 'transparent',
    width: 32, height: 32, borderRadius: 8,
    display: 'grid', placeItems: 'center',
    color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
  },
  drawerBody: {
    flex: 1, minHeight: 0, overflowY: 'auto',
    padding: 20,
    display: 'flex', flexDirection: 'column', gap: 12,
  },

  shipGroupItems: {
    display: 'flex', flexDirection: 'column',
    borderTop: '1px dashed var(--stroke-strong)',
    marginTop: 2,
  },
  shipGroupItemsEmpty: {
    fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)', fontStyle: 'italic',
    padding: '10px 0 2px',
  },

  infoRow: (disabled) => ({
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    minHeight: 36,
    padding: '8px 16px',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .5 : 1,
    textAlign: 'left',
  }),
  infoRowIcon: { color: 'var(--text-secondary)', flexShrink: 0, display: 'flex' },
  infoRowLabel: {
    flex: 1, minWidth: 0,
    fontSize: 'var(--fs-body-lg)', color: 'var(--text-primary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  infoRowChev: { color: 'var(--text-tertiary)', flexShrink: 0, display: 'flex' },
  ddRow: {
    width: '100%',
    appearance: 'none',
    border: '1px solid var(--stroke)',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--d-radius)',
    minHeight: 36,
    padding: '8px 16px',
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'inherit',
    cursor: 'pointer',
    textAlign: 'left',
  },

  // ── Collapsible head — tap (or scroll the cart list) to focus on items.
  // Tablet-first: the channel/fulfillment/customer/address stack takes real
  // estate the item list needs once an order has a few lines, so it folds
  // to a one-line summary and springs back open when scrolled to the top. ──
  headToggle: {
    width: '100%',
    appearance: 'none', border: 0, background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
    padding: '2px 2px 8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  headToggleSummary: {
    flex: 1, minWidth: 0, textAlign: 'left',
    fontSize: 'var(--fs-body-sm)', fontWeight: 600,
    color: 'var(--text-secondary)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  headToggleChev: (open) => ({
    color: 'var(--text-tertiary)',
    transform: open ? 'rotate(180deg)' : 'rotate(0)',
    transition: 'transform .15s ease',
    display: 'inline-flex', flexShrink: 0,
  }),
  headDetail: (open) => ({
    display: 'flex', flexDirection: 'column', gap: 12,
    maxHeight: open ? 640 : 0,
    opacity: open ? 1 : 0,
    // Only clip while collapsed — an open header must let its popovers
    // (fulfillment/sub-channel/customer/address) escape past its own box,
    // otherwise they get sliced off by the collapse animation's overflow.
    overflow: open ? 'visible' : 'hidden',
    transition: 'max-height .2s ease, opacity .15s ease',
  }),

  // ── Segmented control (used only for the Channel row in expanded mode) ──
  segGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 4,
    padding: 4,
    background: 'var(--bg-subtle)',
    borderRadius: 'var(--d-radius)',
    width: '100%',
  },
  segTab: (active) => ({
    appearance: 'none',
    border: 0,
    background: active ? 'var(--bg-surface)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontWeight: active ? 600 : 500,
    fontSize: 13,
    padding: '8px 6px',
    minHeight: 36,
    borderRadius: 6,
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
    transition: 'background .12s, color .12s, box-shadow .12s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontFamily: 'inherit',
    cursor: 'pointer',
    minWidth: 0,
  }),
  segLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  // Popover that hangs off a pill
  popWrap: { position: 'relative', minWidth: 0 },
  popScrim: { position: 'fixed', inset: 0, zIndex: 39 },
  pop: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    maxHeight: 280,
    overflowY: 'auto',
    background: 'var(--bg-surface)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: 6,
    zIndex: 40,
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  popHd: {
    fontSize: 10, fontWeight: 700,
    letterSpacing: '.08em', textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    padding: '8px 10px 4px',
  },
  // Explanatory note in place of a picker — e.g. "this channel only ships
  // via SPX" — where the field would normally be, so it reads as a plain
  // fact rather than a warning.
  fixedNote: {
    display: 'flex', alignItems: 'flex-start', gap: 6,
    padding: '6px 10px 8px',
    fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.4,
  },
  // Pickup-branch stock shortfall (see PickupStockWarning) — amber, not
  // rose/red, since it's not a hard error: there's always a next step
  // (split to another branch) right there in the same box.
  stockWarnBox: {
    display: 'flex', flexDirection: 'column', gap: 8,
    background: 'var(--amber-50)',
    border: '1px solid #FEDF89',
    borderRadius: 'var(--d-radius)',
    padding: '10px 12px',
  },
  stockWarnRow: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
  },
  stockWarnIcon: { color: 'var(--amber-600)', display: 'flex', flexShrink: 0 },
  stockWarnText: { fontSize: 'var(--fs-caption)', color: 'var(--amber-700)', flex: '1 1 auto', minWidth: 160 },
  stockWarnAction: {
    appearance: 'none', border: '1px solid #FEDF89', background: 'var(--bg-surface)',
    color: 'var(--amber-700)', fontWeight: 600, fontSize: 11,
    borderRadius: 999, padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
  },
  // Pre-order's two-choice row (split vs. wait together) — one filled
  // button (the split, since it gets the ready items out the door sooner)
  // and one ghost button, rather than two look-alike stockWarnAction pills
  // that read as equally weighted when they aren't.
  preorderActions: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  stockWarnActionGhost: {
    appearance: 'none', border: '1px solid #FEDF89', background: 'transparent',
    color: 'var(--amber-700)', fontWeight: 600, fontSize: 11,
    borderRadius: 999, padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
  },
  preorderBadge: {
    fontSize: 11, fontWeight: 600,
    color: 'var(--amber-700)',
    background: 'var(--amber-50)',
    border: '1px solid #FEDF89',
    borderRadius: 999, padding: '3px 9px',
    flexShrink: 0, whiteSpace: 'nowrap',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  },
  // `disabled` (e.g. a pickup branch with no stock for the group) dims the
  // row and swaps in a not-allowed cursor — still visible in the list (so
  // it's clear the branch exists, just can't be picked) rather than hidden.
  popItem: (active, disabled) => ({
    appearance: 'none', border: 0,
    background: active ? 'var(--brand-50)' : 'transparent',
    borderRadius: 8,
    padding: '8px 10px',
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    fontFamily: 'inherit',
    textAlign: 'left',
    width: '100%',
    transition: 'background .1s',
  }),
  popItemIcon: (color, active) => ({
    width: 26, height: 26, borderRadius: 7,
    background: color || (active ? 'var(--brand-500)' : 'var(--bg-subtle)'),
    color: color || active ? '#fff' : 'var(--text-secondary)',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
    fontWeight: 700, fontSize: 11,
    boxShadow: color ? 'inset 0 1px 0 rgba(255,255,255,.25)' : 'none',
  }),
  popItemBody: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.2 },
  popItemLabel: { fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--fs-body)' },
  popItemSub: { fontSize: 11, color: 'var(--text-tertiary)' },
  popItemSubWarn: { fontSize: 11, color: 'var(--rose-600)', fontWeight: 600 },
  popCheck: {
    width: 20, height: 20, borderRadius: '50%',
    background: 'var(--brand-500)', color: '#fff',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  },
  // "+ เพิ่มลูกค้าใหม่" — a walk-in with no membership record still needs a
  // name/phone attached the moment the order needs delivery (from-store or
  // standard courier), so this sits right above the existing-customer list
  // rather than sending the cashier off to a separate customer screen.
  popAddBtn: {
    appearance: 'none', border: '1px dashed var(--stroke-strong, var(--stroke))',
    background: 'transparent', borderRadius: 8,
    padding: '8px 10px', marginBottom: 2,
    display: 'flex', alignItems: 'center', gap: 8,
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
    color: 'var(--brand-600, var(--brand-500))', fontWeight: 600, fontSize: 'var(--fs-body)',
  },
  popAddBtnIcon: {
    width: 26, height: 26, borderRadius: 7,
    background: 'var(--brand-50)', color: 'var(--brand-600, var(--brand-500))',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  },
  popForm: { display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 6px 8px' },
  popFormField: { display: 'flex', flexDirection: 'column', gap: 4 },
  popFormLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' },
  popFormActions: { display: 'flex', gap: 8, marginTop: 2 },
  popFormCancel: {
    appearance: 'none', border: '1px solid var(--stroke)', background: 'var(--bg-surface)',
    color: 'var(--text-secondary)', fontWeight: 600, fontSize: 'var(--fs-body-sm)',
    borderRadius: 999, padding: '8px 14px', cursor: 'pointer', flex: 1,
  },
  popFormSave: {
    appearance: 'none', border: 0, background: 'var(--brand-500)',
    color: '#fff', fontWeight: 600, fontSize: 'var(--fs-body-sm)',
    borderRadius: 999, padding: '8px 14px', cursor: 'pointer', flex: 1,
  },
  popFormSaveDisabled: { opacity: 0.5, cursor: 'not-allowed' },

  items: {
    padding: '4px var(--d-pad-page)',
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  empty: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-tertiary)', gap: 10, padding: '32px 20px', textAlign: 'center',
  },
  emptyIcon: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'var(--bg-subtle)',
    display: 'grid', placeItems: 'center',
  },

  // `dragging` is the row currently being picked up (see beginItemDrag) —
  // dimmed in place while its floating ghost chip follows the pointer.
  // Gains a leading column for the drag handle only in group-order mode,
  // where rows can actually be dragged between groups.
  row: (dragging, withHandle) => ({
    display: 'grid',
    gridTemplateColumns: (withHandle ? '20px ' : '') + '36px 1fr auto',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid var(--stroke)',
    alignItems: 'center',
    opacity: dragging ? 0.4 : 1,
  }),
  dragHandle: {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'var(--text-tertiary)', cursor: 'grab',
    display: 'grid', placeItems: 'center',
    width: 20, height: 36,
    touchAction: 'none',
    padding: 0,
  },
  dragGhost: (x, y) => ({
    position: 'fixed', left: x + 14, top: y + 14,
    zIndex: 300, pointerEvents: 'none',
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--bg-surface)', border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius)', boxShadow: 'var(--shadow-lg)',
    padding: '6px 12px 6px 6px', maxWidth: 220,
    fontSize: 'var(--fs-body-sm)', fontWeight: 600, color: 'var(--text-primary)',
  }),
  rowSwatch: (color) => ({
    width: 36, height: 36,
    borderRadius: 'var(--d-radius-sm)',
    background: color,
    display: 'grid', placeItems: 'center',
    color: 'rgba(255,255,255,.95)', fontWeight: 700,
    fontSize: 12,
    textShadow: '0 1px 2px rgba(0,0,0,.2)',
    flexShrink: 0,
  }),
  rowInfo: { display: 'flex', flexDirection: 'column', minWidth: 0, gap: 2 },
  rowName: {
    display: 'flex', alignItems: 'center', gap: 6, minWidth: 0,
    fontSize: 'var(--fs-body)', fontWeight: 600, color: 'var(--text-primary)',
  },
  rowNameText: {
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
  },
  rowLine: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)',
  },
  rowBulkyBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 3,
    padding: '1px 6px 1px 5px', borderRadius: 999,
    background: 'var(--amber-50, #fffaeb)', border: '1px solid var(--amber-200, #fedf89)',
    color: 'var(--amber-700, #b54708)',
    fontSize: 'var(--fs-micro, 10px)', fontWeight: 600, lineHeight: 1.6,
    flexShrink: 0, whiteSpace: 'nowrap',
  },
  rowPrice: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: 6,
  },
  rowTotal: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-body-lg)' },
  qtyGroup: {
    display: 'inline-flex', alignItems: 'center',
    border: '1px solid var(--stroke)',
    borderRadius: 999, overflow: 'hidden',
    background: 'var(--bg-surface)',
  },
  qtyBtn: {
    appearance: 'none', border: 0,
    width: 34, height: 34,
    background: 'transparent',
    color: 'var(--text-secondary)',
    display: 'grid', placeItems: 'center',
  },
  qtyVal: {
    minWidth: 26, textAlign: 'center',
    fontVariantNumeric: 'tabular-nums', fontWeight: 600,
    fontSize: 'var(--fs-body)', color: 'var(--text-primary)',
  },

  extras: {
    display: 'flex', gap: 6,
    padding: '8px var(--d-pad-page)',
    borderTop: '1px solid var(--stroke)',
    flexShrink: 0,
  },
  extraBtn: {
    appearance: 'none', flex: 1,
    background: 'var(--bg-surface)',
    border: '1px dashed var(--stroke-strong)',
    borderRadius: 'var(--d-radius)',
    padding: '8px',
    color: 'var(--text-secondary)',
    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
    fontFamily: 'inherit', fontSize: 'var(--fs-body)', fontWeight: 500,
    cursor: 'pointer',
  },
  // Applied-state chip (replaces the dashed button when value is set)
  extraChip: {
    flex: 1, minWidth: 0,
    background: 'var(--brand-50)',
    border: '1px solid var(--brand-300)',
    borderRadius: 'var(--d-radius)',
    padding: '6px 8px 6px 8px',
    display: 'flex', alignItems: 'center', gap: 8,
    overflow: 'hidden',
  },
  extraChipIcon: {
    width: 24, height: 24, borderRadius: 6,
    background: 'var(--brand-500)',
    color: '#fff',
    display: 'grid', placeItems: 'center',
    flexShrink: 0,
  },
  extraChipBody: {
    flex: 1, minWidth: 0,
    display: 'flex', flexDirection: 'column',
    lineHeight: 1.2,
    cursor: 'pointer',
  },
  extraChipLabel: {
    fontSize: 'var(--fs-caption)',
    fontWeight: 700,
    color: 'var(--brand-700)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  extraChipSub: {
    fontSize: 11,
    color: 'var(--brand-700)',
    opacity: .8,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  extraChipX: {
    appearance: 'none', border: 0,
    background: 'transparent',
    width: 22, height: 22, borderRadius: '50%',
    display: 'grid', placeItems: 'center',
    color: 'var(--brand-700)',
    cursor: 'pointer',
    flexShrink: 0,
  },

  totals: {
    padding: '6px var(--d-pad-page) 8px',
    borderTop: '1px solid var(--stroke)',
    background: 'var(--bg-muted)',
    display: 'flex', flexDirection: 'column', gap: 2,
    flexShrink: 0,
  },
  totalSub: {
    display: 'flex', justifyContent: 'space-between',
    color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    color: 'var(--text-secondary)', fontSize: 'var(--fs-body-sm)',
  },
  totalDisc: { color: 'var(--emerald-700)' },
  grandRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    paddingTop: 4, marginTop: 2,
    borderTop: '1px dashed var(--stroke-strong)',
  },
  grandLbl: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-body-lg)' },
  grandVal: { fontWeight: 700, color: 'var(--text-primary)', fontSize: 'var(--fs-h3)' },

  payments: {
    padding: '8px var(--d-pad-page)',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(78px, 1fr))', gap: 6,
    flexShrink: 0,
  },
  pay: (active) => ({
    appearance: 'none',
    border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--stroke)'}`,
    background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
    color: active ? 'var(--brand-700)' : 'var(--text-secondary)',
    borderRadius: 'var(--d-radius)',
    padding: '8px 6px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    minHeight: 54,
    fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
    boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--brand-500) 16%, transparent)' : 'none',
    transition: 'border-color .12s, box-shadow .12s',
  }),

  action: { padding: 'var(--d-pad-page)', paddingTop: 6, flexShrink: 0 },
  charge: (disabled) => ({
    appearance: 'none',
    width: '100%',
    height: 48,
    borderRadius: 'var(--d-radius)',
    border: 0,
    background: disabled ? 'var(--bg-subtle)' : 'var(--brand-500)',
    color: disabled ? 'var(--text-tertiary)' : '#fff',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-h3)',
    fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px',
    transition: 'background .15s, transform .08s',
    boxShadow: disabled ? 'none' : '0 4px 14px -2px color-mix(in srgb, var(--brand-500) 45%, transparent)',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  chargeKey: {
    fontSize: 12, fontWeight: 600,
    padding: '2px 8px',
    background: 'rgba(255,255,255,.18)',
    borderRadius: 4,
  },
};

// Every popover in this file (fulfillment, sub-channel, customer picker,
// address selector, shipping info) is absolutely positioned under a trigger
// that can sit anywhere down a long, scrollable cart pane — the pane and its
// ancestors clip overflow, so a popover that would extend past whatever room
// is left below its trigger got silently cut off, taking its own internal
// scroll list down with it (list still there, just invisible/unreachable —
// looked like "can't scroll" because scrolling revealed nothing new).
// This measures the actual space above/below the trigger when it opens and
// flips the popover upward + caps its height to whatever truly fits, so the
// whole thing (including its list) always renders fully on screen.
// Shared by the group summary (main pane) and each ShipGroupCard (drawer) so
// the "does this group need an address / a courier" rule lives in one place.
// A service item is always an on-site visit regardless of the fulfillment
// picked; an all-digital group never needs an address; otherwise it follows
// straight from the group's own selected fulfillment option.
function groupFulfillmentNeeds(fulfillmentOptions, group, items) {
  const fulfillment = fulfillmentOptions.find(f => f.id === group.fulfillmentId) || fulfillmentOptions[0];
  const hasService = items.some(i => i.cat === 'service');
  const allDigital = items.length > 0 && items.every(i => i.cat === 'digital');
  const needsAddress = !allDigital && (hasService || fulfillment.needsAddress);
  const needsCourier = needsAddress && fulfillment.needsCourier;
  // Travel fee (staff visiting the customer) rides along with the address,
  // same as courier fee does for a shipped group — just no courier to pick.
  const needsTravelFee = needsAddress && !!fulfillment.needsTravelFee;
  // Pickup branch doesn't depend on an address at all — the customer comes
  // to whichever store is picked, so it stands on its own.
  const needsPickupBranch = !!fulfillment.needsPickupBranch;
  return { fulfillment, needsAddress, needsCourier, needsTravelFee, needsPickupBranch };
}

function usePopoverFit(open) {
  const anchorRef = React.useRef(null);
  const [placement, setPlacement] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) { setPlacement(null); return; }
    const rect = anchorRef.current.getBoundingClientRect();
    const margin = 12;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(280, openUp ? spaceAbove : spaceBelow));
    // `position: fixed` (viewport-relative, computed from the trigger's own
    // rect) instead of `absolute` (relative to the trigger, clipped by
    // whichever scrollable ancestor's box it sits inside) — the cart's own
    // scroll region has `overflow-y: auto` for its OWN scrolling, which was
    // silently clipping any popover that opened low in the pane (shipping
    // info, address selector) along with its internal option list, making
    // it look like the list couldn't be scrolled to.
    setPlacement({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      maxHeight,
      ...(openUp
        ? { top: 'auto', bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6, bottom: 'auto' }),
    });
  }, [open]);
  return { anchorRef, popStyle: placement ? { ...cartStyles.pop, ...placement } : cartStyles.pop };
}

function Cart({
  density, channels, channel, setChannel,
  fulfillment, setFulfillment,
  subChannel, setSubChannel,
  payment, setPayment, paymentMethods,
  cart, setQty, removeItem, customer, customers, setCustomer, onAddCustomer,
  addresses, stores,
  phone, setPhone,
  subtotal, vat, discount, total,
  selectorPattern, hideChannelHeader,
  onCheckout,
  memberDiscount, manualDiscount, orderNote,
  onOpenDiscount, onOpenNote, onRemoveDiscount, onRemoveNote,
  couriers, shipGroups, groupOrderMode, enableGroupOrderMode,
  addShipGroup, removeShipGroup, setGroupField, setItemGroup, splitToBranch,
  splitBulkyToShipping, splitVehicleGroups, vehicleTypes, splitPreorderItems,
  activeGroupId, setActiveGroupId,
}) {
  const ch = channels.find(c => c.id === channel);
  // Some marketplace sub-channels mandate their own courier for the whole
  // order (Shopee → SPX, Lazada → LEX) — applies order-wide, not per group,
  // since the sub-channel describes where the WHOLE order came from.
  const activeSubChannel = ch.subChannels && ch.subChannels.find(s => s.id === subChannel);
  const fixedCourierId = (activeSubChannel && activeSubChannel.fixedCourierId) || null;
  const paneStyle = {
    ...cartStyles.pane,
    ...(density === 'compact' ? cartStyles.paneCompact : {}),
    ...(density === 'comfortable' ? cartStyles.paneRoomy : {}),
  };

  const scrollRef = React.useRef(null);
  const isWalkIn = customer.name === 'Walk-in customer';
  const currentFulfillment = ch.fulfillment.find(f => f.id === fulfillment);

  // Service items are on-site visits — always need a customer + address,
  // whatever channel/fulfillment is picked. Digital items ship over the
  // internet — never need an address, unless something else in the same
  // cart does (a mixed cart still needs one).
  const hasService = cart.some(i => i.cat === 'service');
  const hasDigitalOnly = cart.length > 0 && cart.every(i => i.cat === 'digital');
  const requiresAddress = !hasDigitalOnly && (hasService || currentFulfillment.needsAddress);
  const requiresPickupBranch = !hasDigitalOnly && !!currentFulfillment.needsPickupBranch;
  const customerRequired = channel !== 'POS' || hasService;

  // The channel/fulfillment/customer/address stack folds to a one-line
  // summary — tap it to collapse/expand — so tablet screens can give the
  // item list more room. This used to also auto-collapse/expand from the
  // shared scroll position, but split shipment can make the head itself
  // taller than the viewport (one card per ship group): scrolling down to
  // read a second group's card tripped the "scrolled down" threshold, which
  // collapsed the head and yanked the scroll position back — hiding the very
  // content being scrolled to. Manual tap only, no scroll-linked auto-toggle.
  const [formOpen, setFormOpen] = React.useState(true);
  const [groupDrawerOpen, setGroupDrawerOpen] = React.useState(false);

  // Dragging a cart row onto another group's card (drawer only) — built on
  // Pointer Events, not the HTML5 drag-and-drop API. Native `draggable` +
  // `dragstart`/`dragover`/`drop` never fires from a touch gesture (iOS
  // Safari doesn't support it at all; Chrome's touch/mobile-emulation
  // doesn't either), which made this dead on every tablet and every mobile
  // emulator, not just phones — pointer events fire the same way for mouse,
  // touch and pen, real or emulated, so one implementation covers all of
  // them. `dragLineId` identifies the row being dragged, `dragPos` positions
  // the floating ghost chip, `dragOverGroupId` is whichever ShipGroupCard
  // (tagged with `data-ship-group-id`, found via elementFromPoint) is
  // currently under the pointer — read by ShipGroupCard to show the same
  // "drop here" highlight the old dragOver state gave it.
  const [dragLineId, setDragLineId] = React.useState(null);
  const [dragPos, setDragPos] = React.useState(null);
  const [dragOverGroupId, setDragOverGroupId] = React.useState(null);
  const dragMovedRef = React.useRef(false);

  const beginItemDrag = (e, lineId) => {
    if (!groupOrderMode) return;
    e.preventDefault();
    e.stopPropagation();
    // Keeps every later pointermove/pointerup routed to this handle even
    // once the finger/cursor has moved off it — without it a fast drag
    // would "escape" the small handle and stop tracking. Some synthetic or
    // already-released pointers can't be captured; that just means we fall
    // back to whatever the browser delivers naturally, not a hard failure.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    dragMovedRef.current = false;
    setDragLineId(lineId);
    setDragPos({ x: e.clientX, y: e.clientY });
  };
  const moveItemDrag = (e, lineId) => {
    if (dragLineId !== lineId) return;
    dragMovedRef.current = true;
    setDragPos({ x: e.clientX, y: e.clientY });
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const card = el && el.closest ? el.closest('[data-ship-group-id]') : null;
    setDragOverGroupId(card ? card.getAttribute('data-ship-group-id') : null);
  };
  const endItemDrag = (e, lineId) => {
    if (dragLineId !== lineId) return;
    if (dragMovedRef.current && dragOverGroupId) setItemGroup(lineId, dragOverGroupId);
    setDragLineId(null);
    setDragPos(null);
    setDragOverGroupId(null);
  };
  // Gesture got interrupted (browser took over, pointer left the window,
  // multi-touch, …) — drop it without committing a move.
  const cancelItemDrag = (e, lineId) => {
    if (dragLineId !== lineId) return;
    setDragLineId(null);
    setDragPos(null);
    setDragOverGroupId(null);
  };

  const summaryBits = [
    !hideChannelHeader && ch.label,
    !hideChannelHeader && currentFulfillment && currentFulfillment.label,
    isWalkIn ? 'ยังไม่ระบุลูกค้า' : customer.name,
  ].filter(Boolean);

  // One cart line — shared by the flat list (no group order) and the
  // per-group sections (group order mode) so the row markup exists in
  // exactly one place. Draggable in group mode so it can be dropped onto
  // another group's card in the drawer, instead of a numbered chip picker.
  // Keyed and addressed by `lineId`, not the product id — the same product
  // can now sit in more than one group at once (e.g. Iced Latte picked up
  // now in one group, Iced Latte shipped later in another), each its own
  // line with its own qty.
  const renderCartRow = (item) => {
    const lineTotal = item.price * item.qty;
    const initials = item.name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
    const isDragging = dragLineId === item.lineId;
    const isBulky = window.SALE_DATA.isBulkyItem(item);
    const isOutOfStock = item.cat === 'product' && window.SALE_DATA.isOutOfStockEverywhere(item);
    return (
      <div key={item.lineId} style={cartStyles.row(isDragging, groupOrderMode)}>
        {groupOrderMode && (
          <button
            style={cartStyles.dragHandle}
            aria-label="Drag to move to another group"
            onPointerDown={(e) => beginItemDrag(e, item.lineId)}
            onPointerMove={(e) => moveItemDrag(e, item.lineId)}
            onPointerUp={(e) => endItemDrag(e, item.lineId)}
            onPointerCancel={(e) => cancelItemDrag(e, item.lineId)}
          >
            <Icon name="grip" size={16} />
          </button>
        )}
        <div style={cartStyles.rowSwatch(item.swatch)}>{initials}</div>
        <div style={cartStyles.rowInfo}>
          <span style={cartStyles.rowName}>
            <span style={cartStyles.rowNameText}>{item.name}</span>
            {isBulky && (
              <span style={cartStyles.rowBulkyBadge} title="ชิ้นใหญ่/หนัก แนะนำให้แยกจัดส่ง">
                <Icon name="scale" size={10} /> แยกจัดส่ง
              </span>
            )}
            {isOutOfStock && (
              <span style={cartStyles.rowBulkyBadge} title="หมดสต๊อกทุกสาขา — สั่งพรีออเดอร์ได้">
                <Icon name="clock" size={10} /> พรีออเดอร์
              </span>
            )}
          </span>
          <div style={cartStyles.rowLine}>
            <span>฿{item.price.toLocaleString()}</span>
            <span>·</span>
            <span style={{ fontFamily: 'ui-monospace, monospace' }}>{item.sku}</span>
          </div>
        </div>
        <div style={cartStyles.rowPrice}>
          <span style={cartStyles.rowTotal}>฿{lineTotal.toLocaleString()}</span>
          <div style={cartStyles.qtyGroup}>
            <button style={cartStyles.qtyBtn} onClick={() => setQty(item.lineId, item.qty - 1)}>
              <Icon name={item.qty === 1 ? 'x' : 'minus'} size={14} />
            </button>
            <span style={cartStyles.qtyVal}>{item.qty}</span>
            <button style={cartStyles.qtyBtn} onClick={() => setQty(item.lineId, item.qty + 1)}>
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={paneStyle}>
      <div ref={scrollRef} className="scroll-y" style={cartStyles.scrollRegion}>
      <div style={cartStyles.head}>
        <button
          style={cartStyles.headToggle}
          onClick={() => setFormOpen(o => !o)}
          aria-expanded={formOpen}
        >
          <span style={cartStyles.headToggleSummary}>{summaryBits.join(' · ')}</span>
          <span style={cartStyles.headToggleChev(formOpen)}><Icon name="chevD" size={16} /></span>
        </button>

        <div key={formOpen} style={cartStyles.headDetail(formOpen)}>
          {!hideChannelHeader && (
            <div style={cartStyles.channelBlock}>
              <ChannelTabsFixed channels={channels} channel={channel} onSelect={setChannel} />
              {/* Once a group order is active, fulfillment is picked per
                  group (see below) instead of once for the whole order —
                  this global dropdown would just be redundant/misleading. */}
              {groupOrderMode ? (
                ch.subChannels && (
                  <SubChannelDropdown
                    options={ch.subChannels}
                    value={subChannel}
                    onSelect={setSubChannel}
                    label={channel === 'LINK_BILL' ? 'Send via' : 'Source'}
                  />
                )
              ) : ch.subChannels ? (
                // Online/LINK_BILL: sub-channel + fulfillment side by side —
                // matches Figma's two-column "Selection Dropdown" row.
                <div style={cartStyles.dropdownRow}>
                  <SubChannelDropdown
                    options={ch.subChannels}
                    value={subChannel}
                    onSelect={setSubChannel}
                    label={channel === 'LINK_BILL' ? 'Send via' : 'Source'}
                  />
                  <FulfillmentDropdown options={ch.fulfillment} value={fulfillment} onSelect={setFulfillment} grow />
                </div>
              ) : (
                <FulfillmentDropdown options={ch.fulfillment} value={fulfillment} onSelect={setFulfillment} />
              )}
            </div>
          )}

          {!hideChannelHeader && channel === 'LINK_BILL' && (
            <LinkBillBlock expiryMin={30} />
          )}

          {!hideChannelHeader && <div style={cartStyles.divider} />}

          <div style={cartStyles.formBlock}>
            <div style={cartStyles.shipGroupsHead}>
              <span style={cartStyles.formLabel}>
                ข้อมูลลูกค้า{customerRequired && <span style={cartStyles.requiredMark}> *</span>}
              </span>
              {!groupOrderMode && (
                <button style={cartStyles.splitBtn} onClick={enableGroupOrderMode}>
                  <Icon name="plus" size={14} /> สร้างคำสั่งขายกลุ่ม
                </button>
              )}
            </div>
            <CustomerRow customer={customer} customers={customers} onSelect={setCustomer} onAddCustomer={onAddCustomer} />
          </div>

          {/* Warns on the CURRENT fulfillment when it isn't shipping — e.g.
              "รับทันที" — since that's the one that can't actually hand a
              bulky item over the counter conveniently. Nothing to suggest
              once a courier fulfillment is already picked below. */}
          {!groupOrderMode && !currentFulfillment.needsCourier && (
            <div style={cartStyles.formBlock}>
              <BulkyItemBanner items={cart} onSplit={splitBulkyToShipping} />
            </div>
          )}

          {/* Out-of-stock-everywhere items need a pre-order decision
              regardless of which fulfillment is picked — SHIP_FROM_STORE,
              DELIVERY, PICKUP_DEFERRED, all need the stock to exist
              somewhere first. */}
          {!groupOrderMode && (
            <div style={cartStyles.formBlock}>
              <PreorderBanner
                items={cart}
                isPreorder={!!shipGroups[0].isPreorder}
                onSplit={splitPreorderItems}
                onWaitTogether={() => setGroupField(shipGroups[0].id, { isPreorder: true })}
              />
            </div>
          )}

          {requiresAddress && !groupOrderMode && (
            // Default flow — unchanged from before group orders existed:
            // one address, one courier/fee (or travel fee for ON_SITE), no
            // group concept in sight.
            <div style={cartStyles.formBlock}>
              <span style={cartStyles.formLabel}>ข้อมูลการจัดส่ง</span>
              <AddressSelector
                address={addresses.find(a => a.id === shipGroups[0].addressId) || null}
                addresses={addresses}
                onSelect={(aid) => setGroupField(shipGroups[0].id, { addressId: aid })}
              />
              {currentFulfillment.needsCourier && (
                <ShippingInfoRow
                  shipping={{ courierId: shipGroups[0].courierId, fee: shipGroups[0].fee, vehicleType: shipGroups[0].vehicleType }}
                  setShipping={(patch) => setGroupField(shipGroups[0].id, patch)}
                  couriers={couriers}
                  fixedCourierId={fixedCourierId}
                  items={cart}
                  vehicleTypes={vehicleTypes}
                  onSplitVehicles={(vid) => splitVehicleGroups(shipGroups[0].id, vid)}
                />
              )}
              {currentFulfillment.needsTravelFee && (
                <TravelFeeRow
                  fee={shipGroups[0].fee}
                  setFee={(fee) => setGroupField(shipGroups[0].id, { fee })}
                />
              )}
            </div>
          )}

          {requiresPickupBranch && !groupOrderMode && (
            <div style={cartStyles.formBlock}>
              <span style={cartStyles.formLabel}>สาขาที่รับสินค้า</span>
              <PickupBranchSelector
                storeId={shipGroups[0].pickupStoreId}
                stores={stores}
                items={cart}
                onSelect={(sid) => setGroupField(shipGroups[0].id, { pickupStoreId: sid })}
              />
              <PickupStockWarning
                storeId={shipGroups[0].pickupStoreId}
                stores={stores}
                items={cart}
                onSplitToBranch={splitToBranch}
              />
            </div>
          )}

          {/* When a group order is active, its address/shipping controls
              move down to sit with each group's own items (see below) —
              collapsing this header shouldn't also hide the cart. */}
        </div>
      </div>

      {groupOrderMode ? (
        // Group order: the cart section shows a lightweight, read-only
        // summary card per group (count, fulfillment, courier/fee, total) —
        // no address/item list here. The ">" chevron opens the drawer
        // (no overlay) for everything else, including dragging items
        // between groups; the trash icon is the only other action.
        <div style={cartStyles.items}>
          <div style={cartStyles.shipGroupsHead}>
            <span style={cartStyles.formLabel}>คำสั่งขายกลุ่ม</span>
            <button style={cartStyles.splitBtn} onClick={addShipGroup}>
              <Icon name="plus" size={14} /> เพิ่มกลุ่ม
            </button>
          </div>
          <div style={cartStyles.shipGroupSummaryList}>
            {shipGroups.map((g, gi) => (
              <ShipGroupSummaryCard
                key={g.id}
                group={g}
                index={gi}
                items={cart.filter(i => i.groupId === g.id)}
                couriers={couriers}
                stores={stores}
                fulfillmentOptions={ch.fulfillment}
                canRemove={shipGroups.length > 1}
                active={g.id === activeGroupId}
                onActivate={() => setActiveGroupId(g.id)}
                onRemove={() => removeShipGroup(g.id)}
                onOpen={() => { setActiveGroupId(g.id); setGroupDrawerOpen(true); }}
              />
            ))}
          </div>
        </div>
      ) : cart.length === 0 ? (
        <div style={cartStyles.empty}>
          <div style={cartStyles.emptyIcon}><Icon name="cart" size={24} /></div>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Cart is empty</div>
          <div style={{ fontSize: 'var(--fs-caption)' }}>Tap or scan products to begin an order.</div>
        </div>
      ) : (
        <div style={cartStyles.items}>
          {cart.map(item => renderCartRow(item))}
        </div>
      )}
      </div>

      {cart.length > 0 && (
        <div style={cartStyles.extras}>
          {!manualDiscount ? (
            <button style={cartStyles.extraBtn} onClick={onOpenDiscount}>
              <Icon name="discount" size={14} />
              <span>Add discount</span>
            </button>
          ) : (
            <div style={cartStyles.extraChip}>
              <span style={cartStyles.extraChipIcon}><Icon name="discount" size={12} /></span>
              <span style={cartStyles.extraChipBody} onClick={onOpenDiscount}>
                <span style={cartStyles.extraChipLabel}>
                  {manualDiscount.kind === 'percent' ? `${manualDiscount.value}% off` :
                   manualDiscount.kind === 'amount'  ? `฿${manualDiscount.value} off` :
                   manualDiscount.code}
                </span>
                <span style={cartStyles.extraChipSub}>
                  −฿{manualDiscount.amount.toLocaleString()}{manualDiscount.reason ? ` · ${manualDiscount.reason}` : ''}
                </span>
              </span>
              <button style={cartStyles.extraChipX} onClick={onRemoveDiscount} aria-label="Remove discount">
                <Icon name="x" size={12} />
              </button>
            </div>
          )}
          {!orderNote ? (
            <button style={cartStyles.extraBtn} onClick={onOpenNote}>
              <Icon name="note" size={14} />
              <span>Order note</span>
            </button>
          ) : (
            <div style={cartStyles.extraChip}>
              <span style={cartStyles.extraChipIcon}><Icon name="note" size={12} /></span>
              <span style={cartStyles.extraChipBody} onClick={onOpenNote}>
                <span style={cartStyles.extraChipLabel}>Order note</span>
                <span style={cartStyles.extraChipSub}>{orderNote}</span>
              </span>
              <button style={cartStyles.extraChipX} onClick={onRemoveNote} aria-label="Remove note">
                <Icon name="x" size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      <div style={cartStyles.totals}>
        <div style={cartStyles.totalSub}>
          <span>{cart.reduce((s, i) => s + i.qty, 0)} รายการ · ฿{subtotal.toLocaleString()}</span>
          <span>VAT 7% ฿{vat.toLocaleString()}</span>
        </div>
        {memberDiscount > 0 && (
          <div style={{ ...cartStyles.totalRow, ...cartStyles.totalDisc }}>
            <span>Member discount (5%)</span>
            <span>−฿{memberDiscount.toLocaleString()}</span>
          </div>
        )}
        {manualDiscount && (
          <div style={{ ...cartStyles.totalRow, ...cartStyles.totalDisc }}>
            <span>
              {manualDiscount.kind === 'percent' ? `Discount ${manualDiscount.value}%` :
               manualDiscount.kind === 'amount'  ? 'Manual discount' :
               `Coupon · ${manualDiscount.code}`}
            </span>
            <span>−฿{manualDiscount.amount.toLocaleString()}</span>
          </div>
        )}
        <div style={cartStyles.grandRow}>
          <span style={cartStyles.grandLbl}>Total</span>
          <span style={cartStyles.grandVal}>฿{total.toLocaleString()}</span>
        </div>
      </div>

      <div style={cartStyles.action}>
        <button
          style={cartStyles.charge(cart.length === 0)}
          disabled={cart.length === 0}
          onClick={() => cart.length > 0 && onCheckout && onCheckout()}
        >
          <span>
            {channel === 'LINK_BILL' ? 'Generate LINK_BILL' : `Checkout · ฿${total.toLocaleString()}`}
          </span>
          <span style={cartStyles.chargeKey}>↵ Enter</span>
        </button>
      </div>

      {groupOrderMode && (
        <GroupManagerDrawer
          open={groupDrawerOpen}
          onClose={() => setGroupDrawerOpen(false)}
          customer={customer}
          customers={customers}
          setCustomer={setCustomer}
          onAddCustomer={onAddCustomer}
          shipGroups={shipGroups}
          cart={cart}
          renderRow={renderCartRow}
          addresses={addresses}
          couriers={couriers}
          stores={stores}
          fulfillmentOptions={ch.fulfillment}
          fixedCourierId={fixedCourierId}
          activeGroupId={activeGroupId}
          setActiveGroupId={setActiveGroupId}
          dragOverGroupId={dragOverGroupId}
          addShipGroup={addShipGroup}
          removeShipGroup={removeShipGroup}
          setGroupField={setGroupField}
          splitToBranch={splitToBranch}
          vehicleTypes={vehicleTypes}
          splitVehicleGroups={splitVehicleGroups}
          splitBulkyToShipping={splitBulkyToShipping}
          splitPreorderItems={splitPreorderItems}
        />
      )}

      {/* Floating chip that follows the pointer while a row is being
          dragged (see beginItemDrag) — position: fixed at the Cart level,
          not inside whichever card the row started in, so it isn't clipped
          by the drawer's own scroll region as it crosses card boundaries. */}
      {dragLineId && dragPos && (() => {
        const draggedItem = cart.find(i => i.lineId === dragLineId);
        if (!draggedItem) return null;
        return (
          <div style={cartStyles.dragGhost(dragPos.x, dragPos.y)}>
            <Icon name="grip" size={14} />
            <span>{draggedItem.name}</span>
          </div>
        );
      })()}
    </div>
  );
}

window.Cart = Cart;

// Figma "Horizon tab_v.1" — always-expanded segmented control (gray track,
// white active tab + shadow). Used for the Channel row per CartSectionv3.
function ChannelTabsFixed({ channels, channel, onSelect }) {
  return (
    <div style={cartStyles.segGroup} role="tablist">
      {channels.map(c => {
        const active = c.id === channel;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            style={cartStyles.segTab(active)}
            onClick={() => onSelect(c.id)}
          >
            <span style={cartStyles.segLabel}>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Sub-channel picker (ONLINE source / LINK_BILL send-via) — same dropdown-row
// pattern as FulfillmentDropdown, with a colored initial-letter chip instead
// of an outline icon since sub-channels are brand-colored (LINE, Shopee, …).
function SubChannelDropdown({ options, value, onSelect, label }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const current = options.find(o => o.id === value) || options[0];
  return (
    <div ref={anchorRef} style={{ ...cartStyles.popWrap, flex: '1 1 0' }}>
      <button style={cartStyles.ddRow} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.popItemIcon(current.color, true)}>{current.label.charAt(0).toUpperCase()}</span>
        <span style={cartStyles.infoRowLabel}>{current.label}</span>
        <span style={cartStyles.infoRowChev}><Icon name="chevD" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>{label}</div>
            {options.map(o => {
              const active = o.id === value;
              return (
                <button
                  key={o.id}
                  style={cartStyles.popItem(active)}
                  onClick={() => { onSelect(o.id); setOpen(false); }}
                >
                  <span style={cartStyles.popItemIcon(o.color, active)}>{o.label.charAt(0).toUpperCase()}</span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemLabel}>{o.label}</span>
                    <span style={cartStyles.popItemSub}>{o.hint}</span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Figma "Selection Dropdown" — a single bordered row showing the current
// fulfillment option; click opens the same popover list used elsewhere.
function FulfillmentDropdown({ options, value, onSelect, grow }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const current = options.find(o => o.id === value);
  return (
    <div ref={anchorRef} style={grow ? { ...cartStyles.popWrap, flex: '1 1 0' } : cartStyles.popWrap}>
      <button style={cartStyles.ddRow} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.infoRowIcon}><Icon name={current.icon} size={20} /></span>
        <span style={cartStyles.infoRowLabel}>{current.label}</span>
        <span style={cartStyles.infoRowChev}><Icon name="chevD" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>Fulfillment</div>
            {options.map(o => {
              const active = o.id === value;
              return (
                <button
                  key={o.id}
                  style={cartStyles.popItem(active)}
                  onClick={() => { onSelect(o.id); setOpen(false); }}
                >
                  <span style={cartStyles.popItemIcon('var(--gray-700)', active)}>
                    <Icon name={o.icon} size={13} />
                  </span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemLabel}>{o.label}</span>
                    <span style={cartStyles.popItemSub}>{o.sub}</span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Figma "Customer info" — full-width row (user icon · label · chevron-right).
// Opens a popover to pick from the saved customer list.
// No customer attached yet — plain "add customer" button (Figma's empty
// "Customer info" state). Opens the same customer-picker popover as the card.
// Inline "+ เพิ่มลูกค้าใหม่" form — name + phone only (enough to attach a
// recipient for delivery/pickup-branch groups); shows above the existing-
// customer list inside the same popover so a walk-in can be added without
// leaving the cart pane or closing the group-order drawer.
function NewCustomerForm({ onCancel, onSave }) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const canSave = name.trim().length > 0;
  return (
    <div style={cartStyles.popForm}>
      <div style={cartStyles.popFormField}>
        <span style={cartStyles.popFormLabel}>ชื่อลูกค้า *</span>
        <input
          autoFocus
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={cartStyles.shipFeeInput}
        />
      </div>
      <div style={cartStyles.popFormField}>
        <span style={cartStyles.popFormLabel}>เบอร์โทร</span>
        <input
          type="tel"
          placeholder="08x-xxx-xxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={cartStyles.shipFeeInput}
        />
      </div>
      <div style={cartStyles.popFormActions}>
        <button style={cartStyles.popFormCancel} onClick={onCancel}>ยกเลิก</button>
        <button
          style={{ ...cartStyles.popFormSave, ...(canSave ? {} : cartStyles.popFormSaveDisabled) }}
          disabled={!canSave}
          onClick={() => canSave && onSave({ name, phone })}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}

function CustomerRow({ customer, customers, onSelect, onAddCustomer }) {
  const [open, setOpen] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const isWalkIn = customer.name === 'Walk-in customer';

  const closeAll = () => { setOpen(false); setAdding(false); };
  const handleAdd = (data) => { onAddCustomer(data); closeAll(); };

  const list = (
    <>
      <div onClick={closeAll} style={cartStyles.popScrim} />
      <div style={popStyle}>
        {adding ? (
          <>
            <div style={cartStyles.popHd}>เพิ่มลูกค้าใหม่</div>
            <NewCustomerForm onCancel={() => setAdding(false)} onSave={handleAdd} />
          </>
        ) : (
          <>
            <div style={cartStyles.popHd}>ลูกค้า</div>
            {onAddCustomer && (
              <button style={cartStyles.popAddBtn} onClick={() => setAdding(true)}>
                <span style={cartStyles.popAddBtnIcon}><Icon name="plus" size={14} /></span>
                เพิ่มลูกค้าใหม่
              </button>
            )}
            {customers.map(c => {
              const active = c.id === customer.id;
              return (
                <button key={c.id} style={cartStyles.popItem(active)} onClick={() => { onSelect(c.id); closeAll(); }}>
                  <span style={cartStyles.popItemIcon(c.tier === 'Gold' ? 'var(--amber-500)' : 'var(--brand-500)', active)}>
                    <Icon name="user" size={13} />
                  </span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemLabel}>{c.name}</span>
                    <span style={cartStyles.popItemSub}>{c.phone ? `${c.phone}${c.tier ? ` · ${c.tier} member` : ''}` : 'No customer attached'}</span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </>
        )}
      </div>
    </>
  );

  if (isWalkIn) {
    return (
      <div ref={anchorRef} style={cartStyles.popWrap}>
        <button style={cartStyles.infoRow(false)} onClick={() => setOpen(o => !o)}>
          <span style={cartStyles.infoRowIcon}><Icon name="user" size={20} /></span>
          <span style={cartStyles.infoRowLabel}>เพิ่มข้อมูลลูกค้า</span>
          <span style={cartStyles.infoRowChev}><Icon name="chevR" size={20} /></span>
        </button>
        {open && list}
      </div>
    );
  }

  // A real customer is attached — Figma's card: name/phone/email + "นำออก"
  // to detach, and (when the order needs one) a nested address selector.
  return (
    <div style={cartStyles.customerCard}>
      <div style={cartStyles.customerCardTop}>
        <div style={cartStyles.customerCardBody} onClick={() => setOpen(o => !o)}>
          <span style={cartStyles.customerCardName}>{customer.name}</span>
          <span style={cartStyles.customerCardMeta}>
            {[customer.phone, customer.email].filter(Boolean).join(' | ')}
          </span>
        </div>
        <button style={cartStyles.customerCardRemove} onClick={() => onSelect('c001')}>
          นำออก
        </button>
      </div>

      {open && (
        <div ref={anchorRef} style={cartStyles.popWrap}>
          {list}
        </div>
      )}
    </div>
  );
}

// A dropdown-input styled row: a green "ที่อยู่หลัก" badge (or gray for a
// non-default address) + the address text + a chevron. Nested inside each
// ShipGroupCard below, since with split shipment every group picks its own
// address. If the attached customer has no saved address, shows a red
// prompt instead (that group can't ship without one).
function AddressSelector({ address, addresses, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  if (addresses.length === 0) {
    return (
      <div style={cartStyles.addrField}>
        <span style={{ ...cartStyles.addrFieldText, ...cartStyles.addrFieldPlaceholder }}>
          ลูกค้ายังไม่มีที่อยู่ — กรุณาเพิ่มที่อยู่จัดส่ง
        </span>
      </div>
    );
  }
  return (
    <div ref={anchorRef} style={cartStyles.popWrap}>
      <button style={cartStyles.addrField} onClick={() => setOpen(o => !o)}>
        {address && (
          <span style={cartStyles.addrBadge(address.primary)}>{address.label}</span>
        )}
        <span style={cartStyles.addrFieldText}>
          {address ? address.detail : 'เลือกที่อยู่จัดส่ง'}
        </span>
        <span style={cartStyles.infoRowChev}><Icon name="chevD" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>ที่อยู่จัดส่ง</div>
            {addresses.map(a => {
              const active = address && a.id === address.id;
              return (
                <button key={a.id} style={cartStyles.popItem(active)} onClick={() => { onSelect(a.id); setOpen(false); }}>
                  <span style={cartStyles.addrBadge(a.primary)}>{a.label}</span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemSub}>{a.detail}</span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Figma "ข้อมูลการจัดส่ง" — courier + shipping fee, only relevant for
// Online/LINK_BILL deliveries. Couriers split into "จัดส่งมาตรฐาน" (standard
// drop-off networks) and "จัดส่งภายในวัน" (Same Day — Grab/Lineman/Lalamove,
// an on-demand rider) since they're picked for very different reasons.
// `fixedCourierId` — set when the order's sub-channel is a marketplace that
// mandates its own logistics (Shopee → SPX, Lazada → LEX, see data.js) —
// locks the courier to it instead of leaving the list open, since a seller
// can't actually choose a different one for those orders.
function ShippingInfoRow({ shipping, setShipping, couriers, fixedCourierId, items, vehicleTypes, onSplitVehicles }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const fixedCourier = fixedCourierId ? couriers.find(c => c.id === fixedCourierId) : null;
  const courier = fixedCourier || couriers.find(c => c.id === shipping.courierId);
  const feeText = shipping.fee !== '' && shipping.fee != null
    ? `฿${Number(shipping.fee).toLocaleString()}`
    : 'ไม่ระบุค่าส่ง';
  const summary = courier
    ? `จัดส่งโดย ${courier.label}${fixedCourier ? ' (บังคับตามช่องทาง)' : ''} | ${feeText}`
    : 'ระบุขนส่งและค่าจัดส่ง';
  const standardCouriers = couriers.filter(c => c.category !== 'same_day');
  const sameDayCouriers = couriers.filter(c => c.category === 'same_day');

  return (
    <div ref={anchorRef} style={cartStyles.popWrap}>
      <button style={cartStyles.infoRow(false)} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.infoRowIcon}><Icon name="truck" size={20} /></span>
        <span style={cartStyles.infoRowLabel}>{summary}</span>
        <span style={cartStyles.infoRowChev}><Icon name="chevR" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>ค่าจัดส่ง (บาท)</div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="ไม่ระบุ"
              value={shipping.fee}
              onChange={(e) => setShipping({ ...shipping, fee: e.target.value })}
              style={cartStyles.shipFeeInput}
            />
            {fixedCourier ? (
              <div style={cartStyles.fixedNote}>
                <Icon name="info" size={13} />
                <span>ช่องทางนี้กำหนดให้จัดส่งโดย {fixedCourier.label} เท่านั้น</span>
              </div>
            ) : (
              <>
                <div style={cartStyles.popHd}>จัดส่งมาตรฐาน</div>
                {standardCouriers.map(c => {
                  const active = c.id === shipping.courierId;
                  return (
                    <button
                      key={c.id}
                      style={cartStyles.popItem(active)}
                      onClick={() => setShipping({ ...shipping, courierId: c.id })}
                    >
                      <span style={cartStyles.popItemIcon('var(--gray-700)', active)}><Icon name="truck" size={13} /></span>
                      <span style={cartStyles.popItemBody}>
                        <span style={cartStyles.popItemLabel}>{c.label}</span>
                      </span>
                      {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                    </button>
                  );
                })}
                {sameDayCouriers.length > 0 && (
                  <>
                    <div style={cartStyles.popHd}>จัดส่งภายในวัน (Same Day)</div>
                    {sameDayCouriers.map(c => {
                      const active = c.id === shipping.courierId;
                      return (
                        <button
                          key={c.id}
                          style={cartStyles.popItem(active)}
                          onClick={() => setShipping({ ...shipping, courierId: c.id })}
                        >
                          <span style={cartStyles.popItemIcon('var(--amber-500)', active)}><Icon name="clock" size={13} /></span>
                          <span style={cartStyles.popItemBody}>
                            <span style={cartStyles.popItemLabel}>{c.label}</span>
                          </span>
                          {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                        </button>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
      {!fixedCourier && courier && courier.category === 'same_day' && items && vehicleTypes && (
        <VehicleTypeRow
          courier={courier}
          vehicleTypes={vehicleTypes}
          items={items}
          vehicleType={shipping.vehicleType}
          onSetVehicleType={(vid) => setShipping({ ...shipping, vehicleType: vid })}
          onSplitVehicles={onSplitVehicles}
        />
      )}
    </div>
  );
}

// Which vehicle a same-day rider shows up on — only offered once a same_day
// courier is chosen (see ShippingInfoRow above), and only the vehicles that
// courier actually dispatches (data.js couriers' `vehicleTypes`). A rider
// can only strap down so many bulky items per trip (vehicleTypes'
// `maxBulkyItems` — a motorcycle takes exactly one suitcase-sized item, a
// van takes fifteen): once this group's bulky quantity exceeds that, the
// warning below names how many vehicles the job actually needs and offers
// to fan the group out into that many, one bulky item's worth each.
function VehicleTypeRow({ courier, vehicleTypes, items, vehicleType, onSetVehicleType, onSplitVehicles }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const options = vehicleTypes.filter(v => (courier.vehicleTypes || []).includes(v.id));
  const selected = options.find(v => v.id === vehicleType) || null;

  const bulkyItems = items.filter(i => window.SALE_DATA.isBulkyItem(i));
  const bulkyQty = bulkyItems.reduce((s, i) => s + i.qty, 0);
  const vehiclesNeeded = selected && bulkyQty > 0 ? Math.ceil(bulkyQty / selected.maxBulkyItems) : 1;

  return (
    <div ref={anchorRef} style={cartStyles.popWrap}>
      <button style={cartStyles.infoRow(false)} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.infoRowIcon}><Icon name={selected ? selected.icon : 'moto'} size={20} /></span>
        <span style={cartStyles.infoRowLabel}>
          {selected ? `พาหนะ: ${selected.label}` : 'เลือกประเภทพาหนะ'}
        </span>
        <span style={cartStyles.infoRowChev}><Icon name="chevR" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>ประเภทพาหนะ ({courier.label})</div>
            {options.map(v => {
              const active = v.id === vehicleType;
              return (
                <button
                  key={v.id}
                  style={cartStyles.popItem(active)}
                  onClick={() => { onSetVehicleType(v.id); setOpen(false); }}
                >
                  <span style={cartStyles.popItemIcon('var(--gray-700)', active)}><Icon name={v.icon} size={13} /></span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemLabel}>{v.label}</span>
                    <span style={cartStyles.popItemSub}>รับสินค้าชิ้นใหญ่ได้สูงสุด {v.maxBulkyItems} ชิ้น/คัน</span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </div>
        </>
      )}
      {selected && vehiclesNeeded > 1 && (
        <div style={cartStyles.stockWarnBox}>
          <div style={cartStyles.stockWarnRow}>
            <span style={cartStyles.stockWarnIcon}><Icon name="warn" size={14} /></span>
            <span style={cartStyles.stockWarnText}>
              มีสินค้าชิ้นใหญ่ {bulkyQty} ชิ้น แต่ {selected.label} รับได้คันละ {selected.maxBulkyItems} ชิ้น
              ต้องแยกเป็น <strong>{vehiclesNeeded} คัน</strong>
            </span>
            {onSplitVehicles && (
              <button
                style={cartStyles.stockWarnAction}
                onClick={() => onSplitVehicles(selected.id)}
              >
                แยกเป็น {vehiclesNeeded} คัน
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mixed-cart fulfillment nudge — a walk-in basket with both drinks (handed
// over on the spot) and something bulky (a coffee machine, an XL ice
// bucket) shouldn't force the whole order into one fulfillment. Names which
// lines are bulky and offers to split just those into their own
// "จัดส่งจากร้าน" group, leaving the light items to go out with the customer
// now. Only useful before a group split has already happened — once
// group-order mode is on, the cashier is already deciding this per group.
function BulkyItemBanner({ items, onSplit }) {
  const bulky = items.filter(i => window.SALE_DATA.isBulkyItem(i));
  const light = items.filter(i => !window.SALE_DATA.isBulkyItem(i) && i.cat === 'product');
  if (bulky.length === 0 || light.length === 0) return null;

  const bulkyNames = bulky.slice(0, 2).map(i => i.name).join(', ')
    + (bulky.length > 2 ? ` และอีก ${bulky.length - 2} รายการ` : '');

  return (
    <div style={cartStyles.stockWarnBox}>
      <div style={cartStyles.stockWarnRow}>
        <span style={cartStyles.stockWarnIcon}><Icon name="scale" size={14} /></span>
        <span style={cartStyles.stockWarnText}>
          <strong>{bulkyNames}</strong> มีขนาด/น้ำหนักเกินกว่าจะรับไปพร้อมลูกค้าได้สะดวก
          แนะนำให้แยกจัดส่งจากร้านแทน ส่วนสินค้าที่เหลือรับได้ทันที
        </span>
        <button
          style={cartStyles.stockWarnAction}
          onClick={() => onSplit(bulky.map(i => i.lineId))}
        >
          แยกไปจัดส่งจากร้าน
        </button>
      </div>
    </div>
  );
}

// A product out of stock at every branch (see data.js isOutOfStockEverywhere)
// can still be sold — as a pre-order — but the group needs to decide how:
//  1. Only out-of-stock lines in this group → nothing to split from, one
//     button straight into pre-order for the whole group.
//  2. Mixed with in-stock lines → offer the choice from the spec: split the
//     ready items into their own group to ship now (`onSplit`), or keep
//     everything together and let the whole group wait for the pre-order
//     (`onWaitTogether`).
// Once the group is already marked `isPreorder`, this just confirms the
// status instead of re-asking — the decision was already made.
function PreorderBanner({ items, isPreorder, onSplit, onWaitTogether }) {
  const outOfStock = items.filter(i => i.cat === 'product' && window.SALE_DATA.isOutOfStockEverywhere(i));
  if (outOfStock.length === 0) return null;
  const inStock = items.filter(i => !outOfStock.includes(i));

  const names = outOfStock.slice(0, 2).map(i => i.name).join(', ')
    + (outOfStock.length > 2 ? ` และอีก ${outOfStock.length - 2} รายการ` : '');

  if (isPreorder) {
    return (
      <div style={cartStyles.stockWarnBox}>
        <div style={cartStyles.stockWarnRow}>
          <span style={cartStyles.stockWarnIcon}><Icon name="clock" size={14} /></span>
          <span style={cartStyles.stockWarnText}>
            <strong>{names}</strong> หมดสต๊อกทุกสาขา — อยู่ในสถานะ <strong>พรีออเดอร์</strong> จะจัดส่งเมื่อสินค้าครบ
          </span>
        </div>
      </div>
    );
  }

  if (inStock.length === 0) {
    return (
      <div style={cartStyles.stockWarnBox}>
        <div style={cartStyles.stockWarnRow}>
          <span style={cartStyles.stockWarnIcon}><Icon name="clock" size={14} /></span>
          <span style={cartStyles.stockWarnText}>
            <strong>{names}</strong> หมดสต๊อกทุกสาขา สามารถสั่งพรีออเดอร์ได้
          </span>
          <button style={cartStyles.stockWarnAction} onClick={onWaitTogether}>
            สั่งพรีออเดอร์
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={cartStyles.stockWarnBox}>
      <div style={cartStyles.stockWarnRow}>
        <span style={cartStyles.stockWarnIcon}><Icon name="clock" size={14} /></span>
        <span style={cartStyles.stockWarnText}>
          <strong>{names}</strong> หมดสต๊อกทุกสาขา ส่วนสินค้าที่เหลือพร้อมจัดส่ง
        </span>
      </div>
      <div style={cartStyles.preorderActions}>
        <button style={cartStyles.stockWarnAction} onClick={() => onSplit(outOfStock.map(i => i.lineId))}>
          แยกออเดอร์ จัดส่งของพร้อมก่อน
        </button>
        <button style={cartStyles.stockWarnActionGhost} onClick={onWaitTogether}>
          ไม่แยก รอสินค้าครบก่อน
        </button>
      </div>
    </div>
  );
}

// Travel fee for an ON_SITE visit — same fee field as ShippingInfoRow's, just
// no courier to pick since staff drive themselves rather than book a courier.
function TravelFeeRow({ fee, setFee }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const feeText = fee !== '' && fee != null ? `฿${Number(fee).toLocaleString()}` : 'ไม่ระบุค่าเดินทาง';

  return (
    <div ref={anchorRef} style={cartStyles.popWrap}>
      <button style={cartStyles.infoRow(false)} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.infoRowIcon}><Icon name="truck" size={20} /></span>
        <span style={cartStyles.infoRowLabel}>ค่าเดินทาง · {feeText}</span>
        <span style={cartStyles.infoRowChev}><Icon name="chevR" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>ค่าเดินทาง (บาท)</div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="ไม่ระบุ"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              style={cartStyles.shipFeeInput}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Which store branch a "รับภายหลัง" (pickup later) group will be collected
// from — defaults to whichever store the cashier is currently in, but a
// customer may ask to collect from a different branch instead. A branch
// that doesn't have enough of every item in the group is shown but disabled
// — visible so it's clear the branch exists, just can't be picked for this
// order, rather than silently missing from the list.
// Shared by PickupBranchSelector and PickupStockWarning below — which of
// this group's items a given branch doesn't have enough of.
function missingItemsAt(items, sid) {
  return items.filter(i => {
    const available = i.stockByStore ? i.stockByStore[sid] : i.stock;
    return available != null && available < i.qty;
  });
}

function PickupBranchSelector({ storeId, stores, items, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const { anchorRef, popStyle } = usePopoverFit(open);
  const store = stores.find(s => s.id === storeId) || null;

  return (
    <div ref={anchorRef} style={cartStyles.popWrap}>
      <button style={cartStyles.infoRow(false)} onClick={() => setOpen(o => !o)}>
        <span style={cartStyles.infoRowIcon}><Icon name="store" size={20} /></span>
        <span style={cartStyles.infoRowLabel}>
          {store ? `รับที่สาขา ${store.label}` : 'เลือกสาขาที่รับสินค้า'}
        </span>
        <span style={cartStyles.infoRowChev}><Icon name="chevR" size={20} /></span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={cartStyles.popScrim} />
          <div style={popStyle}>
            <div style={cartStyles.popHd}>สาขาที่รับสินค้า</div>
            {stores.map(s => {
              const active = s.id === storeId;
              const missing = missingItemsAt(items, s.id);
              const available = missing.length === 0;
              const missingNames = missing.slice(0, 2).map(i => i.name).join(', ')
                + (missing.length > 2 ? ` และอีก ${missing.length - 2} รายการ` : '');
              return (
                <button
                  key={s.id}
                  style={cartStyles.popItem(active, !available)}
                  disabled={!available}
                  onClick={() => { if (available) { onSelect(s.id); setOpen(false); } }}
                >
                  <span style={cartStyles.popItemIcon('var(--gray-700)', active)}><Icon name="store" size={13} /></span>
                  <span style={cartStyles.popItemBody}>
                    <span style={cartStyles.popItemLabel}>{s.label}</span>
                    <span style={available ? cartStyles.popItemSub : cartStyles.popItemSubWarn}>
                      {available ? s.hours : `ไม่มี: ${missingNames}`}
                    </span>
                  </span>
                  {active && <span style={cartStyles.popCheck}><Icon name="check" size={12} /></span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Surfaces the same shortage the branch popover's disabled state hides
// behind a click — e.g. ordering a phone in 3 colors for pickup at branch A,
// which turns out to be out of black. Names exactly which item(s) fall
// short and, if another branch has enough of that specific item, offers to
// split just that line into its own group picked up from there instead of
// forcing the whole order to move. Shows up even when the branch was valid
// when first picked but a later item addition made it fall short.
function PickupStockWarning({ storeId, stores, items, onSplitToBranch }) {
  const missing = missingItemsAt(items, storeId);
  if (missing.length === 0) return null;

  const rows = missing.map(item => {
    const altStore = stores.find(s => {
      if (s.id === storeId) return false;
      const available = item.stockByStore ? item.stockByStore[s.id] : item.stock;
      return available != null && available >= item.qty;
    });
    return { item, altStore };
  });

  return (
    <div style={cartStyles.stockWarnBox}>
      {rows.map(({ item, altStore }) => (
        <div key={item.lineId} style={cartStyles.stockWarnRow}>
          <span style={cartStyles.stockWarnIcon}><Icon name="warn" size={14} /></span>
          <span style={cartStyles.stockWarnText}>
            <strong>{item.name}</strong> ไม่มีที่สาขานี้
            {altStore ? ` — มีสต็อกที่ ${altStore.label}` : ' และไม่มีสต็อกที่สาขาอื่นเช่นกัน'}
          </span>
          {altStore && (
            <button
              style={cartStyles.stockWarnAction}
              onClick={() => onSplitToBranch(item.lineId, altStore.id)}
            >
              แยกไปรับที่ {altStore.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// One "คำสั่งขายกลุ่ม" (sale-order group) within a group order — its own
// address + courier + fee AND its own cart lines, all in one card, inside
// the management drawer. Tapping the card (focus mode) makes it the active
// group, so tapping products in the grid — drawer stays open, no scrim —
// adds straight into it instead of wherever it last landed. Items can also
// still be dragged from one card onto another to move them across groups.
function ShipGroupCard({
  group, index, items, renderRow, addresses, couriers, stores, fulfillmentOptions, fixedCourierId, canRemove,
  active, onActivate, isDropTarget, onRemove, onSetFulfillment, onSetAddress, onSetShipping, onSetPickupStore, onSplitToBranch,
  vehicleTypes, onSplitVehicles, onSplitBulky, onSplitPreorder, onMarkPreorder,
}) {
  const { needsAddress, needsCourier, needsTravelFee, needsPickupBranch } = groupFulfillmentNeeds(fulfillmentOptions, group, items);

  return (
    <div
      data-ship-group-id={group.id}
      style={cartStyles.shipGroupCard(isDropTarget, active)}
      onClick={onActivate}
    >
      <div style={cartStyles.shipGroupHead}>
        <span style={cartStyles.shipGroupLabel}>คำสั่งขายกลุ่ม {index + 1}</span>
        {active && <span style={cartStyles.shipGroupActiveBadge}>กำลังเพิ่มสินค้า</span>}
        {group.isPreorder && (
          <span style={cartStyles.preorderBadge}><Icon name="clock" size={11} /> พรีออเดอร์</span>
        )}
        <span style={cartStyles.shipGroupCount}>{items.length} รายการ</span>
        {canRemove && (
          <button
            style={cartStyles.shipGroupRemove}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label="Remove ship group"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      <FulfillmentDropdown options={fulfillmentOptions} value={group.fulfillmentId} onSelect={onSetFulfillment} />

      {/* Warns on the fulfillment that's currently NOT shipping — e.g.
          "รับทันที" — since that's the one that can't actually hand over a
          bulky item conveniently. Once the group is already on a courier
          fulfillment there's nothing left to suggest splitting out of. */}
      {!needsCourier && (
        <BulkyItemBanner items={items} onSplit={onSplitBulky} />
      )}

      <PreorderBanner
        items={items}
        isPreorder={!!group.isPreorder}
        onSplit={onSplitPreorder}
        onWaitTogether={onMarkPreorder}
      />

      {needsAddress && (
        <AddressSelector
          address={addresses.find(a => a.id === group.addressId) || null}
          addresses={addresses}
          onSelect={onSetAddress}
        />
      )}

      {needsCourier && (
        <ShippingInfoRow
          shipping={{ courierId: group.courierId, fee: group.fee, vehicleType: group.vehicleType }}
          setShipping={onSetShipping}
          couriers={couriers}
          fixedCourierId={fixedCourierId}
          items={items}
          vehicleTypes={vehicleTypes}
          onSplitVehicles={(vid) => onSplitVehicles(group.id, vid)}
        />
      )}

      {needsTravelFee && (
        <TravelFeeRow fee={group.fee} setFee={(fee) => onSetShipping({ fee })} />
      )}

      {needsPickupBranch && (
        <>
          <PickupBranchSelector storeId={group.pickupStoreId} stores={stores} items={items} onSelect={onSetPickupStore} />
          <PickupStockWarning storeId={group.pickupStoreId} stores={stores} items={items} onSplitToBranch={onSplitToBranch} />
        </>
      )}

      <div style={cartStyles.shipGroupItems}>
        {items.length === 0 ? (
          <div style={cartStyles.shipGroupItemsEmpty}>
            ยังไม่มีสินค้าในกลุ่มนี้ — ลากรายการจากกลุ่มอื่นมาวางที่นี่ หรือแตะสินค้าขณะกลุ่มนี้เปิดอยู่เพื่อเพิ่มเข้ามา
          </div>
        ) : (
          items.map(item => renderRow(item))
        )}
      </div>
    </div>
  );
}

// Main-pane version of a group — read-only, just enough to shop by: group
// number, item count, fulfillment type, total, and courier/fee if it ships.
// Mirrors the drawer's active highlight (see ShipGroupCard) so which group
// new taps land in is still clear once the drawer is closed — clicking the
// card itself also focuses it, same as in the drawer, without opening it.
// Only other action here is deleting the group; everything else — including
// opening the drawer — is behind the ">" chevron.
function ShipGroupSummaryCard({ group, index, items, couriers, stores, fulfillmentOptions, canRemove, active, onActivate, onRemove, onOpen }) {
  const { fulfillment, needsCourier, needsTravelFee, needsPickupBranch } = groupFulfillmentNeeds(fulfillmentOptions, group, items);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const courier = couriers.find(c => c.id === group.courierId);
  const feeText = group.fee !== '' && group.fee != null ? `฿${Number(group.fee).toLocaleString()}` : 'ไม่ระบุค่าส่ง';
  const travelFeeText = group.fee !== '' && group.fee != null ? `฿${Number(group.fee).toLocaleString()}` : 'ไม่ระบุค่าเดินทาง';
  const pickupStore = stores.find(s => s.id === group.pickupStoreId);

  return (
    <div style={cartStyles.shipGroupSummaryCard(active)} onClick={onActivate}>
      <div style={cartStyles.shipGroupSummaryTop}>
        <span style={cartStyles.shipGroupLabel}>คำสั่งขายกลุ่ม {index + 1}</span>
        {active && <span style={cartStyles.shipGroupActiveBadge}>กำลังเพิ่มสินค้า</span>}
        {canRemove && (
          <button style={cartStyles.shipGroupRemove} onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label="Remove ship group">
            <Icon name="x" size={16} />
          </button>
        )}
        <button style={cartStyles.shipGroupSummaryOpen} onClick={(e) => { e.stopPropagation(); onOpen(); }} aria-label="Manage group">
          <Icon name="chevR" size={16} color="var(--text-tertiary)" />
        </button>
      </div>

      <div style={cartStyles.shipGroupSummaryBadges}>
        <span style={cartStyles.shipGroupSummaryBadge}>{items.length} รายการ</span>
        <span style={cartStyles.shipGroupFulfillBadge}>{fulfillment.label}</span>
        {group.isPreorder && (
          <span style={cartStyles.preorderBadge}><Icon name="clock" size={11} /> พรีออเดอร์</span>
        )}
      </div>

      {needsCourier && (
        <div style={cartStyles.shipGroupSummaryMeta}>
          {courier ? courier.label : 'ยังไม่ระบุขนส่ง'} · {feeText}
        </div>
      )}

      {needsTravelFee && (
        <div style={cartStyles.shipGroupSummaryMeta}>ค่าเดินทาง · {travelFeeText}</div>
      )}

      {needsPickupBranch && (
        <div style={cartStyles.shipGroupSummaryMeta}>
          {pickupStore ? `รับที่สาขา ${pickupStore.label}` : 'ยังไม่ระบุสาขาที่รับ'}
        </div>
      )}

      <div style={cartStyles.shipGroupSummaryTotal}>
        <span>ราคารวม</span>
        <span>฿{subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
}

// Slides in from the right for everything about managing a group order —
// adding/removing groups, each one's fulfillment/address/courier/fee, and
// which cart lines belong to it (drag a row from its card onto another
// group's card to move it). Deliberately has NO scrim/overlay: a backdrop
// that blocks the rest of the screen defeats "pick a group, then tap
// products into it", since the product grid needs to stay clickable while
// this is open.
function GroupManagerDrawer({
  open, onClose, customer, customers, setCustomer, onAddCustomer,
  shipGroups, cart, renderRow, addresses, couriers, stores, fulfillmentOptions, fixedCourierId,
  activeGroupId, setActiveGroupId, dragOverGroupId, addShipGroup, removeShipGroup, setGroupField, splitToBranch,
  vehicleTypes, splitVehicleGroups, splitBulkyToShipping, splitPreorderItems,
}) {
  // Mounted a beat longer than `open` so the close transition can play
  // before the drawer leaves the DOM — otherwise it would just vanish.
  const [mounted, setMounted] = React.useState(open);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div style={cartStyles.drawer(visible)}>
      <div style={cartStyles.drawerHead}>
        <span style={cartStyles.drawerTitle}>จัดการคำสั่งขายกลุ่ม</span>
        <button style={cartStyles.drawerClose} onClick={onClose} aria-label="Close">
          <Icon name="x" size={20} />
        </button>
      </div>
      <div className="scroll-y" style={cartStyles.drawerBody}>
        {/* Every group ships/pickups for the same customer — one selector
            here (existing or brand-new) instead of per-group, so switching
            groups never means hunting back to the collapsed cart header for
            it. */}
        <div style={cartStyles.formBlock}>
          <span style={cartStyles.formLabel}>ข้อมูลลูกค้า</span>
          <CustomerRow customer={customer} customers={customers} onSelect={setCustomer} onAddCustomer={onAddCustomer} />
        </div>
        {shipGroups.map((g, gi) => (
          <ShipGroupCard
            key={g.id}
            group={g}
            index={gi}
            items={cart.filter(i => i.groupId === g.id)}
            renderRow={renderRow}
            addresses={addresses}
            couriers={couriers}
            stores={stores}
            fulfillmentOptions={fulfillmentOptions}
            fixedCourierId={fixedCourierId}
            canRemove={shipGroups.length > 1}
            active={g.id === activeGroupId}
            onActivate={() => setActiveGroupId(g.id)}
            isDropTarget={g.id === dragOverGroupId}
            onRemove={() => removeShipGroup(g.id)}
            onSetFulfillment={(fid) => setGroupField(g.id, { fulfillmentId: fid })}
            onSetAddress={(aid) => setGroupField(g.id, { addressId: aid })}
            onSetShipping={(patch) => setGroupField(g.id, patch)}
            onSetPickupStore={(sid) => setGroupField(g.id, { pickupStoreId: sid })}
            onSplitToBranch={splitToBranch}
            vehicleTypes={vehicleTypes}
            onSplitVehicles={splitVehicleGroups}
            onSplitBulky={splitBulkyToShipping}
            onSplitPreorder={splitPreorderItems}
            onMarkPreorder={() => setGroupField(g.id, { isPreorder: true })}
          />
        ))}
        {/* Adding a group here (bottom) rather than at the top means it
            appears where you're already looking, top-to-bottom, instead of
            forcing a scroll back up every time you add one. */}
        <button style={cartStyles.splitBtn} onClick={addShipGroup}>
          <Icon name="plus" size={14} /> เพิ่มกลุ่ม
        </button>
      </div>
    </div>
  );
}

