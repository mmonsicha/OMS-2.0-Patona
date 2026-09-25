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

  // `weight` (kg) and `size` ({w, l} cm — footprint, not full 3D) drive the
  // fulfillment/vehicle suggestions below (see BULKY_WEIGHT_KG / BULKY_DIM_CM
  // and isBulkyItem near the bottom of this file). Service/digital items
  // never carry these — they're never physically shipped.
  products: [
    // beverage — handed over the counter, never "bulky"
    { id: 'p01', sku: 'BEV-001', name: 'Patona Cold Brew',         cat: 'product', price: 95,  stock: 24,  swatch: '#3D2817', weight: 0.4,  size: { w: 9,  l: 9  } },
    { id: 'p02', sku: 'BEV-002', name: 'Aerospace Espresso',       cat: 'product', price: 75,  stock: 32,  swatch: '#5B2F0E', weight: 0.25, size: { w: 8,  l: 8  } },
    { id: 'p03', sku: 'BEV-003', name: 'Iced Latte',               cat: 'product', price: 85,  stock: 28,  swatch: '#C9A380', weight: 0.4,  size: { w: 9,  l: 9  } },
    { id: 'p04', sku: 'BEV-004', name: 'Matcha Latte',             cat: 'product', price: 95,  stock: 18,  swatch: '#8FB069', weight: 0.4,  size: { w: 9,  l: 9  } },
    { id: 'p05', sku: 'BEV-005', name: 'Thai Tea',                 cat: 'product', price: 65,  stock: 41,  swatch: '#E89B4C', weight: 0.4,  size: { w: 9,  l: 9  } },
    { id: 'p06', sku: 'BEV-006', name: 'Yuzu Sparkle',             cat: 'product', price: 110, stock: 12,  swatch: '#F1C84B', weight: 0.45, size: { w: 9,  l: 9  } },
    { id: 'p07', sku: 'BEV-007', name: 'Hojicha Latte',            cat: 'product', price: 95,  stock: 9,   swatch: '#A5704B', weight: 0.4,  size: { w: 9,  l: 9  } },
    { id: 'p08', sku: 'BEV-008', name: 'Honey Lemon Tea',          cat: 'product', price: 75,  stock: 22,  swatch: '#E3B643', weight: 0.4,  size: { w: 9,  l: 9  } },
    // bakery
    { id: 'p09', sku: 'BKY-001', name: 'Butter Croissant',         cat: 'product', price: 65,  stock: 14,  swatch: '#E0B97A', weight: 0.08, size: { w: 10, l: 12 } },
    { id: 'p10', sku: 'BKY-002', name: 'Pain au Chocolat',         cat: 'product', price: 75,  stock: 11,  swatch: '#7B4924', weight: 0.09, size: { w: 10, l: 14 } },
    { id: 'p11', sku: 'BKY-003', name: 'Cinnamon Roll',            cat: 'product', price: 85,  stock: 8,   swatch: '#B16A38', weight: 0.12, size: { w: 10, l: 10 } },
    { id: 'p12', sku: 'BKY-004', name: 'Banana Loaf Slice',        cat: 'product', price: 55,  stock: 16,  swatch: '#D6A95C', weight: 0.1,  size: { w: 8,  l: 12 } },
    { id: 'p13', sku: 'BKY-005', name: 'Sourdough Toast',          cat: 'product', price: 95,  stock: 6,   swatch: '#C8A875', weight: 0.15, size: { w: 10, l: 14 } },
    { id: 'p14', sku: 'BKY-006', name: 'Almond Tart',              cat: 'product', price: 110, stock: 5,   swatch: '#A47148', weight: 0.14, size: { w: 10, l: 10 } },
    // merch
    { id: 'p15', sku: 'MRC-001', name: 'Patona Logo Tote',         cat: 'product', price: 290, stock: 22,  swatch: '#EC5E2A', weight: 0.2,  size: { w: 35, l: 40 } },
    { id: 'p16', sku: 'MRC-002', name: 'Aerospace Cap',            cat: 'product', price: 490, stock: 17,  swatch: '#1D2939', weight: 0.15, size: { w: 20, l: 25 } },
    { id: 'p17', sku: 'MRC-003', name: 'Travel Mug 12oz',          cat: 'product', price: 690, stock: 14,  swatch: '#6B7280', weight: 0.35, size: { w: 9,  l: 20 } },
    { id: 'p18', sku: 'MRC-004', name: 'Enamel Pin Set',           cat: 'product', price: 190, stock: 33,  swatch: '#F58249', weight: 0.05, size: { w: 8,  l: 10 } },
    // bean
    { id: 'p19', sku: 'BNS-001', name: 'House Blend 250g',         cat: 'product', price: 450, stock: 26,  swatch: '#3D2817', weight: 0.28, size: { w: 10, l: 18 } },
    { id: 'p20', sku: 'BNS-002', name: 'Ethiopia Yirgacheffe',     cat: 'product', price: 680, stock: 9,   swatch: '#6F4226', weight: 0.28, size: { w: 10, l: 18 } },
    { id: 'p21', sku: 'BNS-003', name: 'Colombia Supremo 250g',    cat: 'product', price: 590, stock: 13,  swatch: '#7A4E2C', weight: 0.28, size: { w: 10, l: 18 } },
    { id: 'p22', sku: 'BNS-004', name: 'Decaf Brazil 250g',        cat: 'product', price: 520, stock: 0,   swatch: '#8C5733', weight: 0.28, size: { w: 10, l: 18 } },
    // equipment
    { id: 'p23', sku: 'EQP-001', name: 'Aeropress Original',       cat: 'product', price: 1490,stock: 7,   swatch: '#475467', weight: 0.45, size: { w: 12, l: 25 } },
    { id: 'p24', sku: 'EQP-002', name: 'V60 Dripper 02',           cat: 'product', price: 690, stock: 11,  swatch: '#C7723E', weight: 0.2,  size: { w: 12, l: 12 } },
    { id: 'p25', sku: 'EQP-003', name: 'Gooseneck Kettle 1L',      cat: 'product', price: 2890,stock: 4,   swatch: '#344054', weight: 1.1,  size: { w: 15, l: 25 } },
    { id: 'p26', sku: 'EQP-004', name: 'Hand Grinder Comandante',  cat: 'product', price: 9900,stock: 2,   swatch: '#1D2939', weight: 0.9,  size: { w: 10, l: 20 } },
    // equipment — bulky: too heavy/large to hand over at the counter, so the
    // fulfillment suggestion (see cart.jsx BulkyItemBanner) nudges these
    // toward "จัดส่งจากร้าน" instead of "รับทันที" when mixed with drinks.
    { id: 'p27', sku: 'EQP-005', name: 'เครื่องชงกาแฟ Home Barista',  cat: 'product', price: 12900,stock: 5,  swatch: '#101828', weight: 6.5,  size: { w: 35, l: 45 } },
    { id: 'p28', sku: 'EQP-006', name: 'ถังเก็บน้ำแข็ง ไซส์ XL',      cat: 'product', price: 1590, stock: 8,  swatch: '#155EEF', weight: 4.5,  size: { w: 55, l: 60 } },
    // merch — bulky: same rider-standard "1 per vehicle" rule as the ice
    // bucket/coffee machine above, kept in its own category for the same-day
    // multi-vehicle example (see cart.jsx VehicleTypeRow).
    { id: 'p29', sku: 'MRC-005', name: 'กระเป๋าเดินทาง 24"',        cat: 'product', price: 2490, stock: 20, swatch: '#667085', weight: 4,    size: { w: 45, l: 65 } },
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
    // Same-day riders dispatch whatever vehicle the job needs — a standard
    // drop-off network's own truck isn't something the seller picks, but an
    // on-demand same-day booking is, so only these three carry `vehicleTypes`.
    { id: 'grab',     label: 'Grab',                 category: 'same_day', vehicleTypes: ['moto', 'car', 'van'] },
    { id: 'lineman',  label: 'Lineman',              category: 'same_day', vehicleTypes: ['moto', 'car'] },
    { id: 'lalamove', label: 'Lalamove',             category: 'same_day', vehicleTypes: ['moto', 'car', 'pickup', 'van'] },
  ],

  // Vehicle options offered once a same-day courier is picked (see data.js
  // couriers' `vehicleTypes` + cart.jsx VehicleTypeRow). `maxBulkyItems` is
  // the rider-standard "how many bulky items fit on this vehicle" cap —
  // e.g. a motorcycle rider can only strap down one suitcase-sized item, so
  // 4 suitcases need 4 separate motorcycle trips, not one.
  vehicleTypes: [
    { id: 'moto',   label: 'มอเตอร์ไซค์', icon: 'moto',  maxBulkyItems: 1,  maxWeightKg: 15   },
    { id: 'car',    label: 'รถยนต์',      icon: 'truck', maxBulkyItems: 3,  maxWeightKg: 80   },
    { id: 'pickup', label: 'รถกระบะ',     icon: 'truck', maxBulkyItems: 8,  maxWeightKg: 500  },
    { id: 'van',    label: 'รถตู้ทึบ',    icon: 'truck', maxBulkyItems: 15, maxWeightKg: 1000 },
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

// Demo: out of stock at the CURRENT branch specifically (s01), but other
// branches still have it — distinct from Decaf Brazil below, which is out
// everywhere. This is the "still sellable normally" case: the product grid
// (see product-grid.jsx) shows 0 for this branch, but tapping it isn't
// blocked — a courier delivery doesn't care which branch's shelf it came
// from, and PickupStockWarning in cart.jsx already offers "แยกไปรับที่
// [อีกสาขา]" for a รับภายหลัง group that lands here.
window.SALE_DATA.products.find(p => p.id === 'p26').stockByStore.s01 = 0;

// Central warehouse stock — separate from any branch's shelf, and what a
// courier-fulfilled order (SHIP_FROM_STORE/DELIVERY) really draws from once
// no branch has it on the shelf. Only when BOTH every branch AND the
// central warehouse are empty (see isOutOfStockEverywhere below) is an item
// actually pre-order-only; scaled off the branch total so it isn't the same
// flat number for every product, with Decaf Brazil (already 0 everywhere
// above) kept at 0 here too so it stays the one true "hopeless" demo item.
window.SALE_DATA.products.forEach(p => {
  const branchTotal = Object.values(p.stockByStore).reduce((s, v) => s + v, 0);
  p.centralStock = branchTotal === 0 ? 0 : Math.max(p.stock, 10);
});

// A "bulky" item is one that can't just be handed over the counter or
// tossed on a rider's bike with everything else — heavy or large enough
// that it changes how the order should be fulfilled/shipped. Used by:
//  - cart.jsx's BulkyItemBanner: suggests splitting a mixed cart (e.g.
//    drinks + a coffee machine) into "รับทันที" for the light items and
//    "จัดส่งจากร้าน" for the bulky ones instead of forcing everything down
//    one path.
//  - cart.jsx's VehicleTypeRow: counts how many bulky items a same-day
//    group has against the chosen vehicle's `maxBulkyItems` capacity.
// A single flat cm/kg threshold rather than a per-category flag, so any
// future product (not just today's coffee machine/ice bucket/suitcase)
// gets the right behavior automatically from its own weight/size.
window.SALE_DATA.BULKY_WEIGHT_KG = 3;
window.SALE_DATA.BULKY_DIM_CM = 30;
window.SALE_DATA.isBulkyItem = function (item) {
  if (!item || item.weight == null || !item.size) return false;
  return item.weight >= window.SALE_DATA.BULKY_WEIGHT_KG
    || Math.max(item.size.w, item.size.l) >= window.SALE_DATA.BULKY_DIM_CM;
};

// Every OTHER stock check in this file (missingItemsAt, PickupStockWarning)
// assumes there's a branch somewhere with enough of the item to fall back
// to. This is the case where there isn't, anywhere — the trigger for
// pre-order (see cart.jsx PreorderBanner): the item can still be sold, just
// not fulfilled from existing stock.
window.SALE_DATA.isOutOfStockEverywhere = function (item) {
  if (!item) return false;
  if ((item.centralStock || 0) > 0) return false;
  if (item.stockByStore) return Object.values(item.stockByStore).every(v => (v || 0) <= 0);
  return (item.stock || 0) <= 0;
};

// Just THIS branch's shelf, not the "anywhere" check above — the trigger
// for cart.jsx/sale.jsx's fulfillment lock: an item that's out here but not
// everywhere can't be handed over on the spot ("รับทันที"/"รับที่ร้าน"), but
// is still a completely normal sale via รับภายหลัง (pick a branch that has
// it) or จัดส่ง, so it's a separate check from the pre-order one above, not
// a stricter version of it.
window.SALE_DATA.isOutOfStockAtBranch = function (item, storeId) {
  if (!item) return false;
  const v = item.stockByStore ? item.stockByStore[storeId] : item.stock;
  return (v || 0) <= 0;
};
