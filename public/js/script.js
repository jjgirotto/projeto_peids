const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    verificarAuth();

    const path = window.location.pathname;

    if (path.includes('login.html')) {
        configurarLogin();
    } else if (path.includes('minha-conta.html')) {
        carregarMinhaConta();
    } else if (path.includes('registo.html')) {
        configurarRegisto();
    } else if (path.includes('gestao-generos.html')) {
        carregarGenerosBackoffice();
    } else if (path.includes('gestao-diretores.html')) {
        carregarDiretoresBackoffice();
    } else if (path.includes('gestao-atores.html')) {
        carregarAtoresBackoffice();
    } else if (path.includes('gestao-filmes-series.html')) {
        carregarFilmesSeriesBackoffice();
    } else if (path.includes('detalhes.html')) {
        carregarDetalhesFilme();
    } else {
        carregarFilmesHome();
    }
});

function verificarAuth() {
    const token = localStorage.getItem('token');
    const linkLogin = document.getElementById('linkLogin');
    const linkLogout = document.getElementById('linkLogout');
    const linkBackoffice = document.getElementById('linkBackoffice');
    
    if (linkLogin && linkLogout) {
        if (token) {
            linkLogin.classList.add('d-none');
            linkLogout.classList.remove('d-none');
            linkLogout.addEventListener('click', logout);
            if (linkBackoffice) linkBackoffice.classList.remove('d-none');
        } else {
            linkLogin.classList.remove('d-none');
            linkLogout.classList.add('d-none');
            if(linkBackoffice) linkBackoffice.classList.add('d-none');
        }
    }
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', logout);
}

