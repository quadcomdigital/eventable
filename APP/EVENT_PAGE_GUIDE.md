# Pagina Ricevimento - Guida Completa

## Panoramica
La **Pagina Ricevimento** è una feature innovativa che permette agli amministratori di creare pagine personalizzate per i loro eventi e agli ospiti di caricare foto dell'evento.

## Funzionalità

### Per gli Amministratori

**Accesso**: Sidebar → Pagina Ricevimento

**Cosa puoi fare:**
1. ✨ **Personalizzazione completa**
   - Titolo principale (es. "Sarah & Marco - Il Grande Giorno")
   - Descrizione dell'evento
   - Data e ora dell'evento
   - Luogo dell'evento
   - Dress code opzionale
   - Link al menu

2. 🎨 **Tema Personalizzato**
   - Scegli tre colori personalizzati (primario, secondario, accento)
   - Preview in tempo reale su mobile
   - Design responsivo

3. 📊 **Countdown Automatico**
   - Timer che conta fino all'evento
   - Aggiornamento in tempo reale
   - Mostra giorni, ore e minuti

### Per gli Ospiti

**Accesso**: Link univoco generato per ogni evento (da implementare con condivisione)

**Cosa possono fare:**
1. 📸 **Carica Foto**
   - Inserire nome ed email
   - Caricare una o più foto dell'evento
   - Visualizzare anteprima istantanea

2. 🎞️ **Visualizza Galleria**
   - Vedere tutte le foto caricate dai partecipanti
   - Hover effect per info uploader
   - Galleria responsive

3. 📋 **Visualizza Dettagli**
   - Info completa sull'evento
   - Countdown in tempo reale
   - Link al menu (se disponibile)

## Flusso Dati

### Salvataggio Locale
- **Settings**: `localStorage.event_page_settings` → Oggetto con eventId come chiave
- **Foto**: `localStorage.event_photos_{eventId}` → Array di EventPagePhoto

### Strutture Dati
```typescript
EventPageSettings {
  id: number;
  eventId: string;
  headline: string;
  description: string;
  eventDateTime: string;
  location: string;
  dressCode?: string;
  menuUrl?: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  }
}

EventPagePhoto {
  id: number;
  uploaderName: string;
  uploaderEmail: string;
  photoUrl: string;      // Base64 data URL
  uploadedAt: string;    // ISO timestamp
  caption?: string;
}
```

## Roadmap Futura

### Fase 2 (Prossimi Miglioramenti)
- [ ] Integrazione email - archivio foto inviato dopo evento
- [ ] Link pubici univoci per ogni evento
- [ ] QR code per accesso rapido da mobile
- [ ] Moderazione foto (approvazione prima pubblicazione)
- [ ] Filtri per data upload
- [ ] Azioni batch (download tutte foto, cancella)
- [ ] Share sui social (Instagram, Facebook)
- [ ] Statistiche visualizzazioni

### Fase 3 (Avanzato)
- [ ] Livestream integrato
- [ ] Playlist musicale personalizzata
- [ ] Hashtag tracking dai social
- [ ] AI - foto migliori/preferite
- [ ] Stampa album fisico
- [ ] Animazioni custom per transizioni

## Casi d'Uso

**Scenario 1: Matrimonio Elegante**
```
Admin crea pagina con:
- Foto coppia in hero
- Palette colori oro/bianco
- Dress code "Black Tie"
- Link menu 5 portate
→ Ospiti caricano foto durante ricevimento
→ Album automatico dopo evento
```

**Scenario 2: Festa Aziendale**
```
Admin crea pagina con:
- Branding aziendale
- Colori corporate
- Info team building
→ Dipendenti condividono momenti
→ Archivio per comunicazioni interne
```

**Scenario 3: Battesimo/Comunione**
```
Admin crea pagina con:
- Countdown dedicato
- Info location
- Playlist background
→ Famiglia e amici uploading ricordi
→ Distribuzione album via email
```

## Note Implementazione

### Sicurezza
- ⚠️ Attualmente salvataggio solo locale
- TODO: Implementare backend per persistenza
- TODO: Validazione email per invitati
- TODO: Rate limiting upload foto

### Performance
- ✅ Base64 encoding per foto (funziona offline)
- ⚠️ Potenziale limite localStorage (~5MB)
- TODO: Compressione foto lato client
- TODO: Lazy loading gallery

### UX
- ✅ Preview mobile real-time
- ✅ Animazioni fluide
- ✅ Emoji per UX intuitiva
- TODO: Tooltip guida
- TODO: Tutorial onboarding

## File Correlati
- `types.ts` - Interfacce EventPageSettings, EventPagePhoto, EventPageArchive
- `components/EventPageBuilder.tsx` - Editor admin
- `components/EventPageView.tsx` - Vista ospiti
- `App.tsx` - Routing

