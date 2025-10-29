// cadDirecao

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

// Ouve o 'submit' do formulário (para validar o 'required')
const form = document.getElementById('cadastro-form');

if (form) { 
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let csrf_token = getCookie('csrftoken');

        let nomeCad = document.getElementById('nomeCad').value;
        let cpfCad = document.getElementById('cpfCad').value;
        let dateCad = document.getElementById('dateCad').value;
        let emailCad = document.getElementById('emailCad').value;
        
        const isEditMode = window.location.pathname.includes('alter_direcao');
        const direcaoId = isEditMode ? window.location.pathname.split('/').pop() : null;
        
        const url = isEditMode ? `/direcao/alter_direcao/${direcaoId}` : `/cadastro_direcao/`;
        
        let dados = {
            method: isEditMode ? 'PUT' : 'POST',
            headers: {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'nome': nomeCad,
                'data_nascimento': dateCad,
                'email': emailCad
            })
        }
        
        let senhaCad = ''; 
        if (!isEditMode) { 
            senhaCad = document.getElementById('senhaCad').value;
            
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

        // --- ### CORREÇÃO: ADICIONADO TRY...FINALLY ### ---
        try {
            const response = await fetch(url, dados);

            if (response.status === 201 || response.status === 200) {
                if (isEditMode) { 
                    alert('Direção atualizada com sucesso!'); 
                    window.location.href = '/direcao/'; 
                } else {
                    const data = await response.json(); // Só faz .json() se for sucesso
                    modalSuccess.show(); 
                    document.getElementById('dados_user_nameUser').innerHTML = 'Usuário: '  + data.user; 
                    document.getElementById('dados_user_pass').innerHTML = 'Senha: ' + senhaCad; 
                }
            } else if (response.status === 404) {
                 alert('Erro 404: Não Encontrado. A URL está correta no seu urls.py?');
            } else {
                const errorData = await response.json().catch(() => null);
                const msg = errorData ? errorData.mensagem : `Erro ${response.status}`;
                alert(`Erro ao processar: ${msg}`);
            }
        } catch (error) {
            console.log('Ocorreu um erro:', error); 
            alert('Erro ao processar solicitação'); 
        } finally {
            // ### CORREÇÃO DA RACE CONDITION ###
            setTimeout(() => {
                if (loadingModal) loadingModal.hide();
            }, 500); // Atraso de 0.5s
        }
    });
}