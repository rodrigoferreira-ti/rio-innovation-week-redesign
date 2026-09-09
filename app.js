/* ==========================================================================
   RIO INNOVATION WEEK - JAVASCRIPT APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let allEvents = [];
  let filteredEvents = [];
  let favorites = new Set(JSON.parse(localStorage.getItem('riw_favorites') || '[]'));
  
  let currentDay = 'ALL'; // 'ALL' or specific date string '04/08/2026'
  let showOnlyFavorites = false;
  let page = 1;
  const itemsPerPage = 24;

  // DOM Elements
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const dayTabsContainer = document.getElementById('dayTabs');
  const categoryFilter = document.getElementById('categoryFilter');
  const subcategoryFilter = document.getElementById('subcategoryFilter');
  const locationFilter = document.getElementById('locationFilter');
  const timePeriodFilter = document.getElementById('timePeriodFilter');
  const resetFiltersBtn = document.getElementById('resetFilters');
  const favAgendaBtn = document.getElementById('favAgendaBtn');
  
  const eventsGrid = document.getElementById('eventsGrid');
  const resultsCount = document.getElementById('resultsCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  const emptyState = document.getElementById('emptyState');
  
  // Modal Elements
  const eventModal = document.getElementById('eventModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalSubcategory = document.getElementById('modalSubcategory');
  const modalDate = document.getElementById('modalDate');
  const modalTime = document.getElementById('modalTime');
  const modalLocation = document.getElementById('modalLocation');
  const modalDescription = document.getElementById('modalDescription');
  const modalSpeakersList = document.getElementById('modalSpeakersList');
  const modalStarBtn = document.getElementById('modalStarBtn');

  // Days of week dictionary in PT-BR
  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const daysOfWeekShort = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  // Helper: Parse Date String (DD/MM/YYYY) to Date Object & Weekday
  function getWeekdayInfo(dateStr) {
    if (!dateStr) return { short: '', full: '' };
    const parts = dateStr.split('/');
    if (parts.length !== 3) return { short: '', full: '' };
    
    // YYYY, MM-1, DD
    const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const dayIdx = dateObj.getDay();
    return {
      short: daysOfWeekShort[dayIdx] || '',
      full: daysOfWeek[dayIdx] || ''
    };
  }

  // Initialize App
  async function init() {
    try {
      if (window.RIW_EVENTS_DATA && Array.isArray(window.RIW_EVENTS_DATA)) {
        allEvents = window.RIW_EVENTS_DATA;
      } else {
        const response = await fetch('eventos_rio_innovation_week.json');
        if (!response.ok) throw new Error('Não foi possível carregar o arquivo JSON de eventos.');
        allEvents = await response.json();
      }

      updateAllFilterDropdowns();
      renderDayTabs();
      applyFilters();
      setupEventListeners();
    } catch (err) {
      console.error('Erro na inicialização:', err);
      eventsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3 class="empty-title">Erro ao carregar a programação</h3>
          <p class="empty-desc">${err.message}</p>
        </div>
      `;
    }
  }

  // Helper to filter events ignoring a specific filter key (so options in that dropdown don't hide themselves)
  function getMatchingEventsExcept(excludeKey) {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = categoryFilter ? categoryFilter.value : 'ALL';
    const subcat = subcategoryFilter ? subcategoryFilter.value : 'ALL';
    const loc = locationFilter ? locationFilter.value : 'ALL';
    const timePeriod = timePeriodFilter ? timePeriodFilter.value : 'ALL';

    return allEvents.filter(evt => {
      if (excludeKey !== 'DAY' && currentDay !== 'ALL' && evt.Data !== currentDay) return false;
      if (excludeKey !== 'FAVORITES' && showOnlyFavorites && !favorites.has(evt.ID)) return false;
      if (excludeKey !== 'CATEGORY' && cat !== 'ALL' && evt.Categoria !== cat) return false;
      if (excludeKey !== 'SUBCATEGORY' && subcat !== 'ALL' && evt.Subcategoria !== subcat) return false;
      if (excludeKey !== 'LOCATION' && loc !== 'ALL' && evt.Local !== loc) return false;

      if (excludeKey !== 'TIME' && timePeriod !== 'ALL' && evt.Horário) {
        const startHour = parseInt(evt.Horário.split(':')[0], 10);
        if (!isNaN(startHour)) {
          if (timePeriod === 'MORNING' && startHour >= 12) return false;
          if (timePeriod === 'AFTERNOON' && (startHour < 12 || startHour >= 18)) return false;
          if (timePeriod === 'NIGHT' && startHour < 18) return false;
        }
      }

      if (excludeKey !== 'SEARCH' && query) {
        const titleMatch = evt.Título && evt.Título.toLowerCase().includes(query);
        const descMatch = evt.Descrição && evt.Descrição.toLowerCase().includes(query);
        const speakerMatch = evt.Palestrantes && evt.Palestrantes.toLowerCase().includes(query);
        const locMatch = evt.Local && evt.Local.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !speakerMatch && !locMatch) return false;
      }

      return true;
    });
  }

  // Dynamically update all filter dropdowns so only valid options remain
  function updateAllFilterDropdowns() {
    // 1. Update Categories Dropdown
    const currentCat = categoryFilter.value;
    const catEvents = getMatchingEventsExcept('CATEGORY');
    const validCats = new Set();
    catEvents.forEach(e => { if (e.Categoria) validCats.add(e.Categoria.trim()); });
    
    categoryFilter.innerHTML = '<option value="ALL">Todas as Categorias</option>';
    [...validCats].sort().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categoryFilter.appendChild(opt);
    });
    if (validCats.has(currentCat)) categoryFilter.value = currentCat;
    else categoryFilter.value = 'ALL';

    // 2. Update Subcategories Dropdown
    const currentSub = subcategoryFilter.value;
    const subcatEvents = getMatchingEventsExcept('SUBCATEGORY');
    const validSubcats = new Set();
    subcatEvents.forEach(e => { if (e.Subcategoria) validSubcats.add(e.Subcategoria.trim()); });

    subcategoryFilter.innerHTML = '<option value="ALL">Todas as Subcategorias</option>';
    [...validSubcats].sort().forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      subcategoryFilter.appendChild(opt);
    });
    if (validSubcats.has(currentSub)) subcategoryFilter.value = currentSub;
    else subcategoryFilter.value = 'ALL';

    // 3. Update Locations Dropdown
    const currentLoc = locationFilter.value;
    const locEvents = getMatchingEventsExcept('LOCATION');
    const validLocs = new Set();
    locEvents.forEach(e => { if (e.Local) validLocs.add(e.Local.trim()); });

    locationFilter.innerHTML = '<option value="ALL">Todos os Locais & Palcos</option>';
    [...validLocs].sort().forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      locationFilter.appendChild(opt);
    });
    if (validLocs.has(currentLoc)) locationFilter.value = currentLoc;
    else locationFilter.value = 'ALL';

    // 4. Update Time Periods Dropdown
    const currentTime = timePeriodFilter.value;
    const timeEvents = getMatchingEventsExcept('TIME');
    let hasMorning = false, hasAfternoon = false, hasNight = false;
    timeEvents.forEach(e => {
      if (e.Horário) {
        const h = parseInt(e.Horário.split(':')[0], 10);
        if (!isNaN(h)) {
          if (h < 12) hasMorning = true;
          else if (h >= 12 && h < 18) hasAfternoon = true;
          else if (h >= 18) hasNight = true;
        }
      }
    });

    timePeriodFilter.innerHTML = '<option value="ALL">Todos os Horários</option>';
    if (hasMorning) {
      const opt = document.createElement('option');
      opt.value = 'MORNING';
      opt.textContent = 'Manhã (Até 12:00)';
      timePeriodFilter.appendChild(opt);
    }
    if (hasAfternoon) {
      const opt = document.createElement('option');
      opt.value = 'AFTERNOON';
      opt.textContent = 'Tarde (12:00 às 18:00)';
      timePeriodFilter.appendChild(opt);
    }
    if (hasNight) {
      const opt = document.createElement('option');
      opt.value = 'NIGHT';
      opt.textContent = 'Noite (Após 18:00)';
      timePeriodFilter.appendChild(opt);
    }
    if ((currentTime === 'MORNING' && hasMorning) || 
        (currentTime === 'AFTERNOON' && hasAfternoon) || 
        (currentTime === 'NIGHT' && hasNight)) {
      timePeriodFilter.value = currentTime;
    } else {
      timePeriodFilter.value = 'ALL';
    }
  }

  // Render Calendar Day Tabs Bar
  function renderDayTabs() {
    const uniqueDates = [...new Set(allEvents.map(e => e.Data))].filter(Boolean).sort((a, b) => {
      const [d1, m1, y1] = a.split('/').map(Number);
      const [d2, m2, y2] = b.split('/').map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    dayTabsContainer.innerHTML = '';

    // "Todos os Dias" Tab
    const allTab = document.createElement('button');
    allTab.className = `day-tab ${currentDay === 'ALL' ? 'active' : ''}`;
    allTab.innerHTML = `
      <span class="week-day">COMPLETO</span>
      <span class="date-num">Todos os Dias</span>
    `;
    allTab.addEventListener('click', () => selectDay('ALL'));
    dayTabsContainer.appendChild(allTab);

    // Date Specific Tabs
    uniqueDates.forEach(dateStr => {
      const { short: weekShort, full: weekFull } = getWeekdayInfo(dateStr);
      const tab = document.createElement('button');
      tab.className = `day-tab ${currentDay === dateStr ? 'active' : ''}`;
      tab.setAttribute('title', `${weekFull}, ${dateStr}`);
      
      tab.innerHTML = `
        <span class="week-day">${weekShort}</span>
        <span class="date-num">${dateStr.substring(0, 5)}</span>
      `;
      tab.addEventListener('click', () => selectDay(dateStr));
      dayTabsContainer.appendChild(tab);
    });
  }

  function selectDay(dayStr) {
    currentDay = dayStr;
    renderDayTabs();
    applyFilters();
  }

  // Filter Logic
  function applyFilters() {
    updateAllFilterDropdowns();

    const query = searchInput.value.toLowerCase().trim();
    const cat = categoryFilter.value;
    const subcat = subcategoryFilter.value;
    const loc = locationFilter.value;
    const timePeriod = timePeriodFilter.value;

    filteredEvents = allEvents.filter(evt => {
      // 1. Day Filter
      if (currentDay !== 'ALL' && evt.Data !== currentDay) return false;

      // 2. Favorites Filter
      if (showOnlyFavorites && !favorites.has(evt.ID)) return false;

      // 3. Category Filter
      if (cat !== 'ALL' && evt.Categoria !== cat) return false;

      // 4. Subcategory Filter
      if (subcat !== 'ALL' && evt.Subcategoria !== subcat) return false;

      // 5. Location Filter
      if (loc !== 'ALL' && evt.Local !== loc) return false;

      // 6. Time Period Filter (Manhã, Tarde, Noite)
      if (timePeriod !== 'ALL' && evt.Horário) {
        const startHour = parseInt(evt.Horário.split(':')[0], 10);
        if (!isNaN(startHour)) {
          if (timePeriod === 'MORNING' && startHour >= 12) return false;
          if (timePeriod === 'AFTERNOON' && (startHour < 12 || startHour >= 18)) return false;
          if (timePeriod === 'NIGHT' && startHour < 18) return false;
        }
      }

      // 7. Text Search Filter
      if (query) {
        const titleMatch = evt.Título && evt.Título.toLowerCase().includes(query);
        const descMatch = evt.Descrição && evt.Descrição.toLowerCase().includes(query);
        const speakerMatch = evt.Palestrantes && evt.Palestrantes.toLowerCase().includes(query);
        const locMatch = evt.Local && evt.Local.toLowerCase().includes(query);
        
        if (!titleMatch && !descMatch && !speakerMatch && !locMatch) return false;
      }

      return true;
    });

    // Reset pagination to first page and render
    page = 1;
    renderEvents();
  }

  // Render Events Grid
  function renderEvents() {
    const totalCount = filteredEvents.length;
    resultsCount.innerHTML = `Exibindo <strong>${totalCount}</strong> eventos encontrados`;

    if (totalCount === 0) {
      eventsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      loadMoreContainer.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';

    const visibleItems = filteredEvents.slice(0, page * itemsPerPage);
    eventsGrid.innerHTML = visibleItems.map(evt => createEventCardHTML(evt)).join('');

    // Toggle Load More button
    if (visibleItems.length < totalCount) {
      loadMoreContainer.style.display = 'flex';
    } else {
      loadMoreContainer.style.display = 'none';
    }

    // Attach card event listeners (star favorites and detail view)
    attachCardEvents();
  }

  // Create Card HTML
  function createEventCardHTML(evt) {
    const isStarred = favorites.has(evt.ID);
    const { full: weekFull } = getWeekdayInfo(evt.Data);
    
    // Parse speakers into clean preview
    const speakersArr = evt.Palestrantes 
      ? evt.Palestrantes.split('|').map(s => s.trim()).filter(Boolean)
      : [];

    const speakersHTML = speakersArr.slice(0, 2).map(spk => `
      <div class="speaker-item">👤 ${spk}</div>
    `).join('');

    const moreSpeakersText = speakersArr.length > 2 
      ? `<div style="font-size:0.75rem; color:var(--accent-cyan); margin-top:0.25rem;">+${speakersArr.length - 2} outro(s) palestrante(s)</div>` 
      : '';

    return `
      <div class="event-card" data-id="${evt.ID}">
        <div>
          <div class="card-badges">
            <div class="badge-group">
              ${evt.Categoria ? `<span class="badge-cat">${evt.Categoria}</span>` : ''}
              ${evt.Subcategoria ? `<span class="badge-subcat">${evt.Subcategoria}</span>` : ''}
            </div>
            <button class="btn-star ${isStarred ? 'starred' : ''}" data-id="${evt.ID}" title="Favoritar evento">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          </div>

          <h3 class="card-title">${evt.Título || 'Sem Título'}</h3>

          <div class="card-meta">
            <div class="meta-row">
              <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${weekFull ? weekFull + ', ' : ''}${evt.Data || ''} (${evt.Horário || 'Horário não especificado'})</span>
            </div>

            <div class="meta-row">
              <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${evt.Local || 'Local a definir'}</span>
            </div>
          </div>

          ${speakersArr.length > 0 ? `
            <div class="speakers-preview">
              <div class="speakers-label">Palestrante(s)</div>
              <div class="speakers-list">
                ${speakersHTML}
                ${moreSpeakersText}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="card-footer">
          <button class="btn-details" data-id="${evt.ID}">
            Ver Detalhes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  // Attach card event listeners
  function attachCardEvents() {
    // Star Favorite Buttons
    document.querySelectorAll('.btn-star').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        toggleFavorite(id);
      });
    });

    // Detail Buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openModal(id);
      });
    });
  }

  // Toggle Favorite State
  function toggleFavorite(id) {
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    localStorage.setItem('riw_favorites', JSON.stringify([...favorites]));
    
    // Update agenda button badge count
    updateFavBadgeCount();

    // Re-render
    applyFilters();

    // Also update modal star button if open
    if (eventModal.classList.contains('active')) {
      const isStarred = favorites.has(id);
      modalStarBtn.classList.toggle('starred', isStarred);
      modalStarBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        ${isStarred ? 'Salvo na Minha Agenda' : 'Adicionar à Minha Agenda'}
      `;
    }
  }

  function updateFavBadgeCount() {
    favAgendaBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${showOnlyFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      Minha Agenda (${favorites.size})
    `;
    favAgendaBtn.classList.toggle('active', showOnlyFavorites);
  }

  // Open Modal Details
  function openModal(id) {
    const evt = allEvents.find(e => e.ID === id);
    if (!evt) return;

    const { full: weekFull } = getWeekdayInfo(evt.Data);
    const isStarred = favorites.has(evt.ID);

    modalTitle.textContent = evt.Título || 'Sem Título';
    modalCategory.textContent = evt.Categoria || '';
    modalSubcategory.textContent = evt.Subcategoria || '';
    modalDate.textContent = `${weekFull ? weekFull + ', ' : ''}${evt.Data || ''}`;
    modalTime.textContent = evt.Horário || 'Horário não especificado';
    modalLocation.textContent = evt.Local || 'Local a definir';
    
    modalDescription.textContent = evt.Descrição && evt.Descrição.trim() !== '' 
      ? evt.Descrição 
      : 'Nenhuma descrição detalhada fornecida para este evento.';

    // Format Speakers
    const speakersArr = evt.Palestrantes 
      ? evt.Palestrantes.split('|').map(s => s.trim()).filter(Boolean)
      : [];

    if (speakersArr.length > 0) {
      modalSpeakersList.innerHTML = speakersArr.map(spk => {
        const initial = spk.charAt(0).toUpperCase();
        return `
          <div class="modal-speaker-card">
            <div class="speaker-avatar">${initial}</div>
            <div class="speaker-details">
              <div class="name">${spk}</div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      modalSpeakersList.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem;">Nenhum palestrante listado.</div>';
    }

    // Modal Star Button
    modalStarBtn.setAttribute('data-id', evt.ID);
    modalStarBtn.classList.toggle('starred', isStarred);
    modalStarBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="${isStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      ${isStarred ? 'Salvo na Minha Agenda' : 'Adicionar à Minha Agenda'}
    `;

    eventModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    eventModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search input debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      clearSearchBtn.style.display = searchInput.value ? 'flex' : 'none';
      searchTimeout = setTimeout(applyFilters, 250);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      applyFilters();
    });

    // Category Change (updates subcategories dropdown too)
    categoryFilter.addEventListener('change', () => {
      applyFilters();
    });

    subcategoryFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    timePeriodFilter.addEventListener('change', applyFilters);

    // Reset All Filters
    resetFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      categoryFilter.value = 'ALL';
      subcategoryFilter.value = 'ALL';
      locationFilter.value = 'ALL';
      timePeriodFilter.value = 'ALL';
      currentDay = 'ALL';
      showOnlyFavorites = false;
      
      updateFavBadgeCount();
      renderDayTabs();
      applyFilters();
    });

    // Toggle Minha Agenda (Favorites Only) Filter
    favAgendaBtn.addEventListener('click', () => {
      showOnlyFavorites = !showOnlyFavorites;
      if (showOnlyFavorites) {
        // Reseta o filtro de dia para exibir favoritos de TODAS as datas
        currentDay = 'ALL';
        renderDayTabs();
      }
      updateFavBadgeCount();
      applyFilters();
    });

    // Load More Button
    loadMoreBtn.addEventListener('click', () => {
      page++;
      renderEvents();
    });

    // Modal Close
    modalCloseBtn.addEventListener('click', closeModal);
    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && eventModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Modal Star Toggle Button
    modalStarBtn.addEventListener('click', () => {
      const id = parseInt(modalStarBtn.getAttribute('data-id'), 10);
      toggleFavorite(id);
    });

    updateFavBadgeCount();
  }

  // Start Application
  init();
});
