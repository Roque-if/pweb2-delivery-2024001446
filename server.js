import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { criarRotas } from './src/routes/index.js';
import { mensagensFlash } from './src/middlewares/flash.js';
import { naoEncontrado, tratarErros } from './src/middlewares/erros.js';

const raiz = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(raiz, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/base');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(raiz, 'src', 'public')));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET || 'delivery-tracker-dev', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(mensagensFlash);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/', criarRotas());

app.use(naoEncontrado);
app.use(tratarErros);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Delivery Tracker rodando em http://localhost:${PORT}`));
