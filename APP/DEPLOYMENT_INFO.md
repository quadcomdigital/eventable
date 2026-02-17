# 🚀 EventMaster Pro - Deployment Info

## ✅ Status: ONLINE

### 📍 Accesso
- **IP VPS**: `151.241.228.106`
- **URL**: http://151.241.228.106
- **Percorso progetto**: `/srv/projects/eventable/APP`
- **Build**: `/srv/projects/eventable/APP/dist`

### 🔧 Configurazione Server
- **Web Server**: Nginx 1.18.0
- **SSL**: Pronto per Let's Encrypt (configura con dominio)
- **Node.js Build**: Vite 6.4.1

### 📋 Comandi Utili

#### Deploy
```bash
/srv/projects/eventable/APP/deploy.sh
```

#### Rebuild manuale
```bash
cd /srv/projects/eventable/APP
npm run build
```

#### Controllare Nginx
```bash
systemctl status nginx
systemctl restart nginx
```

#### View log
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 🔐 Prossimo Passo
Per abilitare HTTPS (SSL), configura il tuo dominio e esegui:
```bash
certbot --nginx -d tuodominio.com
```

### 📦 Dipendenze Principali
- React 19.2.0
- FullCalendar 6.1.8
- Google Gemini AI
- Vite 6.4.1

### ⚠️ Importante
Assicurati che `GEMINI_API_KEY` nel file `.env.local` sia impostato con una chiave valida!

---
Deployato: 2025-11-06
