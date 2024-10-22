document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 6;
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1; // Восстановление текущей страницы из localStorage
    let showAllItems = false;
    let filteredItems = [];
    let activeFilter = localStorage.getItem('selectedFilter') || 'Все'; // Восстановление фильтра из localStorage

    const items = document.querySelectorAll('.catalog__plate');
    const pagination = document.getElementById('pagination');
    const noResultsMessage = document.getElementById('noResultsMessage');

    function renderCatalog(page) {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const savedFilter = localStorage.getItem('selectedFilter');

        if (savedFilter) {
            const filterButton = document.querySelector(`button[data-id="${savedFilter}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }

        filteredItems = Array.from(items).filter(item => {
            const titleElement = item.querySelector('.catalog__plate_title');
            const title = titleElement.textContent.toLowerCase();
            return title.includes(searchTerm) && (activeFilter === 'Все' || item.id === activeFilter);
        });

        items.forEach(item => item.style.display = 'none');
        filteredItems.forEach(item => item.querySelector('.catalog__plate_type').innerHTML = item.id);

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        for (let i = start; i < end && i < filteredItems.length; i++) {
            filteredItems[i].style.display = 'flex';
        }

        if (showAllItems) {
            items.forEach(item => item.style.display = 'flex');
        }

        if (filteredItems.length === 0) {
            noResultsMessage.style.display = 'block';
            pagination.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            pagination.style.display = 'flex';
        }
        if (searchTerm === 'апрпапр') {
            document.getElementById('secretContainer').style.display = 'flex';
            document.getElementById('noResultsMessage').style.display = 'none';
        } else {
            document.getElementById('secretContainer').style.display = 'none';
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        pagination.innerHTML = ''; // Очищаем текущие элементы пагинации
    
        if (totalPages <= 1) {
            return; // Если страниц 1 или меньше, скрываем пагинацию
        }
    
        // Создаем кнопки пагинации
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('pagination-btn');
            button.textContent = i;
    
            // Отмечаем активную страницу
            if (i === currentPage) {
                button.classList.add('active');
            }
    
            // Обработчик клика на кнопку пагинации
            button.addEventListener('click', function () {
                currentPage = i;
                saveState(); // Сохраняем текущую страницу в localStorage
                updateCatalog(); // Обновляем каталог при смене страницы
            });
    
            pagination.appendChild(button);
        }
    }    

    // Сохранение состояния (активный фильтр и текущая страница)
    function saveState() {
        localStorage.setItem('selectedFilter', activeFilter);
        localStorage.setItem('currentPage', currentPage);
    }

    document.getElementById('searchInput').addEventListener('input', function () {
        updateCatalog();
    });

    document.querySelectorAll('.catalog__filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.catalog__filter-btn').forEach(button => {
                button.classList.remove('active');
            });
            activeFilter = this.getAttribute('data-id');
            this.classList.add('active');
            currentPage = 1;
            saveState(); // Сохранение фильтра и страницы
            updateCatalog();
        });
    });

    document.getElementById('showAllButton').addEventListener('click', function () {
        showAllItems = true;
        updateCatalog();
    });

    function updateCatalog() {
        showAllItems = false;
        renderCatalog(currentPage);
        renderPagination();
    }

    updateCatalog();
});