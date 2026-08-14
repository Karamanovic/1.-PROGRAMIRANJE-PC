# 🚀 BRZI START VODIČ - Evidencija Kamera Modrica

## ✅ Što je Kreirano?

Kompletna web aplikacija za evidenciju kamera s sljedećim datotekama:

### 📁 HTML Datoteke
- ✅ **index.html** - Glavna aplikacija (SPA - Single Page Application)
- ✅ **map.html** - Mapa kamera s Leaflet.js integracijom

### 🎨 CSS Datoteke
- ✅ **css/style.css** - Osnovni stilovi (600+ linija)
- ✅ **css/dashboard.css** - Dashboard specifični stilovi
- ✅ **css/responsive.css** - Responzivni dizajn (Mobile-optimized)

### 🔧 JavaScript Datoteke
- ✅ **js/storage.js** - Upravljanje podacima (LocalStorage)
- ✅ **js/app.js** - Glavna aplikacija s svim funkcijama
- ✅ **js/map.js** - Mapiranje kamera (Leaflet.js priprema)
- ✅ **js/validators.js** - Validacija podataka
- ✅ **js/export.js** - Dodatne export opcije (XML, PDF, TSV)

### 📊 Podaci
- ✅ **data/cameras.json** - Primjer podataka

### 📚 Dokumentacija
- ✅ **README.md** - Detaljna dokumentacija
- ✅ **BRZI_START.md** - Ovaj vodič

---

## 🎯 Kako Početi?

### 1️⃣ Otvorite aplikaciju
```
Otvorite `index.html` u web pregledniku (Chrome, Firefox, Safari, Edge)
```

### 2️⃣ Prvu akciju - Dodajte kameru
1. Kliknite na "📷 Evidencija Kamera" u navigaciji
2. Popunite formu (označeni sa * su obavezni):
   - **Naziv objekta**: npr. "Privatna kuća - Marković"
   - **Ulica**: npr. "Kralja Vladimira 15"
   - **Kvaliteta**: odaberite iz liste
   - **Dane čuvanja**: npr. 30
   - **Status**: odaberite status kamere
   - **Datum instalacije**: izaberite datum
   - Ostala polja su opciona
3. Kliknite "Dodaj kameru"

### 3️⃣ Pregledajte podatke
- **Kontrolna Ploča**: Vidi sve statistike
- **Privatni Objekti**: Vidi kartice s objektima
- **Ulice**: Vidi ulice s brojem kamera
- **Izvještaji**: Vidi problematične kamere
- **Mapa**: Vidi kamere na karti

### 4️⃣ Izvezite podatke
- Kliknite na "⬇️ Export JSON" ili "⬇️ Export CSV"
- Datoteka će se preuzeti na vašu računalo

---

## 🎨 Karakteristike po Stranici

### 📊 Kontrolna Ploča
```
┌─────────────────────────────────────────┐
│  📷        ✅         🛣️        💾      │
│ Ukupno   Aktivne    Ulice   Čuvanje   │
│ 100      85         15      45 dana   │
└─────────────────────────────────────────┘
└─ Grafikon distribucije po kategorijama
└─ Upozorenja za istekuće kamere
└─ Gumbovi za dodavanje i export
```

### 📷 Evidencija Kamera
```
┌─ FORMA ZA DODAVANJE KAMERE ─────┐
│ [Naziv objekta]  [Ulica]         │
│ [Kvaliteta]      [Dane čuvanja]  │
│ [Status]         [Datum]         │
│ [Vlasnik]        [Telefon]       │
│ [Email]          [Br. kamera]    │
│ [Kategorija]     [Sigurnost]     │
│ [Napomene...]                    │
│        [+ Dodaj kameru]          │
└──────────────────────────────────┘
└─ TABLICA s svim kamerama
└─ Akcije: Uredi, Obriši
```

### 🏢 Privatni Objekti
```
┌─ KARTICE OBJEKTA ──────────┐
│ 📍 Naziv objekta           │
│ Ulica: ...                 │
│ Vlasnik: ...               │
│ Broj kamera: 2             │
│ Kvaliteta: Full HD         │
│ Status: ✅ Aktivna         │
│ Telefon: +385...           │
│ [✏️ Uredi] [🗑️ Obriši]    │
└────────────────────────────┘
```

### 🛣️ Ulice
```
🛣️ Ulica 1
   ├─ Broj kamera: 5
   └─ [👁️ Detalji]

🛣️ Ulica 2
   ├─ Broj kamera: 3
   └─ [👁️ Detalji]
```

