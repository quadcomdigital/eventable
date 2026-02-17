#!/bin/bash

# Script di deploy automatico per EventMaster Pro

echo "🚀 Inizio deploy di EventMaster Pro..."

# Naviga alla cartella del progetto
cd /srv/projects/eventable/APP

# Assicurati che il logo sia nella cartella public
mkdir -p public
cp -f loghi_vm.png public/loghi_vm.png 2>/dev/null || true

# Installa dipendenze
echo "📦 Installazione dipendenze..."
npm install

# Build
echo "🔨 Build del progetto..."
npx vite build

# Riavvia nginx
echo "♻️  Riavvio Nginx..."
systemctl restart nginx

echo "✅ Deploy completato!"
echo "🌐 App disponibile a:"
echo "   - http://localhost"
echo "   - http://$(hostname -I | awk '{print $2}')"

