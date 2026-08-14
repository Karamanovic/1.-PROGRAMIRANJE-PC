// Storage - Upravljanje podacima aplikacije
// Koristi LocalStorage za perzistenciju podataka

class CameraStorage {
  constructor() {
    this.storageKey = 'cameraEvidenceData';
    this.loadData();
  }

  // Učitaj podatke iz LocalStorage ili koristi defaultne
  loadData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.data = JSON.parse(stored);
      } catch (e) {
        console.error('Greška pri učitavanju podataka:', e);
        this.data = this.getDefaultData();
      }
    } else {
      this.data = this.getDefaultData();
    }

    this.migrateCategoryName();
    this.migrateIdentifiers();
    this.updateStreetCounts();
  }

  migrateCategoryName() {
    if (!this.data || !Array.isArray(this.data.categories)) return;

    this.data.categories = this.data.categories.map(category =>
      category === 'mali biznis' ? 'privatna firma' : category
    );

    if (Array.isArray(this.data.cameras)) {
      this.data.cameras.forEach(camera => {
        if (camera.category === 'mali biznis') {
          camera.category = 'privatna firma';
        }
      });
    }
  }

  migrateIdentifiers() {
    if (!this.data || !Array.isArray(this.data.cameras)) return;

    const objectCodes = new Map();
    let nextObjectNumber = 1;

    this.data.cameras.forEach(camera => {
      if (!objectCodes.has(camera.objectName)) {
        objectCodes.set(camera.objectName, camera.objectCode || `OBJ-${String(nextObjectNumber).padStart(3, '0')}`);
        nextObjectNumber++;
      }
      camera.objectCode = objectCodes.get(camera.objectName);
      const count = Math.max(1, Number.parseInt(camera.cameraCount, 10) || 1);
      const existingCodes = Array.isArray(camera.cameraCodes) ? camera.cameraCodes : [];
      camera.cameraCodes = Array.from({ length: count }, (_, index) => (
        existingCodes[index] || `${camera.objectCode.replace('OBJ-', 'CAM-')}-${String(index + 1).padStart(2, '0')}`
      ));
    });
  }

  // Spremi podatke u LocalStorage
  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      this.triggerUpdate();
    } catch (e) {
      console.error('Greška pri spremanju podataka:', e);
    }
  }

  // Default struktura podataka
  getDefaultData() {
    return {
      cameras: [
        {
          id: 1,
          objectName: "Privatna kuća - Marković",
          street: "Kralja Vladimira 15",
          quality: "Full HD (1080p)",
          retentionDays: 30,
          status: "aktivna",
          statusCheckDate: "2024-01-15",
          owner: "Ivan Marković",
          phone: "091 123 4567",
          email: "ivan.markovic@email.com",
          cameraCount: 2,
          securityLevel: "privatni prostor",
          category: "kuća",
          notes: "Kamera kod ulaznih vrata i u garaži",
          lastMaintenance: "2025-07-20",
          reviewHistory: [],
          location: {
            address: "Kralja Vladimira 15, Modriča",
            lat: 44.9554,
            lng: 18.7681
          }
        }
      ],
      streets: [],
      categories: ["kuća", "privatna firma", "poslovna zgrada", "drugi"],
      qualities: ["480p", "720p (HD)", "Full HD (1080p)", "2K", "4K"],
      statuses: ["aktivna", "neaktivna", "neispravna", "u popravci"],
      securityLevels: ["javni prostor", "privatni prostor", "strogo poverljivo"]
    };
  }

  // ===== KAMERA OPERACIJE =====

  // Dodaj novu kameru
  addCamera(camera) {
    const id = Math.max(0, ...this.data.cameras.map(c => c.id)) + 1;
    camera.id = id;
    this.data.cameras.push(camera);
    this.migrateIdentifiers();
    this.updateStreetCounts();
    this.saveData();
    return camera;
  }

  // Dohvati sve kamere
  getAllCameras() {
    return this.data.cameras;
  }

  // Dohvati kameru po ID-u
  getCameraById(id) {
    return this.data.cameras.find(c => c.id === id);
  }

  getArchivedCameras() {
    return Array.isArray(this.data.archivedCameras) ? this.data.archivedCameras : [];
  }

  archiveCamera(id) {
    const index = this.data.cameras.findIndex(camera => camera.id === id);
    if (index === -1) return false;
    const [camera] = this.data.cameras.splice(index, 1);
    camera.archivedAt = new Date().toISOString().split('T')[0];
    if (!Array.isArray(this.data.archivedCameras)) this.data.archivedCameras = [];
    this.data.archivedCameras.push(camera);
    this.updateStreetCounts();
    this.saveData();
    return true;
  }

  restoreCamera(id) {
    const archived = this.getArchivedCameras();
    const index = archived.findIndex(camera => camera.id === id);
    if (index === -1) return false;
    const [camera] = archived.splice(index, 1);
    delete camera.archivedAt;
    this.data.cameras.push(camera);
    this.updateStreetCounts();
    this.saveData();
    return true;
  }

  // Ažuriraj kameru
  updateCamera(id, updates) {
    const camera = this.getCameraById(id);
    if (camera) {
      Object.assign(camera, updates);
      this.migrateIdentifiers();
      this.updateStreetCounts();
      this.saveData();
      return camera;
    }
    return null;
  }

  // Obriši kameru
  deleteCamera(id) {
    const index = this.data.cameras.findIndex(c => c.id === id);
    if (index > -1) {
      this.data.cameras.splice(index, 1);
      this.updateStreetCounts();
      this.saveData();
      return true;
    }
    return false;
  }

  // Pretraži kamere
  searchCameras(query) {
    const q = query.toLowerCase();
    return this.data.cameras.filter(c =>
      c.objectName.toLowerCase().includes(q) ||
      c.street.toLowerCase().includes(q) ||
      c.owner.toLowerCase().includes(q)
    );
  }

  // Filtriraj kamere
  filterCameras(filters) {
    return this.data.cameras.filter(camera => {
      if (filters.status && camera.status !== filters.status) return false;
      if (filters.quality && camera.quality !== filters.quality) return false;
      if (filters.category && camera.category !== filters.category) return false;
      if (filters.securityLevel && camera.securityLevel !== filters.securityLevel) return false;
      if (filters.street && camera.street !== filters.street) return false;
      return true;
    });
  }

  // ===== ULICA OPERACIJE =====

  getPhysicalCameraCount(camera) {
    return Math.max(1, Number.parseInt(camera.cameraCount, 10) || 1);
  }

  // Ažuriraj statistiku ulica
  updateStreetCounts() {
    const streets = {};
    this.data.cameras.forEach(camera => {
      const street = camera.street;
      if (!streets[street]) {
        streets[street] = 0;
      }
      streets[street] += this.getPhysicalCameraCount(camera);
    });

    this.data.streets = Object.keys(streets).map(street => ({
      name: street,
      cameraCount: streets[street]
    }));
  }

  // Dohvati sve ulice
  getAllStreets() {
    return this.data.streets;
  }

  // Dohvati kamere po ulici
  getCamerasByStreet(street) {
    return this.data.cameras.filter(c => c.street === street);
  }

  // ===== STATISTIKE =====

  // Dohvati statistike
  getStatistics() {
    const totalCameras = this.data.cameras.reduce((sum, camera) => sum + this.getPhysicalCameraCount(camera), 0);
    const weightedRetention = this.data.cameras.reduce((sum, camera) => (
      sum + (Number(camera.retentionDays) || 0) * this.getPhysicalCameraCount(camera)
    ), 0);

    return {
      totalCameras,
      totalStreets: this.data.streets.length,
      activeCount: this.countCamerasByStatus('aktivna'),
      inactiveCount: this.countCamerasByStatus('neaktivna'),
      brokenCount: this.countCamerasByStatus('neispravna'),
      averageRetentionDays: Math.round(
        weightedRetention / (totalCameras || 1)
      ),
      qualityDistribution: this.getQualityDistribution(),
      categoryDistribution: this.getCategoryDistribution()
    };
  }

  countCamerasByStatus(status) {
    return this.data.cameras
      .filter(camera => camera.status === status)
      .reduce((sum, camera) => sum + this.getPhysicalCameraCount(camera), 0);
  }

  // Distribucija kvaliteta
  getQualityDistribution() {
    const dist = {};
    this.data.cameras.forEach(camera => {
      dist[camera.quality] = (dist[camera.quality] || 0) + this.getPhysicalCameraCount(camera);
    });
    return dist;
  }

  // Distribucija kategorija
  getCategoryDistribution() {
    const dist = {};
    this.data.cameras.forEach(camera => {
      dist[camera.category] = (dist[camera.category] || 0) + this.getPhysicalCameraCount(camera);
    });
    return dist;
  }

  // Kamere sa istekućim vremenom čuvanja
  getExpiringRetentionCameras(daysThreshold = 7) {
    const today = new Date();
    return this.data.cameras.filter(camera => {
      const statusCheckDate = camera.statusCheckDate || camera.installDate;
      if (!statusCheckDate) return false;
      const expiryDate = new Date(statusCheckDate);
      expiryDate.setTime(expiryDate.getTime() + camera.retentionDays * 24 * 60 * 60 * 1000);
      const daysUntilExpiry = Math.floor((expiryDate - today) / (24 * 60 * 60 * 1000));
      return daysUntilExpiry <= daysThreshold && daysUntilExpiry >= 0;
    });
  }

  // ===== EXPORT/IMPORT =====

  // Export u JSON
  exportToJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  // Export u CSV
  exportToCSV() {
    const cameras = this.data.cameras;
    if (cameras.length === 0) return '';

    const headers = Object.keys(cameras[0]);
    const csv = [headers.join(',')];

    cameras.forEach(camera => {
      const row = headers.map(header => {
        const value = camera[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csv.push(row.join(','));
    });

    return csv.join('\n');
  }

  // Import iz JSON
  importFromJSON(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.cameras && Array.isArray(imported.cameras)) {
        this.data = imported;
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error('Greška pri importu:', e);
    }
    return false;
  }

  // ===== EVENT HANDLERS =====

  // Registriraj callback za promjene podataka
  onUpdate(callback) {
    this.updateCallback = callback;
  }

  // Trigeruj update
  triggerUpdate() {
    if (this.updateCallback) {
      this.updateCallback(this.data);
    }
  }

  // Očisti sve podatke
  clearAll() {
    if (confirm('Sigurno želite obrisati sve podatke?')) {
      localStorage.removeItem(this.storageKey);
      this.loadData();
      return true;
    }
    return false;
  }
}

// Kreira globalni storage objekta
const storage = new CameraStorage();
