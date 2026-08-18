import mineflayer from 'mineflayer';
import { viewer } from 'prismarine-viewer';
import puppeteer from 'puppeteer';
import axios from 'axios';

const host = 'mebot279.mcsh.io';
const port = 25565;
const username = 'Manus_Vision';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: username,
    version: '1.21.1',
    auth: 'offline'
});

let browser;
let page;

bot.on('login', () => console.log('✅ Bot Vision connecté !'));

bot.on('spawn', async () => {
    console.log('🚀 Bot apparu. Initialisation de la vision...');
    
    // Lancer le viewer sur le port 3000
    viewer.mineflayer(bot, { port: 3000, firstPerson: true });
    console.log('🌐 Viewer actif sur le port 3000');

    try {
        // Lancer Puppeteer pour capturer le viewer
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-web-security',
                '--disable-dev-shm-usage',
                '--use-gl=angle',
                '--use-angle=gl'
            ]
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        
        // Attendre que le viewer charge
        setTimeout(async () => {
            try {
                await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
                console.log('👀 Puppeteer a "ouvert les yeux" sur le viewer.');
                bot.chat("Mes yeux électroniques sont opérationnels !");
            } catch (e) {
                console.error('Erreur chargement page viewer:', e.message);
            }
        }, 10000);

    } catch (err) {
        console.error('Erreur initialisation Puppeteer:', err.message);
    }
});

async function analyzeVision() {
    if (!page) return;
    
    try {
        console.log('📸 Capture d\'écran en cours...');
        const screenshot = await page.screenshot({ encoding: 'base64' });
        
        console.log('🧠 Envoi à l\'IA pour analyse...');
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-pro-1.5-vision',
            messages: [
                {
                    role: 'user',
                    content: [
                        { 
                            type: 'text', 
                            text: "Tu es un bot Minecraft nommé Manus_Vision. Regarde cette image et décris en UNE SEULE phrase courte ce que tu vois (ex: 'Je vois une forêt de chênes' ou 'Un zombie approche par la droite'). Sois précis." 
                        },
                        { 
                            type: 'image_url', 
                            image_url: { url: `data:image/png;base64,${screenshot}` } 
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://manus.ai',
                'X-Title': 'Manus Minecraft Vision Bot'
            }
        });

        const description = response.data.choices[0].message.content;
        bot.chat(`[Vision] ${description}`);
    } catch (err) {
        console.error('Erreur lors de l\'analyse vision:', err.response?.data || err.message);
    }
}

bot.on('chat', async (username, message) => {
    if (username === bot.username) return;
    
    if (message.toLowerCase() === 'vision') {
        bot.chat("Je scanne mon environnement...");
        await analyzeVision();
    }
});

// Analyse automatique toutes les 30 secondes
setInterval(analyzeVision, 30000);

bot.on('error', (err) => console.log('❌ Erreur:', err));
bot.on('kicked', (reason) => console.log('❌ Kické:', reason));
