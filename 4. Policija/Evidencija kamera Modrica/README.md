# 📷 Evidencija Kamera Modrica

## Opis Projekta

Sustav za evidenciju privatnih objekata koji imaju instalirane sigurnosne kamere. Omogućava brzo i lako prikupljanje, pohranu i analizu podataka o kamerama, uključujući:

- **Lokacija kamera** - ulica i precizna adresa
- **Kvaliteta snimanja** - od 480p do 4K
- **Vrijeme čuvanja snimaka** - od nekoliko dana do nekoliko mjeseci
- **Status kamera** - aktivna, neaktivna, neispravna ili u popravci
- **Informacije o vlasnicima** - kontaktni podaci privatnih osoba ili poslovnih subjekata
- **Sigurnosne razine** - klasifikacija prema vrsti podataka koji se prikupljaju

---

## 🎯 Glavne Karakteristike

### 1. **Kontrolna Ploča**
- Pregled svih ključnih statistika
- Broj aktivnih kamera
- Broj ulica s kamerama
- Prosječno vrijeme čuvanja
- Upozorenja za kamere s istekućim vremenom čuvanja
- Grafički prikazi distribucije po kategorijama i kvaliteti

### 2. **Evidencija Kamera**
- Dodavanje novih kamera s detaljnim informacijama
- Pregled svih kamera u tablici
- Brze akcije - uredi/obriši
- Filtiranje i pretraga
- Sortiranje po različitim kriterijima

### 3. **Privatni Objekti**
- Kartični prikaz svih objekata
- Informacije o vlasnicima
- Kontaktni podaci (telefon, email)
- Broj kamera po objektu
- Napomene i specijalne informacije

### 4. **Ulice**
- Prikaz svih ulica s kamerama
- Broj kamera na svakoj ulici
- Detaljan pregled kamera po ulici
- Analiza pokrivanja
- Mogućnost filtriranja po lokalitetu

### 5. **Izvještaji**
- Sažetak ukupne statistike
- Pregled neispravnih kamera
- Pregled neaktivnih kamera
- Kamere s istekućim vremenom čuvanja
- Mogućnost generiranja PDF izvještaja

### 6. **Postavke**
- Backup podataka (JSON i CSV format)
- Obnova podataka iz backupa
- Upravljanje notifikacijama
- Obrada i brisanje podataka

---

## 🚀 Tehnologija

- **HTML5** - Semantička struktura
- **CSS3** - Responzivni dizajn (Mobile-first)
- **JavaScript ES6+** - Logika aplikacije
- **LocalStorage** - Perzistencija podataka
- **Bez vanjskih zavisnosti** - Čist vanilla JavaScript

---

## 📁 Struktura Projekta

```
evidencija-kamera-modrica/
│
├── index.html                    # Glavna HTML datoteka
│
├── css/
│   ├── style.css                # Osnovni stilovi
│   ├── dashboard.css            # Dashboard specifični stilovi
│   └── responsive.css           # Responzivni dizajn (Mobile)
│
├── js/
│   ├── app.js                   # Glavna aplikacija
│   ├── storage.js               # Upravljanje podacima (LocalStorage)
│   ├── cameras.js               # Kamera specifični kod (za proširenja)
│   ├── objects.js               # Objekti specifični kod (za proširenja)
│   ├── reports.js               # Izvještaji specifični kod (za proširenja)
│   ├── dashboard.js             # Dashboard specifični kod (za proširenja)
│   ├── map.js                   # Mapiranje kamera (za proširenja)
│   └── export.js                # Export funkcionalnost (za proširenja)
│
├── assets/
│   ├── icons/                   # Ikone aplikacije
│   └── images/                  # Slike i grafike
│
├── data/
│   └── cameras.json             # JSON baza podataka
│
├── other-pages/
│   ├── cameras.html             # Alternativna kamera stranica
│   ├── objects.html             # Alternativna objekti stranica
│   ├── streets.html             # Alternativna ulice stranica
│   ├── reports.html             # Alternativna izvještaji stranica
│   ├── settings.html            # Alternativna postavke stranica
│   └── map.html                 # Mapiranje kamera
│
└── README.md                     # Dokumentacija
```

