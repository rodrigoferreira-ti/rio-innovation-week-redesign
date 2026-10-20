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

  // Map of local speaker photos downloaded into palestrantes/ folder
  const SPEAKER_PHOTOS_MAP = {
    "richard branson": "1.jpg",
    "steve wozniak": "2.jpg",
    "spike lee": "3.jpg",
    "graça machel mandela": "4.jpg",
    "marc randolph": "5.jpg",
    "bruce dickinson": "6.jpg",
    "ian beacraft": "ian-beacraft.jpg",
    "luciano huck": "8.jpg",
    "rachel maia": "9.jpg",
    "rodrigo santoro": "10.jpg",
    "maju coutinho": "11.jpg",
    "monja coen": "12.jpg",
    "ivair gontijo": "13.jpg",
    "sandrine dixson": "14.jpg",
    "anitta": "15.jpg",
    "vandana shiva": "16.jpg",
    "kip thorne": "17.jpg",
    "nadia murad": "18.jpg",
    "alex osterwalder": "19.jpg",
    "eric ries": "20.jpg",
    "marcelo gleiser": "marcelo-gleiser.jpg",
    "nath finanças": "22.jpg",
    "carol paiffer": "23.jpg",
    "sidarta ribeiro": "24.jpg",
    "zico": "25.jpg",
    "ailton krenak": "26.jpg",
    "bianca andrade": "27.jpg",
    "achille mbembe": "28.jpg",
    "aaron ross": "29.jpg",
    "amy webb": "amy-webb.jpg",
    "john maeda": "john-maeda.jpeg",
    "adam frank": "adam-frank.jpg",
    "denis mukwege": "denis-mukwege.jpg",
    "antônio damásio": "antonio-damasio.jpg",
    "carla madeira": "carla-madeira.jpg",
    "cida bento": "cida-bento.jpg",
    "clayton allen": "clayton-allen.png",
    "camila fremder": "camila-fremder.png",
    "felipe tito": "felipe-tito.jpg",
    "daniela arrais": "daniela-arrais.jpg",
    "hugo gloss": "hugo-gloss.jpg",
    "james whitfield": "james-whitfield.jpg",
    "joao appolinario": "joao-appolinario.jpg",
    "salman khan": "salman-khan.png",
    "luana genot": "luana-genot.jpg",
    "marcelo tas": "marcelo-tas.jpg",
    "marina silva": "marina-silva.jpg",
    "neil redding": "neil-redding.jpg",
    "nina silva": "nina-silva.jpg",
    "pedro cerize": "pedro-cerize.jpg",
    "rebeca andrade": "rebeca-andrade.webp",
    "rick doblin": "rick-doblin.jpg",
    "robson santos": "robson-santos.jpg",
    "ronaldo lemos": "ronaldo-lemos.jpg",
    "samir alves": "samir-alves.jpg",
    "tania cosentino": "tania-cosentino.jpg",
    "vinicius scofield": "vinicius-scofield.jpg",
    "viviane mosé": "viviane-mose.jpg",
    "walter longo": "walter-longo.jpg",
    "zeina latif": "zeina-latif.jpg"
  };

  // Normalizador rigoroso para matching de palestrantes (sem acentos, sem pontuações, sem hífens)
  function normalizeSpeakerKey(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_.]/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Mapa otimizado em memória construído na inicialização
  const SPEAKER_PHOTO_LOOKUP = new Map();

  function initSpeakerPhotoLookup() {
    // 1. Mapeamento de Keynotes oficiais
    for (const [key, filename] of Object.entries(SPEAKER_PHOTOS_MAP)) {
      SPEAKER_PHOTO_LOOKUP.set(normalizeSpeakerKey(key), `./palestrantes/${filename}`);
    }

    // 2. Base completa de fotos locais em palestrantes/ (916+ fotos oficiais)
    if (window.RIW_SPEAKERS_LOCAL_MAP) {
      for (const [key, filename] of Object.entries(window.RIW_SPEAKERS_LOCAL_MAP)) {
        const val = filename.startsWith('http') ? filename : `./palestrantes/${filename}`;
        SPEAKER_PHOTO_LOOKUP.set(normalizeSpeakerKey(key), val);
      }
    }

    // 3. Fallback para fotos CDN oficiais se disponíveis
    if (window.RIW_SPEAKERS_CDN_MAP) {
      for (const [key, url] of Object.entries(window.RIW_SPEAKERS_CDN_MAP)) {
        const norm = normalizeSpeakerKey(key);
        if (!SPEAKER_PHOTO_LOOKUP.has(norm)) {
          SPEAKER_PHOTO_LOOKUP.set(norm, url);
        }
      }
    }
  }

  function parseSpeaker(speakerStr) {
    if (!speakerStr) return { name: '', role: '' };
    const match = speakerStr.match(/^([^(]+)(?:\(([^)]*)\))?/);
    let name = match ? match[1].trim() : speakerStr.trim();
    name = name.replace(/^[-\s·]+|[-\s·]+$/g, '');
    const role = match && match[2] ? match[2].trim() : '';
    return { name, role };
  }

  function getSpeakerPhoto(name) {
    if (!name) return null;
    const clean = normalizeSpeakerKey(name);

    // 1. Match direto normalizado
    if (SPEAKER_PHOTO_LOOKUP.has(clean)) {
      return SPEAKER_PHOTO_LOOKUP.get(clean);
    }

    // 2. Match removendo prefixos de títulos (Prof., Dr., Dra., etc.)
    const withoutPrefix = clean.replace(/^(prof|dr|dra|doutor|doutora|paje|padre)\s+/, '');
    if (SPEAKER_PHOTO_LOOKUP.has(withoutPrefix)) {
      return SPEAKER_PHOTO_LOOKUP.get(withoutPrefix);
    }

    // 3. Match por prefixo de nome composto (ex: "Rebeca Andrade Silva" encontra "Rebeca Andrade")
    if (clean.length > 5) {
      for (const [key, photo] of SPEAKER_PHOTO_LOOKUP.entries()) {
        if (key.length > 5 && (clean === key || clean.startsWith(key + ' ') || key.startsWith(clean + ' '))) {
          return photo;
        }
      }
    }

    return null;
  }


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

  // Helper: Return specific visual theme class for Category Badge (matching RIW tracks)
  function getCategoryClass(category) {
    if (!category) return '';
    const c = category.toLowerCase();
    if (c.includes('tecnologia')) return 'cat-tech';
    if (c.includes('empreendedorismo') || c.includes('varejo')) return 'cat-business';
    if (c.includes('saúde') || c.includes('socioambiental') || c.includes('agro')) return 'cat-health';
    if (c.includes('criativa') || c.includes('branding')) return 'cat-creative';
    if (c.includes('diálogos') || c.includes('diversidade')) return 'cat-dialogues';
    if (c.includes('governança') || c.includes('e-gov') || c.includes('finanças')) return 'cat-gov';
    if (c.includes('energia') || c.includes('arquitetura')) return 'cat-energy';
    if (c.includes('esporte') || c.includes('educação')) return 'cat-sport';
    return '';
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

      initSpeakerPhotoLookup();
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
    
    categoryFilter.innerHTML = '<option value="ALL">Todas as trilhas</option>';
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

    subcategoryFilter.innerHTML = '<option value="ALL">Todas as conferências</option>';
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

    locationFilter.innerHTML = '<option value="ALL">Todos os palcos</option>';
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

    timePeriodFilter.innerHTML = '<option value="ALL">Todos os horários</option>';
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

    // "TODOS OS DIAS" Tab (Active by default, orange pill)
    const allTab = document.createElement('button');
    allTab.className = `day-tab ${currentDay === 'ALL' ? 'active' : ''}`;
    allTab.textContent = 'TODOS OS DIAS';
    allTab.addEventListener('click', () => selectDay('ALL'));
    dayTabsContainer.appendChild(allTab);

    // Date Specific Tabs: "04 TER. AGO", "05 QUA. AGO", "06 QUI. AGO", "07 SEX. AGO"
    uniqueDates.forEach(dateStr => {
      const { short: weekShort } = getWeekdayInfo(dateStr);
      const dayNum = dateStr.substring(0, 2);
      const label = `${dayNum} ${weekShort}. AGO`;

      const tab = document.createElement('button');
      tab.className = `day-tab ${currentDay === dateStr ? 'active' : ''}`;
      tab.textContent = label;
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
  function applyFilters({ resetPage = true } = {}) {
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

    if (resetPage) {
      page = 1;
    }
    renderEvents();
  }

  // Render Events Grid
  function renderEvents() {
    const totalCount = filteredEvents.length;
    if (showOnlyFavorites) {
      resultsCount.innerHTML = `Exibindo <strong>${totalCount}</strong> eventos salvos na sua <strong>Minha Agenda</strong>`;
    } else {
      resultsCount.innerHTML = `Exibindo <strong>${totalCount}</strong> eventos encontrados`;
    }

    if (totalCount === 0) {
      eventsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      const h3 = emptyState.querySelector('h3');
      const p = emptyState.querySelector('p');
      if (showOnlyFavorites) {
        if (h3) h3.textContent = 'Sua Agenda está vazia';
        if (p) p.textContent = 'Você ainda não favoritou nenhuma palestra. Clique na estrela dos cards para montar sua programação personalizada!';
      } else {
        if (h3) h3.textContent = 'Nenhum evento encontrado';
        if (p) p.textContent = 'Tente ajustar os filtros ou buscar por outro termo.';
      }
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

  // Create Card HTML (EXACTLY MATCHING IMAGE 1)
  function createEventCardHTML(evt) {
    const isStarred = favorites.has(evt.ID);
    const dateShort = evt.Data ? evt.Data.substring(0, 5) : '';
    
    // Parse speakers into rich preview
    const speakersArr = evt.Palestrantes 
      ? evt.Palestrantes.split('|').map(s => s.trim()).filter(Boolean)
      : [];

    const parsedSpeakers = speakersArr.map(s => {
      const parsed = parseSpeaker(s);
      const photo = getSpeakerPhoto(parsed.name);
      return { ...parsed, photo };
    });

    // Avatars (overlapping circular photos up to 4)
    const avatarSpeakers = parsedSpeakers.slice(0, 4);
    const avatarsHTML = avatarSpeakers.map((spk, idx) => {
      const initial = spk.name.charAt(0).toUpperCase();
      if (spk.photo) {
        return `
          <div class="speaker-avatar-wrap" style="z-index: ${10 - idx};">
            <img src="${spk.photo}" alt="${spk.name}" class="speaker-avatar-img" loading="lazy" onerror="this.onerror=null; this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
            <div class="speaker-avatar-initial" style="display:none;">${initial}</div>
          </div>
        `;
      } else {
        return `
          <div class="speaker-avatar-wrap" style="z-index: ${10 - idx};">
            <div class="speaker-avatar-initial">${initial}</div>
          </div>
        `;
      }
    }).join('');

    // Speaker names string: "Deny Peres, Fernanda Rigon, Gessica, Danni Rudz +1"
    const namesList = parsedSpeakers.slice(0, 4).map(s => s.name).join(', ');
    const remainingCount = parsedSpeakers.length > 4 ? ` +${parsedSpeakers.length - 4}` : '';
    const speakersText = namesList ? `${namesList}${remainingCount}` : 'Palestrante a definir';

    return `
      <div class="event-card" data-id="${evt.ID}">
        <div class="card-top-row">
          <span class="badge-cat-pill">${evt.Categoria || 'Geral'}</span>
          <div class="card-top-right">
            <span class="card-date-badge">${dateShort}</span>
            <button class="btn-star ${isStarred ? 'starred' : ''}" data-id="${evt.ID}" title="Favoritar evento">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

        ${evt.Subcategoria ? `<div class="card-subcat">${evt.Subcategoria}</div>` : ''}

        <h3 class="card-title">${evt.Título || 'Sem Título'}</h3>

        <div class="card-meta">
          <div class="meta-item">
            <svg class="meta-icon clock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${evt.Horário || 'Horário não especificado'}</span>
          </div>

          <div class="meta-item">
            <svg class="meta-icon pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${evt.Local || 'Local a definir'}</span>
          </div>
        </div>

        ${parsedSpeakers.length > 0 ? `
          <div class="card-speakers-row">
            <div class="speakers-avatar-group">
              ${avatarsHTML}
            </div>
            <div class="speakers-names-text" title="${speakersText}">
              ${speakersText}
            </div>
          </div>
        ` : ''}

        <div class="card-footer">
          <button class="btn-ver-mais" data-id="${evt.ID}">
            Ver mais ›
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

    // "Ver mais ›" Buttons
    document.querySelectorAll('.btn-ver-mais').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openModal(id);
      });
    });
  }

  // Toggle Favorite State
  function toggleFavorite(id) {
    const isNowStarred = !favorites.has(id);
    if (isNowStarred) {
      favorites.add(id);
    } else {
      favorites.delete(id);
    }

    localStorage.setItem('riw_favorites', JSON.stringify([...favorites]));
    
    // Update agenda button badge count
    updateFavBadgeCount();

    if (showOnlyFavorites) {
      // Quando estiver dentro de "Minha Agenda":
      // Ao desfavoritar, remove suavemente apenas aquele card do DOM sem resetar a tela
      const cardEl = eventsGrid.querySelector(`.event-card[data-id="${id}"]`);
      if (cardEl) {
        cardEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        cardEl.style.opacity = '0';
        cardEl.style.transform = 'scale(0.95)';
        setTimeout(() => {
          cardEl.remove();
          const remainingCount = eventsGrid.querySelectorAll('.event-card').length;
          resultsCount.innerHTML = `Exibindo <strong>${remainingCount}</strong> eventos salvos na sua <strong>Minha Agenda</strong>`;
          if (remainingCount === 0) {
            emptyState.style.display = 'block';
            const h3 = emptyState.querySelector('h3');
            const p = emptyState.querySelector('p');
            if (h3) h3.textContent = 'Sua Agenda está vazia';
            if (p) p.textContent = 'Você ainda não favoritou nenhuma palestra. Clique na estrela dos cards para montar sua programação personalizada!';
            loadMoreContainer.style.display = 'none';
          }
        }, 250);
      }
    } else {
      // No feed normal: atualiza diretamente os botões de estrela no DOM
      // Isso NUNCA reseta a paginação e NUNCA fecha o feed dos cards carregados!
      document.querySelectorAll(`.btn-star[data-id="${id}"]`).forEach(btn => {
        btn.classList.toggle('starred', isNowStarred);
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', isNowStarred ? 'currentColor' : 'none');
        }
      });
    }

    // Also update modal star button if open
    if (eventModal && eventModal.classList.contains('active')) {
      const currentModalId = parseInt(modalStarBtn.getAttribute('data-id'), 10);
      if (currentModalId === id) {
        modalStarBtn.classList.toggle('starred', isNowStarred);
        modalStarBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isNowStarred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${isNowStarred ? 'Salvo na Minha Agenda' : 'Adicionar à Minha Agenda'}
        `;
      }
    }
  }


  function updateFavBadgeCount() {
    favAgendaBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${showOnlyFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <span>Minha Agenda (${favorites.size})</span>
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
    modalCategory.className = `badge-cat-pill ${getCategoryClass(evt.Categoria)}`;
    modalCategory.textContent = evt.Categoria || '';
    modalSubcategory.textContent = evt.Subcategoria || '';
    modalDate.textContent = `${weekFull ? weekFull + ', ' : ''}${evt.Data || ''}`;
    modalTime.textContent = evt.Horário || 'Horário não especificado';
    modalLocation.textContent = evt.Local || 'Local a definir';
    
    modalDescription.textContent = evt.Descrição && evt.Descrição.trim() !== '' 
      ? evt.Descrição 
      : 'Nenhuma descrição detalhada fornecida para este evento.';

    // Format Speakers with local photos
    const speakersArr = evt.Palestrantes 
      ? evt.Palestrantes.split('|').map(s => s.trim()).filter(Boolean)
      : [];

    const parsedSpeakers = speakersArr.map(s => {
      const parsed = parseSpeaker(s);
      const photo = getSpeakerPhoto(parsed.name);
      return { ...parsed, photo };
    });

    if (parsedSpeakers.length > 0) {
      modalSpeakersList.innerHTML = parsedSpeakers.map(spk => {
        const initial = spk.name.charAt(0).toUpperCase();
        return `
          <div class="modal-speaker-card">
            <div class="modal-speaker-avatar-wrap">
              ${spk.photo 
                ? `<img src="${spk.photo}" alt="${spk.name}" class="modal-speaker-img" loading="lazy" onerror="this.onerror=null; this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
                   <div class="speaker-avatar-initial" style="display:none;">${initial}</div>`
                : `<div class="speaker-avatar-initial">${initial}</div>`
              }
            </div>
            <div class="speaker-details">
              <div class="name">${spk.name}</div>
              ${spk.role ? `<div class="role">${spk.role}</div>` : ''}
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
        // Ao clicar em Minha Agenda, limpa TODOS os filtros (busca, categoria, subcategoria, palco, turno, dia)
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        categoryFilter.value = 'ALL';
        subcategoryFilter.value = 'ALL';
        locationFilter.value = 'ALL';
        timePeriodFilter.value = 'ALL';
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
