/* =====================================================================
   main.js — بيقرأ window.SITE وبيبني الموقع كامل + كل الأنيميشن
   ما في داعي تعدّل هون لمكتب جديد، كل شي من ملف الإعدادات
   ===================================================================== */
(() => {
  const S = window.SITE;
  const I = window.ICONS;
  if (!S) { document.body.innerHTML = "<p style='padding:40px'>ملف الإعدادات مو موجود (clients/*.js)</p>"; return; }

  // نبلّش تنزيل صورة الهيرو أول شي، قبل بناء الصفحة والخطوط
  let heroImg = null;
  if (S.hero?.image) {
    heroImg = new Image();
    heroImg.fetchPriority = "high";
    heroImg.decoding = "async";
    heroImg.src = S.hero.image;
  }

  const lang = S.lang || "ar";
  const rtl = lang === "ar";
  const L = ({
    ar: { from: "ابتداءً من", step: "خطوة", menu: "القائمة", rights: "جميع الحقوق محفوظة", madeBy: "تصميم وتطوير", chat: "تواصل عبر واتساب" },
    en: { from: "from", step: "Step", menu: "Menu", rights: "All Rights Reserved", madeBy: "Made by", chat: "Chat on WhatsApp" }
  })[lang] || {};

  /* ---------- أدوات ---------- */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = (type, d = 0) => `data-anim="${type}" style="--d:${d.toFixed(2)}s"`;
  const pad2 = n => String(n).padStart(2, "0");
  const fill = (tpl, o) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => o?.[k] ?? "");
  const msgs = S.messages || {};
  const waNum = String(S.contact?.whatsapp || "").replace(/\D/g, "");
  const wa = text => waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(text || msgs.general || "")}`
                           : (S.contact?.phone ? `tel:${S.contact.phone.replace(/\s/g, "")}` : "#contact");
  const ext = href => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  const img = (src, alt = "", eager = false) => src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async" onload="this.classList.add('loaded')" onerror="this.remove()">`
    : "";
  const tw = text => `<span class="tw-ghost">${esc(text)}</span><span class="tw-live" aria-hidden="true"></span>`;
  const arrow = rtl ? I.arrow : I.arrowLtr;

  /* ---------- الإعدادات العامة للصفحة ---------- */
  const html = document.documentElement;
  html.lang = lang;
  html.dir = rtl ? "rtl" : "ltr";
  const t = S.theme || {};
  const vars = { bg: "--bg", surface: "--surface", surfaceHover: "--surface-hover", accent: "--accent", text: "--text", brand: "--brand" };
  Object.entries(vars).forEach(([k, v]) => t[k] && html.style.setProperty(v, t[k]));
  html.dataset.mode = t.mode === "light" ? "light" : "dark";

  // الخطوط: من theme.fonts أو الافتراضي
  // - خط من Google Fonts: بس اكتب اسمه
  // - خط من ملفات محلية (متل Dubai): حط مسارات الملفات بـ files حسب الوزن
  const F = Object.assign({ head: "Readex Pro", body: "IBM Plex Sans Arabic" }, t.fonts || {});
  const fam = n => n.trim().replace(/ /g, "+");
  const localFams = new Set();
  if (F.files && Object.keys(F.files).length) {
    const fmt = f => ({ woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" })[f.split(".").pop().toLowerCase()] || "truetype";
    const localName = F.localName || F.head;
    const css = Object.entries(F.files).map(([w, file]) =>
      `@font-face{font-family:"${localName}";src:url("${file}") format("${fmt(file)}"), local("${localName}");font-weight:${w};font-style:normal;font-display:swap;}`).join("");
    const st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    localFams.add(localName);
    // فحص: إذا ملفات الخط ما انلقت منطبع تحذير واضح بالـ Console
    Object.entries(F.files).forEach(([w, file]) => {
      const warn = () => console.warn(`⚠️ ملف الخط ما انلقى: ${file} — تأكد إنه موجود بهالمسار وبنفس الاسم بالضبط`);
      document.fonts.load(`${w} 16px "${localName}"`).then(r => { if (!r.length) warn(); }).catch(warn);
    });
  }
  const googleFams = [...new Set([F.head, F.body, "Inter"])].filter(n => !localFams.has(n));
  const loadGoogle = (names, weights) => {
    if (!names.length) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?" + names.map(n => `family=${fam(n)}${weights ? `:wght@${weights}` : ""}`).join("&") + "&display=swap";
    return l;
  };
  const fl = loadGoogle(googleFams, "200;300;400;500");
  if (fl) {
    // بعض الخطوط ما فيها كل الأوزان، فإذا فشل الطلب منحمّلها بالأوزان المتوفرة
    fl.onerror = () => googleFams.forEach(n => {
      const l = loadGoogle([n], "400;500;700");
      l.onerror = () => { l.href = `https://fonts.googleapis.com/css2?family=${fam(n)}&display=swap`; };
      document.head.appendChild(l);
    });
    document.head.appendChild(fl);
  }
  if (rtl) {
    html.style.setProperty("--font-head", `"${F.head}", "Inter", system-ui, sans-serif`);
    html.style.setProperty("--font-body", `"${F.body}", "Inter", system-ui, sans-serif`);
  }

  const seo = S.seo || {};
  document.title = seo.title || S.brand?.name || "";
  const setMeta = (sel, val) => { const m = document.querySelector(sel); if (m && val) m.setAttribute("content", val); };
  setMeta('meta[name="description"]', seo.description);
  setMeta('meta[property="og:title"]', seo.title);
  setMeta('meta[property="og:description"]', seo.description);
  setMeta('meta[property="og:image"]', seo.image || S.hero?.image);
  setMeta('meta[name="theme-color"]', t.bg);
  const fav = document.createElement("link");
  const favColor = t.brand || t.accent || "#F5A13A";
  fav.rel = "icon";
  fav.href = S.brand?.favicon || "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="${t.bg || "#0A1A20"}"/><path transform="translate(3 3) scale(.75)" fill="${favColor}" d="M11 2h2v7.6l5.4-5.4 1.4 1.4L14.4 11H22v2h-7.6l5.4 5.4-1.4 1.4-5.4-5.4V22h-2v-7.6l-5.4 5.4-1.4-1.4L9.6 13H2v-2h7.6L4.2 5.6l1.4-1.4L11 9.6z"/></svg>`);
  document.head.appendChild(fav);

  const logo = () => S.brand?.logo
    ? `<img src="${esc(S.brand.logo)}" alt="${esc(S.brand.name)}">${S.brand.logoWithText ? `<span>${esc(S.brand.logoText || S.brand.name)}</span>` : ""}`
    : `${S.brand?.mark ? `<span class="mark">${esc(S.brand.mark)}</span>` : I.asterisk}<span>${esc(S.brand?.logoText || S.brand?.name)}</span>`;

  /* ---------- الأقسام ---------- */
  const SECTIONS = [
    ["categories", "services"], ["about", "about"], ["trips", "trips"], ["guide", "guide"],
    ["process", "process"], ["destinations", "destinations"], ["why", "why"], ["footer", "contact"]
  ];
  const navItems = SECTIONS.filter(([k]) => S[k]?.navLabel).map(([k, id]) => ({ label: S[k].navLabel, href: `#${id}` }));

  function header() {
    const cta = S.header?.cta || L.chat;
    const links = navItems.map(n => `<a href="${n.href}">${esc(n.label)}</a>`).join("");
    return `
    <header class="header" id="header">
      <div class="header__inner">
        <a href="#top" class="logo${S.brand?.logo && S.brand?.logoWithText ? " logo--with-text" : ""}" aria-label="${esc(S.brand?.name)}">${logo()}</a>
        <nav class="nav">${links}</nav>
        <a href="${wa(msgs.general)}"${ext(wa())} class="explore"><span>${esc(cta)}</span></a>
        <button class="menu-btn" aria-label="${L.menu}" data-menu-open>${I.menu}</button>
      </div>
      <span class="ln ln-h hdr-line"></span>
      <span class="ln ln-v hdr-v hdr-v1"></span>
      <span class="ln ln-v hdr-v hdr-v2"></span>
    </header>
    <div class="mnav" aria-hidden="true">
      <button class="mnav__close" aria-label="close" data-menu-close>${I.close}</button>
      ${links}
      <a href="${wa(msgs.general)}"${ext(wa())} style="color:var(--accent)">${esc(cta)}</a>
    </div>`;
  }

  function hero(h) {
    return `
    <section class="hero" id="top">
      <div class="hero__bg" id="heroBg"></div>
      <div class="hero__content">
        <h1 class="hero__title" ${A("up", .5)} data-manual>${esc(h.title)}</h1>
        <p class="hero__sub" ${A("up", .75)} data-manual>${esc(h.subtitle)}</p>
        <div ${A("up", 1)} data-manual>
          <a href="${esc(h.cta?.href || "#trips")}"${ext(h.cta?.href || "")} class="btn"><span>${esc(h.cta?.text)}</span>${I.arrowCorner}</a>
        </div>
      </div>
    </section>`;
  }

  const head = (label, heading, extra = "") => `
    <div class="sec-head">
      ${label ? `<div class="sec-label" ${A("up", 0)}>${I.asterisk}<span>${esc(label)}</span></div>` : "<div></div>"}
      <div>
        ${heading ? `<h2 class="sec-title tw" data-anim="type" aria-label="${esc(heading.replace(/\n/g, " "))}">${tw(heading)}</h2>` : ""}
        ${extra}
      </div>
    </div>`;

  function categories(c) {
    const items = c.items || [];
    return `
    <section class="sec cats-sec" id="services">
      ${head(c.label, c.heading)}
      <div class="cats" style="--cols:${Math.min(items.length, 3)}">
        <span class="ln ln-h" ${A("draw", .1)}></span>
        ${items.map((it, i) => `
          <article class="cat" ${A("start", .12 + (i % 3) * .2)}>
            <span class="ln ln-v" ${A("draw", .5 + (i % 3) * .2)}></span>
            <div class="cat__head"><h3>${esc(it.title)}</h3><span class="cat__meta">${esc(it.meta)}</span></div>
            <a class="cat__img ph" href="${esc(it.href || wa(fill(msgs.category, it)))}"${ext(it.href || wa())} aria-label="${esc(it.title)}">${img(it.image, it.title)}</a>
          </article>`).join("")}
      </div>
    </section>`;
  }

  function about(a) {
    return `
    <section class="sec about-sec" id="about">
      ${head(a.label, a.heading)}
      <div class="about__grid">
        <div class="about__img ph" ${A("start", .1)}>${img(a.image, a.label)}</div>
        <div>
          <p class="about__text" ${A("up", .35)}>${esc(a.text)}</p>
          <div class="stats">
            ${(a.stats || []).map((s, i) => `
              <div class="stat" ${A("up", .6 + i * .2)}>
                <div class="stat__num"><span data-count="${Number(s.value)}">0</span>${s.suffix ? `<small>${esc(s.suffix)}</small>` : ""}</div>
                <div class="stat__label">${esc(s.label)}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    </section>`;
  }

  function trips(tp) {
    const stars = n => `<span class="stars" aria-label="${n}/5">${I.star.repeat(Math.round(n || 5))}</span>`;
    return `
    <section class="sec trips-sec" id="trips">
      ${head(tp.label, tp.heading)}
      <div class="trips">
        <span class="ln ln-h" ${A("draw", .1)}></span>
        ${(tp.items || []).map((x, i) => {
          const rows = [
            x.location && [esc(x.location), I.pin],
            x.dates && [`${esc(x.dates)} ${x.duration ? `<em>${esc(x.duration)}</em>` : ""}`, I.calendar],
            x.group && [esc(x.group), I.users],
            (x.trusted || x.rating) && [`<em>${esc(x.trusted || "")}</em>`, x.rating ? stars(x.rating) : I.check]
          ].filter(Boolean);
          const link = x.href || wa(fill(msgs.trip, x));
          return `
          <article class="trip">
            <span class="ln ln-h" ${A("draw", .25)}></span>
            ${i % 2 ? `<span class="ln ln-v" ${A("draw", .4)}></span>` : ""}
            <div class="trip__body">
              <h3 class="trip__title" ${A("up", .1)}>${esc(x.title)}</h3>
              ${x.price ? `<p class="trip__price" ${A("up", .2)}>${esc(tp.priceLabel || L.from)} <b>${esc(x.price)}</b></p>` : ""}
              <ul class="trip__meta">
                ${rows.map((r, j) => `<li ${A("up", .32 + j * .09)}><span>${r[0]}</span><i>${r[1]}</i></li>`).join("")}
              </ul>
              <div class="trip__cta" ${A("pop", .78)}>
                <a class="pill" href="${esc(link)}"${ext(link)}><span>${esc(tp.button || L.chat)}</span>${arrow}</a>
              </div>
            </div>
            <div class="trip__img ph" ${A("start", .15)}>${img(x.image, x.title)}</div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }

  function processSec(p) {
    const steps = p.steps || [];
    return `
    <section class="process" id="process">
      <div class="process__bg" style="background-image:url('${esc(p.image)}')"></div>
      <div class="process__mist m1"></div><div class="process__mist m2"></div>
      <div class="process__fog"></div>
      <div class="process__top">
        <h2 class="process__title" ${A("up", 0)}>${esc(p.heading)}</h2>
        <ul class="process__list">
          ${(p.extras || []).map((e, i) => `<li ${A("up", .15 + i * .13)}><span class="plus">+</span>${esc(e)}</li>`).join("")}
        </ul>
      </div>
      <div class="process__steps" style="--n:${steps.length}">
        <span class="ln ln-h" ${A("draw", 0)}></span>
        <p class="process__desc" ${A("up", .2)}>${esc(p.text)}</p>
        ${steps.map((s, i) => `
          <div class="pstep">
            <span class="ln ln-v" ${A("draw", .25 + i * .15)}></span>
            <div ${A("up", .35 + i * .15)}><div class="pstep__num">${pad2(i + 1)}</div><div class="pstep__lbl">${L.step}</div></div>
            <div class="pstep__title" ${A("up", .5 + i * .15)}>${esc(s)}</div>
          </div>`).join("")}
      </div>
    </section>`;
  }

  function destinations(d) {
    return `
    <section class="sec map-sec" id="destinations">
      ${head(d.label, d.heading, d.text ? `<p class="map-sec__text" ${A("up", .35)}>${esc(d.text)}</p>` : "")}
      <div class="map" id="map" data-anim="map">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(d.heading)}">
          <defs>
            <radialGradient id="dotGlow">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity=".55"/>
              <stop offset="45%" stop-color="var(--accent)" stop-opacity=".16"/>
              <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
            </radialGradient>
            <pattern id="gridDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle class="grid-dot" cx="2" cy="2" r="1.3"/></pattern>
          </defs>
          <rect class="map__fallback" width="1600" height="900" fill="url(#gridDots)"/>
          <g class="map__land"></g>
          <g class="map__dots"></g>
        </svg>
        <div class="map-tip"></div>
      </div>
    </section>`;
  }

  /* دليل خطوة بخطوة (متل لمّ الشمل أو العمرة): خطوات + أوراق مطلوبة + أسئلة متكررة */
  function guide(g) {
    const steps = g.steps || [];
    const docs = g.docs || null;
    const faq = g.faq || [];
    const cta = g.cta || {};
    const ctaLink = cta.href || wa(cta.message || fill(msgs.category, { title: g.label || "" }));
    return `
    <section class="sec guide-sec" id="guide">
      ${head(g.label, g.heading, g.text ? `<p class="guide__intro" ${A("up", .35)}>${esc(g.text)}</p>` : "")}
      <div class="guide__grid">
        <ol class="guide__steps">
          <span class="ln ln-v guide__rail" ${A("draw", .2)}></span>
          ${steps.map((st, i) => `
            <li class="gstep">
              <span class="gstep__dot" ${A("pop", .3 + i * .12)}>${pad2(i + 1)}</span>
              <div class="gstep__body">
                <h3 ${A("up", .35 + i * .12)}>${esc(st.title)}</h3>
                ${st.text ? `<p ${A("up", .42 + i * .12)}>${esc(st.text)}</p>` : ""}
              </div>
            </li>`).join("")}
        </ol>
        <aside class="guide__side">
          ${docs ? `
          <div class="docs" ${A("start", .2)}>
            <h3 class="docs__title">${esc(docs.title || "")}</h3>
            <ul class="docs__list">
              ${(docs.items || []).map((d, i) => `<li ${A("up", .4 + i * .08)}><i>${I.check}</i><span>${esc(d)}</span></li>`).join("")}
            </ul>
            ${docs.note ? `<p class="docs__note">${esc(docs.note)}</p>` : ""}
            ${cta.text ? `<div class="docs__cta" ${A("pop", .5 + (docs.items || []).length * .08)}><a class="pill pill--accent" href="${esc(ctaLink)}"${ext(ctaLink)}><span>${esc(cta.text)}</span>${arrow}</a></div>` : ""}
          </div>` : ""}
        </aside>
      </div>
      ${faq.length ? `
      <div class="faq">
        ${g.faqTitle ? `<h3 class="faq__title" ${A("up", 0)}>${esc(g.faqTitle)}</h3>` : ""}
        ${faq.map((f, i) => `
          <div class="faq__item" ${A("up", .08 + i * .08)}>
            <button class="faq__q" aria-expanded="false"><span>${esc(f.q)}</span><i class="faq__icon"></i></button>
            <div class="faq__a"><div><p>${esc(f.a)}</p></div></div>
          </div>`).join("")}
      </div>` : ""}
    </section>`;
  }

  function why(w) {
    const items = w.items || [];
    return `
    <section class="sec why-sec" id="why">
      <div class="why__head">
        <h2 class="why__title" ${A("down", 0)}>${esc(w.heading)}</h2>
        ${w.text ? `<p class="why__intro" ${A("down", .15)}>${esc(w.text)}</p>` : ""}
      </div>
      <div class="why__grid" style="--n:${Math.min(items.length, 4)}">
        ${items.map((it, i) => `
          <div class="why__item">
            <div class="why__icon" ${A("up", .1 + i * .15)}>${I.line(it.icon)}<sup>${pad2(i + 1)}</sup></div>
            <h3 ${A("down", .45 + i * .15)}>${esc(it.title)}</h3>
            <p ${A("down", .58 + i * .15)}>${esc(it.text)}</p>
          </div>`).join("")}
      </div>
    </section>`;
  }

  function footer(f) {
    const c = S.contact || {};
    const so = S.social || {};
    const year = new Date().getFullYear();
    const contactRows = [
      c.phone && `<a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${I.phone}<span class="ltr">${esc(c.phone)}</span></a>`,
      waNum && `<a href="${wa(msgs.general)}" target="_blank" rel="noopener">${I.whatsapp}<span>${L.chat}</span></a>`,
      c.email && `<a href="mailto:${esc(c.email)}">${I.mail}<span class="ltr">${esc(c.email)}</span></a>`,
      c.address && `<${c.mapUrl ? `a href="${esc(c.mapUrl)}" target="_blank" rel="noopener"` : "p"}>${I.pin}<span>${esc(c.address)}</span></${c.mapUrl ? "a" : "p"}>`,
      c.hours && `<p>${I.clock}<span>${esc(c.hours)}</span></p>`,
      c.website && `<a href="${esc(c.website)}" target="_blank" rel="noopener">${I.globe}<span class="ltr">${esc(c.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</span></a>`
    ].filter(Boolean);
    const socials = ["facebook", "instagram", "tiktok", "x", "youtube"].filter(k => so[k])
      .map(k => `<a href="${esc(so[k])}" target="_blank" rel="noopener" aria-label="${k}">${I[k]}</a>`).join("");
    const links = f.links || navItems.slice(0, 2).map(n => ({ text: n.label, href: n.href }));

    return `
    <footer class="footer" id="contact">
      ${f.image ? `<div class="footer__curtain" data-anim="curtain"><div class="footer__banner ph">${img(f.image, S.brand?.name)}</div></div>` : ""}
      <div class="footer__main">
        <div ${A("up", 0)}>
          <a href="#top" class="logo${S.brand?.logo && S.brand?.logoWithText ? " logo--with-text" : ""}">${logo()}</a>
          ${f.about ? `<p class="footer__about">${esc(f.about)}</p>` : ""}
        </div>
        <nav class="footer__links">
          ${links.map((l, i) => `<a href="${esc(l.href)}"${ext(l.href)} ${A("up", .12 + i * .1)}><span class="plus">+</span>${esc(l.text)}</a>`).join("")}
        </nav>
        <div class="footer__contact">
          ${contactRows.map((r, i) => r.replace(/^<(a|p)/, `<$1 ${A("up", .2 + i * .08)}`)).join("")}
          ${socials ? `<div class="socials" ${A("up", .2 + contactRows.length * .08)}>${socials}</div>` : ""}
        </div>
      </div>
      <div class="footer__bar">
        <span class="ln ln-h" ${A("draw", 0)}></span>
        <div class="footer__copy">©${year} ${esc(S.brand?.name)}. ${L.rights}<span class="ln ln-v" ${A("draw", .4)}></span></div>
        ${S.credit?.name ? `<div class="footer__credit">${L.madeBy} <a href="${esc(S.credit.url || "#")}"${ext(S.credit.url || "")}>${I.asterisk}${esc(S.credit.name)}</a></div>` : ""}
        ${f.legal?.length ? `<div class="footer__legal">${f.legal.map(l => `<a href="${esc(l.href)}"${ext(l.href)}>${esc(l.text)}</a>`).join("")}</div>` : ""}
      </div>
    </footer>
    ${waNum ? `<a class="fab" href="${wa(msgs.general)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}</a>` : ""}`;
  }

  /* ---------- البناء ---------- */
  const app = document.getElementById("app");
  app.innerHTML = [
    header(),
    S.hero && hero(S.hero),
    S.categories && categories(S.categories),
    S.about && about(S.about),
    S.trips && trips(S.trips),
    S.guide && guide(S.guide),
    S.process && processSec(S.process),
    S.destinations && destinations(S.destinations),
    S.why && why(S.why),
    footer(S.footer || {})
  ].filter(Boolean).join("");

  // الأيقونات الخطية: pathLength=1 مشان أنيميشن الرسم
  document.querySelectorAll(".draw-icon *").forEach(el => el.setAttribute("pathLength", "1"));

  /* ---------- الأنيميشن ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delayOf = el => (parseFloat(el.style.getPropertyValue("--d")) || 0) * 1000;

  function typewrite(el) {
    const full = el.querySelector(".tw-ghost").textContent;
    const live = el.querySelector(".tw-live");
    if (reduced) { live.textContent = full; return; }
    const chars = Array.from(full);
    const step = Math.max(16, Math.min(48, 1500 / chars.length));
    let i = 0;
    setTimeout(() => {
      el.classList.add("typing");
      const tick = () => {
        i++;
        live.textContent = chars.slice(0, i).join("");
        if (i < chars.length) setTimeout(tick, chars[i - 1] === "\n" ? step * 5 : step);
        else { el.classList.remove("typing"); el.classList.add("typed"); }
      };
      tick();
    }, delayOf(el) + 150);
  }

  function countUp(el, delay) {
    const to = parseFloat(el.dataset.count) || 0;
    const dec = (String(el.dataset.count).split(".")[1] || "").length;
    const fmt = v => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduced) { el.textContent = fmt(to); return; }
    const dur = 1900;
    setTimeout(() => {
      const t0 = performance.now();
      const frame = now => {
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(2, -10 * p);
        el.textContent = fmt(to * (p === 1 ? 1 : e));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
  }

  function reveal(el) {
    el.classList.add("in");
    const type = el.dataset.anim;
    if (type === "type") typewrite(el);
    el.querySelectorAll("[data-count]").forEach(n => countUp(n, delayOf(el) + 250));
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      reveal(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll("[data-anim]:not([data-manual])").forEach(el => {
    if (reduced) reveal(el); else io.observe(el);
  });

  /* ---------- البداية: بعد تحميل صورة الهيرو ---------- */
  let started = false;
  const start = () => {
    if (started) return; started = true;
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
      document.querySelectorAll("[data-manual]").forEach(reveal);
    });
  };
  const heroBg = document.getElementById("heroBg");
  if (heroBg && S.hero?.image) {
    const show = () => { heroBg.style.backgroundImage = `url("${S.hero.image}")`; start(); };
    if (heroImg.complete && heroImg.naturalWidth) show();
    else {
      heroImg.addEventListener("load", show, { once: true });
      heroImg.addEventListener("error", start, { once: true });
      // إذا النت بطيء ما منستنى أكتر من ثانية: الأنيميشن بيبلش والصورة بتظهر لما توصل
      setTimeout(show, 1000);
    }
  } else start();

  /* ---------- الهيدر الزجاجي + parallax ---------- */
  const hdr = document.getElementById("header");
  const pbg = document.querySelector(".process__bg");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      hdr.classList.toggle("is-scrolled", scrollY > 40);
      if (pbg && !reduced) {
        const r = pbg.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          const off = (r.top + r.height / 2 - innerHeight / 2) * -0.12;
          pbg.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
        }
      }
      ticking = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- قائمة الموبايل + الأسئلة المتكررة ---------- */
  document.addEventListener("click", e => {
    const q = e.target.closest(".faq__q");
    if (q) {
      const item = q.parentElement;
      const open = !item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq__item.open").forEach(x => { x.classList.remove("open"); x.querySelector(".faq__q").setAttribute("aria-expanded", "false"); });
      if (open) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
      return;
    }
    if (e.target.closest("[data-menu-open]")) document.body.classList.add("menu-open");
    else if (e.target.closest("[data-menu-close]") || e.target.closest(".mnav a")) document.body.classList.remove("menu-open");
  });

  /* ---------- الخريطة ---------- */
  const mapEl = document.getElementById("map");
  if (mapEl && S.destinations) initMap(mapEl, S.destinations);

  function initMap(el, d) {
    const W = 1600, H = 900, RAD = Math.PI / 180;
    const points = (d.points || []).map(p => {
      const ll = p.coords || window.PLACES(p.city);
      if (!ll) console.warn("مدينة مو موجودة بقائمة الوجهات (js/places.js):", p.city);
      return ll ? { ...p, lat: ll[0], lon: ll[1] } : null;
    }).filter(Boolean);
    if (!points.length) return;

    // الإسقاط (Mercator) — بيتمركز تلقائياً على نقاط المكتب
    const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2));
    let lon1 = Math.min(...points.map(p => p.lon)), lon2 = Math.max(...points.map(p => p.lon));
    let lat1 = Math.min(...points.map(p => p.lat)), lat2 = Math.max(...points.map(p => p.lat));
    if (d.view?.lon) [lon1, lon2] = d.view.lon;
    if (d.view?.lat) [lat1, lat2] = d.view.lat;
    const cLon = (lon1 + lon2) / 2;
    const spanLon = d.view?.lon ? (lon2 - lon1) : Math.max(lon2 - lon1, 6) * 1.8;
    const mMid = (merc(lat1) + merc(lat2)) / 2;
    const mSpan = Math.max(merc(lat2) - merc(lat1), .05);
    const scale = Math.min(W / (spanLon * RAD), (H * .6) / mSpan);
    // نزّل المركز شوي لتحت مشان النقاط ما تتغطى بالنص
    const cy = H * .56;
    const project = (lon, lat) => [W / 2 + scale * (lon - cLon) * RAD, cy - scale * (merc(lat) - mMid)];

    const svg = el.querySelector("svg");
    const gDots = svg.querySelector(".map__dots");
    const NS = "http://www.w3.org/2000/svg";
    const r = (d.dotScale || 1);

    points.forEach((p, i) => {
      const [x, y] = project(p.lon, p.lat);
      const outer = document.createElementNS(NS, "g");
      outer.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const main = !!p.main;
      outer.innerHTML = `
        <g class="dot ${main ? "dot--main" : ""}" style="--d:${(.6 + i * .12).toFixed(2)}s;--p:${(Math.random() * 2).toFixed(2)}s">
          <circle class="dot__halo" r="${(main ? 40 : 22) * r}"/>
          <circle class="dot__core" r="${(main ? 9 : 5) * r}"/>
          <circle r="${26 * r}" fill="transparent"/>
          ${main ? `<text class="dot__label" x="${rtl ? -16 * r : 16 * r}" y="-14" text-anchor="${rtl ? "end" : "start"}">${esc(p.city)}</text>` : ""}
        </g>`;
      outer.style.cursor = "pointer";
      const tip = el.querySelector(".map-tip");
      outer.addEventListener("mouseenter", () => {
        const b = outer.querySelector(".dot__core").getBoundingClientRect();
        const m = el.getBoundingClientRect();
        tip.innerHTML = `<b>${esc(p.city)}</b>${p.note ? `<span>${esc(p.note)}</span>` : ""}`;
        tip.style.left = `${b.left - m.left + b.width / 2}px`;
        tip.style.top = `${b.top - m.top}px`;
        tip.classList.add("show");
      });
      outer.addEventListener("mouseleave", () => tip.classList.remove("show"));
      outer.addEventListener("click", () => window.open(wa(fill(msgs.place, p)), "_blank", "noopener"));
      gDots.appendChild(outer);
    });

    // الدول: بنحمّل بيانات الخريطة لما يقرب القسم من الشاشة
    const load = src => new Promise((ok, no) => {
      const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s);
    });
    const near = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      try {
        if (!window.d3?.geoPath) await load("https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js").catch(() => load("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"));
        if (!window.topojson) await load("https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js");
        const world = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r => r.json());
        const geo = window.topojson.feature(world, world.objects.countries);
        const centerLat = (2 * Math.atan(Math.exp(mMid)) - Math.PI / 2) / RAD;
        const proj = window.d3.geoMercator().scale(scale).center([cLon, centerLat]).translate([W / 2, cy]);
        const path = window.d3.geoPath(proj);
        const hl = (d.highlight || []).map(s => s.toLowerCase());
        svg.querySelector(".map__land").innerHTML = geo.features.map(f => {
          const dd = path(f); if (!dd) return "";
          const name = (f.properties?.name || "").toLowerCase();
          return `<path class="country${hl.includes(name) ? " hl" : ""}" d="${dd}" pathLength="1" style="--d:${(Math.random() * .9).toFixed(2)}s"/>`;
        }).join("");
        svg.querySelector(".map__fallback").remove();
      } catch (err) {
        console.warn("ما قدرت حمّل بيانات الخريطة، رح تظهر النقاط بس", err);
      }
    }, { rootMargin: "600px 0px" });
    near.observe(el);
  }
})();
