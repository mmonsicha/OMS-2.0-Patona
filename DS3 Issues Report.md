# DS3 Integration Issues — Found while building Patona OMS 2.0 Sale prototype

**Reporter**: Patona team (Sale.svelte prototype, Sprint 100-105)
**DS3 version**: `@uxuissk/design-system-core@3.5.5`
**Brand tested**: `patona`
**Context**: React 18 prototype wrapping `<ssk-app-shell-provider brand="patona">`, replacing custom UI with real `<ssk-*>` web components. Found 10 issues — 5 of them block "drop-in" usage and force CSS patching.

---

## 🔴 Critical — components ไม่ usable ทันที

### #1 — `<ssk-app-shell-provider>` ไม่ inject primitive tokens

| | |
|---|---|
| **Severity** | Critical (blocker for every consumer) |
| **Component** | `ssk-app-shell-provider` |
| **DS3 Docs say** | _"ssk-app-shell-provider จะ inject ทั้ง `--ssk-colors-*` primitive และ semantic tokens (`--bg-brand-primary`, `--fg-brand-primary`, `--button-solid-bg`, ฯลฯ) อัตโนมัติ"_ |

**Actual behavior**
Only **semantic tokens** are exposed at `:root`:
```
✓ --bg-primary, --bg-secondary, --bg-brand-primary
✓ --text-primary, --text-secondary, --text-disabled
✓ --stroke-primary, --stroke-secondary
✓ --button-solid-bg, --fg-brand-primary
✓ --font-p, --font-h1..h4, --font-label, --font-caption
✓ --radius-sm/md/lg/xl
```

**Primitive tokens are `(none)`** — even though many ssk-* shadow DOMs reference them:
```
✗ --ssk-font-size-xs/sm/md/lg/xl
✗ --ssk-padding-xs/sm/md/lg
✗ --ssk-spacing-xs/sm/md/lg
✗ --ssk-font-family-sans, --ssk-font-weight-medium/semibold/bold
✗ --ssk-colors-brand-50..900
✗ --ssk-colors-aerospace-orange-500
✗ --ssk-colors-rose-100/500/700, gray, sky, amber, emerald
```

Cause: every `<ssk-*>` shadow DOM I inspected references `var(--ssk-spacing-md)`, `var(--ssk-font-size-md)`, `var(--ssk-font-family-sans)`. When these resolve to empty, the component collapses to 0×0 or renders unstyled.

**Repro**
```html
<ssk-app-shell-provider brand="patona">
  <ssk-button variant="solid" tone="brand" size="md">Charge</ssk-button>
</ssk-app-shell-provider>
<script type="module">
  import 'https://esm.sh/@uxuissk/design-system-core@3.5.5';
</script>
```
Then: `getComputedStyle(document.documentElement).getPropertyValue('--ssk-font-size-md')` returns `""`

**Fix**
`ssk-app-shell-provider` should inject the full primitive layer at `:host` regardless of brand. Brand only overrides the `--*-brand-*` semantic mapping. The primitive scale should be DS3-wide, not brand-specific.

**Workaround in prototype**
~50 lines of `--ssk-*` declarations in `styles.css`.

---

### #2 — `<ssk-input>` ไม่มี default chrome (no border / bg / padding)

| | |
|---|---|
| **Severity** | Critical (component unusable without consumer CSS) |
| **Component** | `ssk-input` |

**Actual behavior**
`<ssk-input placeholder="Search products...">` renders as a transparent unstyled `<input>` element with no border, no background, no padding, no focus ring.

```
container:        border: 0px none; background: rgba(0,0,0,0); padding: 0;
input-container:  border: 0px none; background: rgba(0,0,0,0); padding: 0;
inner <input>:    border: 0px none; background: rgba(0,0,0,0); padding: 4px 0;
```

If you don't pass a `label` prop, the user sees nothing where the input should be.

**Expected**
Default appearance should be a visible bordered input (Sky brand stroke / radius-md / 8-12px padding) consistent with what's shown in Storybook. The floating-label should be an *enhancement* on top of base chrome, not a requirement.

**Fix**
Set defaults on `:host`:
```css
:host {
  display: flex; align-items: center;
  background: var(--bg-primary);
  border: 1px solid var(--stroke-primary);
  border-radius: var(--radius-md);
  padding: 0 12px;
  min-height: 40px;
}
:host(:focus-within) {
  border-color: var(--fg-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--fg-brand-primary) 16%, transparent);
}
```