---

## 🎨 Boje i Stil

- **Primarna boja**: `#2c3e50` (Tamnoplava)
- **Sekundarna boja**: `#3498db` (Svijetloplava)
- **Akcentna boja**: `#e74c3c` (Crvena)
- **Uspjeh**: `#27ae60` (Zelena)
- **Upozorenje**: `#f39c12` (Narančasta)

---

## 💾 Upravljanje Podacima

### LocalStorage
Svi podaci se pohranjuju u browser's LocalStorage. Nema potrebe za vanjskim serverom.

### Struktura Podataka

#### Kamera
```json
{
  "id": 1,
  "objectName": "Naziv objekta",
  "street": "Ulica i broj",
  "quality": "Full HD (1080p)",
  "retentionDays": 30,
  "status": "aktivna",
  "installDate": "2024-01-15",
  "owner": "Ime vlasnika",
  "phone": "091 123 4567",
  "email": "email@example.com",
  "cameraCount": 2,
  "securityLevel": "privatni prostor",
  "category": "kuća",
  "notes": "Napomena",
  "lastMaintenance": "2025-07-20"
}
```

---

## 📋 Baze Podataka - Referentne Vrijednosti

### Kvaliteta Kamera
- 480p
- 720p (HD)
- Full HD (1080p)
- 2K
- 4K

### Status Kamera
- aktivna ✅
- neaktivna 🔴
- neispravna ⚠️
- u popravci 🔧

### Kategorije Objekata
- kuća
- mali biznis
- poslovna zgrada
- drugi

### Sigurnosne Razine
- javni prostor
- privatni prostor
- strogo povjerljivo

---

## 🔧 Uporaba

### 1. Dodavanje Nove Kamere

1. Kliknite na "Evidencija Kamera" u navigaciji
2. Popunite formu s detaljima:
   - Naziv objekta *
   - Ulica *
   - Kvaliteta *
   - Dane čuvanja *
   - Status *
   - Datum instalacije *
   - Vlasnik (opciono)
   - Telefon (opciono)
   - Email (opciono)
   - Broj kamera (default: 1)
   - Kategorija (opciono)
   - Sigurnosna razina (opciono)
   - Napomene (opciono)
3. Kliknite "Dodaj kameru"

### 2. Pregled Kamera

- **Tablica**: Prikaz svih kamera s ključnim informacijama
- **Kartice**: Detaljniji prikaz po objektima
- **Ulice**: Grupirani prikaz po lokaciji

### 3. Brisanje Kamere

1. Pronađite kameru u tablici
2. Kliknite na "Obriši" dugme
3. Potrdite akciju

### 4. Export Podataka

- **JSON**: Kompletna baza u JSON formatu
- **CSV**: Tablica u CSV formatu (kompatibilna s Excel-om)

### 5. Import Podataka

1. Idi na "Postavke"
2. Odaberi "Obnova podataka"
3. Učitaj JSON ili CSV datoteku

---

## 📱 Responzivnost

Aplikacija je potpuno responzivna i optimizirana za:
- **Desktop**: 1200px+ (4 kolone u grid-u)
- **Tablet**: 768px - 1200px (2 kolone u grid-u)
- **Mobilni**: 480px - 768px (1 kolona u grid-u)
- **Mali mobilni**: < 480px (prilagođeno za male zaslone)

---

## 🔐 Sigurnost i Privatnost

- Svi podaci se pohranjuju **lokalno** u korisnikovom pregledniku
- Nema slanja podataka na eksterne servere
- Korisnik ima **punu kontrolu** nad podacima
- Mogućnost brzo obrisanja svih podataka

---

## 🎓 Kako Funkcionira