function configurarRegisto() {
    const form = document.getElementById('formRegisto');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const alertBox = document.getElementById('registoAlert');

        try {
            const res = await fetch(`${API_URL}/utilizadores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Conta criada com sucesso! Podes fazer login.');
                window.location.href = 'login.html';
            } else {
                alertBox.textContent = data.message || 'Erro ao criar conta.';
                alertBox.classList.remove('d-none');
            }
        } catch (err) {
            console.error(err);
            alertBox.textContent = "Erro de conexão.";
            alertBox.classList.remove('d-none');
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined') return null;
    return JSON.parse(userStr);
}

async function carregarFilmesHome() {
    const lista = document.getElementById('lista-filmes');
    if(!lista) return;

    try {
        const res = await fetch(`${API_URL}/filmes-series`);
        const filmes = await res.json();
        
        lista.innerHTML = '';
        if(filmes.length === 0) lista.innerHTML = '<p class="text-white">Nenhum filme encontrado.</p>';

        filmes.forEach(f => {
            lista.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card bg-secondary text-white h-100">
                        <div class="card-body">
                            <h5 class="card-title text-warning">${f.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${f.ano_lancamento} | ${f.tipo}</h6>
                            <p class="card-text text-truncate">${f.sinopse || 'Sem sinopse'}</p>
                            <a href="pages/detalhes.html?id=${f.id_filmes_series}" class="btn btn-sm btn-light w-100">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error(err);
    }
}

async function pesquisarFilmes() {
    const termo = document.getElementById('inputPesquisa').value;
    const lista = document.getElementById('lista-filmes');

    if (!termo) {
        carregarFilmesHome();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/filmes-series/titulo/${termo}`);
        const filmes = await res.json();
        
        lista.innerHTML = '';
        if (filmes.length === 0) {
            lista.innerHTML = '<p class="text-white">Nenhum filme encontrado.</p>';
            return;
        }

        filmes.forEach(f => {
            lista.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card bg-secondary text-white h-100">
                        <div class="card-body">
                            <h5 class="card-title text-warning">${f.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${f.ano_lancamento} | ${f.tipo}</h6>
                            <p class="card-text text-truncate">${f.sinopse || 'Sem sinopse'}</p>
                            <a href="pages/detalhes.html?id=${f.id_filmes_series}" class="btn btn-sm btn-light w-100">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

function configurarLogin() {
    const form = document.getElementById('formLogin');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const alertBox = document.getElementById('loginAlert');

        try {
            const res = await fetch(`${API_URL}/utilizadores/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.utilizador));
                window.location.href = '../index.html';
            } else {
                alertBox.textContent = data.message;
                alertBox.classList.remove('d-none');
            }
        } catch (err) {
            console.error(err);
            alertBox.textContent = "Erro de conexão";
            alertBox.classList.remove('d-none');
        }
    });
}

async function carregarMinhaConta() {
    const token = getToken();
    const user = getUser();
    
    if (!token || !user) {
        console.warn("User ou token inválidos. Redirecionando...");
        logout(); 
        return;
    }

    const idUser = user.id_utilizadores || user.id;
    console.log("ID do utilizador logado:", idUser);

    const inputNome = document.getElementById('editNome');
    const inputEmail = document.getElementById('editEmail');
    if (inputNome) inputNome.value = user.nome || '';
    if (inputEmail) inputEmail.value = user.email || '';

    const formPerfil = document.getElementById('formPerfil');
    if (formPerfil) {
        const novoForm = formPerfil.cloneNode(true);
        formPerfil.parentNode.replaceChild(novoForm, formPerfil);
        
        novoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('editNome').value;
            const email = document.getElementById('editEmail').value;

            try {
                const res = await fetch(`${API_URL}/utilizadores/${idUser}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ nome, email })
                });
                
                if (res.ok) {
                    alert('Dados atualizados! Faz login novamente para ver as mudanças.');
                    logout();
                } else {
                    const err = await res.json();
                    alert('Erro: ' + err.message);
                }
            } catch (err) { console.error(err); }
        });
    }

    const formSenha = document.getElementById('formSenha');
    if (formSenha) {
        const novoFormSenha = formSenha.cloneNode(true);
        formSenha.parentNode.replaceChild(novoFormSenha, formSenha);

        novoFormSenha.addEventListener('submit', async (e) => {
            e.preventDefault();
            const senhaAntiga = document.getElementById('senhaAntiga').value;
            const novaSenha = document.getElementById('novaSenha').value;

            try {
                const res = await fetch(`${API_URL}/utilizadores/${idUser}/senha`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ senhaAntiga, novaSenha })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Senha alterada com sucesso!');
                    document.getElementById('senhaAntiga').value = '';
                    document.getElementById('novaSenha').value = '';
                } else {
                    alert('Erro: ' + data.message);
                }
            } catch (err) { console.error(err); }
        });
    }

    const listaFav = document.getElementById('lista-favoritos');
    if (listaFav) {
        try {
            const resFav = await fetch(`${API_URL}/favoritos`, { headers: { 'Authorization': `Bearer ${token}` }});
            const favoritos = await resFav.json();
            
            listaFav.innerHTML = '';
            if (!Array.isArray(favoritos) || favoritos.length === 0) {
                listaFav.innerHTML = '<p class="text-white">Sem favoritos.</p>';
            } else {
                favoritos.forEach(f => {
                    listaFav.innerHTML += `
                        <div class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-2 border-secondary">
                            <span>${f.nome} (${f.ano_lancamento})</span>
                            <div>
                                <a href="detalhes.html?id=${f.id_filmes_series}" class="btn btn-sm btn-light">Ver</a>
                                <button onclick="removerFavorito(${f.id_filmes_series}, this)" class="btn btn-sm btn-danger">🗑️</button>
                            </div>
                        </div>`;
                });
            }
        } catch (err) { console.error("Erro Favoritos:", err); }
    }

    const listaPes = document.getElementById('lista-pessoal');
    if (listaPes) {
        try {
            const resList = await fetch(`${API_URL}/listas`, { headers: { 'Authorization': `Bearer ${token}` }});
            const listas = await resList.json();

            listaPes.innerHTML = '';
            if (!Array.isArray(listas) || listas.length === 0) {
                listaPes.innerHTML = '<p class="text-white">Lista vazia.</p>';
            } else {
                listas.forEach(l => {
                    listaPes.innerHTML += `
                        <div class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center mb-2 border-secondary">
                            <span>${l.nome}</span>
                            <div>
                                <a href="detalhes.html?id=${l.id_filmes_series}" class="btn btn-sm btn-light">Ver</a>
                                <button onclick="removerDaLista(${l.id_filmes_series}, this)" class="btn btn-sm btn-danger">🗑️</button>
                            </div>
                        </div>`;
                });
            }
        } catch (err) { console.error("Erro Listas:", err); }
    }
}

