// App.js - Glavna aplikacija za evidenciju kamera
// Upravljanje navigacijom, korisnčkim sučeljem i logikom

class CameraApp {
  constructor() {
    this.storage = storage;
    this.currentPage = 'dashboard';
    this.injectUiHelpers();
    this.init();
  }

  injectUiHelpers() {
    if (document.getElementById('appModal')) return;

    const modalHtml = `
      <div id="appModal" class="app-modal hidden" aria-hidden="true">
        <div class="app-modal-backdrop" data-modal-close="true"></div>
        <div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="appModalTitle">
          <div class="app-modal-header">
            <h3 id="appModalTitle">Potvrda</h3>
            <button type="button" class="app-modal-close" data-modal-close="true" aria-label="Zatvori">×</button>
          </div>
          <div class="app-modal-body">
            <p id="appModalMessage">Jeste li sigurni?</p>
          </div>
          <div class="app-modal-actions">
            <button type="button" class="btn-secondary" id="appModalCancel">Otkaži</button>
            <button type="button" class="btn-primary" id="appModalConfirm">Potvrdi</button>
          </div>
        </div>
      </div>
    `;

    const toastContainer = document.createElement('div');
    toastContainer.id = 'appToastContainer';
    toastContainer.className = 'toast-container';

    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'appLoadingOverlay';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.setAttribute('aria-label', 'Učitavanje');
    loadingOverlay.innerHTML = '<div class="loading-spinner" role="status" aria-label="Učitavanje"></div>';

    const photoLightbox = document.createElement('div');
    photoLightbox.id = 'coveragePhotoLightbox';
    photoLightbox.className = 'coverage-photo-lightbox hidden';
    photoLightbox.setAttribute('aria-hidden', 'true');
    photoLightbox.innerHTML = `
      <button type="button" class="coverage-photo-lightbox-close" aria-label="Zatvori pregled slike">×</button>
      <img id="coveragePhotoLightboxImage" alt="Uvećani prikaz ugla pokrivanja kamere">
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.appendChild(toastContainer);
    document.body.appendChild(loadingOverlay);
    document.body.appendChild(photoLightbox);

    document.addEventListener('click', (event) => {
      const closeTrigger = event.target.closest('[data-modal-close="true"]');
      if (closeTrigger) {
        this.closeModal();
      }

      const coverageImage = event.target.closest('.coverage-photo-preview, .coverage-photo-card img');
      if (coverageImage) {
        event.preventDefault();
        event.stopPropagation();
        this.openCoveragePhoto(coverageImage.src);
      }

      if (event.target.closest('.coverage-photo-lightbox-close') || event.target.id === 'coveragePhotoLightbox') {
        this.closeCoveragePhoto();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.closeCoveragePhoto();
    });
  }

  init() {
    this.setupEventListeners();
    this.loadPageContent();
    this.storage.onUpdate(() => this.refreshUI());
  }

  // Postavi event listenere
  setupEventListeners() {
    // Navigacijski linkovi
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(link.dataset.page);
      });
    });

    // Dugmici akcije
    document.addEventListener('click', (e) => {
      const deleteButton = e.target.closest('.btn-delete');
      const editButton = e.target.closest('.btn-edit');
      const reviewButton = e.target.closest('.review-button');
      const locationsButton = e.target.closest('.camera-locations-button');
      const objectDetailsButton = e.target.closest('.object-details-button');
      const restoreButton = e.target.closest('.restore-camera-button');
      const exportButton = e.target.closest('.btn-export, [data-format]');

      if (deleteButton) {
        this.handleDeleteCamera(deleteButton.dataset.id);
      }
      if (editButton) {
        this.handleEditCamera(editButton.dataset.id);
      }
      if (reviewButton) {
        this.handleAddReview(reviewButton.dataset.reviewId);
      }
      if (locationsButton) {
        this.showCameraLocations(locationsButton.dataset.status);
      }
      if (objectDetailsButton) {
        this.loadObjectDetails(objectDetailsButton.dataset.objectName);
      }
      if (restoreButton) {
        this.handleRestoreCamera(restoreButton.dataset.id);
      }
      if (exportButton && exportButton.dataset.format) {
        this.handleExport(exportButton.dataset.format);
      }
    });
  }

  bindDynamicPageListeners() {
    const addCameraForm = document.getElementById('addCameraForm');
    if (addCameraForm && !addCameraForm.dataset.bound) {
      addCameraForm.addEventListener('submit', (e) => this.handleAddCamera(e));
      addCameraForm.dataset.bound = 'true';
    }
  }

  showToast(message, type = 'success') {
    const toastContainer = document.getElementById('appToastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 250);
    }, 2600);
  }

  openModal({ title, message, confirmText = 'Potvrdi', onConfirm, onCancel, confirmVariant = 'primary', messageIsHtml = false }) {
    const modal = document.getElementById('appModal');
    if (!modal) return;

    const titleEl = document.getElementById('appModalTitle');
    const messageEl = document.getElementById('appModalMessage');
    const confirmBtn = document.getElementById('appModalConfirm');
    const cancelBtn = document.getElementById('appModalCancel');

    titleEl.textContent = title;
    if (messageIsHtml) {
      messageEl.innerHTML = message;
    } else {
      messageEl.textContent = message;
    }
    confirmBtn.textContent = confirmText;
    confirmBtn.className = `btn-${confirmVariant}`;

    const closeModal = () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      cancelBtn.onclick = null;
      confirmBtn.onclick = null;
    };

    cancelBtn.onclick = () => {
      closeModal();
      if (typeof onCancel === 'function') onCancel();
    };

    confirmBtn.onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    const modal = document.getElementById('appModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  showLoading() {
    document.getElementById('appLoadingOverlay')?.classList.add('visible');
  }

  hideLoading() {
    document.getElementById('appLoadingOverlay')?.classList.remove('visible');
  }

  openCoveragePhoto(imageSource) {
    const lightbox = document.getElementById('coveragePhotoLightbox');
    const image = document.getElementById('coveragePhotoLightboxImage');
    if (!lightbox || !image || !imageSource) return;

    image.src = imageSource;
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('photo-lightbox-open');
  }

  closeCoveragePhoto() {
    const lightbox = document.getElementById('coveragePhotoLightbox');
    if (!lightbox) return;

    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('photo-lightbox-open');
  }

  formatDate(dateValue) {
    if (!dateValue) return 'Nije evidentirano';
    const dateText = String(dateValue).slice(0, 10);
    const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return dateValue;
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  getRetentionIndicator(days) {
    const value = Number(days);
    if (value < 7) {
      return { className: 'retention-danger', label: `🔴 ${value} dana` };
    }
    if (value < 15) {
      return { className: 'retention-warning', label: `🟡 ${value} dana` };
    }
    if (value <= 90) {
      return { className: 'retention-success', label: `🟢 ${value} dana` };
    }
    return { className: 'retention-neutral', label: `${value} dana` };
  }

  getReviewHistory(camera) {
    return Array.isArray(camera.reviewHistory) ? camera.reviewHistory : [];
  }

  getReviewResultClass(result) {
    if (result === 'Neispravno') return 'review-result-danger';
    if (result === 'Potrebna pažnja') return 'review-result-warning';
    return 'review-result-success';
  }

  getReviewAgeDays(camera) {
    const reviewDate = camera.lastMaintenance || camera.statusCheckDate || camera.installDate;
    if (!reviewDate) return null;
    const date = new Date(`${String(reviewDate).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    return Math.floor((new Date() - date) / (24 * 60 * 60 * 1000));
  }

  getMissingCoveragePhotoCount(camera) {
    const parsedCameraCount = Number.parseInt(camera?.cameraCount, 10);
    const cameraCount = Number.isFinite(parsedCameraCount) && parsedCameraCount > 0 ? parsedCameraCount : 1;
    const photos = Array.isArray(camera?.cameraPhotos)
      ? camera.cameraPhotos.filter(photo => typeof photo === 'string' && photo.trim() !== '')
      : (typeof camera?.coveragePhoto === 'string' && camera.coveragePhoto.trim() !== '' ? ['legacy'] : []);
    const photoCount = Number.isFinite(photos.length) ? photos.length : 0;

    return Math.max(0, cameraCount - photoCount);
  }

  // Navigacija između stranica
  navigateTo(page) {
    this.currentPage = page;
    this.loadPageContent();
  }

  // Učitaj sadržaj stranice
  loadPageContent() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    this.showLoading();
    mainContent.innerHTML = '';

    switch (this.currentPage) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'cameras':
        this.loadCameras();
        break;
      case 'objects':
        this.loadObjects();
        break;
      case 'streets':
        this.loadStreets();
        break;
      case 'map':
        this.loadMap();
        break;
      case 'reviews':
        this.loadReviews();
        break;
      case 'archive':
        this.loadArchive();
        break;
      case 'reports':
        this.loadReports();
        break;
      case 'settings':
        this.loadSettings();
        break;
      default:
        this.loadDashboard();
    }

