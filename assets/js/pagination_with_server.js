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
        this.catalogSort = document.getElementById('catalogSort')
        this.timeout
    }

    async getData(filter, searchterm, sortBy = '') {
        try {
            let url
            if (searchterm == '') {
                url = `https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&limit=6&page=${this.currentPage}&sortBy=${sortBy}`
            } else {
                url = `https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&page=${this.currentPage}&limit=6&title=${searchterm}&sortBy=${sortBy}`
            }
            const response = await fetch(url)
            const getdata = await response.json(); 
            return getdata
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async getLength(filter, searchterm = '') {
        try {
            if (searchterm == '') {
                this.response = await fetch(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}`)
            } else {
                this.response = await fetch(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters?filter=${filter}&title=${searchterm}`)
            }
            const getdata = await this.response.json();
            return getdata.length
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async delLandmark(landmarkID) {
        const response = await fetch(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters/${landmarkID}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log(`Landmark с ID ${landmarkID} успешно удален.`);
        } else {
            console.error('Ошибка при удалении landmark:', response.statusText);
        }
    }

    async addLandmark (postData) {
        const response = await fetch(`https://6728a8d3270bd0b97556a70f.mockapi.io/catalog/filters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            throw new Error('response not ok');
        }
        return await response.json();
    }

    async simpleHash(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    }
 
    async createPlate(elemNum) {
        let description=this.filteredItems[elemNum].description
        if(description.length > 275) {
            description = description.slice(0, 255) + '...'
        }
        let average_grade = this.filteredItems[elemNum].grade.reduce((sum, grade) => {
            return sum+grade
        }, 0)
        average_grade = average_grade/this.filteredItems[elemNum].grade.length
        average_grade = Math.round(average_grade*10)/10
        if (!average_grade) {
            average_grade='Нету'
        } 
        const catalogPlate = document.createElement('div');
        catalogPlate.classList.add('catalog__plate');
        catalogPlate.id = this.filteredItems[elemNum].filter
        catalogPlate.setAttribute('data-id', this.filteredItems[elemNum].id)
        catalogPlate.innerHTML = `
        <img src="${this.filteredItems[elemNum].imgs[0]}"></img>
        <div class="catalog__plate_text">
            <div class="catalog__plate_up-block">
                <h4 class="catalog__plate_title">
                    ${this.filteredItems[elemNum].title}
                </h4>
            </div>
            <div class="catalog__plate_middle-block">
                <p class="catalog__plate_grade">${average_grade}</p>
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
        try {
            if (localStorage.getItem('username')=='subtitri' || (await this.simpleHash(localStorage.getItem('password'))=='5b4e64e9122b548101d5cf76ebd7476ae6583782ab144e35f45c7aa3d5d52d20' && localStorage.getItem('username')=='subtitri')) { 
                const deleteLandmarkBtn = document.createElement('button');
                deleteLandmarkBtn.id = 'delLandmark'
                deleteLandmarkBtn.innerHTML = `DEL`
                catalogPlate.append(deleteLandmarkBtn)
    
                deleteLandmarkBtn.addEventListener('click', async (e) => {
                    const landmarkID = e.target.closest('.catalog__plate').getAttribute('data-id')
    
                    await this.delLandmark(landmarkID)
                    this.updateCatalog()
                });
            }
        } catch {}
        this.catalog_container.appendChild(catalogPlate);
    }

    async renderCatalog() {
        this.catalogSort = document.getElementById('catalogSort')
        this.currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        this.searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (localStorage.getItem('textinput')) {
            document.getElementById('searchInput').value=localStorage.getItem('textinput')
            this.searchTerm = document.getElementById('searchInput').value.toLowerCase();
        } 
        
        this.filteredItems = await this.getData((this.activeFilter == 'Все') ? '':this.activeFilter, (this.searchTerm) ? this.searchTerm:'', this.catalogSort.value)
        
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
                await this.createPlate(i, this.review_grades)
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
            this.updateCatalog()
        });
        pagination.appendChild(firstButton);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateCatalog()
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
            this.updateCatalog()
        });
        pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateCatalog()
            }
        });
        pagination.appendChild(nextButton);

        const lastButton = document.createElement('button');
        lastButton.textContent = '>>';
        lastButton.disabled = this.currentPage === totalPages;
        lastButton.addEventListener('click', () => {
            this.currentPage = totalPages;
            this.updateCatalog()
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
        if (localStorage.getItem('username')=='subtitri' || (await this.simpleHash(localStorage.getItem('password'))=='5b4e64e9122b548101d5cf76ebd7476ae6583782ab144e35f45c7aa3d5d52d20' && localStorage.getItem('username')=='subtitri')) { 
            document.querySelector('.catalog__sort-container').innerHTML = `
            <div class="catalog__sort-container">
                <input type="text" id="searchInput" class="catalog__search-input" placeholder="Поиск по заголовку">
                <select name="catalogSort" id="catalogSort">
                    <option value="grade&amp;order=desc">По убыванию рейтинга</option>
                    <option value="grade&amp;order=asc">По возрастанию рейтинга</option>
                    <option value="title&amp;order=asc">От А до Я</option>
                    <option value="title&amp;order=desc">От Я до А</option>
                </select>
                <button class="catalog__blue-btn" id="add-landmark">Добавить</button>
            </div>
            `
            const form = document.createElement('form')
            form.classList.add('landmark__add')
            form.classList.add('hide')
            form.id = 'landmarkForm'
            form.innerHTML = `
            <div class="landmark__up-block">
                <div class="landmark__title">
                    <h3>Добавление достопримечательности</h3>
                </div>
            </div>
            <div class="landmark__add_choice-reviews">
                <div class="landmark__add_choice-reviews_left-block">
                    <select name="filter" class="landmark__add_choice-reviews_filter">
                        <option value="Памятники">Памятники</option>
                        <option value="Музеи">Музеи</option>
                        <option value="Парки и сады">Парки и сады</option>
                        <option value="Храмы и церкви">Храмы и церкви</option>
                        <option value="Театры и культурные центры">Театры и культурные центры</option>
                        <option value="Фонтаны">Фонтаны</option>
                        <option value="Площади">Площади</option>
                    </select>
                    <button class="landmark__add_photes-btn" type="button" id="add_photo">Добавить фото</button>
                </div>
                <div class="landmark__add-close">
                    Закрыть
                </div>
            </div>
            <input maxlength="60" type="text" name="title" class="landmark__add_description title" placeholder="Заголовок достопримечательности" required=""> 
            <textarea minlength="100" maxlength="1000" type="text" name="description" class="landmark__add_description" placeholder="Описание достопримечательности" required=""></textarea>
            <input maxlength="50" type="text" name="adress" class="landmark__add_elem-input" placeholder="Адресс" required="">
            <input type="url" name="map" class="landmark__add_elem-input" placeholder="Ссылка на карту" required="">
            <div class="input-photo__container">
                <input type="url" name="url" class="landmark__add_elem-input" placeholder="Ссылка на фото" required="">
            </div>
            <input id="postLandmark" type="submit" class="landmark__window_blue-btn" value="Добавить достопримечательность" required="">
            `
            document.getElementById('form-container').appendChild(form)
            console.log('ok')
            this.addLandmarkBtn = document.getElementById('add-landmark')
            this.landmarkForm = document.getElementById('landmarkForm')
            this.landmarkAddClose = document.querySelector('.landmark__add-close')
            this.addPhotoBtn = document.getElementById('add_photo')
            this.inpPhotoContainer = document.querySelector('.input-photo__container')
            this.countPhotes = 1
            this.addLandmarkBtn.addEventListener('click', () => {
                this.landmarkForm.style = `
                transform: translateY(0);
                margin-top: 20px;
                `
            })
            this.landmarkAddClose.addEventListener('click', () => {
                this.landmarkForm.style = `
                transform: translateY(-1000px);
                margin-top: -${this.landmarkForm.clientHeight}px;
                `
            })
            this.addPhotoBtn.addEventListener('click', () => {
                if (this.countPhotes > 4) {
                    return
                }
                this.countPhotes++;
                const input = document.createElement('input');
                input.type = 'url';
                input.name = 'url';
                input.className = 'landmark__add_elem-input';
                input.placeholder = 'Ссылка на фото';
                input.required = true;
                this.inpPhotoContainer.appendChild(input);
            });
            this.landmarkForm.addEventListener('submit', async (e) => {
                e.preventDefault(); 
            
                const formData = new FormData(this.landmarkForm);
                const postData = {};
                formData.forEach((value, key) => {
                    if (key === 'url') {
                        if (!postData.imgs) {
                            postData.imgs = []; 
                        }
                        postData.imgs.push(value); 
                    } else {
                        postData[key] = value; 
                    }
                });
            
                this.landmarkForm.reset()
                document.getElementById('postLandmark').classList.add('green-btn')
                document.getElementById('postLandmark').value = 'Достопримечательность добавлена'
                await this.addLandmark(postData)
                this.updateCatalog()
                setTimeout(() => {
                    this.landmarkAddClose.click()
                    setTimeout(() => {
                        document.getElementById('postLandmark').classList.remove('green-btn')
                    }, 1000);
                }, 2500);
            });
        }
        document.getElementById('searchInput').addEventListener('input', () => {
            this.currentPage = 1;
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.updateCatalog()
            }, 1000);
        });
        document.getElementById('catalogSort').addEventListener('change', () => {
            console.log(this.catalogSort.value)
            this.updateCatalog()
        })
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
                    setTimeout(() => {
                        window.location.href = `landmark.html?item=${itemid}`
                    }, 500);
                });
            });
            document.getElementById('showAllButton').addEventListener('click', function () {
                this.updateCatalog()
            });
        });
        this.updateCatalog();
    }
    async updateCatalog() {   
        document.querySelector('.loader__wrap').classList.remove('hidden')
        document.body.classList.add('overflow-h')
        this.saveState(); 
        await this.renderCatalog();
        await this.renderPagination();
        document.querySelector('.loader__wrap').classList.add('hidden')
        document.body.classList.remove('overflow-h')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pagination = new Pagination()
    pagination.init()
})