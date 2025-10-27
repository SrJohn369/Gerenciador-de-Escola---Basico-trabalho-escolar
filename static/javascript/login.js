// Adiciona um "ouvinte" que espera o HTML estar 100% carregado
document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o modal de carregamento (do base.html)
    const loadingModalElement = document.getElementById('carregamento');
    let loadingModal = null;
    if (loadingModalElement) {
        loadingModal = new bootstrap.Modal(loadingModalElement);
    }

    // Pega os elementos do formulário
    const loginForm = document.getElementById('login-form');
    const senhaInput = document.getElementById('senha');
    const usuarioInput = document.getElementById('usuario'); // Pega o input de usuário

    // ### NOVAS REFERÊNCIAS PARA OS ERROS ###
    const spanUsuarioInvalido = document.getElementById('span-usuario-invalido');
    const spanSenhaIncorreta = document.getElementById('span-senha-incorreta');

    // --- Limpa erros ao focar ---
    // Limpa erro da senha
    if (senhaInput) {
        senhaInput.addEventListener('focus', () => {
            if (spanSenhaIncorreta) spanSenhaIncorreta.classList.add('d-none');
        });
    }
    // Limpa erro do usuário
    if (usuarioInput) {
        usuarioInput.addEventListener('focus', () => {
            if (spanUsuarioInvalido) spanUsuarioInvalido.classList.add('d-none');
        });
    }
    // --- Fim da limpeza ---

    // Ouve o 'submit' do formulário (que valida o 'required' primeiro)
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            let csrf_token = getCookie('csrftoken');
            let usuario = usuarioInput.value; // Usa a variável
            let senha = senhaInput.value;   // Usa a variável
            const url = `/login/`;

            let dados = {
                method: 'POST',
                headers: {'X-CSRFToken': csrf_token},
                body: JSON.stringify({
                    'usuario': usuario,
                    'senha': senha
                })
            }

            if (loadingModal) loadingModal.show();
            // Esconde *todos* os erros antes de enviar
            if (spanUsuarioInvalido) spanUsuarioInvalido.classList.add('d-none');
            if (spanSenhaIncorreta) spanSenhaIncorreta.classList.add('d-none');

            await fetch(url, dados)
                .then((response) => {
                    if (loadingModal) loadingModal.hide();

                    // --- LÓGICA DE STATUS ATUALIZADA ---
                    if (response.status === 200) {
                        console.log('LOGOU');
                        window.location.href = '/'; // Redireciona para a 'inicio'
                    
                    } else if (response.status === 404) {
                        // 404 = Usuário não encontrado (enviado pelo views.py)
                        if (spanUsuarioInvalido) spanUsuarioInvalido.classList.remove('d-none');
                    
                    } else if (response.status === 401) {
                        // 401 = Senha incorreta (enviado pelo views.py)
                        if (spanSenhaIncorreta) spanSenhaIncorreta.classList.remove('d-none');
                    
                    } else {
                        // Outros erros (ex: 500)
                        alert('Ocorreu um erro inesperado. Status: ' + response.status);
                    }
                })
                .catch((error) => {
                    if (loadingModal) loadingModal.hide();
                    console.error('Erro no fetch:', error);
                    alert('Erro de rede ao tentar fazer login.');
                });
        });
    }
});


// Função para pegar cookie (fica fora do DOMContentLoaded)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}