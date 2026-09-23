// data.js — Product catalog + channels for Sale prototype
// Patona OMS 2.0 — Sprint 100-105

// Available in every channel's fulfillment list — not tied to how the order
// came in, but to what's being fulfilled. A "คำสั่งขายกลุ่ม" (sale-order
// group) picks its own fulfillment from its channel's list, so a service
// item (installation, repair — always an on-site visit) or a digital item
// (never physically shipped) can each get the right one regardless of
// channel: ON_SITE always needs an address (no courier — staff visits in
// person — but does take a flat travel fee instead), DIGITAL never needs
// an address, courier, or travel fee.
const UNIVERSAL_FULFILLMENT = [
  { id: 'ON_SITE', label: 'ให้บริการที่สถานที่ลูกค้า', sub: 'งานบริการ เช่น ติดตั้ง/ซ่อม', icon: 'truck',   needsAddress: true,  needsCourier: false, needsTravelFee: true },
  { id: 'DIGITAL', label: 'จัดส่งเข้าระบบ (ดิจิทัล)',   sub: 'ไม่ต้องมีที่อยู่/ไม่ต้องนัดรับ', icon: 'sparkle', needsAddress: false, needsCourier: false },
];

window.SALE_DATA = {
  channels: [
    {
      id: 'POS',
      label: 'POS',
      sub: 'Walk-in / in-store',
      icon: 'store',
      fulfillment: [
        { id: 'PICKUP_IMMEDIATE', label: 'รับทันที',      sub: 'รับสินค้าพร้อมลูกค้า',   icon: 'bag',   needsAddress: false, needsCourier: false },
        { id: 'PICKUP_DEFERRED', label: 'รับภายหลัง',     sub: 'เก็บไว้ให้ลูกค้า',       icon: 'clock', needsAddress: false, needsCourier: false, needsPickupBranch: true },
        { id: 'SHIP_FROM_STORE', label: 'จัดส่งจากร้าน',  sub: 'จัดส่งตามที่อยู่',       icon: 'truck', needsAddress: true,  needsCourier: true },
        ...UNIVERSAL_FULFILLMENT,
      ],
      payments: ['cash', 'qr', 'card', 'transfer'],
    },
    {
      id: 'ONLINE',
      label: 'Online',
      sub: 'Chat / API / storefront',
      icon: 'globe',
      // Sub-channels per PAT-2293 §"Sub-channel → OMS 2.0 channel Mapping" —
      // these become Order.channel on the backend (LINE chat → LINE_OA, etc).
      // `fixedCourierId` — some marketplaces mandate their own logistics
      // arm for anything shipped through them (Shopee → SPX, Lazada → LEX);
      // a seller can't pick a different courier for those orders, so the
      // cart locks the courier picker to it instead of leaving it open.
      subChannels: [
        { id: 'LINE_OA',      label: 'LINE OA',      hint: 'Chat',  color: '#06C755' },
        { id: 'FACEBOOK',     label: 'Facebook',     hint: 'Chat',  color: '#1877F2' },
        { id: 'INSTAGRAM',    label: 'Instagram',    hint: 'Chat',  color: '#E1306C' },
        { id: 'TIKTOK',       label: 'TikTok',       hint: 'Chat',  color: '#000000' },
        { id: 'SHOPEE',       label: 'Shopee',       hint: 'Marketplace', color: '#EE4D2D', fixedCourierId: 'shopee' },
        { id: 'LAZADA',       label: 'Lazada',       hint: 'Marketplace', color: '#0F1F8E', fixedCourierId: 'lex' },
        { id: 'LINE_MY_SHOP', label: 'LINE My Shop', hint: 'Marketplace', color: '#00B900' },
        { id: 'ONLINE',       label: 'Storefront',   hint: 'Open API',    color: '#475467' },
        { id: 'OTHER_CHANNEL',label: 'Other',        hint: 'Unknown',     color: '#9CA3AF' },
      ],
      fulfillment: [
        { id: 'DELIVERY',     label: 'จัดส่งตามที่อยู่', sub: 'จัดส่งถึงบ้าน',       icon: 'truck', needsAddress: true,  needsCourier: true },
        { id: 'BOPIS',        label: 'รับที่ร้าน',       sub: 'รับสินค้าที่หน้าร้าน', icon: 'bag',   needsAddress: false, needsCourier: false },
        ...UNIVERSAL_FULFILLMENT,
      ],
      payments: ['qr', 'card', 'transfer', 'cod'],
    },
    {
      id: 'LINK_BILL',
      label: 'LINK_BILL',
      sub: 'Send payment link',
      icon: 'link',
      // LINK_BILL is detected from the buyer's referrer on the buyer page,
      // but cashier can also set it manually when sending. Maps to
      // LinkBillSource enum in PAT-2297.
      subChannels: [
        { id: 'LINE',      label: 'LINE',      hint: 'Send via LINE chat',     color: '#06C755' },
        { id: 'FACEBOOK',  label: 'Facebook',  hint: 'Send via Messenger',     color: '#1877F2' },
        { id: 'INSTAGRAM', label: 'Instagram', hint: 'Send via DM',            color: '#E1306C' },
        { id: 'TIKTOK',    label: 'TikTok',    hint: 'Send via DM',            color: '#000000' },
        { id: 'DIRECT',    label: 'Direct',    hint: 'Copy link & share',      color: '#EC5E2A' },
        { id: 'UNKNOWN',   label: 'Other',     hint: 'Will detect on open',    color: '#9CA3AF' },
      ],
      fulfillment: [
        { id: 'DELIVERY',     label: 'จัดส่งตามที่อยู่', sub: 'ลูกค้ากรอกที่อยู่เอง',   icon: 'truck', needsAddress: true,  needsCourier: true },
        { id: 'BOPIS',        label: 'รับที่ร้าน',       sub: 'ลูกค้ารับสินค้าที่ร้าน', icon: 'bag',   needsAddress: false, needsCourier: false },
        ...UNIVERSAL_FULFILLMENT,
      ],
      payments: ['qr', 'card', 'transfer'],
    },
  ],

  // `cat` is the top-level category tab (product/service/digital), matching
  // the fulfillment rules: 'service' always needs a customer + address
  // (on-site visit), 'digital' never needs an address (delivered digitally).
  categories: [
    { id: 'all',     label: 'ทั้งหมด' },
    { id: 'product', label: 'สินค้า' },
    { id: 'service', label: 'บริการ' },
    { id: 'digital', label: 'ดิจิตอล' },
  ],

  products: [
    // beverage
    { id: 'p01', sku: 'BEV-001', name: 'Patona Cold Brew',         cat: 'product', price: 95,  stock: 24,  swatch: '#3D2817' },
    { id: 'p02', sku: 'BEV-002', name: 'Aerospace Espresso',       cat: 'product', price: 75,  stock: 32,  swatch: '#5B2F0E' },
    { id: 'p03', sku: 'BEV-003', name: 'Iced Latte',               cat: 'product', price: 85,  stock: 28,  swatch: '#C9A380' },
    { id: 'p04', sku: 'BEV-004', name: 'Matcha Latte',             cat: 'product', price: 95,  stock: 18,  swatch: '#8FB069' },
    { id: 'p05', sku: 'BEV-005', name: 'Thai Tea',                 cat: 'product', price: 65,  stock: 41,  swatch: '#E89B4C' },
    { id: 'p06', sku: 'BEV-006', name: 'Yuzu Sparkle',             cat: 'product', price: 110, stock: 12,  swatch: '#F1C84B' },
    { id: 'p07', sku: 'BEV-007', name: 'Hojicha Latte',            cat: 'product', price: 95,  stock: 9,   swatch: '#A5704B' },
    { id: 'p08', sku: 'BEV-008', name: 'Honey Lemon Tea',          cat: 'product', price: 75,  stock: 22,  swatch: '#E3B643' },
    // bakery
    { id: 'p09', sku: 'BKY-001', name: 'Butter Croissant',         cat: 'product', price: 65,  stock: 14,  swatch: '#E0B97A' },
    { id: 'p10', sku: 'BKY-002', name: 'Pain au Chocolat',         cat: 'product', price: 75,  stock: 11,  swatch: '#7B4924' },
    { id: 'p11', sku: 'BKY-003', name: 'Cinnamon Roll',            cat: 'product', price: 85,  stock: 8,   swatch: '#B16A38' },
    { id: 'p12', sku: 'BKY-004', name: 'Banana Loaf Slice',        cat: 'product', price: 55,  stock: 16,  swatch: '#D6A95C' },
    { id: 'p13', sku: 'BKY-005', name: 'Sourdough Toast',          cat: 'product', price: 95,  stock: 6,   swatch: '#C8A875' },
    { id: 'p14', sku: 'BKY-006', name: 'Almond Tart',              cat: 'product', price: 110, stock: 5,   swatch: '#A47148' },
    // merch
    { id: 'p15', sku: 'MRC-001', name: 'Patona Logo Tote',         cat: 'product', price: 290, stock: 22,  swatch: '#EC5E2A' },
    { id: 'p16', sku: 'MRC-002', name: 'Aerospace Cap',            cat: 'product', price: 490, stock: 17,  swatch: '#1D2939' },
    { id: 'p17', sku: 'MRC-003', name: 'Travel Mug 12oz',          cat: 'product', price: 690, stock: 14,  swatch: '#6B7280' },
    { id: 'p18', sku: 'MRC-004', name: 'Enamel Pin Set',           cat: 'product', price: 190, stock: 33,  swatch: '#F58249' },
    // bean
    { id: 'p19', sku: 'BNS-001', name: 'House Blend 250g',         cat: 'product', price: 450, stock: 26,  swatch: '#3D2817' },
    { id: 'p20', sku: 'BNS-002', name: 'Ethiopia Yirgacheffe',     cat: 'product', price: 680, stock: 9,   swatch: '#6F4226' },
    { id: 'p21', sku: 'BNS-003', name: 'Colombia Supremo 250g',    cat: 'product', price: 590, stock: 13,  swatch: '#7A4E2C' },
    { id: 'p22', sku: 'BNS-004', name: 'Decaf Brazil 250g',        cat: 'product', price: 520, stock: 0,   swatch: '#8C5733' },
    // equipment
    { id: 'p23', sku: 'EQP-001', name: 'Aeropress Original',       cat: 'product', price: 1490,stock: 7,   swatch: '#475467' },
    { id: 'p24', sku: 'EQP-002', name: 'V60 Dripper 02',           cat: 'product', price: 690, stock: 11,  swatch: '#C7723E' },
    { id: 'p25', sku: 'EQP-003', name: 'Gooseneck Kettle 1L',      cat: 'product', price: 2890,stock: 4,   swatch: '#344054' },
    { id: 'p26', sku: 'EQP-004', name: 'Hand Grinder Comandante',  cat: 'product', price: 9900,stock: 2,   swatch: '#1D2939' },
    // service — on-site visits, always require a customer + address
    { id: 'sv01', sku: 'SVC-001', name: 'ติดตั้งเครื่องชงกาแฟ',        cat: 'service', price: 800,  stock: 99, swatch: '#175CD3' },
    { id: 'sv02', sku: 'SVC-002', name: 'บริการทำความสะอาดเครื่องชงกาแฟ', cat: 'service', price: 500,  stock: 99, swatch: '#1570EF' },
    { id: 'sv03', sku: 'SVC-003', name: 'บริการซ่อมเครื่องบดกาแฟ',      cat: 'service', price: 650,  stock: 99, swatch: '#2E90FA' },
    { id: 'sv04', sku: 'SVC-004', name: 'ฝึกอบรมบาริสต้าหน้าร้าน',     cat: 'service', price: 1200, stock: 99, swatch: '#0B5CD5' },
    // digital — delivered digitally, no address needed
    { id: 'dg01', sku: 'DIG-001', name: 'Patona e-Gift Card ฿500',   cat: 'digital', price: 500,  stock: 999, swatch: '#12B76A' },
    { id: 'dg02', sku: 'DIG-002', name: 'คอร์สออนไลน์ชงกาแฟเบื้องต้น', cat: 'digital', price: 990,  stock: 999, swatch: '#039855' },
    { id: 'dg03', sku: 'DIG-003', name: 'โค้ดส่วนลด Patona App 10%',   cat: 'digital', price: 0,    stock: 999, swatch: '#027A48' },
    { id: 'dg04', sku: 'DIG-004', name: 'สมาชิก Patona+ รายเดือน',    cat: 'digital', price: 149,  stock: 999, swatch: '#12B76A' },
  ],

  // `category` groups the courier picker into "จัดส่งมาตรฐาน" (next-day-ish,
  // drop-off/pickup networks) vs "จัดส่งภายในวัน" (on-demand same-day apps —
  // a rider is dispatched immediately, priced and timed completely
  // differently, so they read as a distinct list rather than being mixed in
  // alphabetically with the standard couriers).
  couriers: [
    { id: 'kerry',    label: 'Kerry Express',        category: 'standard' },
    { id: 'flash',    label: 'Flash Express',        category: 'standard' },
    { id: 'ems',      label: 'ไปรษณีย์ไทย (EMS)',      category: 'standard' },
    { id: 'shopee',   label: 'Shopee Express (SPX)', category: 'standard' },
    { id: 'lex',      label: 'LEX Express',          category: 'standard' },
    { id: 'grab',     label: 'Grab',                 category: 'same_day' },
    { id: 'lineman',  label: 'Lineman',              category: 'same_day' },
    { id: 'lalamove', label: 'Lalamove',             category: 'same_day' },
  ],

  paymentMethods: {
    cash:     { id: 'cash',     label: 'Cash',          icon: 'banknote' },
    qr:       { id: 'qr',       label: 'PromptPay QR',  icon: 'qr' },
    card:     { id: 'card',     label: 'Credit / Debit',icon: 'card' },
    transfer: { id: 'transfer', label: 'Bank transfer', icon: 'bank' },
    cod:      { id: 'cod',      label: 'COD',           icon: 'truck' },
  },

  customers: [
    { id: 'c001', name: 'Walk-in customer', phone: '',           tier: null,     addresses: [] },
    { id: 'c002', name: 'Praewa S.',        phone: '0812345678', email: 'praewa.s@gmail.com', tier: 'Gold',   addresses: [
      { id: 'a001', label: 'ที่อยู่หลัก', primary: true,  detail: '99/1 ซ.เจริญกรุง 32 แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500' },
      { id: 'a002', label: 'ที่อยู่รอง',  primary: false, detail: '1 อาคารเอไอเอ ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110' },
    ] },
    { id: 'c003', name: 'Nattapong K.',     phone: '0867654321', tier: 'Silver', addresses: [
      { id: 'a003', label: 'ที่อยู่หลัก', primary: true, detail: '45 ถ.รัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310' },
    ] },
    { id: 'c004', name: 'Mint J.',          phone: '0891122334', tier: 'Gold',   addresses: [] },
  ],

  stores: [
    { id: 's01', label: 'Patona — Sukhumvit 49',   hours: 'Open · until 22:00' },
    { id: 's02', label: 'Patona — Ari',            hours: 'Open · until 21:00' },
    { id: 's03', label: 'Patona — Thonglor',       hours: 'Open · until 23:00' },
    { id: 's04', label: 'Patona — EmQuartier',     hours: 'Open · until 22:00' },
  ],
};

// Per-branch stock for the "รับภายหลัง" (pickup later) branch picker — a
// customer can only pick a branch that actually has their order in stock.
// `stock` above stays exactly what it always was (the count shown on the
// product grid, for the branch the cashier is currently in — s01), so this
// only fills in the OTHER branches, derived rather than hand-authored for
// every product. The factor rotates per product (by index) so it isn't
// always the same branch running out — one of the three is always at 0 so
// the "can't select a branch with no stock" rule has something to show.
const OTHER_BRANCH_STOCK_FACTORS = [0.55, 0.3, 0];
window.SALE_DATA.products.forEach((p, i) => {
  const otherStores = window.SALE_DATA.stores.filter(s => s.id !== 's01');
  p.stockByStore = { s01: p.stock };
  otherStores.forEach((s, si) => {
    const factor = OTHER_BRANCH_STOCK_FACTORS[(si + i) % OTHER_BRANCH_STOCK_FACTORS.length];
    p.stockByStore[s.id] = Math.round(p.stock * factor);
  });
});
