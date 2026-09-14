(function () {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = year);

  // Mobile navigation that works without any framework.
  const nav = document.querySelector('.nav');
  const links = document.querySelector('.navlinks');
  if (nav && links) {
    const button = document.createElement('button');
    button.className = 'menu-toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'site-menu');
    button.textContent = 'Menu';
    links.id = 'site-menu';
    nav.insertBefore(button, links);

    button.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'Menu';
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Menu';
      });
    });
  }

  // Communities are intentionally local-only until a real database is connected.
  const form = document.getElementById('communityForm');
  const list = document.getElementById('communityList');
  const notice = document.getElementById('communityNotice');
  const key = 'agj-communities-v1';

  function readCommunities() {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch (_) { return []; }
  }
  function saveCommunities(items) {
    try { localStorage.setItem(key, JSON.stringify(items)); } catch (_) {}
  }
  function renderCommunities() {
    if (!list) return;
    const items = readCommunities();
    if (!items.length) {
      list.innerHTML = '<div class="panel"><h3>Be the first local team.</h3><p>Create a community for your neighbourhood, school, university or friends. It will be saved on this device.</p></div>';
      return;
    }
    list.innerHTML = items.map((item, index) => `
      <article class="community">
        <span class="pill">${escapeHtml(item.action)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.place)}</p>
        <button class="btn btn-ghost join-community" type="button" data-index="${index}">${item.joined ? 'Joined ✓' : 'Join'}</button>
      </article>`).join('');
    list.querySelectorAll('.join-community').forEach(btn => {
      btn.addEventListener('click', () => {
        const items = readCommunities();
        const i = Number(btn.dataset.index);
        if (!items[i]) return;
        items[i].joined = !items[i].joined;
        saveCommunities(items);
        renderCommunities();
      });
    });
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const items = readCommunities();
      items.unshift({name: data.get('name'), place: data.get('place'), action: data.get('action'), joined: false});
      saveCommunities(items.slice(0, 30));
      form.reset();
      if (notice) { notice.style.display = 'block'; notice.textContent = 'Community created on this device.'; }
      renderCommunities();
    });
    renderCommunities();
  }

  // If an external photo cannot load, keep the layout attractive rather than showing a broken icon.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.background = 'linear-gradient(135deg,#dceee2,#b9d8c3)';
      this.alt = this.alt || 'Jordan landscape';
      this.removeAttribute('src');
    }, {once:true});
  });
})();
