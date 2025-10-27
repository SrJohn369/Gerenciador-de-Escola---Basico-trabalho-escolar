// --- CORREÇÃO 1: CÓDIGO DO 'img-drop' REMOVIDO ---
// O 'if (isAuthenticated)' e o 'img-drop' foram removidos 
// porque o elemento 'img-drop' não existe no teu cadDirecao.html.

// Inicializa o modal de sucesso
let modalSuccess = new bootstrap.Modal(document.getElementById('cadSuccessfully'));

// --- CORREÇÃO 2: INICIALIZAR O MODAL DE CARREGAMENTO ---
// O 'carregamento' é um modal, não um 'div' normal.
const loadingModalElement = document.getElementById('carregamento'); // Referência ao modal no base.html
let loadingModal = null;
if (loadingModalElement) {
    // Inicializa o modal do Bootstrap para podermos usar .show() e .hide()
    loadingModal = new bootstrap.Modal(loadingModalElement);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function verifyPass() {
    let password = document.getElementById('senhaCad').value;
    let pwdConfirm = document.getElementById('confirmSenhaCad').value;

    if (password === pwdConfirm) {
        return true;
    } else {
        return false;
    }
}

function voltarConfirm() {
    // Esta variável 'isAuthenticated' é definida globalmente no base.html
    if (isAuthenticated) {
        window.location.href = '/direcao/';
    } else {
        window.location.href = '/login/';
    }
}

// Procura o botão de submit (ID 'submit-cad' existe no HTML)
const submitButton = document.getElementById('submit-cad');

if (submitButton) { // Adiciona verificação para segurança
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
        let csrf_token = getCookie('csrftoken');

        let nomeCad = document.getElementById('nomeCad').value;
        let cpfCad = document.getElementById('cpfCad').value;
        let dateCad = document.getElementById('dateCad').value;
        let emailCad = document.getElementById('emailCad').value;
        
        const isEditMode = window.location.pathname.includes('alter_direcao');
        const direcaoId = isEditMode ? window.location.pathname.split('/').pop() : null;
        
        const url = isEditMode ? `/direcao/alter_direcao/${direcaoId}/` : `/cadastro_direcao/`;
        
        let dados = {
            method: isEditMode ? 'PUT' : 'POST',
            headers: {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            },
            // Dados padrão para 'PUT' (Alteração)
            body: JSON.stringify({
                'nome': nomeCad,
                'data_nascimento': dateCad,
                'email': emailCad
            })
        }
        
        // --- CORREÇÃO 3: LER A SENHA APENAS NO MODO DE CRIAÇÃO ---
        let senhaCad = ''; // Inicializa a senha
        if (!isEditMode) { //
            // Os campos de senha só existem no modo de criação
            senhaCad = document.getElementById('senhaCad').value;
            
            // verifica senhas apenas na criação
            if (!verifyPass()) { //
                const avisoSenha = document.getElementById('senhasIncorretas'); //
                if (avisoSenha) avisoSenha.classList.remove('d-none'); //
                return; //
            }
            
            // Reconstrói o body para incluir os dados de criação
            dados.body = JSON.stringify({ //
                'usuario': nomeCad, //
                'senha': senhaCad, //
                'cpf': cpfCad, //
                'data_nascimento': dateCad, //
                'email': emailCad //
            });
        }

        // --- CORREÇÃO 2: USAR O MODAL DE CARREGAMENTO CORRETAMENTE ---
        if (loadingModal) loadingModal.show(); // Em vez de style.display

        await fetch(url, dados) //
        .then(async (response) => { // 'async' para ler JSON de erro
            if (response.status === 201 || response.status === 200) { //
                if (loadingModal) loadingModal.hide(); // Esconde o modal
                
                if (isEditMode) { //
                    alert('Direção atualizada com sucesso!'); //
                    window.location.href = '/direcao/'; //
                } else {
                    modalSuccess.show(); //
                    return response.json(); //
                }
            } else {
                if (loadingModal) loadingModal.hide(); // Esconde o modal
                
                // Tenta ler a mensagem de erro da view (ex: CPF já existe)
                const errorData = await response.json().catch(() => null);
                const msg = errorData ? errorData.mensagem : `Erro ${response.status}`;
                alert(`Erro ao processar: ${msg}`);
            }
        })
        .then((data) => {
            if (data) { //
                // (Isto só executa no cadastro 201)
                document.getElementById('dados_user_nameUser').innerHTML = 'Usuário: '  + data.user; //
                document.getElementById('dados_user_pass').innerHTML = 'Senha: ' + senhaCad; //
            }
        })
        .catch((error) => {
            if (loadingModal) loadingModal.hide(); // Esconde o modal
            console.log('Ocorreu um erro:', error); //
            alert('Erro ao processar solicitação'); //
        });
    });
}