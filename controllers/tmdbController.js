const db = require('../config/db');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;

const pesquisarNoTmdb = (req, res) => {
    const { query, tipo } = req.query; 

    if (!query) {
        return res.status(400).json({ message: "Digite um termo para pesquisar." });
    }

    const typeSearch = tipo === 'serie' ? 'tv' : 'movie'; 
    const params = new URLSearchParams({
        api_key: API_KEY,
        query: query,
        language: 'pt-PT'
    });

    const urlCompleta = `${BASE_URL}/search/${typeSearch}?${params}`;

    // fetch para o pedido, e quando a resposta chegar (.then), converte para JSON
    // e QUANDO a conversão acabar (.then), executa a minha lógica

    fetch(urlCompleta)
        .then(async response => {
            if (!response.ok) {
                const erroTexto = await response.text();
                console.error(`ERRO TMDB: ${response.status} - ${response.statusText}`);
                console.error(`DETALHES: ${erroTexto}`);
                throw new Error('Erro na resposta do TMDB');
            }
            return response.json();
        })
        .then(data => {
            const resultados = data.results.map(item => ({
                tmdb_id: item.id,
                titulo: item.title || item.name,
                ano: (item.release_date || item.first_air_date || '').split('-')[0],
                sinopse: item.overview,
                poster: item.poster_path 
            }));
            res.status(200).json(resultados);
        })
        .catch(error => {
            console.error('Erro final:', error.message);
            res.status(500).json({ message: 'Erro ao conectar com o TMDB.' });
        });
};

const importarFilmeSerie = (req, res) => {
    const { tmdb_id, tipo } = req.body; 

    if (!tmdb_id || !tipo) return res.status(400).json({ message: "ID e Tipo obrigatórios." });

    const typeEndpoint = tipo === 'serie' ? 'tv' : 'movie';

    const params = new URLSearchParams({
        api_key: API_KEY,
        language: 'pt-PT',
        append_to_response: 'credits'
    });

    fetch(`${BASE_URL}/${typeEndpoint}/${tmdb_id}?${params}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar detalhes no TMDB');
            return response.json();
        })
        .then(data => {

            const titulo = data.title || data.name;
            const sinopse = data.overview;
            const ano = (data.release_date || data.first_air_date || '').split('-')[0];
            const duracao = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 0) || 0;
            
            let diretorNome = 'Desconhecido';
            if (tipo === 'filme') {
                const diretor = data.credits.crew.find(c => c.job === 'Director');
                if (diretor) diretorNome = diretor.name;
            } else {
                if (data.created_by && data.created_by.length > 0) diretorNome = data.created_by[0].name;
            }

            const queryDirInsert = 'INSERT IGNORE INTO diretores (nome) VALUES (?)';
            db.query(queryDirInsert, [diretorNome], (err) => {
                if (err) return erroSQL(res, err);

                db.query('SELECT id_diretores FROM diretores WHERE nome = ?', [diretorNome], (err, resDiretor) => {
                    if (err) return erroSQL(res, err);
                    const idDiretor = resDiretor[0].id_diretores;

                    const queryFilme = `INSERT INTO filmes_series 
                        (nome, tipo, sinopse, duracao, ano_lancamento, id_diretor, classificacao_idade) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    
                    db.query(queryFilme, [titulo, tipo, sinopse, duracao, ano, idDiretor, 12], (err, resFilme) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: "Filme já cadastrado." });
                            return erroSQL(res, err);
                        }
                        const idFilmeCriado = resFilme.insertId;

                        if (data.genres && data.genres.length > 0) {
                            const generosNomes = data.genres.map(g => g.name);
                            const valuesGeneros = generosNomes.map(n => [n]);
                            
                            db.query('INSERT IGNORE INTO generos (nome) VALUES ?', [valuesGeneros], (err) => {
                                if (err) console.error("Erro generos insert:", err); 

                                db.query('SELECT id_generos FROM generos WHERE nome IN (?)', [generosNomes], (err, resGeneros) => {
                                    if (!err && resGeneros.length > 0) {
                                        const valuesLigacao = resGeneros.map(g => [idFilmeCriado, g.id_generos]);
                                        db.query('INSERT INTO genero_filme_serie (id_filme_serie, id_genero) VALUES ?', [valuesLigacao], (err) => {});
                                    }
                                });
                            });
                        }

                        const elenco = data.credits.cast.slice(0, 5); 
                        if (elenco && elenco.length > 0) {
                            const atoresNomes = elenco.map(a => a.name);
                            const valuesAtores = atoresNomes.map(n => [n]);
                            
                            db.query('INSERT IGNORE INTO atores (nome) VALUES ?', [valuesAtores], (err) => {
                                if (err) console.error("Erro atores insert:", err);

                                db.query('SELECT id_atores FROM atores WHERE nome IN (?)', [atoresNomes], (err, resAtores) => {
                                    if (!err && resAtores.length > 0) {
                                        const valuesLigacaoAtor = resAtores.map(a => [a.id_atores, idFilmeCriado]); 
                                        db.query('INSERT INTO elenco_principal (id_ator, id_filme_serie) VALUES ?', [valuesLigacaoAtor], (err) => {});
                                    }
                                });
                            });
                        }

                        res.status(201).json({ 
                            message: "Importado com sucesso!", 
                            id_sistema: idFilmeCriado,
                            titulo: titulo 
                        });
                    });
                });
            });
        })
        .catch(error => {
            console.error('Erro TMDB Import:', error);
            res.status(500).json({ message: 'Erro ao importar dados do TMDB.' });
        });
};

function erroSQL(res, err) {
    console.error(err);
    res.status(500).json({ message: "Erro de Base de Dados" });
}

module.exports = { pesquisarNoTmdb, importarFilmeSerie };