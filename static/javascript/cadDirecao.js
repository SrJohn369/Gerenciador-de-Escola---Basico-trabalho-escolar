// Inicializa o modal de sucesso
let modalSuccess = new bootstrap.Modal(document.getElementById('cadSuccessfully'));

// Inicializa o modal de carregamento (do base.html)
const loadingModalElement = document.getElementById('carregamento');
let loadingModal = null;
if (loadingModalElement) {
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

// --- ### CORREÇÃO AQUI ### ---
// 1. Procura o FORMULÁRIO, e não o botão
const form = document.getElementById('cadastro-form');

if (form) { // 2. Verifica se o formulário existe
    // 3. Ouve o evento 'submit' no formulário
    form.addEventListener('submit', async (event) => {
        // 4. Agora o 'preventDefault' acontece DEPOIS da validação 'required'
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
        
        let senhaCad = ''; // Inicializa a senha
        if (!isEditMode) { 
            senhaCad = document.getElementById('senhaCad').value;
            
            // A verificação de 'verifyPass' (senhas iguais) continua a ser
            // uma ótima validação manual.
            if (!verifyPass()) { 
                const avisoSenha = document.getElementById('senhasIncorretas'); 
                if (avisoSenha) avisoSenha.classList.remove('d-none'); 
                return; 
            }
            
            dados.body = JSON.stringify({ 
                'usuario': nomeCad, 
                'senha': senhaCad, 
                'cpf': cpfCad, 
                'data_nascimento': dateCad, 
                'email': emailCad 
            });
        }

        if (loadingModal) loadingModal.show(); 

        await fetch(url, dados) 
        .then(async (response) => { 
            if (response.status === 201 || response.status === 200) { 
                if (loadingModal) loadingModal.hide(); 
                
                if (isEditMode) { 
                    alert('Direção atualizada com sucesso!'); 
                    window.location.href = '/direcao/'; 
                } else {
                    modalSuccess.show(); 
                    return response.json(); 
                }
            } else {
                if (loadingModal) loadingModal.hide(); 
                
                const errorData = await response.json().catch(() => null);
                const msg = errorData ? errorData.mensagem : `Erro ${response.status}`;
                alert(`Erro ao processar: ${msg}`);
            }
        })
        .then((data) => {
            if (data) { 
                document.getElementById('dados_user_nameUser').innerHTML = 'Usuário: '  + data.user; 
                document.getElementById('dados_user_pass').innerHTML = 'Senha: ' + senhaCad; 
            }
        })
        .catch((error) => {
            if (loadingModal) loadingModal.hide(); 
            console.log('Ocorreu um erro:', error); 
            alert('Erro ao processar solicitação'); 
        });
    });
}