**Workaround in prototype**
CSS override on the host element (4 lines).

---

### #3 — `<ssk-button width="100%" height="56px">` attributes ไม่ทำงาน

| | |
|---|---|
| **Severity** | Critical (sizing API is documented but broken) |
| **Component** | `ssk-button` |

**Docs say**
Props include `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight` — all typed `string`.

**Actual behavior**
- `width="100%"` → host stays `display: inline-flex`, ignores 100%
- `height="56px"` → no effect on host height
- `size="lg"` → only ~23px tall (not 40px as documented)

Inspecting shadow: the inner `<button>` reads `--width: ;` (empty), even with `width="100%"` set.

**Fix**
Map `width`/`height` attributes to the inner `--width`/`--height` CSS vars AND to `:host` styles. Otherwise document that these props are decorative.

**Workaround**
```css
ssk-button[width="100%"] { width: 100% !important; display: flex !important; }
ssk-button[size="lg"]    { min-height: 44px; }
```

---

### #4 — `<ssk-badge variant="filled" color="rose">` ไม่มี bg color

| | |
|---|---|
| **Severity** | Critical (variant API is a no-op) |
| **Component** | `ssk-badge` |

**Repro**
```html
<ssk-badge variant="filled" color="rose" themeColor="rose" size="sm">Out of stock</ssk-badge>
```

**Actual**
Renders as plain text with `padding: 0 7px; border-radius: 9999px; background: transparent; color: black`.

Tested combinations — none give a background color:
- `variant="filled"` + `color="rose"` → ❌
- `variant="filled"` + `themeColor="rose"` → ❌
- `variant="soft"` + `color="gray"` → ❌

**Expected**
`filled` variant should set `background: var(--ssk-colors-{color}-500)` + `color: white`.
`soft` variant should set `background: var(--ssk-colors-{color}-100)` + `color: var(--ssk-colors-{color}-700)`.

**Workaround in prototype**
Replaced `<ssk-badge>` with custom React pill component using DS3 status tokens.

---

### #5 — `<ssk-tabs variant="segment">` active pill ไม่ render

| | |
|---|---|
| **Severity** | High (segmented tabs look identical to unstyled tabs) |
| **Component** | `ssk-tabs` |

**Repro**
```html
<ssk-tabs variant="segment" fullWidth size="md" themeColor="brand" activeIndex="0"></ssk-tabs>
<script>tabs.labels = ['POS', 'Online', 'LINK_BILL', 'Other'];</script>
```

**Actual**
`.tab.active` div inside shadow DOM has `background: rgba(0,0,0,0)` and no box-shadow — no visual difference from inactive tabs. Looks like underline tabs, not segmented.

Each tab is also forced to a fixed width (~36px) regardless of label length, causing "LINK_BILL" (9 chars) to clip into the next tab.

**Expected** — segmented control look:
- Active tab: white bg, subtle shadow, rounded corners
- Inactive tabs: transparent
- Track: gray (`--bg-secondary`)
- Tab widths grow to fit content (or distribute via `fullWidth`)

**Workaround**
Used custom React segmented control. Real `<ssk-tabs>` unusable for our case.

---

## 🟡 Medium — DX paper cuts

### #6 — Array props ต้องใช้ DOM property (React 18 incompat)

| | |
|---|---|
| **Severity** | Medium |
| **Component** | `ssk-tabs`, anywhere with `string[]` / object props |

React 18 only serializes string/number attributes to custom elements. For `ssk-tabs labels={[...]}`, the array becomes `labels="POS,Online,..."` — never reaches the property setter.

Consumers must write:
```jsx
const ref = useRef();
useEffect(() => { ref.current.labels = labels; }, [labels]);
```

