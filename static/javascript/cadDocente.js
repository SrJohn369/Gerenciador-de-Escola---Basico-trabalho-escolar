// cadDocente

// Inicializa o modal de sucesso
let modalSuccess = new bootstrap.Modal(document.getElementById('cadSuccessfully'));

// Pega o elemento do modal de carregamento (que está no base.html)
const loadingModalElement = document.getElementById('carregamento');
let loadingModal = null;
if (loadingModalElement) {
    loadingModal = new bootstrap.Modal(loadingModalElement);
}

//função para pegar cookie do csrf_token
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function gerarSenha() {
    // ... (função gerarSenha fica igual)
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
    let avisoTexto = document.getElementById('aviso_gerePass_texto');
    if (avisoTexto) avisoTexto.style.display = 'none';
    let avisoErro = document.getElementById('aviso_gerePass_erro');
    if (avisoErro) avisoErro.style.display = 'none';
}

function voltarConfirm() {
    window.location.href = '/docente/';
}

// --- Ouve o 'submit' do formulário (para validar o 'required') ---
const formDocente = document.getElementById('cadastro-form'); // Assumindo que o form tem este ID

if (formDocente) {
    formDocente.addEventListener('submit', async (event) => {
        event.preventDefault()
        let csrf_token = getCookie('csrftoken');

        // Captura os dados do formulário
        let nomeCad = document.getElementById('nomeCad').value;
        let cpfCad = document.getElementById('cpfCad').value;
        let dateCad = document.getElementById('dateCad').value;
        let emailCad = document.getElementById('emailCad').value;
        let disciplinaCad = document.getElementById('disciplinaCad').value;

        const senhaElement = document.getElementById('gerar_senha');
        let senhaCad = senhaElement ? senhaElement.textContent : '';
        
        const isEditMode = window.location.pathname.includes('alter_docente');
        const docenteId = isEditMode ? window.location.pathname.split('/').pop() : null;
        
        const url = isEditMode ? `/docente/alter_docente/${docenteId}` : `/docente/cadastro_docente/`;
        
        let dados = {
            method: isEditMode ? 'PUT' : 'POST',
            headers: {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            },
            body: null
        };
        
        if (isEditMode) {
            dados.body = JSON.stringify({
                'nome': nomeCad,
                'data_nascimento': dateCad,
                'email': emailCad,
                'disciplina': disciplinaCad
            });
        } 
        else {
            let avisoErro = document.getElementById('aviso_gerePass_erro');
            if (senhaCad == '') {
                if (avisoErro) avisoErro.style.display = 'block';
                else alert('É obrigatório gerar uma senha!');
                return;
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
        
        if (loadingModal) loadingModal.show();
        
        // --- ### CORREÇÃO: ADICIONADO TRY...FINALLY ### ---
        try {
            const response = await fetch(url, dados);
            
            if (response.status === 201 || response.status === 200) {
                if (isEditMode) {
                    alert('Docente atualizado com sucesso!');
                    window.location.href = '/docente/';
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
                const mensagemErro = errorData ? errorData.mensagem : `Erro ${response.status}`;
                alert(`Erro ao processar a solicitação: ${mensagemErro}`);
            }
        } catch (error) {
            console.log('Ocorreu um erro de rede:', error);
            alert('Erro ao processar solicitação: ' + error.message);
        } finally {
            // ### CORREÇÃO DA RACE CONDITION ###
            setTimeout(() => {
                if (loadingModal) loadingModal.hide();
            }, 500); // Atraso de 0.5s
        }
    });
}