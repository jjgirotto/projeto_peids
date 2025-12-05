// Carregando as variáveis de ambiente do .env
require('dotenv').config();
const express = require('express'); //importa express
const db = require('./config/db'); //importa a conexão do db
const generosRouter = require('./routes/generos'); //importa as rotas de gêneros
const diretoresRouter = require('./routes/diretores'); //importa as rotas de diretores
const atoresRouter = require('./routes/atores'); //importa as rotas de atores
const utilizadoresRouter = require('./routes/utilizadores'); //importa as rotas de utilizadores
const filmesSeriesRouter = require('./routes/filmes-series'); //importa as rotas de filmes e séries
const reviewsRouter = require('./routes/reviews'); //importa as rotas de reviews


const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor a funcionar e ligado à BD!');
});

//generos
app.use('/api/generos', generosRouter);

//diretores
app.use('/api/diretores', diretoresRouter);

//atores
app.use('/api/atores', atoresRouter);

//utilizadores
app.use('/api/utilizadores', utilizadoresRouter);

//filmes e séries
app.use('/api/filmes-series', filmesSeriesRouter);

//reviews
app.use('/api/reviews', reviewsRouter);

app.listen(process.env.PORT);