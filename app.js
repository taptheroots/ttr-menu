const container = document.getElementById('menu-container');
const nav = document.getElementById('cat-nav');
const landingScreen = document.getElementById('landing-screen');

// ── Render a single menu card ────────────────────────────────────
function renderCard(item, layout = 'horizontal') {
    const imgSrc = item.img
        ? item.img
        : 'https://via.placeholder.com/150?text=Food';

    if (layout === 'vertical') {
        return `
            <div class="menu-card menu-card--vertical">
                <img src="${imgSrc}" class="item-img--vertical" alt="${item.name}"
                     onerror="this.src='https://via.placeholder.com/400x200?text=Food'"
                     loading="lazy">
                <div class="item-info">
                    <div class="item-header">
                        <p class="item-name">${item.name}</p>
                        <span class="item-price">₹${item.price}</span>
                    </div>
                    <p class="item-desc">${item.desc}</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="menu-card">
            <div class="item-info">
                <div class="item-header">
                    <p class="item-name">${item.name}</p>
                    <span class="item-price">₹${item.price}</span>
                </div>
                <p class="item-desc">${item.desc}</p>
            </div>
            <img src="${imgSrc}" class="item-img" alt="${item.name}"
                 onerror="this.style.display='none'"
                 loading="lazy">
        </div>
    `;
}

// ── Render Step 2+ options block ─────────────────────────────────
function renderRemainingSteps(steps) {
    let html = `<div class="bowl-steps" style="margin-top: 10px;">`;
    steps.forEach(step => {
        html += `
            <div class="step-block">
                <div class="step-header">
                    <span class="step-number">${step.number}</span>
                    <span class="step-title">${step.title}</span>
                </div>
        `;
        if (step.options) {
            html += `<div class="step-options">`;
            step.options.forEach(opt => {
                html += `
                    <div class="step-option">
                        <span class="opt-name">${opt.name}</span>
                        <span class="opt-desc">${opt.desc}</span>
                    </div>
                `;
            });
            html += `</div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    return html;
}

// ── Render items ─────────────────────────────────────────────────
function renderItems(cat, items, layout = 'horizontal') {
    let html = '';
    items.forEach(item => {
        html += renderCard(item, layout);
    });
    return html;
}

// ── Build full menu for a given section id ───────────────────────
function buildMenu(sectionId) {
    container.innerHTML = '';
    nav.innerHTML = '';

    const filteredItems = menuData.filter(item => item.section === sectionId);
    const grouped = filteredItems.reduce((acc, item) => {
        (acc[item.cat] = acc[item.cat] || []).push(item);
        return acc;
    }, {});

    Object.keys(grouped).forEach((cat, index) => {
        const navId = `cat-${index}`;

        // Nav pill
        const navLink = document.createElement('a');
        navLink.href = `#${navId}`;
        navLink.innerText = cat;
        if (index === 0) navLink.classList.add('active');
        nav.appendChild(navLink);

        // Section
        const section = document.createElement('section');
        section.id = navId;
        section.className = 'category-section';

        // Hero image with overlay OR plain h2
        if (categoryHeroImages[cat]) {
            section.innerHTML = `
                <div class="category-hero">
                    <img src="${categoryHeroImages[cat]}" alt="${cat}"
                         onerror="this.style.display='none'">
                    <div class="hero-title">${cat}</div>
                </div>
            `;
        } else {
            section.innerHTML = `<h2>${cat}</h2>`;
        }

        // Bowl steps + vertical cards OR regular horizontal cards
        // Bowl steps + vertical cards OR regular horizontal cards
        if (categorySteps[cat]) {
            const stepsData = categorySteps[cat];

            // ✅ Note ABOVE steps for bowl categories
            if (categoryNotes[cat]) {
                section.innerHTML += `<div class="footer-note">${categoryNotes[cat]}</div>`;
            }

            section.innerHTML += `
        <div class="bowl-steps">
            <p class="bowl-intro">${stepsData.intro}</p>
            <div class="step-block">
                <div class="step-header">
                    <span class="step-number">${stepsData.steps[0].number}</span>
                    <span class="step-title">${stepsData.steps[0].title}</span>
                </div>
            </div>
        </div>
    `;
            section.innerHTML += renderItems(cat, grouped[cat], 'vertical');
            section.innerHTML += renderRemainingSteps(stepsData.steps.slice(1));

        } else {
            // ✅ Note ABOVE items for all other categories
            if (categoryNotes[cat]) {
                section.innerHTML += `<div class="footer-note">${categoryNotes[cat]}</div>`;
            }
            section.innerHTML += renderItems(cat, grouped[cat], 'horizontal');
        }

        container.appendChild(section);


        container.appendChild(section);

    });

    adjustLayout();
}

// ── Show landing screen ──────────────────────────────────────────
function showLanding() {
    landingScreen.style.display = 'block';
    container.style.display = 'none';
    nav.style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    window.scrollTo({ top: 0 });
}

function showMenu(sectionId) {
    landingScreen.style.display = 'none';
    container.style.display = 'block';
    nav.style.display = 'flex';
    document.getElementById('back-btn').style.display = 'flex';
    buildMenu(sectionId);
    window.scrollTo({ top: 0 });
}

// ── Build landing cards ──────────────────────────────────────────
sections.forEach(sec => {
    const card = document.createElement('div');
    card.className = 'landing-card';
    card.innerHTML = `
        <img src="${sec.image}" alt="${sec.label}"
             onerror="this.style.display='none'">
        <div class="landing-card-body">
            <span class="landing-emoji">${sec.emoji}</span>
            <h3>${sec.label}</h3>
            <p>${sec.desc}</p>
        </div>
    `;
    card.addEventListener('click', () => showMenu(sec.id));
    landingScreen.appendChild(card);
});

// ── Back button ──────────────────────────────────────────────────
document.getElementById('back-btn').addEventListener('click', showLanding);

// ── Layout adjustment ────────────────────────────────────────────
function adjustLayout() {
    const header = document.querySelector('header');
    const totalOffset = header.offsetHeight + nav.offsetHeight;

    nav.style.top = header.offsetHeight + 'px';

    landingScreen.style.paddingTop = (header.offsetHeight + 15) + 'px';
    container.style.paddingTop = (totalOffset + 15) + 'px';

    document.querySelectorAll('.category-section').forEach(s => {
        s.style.scrollMarginTop = (totalOffset + 10) + 'px';
    });
}

window.addEventListener('load', () => { adjustLayout(); showLanding(); });
window.addEventListener('resize', adjustLayout);

// ── Helper: scroll nav to active pill ───────────────────────────
function scrollNavToActive(activeLink) {
    if (!activeLink) return;
    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// ── Nav click handler ────────────────────────────────────────────
let clickedLinkId = null;
let clickCooldown = null;

nav.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    scrollNavToActive(link);
    clickedLinkId = link.getAttribute('href').replace('#', '');
    if (clickCooldown) clearTimeout(clickCooldown);
    clickCooldown = setTimeout(() => { clickedLinkId = null; }, 800);
});

// ── Debounced scroll spy ─────────────────────────────────────────
let scrollTimer = null;

window.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        if (clickedLinkId) return;
        const offset = document.querySelector('header').offsetHeight + nav.offsetHeight + 10;
        let current = "";
        document.querySelectorAll('.category-section').forEach(section => {
            if (pageYOffset >= section.offsetTop - offset) current = section.getAttribute('id');
        });
        if (current) {
            let activeLink = null;
            document.querySelectorAll('nav a').forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${current}`) {
                    a.classList.add('active');
                    activeLink = a;
                }
            });
            scrollNavToActive(activeLink);
        }
    }, 150);
});

// ── Unregister service worker ────────────────────────────────────
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
    });
}