async function removerFavorito(id, botaoElemento) {
    if(!confirm('Remover dos favoritos?')) return;
    await fetch(`${API_URL}/favoritos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const linha = botaoElemento.closest('.list-group-item');
    linha.remove();
}

async function removerDaLista(id, botaoElemento) {
    if(!confirm('Remover da lista?')) return;
    await fetch(`${API_URL}/listas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const linha = botaoElemento.closest('.list-group-item');
    linha.remove();
}

async function carregarDetalhesFilme() {
    const params = new URLSearchParams(window.location.search);
    const idFilme = params.get('id');
    if (!idFilme) return;

    try {
        const res = await fetch(`${API_URL}/filmes-series/${idFilme}`);
        const filme = await res.json();

        document.getElementById('tituloFilme').innerText = filme.nome;
        document.getElementById('infoFilme').innerText = `${filme.ano_lancamento} • ${filme.duracao} min • ${filme.tipo}`;
        document.getElementById('sinopseFilme').innerText = filme.sinopse;
        document.getElementById('diretorFilme').innerText = filme.diretor || 'N/A';
        document.getElementById('generosFilme').innerText = filme.generos ? filme.generos.join(', ') : 'N/A';
        document.getElementById('elencoFilme').innerText = filme.elenco ? filme.elenco.join(', ') : 'N/A';

        carregarReviews(idFilme);

        const formReview = document.getElementById('formReview');
        if (formReview) {
            formReview.addEventListener('submit', async (e) => {
                e.preventDefault();
                const token = getToken();
                if(!token) return alert('Faz login para escrever review!');

                const classificacao = document.getElementById('reviewNota').value;
                const critica = document.getElementById('reviewTexto').value;

                const resRev = await fetch(`${API_URL}/reviews`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ id_filme_serie: idFilme, classificacao, critica })
                });

                if (resRev.ok) {
                    alert('Review publicada!');
                    location.reload();
                } else {
                    const data = await resRev.json();
                    alert(data.message || 'Erro ao publicar.');
                }
            });
        }
    } catch (err) { console.error(err); }
}

async function adicionarAosFavoritos() {
    const token = getToken();
    if(!token) return alert('Faz login primeiro!');
    const idFilme = new URLSearchParams(window.location.search).get('id');

    const res = await fetch(`${API_URL}/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_filme_serie: idFilme })
    });
    
    if(res.ok) alert('Adicionado aos Favoritos!');
    else alert('Erro ou já adicionado.');
}

async function adicionarALista() {
    const token = getToken();
    if(!token) return alert('Faz login primeiro!');
    const idFilme = new URLSearchParams(window.location.search).get('id');

    const res = await fetch(`${API_URL}/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_filme_serie: idFilme })
    });

    if(res.ok) alert('Adicionado à Lista!');
    else alert('Erro ou já adicionado.');
}

async function carregarReviews(idFilme) {
    const res = await fetch(`${API_URL}/reviews/filmeserie/${idFilme}`);
    const reviews = await res.json();
    const container = document.getElementById('lista-reviews');
    
    const user = getUser();
    const meuId = user ? (user.id_utilizadores || user.id) : null;

    container.innerHTML = '';
    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p class="text-white">Ainda não há reviews.</p>';
        return;
    }

    reviews.forEach(r => {
        let btnExcluir = '';
        if (meuId && r.id_utilizador == meuId) {
            btnExcluir = `<button onclick="apagarReview(${r.id_reviews})" class="btn btn-sm btn-danger ms-2" title="Apagar minha review">🗑️</button>`;
        }

        container.innerHTML += `
            <div class="card bg-dark border-secondary mb-2 text-white">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title text-warning">Nota: ${r.classificacao}/5</h5>
                        <small class="text-muted">${r.data_criacao || ''}</small>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">Por: ${r.nome_utilizador || 'Anónimo'}</h6>
                    <p class="card-text">${r.critica}</p>
                    
                    <div class="d-flex align-items-center">
                        <button onclick="curtirReview(${r.id_reviews})" class="btn btn-sm btn-outline-light">👍 Útil (${r.votos})</button>
                        ${btnExcluir} </div>
                </div>
            </div>`;
    });
}

