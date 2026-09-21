// popovers.jsx — Notification panel, profile menu, app switcher dropdown.
// Each takes { open, onClose, anchor? } and renders absolutely-positioned UI.

const popStyles = {
  base: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'var(--bg-surface)',
    border: '1px solid var(--stroke)',
    borderRadius: 'var(--d-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  },
  scrim: { position: 'fixed', inset: 0, zIndex: 49 },
  head: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '14px 16px 8px',
    borderBottom: '1px solid var(--stroke)',
  },
  headTitle: { fontWeight: 700, fontSize: 'var(--fs-body-lg)', color: 'var(--text-primary)' },
  headMeta:  { fontSize: 11, color: 'var(--text-tertiary)' },

  // Notifications
  notifList: { maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  notif: (unread) => ({
    appearance: 'none', border: 0,
    background: 'transparent',
    padding: '10px 14px',
    display: 'flex', gap: 10, alignItems: 'flex-start',
    cursor: 'pointer', textAlign: 'left',
    borderLeft: `3px solid ${unread ? 'var(--brand-500)' : 'transparent'}`,
    transition: 'background .1s',
  }),
  notifIcon: (tone) => ({
    width: 32, height: 32, borderRadius: 8,
    background:
      tone === 'rose'    ? 'var(--rose-50)'    :
      tone === 'amber'   ? 'var(--amber-50)'   :
      tone === 'emerald' ? 'var(--emerald-50)' :
      'var(--sky-50)',
    color:
      tone === 'rose'    ? 'var(--rose-700)'    :
      tone === 'amber'   ? 'var(--amber-700)'   :
      tone === 'emerald' ? 'var(--emerald-700)' :
      'var(--sky-700)',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  }),
  notifBody: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 },
  notifTitle: { fontWeight: 600, fontSize: 'var(--fs-body)', color: 'var(--text-primary)' },
  notifText:  { fontSize: 'var(--fs-caption)', color: 'var(--text-secondary)', lineHeight: 1.35 },
  notifTime:  { fontSize: 11, color: 'var(--text-tertiary)' },
  notifFoot: {
    padding: '10px 14px',
    borderTop: '1px solid var(--stroke)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--bg-muted)',
  },
  notifFootBtn: {
    appearance: 'none', border: 0, background: 'transparent',
    color: 'var(--brand-700)', fontWeight: 600,
    fontFamily: 'inherit', fontSize: 'var(--fs-body)',
    cursor: 'pointer',
  },

  // Profile menu
  profileHead: {
    display: 'flex', gap: 12, alignItems: 'center',
    padding: 14,
    borderBottom: '1px solid var(--stroke)',
  },
  profileAvatar: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
    color: '#fff',
    display: 'grid', placeItems: 'center',
    fontWeight: 700, fontSize: 16,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)',
  },
  profileName: { fontWeight: 600, fontSize: 'var(--fs-body-lg)', color: 'var(--text-primary)' },
  profileRole: { fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)' },
  profileStatus: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    marginTop: 2,
    fontSize: 11, color: 'var(--emerald-700)', fontWeight: 600,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--emerald-500)',
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--emerald-500) 25%, transparent)',
  },
  menuList: { padding: 6, display: 'flex', flexDirection: 'column', gap: 2 },
  menuItem: {
    appearance: 'none', border: 0,
    background: 'transparent',
    padding: '8px 10px',
    borderRadius: 6,
    display: 'flex', alignItems: 'center', gap: 10,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: 'var(--fs-body)',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  menuItemDestructive: { color: 'var(--rose-700)' },
  menuDivider: { height: 1, background: 'var(--stroke)', margin: '4px 6px' },
  menuShortcut: {
    marginLeft: 'auto',
    fontSize: 10, fontWeight: 600,
    color: 'var(--text-tertiary)',
    fontFamily: 'ui-monospace, monospace',
    padding: '2px 5px',
    background: 'var(--bg-subtle)',
    border: '1px solid var(--stroke)',
    borderRadius: 4,
  },

  // App switcher
  appGrid: {
    padding: 12,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  appCard: (active) => ({
    appearance: 'none', border: 0,
    background: active ? 'var(--brand-50)' : 'transparent',
    borderRadius: 'var(--d-radius)',
    padding: '14px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'background .1s',
  }),
  appIcon: (color) => ({
    width: 44, height: 44, borderRadius: 12,
    background: color,
    color: '#fff',
    display: 'grid', placeItems: 'center',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 1px 3px rgba(0,0,0,.1)',
  }),
  appLabel: { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' },
  appSub:   { fontSize: 10, color: 'var(--text-tertiary)' },
  appFoot: {
    borderTop: '1px solid var(--stroke)',
    padding: '8px 12px',
    fontSize: 11,
    color: 'var(--text-tertiary)',
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--bg-muted)',
  },
};

// ── Notification panel ─────────────────────────────────────
function NotificationsPanel({ open, onClose, items, onMarkAll }) {
  if (!open) return null;
  const unreadCount = items.filter(i => i.unread).length;
  return (
    <>
      <div style={popStyles.scrim} onClick={onClose} />
      <div style={{ ...popStyles.base, width: 380 }}>
        <div style={popStyles.head}>
          <span style={popStyles.headTitle}>Notifications</span>
          <span style={popStyles.headMeta}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </span>
        </div>
        <div style={popStyles.notifList} className="scroll-y">
          {items.map(n => (
            <button
              key={n.id}
              style={popStyles.notif(n.unread)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={popStyles.notifIcon(n.tone)}><Icon name={n.icon} size={16} /></span>
              <span style={popStyles.notifBody}>
                <span style={popStyles.notifTitle}>{n.title}</span>
                <span style={popStyles.notifText}>{n.text}</span>
                <span style={popStyles.notifTime}>{n.time}</span>
              </span>
            </button>
          ))}
        </div>
        <div style={popStyles.notifFoot}>
          <button style={popStyles.notifFootBtn} onClick={onMarkAll}>Mark all read</button>
          <button style={popStyles.notifFootBtn}>View all</button>
        </div>
      </div>
    </>
  );
}

// ── Profile menu ───────────────────────────────────────────
function ProfileMenu({ open, onClose, user }) {
  if (!open) return null;
  return (
    <>
      <div style={popStyles.scrim} onClick={onClose} />
      <div style={{ ...popStyles.base, width: 260 }}>
        <div style={popStyles.profileHead}>
          <span style={popStyles.profileAvatar}>{user.initials}</span>
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={popStyles.profileName}>{user.name}</span>
            <span style={popStyles.profileRole}>{user.role}</span>
          </span>
        </div>
        <div style={popStyles.menuList}>
          <button
            style={popStyles.menuItem}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name="receipt" size={16} color="var(--text-tertiary)" />
            <span>My sales</span>
            <span style={popStyles.menuShortcut}>⌘S</span>
          </button>
          <button
            style={popStyles.menuItem}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name="settings" size={16} color="var(--text-tertiary)" />
            <span>Preferences</span>
          </button>
          <button
            style={popStyles.menuItem}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name="info" size={16} color="var(--text-tertiary)" />
            <span>Help & docs</span>
          </button>
          <div style={popStyles.menuDivider} />
          <button
            style={{ ...popStyles.menuItem, ...popStyles.menuItemDestructive }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--rose-50)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name="x" size={16} color="var(--rose-700)" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ── App switcher ───────────────────────────────────────────
function AppSwitcher({ open, onClose, apps, currentId }) {
  if (!open) return null;
  return (
    <>
      <div style={popStyles.scrim} onClick={onClose} />
      <div style={{ ...popStyles.base, width: 320 }}>
        <div style={popStyles.head}>
          <span style={popStyles.headTitle}>Sellsuki Apps</span>
          <span style={popStyles.headMeta}>Switch product</span>
        </div>
        <div style={popStyles.appGrid}>
          {apps.map(a => (
            <button
              key={a.id}
              style={popStyles.appCard(a.id === currentId)}
              onMouseEnter={(e) => { if (a.id !== currentId) e.currentTarget.style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={(e) => { if (a.id !== currentId) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={popStyles.appIcon(a.color)}><Icon name={a.icon} size={20} /></span>
              <span style={popStyles.appLabel}>{a.label}</span>
              <span style={popStyles.appSub}>{a.sub}</span>
            </button>
          ))}
        </div>
        <div style={popStyles.appFoot}>
          <Icon name="info" size={12} />
          <span>You're signed in to all apps with one account.</span>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { NotificationsPanel, ProfileMenu, AppSwitcher });
