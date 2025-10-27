// Inicializa o modal de sucesso
let modalSuccess = new bootstrap.Modal(document.getElementById('cadSuccessfully'));

// Pega o elemento do modal de carregamento (que está no base.html)
const loadingModalElement = document.getElementById('carregamento');
let loadingModal = null;
if (loadingModalElement) {
    // Inicializa o modal do Bootstrap para podermos usar .show() e .hide()
    loadingModal = new bootstrap.Modal(loadingModalElement);
}

//função para pegar cookie do csrf_token
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function gerarSenha() {
    let caracteres = 'qwertyui8WEITORAKSJDHFGNVMCZXNZ5422570cmakxafsiz@#$';
    let senha = ''

    for (let i = 0; i < 8; i++) {
        let index = Math.floor(Math.random() * caracteres.length);
        senha += caracteres.charAt(index);
    }

    const senhaSpan = document.getElementById('gerar_senha');
    const senhaArea = document.getElementById('gerar_senha_area');

    if (senhaSpan && senhaArea) {
        senhaSpan.textContent = senha;
        senhaArea.classList.remove('d-none');
    }

    // --- CORREÇÃO 2: VERIFICAR SE OS ELEMENTOS EXISTEM ---
    let avisoTexto = document.getElementById('aviso_gerePass_texto');
    if (avisoTexto) avisoTexto.style.display = 'none';
    
    let avisoErro = document.getElementById('aviso_gerePass_erro');
    if (avisoErro) avisoErro.style.display = 'none';
}

function voltarConfirm() {
    window.location.href = '/docente/';
}


document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let csrf_token = getCookie('csrftoken');

    // Captura os dados do formulário
    let nomeCad = document.getElementById('nomeCad').value;
    let cpfCad = document.getElementById('cpfCad').value;
    let dateCad = document.getElementById('dateCad').value;
    let emailCad = document.getElementById('emailCad').value;
    let disciplinaCad = document.getElementById('disciplinaCad').value;

    // Pega o <span> onde a senha está
    const senhaElement = document.getElementById('gerar_senha');
    // Lê o texto de dentro dele (só existe na página de cadastro)
    let senhaCad = senhaElement ? senhaElement.textContent : '';
    
    // Detecta se está em modo de edição
    const isEditMode = window.location.pathname.includes('alter_docente');
    const docenteId = isEditMode ? window.location.pathname.split('/').pop() : null;
    
    const url = isEditMode ? `/docente/alter_docente/${docenteId}/` : `/docente/cadastro_docente/`;
    
    // Prepara os dados do 'fetch'
    let dados = {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        },
        body: null // Será definido abaixo
    };
    
    // 'PUT' (Alterar)
    if (isEditMode) {
        dados.body = JSON.stringify({
            'nome': nomeCad,
            'data_nascimento': dateCad,
            'email': emailCad,
            'disciplina': disciplinaCad
        });
    } 
    // 'POST' (Cadastrar)
    else {
        // --- CORREÇÃO 2: VERIFICAR SE O AVISO EXISTE ANTES DE USAR ---
        let avisoErro = document.getElementById('aviso_gerePass_erro');
        if (senhaCad == '') {
            if (avisoErro) {
                avisoErro.style.display = 'block'; // Mostra o aviso de erro
            } else {
                // Fallback caso o elemento não seja encontrado
                alert('É obrigatório gerar uma senha!');
            }
            return; // Para a execução
        }

        dados.body = JSON.stringify({
            'usuario': nomeCad,
            'senha': senhaCad,
            'cpf': cpfCad,
            'data_nascimento': dateCad,
            'email': emailCad,
            'disciplina': disciplinaCad
        });
    }
    
    // --- CORREÇÃO 1: MOSTRAR O MODAL DE CARREGAMENTO ---
    if (loadingModal) loadingModal.show();

    await fetch(url, dados)
    .then(async (response) => { // 'async' para poder ler a resposta json em caso de erro
        if (response.status === 201 || response.status === 200) {
            if (loadingModal) loadingModal.hide(); // Esconde o carregamento
            
            if (isEditMode) {
                alert('Docente atualizado com sucesso!');
                window.location.href = '/docente/';
            } else {
                modalSuccess.show(); // Mostra o modal de sucesso
                return response.json();
            }
        } else {
            // Se der erro (400, 500, etc.)
            if (loadingModal) loadingModal.hide(); // Esconde o carregamento
            
            // Tenta ler a mensagem de erro que a view enviou (ex: "CPF já existe")
            const errorData = await response.json().catch(() => null);
            const mensagemErro = errorData ? errorData.mensagem : `Erro ${response.status}`;
            
            alert(`Erro ao processar a solicitação: ${mensagemErro}`);
        }
    })
    .then((data) => {
        // Este .then() só roda se o response foi 201 (Criação)
        if (data) {
            document.getElementById('dados_user_nameUser').innerHTML = 'Usuário: '  + data.user;
            document.getElementById('dados_user_pass').innerHTML = 'Senha: ' + senhaCad;
        }
    })
    .catch((error) => {
        // Erro de rede ou falha no fetch
        if (loadingModal) loadingModal.hide(); // Esconde o carregamento
        console.log('Ocorreu um erro de rede:', error);
        alert('Erro ao processar solicitação: ' + error.message);
    });
});