async function apagarReview(idReview) {
    if(!confirm('Tens a certeza que queres apagar a tua review?')) return;

    const token = getToken();
    if(!token) return alert('Sessão expirada. Faz login novamente.');

    try {
        const res = await fetch(`${API_URL}/reviews/${idReview}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        if (res.ok) {
            alert('Review apagada com sucesso!');
            location.reload();
        } else {
            const data = await res.json();
            alert('Erro: ' + (data.message || 'Não foi possível apagar.'));
        }
    } catch (err) {
        console.error(err);
        alert('Erro de conexão.');
    }
}

async function curtirReview(idReview) {
    const token = getToken();
    if(!token) return alert('Faz login para curtir!');
    await fetch(`${API_URL}/reviews/${idReview}/votar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    location.reload();
}

async function filtrarCatalogo(tipo) {
    const container = document.getElementById('lista-filmes');
    container.innerHTML = '<p class="text-white">A carregar...</p>';

    document.querySelectorAll('.btn-group .btn').forEach(b => b.classList.remove('active'));
    
    let url = `${API_URL}/filmes-series`;
    
    if (tipo === 'todos') {
        document.getElementById('btnTodos').classList.add('active');
    } else if (tipo === 'filmes') {
        document.getElementById('btnFilmes').classList.add('active');
        url = `${API_URL}/filmes-series/filmes`;
    } else if (tipo === 'series') {
        document.getElementById('btnSeries').classList.add('active');
        url = `${API_URL}/filmes-series/series`;
    }

    try {
        const res = await fetch(url);
        const lista = await res.json();

        container.innerHTML = '';
        if (lista.length === 0) {
            container.innerHTML = '<p class="text-white">Nada encontrado nesta categoria.</p>';
            return;
        }

        lista.forEach(f => {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card bg-secondary text-white h-100">
                        <div class="card-body">
                            <h5 class="card-title text-warning">${f.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${f.ano_lancamento} | ${f.tipo}</h6>
                            <p class="card-text text-truncate">${f.sinopse || 'Sem sinopse'}</p>
                            <a href="pages/detalhes.html?id=${f.id_filmes_series}" class="btn btn-sm btn-light w-100">Ver Detalhes</a>
                        </div>
                    </div>
                </div>`;
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="text-danger">Erro ao carregar lista.</p>';
    }
}

async function buscarNoTmdb() {
    const query = document.getElementById('tmdbQuery').value;
    const tipo = document.getElementById('tmdbTipo').value;
    const container = document.getElementById('lista-tmdb');
    const token = getToken();

    if (!token) return alert('Precisas de estar logado!');
    
    container.innerHTML = '<p class="text-white">A pesquisar...</p>';

    try {
        const res = await fetch(`${API_URL}/tmdb/search?query=${query}&tipo=${tipo}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        const data = await res.json();

        container.innerHTML = '';
        if(data.length === 0) {
            container.innerHTML = '<p class="text-white">Nada encontrado.</p>';
            return;
        }

        data.forEach(item => {
            const img = item.poster ? `https://image.tmdb.org/t/p/w200${item.poster}` : 'https://placehold.co/200x300?text=Sem+Imagem';
            
            container.innerHTML += `
                <div class="col-md-3 mb-4">
                    <div class="card h-100 bg-dark text-white border-secondary">
                        <img src="${img}" class="card-img-top">
                        <div class="card-body p-2">
                            <h6 class="card-title text-warning">${item.titulo}</h6>
                            <small class="d-block mb-2 text-muted">${item.ano}</small>
                            <button onclick="importarFilme(${item.tmdb_id}, '${tipo}')" class="btn btn-success w-100 btn-sm">📥 Importar</button>
                        </div>
                    </div>
                </div>`;
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="text-danger">Erro na pesquisa.</p>';
    }
}

async function importarFilme(id, tipo) {
    if (!confirm('Importar este item para o sistema?')) return;
    
    const token = getToken();
    
    try {
        const res = await fetch(`${API_URL}/tmdb/import`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tmdb_id: id, tipo: tipo })
        });

        const data = await res.json();

        if (res.ok) {
            alert(`Sucesso! "${data.titulo}" importado.`);
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao importar.');
    }
}

async function carregarGenerosBackoffice() {
    const lista = document.getElementById('lista-generos');
    const form = document.getElementById('formGenero');
    const token = getToken();

    try {
        const res = await fetch(`${API_URL}/generos`);
        const generos = await res.json();
        
        lista.innerHTML = '';
        generos.forEach(g => {
            lista.innerHTML += `
            <li class="list-group-item bg-dark text-white d-flex justify-content-between border-secondary">
                ${g.nome}
                <div>
                    <button onclick="prepararEditGenero(${g.id_generos}, '${g.nome.replace(/'/g, "\\'")}')" class="btn btn-sm btn-info me-2">✏️</button>
                    <button onclick="apagarGenero(${g.id_generos})" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            </li>`;
        });
    } catch (err) { console.error(err); }

    if(form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            const id = document.getElementById('idEditGenero').value;
            const nome = document.getElementById('nomeGenero').value;
            
            let url = `${API_URL}/generos`;
            let method = 'POST';

            if(id) {
                url += `/${id}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({nome})
            });

            if(res.ok) { 
                alert(id ? 'Editado!' : 'Criado!'); 
                location.reload(); 
            } else alert('Erro.');
        });
    }

}

function prepararEditGenero(id, nome) {
    document.getElementById('idEditGenero').value = id;
    document.getElementById('nomeGenero').value = nome;
    document.getElementById('btnSubmitGenero').innerText = 'Atualizar';
    document.getElementById('btnSubmitGenero').classList.replace('btn-warning', 'btn-info');
    document.getElementById('btnCancelGenero').classList.remove('d-none');
}

function resetFormGenero() {
    document.getElementById('formGenero').reset();
    document.getElementById('idEditGenero').value = '';
    document.getElementById('btnSubmitGenero').innerText = 'Criar';
    document.getElementById('btnSubmitGenero').classList.replace('btn-info', 'btn-warning');
    document.getElementById('btnCancelGenero').classList.add('d-none');
}

async function apagarGenero(id) {
    if(!confirm('Tens a certeza? Se este género tiver filmes, pode dar erro.')) return;
    const token = getToken();
    try {
        const res = await fetch(`${API_URL}/generos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) location.reload();
        else alert('Erro ao apagar (provavelmente está em uso).');
    } catch (err) { console.error(err); }
}

async function carregarDiretoresBackoffice() {
    const lista = document.getElementById('lista-diretores');
    const form = document.getElementById('formDiretor');
    const token = getToken();

    const res = await fetch(`${API_URL}/diretores`);
    const dados = await res.json();
    lista.innerHTML = '';
    dados.forEach(d => {
        lista.innerHTML += `
            <li class="list-group-item bg-dark text-white d-flex justify-content-between border-secondary">
                ${d.nome}
                <div>
                    <button onclick="prepararEditDiretor(${d.id_diretores}, '${d.nome.replace(/'/g, "\\'")}')" class="btn btn-sm btn-info me-2">✏️</button>
                    <button onclick="apagarDiretor(${d.id_diretores})" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            </li>`;
    });

    if(form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            const id = document.getElementById('idEditDiretor').value;
            const nome = document.getElementById('nomeDiretor').value;
            
            let url = `${API_URL}/diretores`;
            let method = 'POST';
            if(id) { url += `/${id}`; method = 'PUT'; }

            const res = await fetch(url, {
                method: method,
                headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({nome})
            });
            if(res.ok) { location.reload(); } else alert('Erro.');
        });
    }
}

function prepararEditDiretor(id, nome) {
    document.getElementById('idEditDiretor').value = id;
    document.getElementById('nomeDiretor').value = nome;
    document.getElementById('btnSubmitDiretor').innerText = 'Atualizar';
    document.getElementById('btnSubmitDiretor').classList.replace('btn-warning', 'btn-info');
    document.getElementById('btnCancelDiretor').classList.remove('d-none');
}
function resetFormDiretor() {
    document.getElementById('formDiretor').reset();
    document.getElementById('idEditDiretor').value = '';
    document.getElementById('btnSubmitDiretor').innerText = 'Criar';
    document.getElementById('btnSubmitDiretor').classList.replace('btn-info', 'btn-warning');
    document.getElementById('btnCancelDiretor').classList.add('d-none');
}

async function apagarDiretor(id) {
    if(!confirm('Tens a certeza?')) return;
    const token = getToken();
    try {
        const res = await fetch(`${API_URL}/diretores/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) location.reload();
        else alert('Erro ao apagar.');
    } catch (err) { console.error(err); }
}

async function carregarAtoresBackoffice() {
    const lista = document.getElementById('lista-atores');
    const form = document.getElementById('formAtor');
    const token = getToken();

    const res = await fetch(`${API_URL}/atores`);
    const dados = await res.json();
    lista.innerHTML = '';
    dados.forEach(a => {
        lista.innerHTML += `
            <li class="list-group-item bg-dark text-white d-flex justify-content-between border-secondary">
                ${a.nome}
                <div>
                    <button onclick="prepararEditAtor(${a.id_atores}, '${a.nome.replace(/'/g, "\\'")}')" class="btn btn-sm btn-info me-2">✏️</button>
                    <button onclick="apagarAtor(${a.id_atores})" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            </li>`;
    });

    if(form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            const id = document.getElementById('idEditAtor').value;
            const nome = document.getElementById('nomeAtor').value;
            
            let url = `${API_URL}/atores`;
            let method = 'POST';
            if(id) { url += `/${id}`; method = 'PUT'; }

            const res = await fetch(url, {
                method: method,
                headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({nome})
            });
            if(res.ok) { location.reload(); } else alert('Erro.');
        });
    }
}

function prepararEditAtor(id, nome) {
    document.getElementById('idEditAtor').value = id;
    document.getElementById('nomeAtor').value = nome;
    document.getElementById('btnSubmitAtor').innerText = 'Atualizar';
    document.getElementById('btnSubmitAtor').classList.replace('btn-warning', 'btn-info');
    document.getElementById('btnCancelAtor').classList.remove('d-none');
}
function resetFormAtor() {
    document.getElementById('formAtor').reset();
    document.getElementById('idEditAtor').value = '';
    document.getElementById('btnSubmitAtor').innerText = 'Criar';
    document.getElementById('btnSubmitAtor').classList.replace('btn-info', 'btn-warning');
    document.getElementById('btnCancelAtor').classList.add('d-none');
}

async function apagarAtor(id) {
    if(!confirm('Tens a certeza?')) return;
    const token = getToken();
    try {
        await fetch(`${API_URL}/atores/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        location.reload();
    } catch (err) { console.error(err); }
}

async function carregarFilmesSeriesBackoffice() {
    const lista = document.getElementById('lista-filmes-backoffice');
    const form = document.getElementById('formFilmeBackoffice');

    const selectDiretor = document.getElementById('selectDiretor');
    const selectGeneros = document.getElementById('selectGeneros');
    const selectAtores = document.getElementById('selectAtores');
    const token = getToken();

    try {
        const [resDir, resGen, resAtor, resFilmes] = await Promise.all([
            fetch(`${API_URL}/diretores`),
            fetch(`${API_URL}/generos`),
            fetch(`${API_URL}/atores`),
            fetch(`${API_URL}/filmes-series`)
        ]);

        const diretores = await resDir.json();
        const generos = await resGen.json();
        const atores = await resAtor.json();
        const filmes = await resFilmes.json();

        selectDiretor.innerHTML = '<option value="">Seleciona um realizador...</option>';
        diretores.forEach(d => selectDiretor.innerHTML += `<option value="${d.id_diretores}">${d.nome}</option>`);

        selectGeneros.innerHTML = '';
        generos.forEach(g => selectGeneros.innerHTML += `<option value="${g.id_generos}">${g.nome}</option>`);

        selectAtores.innerHTML = '';
        atores.forEach(a => selectAtores.innerHTML += `<option value="${a.id_atores}">${a.nome}</option>`);

        lista.innerHTML = '';
        filmes.forEach(f => {
            lista.innerHTML += `
                <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center border-secondary">
                    <div>
                        <strong>${f.nome}</strong> <small>(${f.ano_lancamento})</small><br>
                        <small class="text-white-50">${f.tipo}</small>
                    </div>
                    <div>
                        <button onclick="prepararEditFilme(${f.id_filmes_series})" class="btn btn-sm btn-info me-1">✏️</button>
                        <button onclick="apagarFilmeManual(${f.id_filmes_series})" class="btn btn-sm btn-danger">🗑️</button>
                    </div>
                </li>`;
        });

    } catch (err) { console.error("Erro dados:", err); }
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const elDiretor = document.getElementById('selectDiretor');
            const elGeneros = document.getElementById('selectGeneros');
            const elAtores = document.getElementById('selectAtores');

            const idEdit = document.getElementById('idEditFilme').value;
            const isEdit = !!idEdit;

            const dadosFilme = {
                nome: document.getElementById('filmeNome').value,
                tipo: document.getElementById('filmeTipo').value,
                ano_lancamento: document.getElementById('filmeAno').value,
                duracao: document.getElementById('filmeDuracao').value,
                classificacao_idade: document.getElementById('filmeIdade').value,
                id_diretor: elDiretor.value,
                sinopse: document.getElementById('filmeSinopse').value
            };

            const idsGeneros = Array.from(elGeneros.selectedOptions).map(o => o.value);
            const idsAtores = Array.from(elAtores.selectedOptions).map(o => o.value);

            if (!dadosFilme.id_diretor) return alert('Escolhe um diretor!');

            try {
                let url = `${API_URL}/filmes-series`;
                let method = 'POST';

                if (isEdit) {
                    url += `/${idEdit}`;
                    method = 'PUT';
                }

                const resFilme = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(dadosFilme)
                });

                if (!resFilme.ok) throw new Error((await resFilme.json()).message);
                
                const jsonFilme = await resFilme.json();
                const idFinal = isEdit ? idEdit : jsonFilme.id_criado;
                if (idsGeneros.length > 0) {
                    await fetch(`${API_URL}/filmes-series/${idFinal}/generos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ ids_generos: idsGeneros })
                    });
                }

                if (idsAtores.length > 0) {
                    await fetch(`${API_URL}/filmes-series/${idFinal}/atores`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ ids_atores: idsAtores })
                    });
                }
                
                alert(isEdit ? 'Filme atualizado!' : 'Filme criado!');
                location.reload(); 

            } catch (err) { 
                console.error(err);
                alert('Erro: ' + err.message); 
            }
        });
    }
}

async function prepararEditFilme(id) {
    try {
        const res = await fetch(`${API_URL}/filmes-series/${id}`);
        const filme = await res.json();

        document.getElementById('idEditFilme').value = filme.id_filmes_series;
        document.getElementById('filmeNome').value = filme.nome;
        document.getElementById('filmeTipo').value = filme.tipo;
        document.getElementById('filmeAno').value = filme.ano_lancamento;
        document.getElementById('filmeDuracao').value = filme.duracao;
        document.getElementById('filmeIdade').value = filme.classificacao_idade;
        document.getElementById('filmeSinopse').value = filme.sinopse;

        const selectDir = document.getElementById('selectDiretor');
        for(let i=0; i<selectDir.options.length; i++) {
            if(selectDir.options[i].text === filme.diretor) {
                selectDir.selectedIndex = i;
                break;
            }
        }

        const selectGen = document.getElementById('selectGeneros');
        Array.from(selectGen.options).forEach(opt => {
            opt.selected = filme.generos && filme.generos.includes(opt.text);
        });

        const selectAtor = document.getElementById('selectAtores');
        Array.from(selectAtor.options).forEach(opt => {
            opt.selected = filme.elenco && filme.elenco.includes(opt.text);
        });

        document.getElementById('tituloFormulario').innerText = `A Editar: ${filme.nome}`;
        document.getElementById('btnSubmitFilme').innerText = 'Atualizar Filme';
        document.getElementById('btnSubmitFilme').classList.replace('btn-warning', 'btn-info');
        document.getElementById('btnCancelFilme').classList.remove('d-none');

        document.getElementById('formFilmeBackoffice').scrollIntoView({behavior: 'smooth'});

    } catch(err) {
        console.error(err);
        alert('Erro ao carregar filme.');
    }
}

function resetFormFilme() {
    document.getElementById('formFilmeBackoffice').reset();
    document.getElementById('idEditFilme').value = '';
    
    document.getElementById('tituloFormulario').innerText = 'Novo Filme / Série';
    document.getElementById('btnSubmitFilme').innerText = 'Criar Filme Completo';
    document.getElementById('btnSubmitFilme').classList.replace('btn-info', 'btn-warning');
    document.getElementById('btnCancelFilme').classList.add('d-none');
    
    const selectGen = document.getElementById('selectGeneros');
    const selectAtor = document.getElementById('selectAtores');
    Array.from(selectGen.options).forEach(o => o.selected = false);
    Array.from(selectAtor.options).forEach(o => o.selected = false);
}

async function apagarFilmeManual(id) {
    if(!confirm('Apagar este filme e todas as suas reviews?')) return;
    const token = getToken();
    try {
        await fetch(`${API_URL}/filmes-series/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        location.reload();
    } catch (err) { console.error(err); }
}