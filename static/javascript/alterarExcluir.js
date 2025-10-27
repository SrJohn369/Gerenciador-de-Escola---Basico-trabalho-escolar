/**
 * Função chamada pelos links de 'Opções' na baseListagem.html
 * @param {Event} event - O evento de clique
 * @param {string} url - A URL para onde a ação aponta (ex: /turma/alterar/1)
 * @param {string} acao - O texto do link (ex: 'Alterar', 'Excluir', 'Ver Alunos')
 * @param {number} id - O ID do item da linha
 */
function linkMudança(event, url, acao, id) {
    event.preventDefault(); // Impede o link de navegar

    if (acao === 'Alterar') {
        // Ação 'Alterar': Redireciona para a página de edição
        window.location.href = url;

    } else if (acao === 'Excluir') {
        // Ação 'Excluir': Pede confirmação e envia um request DELETE
        if (confirm(`Tem a certeza que deseja excluir este item (ID: ${id})?`)) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': window.csrfToken, // Pega o token da janela
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem); // Mostra 'Excluido com sucesso'
                // Remove a linha da tabela
                document.getElementById(id).remove();
            })
            .catch(error => {
                console.error('Erro ao excluir:', error);
                alert('Ocorreu um erro ao excluir.');
            });
        }

    } 
}


// --- LÓGICA DO MODAL INFOPOPUP ---
// Este código corre assim que o ficheiro .js é carregado

// 1. Pega as referências para o modal e seus componentes
const infoModalElement = document.getElementById('infoPopup');
const modalTitulo = document.getElementById('popupTitulo');
const modalCorpo = document.getElementById('popupCorpo');

// 2. Ouve o evento 'show.bs.modal'
//    Isto dispara ANTES do modal ser exibido
if (infoModalElement) {
    infoModalElement.addEventListener('show.bs.modal', async (event) => {
        
        // Pega o botão que disparou o modal
        const button = event.relatedTarget;
        
        // Pega a URL que colocámos no atributo 'data-bs-url'
        const url = button.getAttribute('data-bs-url');

        if (!url) return; // Se não houver URL, não faz nada
        
        // Mostra um "Carregando..." temporário
        modalTitulo.textContent = 'Carregando...';
        modalCorpo.innerHTML = '<div class="text-center"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div></div>';

        // 3. Tenta buscar os dados
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar dados.');
            }
            const data = await response.json();

            // 4. Preenche o Modal com os dados
            modalTitulo.textContent = data.titulo;
            modalCorpo.innerHTML = ''; // Limpa o "Carregando..."

            if (data.items && data.items.length > 0) {
                // Cria a tabela
                const tabela = document.createElement('table');
                tabela.className = 'table table-hover table-striped';
                
                // Cria o cabeçalho (thead)
                const thead = document.createElement('thead');
                thead.className = 'table-dark';
                const trCabecalho = document.createElement('tr');
                data.cabecalhos.forEach(textoCabecalho => {
                    const th = document.createElement('th');
                    th.textContent = textoCabecalho;
                    trCabecalho.appendChild(th);
                });
                thead.appendChild(trCabecalho);
                tabela.appendChild(thead);

                // Cria o corpo (tbody)
                const tbody = document.createElement('tbody');
                data.items.forEach(item => {
                    const trItem = document.createElement('tr');
                    data.cabecalhos.forEach(cabecalho => {
                        const td = document.createElement('td');
                        // Converte o nome do cabeçalho para a chave do JSON
                        const chave = cabecalho.toLowerCase().replace(/ /g, '_');
                        td.textContent = item[chave] || ''; 
                        trItem.appendChild(td);
                    });
                    tbody.appendChild(trItem);
                });
                tabela.appendChild(tbody);

                modalCorpo.appendChild(tabela);
            } else {
                modalCorpo.innerHTML = '<p class="text-center text-muted">Nenhum item encontrado.</p>';
            }

        } catch (error) {
            console.error('Erro ao abrir modal de info:', error);
            modalTitulo.textContent = 'Erro';
            modalCorpo.innerHTML = '<p class="text-center text-danger">Não foi possível carregar as informações.</p>';
        }
    });

    // Limpa o modal quando ele for fechado (opcional, mas bom)
    infoModalElement.addEventListener('hidden.bs.modal', () => {
        modalTitulo.textContent = 'Carregando...';
        modalCorpo.innerHTML = '<div class="text-center"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    });
}