### 📋 Izvještaji
```
📊 STATISTIKA
├─ Ukupno kamera: 100
├─ Aktivne: 85
├─ Neispravne: 3
└─ Neaktivne: 12

⚠️ NEISPRAVNE KAMERE
├─ Kamera 1 - Datum instalacije: 2024-01-15
├─ Kamera 2 - Datum instalacije: 2023-06-10
└─ ...

🔴 NEAKTIVNE KAMERE
├─ Kamera 1 - Ulica: ...
└─ ...
```

### ⚙️ Postavke
```
📊 OPĆE POSTAVKE
└─ ☑️ Omogući notifikacije

💾 BACKUP PODATAKA
├─ [⬇️ Export JSON]
└─ [⬇️ Export CSV]

🔄 OBNOVA PODATAKA
└─ [📁 Ucitaj datoteku]

🗑️ OBRISATI SVE PODATKE
└─ [🗑️ Obriši sve - OPASNO!]
```

---

## 💾 Gdje se Čuvaju Podaci?

Svi podaci se čuvaju u **browser LocalStorage**:
- ✅ Nema slanja na servere
- ✅ Podaci ostaju čak i nakon zatvaranja
- ✅ Brz pristup
- ✅ Sigurno i privatno

### Kako vidjeti podace?
1. Otvorite Developer Tools (F12)
2. Idite na "Application" tab
3. Kliknite "Local Storage"
4. Pronađite "cameraEvidenceData"

---

## 🔧 Kustomizacija

### Promjena Boja
U `css/style.css` promijenite:
```css
:root {
    --primary-color: #2c3e50;      /* Tamnoplava */
    --secondary-color: #3498db;    /* Svijetloplava */
    --accent-color: #e74c3c;       /* Crvena */
    --success-color: #27ae60;      /* Zelena */
}
```

### Dodavanje Novih Polja
1. U `js/storage.js` - dodajte polje u `getDefaultData()`
2. U `js/app.js` - dodajte input u formu `loadCameras()`
3. U `handleAddCamera()` - dodajte vrijednost

---

## 📱 Mobilni Prikaz

Aplikacija je potpuno responzivna:
- **Desktop** - Sidebar s 2 kolone
- **Tablet** - Sidebar s 1 kolonom
- **Mobilni** - Hamburger meni s 1 kolonom
- **Mali mobilni** - Optimizirano za 480px

---

## 🐛 Česti Problemi

### P: Podaci se ne čuvaju
**R**: Provjerite je li LocalStorage omogućen
```
Settings → Privacy → Cookies and Site Data → Allow
```

### P: Aplikacija je spora
**R**: Očistite cache
```
Ctrl + Shift + R (Hard Refresh)
```

### P: Ne vidim svoje podatke
**R**: Provjerite je li ista adresa
```
file:///.../index.html ili http://localhost/...
```

### P: Kako izbrisati samo neke podatke?
**R**: Filtriranje + brisanje ili export-import

---

## 📊 Primjer Rada

### 1. Dodajte prvu kameru:
```json
{
  "objectName": "Privatna kuća - Marković",
  "street": "Kralja Vladimira 15",
  "quality": "Full HD (1080p)",
  "retentionDays": 30,
  "status": "aktivna",
  "installDate": "2024-01-15",
  "owner": "Ivan Marković",
  "phone": "091 123 4567",
  "email": "ivan@example.com",
  "cameraCount": 2,
  "category": "kuća",
  "securityLevel": "privatni prostor"
}
```

### 2. Pregledajte na Kontrolnoj Ploči:
- ✅ Vidiće se "1 kamera"
- ✅ "Aktivne kamere: 1"
- ✅ "Ulice s kamerama: 1"
- ✅ "Prosječno čuvanje: 30 dana"

### 3. Provjerite na Privatnim Objektima:
- ✅ Karticu "Privatna kuća - Marković"
- ✅ Informacije o vlasnicima
- ✅ Mogućnost uređivanja/brisanja

---

## 🚀 Sljedeći Koraci

### V1.1 Planirani:
- [ ] Mogućnost uređivanja postojećih kamera
- [ ] Sortiranje tablica
- [ ] Pretraživanje po više kriterija

### V2.0 Planirani:
- [ ] Google Maps/Leaflet integracija
- [ ] PDF izvještaji
- [ ] Email notifikacije
- [ ] Backend sustav
- [ ] Multi-user login

### V3.0 Planirani:
- [ ] Mobilna aplikacija
- [ ] Real-time sinkronizacija
- [ ] Napredniji reporting

---

## 📞 Kontakt

Za pitanja ili problem kontaktirajte Policiju Modrica.

---

## ✨ Verzija

- **Verzija**: 1.0.0
- **Datum**: Rujan 2025
- **Status**: ✅ Proizvodnja

---

**Sretno korištenje! 🎉**
