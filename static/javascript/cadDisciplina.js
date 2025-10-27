// Inicializa o modal de sucesso
let modalSuccess = new bootstrap.Modal(document.getElementById('cadSuccessfully'));
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// fecha tela
function voltarConfirm() {
    document.getElementById('cadSuccessfully').style.display = 'none';
}


//cadastra disciplina
document.getElementById('cad_turma').addEventListener('click', async (event) => {
    // evitar reload da pagina
    event.preventDefault();
    let csrf_token = getCookie('csrftoken');

    // variaveis do formulário
    let nomeDisciplina = document.getElementById('nomeCad').value;
    let dataCadDisciplina = document.getElementById('dateCad').value;

    // Detecta se está em modo de edição (URL contém 'alter_disciplina')
    const isEditMode = window.location.pathname.includes('alter_disciplina');
    const disciplinaId = isEditMode ? window.location.pathname.split('/').pop() : null;
    
    const url = isEditMode ? `/disciplina/alter_disciplina/${disciplinaId}/` : `/disciplina/cadastro_disciplina/`;
    
    let dados = {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'nome_diciplina': nomeDisciplina,
            'data_cad_disciplina': dataCadDisciplina
        })
    }

    // tela de carregamento
    document.getElementById('carregamento').style.display = 'flex';

    // fazendo a request POST/PUT
    await fetch(url, dados)
        // request
        .then((response) => {
            if (response.status == 201 || response.status == 200) {
                document.getElementById('carregamento').style.display = 'none';
                if (isEditMode) {
                    alert('Disciplina atualizada com sucesso!');
                    window.location.href = '/disciplina/';
                } else {
                    modalSuccess.show();
                    return response.json();
                }
            } else if (response.status === 500) {
                document.getElementById('carregamento').style.display = 'none';
                alert('Erro interno do servidor');
            }
        })
        // captura erro
        .catch((error) => {
            document.getElementById('carregamento').style.display = 'none';
            console.log('Ocorreu um erro:', error);
            alert('Erro ao processar solicitação');
        });

});