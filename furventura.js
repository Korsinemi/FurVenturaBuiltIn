// main.js
import express from 'express';
import next from 'next';
import * as url from 'url';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import setupGame from './server/gameLogic.js';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.prepare().then(() => {
    const server = express();

    // Middleware para servir el favicon
    // server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    // Middleware para servir archivos estáticos de Next.js
    server.use(express.static(join(__dirname, 'public')));

    // Middleware para parsear cookies
    server.use(cookieParser());

    // Rutas de la API
    server.get('/api', (req, res) => {
        res.send({ message: 'Hola desde el servidor!' });
    });

    // Configurar la lógica del juego
    const httpServer = server.listen(3000, (err) => {
        if (err) throw err;
        console.log(`Server running on port 3000`);
    });

    setupGame(httpServer);

    // Manejo de todas las demás rutas para servir la aplicación Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });
});