    // Oznaci aktivnu stranicu
    document.querySelectorAll('[data-page]').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === this.currentPage) {
        link.classList.add('active');
      }
    });

    this.bindDynamicPageListeners();
    requestAnimationFrame(() => this.hideLoading());
  }

  // ===== DASHBOARD =====

  loadDashboard() {
    const stats = this.storage.getStatistics();
    const expiringCameras = this.storage.getExpiringRetentionCameras();
    const reviewAlerts = this.storage.getAllCameras()
      .map(camera => ({ camera, age: this.getReviewAgeDays(camera) }))
      .filter(item => item.age !== null && item.age > 60)
      .sort((first, second) => second.age - first.age);
    const allCameras = this.storage.getAllCameras();
    const dataQuality = {
      withoutLocation: allCameras.filter(camera => !camera.location || typeof camera.location.lat !== 'number' || typeof camera.location.lng !== 'number').length,
      withoutPhoto: allCameras.reduce((total, camera) => total + this.getMissingCoveragePhotoCount(camera), 0),
      withoutReview: allCameras.filter(camera => !camera.lastMaintenance && !this.getReviewHistory(camera).length).length
    };

    const html = `
      <div class="dashboard-container">
        <h1>📊 Kontrolna Tabla</h1>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📷</div>
            <div class="stat-info">
              <h3>${stats.totalCameras}</h3>
              <p>Ukupno kamera</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>${stats.activeCount}</h3>
              <p>Aktivne kamere</p>
              <button type="button" class="stat-card-action camera-locations-button" data-status="aktivna">Prikaži lokacije</button>
            </div>
          </div>

          <div class="stat-card stat-card-inactive">
            <div class="stat-icon">✕</div>
            <div class="stat-info">
              <h3>${stats.inactiveCount}</h3>
              <p>Neaktivne kamere</p>
              <button type="button" class="stat-card-action camera-locations-button" data-status="neaktivna">Prikaži lokacije</button>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🛣️</div>
            <div class="stat-info">
              <h3>${stats.totalStreets}</h3>
              <p>Ulice sa kamerama</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💾</div>
            <div class="stat-info">
              <h3>${stats.averageRetentionDays} dana</h3>
              <p>Prosečno čuvanje</p>
            </div>
          </div>
        </div>

        <div class="dashboard-sections">
          <div class="section">
            <h2>⚠️ Kamere sa trenutnim  načinom rada</h2>
            ${expiringCameras.length > 0 ? `
              <div class="expiring-list">
                ${expiringCameras.map(cam => `
                  <div class="expiring-item">
                    <strong>${cam.objectName}</strong><br>
                    <small>Ulica: ${cam.street} | Čuvanje: ${cam.retentionDays} dana</small>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: #27ae60;">Nema kamera sa istekućim vremenom čuvanja 🎉</p>'}
          </div>

          <div class="section">
            <h2>📈 Distribucija po kategorijama</h2>
            <div class="chart-data">
              ${Object.entries(stats.categoryDistribution).map(([cat, count]) => `
                <div class="chart-item">
                  <span>${cat}</span>
                  <div class="bar" style="width: ${(count / stats.totalCameras) * 100}%"></div>
                  <span>${count}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>🎥 Distribucija po kvaliteti</h2>
            <div class="chart-data">
              ${Object.entries(stats.qualityDistribution).map(([qual, count]) => `
                <div class="chart-item">
                  <span>${qual}</span>
                  <div class="bar" style="width: ${(count / stats.totalCameras) * 100}%"></div>
                  <span>${count}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section review-alert-section">
            <h2>🕒 Pregledi kojima ističe rok</h2>
            ${reviewAlerts.length > 0 ? `
              <div class="review-alert-list">
                ${reviewAlerts.map(({ camera, age }) => `
                  <div class="review-alert-item ${age > 90 ? 'review-alert-danger' : 'review-alert-warning'}">
                    <strong>${this.escapeHtml(camera.objectName)}</strong>
                    <span>${this.escapeHtml(camera.street || 'Ulica nije navedena')}</span>
                    <small>Posljednji pregled: ${this.formatDate(camera.lastMaintenance || camera.statusCheckDate || camera.installDate)} · Starost: ${age} dana</small>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="review-alert-empty">Svi pregledi su ažurni.</p>'}
          </div>

          <div class="section data-quality-section">
            <h2>🧾 Kontrola podataka</h2>
            <div class="data-quality-grid">
              <div class="data-quality-item">
                <strong>${dataQuality.withoutLocation}</strong>
                <span>Bez lokacije na mapi</span>
                <button type="button" onclick="app.navigateTo('cameras')">Otvori kamere</button>
              </div>
              <div class="data-quality-item">
                <strong>${dataQuality.withoutPhoto}</strong>
                <span>Bez fotografije ugla</span>
                <button type="button" onclick="app.navigateTo('objects')">Otvori objekte</button>
              </div>
              <div class="data-quality-item">
                <strong>${dataQuality.withoutReview}</strong>
                <span>Bez evidencije pregleda</span>
                <button type="button" onclick="app.navigateTo('reviews')">Evidencija pregleda</button>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-actions">
          <button class="btn-primary" onclick="app.navigateTo('cameras')">➕ Dodaj novu kameru</button>
          <button class="btn-secondary" data-format="json">⬇️ Export JSON</button>
          <button class="btn-secondary" data-format="csv">⬇️ Export CSV</button>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    
    // Dodaj event listenere
    document.querySelector('.btn-primary').addEventListener('click', () => {
      this.navigateTo('cameras');
    });
  }

  showCameraLocations(status) {
    const cameras = this.storage.getAllCameras().filter(camera => camera.status === status);
    const statusLabel = status === 'aktivna' ? 'Aktivne' : 'Neaktivne';
    const rows = cameras.flatMap(camera => {
      const positions = Array.isArray(camera.cameraPositions) && camera.cameraPositions.length > 0
        ? camera.cameraPositions
        : Array.from({ length: Number(camera.cameraCount) || 1 }, () => 'Nije navedeno');

      return positions.map((position, index) => ({ camera, position, number: index + 1 }));
    });

    const message = rows.length > 0 ? `
      <div class="inactive-location-report">
        <p>Lokacije i ručno unesene pozicije ${statusLabel === 'Aktivne' ? 'aktivnih' : 'neaktivnih'} kamera.</p>
        <div class="inactive-location-list">
          ${rows.map(({ camera, position, number }) => `
            <article class="inactive-location-item">
              <strong>${this.escapeHtml(camera.objectName)} - Kamera ${number}</strong>
              <span><b>Ulica:</b> ${this.escapeHtml(camera.street || '-')}</span>
              <span><b>Pozicija pokrivanja:</b> ${this.escapeHtml(position)}</span>
            </article>
          `).join('')}
        </div>
      </div>
    ` : `<p>Nema ${statusLabel.toLowerCase()} kamera za prikaz.</p>`;

    this.openModal({
      title: `${statusLabel} kamere - lokacije i pozicije`,
      message,
      confirmText: 'Štampaj ispis',
      messageIsHtml: true,
      onConfirm: () => this.printCameraLocations(rows, statusLabel)
    });
  }

  printCameraLocations(rows, statusLabel) {
    if (!rows.length) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      this.showToast('⚠️ Pregled za štampu je blokiran u browseru.', 'error');
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="sr">
        <head>
          <meta charset="UTF-8">
          <title>${statusLabel} kamere - lokacije</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
            h1 { border-bottom: 3px solid ${statusLabel === 'Aktivne' ? '#22C55E' : '#EF4444'}; padding-bottom: 10px; }
            .item { border: 1px solid #D1D5DB; border-left: 5px solid ${statusLabel === 'Aktivne' ? '#22C55E' : '#EF4444'}; padding: 14px; margin: 12px 0; }
            .item span { display: block; margin-top: 6px; }
            .meta { color: #6B7280; font-size: 12px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <h1>${statusLabel} kamere - lokacije i pozicije</h1>
          ${rows.map(({ camera, position, number }) => `
            <div class="item">
              <strong>${this.escapeHtml(camera.objectName)} - Kamera ${number}</strong>
              <span><b>Ulica:</b> ${this.escapeHtml(camera.street || '-')}</span>
              <span><b>Pozicija pokrivanja:</b> ${this.escapeHtml(position)}</span>
            </div>
          `).join('')}
          <p class="meta">Generisano: ${this.formatDate(new Date().toISOString())}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  // ===== KAMERE =====

  loadCameras() {
    const cameras = this.storage.getAllCameras();
    const categories = this.storage.data.categories;
    const qualities = this.storage.data.qualities;
    const statuses = this.storage.data.statuses;

    const html = `
      <div class="cameras-container">
        <h1>📷 Evidencija Kamera</h1>

        <div class="form-section">
          <h2>Dodaj novu kameru</h2>
          <form id="addCameraForm" class="camera-form">
            <div class="form-grid">
              <input type="text" placeholder="Naziv objekta*" id="objectName" required>
              <input type="text" placeholder="Ulica*" id="street" required>
              <select id="quality" required>
                <option value="">Kvaliteta*</option>
                ${qualities.map(q => `<option value="${q}">${q}</option>`).join('')}
              </select>
              <label class="retention-field" for="retentionDays">
                <span>Dana čuvanja*</span>
                <input type="number" placeholder="Dana čuvanja*" id="retentionDays" min="1" required>
                <small id="retentionIndicator" class="retention-indicator">Unesite broj dana</small>
              </label>
              <label for="cameraCount">
                <span>Broj kamera</span>
                <input type="number" id="cameraCount" min="1" value="1">
              </label>
              <div id="cameraPositions" class="camera-positions" style="grid-column: 1 / -1;"></div>
              <select id="status" required>
                <option value="">Status*</option>
                ${statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
              <input type="text" placeholder="Vlasnik" id="owner">
              <input type="tel" placeholder="Telefon" id="phone">
              <select id="category">
                <option value="">Kategorija</option>
                ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
              <select id="securityLevel">
                <option value="">Sigurnosni nivo</option>
                <option value="javni prostor">Javni prostor</option>
                <option value="privatni prostor">Privatni prostor</option>
                <option value="strogo poverljivo">Strogo poverljivo</option>
              </select>
              <input type="text" placeholder="Adresa lokacije" id="locationAddress" style="grid-column: 1 / -1;">
              <input type="number" step="0.000001" placeholder="Geografska širina (lat)" id="locationLat" style="grid-column: 1 / 2;">
              <input type="number" step="0.000001" placeholder="Geografska dužina (lng)" id="locationLng" style="grid-column: 2 / -1;">
              <label class="direction-control" for="locationDirection" style="grid-column: 1 / -1;">
                <span>Smjer gledanja kamere: <strong id="locationDirectionValue">0° - sjever</strong></span>
                <input type="range" id="locationDirection" min="0" max="359" step="1" value="0">
              </label>
              <label class="date-field-label" for="statusCheckDate" style="grid-column: 1 / -1;">
                <span>Datum provjere statusa kamere*</span>
                <input type="date" id="statusCheckDate" required>
              </label>
              <textarea placeholder="Napomene" id="notes" style="grid-column: 1/-1;"></textarea>
            </div>
            <button type="submit" class="btn-primary">Dodaj kameru</button>
          </form>
        </div>

        <div class="form-section" style="margin-top: 24px;">
          <h2>🗺️ Mapa Modriča</h2>
          <p style="margin-bottom: 12px;">Klikom na mapu možete ručno postaviti lokaciju za kameru. Koordinate se automatski upisuju u polja iznad.</p>
          <div id="cameraLocationMap" style="height: 280px; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #4B5563; background: rgba(17, 24, 39, 0.7);"></div>
        </div>

        <div class="table-section">
          <div class="search-panel" style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin-bottom:16px;">
            <input type="search" id="advancedCameraSearch" placeholder="Napredna pretraga 🔎" style="flex:1; min-width:220px; padding:10px 12px; border:1px solid #4B5563; border-radius:10px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
            <select id="cameraStatusFilter" style="padding:10px 12px; border:1px solid #4B5563; border-radius:10px; min-width:160px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
              <option value="">Svi statusi</option>
              ${statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
            <select id="cameraQualityFilter" style="padding:10px 12px; border:1px solid #4B5563; border-radius:10px; min-width:160px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
              <option value="">Sve kvalitete</option>
              ${qualities.map(q => `<option value="${q}">${q}</option>`).join('')}
            </select>
            <select id="cameraStreetFilter" style="padding:10px 12px; border:1px solid #4B5563; border-radius:10px; min-width:180px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
              <option value="">Sve ulice</option>
              ${[...new Set(cameras.map(cam => cam.street).filter(Boolean))].map(street => `<option value="${street}">${street}</option>`).join('')}
            </select>
            <select id="cameraCategoryFilter" style="padding:10px 12px; border:1px solid #4B5563; border-radius:10px; min-width:180px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
              <option value="">Sve kategorije</option>
              ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
            <button type="button" id="resetCameraFilters" class="btn-secondary" style="padding:10px 14px; border-radius:10px;">Resetuj</button>
          </div>

          <h2>Spisak kamera (${cameras.length})</h2>
          <div id="cameraTableContainer">
            ${cameras.length > 0 ? `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Objekt</th>
                      <th>Ulica</th>
                      <th>Kvaliteta</th>
                      <th>Čuvanje (dana)</th>
                      <th>Status</th>
                      <th>Vlasnik</th>
                      <th>Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cameras.map(cam => `
                      <tr>
                        <td><strong>${cam.objectName}</strong></td>
                        <td>${cam.street}</td>
                        <td>${cam.quality}</td>
                        <td><span class="retention-table-badge ${this.getRetentionIndicator(cam.retentionDays).className}">${this.getRetentionIndicator(cam.retentionDays).label}</span></td>
                        <td><span class="status-badge status-${cam.status}">${cam.status}</span></td>
                        <td>${cam.owner || '-'}</td>
                        <td>
                          <button class="btn-edit" data-id="${cam.id}">✏️ Uredi</button>
                          <button class="btn-delete" data-id="${cam.id}">🗑️ Obrisi</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<p>Nema dodanih kamera. Dodajte prvu kameru!</p>'}
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;

    this.initCameraLocationMap(cameras);
    this.bindCameraPositionFields('cameraCount', 'cameraPositions');

    const retentionInput = document.getElementById('retentionDays');
    const retentionIndicator = document.getElementById('retentionIndicator');
    const updateRetentionIndicator = () => {
      const days = Number(retentionInput?.value);
      retentionIndicator.className = 'retention-indicator';

      if (!retentionInput?.value || Number.isNaN(days)) {
        retentionIndicator.textContent = 'Unesite broj dana';
        return;
      }

      if (days < 7) {
        retentionIndicator.classList.add('retention-danger');
        retentionIndicator.textContent = '🔴 Manje od 7 dana';
      } else if (days < 15) {
        retentionIndicator.classList.add('retention-warning');
        retentionIndicator.textContent = '🟡 7–15 dana';
      } else if (days <= 90) {
        retentionIndicator.classList.add('retention-success');
        retentionIndicator.textContent = '🟢 15–90 dana';
      } else {
        retentionIndicator.textContent = 'Više od 90 dana';
      }
    };

    retentionInput?.addEventListener('input', updateRetentionIndicator);
    updateRetentionIndicator();

    const searchInput = document.getElementById('advancedCameraSearch');
    const statusFilter = document.getElementById('cameraStatusFilter');
    const qualityFilter = document.getElementById('cameraQualityFilter');
    const streetFilter = document.getElementById('cameraStreetFilter');
    const categoryFilter = document.getElementById('cameraCategoryFilter');
    const resetButton = document.getElementById('resetCameraFilters');
    const tableContainer = document.getElementById('cameraTableContainer');

    const renderFilteredCameras = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const selectedStatus = statusFilter?.value || '';
      const selectedQuality = qualityFilter?.value || '';
      const selectedStreet = streetFilter?.value || '';
      const selectedCategory = categoryFilter?.value || '';

      const filtered = cameras.filter(cam => {
        const searchableFields = [
          cam.objectName,
          cam.objectCode,
          cam.street,
          cam.owner,
          cam.phone,
          cam.category,
          cam.status,
          cam.quality,
          cam.securityLevel,
          cam.location?.address,
          cam.statusCheckDate,
          cam.lastMaintenance,
          cam.reviewedBy,
          cam.reviewResult,
          cam.retentionDays,
          ...(Array.isArray(cam.cameraCodes) ? cam.cameraCodes : []),
          ...(Array.isArray(cam.cameraPositions) ? cam.cameraPositions : [])
        ];
        const haystack = searchableFields.filter(Boolean).join(' ').toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        const matchesStatus = !selectedStatus || cam.status === selectedStatus;
        const matchesQuality = !selectedQuality || cam.quality === selectedQuality;
        const matchesStreet = !selectedStreet || cam.street === selectedStreet;
        const matchesCategory = !selectedCategory || cam.category === selectedCategory;

        return matchesQuery && matchesStatus && matchesQuality && matchesStreet && matchesCategory;
      });

      const heading = document.querySelector('.table-section h2');
      if (heading) {
        heading.textContent = `Spisak kamera (${filtered.length})`;
      }

      if (filtered.length === 0) {
        tableContainer.innerHTML = '<p>Nema rezultata za trenutnu pretragu.</p>';
        return;
      }

      tableContainer.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Objekt</th>
                <th>Ulica</th>
                <th>Kvaliteta</th>
                <th>Čuvanje (dana)</th>
                <th>Status</th>
                <th>Vlasnik</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(cam => `
                <tr>
                  <td><strong>${cam.objectName}</strong></td>
                  <td>${cam.street}</td>
                  <td>${cam.quality}</td>
                  <td><span class="retention-table-badge ${this.getRetentionIndicator(cam.retentionDays).className}">${this.getRetentionIndicator(cam.retentionDays).label}</span></td>
                  <td><span class="status-badge status-${cam.status}">${cam.status}</span></td>
                  <td>${cam.owner || '-'}</td>
                  <td>
                    <button class="btn-edit" data-id="${cam.id}">✏️ Uredi</button>
                    <button class="btn-delete" data-id="${cam.id}">🗑️ Obrisi</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    searchInput?.addEventListener('input', renderFilteredCameras);
    statusFilter?.addEventListener('change', renderFilteredCameras);
    qualityFilter?.addEventListener('change', renderFilteredCameras);
    streetFilter?.addEventListener('change', renderFilteredCameras);
    categoryFilter?.addEventListener('change', renderFilteredCameras);

    resetButton?.addEventListener('click', () => {
      searchInput.value = '';
      statusFilter.value = '';
      qualityFilter.value = '';
      streetFilter.value = '';
      categoryFilter.value = '';
      renderFilteredCameras();
    });
  }

  // ===== OBJEKTI =====

  loadObjects() {
    const cameras = this.storage.getAllCameras();
    const objects = {};

    cameras.forEach(camera => {
      if (!objects[camera.objectName]) objects[camera.objectName] = [];
      objects[camera.objectName].push(camera);
    });

    const html = `
      <div class="objects-container">
        <h1>🏢 Privatni Objekti</h1>
        <div class="objects-grid">
          ${Object.entries(objects).map(([name, cams], objectIndex) => {
            const totalCameraCount = cams.reduce((total, camera) => total + (Number(camera.cameraCount) || 1), 0);
            const latestStatusCheck = cams
              .map(camera => camera.statusCheckDate || camera.installDate)
              .filter(Boolean)
              .sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))[0] || 'Nije evidentirano';
            const objectCode = cams[0].objectCode || `OBJ-${String(objectIndex + 1).padStart(3, '0')}`;

            return `
              <section class="object-card">
                <div class="object-card-header">
                  <div>
                    <span class="object-code">${objectCode}</span>
                    <h3>${this.escapeHtml(name)}</h3>
                  </div>
                  <span class="object-camera-count">${totalCameraCount} kamera</span>
                </div>
                <div class="object-summary">
                  <p><strong>Ulica:</strong> ${this.escapeHtml(cams[0].street || '-')}</p>
                  <p><strong>Vlasnik:</strong> ${this.escapeHtml(cams[0].owner || 'Nepoznato')}</p>
                  <p><strong>Zadnja provjera statusa:</strong> ${this.formatDate(latestStatusCheck)}</p>
                </div>
                <button type="button" class="btn-secondary object-details-button" data-object-name="${this.escapeHtml(name)}">Otvori detalje objekta</button>
                ${cams[0].cameraPhotos?.[0] || cams[0].coveragePhoto ? `<div class="coverage-photo-card"><strong>Ugao pokrivanja kamere</strong><img src="${this.escapeHtml(cams[0].cameraPhotos?.[0] || cams[0].coveragePhoto)}" alt="Fotografija ugla pokrivanja kamere"></div>` : ''}
                <div class="object-camera-table-wrap">
                  <table class="object-camera-table">
                    <thead><tr><th>Kamera</th><th>Pozicija</th><th>Kvalitet</th><th>Status</th><th>Čuvanje</th><th>Akcije</th></tr></thead>
                    <tbody>
                      ${cams.flatMap(camera => {
                        const positions = Array.isArray(camera.cameraPositions) && camera.cameraPositions.length > 0
                          ? camera.cameraPositions
                          : Array.from({ length: Number(camera.cameraCount) || 1 }, () => 'Nije navedeno');
                        return positions.map((position, positionIndex) => ({ camera, position, positionIndex }));
                      }).map(({ camera, position, positionIndex }, cameraIndex) => {
                        const retention = this.getRetentionIndicator(camera.retentionDays);
                        const cameraCode = camera.cameraCodes?.[positionIndex] || `CAM-${String(objectIndex + 1).padStart(3, '0')}-${String(cameraIndex + 1).padStart(2, '0')}`;
                        return `<tr>
                          <td><strong>${cameraCode}</strong></td>
                          <td>${this.escapeHtml(position)}</td>
                          <td>${this.escapeHtml(camera.quality || '-')}</td>
                          <td><span class="status-badge status-${camera.status}">${this.escapeHtml(camera.status)}</span></td>
                          <td><span class="retention-table-badge ${retention.className}">${retention.label}</span></td>
                          <td class="object-camera-actions"><button class="btn-edit" data-id="${camera.id}">✏️</button><button class="btn-delete" data-id="${camera.id}">🗑️</button></td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </section>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
  }

  loadObjectDetails(objectName) {
    const cameras = this.storage.getAllCameras().filter(camera => camera.objectName === objectName);
    if (!cameras.length) {
      this.showToast('⚠️ Objekat nije pronađen.', 'error');
      return;
    }

    const firstCamera = cameras[0];
    const objectCode = firstCamera.objectCode || 'OBJ-001';
    const totalCameraCount = cameras.reduce((sum, camera) => sum + (Number(camera.cameraCount) || 1), 0);
    const latestStatusCheck = cameras
      .map(camera => camera.statusCheckDate || camera.installDate)
      .filter(Boolean)
      .sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))[0];

    const cameraRows = cameras.flatMap(camera => {
      const positions = Array.isArray(camera.cameraPositions) && camera.cameraPositions.length > 0
        ? camera.cameraPositions
        : Array.from({ length: Number(camera.cameraCount) || 1 }, () => 'Nije navedeno');
      return positions.map((position, positionIndex) => ({ camera, position, positionIndex }));
    });

    const html = `
      <div class="object-details-page">
        <button type="button" class="btn-back" id="backToObjects">← Nazad na privatne objekte</button>
        <div class="object-details-hero">
          <div>
            <span class="object-code">${objectCode}</span>
            <h1>${this.escapeHtml(objectName)}</h1>
            <p>${this.escapeHtml(firstCamera.street || 'Ulica nije navedena')}</p>
          </div>
          <span class="object-camera-count">${totalCameraCount} kamera</span>
        </div>
        <div class="object-details-summary">
          <p><strong>Vlasnik:</strong> ${this.escapeHtml(firstCamera.owner || 'Nepoznato')}</p>
          <p><strong>Kategorija:</strong> ${this.escapeHtml(firstCamera.category || '-')}</p>
          <p><strong>Zadnja provjera statusa:</strong> ${this.formatDate(latestStatusCheck)}</p>
        </div>
        <section class="object-detail-section">
          <h2>Kamere objekta</h2>
          <div class="object-detail-camera-grid">
            ${cameraRows.map(({ camera, position, positionIndex }, index) => {
              const cameraCode = camera.cameraCodes?.[positionIndex] || `CAM-${objectCode.replace('OBJ-', '')}-${String(index + 1).padStart(2, '0')}`;
              const retention = this.getRetentionIndicator(camera.retentionDays);
              const reviewHistory = this.getReviewHistory(camera);
              return `
                <article class="object-detail-camera-card">
                  <div class="object-detail-camera-heading">
                    <strong>${cameraCode}</strong>
                    <span class="status-badge status-${camera.status}">${this.escapeHtml(camera.status)}</span>
                  </div>
                  <p><strong>Pozicija:</strong> ${this.escapeHtml(position)}</p>
                  <p><strong>Kvalitet:</strong> ${this.escapeHtml(camera.quality || '-')}</p>
                  <p><strong>Čuvanje:</strong> <span class="retention-table-badge ${retention.className}">${retention.label}</span></p>
                  <p><strong>Pregled:</strong> ${this.formatDate(camera.lastMaintenance || camera.statusCheckDate)}</p>
                  <p><strong>Rezultat:</strong> <span class="${this.getReviewResultClass(camera.reviewResult)}">${this.escapeHtml(camera.reviewResult || 'Nije evidentirano')}</span></p>
                  ${(camera.cameraPhotos?.[positionIndex] || camera.coveragePhoto) ? `<div class="coverage-photo-card"><strong>Ugao pokrivanja</strong><img src="${this.escapeHtml(camera.cameraPhotos?.[positionIndex] || camera.coveragePhoto)}" alt="Ugao pokrivanja ${cameraCode}"></div>` : ''}
                  ${reviewHistory.length > 0 ? `<p class="detail-history-count">Istorija pregleda: ${reviewHistory.length}</p>` : ''}
                  <div class="card-actions"><button class="btn-edit" data-id="${camera.id}">✏️ Uredi</button><button class="btn-delete" data-id="${camera.id}">🗑️ Obriši</button></div>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
    document.getElementById('backToObjects')?.addEventListener('click', () => this.loadObjects());
  }

  // ===== ULICE =====

  loadStreets() {
    const streets = this.storage.getAllStreets();

    const html = `
      <div class="streets-container">
        <h1>🛣️ Ulice sa Kamerama</h1>
        ${streets.length > 0 ? `
          <div class="streets-list">
            ${streets.map(street => `
              <div class="street-item">
                <h3>${street.name}</h3>
                <p><strong>Broj kamera:</strong> ${street.cameraCount}</p>
                <button class="btn-secondary" onclick="app.viewStreetDetails('${street.name}')">Detalji 👁️</button>
              </div>
            `).join('')}
          </div>
        ` : '<p>Nema ulica sa kamerama.</p>'}
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
  }

  viewStreetDetails(street) {
    const cameras = this.storage.getCamerasByStreet(street);
    const html = `
      <div class="street-details">
        <button class="btn-back" onclick="app.loadStreets()">← Nazad</button>
        <h2>📍 ${street}</h2>
        <p><strong>Kamere na ovoj ulici:</strong> ${cameras.length}</p>
        <div class="cameras-list">
          ${cameras.map(cam => `
            <div class="camera-item">
              <h4>${cam.objectName}</h4>
              <p>Kvaliteta: ${cam.quality} | Status: ${cam.status}</p>
              <p>Vlasnik: ${cam.owner || '-'}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
  }

  // ===== MAPA =====

  loadMap() {
    const allCameras = this.storage.getAllCameras().filter(cam => {
      return cam.location && typeof cam.location.lat === 'number' && typeof cam.location.lng === 'number';
    });
    const statuses = this.storage.data.statuses;
    const qualities = this.storage.data.qualities;

    const html = `
      <div class="map-page-container">
        <h1>🗺️ Mapa Modriča</h1>

        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin:20px 0;">
          <select id="mapStatusFilter" style="padding:10px 12px; border-radius:10px; border:1px solid #4B5563; min-width:180px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
            <option value="">Svi statusi</option>
            ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
          </select>
          <select id="mapQualityFilter" style="padding:10px 12px; border-radius:10px; border:1px solid #4B5563; min-width:180px; background: rgba(17, 24, 39, 0.7); color: #F9FAFB;">
            <option value="">Sve kvalitete</option>
            ${qualities.map(quality => `<option value="${quality}">${quality}</option>`).join('')}
          </select>
          <button id="resetMapFilters" class="btn-secondary" style="padding:10px 14px; border-radius:10px;">Resetuj</button>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px;">
          <div>
            <div id="modricaMap" style="height: 520px; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #4B5563; background: rgba(17, 24, 39, 0.7);"></div>
          </div>
          <div>
            <h3>Kamere na mapi</h3>
            <div id="mapCameraList" class="map-camera-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 520px; overflow-y: auto;">
              ${allCameras.length > 0 ? allCameras.map(cam => `
                <div style="padding: 12px; border: 1px solid #4B5563; border-radius: 10px; background: rgba(17, 24, 39, 0.75); color: #F9FAFB;">
                  <strong>${cam.objectName}</strong><br>
                  <small style="color: #D1D5DB;">${cam.street}</small><br>
                  <small style="color: #D1D5DB;">${cam.status} • ${cam.quality}</small>
                </div>
              `).join('') : '<p style="color: #D1D5DB;">Nema lokacija za prikaz na mapi.</p>'}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;

    const statusFilter = document.getElementById('mapStatusFilter');
    const qualityFilter = document.getElementById('mapQualityFilter');
    const resetButton = document.getElementById('resetMapFilters');
    const mapList = document.getElementById('mapCameraList');

    const renderMapMarkers = () => {
      const selectedStatus = statusFilter?.value || '';
      const selectedQuality = qualityFilter?.value || '';
      const filteredCameras = allCameras.filter(cam => {
        const matchesStatus = !selectedStatus || cam.status === selectedStatus;
        const matchesQuality = !selectedQuality || cam.quality === selectedQuality;
        return matchesStatus && matchesQuality;
      });

      if (!window.L) return;

      const mapContainer = document.getElementById('modricaMap');
      if (!mapContainer) return;

      if (window.__modricaMapInstance) {
        window.__modricaMapInstance.remove();
      }

      const map = L.map('modricaMap').setView([44.9569, 18.3016], 12);
      window.__modricaMapInstance = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      if (filteredCameras.length === 0) {
        mapList.innerHTML = '<p>Nema rezultata za trenutnu pretragu na mapi.</p>';
        return;
      }

      mapList.innerHTML = filteredCameras.map(cam => `
        <div style="padding: 12px; border: 1px solid #4B5563; border-radius: 10px; background: rgba(17, 24, 39, 0.75); color: #F9FAFB;">
          <strong>${cam.objectName}</strong><br>
          <small style="color: #D1D5DB;">${cam.street}</small><br>
          <small style="color: #D1D5DB;">${cam.status} • ${cam.quality}</small>
        </div>
      `).join('');

      const markers = filteredCameras.map(cam => {
        const direction = Number(cam.location.direction || 0);
        const markerIcon = L.divIcon({
          className: 'camera-direction-marker',
          html: `<span class="camera-direction-triangle" style="transform: rotate(${direction}deg)"></span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });
        const marker = L.marker([cam.location.lat, cam.location.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(`
          <strong>${cam.objectName}</strong><br>
          ${cam.street}<br>
          <small>${cam.status} • ${cam.quality}</small><br>
          <small>Smjer: ${direction}°</small>
        `);
        return marker;
      });

      map.setView([44.9569, 18.3016], 13, { animate: false });
    };

    statusFilter?.addEventListener('change', renderMapMarkers);
    qualityFilter?.addEventListener('change', renderMapMarkers);
    resetButton?.addEventListener('click', () => {
      statusFilter.value = '';
      qualityFilter.value = '';
      renderMapMarkers();
    });

    renderMapMarkers();
  }

  // ===== IZVEŠTAJI =====

  loadReviews() {
    const cameras = this.storage.getAllCameras();
    const html = `
      <div class="reviews-container">
        <h1>📝 Evidencija pregleda</h1>
        <p class="page-intro">Pregled statusa i rezultata provjere registrovanih kamera.</p>
        ${cameras.length > 0 ? `
          <div class="review-grid">
            ${cameras.map(camera => {
              const reviewHistory = this.getReviewHistory(camera);
              return `
              <article class="review-card">
                <div class="review-card-header">
                  <div>
                    <h3>${this.escapeHtml(camera.objectName)}</h3>
                    <p>${this.escapeHtml(camera.street || 'Ulica nije navedena')}</p>
                  </div>
                  <span class="status-badge status-${camera.status}">${camera.status}</span>
                </div>
                <div class="review-details">
                  <p><strong>Posljednji pregled:</strong> ${this.formatDate(camera.lastMaintenance || camera.statusCheckDate || camera.installDate)}</p>
                  <p><strong>Pregled izvršio:</strong> ${this.escapeHtml(camera.reviewedBy || 'Nije evidentirano')}</p>
                  <p><strong>Rezultat:</strong> <span class="${this.getReviewResultClass(camera.reviewResult)}">${this.escapeHtml(camera.reviewResult || 'Nije evidentirano')}</span></p>
                </div>
                <div class="review-history">
                  <h4>Istorija pregleda</h4>
                  ${reviewHistory.length > 0 ? `
                    <ul>
                      ${reviewHistory.slice().reverse().map(review => `
                        <li>
                          <strong>${this.formatDate(review.date)}</strong>
                          <span>${this.escapeHtml(review.reviewer)}</span>
                          <em class="${this.getReviewResultClass(review.result)}">${this.escapeHtml(review.result)}</em>
                        </li>
                      `).join('')}
                    </ul>
                  ` : '<p>Nema zabilježenih prethodnih pregleda.</p>'}
                </div>
                <button type="button" class="btn-primary review-button" data-review-id="${camera.id}">+ Zabilježi pregled</button>
              </article>
            `;
            }).join('')}
          </div>
        ` : '<div class="report-section"><p>Nema kamera za evidenciju pregleda.</p></div>'}
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
  }

  handleAddReview(id) {
    const camera = this.storage.getCameraById(parseInt(id, 10));
    if (!camera) return;

    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const fields = `
      <div class="modal-form-grid review-form-grid">
        <label class="full-width">
          <span>Datum pregleda</span>
          <input type="date" id="reviewDate" value="${camera.lastMaintenance || todayValue}" required>
        </label>
        <label>
          <span>Pregled izvršio</span>
          <input type="text" id="reviewedBy" value="${this.escapeHtml(camera.reviewedBy || 'Administrator')}" required>
        </label>
        <label>
          <span>Rezultat</span>
          <select id="reviewResult">
            ${['Ispravno', 'Potrebna pažnja', 'Neispravno'].map(result => `<option value="${result}" ${result === (camera.reviewResult || 'Ispravno') ? 'selected' : ''}>${result}</option>`).join('')}
          </select>
        </label>
      </div>
    `;

    this.openModal({
      title: `Zabilježi pregled: ${camera.objectName}`,
      message: fields,
      confirmText: 'Sačuvaj pregled',
      messageIsHtml: true,
      onConfirm: () => {
        const reviewDate = document.getElementById('reviewDate')?.value;
        const reviewedBy = document.getElementById('reviewedBy')?.value.trim();
        const reviewResult = document.getElementById('reviewResult')?.value;

        if (!reviewDate || !reviewedBy || !reviewResult) {
          this.showToast('⚠️ Popunite sva polja pregleda.', 'error');
          return;
        }

        const reviewHistory = this.getReviewHistory(camera);
        reviewHistory.push({
          date: reviewDate,
          reviewer: reviewedBy,
          result: reviewResult
        });

        this.storage.updateCamera(camera.id, {
          lastMaintenance: reviewDate,
          reviewedBy,
          reviewResult,
          reviewHistory
        });
        this.showToast('✅ Pregled je uspješno zabilježen.', 'success');
        this.loadReviews();
      }
    });
  }

  // ===== IZVEŠTAJI =====

  loadReports() {
    const stats = this.storage.getStatistics();
    const cameras = this.storage.getAllCameras();
    const brokenCameras = cameras.filter(c => c.status === 'neispravna');
    const inactiveCameras = cameras.filter(c => c.status === 'neaktivna');

    const html = `
      <div class="reports-container">
        <h1>📋 Izveštaji</h1>

        <div class="report-section">
          <h2>Sažetak</h2>
          <div class="report-data">
            <p><strong>Ukupno kamera:</strong> ${stats.totalCameras}</p>
            <p><strong>Aktivne kamere:</strong> ${stats.activeCount}</p>
            <p><strong>Neispravne kamere:</strong> ${stats.brokenCount}</p>
            <p><strong>Neaktivne kamere:</strong> ${stats.inactiveCount}</p>
            <p><strong>Prosečno vreme čuvanja:</strong> ${stats.averageRetentionDays} dana</p>
          </div>
        </div>

        ${brokenCameras.length > 0 ? `
          <div class="report-section warning">
            <h2>⚠️ Neispravne kamere</h2>
            <div class="report-list">
              ${brokenCameras.map(cam => `
                <div class="report-item">
                  <strong>${cam.objectName}</strong> - ${cam.street}<br>
                  <small>Provjera statusa: ${this.formatDate(cam.statusCheckDate || cam.installDate)} | Zadnji pregled: ${this.formatDate(cam.lastMaintenance)}</small>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${inactiveCameras.length > 0 ? `
          <div class="report-section warning">
            <h2>🔴 Neaktivne kamere</h2>
            <div class="report-list">
              ${inactiveCameras.map(cam => `
                <div class="report-item">
                  <strong>${cam.objectName}</strong> - ${cam.street}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
  }

  // ===== POSTAVKE =====

  loadSettings() {
    const html = `
      <div class="settings-container">
        <h1>⚙️ Postavke</h1>

        <div class="settings-section">
          <h2>📊 Opšte postavke</h2>
          <label>
            <input type="checkbox" id="notificationsEnabled" checked>
            Omogući notifikacije za istekuće kamere
          </label>
        </div>

        <div class="settings-section">
          <h2>💾 Backup podataka</h2>
          <button class="btn-secondary" data-format="json" onclick="app.handleExport('json')">⬇️ Preuzmi backup (JSON)</button>
          <button class="btn-secondary" data-format="csv" onclick="app.handleExport('csv')">⬇️ Preuzmi backup (CSV)</button>
        </div>

        <div class="settings-section">
          <h2>🔄 Obnova podataka</h2>
          <label>
            Učitaj backup:
            <input type="file" id="importFile" accept=".json,.csv" onchange="app.handleImport(event)">
          </label>
        </div>

        <div class="settings-section danger">
          <h2>🗑️ Opasne akcije</h2>
          <button class="btn-danger" onclick="app.storage.clearAll()">Obriši sve podatke</button>
          <p style="color: #e74c3c; font-size: 12px;">⚠️ Ovo će obrisati sve podatke! Napravite rezervnu kopiju pre nego što nastavite.</p>
        </div>

        <div class="settings-info">
          <h3>ℹ️ O aplikaciji</h3>
          <p>Sistem za evidenciju privatnih objekata sa kamerama</p>
          <p>Verzija: 1.0.0</p>
        </div>
      </div>
    `;

    document.getElementById('mainContent').innerHTML = html;
  }

  initCameraLocationMap(cameras) {
    const mapContainer = document.getElementById('cameraLocationMap');
    if (!mapContainer || !window.L) return;

    const modricaCenter = [44.9569, 18.3016];
    const map = L.map('cameraLocationMap').setView(modricaCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const latInput = document.getElementById('locationLat');
    const lngInput = document.getElementById('locationLng');
    const addressInput = document.getElementById('locationAddress');
    const directionInput = document.getElementById('locationDirection');
    const directionValue = document.getElementById('locationDirectionValue');
    let currentMarker = null;

    const getDirectionName = (degrees) => {
      const directions = ['sjever', 'sjeveroistok', 'istok', 'jugoistok', 'jug', 'jugozapad', 'zapad', 'sjeverozapad'];
      return directions[Math.round(Number(degrees) / 45) % directions.length];
    };

    const updateDirectionLabel = (degrees) => {
      if (directionValue) {
        directionValue.textContent = `${degrees}° - ${getDirectionName(degrees)}`;
      }
    };

    const createCameraIcon = (degrees = 0) => L.divIcon({
      className: 'camera-direction-marker',
      html: `<span class="camera-direction-triangle" style="transform: rotate(${degrees}deg)"></span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const setCurrentMarker = (lat, lng, degrees = Number(directionInput?.value || 0)) => {
      if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
        currentMarker.setIcon(createCameraIcon(degrees));
      } else {
        currentMarker = L.marker([lat, lng], {
          draggable: true,
          icon: createCameraIcon(degrees),
          title: 'Lokacija trenutno unesene kamere'
        }).addTo(map);
        currentMarker.bindTooltip('Trenutno unesena kamera', { direction: 'top' });
        currentMarker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          setCoordinatesFromMap(position.lat, position.lng);
        });
      }
    };

    const setCoordinatesFromMap = (lat, lng) => {
      if (latInput) latInput.value = Number(lat).toFixed(6);
      if (lngInput) lngInput.value = Number(lng).toFixed(6);
    };

    map.on('click', (event) => {
      setCoordinatesFromMap(event.latlng.lat, event.latlng.lng);
      if (addressInput) {
        addressInput.value = `Lokacija ${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`;
      }
      setCurrentMarker(event.latlng.lat, event.latlng.lng);
    });

    directionInput?.addEventListener('input', () => {
      const degrees = Number(directionInput.value);
      updateDirectionLabel(degrees);
      if (currentMarker) {
        const position = currentMarker.getLatLng();
        currentMarker.setIcon(createCameraIcon(degrees));
        currentMarker.setLatLng(position);
      }
    });

    updateDirectionLabel(Number(directionInput?.value || 0));

    cameras.forEach(cam => {
      const lat = cam.location?.lat;
      const lng = cam.location?.lng;
      if (typeof lat === 'number' && typeof lng === 'number') {
        const marker = L.marker([lat, lng], { icon: createCameraIcon(cam.location.direction || 0) }).addTo(map);
        marker.bindPopup(`<strong>${cam.objectName}</strong><br>${cam.street}<br>${cam.location?.address || ''}`);
      }
    });
  }

  bindImageUpload(inputId, previewId, existingImage = '') {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;

    const showPreview = (imageData) => {
      if (!imageData) return;
      preview.src = imageData;
      preview.classList.remove('hidden');
    };

    showPreview(existingImage);
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        input.dataset.imageData = reader.result;
        showPreview(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  bindCameraPositionFields(countId, containerId, existingPositions = [], existingPhotos = []) {
    const countInput = document.querySelector(countId.startsWith('#') ? countId : `#${countId}`);
    const container = document.getElementById(containerId);
    if (!countInput || !container) return;

    const renderPositions = () => {
      const count = Math.max(1, Number.parseInt(countInput.value, 10) || 1);
      const currentValues = Array.from(container.querySelectorAll('.camera-position-input')).map(input => input.value);
      const currentPhotos = Array.from(container.querySelectorAll('.camera-position-photo')).map(input => input.dataset.imageData || '');
      const values = existingPositions.length > 0 ? existingPositions : currentValues;
      const photos = existingPhotos.length > 0 ? existingPhotos : currentPhotos;

      container.innerHTML = `
        <div class="camera-positions-title">Pozicije kamera</div>
        <div class="camera-positions-grid">
          ${Array.from({ length: count }, (_, index) => `
            <label>
              <span>Kamera ${index + 1} - pozicija</span>
              <input class="camera-position-input" type="text" data-position-index="${index}" value="${this.escapeHtml(values[index] || '')}" placeholder="npr. Ulaz, garaža, dvorište" required>
              <span>Fotografija ugla pokrivanja</span>
              <input class="camera-position-photo" type="file" data-position-index="${index}" accept="image/*">
              <img class="coverage-photo-preview camera-position-photo-preview ${photos[index] ? '' : 'hidden'}" data-position-index="${index}" src="${photos[index] ? this.escapeHtml(photos[index]) : ''}" alt="Pregled ugla kamere ${index + 1}">
              <button type="button" class="camera-position-photo-remove ${photos[index] ? '' : 'hidden'}" data-position-index="${index}">Ukloni sliku</button>
            </label>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.camera-position-photo').forEach(input => {
        input.addEventListener('change', () => {
          const file = input.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            input.dataset.imageData = reader.result;
            const preview = container.querySelector(`.camera-position-photo-preview[data-position-index="${input.dataset.positionIndex}"]`);
            if (preview) {
              preview.src = reader.result;
              preview.classList.remove('hidden');
            }
            const removeButton = container.querySelector(`.camera-position-photo-remove[data-position-index="${input.dataset.positionIndex}"]`);
            removeButton?.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        });
      });

      container.querySelectorAll('.camera-position-photo-remove').forEach(button => {
        button.addEventListener('click', () => {
          const index = button.dataset.positionIndex;
          const input = container.querySelector(`.camera-position-photo[data-position-index="${index}"]`);
          const preview = container.querySelector(`.camera-position-photo-preview[data-position-index="${index}"]`);
          if (input) {
            input.value = '';
            input.dataset.imageData = '';
          }
          preview?.classList.add('hidden');
          button.classList.add('hidden');
        });
      });
    };

    countInput.addEventListener('input', renderPositions);
    renderPositions();
  }

  collectCameraPositions(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .camera-position-input`))
      .map(input => input.value.trim());
  }

  collectCameraPhotos(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .camera-position-photo`))
      .map(input => input.dataset.imageData || '');
  }

  // ===== HANDLERS =====

  handleAddCamera(e) {
    e.preventDefault();

    const requiredFields = [
      { id: 'objectName', label: 'Naziv objekta' },
      { id: 'street', label: 'Ulica' },
      { id: 'quality', label: 'Kvaliteta' },
      { id: 'retentionDays', label: 'Dana čuvanja' },
      { id: 'status', label: 'Status' },
      { id: 'statusCheckDate', label: 'Datum provjere statusa kamere' }
    ];

    const missing = requiredFields.find(field => {
      const value = document.getElementById(field.id)?.value?.trim();
      return !value;
    });

    if (missing) {
      this.showToast(`⚠️ Polje "${missing.label}" je obavezno.`, 'error');
      return;
    }

    const camera = {
      objectName: document.getElementById('objectName').value.trim(),
      street: document.getElementById('street').value.trim(),
      quality: document.getElementById('quality').value,
      retentionDays: parseInt(document.getElementById('retentionDays').value, 10),
      status: document.getElementById('status').value,
      statusCheckDate: document.getElementById('statusCheckDate').value,
      owner: document.getElementById('owner').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: '',
      cameraCount: parseInt(document.getElementById('cameraCount').value, 10) || 1,
      cameraPositions: this.collectCameraPositions('cameraPositions'),
      cameraPhotos: this.collectCameraPhotos('cameraPositions'),
      category: document.getElementById('category').value,
      securityLevel: document.getElementById('securityLevel').value,
      notes: document.getElementById('notes').value.trim(),
      coveragePhoto: document.getElementById('coveragePhoto')?.dataset.imageData || '',
      lastMaintenance: new Date().toISOString().split('T')[0],
      location: {
        address: document.getElementById('locationAddress').value.trim() || '',
        lat: parseFloat(document.getElementById('locationLat').value),
        lng: parseFloat(document.getElementById('locationLng').value),
        direction: parseInt(document.getElementById('locationDirection').value, 10) || 0
      }
    };

    if (camera.cameraPositions.some(position => !position)) {
      this.showToast('⚠️ Unesite poziciju za svaku kameru.', 'error');
      return;
    }

    if (Number.isNaN(camera.location.lat) || Number.isNaN(camera.location.lng)) {
      camera.location = undefined;
    }

    this.storage.addCamera(camera);
    this.showToast('✅ Kamera je uspešno dodana!', 'success');
    this.currentPage = 'cameras';
    this.loadPageContent();
  }

  handleDeleteCamera(id) {
    const cameraId = parseInt(id, 10);
    const camera = this.storage.getCameraById(cameraId);
    if (!camera) return;

    this.openModal({
      title: 'Arhiviranje kamere',
      message: `Kamera "${camera.objectName}" će biti premještena u arhivu. Podaci se mogu kasnije vratiti.`,
      confirmText: 'Arhiviraj',
      confirmVariant: 'danger',
      onConfirm: () => {
        this.storage.archiveCamera(cameraId);
        this.showToast('🗄️ Kamera je premještena u arhivu.', 'success');
        this.loadPageContent();
      }
    });
  }

  loadArchive() {
    const archived = this.storage.getArchivedCameras();
    const html = `
      <div class="archive-container">
        <h1>🗄️ Arhiva kamera</h1>
        <p class="page-intro">Arhivirane kamere nisu obrisane i mogu se vratiti u aktivnu evidenciju.</p>
        ${archived.length > 0 ? `<div class="archive-list">
          ${archived.map(camera => `
            <article class="archive-item">
              <div>
                <strong>${this.escapeHtml(camera.objectName)}</strong>
                <span>${this.escapeHtml(camera.street || '-')}</span>
                <small>Arhivirano: ${this.formatDate(camera.archivedAt)}</small>
              </div>
              <button type="button" class="btn-primary restore-camera-button" data-id="${camera.id}">Vrati kameru</button>
            </article>
          `).join('')}
        </div>` : '<div class="report-section"><p>Arhiva je prazna.</p></div>'}
      </div>
    `;
    document.getElementById('mainContent').innerHTML = html;
  }

  handleRestoreCamera(id) {
    if (this.storage.restoreCamera(parseInt(id, 10))) {
      this.showToast('✅ Kamera je vraćena iz arhive.', 'success');
      this.loadArchive();
    }
  }

  handleEditCamera(id) {
    const camera = this.storage.getCameraById(parseInt(id, 10));
    if (!camera) return;

    const fields = `
      <div class="modal-form-grid">
        <label>
          <span>Naziv objekta</span>
          <input type="text" name="objectName" value="${this.escapeHtml(camera.objectName || '')}" required>
        </label>
        <label>
          <span>Ulica</span>
          <input type="text" name="street" value="${this.escapeHtml(camera.street || '')}" required>
        </label>
        <label>
          <span>Kvaliteta</span>
          <select name="quality">
            ${this.storage.data.qualities.map(q => `<option value="${q}" ${q === camera.quality ? 'selected' : ''}>${q}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status">
            ${this.storage.data.statuses.map(s => `<option value="${s}" ${s === camera.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Broj dana čuvanja</span>
          <input type="number" name="retentionDays" value="${camera.retentionDays || 0}" min="1" required>
        </label>
        <label>
          <span>Broj kamera</span>
          <input type="number" name="cameraCount" value="${camera.cameraCount || 1}" min="1" required>
        </label>
        <div id="editCameraPositions" class="camera-positions full-width"></div>
        <label>
          <span>Vlasnik</span>
          <input type="text" name="owner" value="${this.escapeHtml(camera.owner || '')}">
        </label>
        <label>
          <span>Telefon</span>
          <input type="tel" name="phone" value="${this.escapeHtml(camera.phone || '')}">
        </label>
        <label>
          <span>Kategorija</span>
          <select name="category">
            <option value="">Bez kategorije</option>
            ${this.storage.data.categories.map(c => `<option value="${c}" ${c === camera.category ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>
        <label>
          <span>Sigurnosni nivo</span>
          <select name="securityLevel">
            <option value="">Nije postavljeno</option>
            ${this.storage.data.securityLevels.map(level => `<option value="${level}" ${level === camera.securityLevel ? 'selected' : ''}>${level}</option>`).join('')}
          </select>
        </label>
        <label class="full-width">
          <span>Datum provjere statusa kamere</span>
          <input type="date" name="statusCheckDate" value="${camera.statusCheckDate || camera.installDate || ''}" required>
        </label>
        <label class="full-width">
          <span>Napomene</span>
          <textarea name="notes">${this.escapeHtml(camera.notes || '')}</textarea>
        </label>
      </div>
    `;

    this.openModal({
      title: 'Uredi kameru',
      message: fields,
      confirmText: 'Sačuvaj',
      confirmVariant: 'primary',
      messageIsHtml: true,
      onConfirm: () => {
        const form = document.querySelector('#appModal .modal-form-grid');
        if (!form) return;

        const payload = {
          objectName: form.querySelector('[name="objectName"]').value.trim(),
          street: form.querySelector('[name="street"]').value.trim(),
          quality: form.querySelector('[name="quality"]').value,
          retentionDays: Number(form.querySelector('[name="retentionDays"]').value),
          cameraCount: Number(form.querySelector('[name="cameraCount"]').value) || 1,
          status: form.querySelector('[name="status"]').value,
          statusCheckDate: form.querySelector('[name="statusCheckDate"]').value,
          owner: form.querySelector('[name="owner"]').value.trim(),
          phone: form.querySelector('[name="phone"]').value.trim(),
          email: camera.email || '',
          cameraPositions: this.collectCameraPositions('editCameraPositions'),
          cameraPhotos: this.collectCameraPhotos('editCameraPositions'),
          category: form.querySelector('[name="category"]').value,
          securityLevel: form.querySelector('[name="securityLevel"]').value,
          notes: form.querySelector('[name="notes"]').value.trim(),
          coveragePhoto: ''
        };

        if (!payload.objectName || !payload.street || !payload.statusCheckDate || !payload.retentionDays || payload.cameraCount < 1 || payload.cameraPositions.length !== payload.cameraCount || payload.cameraPositions.some(position => !position)) {
          this.showToast('⚠️ Sva obavezna polja moraju biti popunjena.', 'error');
          return;
        }

        this.storage.updateCamera(camera.id, payload);
        this.showToast('✅ Kamera je uspešno uređena.', 'success');
        this.loadPageContent();
      }
    });
    this.bindCameraPositionFields('appModal input[name="cameraCount"]', 'editCameraPositions', camera.cameraPositions || [], camera.cameraPhotos || (camera.coveragePhoto ? [camera.coveragePhoto] : []));
  }

  escapeHtml(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  handleExport(format) {
    let data, filename, mime;

    if (format === 'json') {
      data = this.storage.exportToJSON();
      filename = 'kamera_evidencija.json';
      mime = 'application/json';
    } else if (format === 'csv') {
      data = this.storage.exportToCSV();
      filename = 'kamera_evidencija.csv';
      mime = 'text/csv';
    } else {
      return;
    }

    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    this.showToast(`📥 Preuzeta datoteka: ${filename}`, 'success');
  }

  handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (this.storage.importFromJSON(content)) {
          this.showToast('✅ Podaci uspešno učitani!', 'success');
          this.loadPageContent();
        } else {
          this.showToast('❌ Greška pri učitavanju datoteke.', 'error');
        }
      } catch (error) {
        this.showToast('❌ Greška: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  refreshUI() {
    this.loadPageContent();
  }
}

// Kreira globalnu instancu aplikacije
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CameraApp();
});
