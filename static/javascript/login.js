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
    const usuarioInput = document.getElementById('usuario'); 

    const spanUsuarioInvalido = document.getElementById('span-usuario-invalido');
    const spanSenhaIncorreta = document.getElementById('span-senha-incorreta');

    // --- Limpa erros ao focar ---
    if (senhaInput) {
        senhaInput.addEventListener('focus', () => {
            if (spanSenhaIncorreta) spanSenhaIncorreta.classList.add('d-none');
        });
    }
    if (usuarioInput) {
        usuarioInput.addEventListener('focus', () => {
            if (spanUsuarioInvalido) spanUsuarioInvalido.classList.add('d-none');
        });
    }

    // Ouve o 'submit' do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            let csrf_token = getCookie('csrftoken');
            let usuario = usuarioInput.value; 
            let senha = senhaInput.value;   
            const url = `/login/`;

            const data = {
                'usuario': usuario,
                'senha': senha
            };
            
            const config = {
                headers: {
                    'X-CSRFToken': csrf_token,
                    'Content-Type': 'application/json'
                }
            };

            if (loadingModal) loadingModal.show();
            if (spanUsuarioInvalido) spanUsuarioInvalido.classList.add('d-none');
            if (spanSenhaIncorreta) spanSenhaIncorreta.classList.add('d-none');

            // --- ### LÓGICA ATUALIZADA COM AXIOS ### ---
            try {
                // 1. Tenta fazer o login
                const response = await axios.post(url, data, config);

                // 2. Se chegou aqui, o status é 2xx (SUCESSO)
                console.log('LOGOU');
                window.location.href = '/'; 

            } catch (error) {
                // 3. O Axios envia erros (4xx, 5xx) para o CATCH
                console.error('Erro no Axios:', error);

                if (error.response) {
                    if (error.response.status === 404) {
                        if (spanUsuarioInvalido) spanUsuarioInvalido.classList.remove('d-none');
                    } else if (error.response.status === 401) {
                        if (spanSenhaIncorreta) spanSenhaIncorreta.classList.remove('d-none');
                    } else {
                        alert('Ocorreu um erro inesperado. Status: ' + error.response.status);
                    }
                } else {
                    alert('Erro de rede ao tentar fazer login.');
                }

            } finally {
                // 4. ### CORREÇÃO COM DELAY ###
                // Espera 500ms (meio segundo) antes de fechar o modal.
                // Isto garante que a animação 'show' termine antes de chamarmos 'hide'.
                setTimeout(() => {
                    if (loadingModal) loadingModal.hide();
                }, 500); // 500ms = 0.5 segundos
            }
            // --- ### FIM DA LÓGICA AXIOS ### ---
        });
    }
});


// Função para pegar cookie (fica fora do DOMContentLoaded)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}