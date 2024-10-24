document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 6;
    let showAllItems = false;
    let filteredItems = [];
    let activeFilter = localStorage.getItem('selectedFilter') || 'Все';
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    const items = document.querySelectorAll('.catalog__plate');
    const pagination = document.getElementById('pagination');
    const noResultsMessage = document.getElementById('noResultsMessage');

    function renderCatalog(page) {
        currentPage = parseInt(localStorage.getItem('currentPage'));
        items.forEach(item => item.style.display = 'none');

        // Переводим значение из инпута и в дальнейшем из заголовка плажки в ловерскейс 
                                                                    //чтобы не было проблем
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        // Проходимся по каждому элементу и берем из него заголовок
        filteredItems = Array.from(items).filter(item => {
            const title = item.querySelector('.catalog__plate_title').textContent.toLowerCase(); 
            // Если значения из инпута и заголовка совподают, то выводим данную плажку
            return title.includes(searchTerm) && (activeFilter === 'Все' || item.id === activeFilter);
        });
        
        // А в этой части когда реализован вывод секретки, если значение из инпута == 'апрпапр'
        if (searchTerm === 'апрпапр') {
            document.getElementById('secretContainer').style.display = 'flex';
            document.getElementById('noResultsMessage').style.display = 'none';
        } else {
            document.getElementById('secretContainer').style.display = 'none';
        }

        const savedFilter = localStorage.getItem('selectedFilter');
    
        if (savedFilter) {
            const filterButton = document.querySelector(`button[data-id="${savedFilter}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }
        
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
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        pagination.innerHTML = '';

        // btn first_page
        const btn = document.createElement('button');
        btn.textContent = '<<';
        btn.disabled = currentPage === 1;
        btn.addEventListener('click', () => {
            if (btn.textContent == '<<') {
                currentPage = 1;
                updateCatalog();
            }
        });
        pagination.appendChild(btn);

        // btn back_page
        btn.textContent = '<';
        prevButton.disabled = currentPage === 1;
        btn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateCatalog();
            }
        });
        pagination.appendChild(btn);

        // btns
        for (let i = 1; i <= totalPages; i++) {
            btn.textContent = i;
            btn.classList.toggle('active', i === currentPage);
            btn.addEventListener('click', () => {
                currentPage = i;
                updateCatalog();
            });
            pagination.appendChild(btn);
        }

        // btn next_page
        btn.textContent = '>';
        btn.disabled = currentPage === totalPages;
        btn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateCatalog();
            }
        });
        pagination.appendChild(btn);

        // btn last_page
        btn.textContent = '>>';
        btn.disabled = currentPage === totalPages;
        btn.addEventListener('click', () => {
            currentPage = totalPages;
            updateCatalog();
        });
        pagination.appendChild(btn);
    }

    // save filter and page
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
            updateCatalog();
        });
    });

    document.getElementById('showAllButton').addEventListener('click', function () {
        showAllItems = true;
        updateCatalog();
    });


    function updateCatalog() {
        showAllItems = false;
        saveState(); 
        renderCatalog(currentPage);
        renderPagination();
    }

    updateCatalog();
});