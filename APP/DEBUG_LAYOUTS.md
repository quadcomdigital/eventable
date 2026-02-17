# 🔍 Come Debuggare il Problema dei Layout

## Problema Riscontrato
Quando un admin crea una disposizione, al ritorno alla pagina non la trova più.

## Cause Possibili

1. **localStorage è locale al browser** - I dati sono salvati solo nel browser attuale
2. **Cache del browser** - Dati vecchi vengono visualizzati
3. **Sincronizzazione fallita** - Il salvataggio non è completato

## Come Debuggare

### Passo 1: Apri la Console del Browser
- **Windows/Linux**: Premi `F12`
- **Mac**: Premi `Cmd+Option+I`
- Seleziona la scheda **Console**

### Passo 2: Crea una Disposizione
1. Vai in **Admin → Disposizioni**
2. Aggiungi uno o più tavoli
3. Inserisci un nome (es. "Test Layout")
4. Clicca "Salva" o "Aggiorna"

### Passo 3: Leggi i Console Log
Nella console dovresti vedere messaggi come:
```
[TableDesigner] Nuovo layout salvato: {id: 1730880000000, name: "Test Layout", tables: 2}
[TableDesigner] Tutti i layouts dopo save: Array(1)
[TableDesigner] Salvato in localStorage: [{"id":1730880000000,"name":"Test Layout",...}]
```

### Passo 4: Verifica localStorage
Digita nella console:
```javascript
// Vedi tutti i layout salvati
const layouts = localStorage.getItem('saved_layouts_admin');
console.log('Layouts:', layouts ? JSON.parse(layouts) : 'Nessuno');

// Vedi tutto il localStorage
console.log('Tutto localStorage:', localStorage);
```

**Risultato atteso:**
- Dovresti vedere un array con i tuoi layout
- Se vedi `Nessuno`, il layout non è stato salvato

### Passo 5: Torna alla lista Layouts
1. Vai in **Admin → Gestione Layout** (se esiste)
2. O torna a **Disposizioni** e clicca su "Carica Layout"
3. Dovresti vedere il layout nell'elenco

## Se il Layout non compare

### Opzione A: Pulire localStorage e ricominciare
```javascript
localStorage.removeItem('saved_layouts_admin');
location.reload();
```

### Opzione B: Verifica se localStorage è abilitato
```javascript
try {
    localStorage.setItem('test', 'test');
    console.log('✅ localStorage è disponibile');
    localStorage.removeItem('test');
} catch(e) {
    console.error('❌ localStorage non disponibile:', e);
}
```

## Informazioni Utili

### File interessati
- `/components/TableDesigner.tsx` - Dove vengono salvati i layout
- `/components/LayoutsListPage.tsx` - Dove vengono visualizzati
- `localStorage key` - `saved_layouts_admin`

### Debug aggiunto
✅ Console.log quando carica i layout
✅ Console.log quando salva un nuovo layout
✅ Console.log quando sincronizza con localStorage

## Prossima Volta

Se vuoi un sistema più robusto (server-side):
1. Crea un'API per salvare i layout nel database
2. Sostituisci localStorage con fetch API
3. Usa un UUID unico per il browser

---
**Data**: 6 Novembre 2025
**App**: EventMaster Pro
