/**
 * js/components/icons.js
 *
 * Set de iconos SVG propios, trazo simple (24x24, stroke actual color).
 * Se usan como contenido interno de <svg viewBox="0 0 24 24">...</svg>
 * Mantener este archivo como única fuente de iconos evita duplicar
 * markup SVG en cada componente.
 */

const ICONS = {
  shield: '<path d="M12 3l7 3v6c0 4.6-3 8.2-7 9-4-0.8-7-4.4-7-9V6l7-3z" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  "check-square": '<rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke-width="1.8"/><path d="M8 12l2.5 2.5L16 9" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  flag: '<path d="M5 21V4" fill="none" stroke-width="1.8" stroke-linecap="round"/><path d="M5 5h11l-2.5 3.5L16 12H5" fill="none" stroke-width="1.8" stroke-linejoin="round"/>',
  "message-circle": '<path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>',
  users: '<circle cx="9" cy="8" r="3" fill="none" stroke-width="1.8"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" fill="none" stroke-width="1.8" stroke-linecap="round"/><path d="M16 4.2a3 3 0 0 1 0 5.8" fill="none" stroke-width="1.8" stroke-linecap="round"/><path d="M15 15.2c2.6.4 4.5 2.1 4.5 4.8" fill="none" stroke-width="1.8" stroke-linecap="round"/>',
  "edit-3": '<path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 7l4 4" fill="none" stroke-width="1.8"/>',
  "user-x": '<circle cx="9" cy="8" r="3.5" fill="none" stroke-width="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke-width="1.8" stroke-linecap="round"/><path d="M17 8l4 4M21 8l-4 4" fill="none" stroke-width="1.8" stroke-linecap="round"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>',
  sun: '<circle cx="12" cy="12" r="4" fill="none" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" stroke-width="1.8" stroke-linecap="round"/>',
  arrow: '<path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6L6 18" stroke-width="1.8" stroke-linecap="round"/>',
  scale: '<path d="M12 3v18M7 21h10" stroke-width="1.8" stroke-linecap="round"/><path d="M5 7l3.5-1.2L12 7M12 7l3.5-1.2L19 7" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 7l-2.5 5a3 3 0 0 0 5.5 0L5 7zM19 7l-2.5 5a3 3 0 0 0 5.5 0L19 7z" fill="none" stroke-width="1.8" stroke-linejoin="round"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" fill="none" stroke-width="1.8"/><path d="M10 15h4v3h-4z" fill="none" stroke-width="1.8"/><path d="M8 21h8" stroke-width="1.8" stroke-linecap="round"/>',
  "volume-x": '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 9l4 6M20 9l-4 6" stroke-width="1.8" stroke-linecap="round"/>',
  "volume-on": '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="none" stroke-width="1.8" stroke-linejoin="round"/><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke-width="1.8" stroke-linecap="round"/>'
};

function svgIcon(name) {
  return ICONS[name] || ICONS.shield;
}
