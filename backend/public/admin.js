const API_URL = '/api/movies';
let movies = [];

async function fetchMovies() {
  const res = await fetch(API_URL);
  movies = await res.json();
  renderTable();
}

async function fetchAnalytics() {
  const res = await fetch('/api/analytics');
  const data = await res.json();
  
  document.getElementById('stat-users').innerText = data.users.length;
  document.getElementById('stat-views').innerText = data.totalViews;
  // Assuming $0.05 per ad impression
  const revenue = (data.adImpressions * 0.05).toFixed(2);
  document.getElementById('stat-revenue').innerText = `$${revenue}`;
  
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = data.users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.playCount}</td>
      <td>${new Date(u.lastActive).toLocaleString()}</td>
    </tr>
  `).join('');
}

function switchTab(tab) {
  document.getElementById('tab-movies').classList.remove('active');
  document.getElementById('tab-analytics').classList.remove('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  document.getElementById('section-movies').style.display = 'none';
  document.getElementById('section-analytics').style.display = 'none';
  document.getElementById(`section-${tab}`).style.display = 'block';
  
  if (tab === 'analytics') {
    fetchAnalytics();
  }
}

function renderTable() {
  const tbody = document.getElementById('movie-table-body');
  tbody.innerHTML = movies.map(m => `
    <tr>
      <td>${m.id}</td>
      <td><img src="${m.posterUrl}" class="poster-img"></td>
      <td>${m.title}</td>
      <td>${m.rating}</td>
      <td>
        <button class="btn btn-secondary" onclick="editMovie(${m.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteMovie(${m.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editMovie(id) {
  const movie = movies.find(m => m.id === id);
  if (movie) openModal(movie);
}

function openModal(movie = null) {
  document.getElementById('movie-modal').classList.remove('hidden');
  if (movie) {
    document.getElementById('modal-title').innerText = 'Edit Movie';
    document.getElementById('movie-id').value = movie.id;
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-desc').value = movie.description;
    document.getElementById('movie-poster').value = movie.posterUrl;
    document.getElementById('movie-cast').value = movie.cast.join(', ');
    document.getElementById('movie-rating').value = movie.rating;
  } else {
    document.getElementById('modal-title').innerText = 'Add Movie';
    document.getElementById('movie-form').reset();
    document.getElementById('movie-id').value = '';
  }
}

function closeModal() {
  document.getElementById('movie-modal').classList.add('hidden');
}

document.getElementById('movie-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('movie-id').value;
  const payload = {
    title: document.getElementById('movie-title').value,
    description: document.getElementById('movie-desc').value,
    posterUrl: document.getElementById('movie-poster').value,
    cast: document.getElementById('movie-cast').value.split(',').map(s => s.trim()),
    rating: parseFloat(document.getElementById('movie-rating').value)
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
  
  closeModal();
  fetchMovies();
});

async function deleteMovie(id) {
  if(confirm('Are you sure you want to delete this movie?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchMovies();
  }
}

fetchMovies();
