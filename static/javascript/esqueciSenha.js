// Espera o HTML carregar (evita erros '...is null')
document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o modal de carregamento (do base.html)
    const loadingModalElement = document.getElementById('carregamento');
    let loadingModal = null;
    if (loadingModalElement) {
        loadingModal = new bootstrap.Modal(loadingModalElement);
    }

    // Pega os elementos do formulário
    const resetForm = document.getElementById('reset-form');
    const usuarioInput = document.getElementById('usuario');
    const novaSenhaInput = document.getElementById('nova_senha');
    const confirmarSenhaInput = document.getElementById('confirmar_senha');

    // Pega os spans de erro
    const spanUsuarioInvalido = document.getElementById('span-usuario-invalido');
    const spanSenhasDiferentes = document.getElementById('span-senhas-diferentes');

    // Limpa erros ao digitar
    usuarioInput.addEventListener('focus', () => spanUsuarioInvalido.classList.add('d-none'));
    novaSenhaInput.addEventListener('focus', () => spanSenhasDiferentes.classList.add('d-none'));
    confirmarSenhaInput.addEventListener('focus', () => spanSenhasDiferentes.classList.add('d-none'));


    // Ouve o 'submit' do formulário (para validar o 'required' primeiro)
    resetForm.addEventListener('submit', async (event) => {
        // Previne o recarregamento da página
        event.preventDefault();

        // Esconde erros antigos
        spanUsuarioInvalido.classList.add('d-none');
        spanSenhasDiferentes.classList.add('d-none');

        // --- Validação no Front-End ---
        const usuario = usuarioInput.value;
        const novaSenha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (novaSenha !== confirmarSenha) {
            spanSenhasDiferentes.classList.remove('d-none'); // Mostra erro de senhas
            return; // Para a execução
        }
        
        let csrf_token = getCookie('csrftoken');
        const url = `/esqueceu_senha/`; // A URL que vamos criar no Passo 4

        let dados = {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'usuario': usuario,
                'senha': novaSenha // Envia a nova senha
            })
        }

        if (loadingModal) loadingModal.show(); // Mostra "Carregando..."

        await fetch(url, dados)
            .then(async (response) => {
                if (loadingModal) loadingModal.hide(); // Esconde "Carregando..."

                if (response.status === 200) {
                    // Sucesso!
                    alert('Senha alterada com sucesso!');
                    window.location.href = '/login/'; // Manda de volta para o login
                
                } else if (response.status === 404) {
                    // Usuário não encontrado
                    spanUsuarioInvalido.classList.remove('d-none');
                
                } else {
                    // Outro erro
                    const errorData = await response.json().catch(() => null);
                    const msg = errorData ? errorData.mensagem : 'Erro desconhecido';
                    alert('Erro ao alterar a senha: ' + msg);
                }
            })
            .catch((error) => {
                if (loadingModal) loadingModal.hide();
                console.error('Erro no fetch:', error);
                alert('Erro de rede ao tentar alterar a senha.');
            });
    });
});


// Função para pegar cookie (necessária para o POST)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}