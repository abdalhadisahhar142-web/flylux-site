/* =====================================================================
   مكتبة الأيقونات
   - UI: أيقونات صغيرة للواجهة
   - LINE: أيقونات خطية لقسم "ليش تختارنا" (بتنرسم رسم)، اختار منها بالاسم بملف الإعدادات:
     plane, hotel, car, passport, support, price, shield, map, globe,
     calendar, kaaba, bus, key, camera, star, users, clock, heart, ticket, suitcase
   ===================================================================== */
window.ICONS = (() => {
  const ui = (d, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  const solid = d => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>`;

  const UI = {
    asterisk: solid('<path d="M11 2h2v7.6l5.4-5.4 1.4 1.4L14.4 11H22v2h-7.6l5.4 5.4-1.4 1.4-5.4-5.4V22h-2v-7.6l-5.4 5.4-1.4-1.4L9.6 13H2v-2h7.6L4.2 5.6l1.4-1.4L11 9.6z"/>'),
    arrowCorner: '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M1 1h10v10L1 1z"/></svg>',
    arrow: ui('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    arrowLtr: ui('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    pin: ui('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    calendar: ui('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    users: ui('<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c0-3.3 2.7-5.7 6-5.7s6 2.4 6 5.7"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14c2.6 0 4.5 2 4.5 4.8"/>'),
    star: solid('<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/>'),
    phone: ui('<path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11 11 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5z"/>'),
    mail: ui('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
    clock: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    globe: ui('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17"/>'),
    check: ui('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.3 2.3 4.7-5"/>'),
    menu: ui('<path d="M4 8h16M4 16h16"/>'),
    close: ui('<path d="M6 6l12 12M18 6L6 18"/>'),
    whatsapp: solid('<path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.3z"/>'),
    facebook: solid('<path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/>'),
    instagram: ui('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
    tiktok: solid('<path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v2.8a7 7 0 0 1-3.9-1.3v6.1a5.7 5.7 0 1 1-5.7-5.7l.6.1v2.9a2.9 2.9 0 1 0 2 2.7V3h3z"/>'),
    x: solid('<path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7-8.1L2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z"/>'),
    youtube: solid('<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/>')
  };

  // أيقونات خطية كبيرة (viewBox 48)
  const L = {
    plane: '<path d="M44 5L4 21.5l15.5 5L44 5z"/><path d="M44 5L24.5 43l-5-16.5"/><path d="M19.5 26.5L30 18"/>',
    hotel: '<rect x="10" y="6" width="28" height="36" rx="2"/><path d="M4 42h40"/><path d="M17 14h4M27 14h4M17 22h4M27 22h4M17 30h4M27 30h4"/><path d="M21 42v-6h6v6"/>',
    car: '<path d="M8 29l3.2-9.6A4 4 0 0 1 15 16.6h18a4 4 0 0 1 3.8 2.8L40 29"/><rect x="5" y="29" width="38" height="9" rx="3"/><circle cx="14" cy="38" r="3.5"/><circle cx="34" cy="38" r="3.5"/><path d="M12 25h24"/>',
    passport: '<rect x="10" y="5" width="28" height="38" rx="3"/><circle cx="24" cy="20" r="7"/><path d="M17 20h14"/><path d="M24 13c-2.6 2.2-2.6 11.8 0 14M24 13c2.6 2.2 2.6 11.8 0 14"/><path d="M17 35h14"/>',
    support: '<path d="M10 27v-4a14 14 0 0 1 28 0v4"/><rect x="6" y="25" width="8" height="12" rx="3"/><rect x="34" y="25" width="8" height="12" rx="3"/><path d="M38 37c0 4-4 6.5-10 6.5h-3"/>',
    price: '<path d="M26 6h14a2 2 0 0 1 2 2v14L22 42 6 26 26 6z"/><circle cx="34" cy="14" r="3"/><path d="M17 27l6 6"/>',
    shield: '<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10l16-6z"/><path d="M17 24l5 5 9-10"/>',
    map: '<path d="M4 10l12-4 16 6 12-4v30l-12 4-16-6-12 4z"/><path d="M16 6v30M32 12v30"/>',
    globe: '<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c-6 6-6 30 0 36M24 6c6 6 6 30 0 36"/>',
    calendar: '<rect x="6" y="9" width="36" height="33" rx="3"/><path d="M6 18h36M15 5v8M33 5v8"/><path d="M14 26h4M22 26h4M30 26h4M14 33h4M22 33h4"/>',
    kaaba: '<path d="M8 15l16-7 16 7v23l-16 6-16-6z"/><path d="M8 15l16 6 16-6M24 21v23"/><path d="M8 21l16 6 16-6"/>',
    bus: '<rect x="8" y="5" width="32" height="33" rx="5"/><path d="M8 24h32M8 13h32"/><circle cx="16" cy="31" r="2"/><circle cx="32" cy="31" r="2"/><path d="M14 38v5M34 38v5"/>',
    key: '<circle cx="15" cy="33" r="9"/><path d="M21.5 26.5L41 7M34 14l5 5M29 19l4 4"/>',
    camera: '<rect x="5" y="14" width="38" height="26" rx="3"/><circle cx="24" cy="27" r="7.5"/><path d="M16 14l3-6h10l3 6"/>',
    star: '<path d="M24 5l5.9 12 13.1 1.9-9.5 9.3 2.2 13.1L24 35.1l-11.7 6.2 2.2-13.1L5 18.9 18.1 17z"/>',
    users: '<circle cx="18" cy="16" r="6.5"/><path d="M6 41c0-7 5.4-12.5 12-12.5S30 34 30 41"/><circle cx="33.5" cy="18" r="5"/><path d="M32 28.5c6 0 10.5 4.6 10.5 10.5"/>',
    clock: '<circle cx="24" cy="24" r="18"/><path d="M24 13v11l7.5 5"/>',
    heart: '<path d="M24 41S6 30.5 6 17.5A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 18 4.5C42 30.5 24 41 24 41z"/>',
    ticket: '<path d="M5 14a3 3 0 0 0 0 6v0a3 3 0 0 1 0 6v8h38v-8a3 3 0 0 1 0-6v0a3 3 0 0 0 0-6V8H5z"/><path d="M30 8v26" stroke-dasharray="3 3"/>',
    suitcase: '<rect x="6" y="14" width="36" height="26" rx="3"/><path d="M17 14V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/><path d="M14 14v26M34 14v26"/>'
  };

  const line = name =>
    `<svg class="draw-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${L[name] || L.star}</svg>`;

  return { ...UI, line };
})();
