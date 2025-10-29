// Adiciona um "ouvinte" que espera o HTML estar 100% carregado
document.addEventListener('DOMContentLoaded', () => {

    // Inicializa o modal de sucesso
    const modalSuccessElement = document.getElementById('cadSuccessfully');
    let modalSuccess = null;
    if (modalSuccessElement) {
        modalSuccess = new bootstrap.Modal(modalSuccessElement);
    }

    // Inicializa o modal de carregamento (do base.html)
    const loadingModalElement = document.getElementById('carregamento');
    let loadingModal = null;
    if (loadingModalElement) {
        loadingModal = new bootstrap.Modal(loadingModalElement);
    }

    // Procura o formulário
    const form = document.getElementById('cadastro-form'); // Assumindo que o <form> tem este ID

    if (form) {
        // Ouve o evento 'submit' no formulário (corrige o 'required')
        form.addEventListener('submit', async (event) => {
            // evitar reload da pagina
            event.preventDefault();
            let csrf_token = getCookie('csrftoken');

            // variaveis do formulário
            let nomeDisciplina = document.getElementById('nomeCad').value;
            let dataCadDisciplina = document.getElementById('dateCad').value;

            // Detecta se está em modo de edição
            const isEditMode = window.location.pathname.includes('alter_disciplina');
            const disciplinaId = isEditMode ? window.location.pathname.split('/').pop() : null;
            
            // --- ### CORREÇÃO DA URL (404) ### ---
            // A URL de 'POST' (criação) deve bater EXATAMENTE com o urls.py
            const url = isEditMode ? `/disciplina/alter_disciplina/${disciplinaId}` : `/disciplina/cadastrar_diciplina/`;
            
            let dados = {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'X-CSRFToken': csrf_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nome_disciplina': nomeDisciplina,
                    'data_cad_disciplina': dataCadDisciplina
                })
            }

            if (loadingModal) loadingModal.show(); // Usa o modal correto

            try {
                const response = await fetch(url, dados);
                
                if (response.status == 201 || response.status == 200) {
                    if (isEditMode) {
                        alert('Disciplina atualizada com sucesso!');
                        window.location.href = '/disciplina/';
                    } else {
                        if (modalSuccess) modalSuccess.show();
                    }
                } else if (response.status === 404) {
                    alert('Erro 404: Não Encontrado. Verifique a URL no seu urls.py e js!');
                } else {
                    const errorData = await response.json().catch(() => null);
                    const msg = errorData ? errorData.mensagem : `Erro ${response.status}`;
                    alert(`Erro ao processar: ${msg}`);
                }

            } catch (error) {
                console.log('Ocorreu um erro:', error);
                alert('Erro ao processar solicitação');
            } finally {
                // ### CORREÇÃO DA RACE CONDITION (MODAL PRESO) ###
                // Espera 500ms para garantir que a animação 'show' terminou
                setTimeout(() => {
                    if (loadingModal) loadingModal.hide();
                }, 500);
            }
        });
    }
});

// --- Funções Auxiliares (fora do DOMContentLoaded) ---

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function voltarConfirm() {
    const modalSuccessElement = document.getElementById('cadSuccessfully');
    if (modalSuccessElement) {
        let modal = bootstrap.Modal.getInstance(modalSuccessElement);
        if (modal) modal.hide();
    }
    window.location.href = '/disciplina/'; // Redireciona
}