### 1. Inicijalizacija
- Aplikacija se učitava iz `index.html`
- Učitavaju se CSS i JavaScript datoteke
- `storage.js` učitava podatke iz LocalStorage
- `app.js` kreira `CameraApp` instancu

### 2. Navigacija
- Klik na link u sidebaru poziva `navigateTo(page)`
- `loadPageContent()` učitava sadržaj odabrane stranice
- UI se dinamički ažurira bez osvježavanja stranice

### 3. Upravljanje Podacima
- `CameraStorage` klasa upravlja svim podacima
- Sve promjene se automatski spremeju u LocalStorage
- `updateCallback` obavještava aplikaciju o promjenama

### 4. Rendering
- HTML se dinamički kreira iz JavaScript-a
- Template stringovi (``) koriste se za HTML
- Podaci se interpoliraju direktno u HTML

---

## 🚧 Mogućnosti za Proširenja

### 1. Mapiranje Kamera 🗺️
- Integracija Google Maps API-ja ili Leaflet.js
- Prikazivanje kamera na karti
- Filtriranje po lokaciji

### 2. Notifikacije 🔔
- Email notifikacije za istekuće kamere
- Push notifikacije u pregledniku
- SMS alerts (s vanjskom integracijom)

### 3. Analitika 📊
- Detaljnije statistike i analize
- Grafikoni i diagrami
- Izvozni izvještaji

### 4. Sinkronizacija ☁️
- Backup u cloud servis
- Sinkronizacija između uređaja
- Sigurnost podataka

### 5. Multiuser Support 👥
- Login/registracija
- Dozvole i role
- Audit log

### 6. Mobilna Aplikacija 📱
- React Native ili Flutter aplikacija
- Offline podrška
- Fotoaparat integracija

### 7. OCR Prepoznavanje 🔍
- Automatsko čitanje registarskih brojeva
- Prepoznavanje lica (GDPR kompliant)
- Analiza prometnih kršenja

---

## 🐛 Otklanjanje Greške

### Problem: Podaci se ne čuvaju
**Rješenje**: Provjerite je li LocalStorage omogućen u pregledniku
- Desni klik → Inspect → Application → LocalStorage

### Problem: Aplikacija je spora
**Rješenje**: Očistite cache i osvježite stranicu
- Ctrl + Shift + R (Hard refresh)

### Problem: Greške u konzoli
**Rješenje**: Otvorite Developer Console
- F12 → Console i provjerite greške

---

## 📞 Podrška

Za pitanja ili probleme, kontaktirajte administraciju Policije Modrica.

---

## 📝 Verzija

**Verzija**: 1.0.0  
**Datum**: Rujan 2025  
**Licenca**: Interno korištenje - Policija Modrica

---

## 🎯 ToDo Lista za Razvoj

- [ ] Dodati Google Maps integraciju
- [ ] Implementirati email notifikacije
- [ ] Kreirati mobilnu aplikaciju
- [ ] Dodati PDF export
- [ ] Implementirati database (SQLite, Firebase)
- [ ] Dodati authentication
- [ ] Kreirati REST API
- [ ] Dodati real-time sinkronizaciju
- [ ] Optimizirati za大 količine podataka (1000+ kamera)
- [ ] Dodati advanced filtering i search
- [ ] Implementirati batch operations
- [ ] Dodati data validation na serverskoj strani

---

## 🎨 Kustomizacija

### Promjena Boja

U `css/style.css` promijenite CSS varijable:

```css
:root {
    --primary-color: #2c3e50;      /* Primarna boja */
    --secondary-color: #3498db;    /* Sekundarna boja */
    --accent-color: #e74c3c;       /* Akcentna boja */
}
```

### Dodavanje Novih Polja

U `js/app.js` u `handleAddCamera()` funkciji dodajte novo polje i ažurirajte formu u `loadCameras()`.

---

## 📚 Dodatni Resursi

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Izrađeno sa ❤️ za Policiju Modrica**
