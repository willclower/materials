// Catalog renderer
(function(){
  const data = window.CATALOG;
  const flat = []; // ordered list of pages [{type, ...}]
  let pageNo = 0;

  // Build page list with page numbers
  flat.push({ type:"cover", pageNo: ++pageNo });
  flat.push({ type:"toc", pageNo: ++pageNo });

  // Track each category's start page so TOC + index can link
  const categoryPages = {};
  const indexEntries = []; // {title, category, page}

  for (let ci = 0; ci < data.categories.length; ci++){
    const cat = data.categories[ci];
    const dividerPage = ++pageNo;
    flat.push({ type:"divider", category: cat, catIdx: ci, pageNo: dividerPage });
    categoryPages[cat.id] = { dividerPage, challenges: [] };

    // group into pages of 3
    for (let i = 0; i < cat.challenges.length; i += 3){
      const group = cat.challenges.slice(i, i+3);
      // Cycle images so every challenge has one (no gaps)
      const imgs = group.map((_, j) => {
        const arr = cat.images || [];
        if (!arr.length) return '';
        return arr[(i + j) % arr.length];
      });
      const p = ++pageNo;
      flat.push({ type:"challenge", category: cat, group, imgs, pageNo: p });
      group.forEach(ch => {
        categoryPages[cat.id].challenges.push({ title: ch.title, page: p });
        indexEntries.push({ title: ch.title, category: cat.name, page: p });
      });
    }
  }

  flat.push({ type:"index", pageNo: ++pageNo });
  flat.push({ type:"backCover", pageNo: ++pageNo });
  const totalPages = pageNo;

  // ===== Render helpers =====
  const crossSVG = `<svg viewBox="0 0 64 64">
    <g fill="#ed8b00">
      <rect x="26" y="4" width="12" height="56" rx="1"/>
      <rect x="4" y="26" width="56" height="12" rx="1"/>
    </g>
    <g fill="#236192">
      <rect x="30" y="8" width="4" height="48"/>
      <rect x="8" y="30" width="48" height="4"/>
    </g>
  </svg>`;

  const hexArtSVG = `<svg viewBox="0 0 720 720" aria-hidden="true">
    <defs>
      <pattern id="hexpat-${Math.random().toString(36).slice(2,7)}" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
        <polygon points="60,4 116,36 116,100 60,132 4,100 4,36" fill="none" stroke="#fff" stroke-width="1.2"/>
      </pattern>
    </defs>
    <rect width="720" height="720" fill="url(#hexpat-${Math.random().toString(36).slice(2,7)})"/>
  </svg>`;

  // Use static IDs to avoid attr collisions
  function makeHexArt(){
    const id = 'hp-' + Math.random().toString(36).slice(2,8);
    return `<svg viewBox="0 0 720 720" aria-hidden="true">
      <defs>
        <pattern id="${id}" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
          <polygon points="60,4 116,36 116,100 60,132 4,100 4,36" fill="none" stroke="#fff" stroke-width="1.2"/>
        </pattern>
      </defs>
      <rect width="720" height="720" fill="url(#${id})"/>
    </svg>`;
  }

  function renderCover(p){
    return `<div class="page cover">
      ${makeHexArtAbsolute('cover__hex-art')}
      <div class="cover__cross" aria-hidden="true">${crossSVG}</div>
      <div class="cover__year">${data.meta.year}</div>
      <div class="cover__center">
        <div class="cover__eyebrow">CHALLENGES PROGRAM</div>
        <h1 class="cover__title">Program<br/><span class="accent">Catalog</span></h1>
        <p class="cover__subtitle">A complete library of wellness challenges designed to help your workforce build healthier habits — across fitness, nutrition, weight management, and mindfulness.</p>
        <div class="cover__rule"></div>
      </div>
      <div class="cover__bottom">
        <div class="cover__edition">${data.meta.edition}</div>
        <div class="cover__count">
          <div class="num">${indexEntries.length}</div>
          <div class="lbl">CHALLENGES INSIDE</div>
        </div>
      </div>
      <div class="cover__logo-band">
        <img src="assets/concentra-logo.png" alt="Concentra" />
        <div class="tagline">CHALLENGES PROGRAM CATALOG</div>
      </div>
    </div>`;
  }

  function makeHexArtAbsolute(cls){
    const id = 'hp-' + Math.random().toString(36).slice(2,8);
    return `<svg class="${cls}" viewBox="0 0 720 720" aria-hidden="true">
      <defs>
        <pattern id="${id}" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
          <polygon points="60,4 116,36 116,100 60,132 4,100 4,36" fill="none" stroke="#fff" stroke-width="1.2"/>
        </pattern>
      </defs>
      <rect width="720" height="720" fill="url(#${id})"/>
    </svg>`;
  }

  function renderToc(){
    const items = data.categories.map((cat, idx) => {
      const cp = categoryPages[cat.id];
      const lis = cat.challenges.map(ch => {
        const page = cp.challenges.find(c => c.title === ch.title)?.page || cp.dividerPage;
        return `<li>
          <span class="name">${ch.title}</span>
          <span class="dot-leader"></span>
          <span class="pg">${page}</span>
        </li>`;
      }).join("");
      return `<div class="toc-cat">
        <div class="toc-cat__head">
          <div class="toc-cat__name">${cat.name}</div>
          <div class="toc-cat__num">CATEGORY 0${idx+1} · PAGE ${cp.dividerPage}</div>
        </div>
        <ul class="toc-cat__list">${lis}</ul>
      </div>`;
    }).join("");

    return `<div class="page toc">
      <div class="toc__eyebrow">CONTENTS</div>
      <h2 class="toc__title">What's Inside</h2>
      <div class="toc__rule"></div>
      <div class="toc__cats">${items}</div>
    </div>`;
  }

  function renderDivider(p){
    const cat = p.category;
    const cp = categoryPages[cat.id];
    const lastChallengePage = cp.challenges[cp.challenges.length-1]?.page || cp.dividerPage;
    const imgMain = cat.images[0] || "";
    const imgSm1 = cat.images[1] || cat.images[0] || "";
    const imgSm2 = cat.images[2] || cat.images[0] || "";
    return `<div class="page divider">
      <div class="divider__left">
        <div class="divider__cat-num">CATEGORY 0${p.catIdx+1} / 0${data.categories.length}</div>
        <h2 class="divider__title">${cat.name}</h2>
        <div class="divider__rule"></div>
        <p class="divider__intro">${cat.blurb}</p>
        <div class="divider__count">${cat.challenges.length} CHALLENGES · PAGES ${cp.dividerPage+1}–${lastChallengePage}</div>
      </div>
      <div class="divider__right hex-pat-bg">
        <div class="divider__hex-stack">
          <div class="hex divider__hex-main" style="background-image:url('${imgMain}')"></div>
          <div class="hex divider__hex-sm1" style="background-image:url('${imgSm1}')"></div>
          <div class="hex divider__hex-sm2" style="background-image:url('${imgSm2}')"></div>
          <div class="hex divider__hex-orange"></div>
        </div>
      </div>
    </div>`;
  }

  function renderChallengePage(p){
    const cat = p.category;
    const hexes = p.imgs.map(src => `
      <div class="rail__hex-orange-frame-wrap">
        <div class="rail__hex--orange-frame"></div>
        <div class="rail__hex" style="background-image:url('${src}')"></div>
      </div>`).join("");

    const items = p.group.map(ch => `
      <article class="ch">
        <div class="ch__body">
          <div class="ch__chip"><span class="dot"></span> ${ch.chip}</div>
          <h3 class="ch__title">${ch.title}</h3>
          <p class="ch__desc">${ch.desc}</p>
          <div class="ch__meta">
            <div class="meta-item"><div class="lbl">Length</div><div class="val">${ch.length}</div></div>
            <div class="meta-item"><div class="lbl">Tracking</div><div class="val">${ch.tracking}</div></div>
          </div>
        </div>
      </article>`).join("");

    return `<div class="page challenge-page">
      <aside class="challenge-page__rail">
        <div class="rail__header">
          <div class="rail__cat">${cat.name.toUpperCase()}</div>
          <div class="rail__pageno">P. ${String(p.pageNo).padStart(2,"0")} / ${String(totalPages).padStart(2,"0")}</div>
        </div>
        <div class="rail__hexes">${hexes}</div>
      </aside>
      <section class="challenge-page__main">
        <div class="main__top">
          <div class="main__cat-tag">${cat.name.toUpperCase()} · CONTINUED</div>
          <div class="main__brand">CONCENTRA · CHALLENGES</div>
        </div>
        <div class="ch-list">${items}</div>
        <div class="page__footer">
          <div class="ft-left">CONCENTRA · CHALLENGES PROGRAM CATALOG</div>
          <div class="ft-right">${cat.name.toUpperCase()} · ${String(p.pageNo).padStart(2,"0")}</div>
        </div>
      </section>
    </div>`;
  }

  function renderIndex(){
    const sorted = [...indexEntries].sort((a,b) => a.title.localeCompare(b.title));
    const items = sorted.map(e => `<li>
      <span class="cat">${e.category.toUpperCase()}</span>
      <span class="name">${e.title}</span>
      <span class="pg">${e.page}</span>
    </li>`).join("");
    return `<div class="page index-page">
      <div class="toc__eyebrow">A–Z INDEX</div>
      <h2 class="toc__title">All Challenges</h2>
      <div class="toc__rule"></div>
      <ul class="index-list">${items}</ul>
    </div>`;
  }

  function renderBackCover(){
    return `<div class="page back-cover">
      ${makeHexArtAbsolute('back-cover__hex-art')}
      <div class="back-cover__cross" aria-hidden="true">${crossSVG}</div>
      <div class="back-cover__center">
        <div class="back-cover__eyebrow">PARTNER WITH CONCENTRA</div>
        <h2 class="back-cover__title">Ready to bring this<br/>to your workforce?</h2>
        <div class="back-cover__rule"></div>
        <p class="back-cover__body">Our challenges program plugs into your existing wellness benefits with regional account-manager support — so launching a new challenge is a conversation, not a project.</p>
        <div class="back-cover__contact">
          <div class="bc-item"><div class="lbl">CONNECT</div><div class="val">concentra.com</div></div>
          <div class="bc-item"><div class="lbl">EMAIL</div><div class="val">challenges@concentra.com</div></div>
          <div class="bc-item"><div class="lbl">ACCOUNT MANAGEMENT</div><div class="val">Contact your regional<br/>account manager</div></div>
          <div class="bc-item"><div class="lbl">EDITION</div><div class="val">${data.meta.edition}</div></div>
        </div>
      </div>
      <div class="back-cover__logo-band">
        <img src="assets/concentra-logo.png" alt="Concentra" />
        <div class="tagline">CHALLENGES PROGRAM CATALOG</div>
      </div>
    </div>`;
  }

  // ===== Mount =====
  const stack = document.getElementById('stack');
  const flipbook = document.getElementById('flipbook');
  const allHTML = flat.map(p => {
    if (p.type === 'cover') return renderCover(p);
    if (p.type === 'toc') return renderToc(p);
    if (p.type === 'divider') return renderDivider(p);
    if (p.type === 'challenge') return renderChallengePage(p);
    if (p.type === 'index') return renderIndex(p);
    if (p.type === 'backCover') return renderBackCover(p);
    return '';
  });

  // Insert before flipbook node
  allHTML.forEach(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    stack.insertBefore(tmp.firstElementChild, flipbook);
  });

  // Update meta
  document.getElementById('meta').textContent =
    `VERSION 26 · ${totalPages} PAGES · ${indexEntries.length} CHALLENGES`;

  // ===== Mode switching =====
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  function setMode(mode){
    document.body.dataset.mode = mode;
    modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    if (mode === 'flipbook') buildFlipbook();
    fitFlipbook();
  }

  // ===== Flipbook =====
  let fbCurrent = 0; // current spread index (0 = pages 1-2)
  function buildFlipbook(){
    if (flipbook.dataset.built) return;
    // Clone pages into flipbook
    const pages = stack.querySelectorAll(':scope > .page');
    pages.forEach((p, i) => {
      const clone = p.cloneNode(true);
      const wrapper = document.createElement('div');
      wrapper.className = 'fb-page ' + (i % 2 === 0 ? 'left' : 'right');
      wrapper.dataset.idx = i;
      wrapper.appendChild(clone);
      flipbook.appendChild(wrapper);
    });

    // Controls
    const controls = document.createElement('div');
    controls.className = 'fb-controls';
    controls.innerHTML = `
      <button class="fb-arrow" id="fbPrev" aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="fb-progress"><strong id="fbCur">1</strong> / <span id="fbTot">${totalPages}</span></div>
      <button class="fb-arrow" id="fbNext" aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>`;
    flipbook.appendChild(controls);

    document.getElementById('fbPrev').addEventListener('click', () => flipPrev());
    document.getElementById('fbNext').addEventListener('click', () => flipNext());

    document.addEventListener('keydown', (e) => {
      if (document.body.dataset.mode !== 'flipbook') return;
      if (e.key === 'ArrowRight') flipNext();
      else if (e.key === 'ArrowLeft') flipPrev();
    });

    flipbook.dataset.built = "1";
    updateFlipbook();
  }

  function flipNext(){
    if (fbCurrent >= totalPages - 1) return;
    fbCurrent = Math.min(fbCurrent + 2, totalPages - 1);
    updateFlipbook();
  }
  function flipPrev(){
    if (fbCurrent <= 0) return;
    fbCurrent = Math.max(fbCurrent - 2, 0);
    updateFlipbook();
  }
  function updateFlipbook(){
    // Show current pair: fbCurrent (left) and fbCurrent+1 (right)
    const pages = flipbook.querySelectorAll('.fb-page');
    pages.forEach((el) => {
      const idx = parseInt(el.dataset.idx, 10);
      el.style.display = (idx === fbCurrent || idx === fbCurrent+1) ? 'block' : 'none';
      el.classList.remove('flipped');
      // Position
      el.classList.toggle('left', idx === fbCurrent);
      el.classList.toggle('right', idx === fbCurrent+1);
      el.style.transform = '';
    });
    const curEl = document.getElementById('fbCur');
    if (curEl) curEl.textContent = (fbCurrent+1) + (fbCurrent+2 <= totalPages ? '–' + (fbCurrent+2) : '');
  }

  // ===== Fit flipbook to viewport =====
  function fitFlipbook(){
    if (document.body.dataset.mode !== 'flipbook') {
      flipbook.style.transform = '';
      return;
    }
    const availW = window.innerWidth - 80;
    const availH = window.innerHeight - 56 - 120;
    const scale = Math.min(availW / 1632, availH / 1056, 1);
    flipbook.style.transform = `translate(-50%, -50%) scale(${scale})`;
    flipbook.style.position = 'absolute';
    flipbook.style.left = '50%';
    flipbook.style.top = '50%';
  }
  window.addEventListener('resize', fitFlipbook);

  // ===== Print =====
  document.getElementById('printBtn').addEventListener('click', () => {
    // Always print in paged mode
    const wasMode = document.body.dataset.mode;
    setMode('paged');
    setTimeout(() => {
      window.print();
      if (wasMode !== 'paged') setTimeout(() => setMode(wasMode), 500);
    }, 200);
  });

})();
