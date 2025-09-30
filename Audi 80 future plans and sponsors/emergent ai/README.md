# KARAS ENTERPRISE - Audi 80 B3 Pitch Website

Web prezentacija za LOBA sponzorstvo Audi 80 B3 1.8 Turbo projekta.

## 🚗 Projekat Overview

- **Vlasnik**: Dejan Karamanović (@karasenterprise)
- **Vozilo**: Audi 80 B3 1.8 Turbo (~300k km)
- **Cilj**: OEM+ stanced daily driver 
- **Target**: LOBA (@lobanjica853) sponzorstvo
- **Timeline**: 12 meseci od preuzimanja

## 🌐 Website Features

### ✅ Implementirano

- **Dark Theme Design** - Crna pozadina sa cyan-green akcentima
- **Bilingvalno** - Srpski/Engleski toggle
- **Responsive Layout** - Mobile-first design
- **Sharp Edge Buttons** - Prema premium design guidelines
- **SEO Optimizovano** - Meta tags, Open Graph, structured data

### 📱 Sekcije

1. **Hero** - Emotivni naslov + CTA za LOBA
2. **Story** - 4+ godina vlasništvo, vizija projekta
3. **Current State** - Specs i već urađeni modovi  
4. **Planned Mods** - Engine, suspension, brakes (tabovi)
5. **Gallery** - Instagram placeholders (@karasenterprise)
6. **Sponsor Packages** - Bronze/Silver/Gold paketi
7. **Contact** - Email generator + kontakt info

## 🛠 Tech Stack

- **Frontend**: React 19 + Tailwind CSS
- **Components**: Shadcn/UI dark theme
- **Icons**: Lucide React
- **Deployment**: Netlify/Vercel ready

## 🚀 Quick Start

### Development
```bash
cd frontend
npm start
# Otvori http://localhost:3000
```

### Build Production
```bash
cd frontend
npm run build
# Deploy build/ folder
```

## 📋 Deployment Guide

### Netlify (Recommended)
1. Build: `npm run build`
2. Drag & drop `build/` folder na Netlify dashboard
3. Update domain u meta tags

### Vercel
```bash
npm run build
vercel --prod
```

## 📧 Email Integration

### Pre-filled Email za LOBA
Generiše se automatski sa:
- Subject: "LOBA — predlažem ti Audi 80 koji vrijedi srediti"
- Body: Kompletan pitch sa kontakt info
- Mailto link otvara email klijent

### Templates Available
- Formalni/neformalni varijanti
- Srpski i engleski
- Ready-to-send format

## 📸 Asset Management

### Placeholder Slike (6 potrebnih)
- `audi-front.jpg` - Hero + front view
- `audi-profile.jpg` - Side stance shot
- `audi-interior.jpg` - S-line seats + Nardi wheel
- `audi-engine.jpg` - 1.8 turbo engine bay  
- `audi-rear.jpg` - Competition spoiler
- `audi-wheels.jpg` - Current wheel setup

### Instagram Integration (Optional)
```javascript
// Add Instagram API token in .env
REACT_APP_INSTAGRAM_TOKEN=xxx

// Update gallery component
// Remove placeholders, add real posts
```

## 📊 Analytics & Tracking

### Contact Form Tracking
- Button clicks: Sponsor CTA, Gallery, Packages
- Language usage: SR vs EN
- Time spent per section

### Lead Generation
- Email opens (if backend integrated)
- Social media clicks (@karasenterprise → @lobanjica853)
- PDF pitch downloads

## 🎯 Sponzorski Paketi

### Bronze (do 300€)
- Logo na braniku
- 2 story mentions
- 1 reel sa tag

### Silver (intercooler + rad)  
- Logo na bočnim panelima
- 5 stories + 2 reels
- Video credits

### Gold (full sponsorship)
- Primarni logo na haubi
- Ekskluzivni reel serijal
- Co-branding prava
- Event appearances

## 👥 Kontakt Informacije

**Vlasnik Projekta:**
- Email: dejankaramanovic@gmail.com
- Telefon: +387 66 483 936  
- Instagram: @karasenterprise

**Target Sponzor:**
- Instagram: @lobanjica853

## 📱 Social Media Pack

### Instagram Stories (3 templates)
- "Meet the base" - car showcase
- "What we want" - mods collage  
- "Sponsor ask" - direct CTA

### Captions (6 varijanti)
```
1. "Audi 80 B3 — baza sa dušom. 1.8 turbo, OEM+ vizija..."
2. "Midnight blue & turbo — balance elegance & sound..."  
3. "Small budget, big heart. Svaki projekat ima priču..."
4. "Plan: intercooler, turbo + KW/air. LOBA — čeka te baza..."
5. "Imamo content, publiku i volju. Treba nam sponzor..."
6. "Digitalna klima, S-line koža, Nardi volan — samo fali pravi tim..."
```

### Hashtags
`#Audi80 #AudiB3 #KarasEnterprise #KEPerformance #Restomod #Stanced #DailyDriver #Loba #CarBuild #Turbo`

## 🔧 Customization

### Boje (CSS Variables)
```css
--bg-primary: #000000        /* Main background */
--brand-primary: #00FFD1     /* Accent color */
--text-primary: #FFFFFF      /* Main text */
```

### Tekstovi
- Sve headline varijante u `mock.js`
- Bilingvalni content u `translations`
- Email templates u `emailTemplates.js`

## 📈 Next Steps

1. **Replace Placeholders** - Add real car photos
2. **Test Email Flow** - Verify LOBA contact process
3. **Social Promotion** - Use provided templates
4. **Monitor Analytics** - Track sponsor interest
5. **PDF Generation** - Create downloadable pitch deck

## 🎬 Call to Action

**Za LOBA:**
"Pogledaj pitch prezentaciju, uzmi auto i napravimo priču koju svi žele da prate."

---

*Made with ❤️ for the car community | KARAS ENTERPRISE 2024*