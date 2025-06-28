// Cargador de productos desde JSON
class ProductosLoader {
    constructor() {
        this.productos = [];
        this.categorias = [];
        this.configuracion = {};
        this.currentPage = 1;
        this.productsPerPage = 18;
        this.filteredProducts = [];
        this.init();
    }

    async init() {
        try {
            await this.cargarProductos();
            this.filteredProducts = [...this.productos];
            this.renderizarProductos();
            this.setupEventListeners();
            this.setupPagination();
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    async cargarProductos() {
        try {
            const response = await fetch('productos.json');
            const data = await response.json();
            
            this.productos = data.productos;
            this.categorias = data.categorias;
            this.configuracion = data.configuracion;
            
            console.log('Productos cargados exitosamente:', this.productos.length);
        } catch (error) {
            console.error('Error al cargar productos.json:', error);
            throw error;
        }
    }

    renderizarProductos() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('productos.html')) {
            this.renderizarTodosLosProductos();
        } else if (currentPage.includes('index.html') || currentPage === '/') {
            this.renderizarProductosRecientes();
        }
    }

    renderizarTodosLosProductos() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        // Calcular productos para la página actual
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        productsGrid.innerHTML = '';
        
        productsToShow.forEach(producto => {
            const productCard = this.crearProductCard(producto);
            productsGrid.appendChild(productCard);
        });

        // Actualizar paginación
        this.updatePagination();
    }

    renderizarProductosRecientes() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        // Filtrar solo productos recientes
        const productosRecientes = this.productos.filter(p => p.esReciente);
        const productosAMostrar = productosRecientes.slice(0, this.configuracion.productosRecientes);

        productsGrid.innerHTML = '';
        
        productosAMostrar.forEach(producto => {
            const productCard = this.crearProductCard(producto);
            productsGrid.appendChild(productCard);
        });
    }

    crearProductCard(producto) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', producto.categoria);
        
        // Hacer la tarjeta clickeable
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // No abrir modal si se hace clic en el botón de favoritos
            if (!e.target.closest('.add-to-favorites')) {
                this.openProductModal(producto.id);
            }
        });
        
        // Formatear precio
        const precioFormateado = this.formatearPrecio(producto.precio);
        const precioAnteriorFormateado = producto.precioAnterior ? this.formatearPrecio(producto.precioAnterior) : null;

        card.innerHTML = `
            ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ''}
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="product-price">
                    <div>
                        ${precioAnteriorFormateado ? `<span class="old-price">${precioAnteriorFormateado}</span>` : ''}
                        <span class="price">${precioFormateado}</span>
                    </div>
                    <button class="add-to-favorites" 
                            data-product-id="${producto.id}" 
                            data-product-name="${producto.nombre}" 
                            data-product-price="${producto.precio}" 
                            data-product-image="${producto.imagen}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    }

    setupEventListeners() {
        // Los event listeners se configurarán después de que se rendericen los productos
        setTimeout(() => {
            if (window.favoritosManager) {
                window.favoritosManager.initializeButtons();
            }
        }, 100);
    }

    setupPagination() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const paginationNumbers = document.getElementById('pagination-numbers');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderizarTodosLosProductos();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderizarTodosLosProductos();
                }
            });
        }
    }

    updatePagination() {
        const totalProducts = this.filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        const startIndex = (this.currentPage - 1) * this.productsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.productsPerPage, totalProducts);

        // Actualizar información de paginación
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${startIndex}-${endIndex} de ${totalProducts} productos`;
        }

        // Actualizar botones de navegación
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // Generar números de página
        this.generatePageNumbers(totalPages);
    }

    generatePageNumbers(totalPages) {
        const paginationNumbers = document.getElementById('pagination-numbers');
        if (!paginationNumbers) return;

        paginationNumbers.innerHTML = '';

        const maxVisiblePages = 7;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Primera página
        if (startPage > 1) {
            this.addPageNumber(1);
            if (startPage > 2) {
                this.addEllipsis();
            }
        }

        // Páginas visibles
        for (let i = startPage; i <= endPage; i++) {
            this.addPageNumber(i);
        }

        // Última página
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                this.addEllipsis();
            }
            this.addPageNumber(totalPages);
        }
    }

    addPageNumber(pageNum) {
        const paginationNumbers = document.getElementById('pagination-numbers');
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number';
        pageBtn.textContent = pageNum;
        
        if (pageNum === this.currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener('click', () => {
            this.currentPage = pageNum;
            this.renderizarTodosLosProductos();
        });

        paginationNumbers.appendChild(pageBtn);
    }

    addEllipsis() {
        const paginationNumbers = document.getElementById('pagination-numbers');
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-number ellipsis';
        ellipsis.textContent = '...';
        paginationNumbers.appendChild(ellipsis);
    }

    // Método para actualizar productos filtrados (usado por el sistema de filtros)
    updateFilteredProducts(filteredProducts) {
        this.filteredProducts = filteredProducts;
        this.currentPage = 1; // Volver a la primera página
        this.renderizarTodosLosProductos();
    }

    // Métodos para obtener productos
    obtenerProductosPorCategoria(categoria) {
        if (categoria === 'all') {
            return this.productos;
        }
        return this.productos.filter(p => p.categoria === categoria);
    }

    obtenerProductosRecientes() {
        return this.productos.filter(p => p.esReciente);
    }

    obtenerProductoPorId(id) {
        return this.productos.find(p => p.id === id);
    }

    // Método para actualizar productos (útil para futuras expansiones)
    actualizarProductos() {
        this.renderizarProductos();
    }

    // Método para abrir modal de producto
    openProductModal(productId) {
        if (window.productModal) {
            window.productModal.openModal(productId);
        } else {
            // Fallback: usar función global
            if (typeof openProductModal === 'function') {
                openProductModal(productId);
            }
        }
    }
}

// Inicializar el cargador cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.productosLoader = new ProductosLoader();
}); 