class Pagination {
    constructor() {
        this.showAllItems = false;
        this.filteredItems = [];
        this.activeFilter = new URLSearchParams(window.location.search).get('filter') || 'Все';
        this.currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        this.itemsPerPage = 6;
        this.pagination = document.getElementById('pagination');
        this.noResultsMessage = document.getElementById('noResultsMessage');
        this.catalog_filter_btn = document.querySelectorAll('.catalog__filter-btn')
        this.catalog_container = document.getElementById('catalog__container')
    }

    async getData(filter, searchterm) {
        try {
            let url
            if (searchterm == '') {
                url = `https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&limit=6&page=${this.currentPage}`
            } else {
                url = `https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&page=${this.currentPage}&limit=6&title=${searchterm}`
            }
            const response = await fetch(url)
            const getdata = await response.json(); 
            return getdata
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    
    async getLength(filter, searchterm) {
        try {
            const response = await fetch(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&title=${searchterm}`)
            const getdata = await response.json(); 
            return getdata.length
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    createPlate(elemNum) {
        let description=this.filteredItems[elemNum].description
        if(description.length > 275) {
            description = description.slice(0, 255) + '...'
        }
        const catalogPlate = document.createElement('div');
        catalogPlate.classList.add('catalog__plate');
        catalogPlate.id = this.filteredItems[elemNum].filter
        catalogPlate.setAttribute('data-id', this.filteredItems[elemNum].id)
        catalogPlate.innerHTML = `
        <img src="./assets/img/${this.filteredItems[elemNum].imgs[0]}"></img>
        <div class="catalog__plate_text">
            <div class="catalog__plate_up-block">
                <h4 class="catalog__plate_title">
                    ${this.filteredItems[elemNum].title}
                </h4>
            </div>
            <div class="catalog__plate_middle-block">
                <p class="catalog__plate_grade">${this.filteredItems[elemNum].grade}</p>
                <p class="catalog__plate_type">${this.filteredItems[elemNum].filter}</p>
                <p class="catalog__plate_description">
                    ${description}
                </p>
            </div>
            <div class="catalog__plate_bottom-block">
                <p class="catalog__plate_adress">${this.filteredItems[elemNum].adress}</p>
            </div>
        </div>
        `
        this.catalog_container.appendChild(catalogPlate);
    }

    async renderCatalog() {
        this.currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        this.searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (localStorage.getItem('textinput')) {
            document.getElementById('searchInput').value=localStorage.getItem('textinput')
            this.searchTerm = document.getElementById('searchInput').value.toLowerCase();
        } 
        
        this.filteredItems = await this.getData((this.activeFilter == 'Все') ? '':this.activeFilter, (this.searchTerm) ? this.searchTerm:'')

        localStorage.setItem('textinput', '')
        
        if (this.searchTerm === 'апрпапр') {
            document.getElementById('secretContainer').style.display = 'flex';
            document.getElementById('noResultsMessage').style.display = 'none';
            this.catalog_container.style.display = 'none'
        } else {
            document.getElementById('secretContainer').style.display = 'none';
            this.catalog_container.style.display = 'grid'
        }

        document.querySelector(`button[data-id="${this.activeFilter}"]`).classList.add('active');
        
        this.catalog_container.innerHTML = '';
        try {
            for (let i = 0; i < 6 && i < this.filteredItems.length; i++) {
                this.createPlate(i)
            }
        } catch {}

        if (this.filteredItems === 'Not found') {
            noResultsMessage.style.display = 'block';
            pagination.style.display = 'none';
            this.catalog_container.style.display = 'none'
        } else {
            noResultsMessage.style.display = 'none';
            pagination.style.display = 'flex';
            this.catalog_container.style.display = 'grid'
        }
    }

    async renderPagination() {
        const totalPagesLength = await this.getLength((this.activeFilter == 'Все') ? '':this.activeFilter, (this.searchTerm) ? this.searchTerm:'')
        const totalPages = Math.ceil(totalPagesLength / this.itemsPerPage);
        pagination.innerHTML = '';

        const firstButton = document.createElement('button');
        firstButton.textContent = '<<';
        firstButton.disabled = this.currentPage === 1;
        firstButton.addEventListener('click', () => {
            this.currentPage = 1;
        });
        pagination.appendChild(firstButton);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        });
        pagination.appendChild(prevButton);

        let plusPages = 0
        let minusPages = 0
        if (this.currentPage < 4) {plusPages = 4-this.currentPage}
        if (this.currentPage > totalPages-4) {minusPages = 3 - (totalPages - this.currentPage)}
        const startPage = Math.max(1, this.currentPage - 3 - minusPages);
        const endPage = Math.min(totalPages, this.currentPage + 3 + plusPages);

        for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === this.currentPage);
        pageButton.addEventListener('click', () => {
            this.currentPage = i;
        });
        pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
            }
        });
        pagination.appendChild(nextButton);

        const lastButton = document.createElement('button');
        lastButton.textContent = '>>';
        lastButton.disabled = this.currentPage === totalPages;
        lastButton.addEventListener('click', () => {
            this.currentPage = totalPages;
        });
        pagination.appendChild(lastButton);
    }

    saveState() {
        const url = new URL(window.location);
        url.searchParams.set('filter', this.activeFilter);
        url.searchParams.set('page', this.currentPage)
        window.history.replaceState(null, '', url);
    }
    
    async init() {
        document.getElementById('searchInput').addEventListener('input', () => {
            this.currentPage = 1; 
            this.updateCatalog();
        });
        this.catalog_filter_btn.forEach(button => {
            button.addEventListener('click', (e) => {
                this.activeFilter = e.target.getAttribute('data-id');
                this.currentPage = 1; 
                this.catalog_filter_btn.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.updateCatalog()
            });
            document.querySelectorAll('.catalog__container').forEach(plate => {
                plate.addEventListener('click', function (elem) {
                    const itemid = elem.target.closest('.catalog__plate').getAttribute('data-id')
                    window.location.href = `landmark.html?item=${itemid}`
                });
            });
            document.getElementById('showAllButton').addEventListener('click', function () {
                this.updateCatalog();
            });
            setTimeout(() => {
                document.querySelector('.loader__wrap').classList.add('hidden')
                document.body.classList.remove('overflow-h')
            }, 500);
        });
        this.updateCatalog();
    }
    async updateCatalog() {   
        this.saveState(); 
        await this.renderCatalog();
        await this.renderPagination();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pagination = new Pagination()
    pagination.init()
})