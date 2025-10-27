// // Pega referências aos elementos
// let modalDocente = document.getElementById('myModalDocente');
// let modalAluno = document.getElementById('myModalAluno');
// let btnDocente = document.getElementById('openModalDocente');
// let btnAluno = document.getElementById('openModalAluno');
// let btnSairAluno = document.getElementById('btn_sair_aluno');
// let btnSairDocente = document.getElementById('btn_sair_docente');

// // Inicializa os modais Bootstrap
// let bootstrapModalDocente = new bootstrap.Modal(modalDocente);
// let bootstrapModalAluno = new bootstrap.Modal(modalAluno);

// // Define ação de clique para abrir o modal
// btnDocente.onclick = () => {
//     bootstrapModalDocente.show();
// }

// btnAluno.onclick = () => {
//     bootstrapModalAluno.show();
// }

// // Define ação de clique para fechar o modal
// btnSairAluno.onclick = () => {
//     bootstrapModalAluno.hide();
// }

// btnSairDocente.onclick = () => {
//     bootstrapModalDocente.hide();
// }

function debug(vars) {
    Object.entries(vars).forEach(([name, value]) => {
        console.log(`${name}:`, value);
    });
}

console.log("Iniciado");


// --- INÍCIO DO BLOCO DE DEBUG JS (NÃO USE EM PRODUÇÃO) ---
// Se descomentares este bloco, o event.preventDefault() VAI IMPEDIR o formulário de enviar.
// Usa isto apenas para ver o que o JS está a capturar.

// document.getElementById('submit_btn').addEventListener('click', (event) => {
	
//   	event.preventDefault(); // Isto IMPEDE o envio para o views.py
//     console.log("--- [DEBUG JS] Formulário Interceptado ---");

// 	// Coleta os dados do formulário
//     const nome = document.getElementById('nomeCad').value;
    
//     // CORREÇÃO: O seletor 'input[name="Ano"]' estava errado
//     const ano = document.querySelector('input[name="ano"]').value; 
    
//     const dataNascimento = document.getElementById('dateCad').value;
// 	console.log("Dados da Turma:", {nome, ano, dataNascimento});

//     // CORREÇÃO: O seletor estava errado
//     const docentesCheckboxes = document.querySelectorAll('input[name="docentes"]:checked');
//     const docentes = Array.from(docentesCheckboxes).map(checkbox => checkbox.value);
// 	console.log("Docentes selecionados (valores):", docentes);

//     // CORREÇÃO: O seletor estava errado
//     const alunosCheckboxes = document.querySelectorAll('input[name="alunos"]:checked');
//     const alunos = Array.from(alunosCheckboxes).map(checkbox => checkbox.value);
// 	console.log("Alunos selecionados (valores):", alunos);

//     // (O 'fetch' está comentado, então nada será enviado)
//     alert("Debug JS concluído! Verifique a consola (F12). O formulário NÃO foi enviado.");
// });
// --- FIM DO BLOCO DE DEBUG JS ---

// document.getElementById('submit_btn').addEventListener('click', (event) => {
	
//   	event.preventDefault();

// 	// Coleta os dados do formulário
//     const nome = document.getElementById('nomeCad').value;
//     const ano = document.querySelector('input[name="Ano"]').value;
//     const dataNascimento = document.getElementById('dateCad').value;
// 	debug({nome, ano, dataNascimento});

//     // Coleta os checkboxes de docentes e disciplinas
//     const docentesCheckboxes = document.querySelectorAll('input[type="checkbox"][name^="checkbox"]:checked');
//     const docentes = Array.from(docentesCheckboxes).map(checkbox => checkbox.id);
// 	debug({docentesCheckboxes, docentes})

//     // Coleta os checkboxes de alunos
//     const alunosCheckboxes = document.querySelectorAll('input[type="checkbox"][name^="{{aluno}}"]:checked');
//     const alunos = Array.from(alunosCheckboxes).map(checkbox => checkbox.id);
// 	debug({alunosCheckboxes, alunos})

//     // Cria o JSON com os dados coletados
//     const formData = {
//         nome: nome,
//         ano: ano,
//         dataNascimento: dataNascimento,
//         docentes: docentes,
//         alunos: alunos
//     };
// 	console.log(formData);

    // Envia o JSON para o back-end
    // fetch('/url-do-seu-endpoint/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
//});