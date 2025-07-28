async function fetchIndex() {
  const res = await fetch('search-index.json');
  return await res.json();
}

function renderResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
    return;
  }
  results.forEach(item => {
    const card = document.createElement('a');
    card.className = 'result-card';
    card.href = item.url;
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
      <div class="result-content">
        <div class="result-title">${item.title}</div>
        <div class="result-category">Kategori: ${item.category}</div>
        <div class="result-description">${item.description}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

async function initSearch() {
  const data = await fetchIndex();
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const urlParams = new URLSearchParams(window.location.search);
  const defaultQuery = urlParams.get('q') || '';

  const fuse = new Fuse(data, {
    keys: ['title', 'description', 'category'],
    includeScore: false,
    threshold: 0.4,
  });

  searchInput.value = defaultQuery;

  function filterAndRender() {
    const query = searchInput.value.trim();
    const category = categoryFilter.value;
    let results = query ? fuse.search(query).map(r => r.item) : data;
    if (category !== 'all') {
      results = results.filter(item => item.category === category);
    }
    renderResults(results);
  }

  searchInput.addEventListener('input', filterAndRender);
  categoryFilter.addEventListener('change', filterAndRender);

  filterAndRender();
}

initSearch();
