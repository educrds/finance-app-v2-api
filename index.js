import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import categorias from './routes/categorias/index.js';
import preferences from './routes/preferences/index.js';
import transacoes from './routes/transacoes/index.js';
import charts from './routes/charts/index.js';
import user from './routes/user/index.js';

import { verifyToken } from './middlewares/verify-token.js';

const app = express();

// environment
const PORT = process.env.PORT || 8080;


app.use(bodyParser.json(), cors(), bodyParser.urlencoded({ extended: true }));

app.use('/categoria', verifyToken, categorias);
app.use('/preferencias', verifyToken, preferences);
app.use('/transacao', verifyToken, transacoes);
app.use('/chart', verifyToken, charts);
app.use('/user', user);
app.use('/healthcheck', (req, res) => res.status(200).send('Its ok'))

app.listen(PORT, () => console.log(`server is running on port: http://localhost: ${PORT}`));
