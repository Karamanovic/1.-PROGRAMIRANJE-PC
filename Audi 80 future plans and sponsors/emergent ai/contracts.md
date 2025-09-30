# KARAS ENTERPRISE - Web Prezentacija Contracts

## Frontend Implementation Status ✅ COMPLETE

### Implementirane Komponente:
- ✅ **Header** - Fixed dark header sa navigacijom i jezičkim prekidačem
- ✅ **Hero Section** - Velika headline sa CTA dugmadima
- ✅ **Story Section** - Emocionalna priča projekta sa statistikama  
- ✅ **Specs Section** - Trenutno stanje vozila i urađeni modovi
- ✅ **Mods Section** - Planirani modovi po kategorijama (tabovi)
- ✅ **Gallery Section** - Instagram placeholders sa opisima
- ✅ **Packages Section** - Sponzorski paketi (Bronze/Silver/Gold)
- ✅ **Contact Section** - Kontakt info i email generator
- ✅ **Footer** - Branding i linkovi

### Design Sistem:
- ✅ **Dark Theme** - Crna pozadina (#000000) sa cyan-green akcentima (#00FFD1)
- ✅ **Sharp Buttons** - border-radius: 0px prema design guidelines
- ✅ **Typography** - Kontrastni tekst optimizovan za dark temu
- ✅ **Responsive** - Mobile-first design
- ✅ **Bilingvalno** - Srpski/Engleski toggle

### Mock Data:
Sve podatke korisnika su već implementirani u `/src/mock.js`:
- Vlasnik: Dejan Karamanović (@karasenterprise)
- Vozilo: Audi 80 B3 1.8 Turbo, ~300k km
- Kontakt: dejankaramanovic@gmail.com, +387 66 483 936
- Social: 1,552 IG followers, 340 TikTok
- Modovi: engine, suspension, brakes, other
- Paketi: Bronze/Silver/Gold sa benefit listama

## Backend Requirements (OPTIONAL)

Ako korisnik želi backend integraciju:

### API Endpoints:
```
POST /api/contact - Šalje email LOBA
GET  /api/gallery - Instagram API integration  
POST /api/lead - Lead generation tracking
GET  /api/stats - Analytics podaci
```

### Database Models:
```javascript
// Contact Leads
{
  id: string,
  name: string,
  email: string, 
  message: string,
  type: "sponsor" | "general",
  timestamp: Date
}

// Analytics
{
  pageViews: number,
  buttonClicks: {
    sponsorCTA: number,
    gallery: number,
    packages: number
  },
  languageUsage: { sr: number, en: number }
}
```

### Environment Variables:
```
INSTAGRAM_ACCESS_TOKEN=xxx (optional)
SMTP_USER=xxx (za email slanje)
SMTP_PASS=xxx
GMAIL_API_KEY=xxx (alternativa)
```

## Static Files Already Provided

### Email Templates (`/src/utils/emailTemplates.js`):
- Formalni i neformalni email za LOBA
- 6 Instagram caption varijanti
- Hashtag liste

### Assets Guide (`/public/assets/README.md`):
- Detaljne instrukcije za zamenu placeholder slika
- Instagram integration setup
- Deployment guide za Netlify/Vercel

## Deployment Ready

Frontend je spreman za deployment:

1. **Build**: `npm run build`
2. **Netlify**: Drag & drop build foldera
3. **Vercel**: `vercel --prod`
4. **Domain**: Update REACT_APP_BACKEND_URL

## Dodatni Deliverables

### PDF Pitch Deck
Potrebno generate iz postojećeg sadržaja:
- Hero headline
- Project story sa slikama
- Sponzorski paketi  
- Kontakt informacije
- One-sentence ask za LOBA

### Social Pack
Ready-to-use:
- 3 Instagram story predloška (1080x1920)
- 6 caption varijanti sa hashtag-ovima
- Email templates (formal/casual)

## Status: Frontend Kompletan ✅

Sajt je potpuno funkcionalan sa mock podacima i spreman za deployment ili backend integraciju po potrebi.