**Fix**
- Accept JSON-string attribute as alternative: `labels='["POS","Online"]'`, then JSON.parse internally
- OR document the workaround prominently in a React/Svelte integration guide
- OR ship official React/Svelte wrappers (à la Shoelace's `@shoelace-style/shoelace/dist/react`)

---

### #7 — Event payload format inconsistent

| | |
|---|---|
| **Severity** | Medium |
| **Components** | `ssk-input`, `ssk-tabs`, `ssk-card-select`, … |

Observed:
| Component | Event | `detail` shape |
|---|---|---|
| `ssk-tabs` | `change` | `{ label, index }` ✓ ideal |
| `ssk-input` | `change` | `{ originalEvent }` — must dig `e.detail.originalEvent.target.value` |
| `ssk-card-select` | (no change event — only DOM click) | n/a |

**Fix**
Standardize: every form-like component emits `change` with `{ value, ...component-specific }`. For `ssk-input` add `value` to detail. For `ssk-card-select` emit `change` with `{ selected, index, value }`.

---

### #8 — `<ssk-avatar>` collapses to 7×7 px without min-size

| | |
|---|---|
| **Severity** | Medium |
| **Component** | `ssk-avatar` |

**Actual**
`<ssk-avatar size="md">PS</ssk-avatar>` → 7.6×7.6px host (because `--padding-sm` / font-size resolve empty, see #1).

**Fix**
Set explicit min-width/height on `:host` per `size` attribute:
```css
:host([size="sm"]) { min-width: 28px; min-height: 28px; }
:host([size="md"]) { min-width: 40px; min-height: 40px; }
:host([size="lg"]) { min-width: 52px; min-height: 52px; }
```

**Note** — #1 is the root cause, fixing it likely solves this too.

---

## 🟢 Nice-to-have — adoption & discoverability

### #9 — No official CDN / standalone bundle

| | |
|---|---|
| **Severity** | Low |
| **Component** | distribution |

To use DS3 in a prototype / design review tool / Storybook without a full bundler, I had to:
1. Discover the package name from a Jira card
2. Try unpkg, jsdelivr, esm.sh — found `https://esm.sh/@uxuissk/design-system-core@3.5.5` works
3. No integrity hash, no version-pinned CDN URL in any docs

**Fix**
Publish a UMD bundle + token CSS at a stable URL with integrity hashes:
```html
<link rel="stylesheet" href="https://cdn.uxui.sellsuki.com/ds3/3.5.5/tokens.css" integrity="sha384-...">
<script type="module" src="https://cdn.uxui.sellsuki.com/ds3/3.5.5/index.js" integrity="sha384-..."></script>
```
Document in `quick-start` MCP tool output.

---

### #10 — `<ssk-icon name="...">` — รายชื่อ icon names ไม่ document

| | |
|---|---|
| **Severity** | Low |
| **Component** | `ssk-icon` |

`<ssk-icon name="cart">` — but what names exist? The MCP `get_component` returns props but not the enum of valid icon names. No way to know what's drawable without trial and error or reading source.

**Fix**
Add `sellsukidesignsystem3__list_icons` MCP tool, OR include the icon name list in `get_component({ tag: 'ssk-icon' })` output.

---

## 📋 Summary table

| # | Component | Severity | Effort | Impact |
|---|---|---|---|---|
| 1 | `app-shell-provider` token injection | 🔴 Critical | Low | **Fixes #4, #5, #8 as a side effect** |
| 2 | `ssk-input` default chrome | 🔴 Critical | Low | Every form unusable |
| 3 | `ssk-button` width/height attrs | 🔴 Critical | Low | Layout broken |
| 4 | `ssk-badge` variant bg | 🔴 Critical | Low | Status display unusable |
| 5 | `ssk-tabs` segment pill | 🟠 High | Medium | Segmented control unusable |
| 6 | React-friendly array props | 🟡 Medium | Medium | Consumer DX |
| 7 | Standardize event payloads | 🟡 Medium | Low | Consumer DX |
| 8 | `ssk-avatar` min-size | 🟡 Medium | Low | Visible regression |
| 9 | Official CDN | 🟢 Low | Medium | Adoption / prototyping |
| 10 | `ssk-icon` names listing | 🟢 Low | Low | Discoverability |

**Recommendation**: prioritize #1 — it's likely the single root cause of #4, #5, #8, and possibly #2/#3. One fix unblocks four components.

---

## 🧪 Reproduction harness

Full repro available in this project:
- `index.html` — final prototype with workarounds applied (4 ssk-button, 1 ssk-input, 7 ssk-card-select, 2 ssk-avatar all working)
- `styles.css` — `:root { --ssk-* }` patch block + host overrides (lines 4-92)
- `ds3-bridge.jsx` — `useWebProps` hook for React 18 interop
- `Sale v1 (tokens-only).html` — older version using only DS3 semantic tokens (no `ssk-*` components) — works fine without patches
