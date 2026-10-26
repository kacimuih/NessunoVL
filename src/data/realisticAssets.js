// Realistic Assets Mapping for Virtual Lab IPL
// Maps component types and their operational states (on/off/default) to photo file paths.
//
// 💡 RECOMMENDED IMAGE OPTIMIZATION GUIDELINES FOR ASSET PREPARATION:
// 1. File size: Each PNG image file should ideally be compressed to under 150KB.
// 2. Resolution: Approximately 400x600px or 500x500px square.
// 3. Format: PNG with transparent background preferred for best visual rendering.

/**
 * Resolves an asset path to a robust URL based on the current module location.
 * Works seamlessly across Live Server, root domains, subdirectories (e.g. GitHub Pages),
 * and file:// protocol.
 * @param {string} path - Relative asset path (e.g. 'src/assets/images/tools/tang-kombinasi.jpg')
 * @returns {string} Fully resolved URL
 */
export function resolveAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('file://')) {
    return path;
  }
  // Normalize path: strip leading './', '/', or 'src/'
  let subPath = path.replace(/^(\.\/|\/)?(src\/)?/, '');
  if (!subPath.includes('/')) {
    subPath = 'assets/images/' + subPath;
  }
  try {
    return new URL('../' + subPath, import.meta.url).href;
  } catch (e) {
    return path;
  }
}

export const REALISTIC_ASSETS = {
  Source_1P:     { default: 'src/assets/images/sumber-1p.png' },
  Source_3P:     { default: 'src/assets/images/sumber-3p.png' },
  MCB_1P:        { on: 'src/assets/images/mcb-1p-on.png',  off: 'src/assets/images/mcb-1p-off.png' },
  MCB_3P:        { on: 'src/assets/images/mcb-3p-on.png',  off: 'src/assets/images/mcb-3p-off.png' },
  SwitchSingle:  { on: 'src/assets/images/saklar-tunggal-on.png', off: 'src/assets/images/saklar-tunggal-off.png' },
  SwitchDouble:  {
    bothOn:  'src/assets/images/saklar-seri-on.png',
    leftOn:  'src/assets/images/saklar-seri-kiri-on.png',
    rightOn: 'src/assets/images/saklar-seri-kanan-on.png',
    off:     'src/assets/images/saklar-seri-off.png',
    on:      'src/assets/images/saklar-seri-on.png'
  },
  SwitchWay3:    { on: 'src/assets/images/saklar-tukar-off.png',   off: 'src/assets/images/saklar-tukar-on.png' },
  SwitchCross:   { on: 'src/assets/images/saklar-silang-off.png',  off: 'src/assets/images/saklar-silang-on.png' },
  Lamp:          { on: 'src/assets/images/lampu-menyala.png', off: 'src/assets/images/lampu-mati.png' },
  LampTL:        { on: 'src/assets/images/lampu-tl-menyala.png', off: 'src/assets/images/lampu-tl-mati.png' },
  Socket:        { default: 'src/assets/images/stop-kontak.png' },
  TerminalBlock: { default: 'src/assets/images/terminal-block.png' },
  PanelPHB:      { default: 'src/assets/images/panel-3fasa.webp' },
  Fuse:          { default: 'src/assets/images/sekring.webp' }
};

/**
 * Returns the realistic asset image path for a given component type and state.
 * @param {string} type - Component type name
 * @param {Object} compState - Component state object { on, on1, on2, tripped, ... }
 * @returns {string|null} Path to realistic image asset or null if not mapped
 */
export function getRealisticAssetPath(type, compState = {}) {
  const assetGroup = REALISTIC_ASSETS[type];
  if (!assetGroup) return null;

  let rawPath = null;
  if (assetGroup.default) {
    rawPath = assetGroup.default;
  } else if (type === 'SwitchDouble') {
    // Independent rocker handles for double switch (left=on1, right=on2)
    const on1 = compState.on1 === true;
    const on2 = compState.on2 === true;
    if (on1 && on2) {
      rawPath = assetGroup.bothOn || assetGroup.on;
    } else if (on1) {
      rawPath = assetGroup.leftOn;
    } else if (on2) {
      rawPath = assetGroup.rightOn;
    } else {
      rawPath = assetGroup.off;
    }
  } else {
    // Single pole switches / MCB / Lamps
    const isON = compState.on === true;
    if (isON && assetGroup.on) {
      rawPath = assetGroup.on;
    } else if (!isON && assetGroup.off) {
      rawPath = assetGroup.off;
    } else {
      rawPath = assetGroup.default || assetGroup.off || assetGroup.on || null;
    }
  }

  return rawPath ? resolveAssetUrl(rawPath) : null;
}

/**
 * Returns the thumbnail image path for a palette item (always uses the off/default/mati variant).
 * Used by the palette sidebar so components always appear in their neutral "before use" state.
 * Returns null if no photo exists for this type (fallback to emoji).
 * @param {string} type - Component type name
 * @returns {string|null} Resolved URL to thumbnail image or null
 */
export function getPaletteThumbnail(type) {
  const assetGroup = REALISTIC_ASSETS[type];
  if (!assetGroup) return null;
  // Always use the neutral "off" version for switchable/lamp/breaker components,
  // or "default" for static components (Source, Socket, TerminalBlock)
  const rawPath = assetGroup.off || assetGroup.default || assetGroup.on || null;
  return rawPath ? resolveAssetUrl(rawPath) : null;
}
