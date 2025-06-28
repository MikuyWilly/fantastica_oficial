// Sistema de filtros para productos
class ProductosFilter {
    constructor() {
        this.currentStatusFilter = 'all';
        this.currentCategoryFilter = 'all';
        this.productosLoader = null;
        this.init();
    }

    init() {
        // Esperar a que se cargue el ProductosLoader
        this.waitForProductosLoader();
    }

    waitForProductosLoader() {
        if (window.productosLoader) {
            this.productosLoader = window.productosLoader;
            this.setupFilterDropdowns();
            this.setupClearFilters();
        } else {
            setTimeout(() => this.waitForProductosLoader(), 100);
        }
    }

    setupFilterDropdowns() {
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentStatusFilter = e.target.value;
                this.applyFilters();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategoryFilter = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupClearFilters() {
        const clearFiltersBtn = document.getElementById('clear-filters');
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    clearAllFilters() {
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        if (statusFilter) statusFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        
        this.currentStatusFilter = 'all';
        this.currentCategoryFilter = 'all';
        
        this.applyFilters();
        
        // Animación de feedback
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clearBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    applyFilters() {
        const products = document.querySelectorAll('.product-card');
        const productsGrid = document.getElementById('products-grid');
        
        // Obtener productos filtrados
        const filteredProducts = this.getFilteredProducts();
        
        // Actualizar productos filtrados en el loader
        if (window.productosLoader) {
            window.productosLoader.updateFilteredProducts(filteredProducts);
        }
        
        // Actualizar contador de productos mostrados
        this.updateProductCount(filteredProducts.length);
        
        // Mostrar mensaje si no hay productos
        this.showNoProductsMessage(filteredProducts.length === 0);
        
        // Actualizar indicadores visuales
        this.updateFilterIndicators();
    }

    getFilteredProducts() {
        if (!window.productosLoader) return [];
        
        const allProducts = window.productosLoader.productos;
        const filteredProducts = allProducts.filter(product => {
            const productCategory = product.categoria;
            const productBadge = product.badge?.toLowerCase() || '';
            
            const matchesCategory = this.currentCategoryFilter === 'all' || productCategory === this.currentCategoryFilter;
            const matchesStatus = this.matchesStatusFilter(productBadge);
            
            return matchesCategory && matchesStatus;
        });
        
        return filteredProducts;
    }

    matchesStatusFilter(productBadge) {
        switch (this.currentStatusFilter) {
            case 'all':
                return true;
            case 'nuevo':
                return productBadge.includes('nuevo');
            case 'oferta':
                return productBadge.includes('oferta');
            case 'mas-vendido':
                return productBadge.includes('más vendido') || productBadge.includes('mas vendido');
            default:
                return true;
        }
    }

    updateProductCount(count) {
        console.log(`Mostrando ${count} productos con filtros: Estado=${this.currentStatusFilter}, Categoría=${this.currentCategoryFilter}`);
    }

    updateFilterIndicators() {
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        // Agregar clase visual si hay filtros activos
        const hasActiveFilters = this.currentStatusFilter !== 'all' || this.currentCategoryFilter !== 'all';
        
        if (statusFilter) {
            statusFilter.classList.toggle('has-filter', this.currentStatusFilter !== 'all');
        }
        
        if (categoryFilter) {
            categoryFilter.classList.toggle('has-filter', this.currentCategoryFilter !== 'all');
        }
    }

    showNoProductsMessage(show) {
        let noProductsMessage = document.getElementById('no-products-message');
        
        if (show) {
            if (!noProductsMessage) {
                noProductsMessage = document.createElement('div');
                noProductsMessage.id = 'no-products-message';
                noProductsMessage.className = 'no-products-message';
                noProductsMessage.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text);">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta cambiar los filtros para ver más productos</p>
                    </div>
                `;
                
                const productsGrid = document.getElementById('products-grid');
                if (productsGrid) {
                    productsGrid.appendChild(noProductsMessage);
                }
            }
            noProductsMessage.style.display = 'block';
        } else {
            if (noProductsMessage) {
                noProductsMessage.style.display = 'none';
            }
        }
    }
}

// Inicializar filtros cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('productos.html')) {
        const productosFilter = new ProductosFilter();
    }
});

// Animación para productos
const fadeInAnimation = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Agregar la animación al CSS si no existe
if (!document.querySelector('#fadeInAnimation')) {
    const style = document.createElement('style');
    style.id = 'fadeInAnimation';
    style.textContent = fadeInAnimation;
    document.head.appendChild(style);
} 