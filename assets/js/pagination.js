document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 6;
    let currentPage = 1;
    let showAllItems = false;
    let filteredItems = [];
    let activeFilter = 'Все';

    const items = document.querySelectorAll('.catalog__plate');
    const pagination = document.getElementById('pagination');
    const noResultsMessage = document.getElementById('noResultsMessage'); // Элемент для отображения сообщения

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
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        pagination.innerHTML = '';

        const firstButton = document.createElement('button');
        firstButton.textContent = '<<';
        firstButton.disabled = currentPage === 1;
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            updateCatalog();
        });
        pagination.appendChild(firstButton);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateCatalog();
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                updateCatalog();
            });
            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateCatalog();
            }
        });
        pagination.appendChild(nextButton);

        const lastButton = document.createElement('button');
        lastButton.textContent = '>>';
        lastButton.disabled = currentPage === totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            updateCatalog();
        });
        pagination.appendChild(lastButton);
    }

    document.getElementById('searchInput').addEventListener('input', function () {
        updateCatalog();
    });

    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            updateCatalog();
        }
    });

    document.querySelectorAll('.catalog__filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.catalog__filter-btn').forEach(button => {
                button.classList.remove('active')
            })
            activeFilter = this.getAttribute('data-id');
            this.classList.add('active')
            currentPage = 1;
            localStorage.setItem('selectedFilter', this.getAttribute('data-id'))
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
