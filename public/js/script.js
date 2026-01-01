const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    verificarAuth();

    const path = window.location.pathname;

    if (path.includes('login.html')) {
        configurarLogin();
    } else if (path.includes('minha-conta.html')) {
        carregarMinhaConta();
    } else if (path.includes('detalhes.html')) {
        carregarDetalhesFilme();
    } else if (path.includes('importar.html')) {
         // Se tiveres a página de importar
         // Adiciona listeners para o TMDB se necessário
    } else {
        // Assume Home
        carregarFilmesHome();
    }
});

// --- AUTENTICAÇÃO ---
function verificarAuth() {
    const token = localStorage.getItem('token');
    const linkLogin = document.getElementById('linkLogin');
    const linkLogout = document.getElementById('linkLogout');
    const linkMinhaConta = document.getElementById('linkMinhaConta');
    
    // Ajuste Navbar
    if (linkLogin && linkLogout) {
        if (token) {
            linkLogin.classList.add('d-none');
            linkLogout.classList.remove('d-none');
            linkLogout.addEventListener('click', logout);
        } else {
            linkLogin.classList.remove('d-none');
            linkLogout.classList.add('d-none');
        }
    }
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) btnLogout.addEventListener('click', logout);
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

// --- HOME PAGE ---
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

// --- LOGIN ---
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
                // IMPORTANTE: Agora data.utilizador deve vir preenchido!
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

// --- MINHA CONTA (Perfil, Senha, Listas, Favoritos) ---
async function carregarMinhaConta() {
    const token = getToken();
    const user = getUser();
    
    // Proteção: Se não houver user válido, manda para login
    if (!token || !user) {
        console.warn("User ou token inválidos. Redirecionando...");
        logout(); 
        return;
    }

    const idUser = user.id_utilizadores || user.id;
    console.log("ID do utilizador logado:", idUser);

    // 1. Preencher Formulário de Perfil
    const inputNome = document.getElementById('editNome');
    const inputEmail = document.getElementById('editEmail');
    if (inputNome) inputNome.value = user.nome || '';
    if (inputEmail) inputEmail.value = user.email || '';

    // Atualizar Dados
    const formPerfil = document.getElementById('formPerfil');
    if (formPerfil) {
        // Clonar para limpar eventos antigos
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

    // 2. Alterar Senha (Faltava isto no teu código!)
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

    // 3. Carregar Favoritos
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
                                <button onclick="removerFavorito(${f.id_filmes_series})" class="btn btn-sm btn-danger">🗑️</button>
                            </div>
                        </div>`;
                });
            }
        } catch (err) { console.error("Erro Favoritos:", err); }
    }

    // 4. Carregar Listas
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
                                <button onclick="removerDaLista(${l.id_filmes_series})" class="btn btn-sm btn-danger">🗑️</button>
                            </div>
                        </div>`;
                });
            }
        } catch (err) { console.error("Erro Listas:", err); }
    }
}

// Funções Globais (para funcionarem no onclick)
async function removerFavorito(id) {
    if(!confirm('Remover dos favoritos?')) return;
    await fetch(`${API_URL}/favoritos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    location.reload();
}

async function removerDaLista(id) {
    if(!confirm('Remover da lista?')) return;
    await fetch(`${API_URL}/listas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    location.reload();
}

// --- DETALHES FILME ---
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

        // Formulário Review
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

// Ações Globais (Adicionar/Curtir)
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
    
    container.innerHTML = '';
    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p class="text-white">Ainda não há reviews.</p>';
        return;
    }

    reviews.forEach(r => {
        container.innerHTML += `
            <div class="card bg-dark border-secondary mb-2 text-white">
                <div class="card-body">
                    <h5 class="card-title text-warning">Nota: ${r.classificacao}/5</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Por: ${r.nome_utilizador || 'Anónimo'}</h6>
                    <p class="card-text">${r.critica}</p>
                    <button onclick="curtirReview(${r.id_reviews})" class="btn btn-sm btn-outline-light">👍 Útil (${r.votos})</button>
                </div>
            </div>`;
    });
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
        url = `${API_URL}/filmes-series/filmes`; // Rota só de filmes
    } else if (tipo === 'series') {
        document.getElementById('btnSeries').classList.add('active');
        url = `${API_URL}/filmes-series/series`; // Rota só de séries
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