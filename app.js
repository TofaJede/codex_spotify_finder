const API_BASE = 'https://api.spotify.com/v1';

// Assume SPOTIFY_ACCESS_TOKEN is defined globally
const token = typeof SPOTIFY_ACCESS_TOKEN !== 'undefined' ? SPOTIFY_ACCESS_TOKEN : '';

async function fetchGenres() {
  const res = await fetch(`${API_BASE}/recommendations/available-genre-seeds`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const datalist = document.getElementById('genre-list');
  data.genres.forEach((genre) => {
    const option = document.createElement('option');
    option.value = genre;
    datalist.appendChild(option);
  });
}

function initDateInputs() {
  const endInput = document.getElementById('end-date');
  const startInput = document.getElementById('start-date');
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  endInput.value = today.toISOString().split('T')[0];
  startInput.value = weekAgo.toISOString().split('T')[0];
}

async function handleSearch(e) {
  e.preventDefault();
  const genre = document.getElementById('genre-input').value.trim();
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  if (!genre) return;

  const artistsRes = await fetch(`${API_BASE}/search?q=${encodeURIComponent(`genre:"${genre}"`)}&type=artist&limit=10`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const artistsData = await artistsRes.json();
  const artists = artistsData.artists ? artistsData.artists.items : [];

  const albumPromises = artists.map(async (artist) => {
    const res = await fetch(`${API_BASE}/artists/${artist.id}/albums?include_groups=album,single&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.items.map((album) => ({ album, artist }));
  });

  const albumArrays = await Promise.all(albumPromises);
  const allAlbums = albumArrays.flat();

  const filtered = allAlbums.filter(({ album }) => {
    const releaseDate = new Date(album.release_date);
    return releaseDate >= startDate && releaseDate <= endDate;
  });

  renderResults(filtered);
}

function renderResults(items) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (items.length === 0) {
    container.textContent = 'No results found.';
    return;
  }
  items.forEach(({ album, artist }) => {
    const card = document.createElement('div');
    card.className = 'album';
    const image = album.images && album.images[0] ? album.images[0].url : '';
    card.innerHTML = `
      <img src="${image}" alt="Album cover" />
      <div class="info">
        <a href="${album.external_urls.spotify}" target="_blank" rel="noopener">${album.name}</a>
        <p>${artist.name}</p>
        <p>Released: ${album.release_date}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addEventListener('load', () => {
  initDateInputs();
  fetchGenres();
  document.getElementById('search-form').addEventListener('submit', handleSearch);
});

