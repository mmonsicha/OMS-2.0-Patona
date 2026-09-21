// icons.jsx — Inline SVG icons used across the prototype.
// Stroked, 1.6 width, rounded. Match ssk-icon visual weight.

const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const s = size;
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const paths = {
    store: <><path d="M3 9l1.5-5h15L21 9" /><path d="M4 9v11h16V9" /><path d="M9 14h6v6H9z" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
    link:  <><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" /><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" /></>,
    dots:  <><circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /></>,
    bag:   <><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    truck: <><rect x="2" y="7" width="11" height="9" rx="1" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="6" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></>,
    plus:  <><path d="M12 5v14M5 12h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    search:<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    barcode: <><path d="M4 6v12M7 6v12M10 6v8M13 6v12M16 6v8M19 6v12" /></>,
    x:     <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevD: <><path d="m6 9 6 6 6-6" /></>,
    chevR: <><path d="m9 6 6 6-6 6" /></>,
    chevL: <><path d="m15 6-6 6 6 6" /></>,
    user:  <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
    phone: <><path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></>,
    qr:    <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2M18 14v2M14 18h2M18 18h2v2" /></>,
    card:  <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    bank:  <><path d="M3 10 12 4l9 6" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></>,
    banknote: <><rect x="3" y="7" width="18" height="11" rx="2" /><circle cx="12" cy="12.5" r="2.5" /><path d="M6 10h.5M18 15h-.5" /></>,
    discount: <><path d="M9 3h6l6 6v6l-6 6H9l-6-6V9z" /><path d="m9 15 6-6" /><circle cx="9.5" cy="9.5" r=".5" fill="currentColor" /><circle cx="14.5" cy="14.5" r=".5" fill="currentColor" /></>,
    note:  <><path d="M5 4h11l4 4v12H5z" /><path d="M16 4v4h4" /><path d="M8 13h8M8 17h5" /></>,
    customer: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0112 0" /><path d="M16 11a3 3 0 100-6" /><path d="M15 20a6 6 0 016-3" /></>,
    package: <><path d="m12 3 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
    grid:  <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
    list:  <><path d="M9 6h12M9 12h12M9 18h12" /><circle cx="4" cy="6" r=".8" fill="currentColor" /><circle cx="4" cy="12" r=".8" fill="currentColor" /><circle cx="4" cy="18" r=".8" fill="currentColor" /></>,
    bell:  <><path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" /><path d="M10 20a2 2 0 004 0" /></>,
    check: <><path d="m5 13 4 4 10-10" /></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><path d="m6 6 3 3M15 15l3 3M6 18l3-3M15 9l3-3" /></>,
    cart:  <><path d="M4 5h2l2 11h11l2-8H7" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></>,
    info:  <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></>,
    warn:  <><path d="M12 3 2 21h20z" /><path d="M12 10v5M12 18h.01" /></>,
    pencil:<><path d="M4 20h4l11-11-4-4L4 16z" /></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    location: <><path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></>,
    settings: <><path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" /><path d="m19.4 15 1.5 1-2 3.4-1.8-.6a8 8 0 01-1.6 1l-.4 1.9h-4l-.4-1.9a8 8 0 01-1.6-1l-1.8.6-2-3.4 1.5-1a8 8 0 010-2L4.5 9l2-3.4 1.8.6a8 8 0 011.6-1L10.3 3h4l.4 1.9a8 8 0 011.6 1l1.8-.6 2 3.4-1.5 1a8 8 0 010 2z" /></>,
    grip:  <>{[6, 12, 18].flatMap(cy => [9, 15].map(cx => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="currentColor" stroke="none" />))}</>,
  };
  return <svg {...common} aria-hidden="true">{paths[name] || paths.dots}</svg>;
};

window.Icon = Icon;
