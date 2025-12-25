// Carregando as variáveis de ambiente do .env
require('dotenv').config();
const express = require('express'); //importa express
const generosRouter = require('./routes/generos'); //importa as rotas de gêneros
const diretoresRouter = require('./routes/diretores'); //importa as rotas de diretores
const atoresRouter = require('./routes/atores'); //importa as rotas de atores
const utilizadoresRouter = require('./routes/utilizadores'); //importa as rotas de utilizadores
const filmesSeriesRouter = require('./routes/filmes-series'); //importa as rotas de filmes e séries
const reviewsRouter = require('./routes/reviews'); //importa as rotas de reviews
const tmdbRouter = require('./routes/tmdb'); //importa as rotas do TMDB
const favoritosRouter = require('./routes/favoritos'); //importa fav
const listasRouter = require('./routes/listas');

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

//tmdb
app.use('/api/tmdb', tmdbRouter);

//favoritos
app.use('/api/favoritos', favoritosRouter);

//listas
app.use('/api/listas', listasRouter);

app.listen(process.env.PORT);