document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const taskCountSpan = document.createElement('span'); // Span para a contagem de tarefas
    taskCountSpan.id = 'activeTaskCount';
    const h2Tasks = document.querySelector('.task-list-section h2');
    h2Tasks.appendChild(taskCountSpan); // Adiciona o span ao lado do "Tarefas"

    // Elementos dos filtros (novos no HTML ou criados aqui para fins de exemplo)
    // Para simplificar, vou assumir que você adicionará esses botões no HTML
    // Se não quiser mudar o HTML agora, podemos criá-los via JS.
    // Por enquanto, vamos criar os botões de filtro via JS para demonstração.

    const filterContainer = document.createElement('div');
    filterContainer.classList.add('filter-buttons');
    h2Tasks.parentNode.insertBefore(filterContainer, h2Tasks.nextSibling); // Insere após o h2

    const allFilterButton = document.createElement('button');
    allFilterButton.textContent = 'Todas';
    allFilterButton.classList.add('filter-button', 'active');
    allFilterButton.id = 'allFilter';

    const activeFilterButton = document.createElement('button');
    activeFilterButton.textContent = 'Ativas';
    activeFilterButton.classList.add('filter-button');
    activeFilterButton.id = 'activeFilter';

    const completedFilterButton = document.createElement('button');
    completedFilterButton.textContent = 'Concluídas';
    completedFilterButton.classList.add('filter-button');
    completedFilterButton.id = 'completedFilter';

    filterContainer.appendChild(allFilterButton);
    filterContainer.appendChild(activeFilterButton);
    filterContainer.appendChild(completedFilterButton);

    let currentFilter = 'all'; // Estado inicial do filtro

    // --- Funções Auxiliares ---

    // Função para atualizar a contagem de tarefas ativas
    function updateTaskCount() {
        const activeTasks = taskList.querySelectorAll('li:not(.completed)').length;
        taskCountSpan.textContent = ` (${activeTasks} ativas)`;
    }

    // Função para aplicar os filtros e ordenar
    function applyFiltersAndSort() {
        const tasks = Array.from(taskList.children); // Converte HTMLCollection para Array

        // 1. Filtragem
        tasks.forEach(task => {
            const isCompleted = task.classList.contains('completed');
            switch (currentFilter) {
                case 'all':
                    task.style.display = 'flex'; // Mostra todas
                    break;
                case 'active':
                    task.style.display = isCompleted ? 'none' : 'flex'; // Mostra só ativas
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none'; // Mostra só concluídas
                    break;
            }
        });

        // 2. Ordenação (Concluídas para o final)
        // Separa as tarefas concluídas das ativas
        const activeTasks = tasks.filter(task => !task.classList.contains('completed'));
        const completedTasks = tasks.filter(task => task.classList.contains('completed'));

        // Limpa a lista e readiciona na ordem desejada
        taskList.innerHTML = ''; // Limpa todos os itens
        activeTasks.forEach(task => taskList.appendChild(task));
        completedTasks.forEach(task => taskList.appendChild(task));

        updateTaskCount(); // Atualiza a contagem após filtragem/ordenação
    }

    // --- Função Principal: Adicionar Tarefa ---
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Por favor, digite uma tarefa!');
            return;
        }

        const listItem = document.createElement('li');
        listItem.classList.add('task-item');

        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text');
        taskSpan.textContent = taskText;

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        // Botão de Concluir
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.textContent = 'Concluir';
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            applyFiltersAndSort(); // Re-aplica filtros e reordena ao concluir/desconcluir
        });

        // Botão de Editar (Novo!)
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button'); // Adicione este estilo ao seu CSS
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            if (listItem.classList.contains('completed')) {
                alert('Não é possível editar uma tarefa concluída.');
                return;
            }

            const isEditing = listItem.classList.toggle('editing'); // Alterna classe 'editing'

            if (isEditing) {
                const inputEdit = document.createElement('input');
                inputEdit.type = 'text';
                inputEdit.classList.add('edit-task-input'); // Adicione este estilo ao seu CSS
                inputEdit.value = taskSpan.textContent;

                listItem.replaceChild(inputEdit, taskSpan); // Troca o span pelo input
                inputEdit.focus();

                // Salva a edição ao pressionar Enter ou perder o foco
                inputEdit.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
                inputEdit.addEventListener('blur', saveEdit); // Salva ao perder o foco

                function saveEdit() {
                    taskSpan.textContent = inputEdit.value.trim();
                    listItem.replaceChild(taskSpan, inputEdit); // Troca o input de volta pelo span
                    listItem.classList.remove('editing');
                    if (taskSpan.textContent === '') { // Se o texto ficar vazio, remove a tarefa
                         taskList.removeChild(listItem);
                         updateTaskCount();
                    }
                }
            } else {
                // Se o modo de edição for desativado sem salvar (clicando de novo, por exemplo)
                // A gente pode simplesmente reverter se não houver um input ativo.
                // Para simplificar, o 'blur' e 'Enter' já vão salvar.
            }
        });


        // Botão de Remover
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            updateTaskCount(); // Atualiza a contagem ao remover
        });

        taskActions.appendChild(editButton); // Adiciona o botão de editar
        taskActions.appendChild(completeButton);
        taskActions.appendChild(removeButton);

        listItem.appendChild(taskSpan);
        listItem.appendChild(taskActions);

        taskList.appendChild(listItem);

        taskInput.value = '';
        taskInput.focus();
        applyFiltersAndSort(); // Re-aplica filtros e reordena ao adicionar nova tarefa
    }

    // --- Event Listeners ---
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Eventos para os botões de filtro
    allFilterButton.addEventListener('click', () => {
        currentFilter = 'all';
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        allFilterButton.classList.add('active');
        applyFiltersAndSort();
    });

    activeFilterButton.addEventListener('click', () => {
        currentFilter = 'active';
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        activeFilterButton.classList.add('active');
        applyFiltersAndSort();
    });

    completedFilterButton.addEventListener('click', () => {
        currentFilter = 'completed';
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
        completedFilterButton.classList.add('active');
        applyFiltersAndSort();
    });

    // Inicializa a contagem e os filtros ao carregar a página
    applyFiltersAndSort();
});