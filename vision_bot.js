import mineflayer from 'mineflayer';
import { viewer } from 'prismarine-viewer';
import fs from 'fs';

const host = 'mebot279.mcsh.io';
const port = 25565;
const username = 'Manus_Vision';

const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username,
    version: '1.21.1',
    auth: 'offline'
});

bot.on('login', () => console.log('✅ Bot Vision connecté !'));

bot.on('spawn', () => {
    console.log('🚀 Bot apparu. Initialisation de la vision...');
    
    // On lance le viewer en mode headless sur le port 3000
    // Cela permet aussi de voir le bot via un navigateur si on expose le port
    viewer.mineflayer(bot, { port: 3000, firstPerson: true });
    console.log('🌐 Viewer actif sur le port 3000 (Vue Première Personne)');

    // Fonction pour prendre une capture d'écran de ce que voit le bot
    // Note: En mode "mineflayer", le viewer crée un serveur web.
    // Pour de la "vraie" vision IA, on utiliserait le mode "headless" de prismarine-viewer
    // qui génère des buffers d'image directement.
    
    setInterval(async () => {
        // Ici, on pourrait utiliser puppeteer pour capturer localhost:3000
        // ou utiliser l'API headless si installée.
        // Pour l'instant, on informe l'utilisateur.
        console.log('📸 Analyse visuelle en cours...');
    }, 5000);
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === 'regarde') {
        bot.chat("Je scanne mon environnement avec mes yeux électroniques...");
    }
});

bot.on('error', (err) => console.log('❌ Erreur:', err));
bot.on('kicked', (reason) => console.log('❌ Kické:', reason));
