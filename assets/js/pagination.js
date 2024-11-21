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
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const catalogContainer = document.querySelector('.catalog__container')
        catalogContainer.classList.remove('none-h')
        
        filteredItems = Array.from(items).filter(item => {
            const title = item.querySelector('.catalog__plate_title').textContent.toLowerCase(); 
            return title.includes(searchTerm) && (activeFilter === 'Все' || item.id === activeFilter);
        });
        
        if (searchTerm === 'апрпапр') {
            document.getElementById('secretContainer').style.display = 'flex';
            document.getElementById('noResultsMessage').style.display = 'none';
            catalogContainer.classList.add('none-h')
        } else {
            catalogContainer.classList.remove('none-h')
            document.getElementById('secretContainer').style.display = 'none';
        }

        const savedFilter = localStorage.getItem('selectedFilter');
    
        if (savedFilter) {
            const filterButton = document.querySelector(`button[data-id="${savedFilter}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }
        
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
            catalogContainer.classList.add('none-h')
            pagination.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            pagination.style.display = 'flex';
            catalogContainer.classList.remove('none-h');
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        pagination.innerHTML = '';

        // btn first_page
        const firstButton = document.createElement('button');
        firstButton.textContent = '<<';
        firstButton.disabled = currentPage === 1;
        firstButton.addEventListener('click', () => {
            if (firstButton.textContent == '<<') {
                currentPage = 1;
                updateCatalog();
            }
        });
        pagination.appendChild(firstButton);

        // btn back_page
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
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                updateCatalog();
            });
            pagination.appendChild(pageButton);
        }

        // btn next_page
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

        // btn last_page
        const lastButton = document.createElement('button');
        lastButton.textContent = '>>';
        lastButton.disabled = currentPage === totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            updateCatalog();
        });
        pagination.appendChild(lastButton);
    }

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