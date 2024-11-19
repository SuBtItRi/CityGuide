document.addEventListener('DOMContentLoaded', async function () {
    let showAllItems = false;
    let filteredItems = [];
    let activeFilter = new URLSearchParams(window.location.search).get('filter') || 'Все';
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

    const itemsPerPage = 6;
    // const items = document.querySelectorAll('.catalog__plate');
    let items = []
    const pagination = document.getElementById('pagination');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    async function getData() {
        try {
            const response = await fetch('https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters');
            const items_temp = await response.json(); 
            items_temp.forEach(item => {
                items.push(item)
            })
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    await getData()

    function createPlate(elemNum) {
        let description=filteredItems[elemNum].description
        if(description.length > 275) {
            description = description.slice(0, 250) + '...'
        }
        const catalogPlate = document.createElement('div');
        catalogPlate.classList.add('catalog__plate');
        catalogPlate.id = filteredItems[elemNum].filter
        catalogPlate.setAttribute('data-id', filteredItems[elemNum].id)
        catalogPlate.innerHTML = `
        <a href="landmark.html">
            <img src="./assets/img/${filteredItems[elemNum].imgs[0]}"></img>
            <div class="catalog__plate_text">
                <h4 class="catalog__plate_title">
                    ${filteredItems[elemNum].title}
                </h4>
                <p class="catalog__plate_grade">${filteredItems[elemNum].grade}</p>
                <p class="catalog__plate_type">${filteredItems[elemNum].filter}</p>
                <p class="catalog__plate_description">
                    ${description}
                </p>
                <p class="catalog__plate_adress">${filteredItems[elemNum].adress}</p>
            </div>
        </a>
        `
        document.getElementById('catalog__container').appendChild(catalogPlate);
    }

    function createPage(elemNum) {
        document.querySelector('.catalog__container').innerHTML = '';
    }

    function renderCatalog(page) {
        currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
        let searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (localStorage.getItem('textinput')) {
            document.getElementById('searchInput').value=localStorage.getItem('textinput')
            searchTerm = document.getElementById('searchInput').value.toLowerCase();
        } 
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        filteredItems = Array.from(items).filter(item => {
            const title = item.title.toLowerCase(); 
            return title.includes(searchTerm) && (activeFilter === 'Все' || item.filter === activeFilter);
        });
        localStorage.setItem('textinput', '')
        
        if (searchTerm === 'апрпапр') {
            document.getElementById('secretContainer').style.display = 'flex';
            document.getElementById('noResultsMessage').style.display = 'none';
            document.getElementById('catalog__container').style.display = 'none'
        } else {
            document.getElementById('secretContainer').style.display = 'none';
            document.getElementById('catalog__container').style.display = 'grid'
        }
        document.querySelector(`button[data-id="${activeFilter}"]`).classList.add('active');
        
        // items.forEach(item => item.style.display = 'none');
        filteredItems.forEach(item => {
            createPage()
            for (let i = start; i < end && i < filteredItems.length; i++) {
                createPlate(i)
            }
        });

        if (showAllItems) {
            createPage()
            for (let i = start; i < end && i < filteredItems.length; i++) {
                createPlate(i)
            }
        }

        if (filteredItems.length === 0) {
            noResultsMessage.style.display = 'block';
            pagination.style.display = 'none';
            document.getElementById('catalog__container').style.display = 'none'
        } else {
            noResultsMessage.style.display = 'none';
            pagination.style.display = 'flex';
            document.getElementById('catalog__container').style.display = 'grid'
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

        let plusPages = 0
        let minusPages = 0
        if (currentPage < 4) {plusPages = 4-currentPage}
        if (currentPage > totalPages-4) {minusPages = 3 - (totalPages - currentPage)}
        const startPage = Math.max(1, currentPage - 3 - minusPages);
        const endPage = Math.min(totalPages, currentPage + 3 + plusPages);

        for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
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

    function saveState() {
        localStorage.setItem('currentPage', currentPage);
        const url = new URL(window.location);
        url.searchParams.set('filter', activeFilter);
        window.history.replaceState(null, '', url);
    }

    document.getElementById('searchInput').addEventListener('input', function () {
        currentPage = 1; 
        updateCatalog();
    });

    document.querySelectorAll('.catalog__filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            activeFilter = this.getAttribute('data-id');
            currentPage = 1; 
            document.querySelectorAll('.catalog__filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateCatalog();
        });
    });

    document.querySelectorAll('.catalog__container').forEach(plate => {
        plate.addEventListener('click', function (elem) {
            const itemid = elem.target.closest('.catalog__plate').getAttribute('data-id')
            localStorage.setItem('item-id', itemid)
        });
    });

    // document.querySelector('.catalog__container').forEach(plate => {
    //     plate.addEventListener('click', function(event) {
    //         const clickedElement = event.target;
    //         console.log(clickedElement); // Элемент, на который кликнули
    //     });
    // })

    document.getElementById('showAllButton').addEventListener('click', function () {
        showAllItems = true;
        updateCatalog();
    });

    function updateCatalog() {
        saveState(); 
        renderCatalog(currentPage);
        renderPagination();
        showAllItems=false
        setTimeout(() => {
            document.querySelector('.loader__wrap').classList.add('hidden')
            document.body.classList.remove('overflow-h')
        }, 500);
    }

    updateCatalog();
});