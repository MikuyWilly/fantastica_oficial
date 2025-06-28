// Sistema de Modal para Productos
class ProductModal {
    constructor() {
        console.log('Constructor de ProductModal iniciado');
        
        this.modal = document.getElementById('product-modal');
        this.overlay = document.getElementById('modal-overlay');
        this.closeBtn = document.getElementById('modal-close');
        
        console.log('Elementos del modal encontrados:');
        console.log('- modal:', this.modal);
        console.log('- overlay:', this.overlay);
        console.log('- closeBtn:', this.closeBtn);
        
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupQuantityControls();
    }

    setupEventListeners() {
        // Cerrar modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.overlay.addEventListener('click', () => this.closeModal());
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Botón de favoritos del modal
        const modalFavoriteBtn = document.getElementById('modal-favorite-btn');
        const modalFavoriteBtnLarge = document.getElementById('add-to-favorites-modal-btn');
        
        if (modalFavoriteBtn) {
            modalFavoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        if (modalFavoriteBtnLarge) {
            modalFavoriteBtnLarge.addEventListener('click', () => this.toggleFavorite());
        }
    }

    setupQuantityControls() {
        // Ya no necesitamos controles de cantidad
    }

    openModal(productId) {
        console.log('ProductModal.openModal llamado con ID:', productId);
        
        // Obtener datos del producto
        if (window.productosLoader) {
            console.log('productosLoader encontrado');
            this.currentProduct = window.productosLoader.obtenerProductoPorId(productId);
            console.log('Producto encontrado:', this.currentProduct);
            
            if (this.currentProduct) {
                console.log('Llenando modal con producto...');
                this.populateModal(this.currentProduct);
                console.log('Activando modal...');
                this.modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevenir scroll
                console.log('Modal activado');
            } else {
                console.error('Producto no encontrado con ID:', productId);
            }
        } else {
            console.error('productosLoader no está disponible');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
        
        // Limpiar event listeners
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
        
        // Resetear estado
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
    }

    populateModal(product) {
        this.currentProduct = product;
        
        // Llenar información básica
        document.getElementById('modal-product-name').textContent = product.nombre;
        document.getElementById('modal-product-description').textContent = product.descripcion;
        document.getElementById('modal-stock').textContent = product.stock;
        document.getElementById('modal-category').textContent = this.formatCategory(product.categoria);
        document.getElementById('modal-sku').textContent = `SKU-${product.id.toString().padStart(3, '0')}`;
        
        // Manejar badge
        const badgeElement = document.getElementById('modal-product-badge');
        if (product.badge) {
            badgeElement.textContent = product.badge;
            badgeElement.style.display = 'inline-block';
        } else {
            badgeElement.style.display = 'none';
        }
        
        // Formatear precio
        const priceElement = document.getElementById('modal-price');
        const oldPriceElement = document.getElementById('modal-old-price');
        
        priceElement.textContent = this.formatPrice(product.precio);
        
        if (product.precioAnterior) {
            oldPriceElement.textContent = this.formatPrice(product.precioAnterior);
            oldPriceElement.style.display = 'inline';
        } else {
            oldPriceElement.style.display = 'none';
        }
        
        // Manejar múltiples imágenes
        this.setupImageGallery(product);
        
        // Configurar opciones de talla
        this.setupSizeOptions(product.tallas);
        
        // Configurar opciones de color
        this.setupColorOptions(product.colores);
        
        // Actualizar estado de favoritos
        this.updateFavoriteButton();
        
        // Resetear selecciones
        this.resetSelections();
    }

    setupImageGallery(product) {
        const mainImage = document.getElementById('modal-product-image');
        const thumbnailsContainer = document.getElementById('image-thumbnails');
        const imageCounter = document.getElementById('image-counter');
        const currentImageSpan = document.getElementById('current-image');
        const totalImagesSpan = document.getElementById('total-images');
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');
        
        // Usar múltiples imágenes si están disponibles, sino usar imagen única
        const images = product.imagenes || [product.imagen];
        
        // Limpiar contenedor de miniaturas
        thumbnailsContainer.innerHTML = '';
        
        // Configurar imagen principal
        mainImage.src = images[0];
        mainImage.alt = product.nombre;
        
        // Mostrar/ocultar contador y botones de navegación
        if (images.length > 1) {
            imageCounter.style.display = 'block';
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
            currentImageSpan.textContent = '1';
            totalImagesSpan.textContent = images.length.toString();
        } else {
            imageCounter.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
        
        // Crear miniaturas si hay más de una imagen
        if (images.length > 1) {
            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = image;
                thumbnailImg.alt = `${product.nombre} - Vista ${index + 1}`;
                
                thumbnail.appendChild(thumbnailImg);
                
                // Evento para cambiar imagen principal
                thumbnail.addEventListener('click', () => {
                    this.changeImage(index);
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
        }
        
        // Configurar navegación
        this.setupImageNavigation(images);
    }

    changeImage(index) {
        const images = this.currentProduct.imagenes || [this.currentProduct.imagen];
        const mainImage = document.getElementById('modal-product-image');
        const thumbnailsContainer = document.getElementById('image-thumbnails');
        const currentImageSpan = document.getElementById('current-image');
        
        // Actualizar imagen principal
        mainImage.src = images[index];
        mainImage.alt = `${this.currentProduct.nombre} - Vista ${index + 1}`;
        
        // Actualizar contador
        currentImageSpan.textContent = (index + 1).toString();
        
        // Actualizar miniatura activa
        thumbnailsContainer.querySelectorAll('.thumbnail').forEach((thumb, thumbIndex) => {
            thumb.classList.toggle('active', thumbIndex === index);
        });
        
        // Actualizar índice actual
        this.currentImageIndex = index;
    }

    setupImageNavigation(images) {
        if (images.length <= 1) return;
        
        this.currentImageIndex = 0;
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');
        
        // Función para cambiar imagen
        const changeImage = (direction) => {
            if (direction === 'next') {
                this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
            } else {
                this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
            }
            
            this.changeImage(this.currentImageIndex);
        };
        
        // Eventos para botones de navegación
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage('prev');
        });
        
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            changeImage('next');
        });
        
        // Agregar navegación con teclado
        const handleKeydown = (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            if (e.key === 'ArrowLeft') {
                changeImage('prev');
            } else if (e.key === 'ArrowRight') {
                changeImage('next');
            }
        };
        
        // Remover event listener anterior si existe
        document.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = handleKeydown;
        document.addEventListener('keydown', this.keydownHandler);
        
        // Agregar navegación con click en imagen principal
        const mainImage = document.getElementById('modal-product-image');
        mainImage.addEventListener('click', (e) => {
            const rect = mainImage.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const halfWidth = rect.width / 2;
            
            if (clickX < halfWidth) {
                changeImage('prev');
            } else {
                changeImage('next');
            }
        });
    }

    setupSizeOptions(tallas) {
        const sizeContainer = document.getElementById('modal-size-options');
        if (!sizeContainer || !tallas) return;

        sizeContainer.innerHTML = '';
        
        tallas.forEach(talla => {
            const sizeOption = document.createElement('button');
            sizeOption.className = 'size-option';
            sizeOption.textContent = talla;
            sizeOption.addEventListener('click', () => this.selectSize(talla));
            sizeContainer.appendChild(sizeOption);
        });

        // Seleccionar primera talla por defecto
        if (tallas.length > 0) {
            this.selectSize(tallas[0]);
        }
    }

    setupColorOptions(colores) {
        const colorContainer = document.getElementById('modal-color-options');
        if (!colorContainer || !colores) return;

        colorContainer.innerHTML = '';
        
        colores.forEach(color => {
            const colorOption = document.createElement('button');
            colorOption.className = 'color-option';
            colorOption.setAttribute('data-color', color);
            colorOption.style.backgroundColor = this.getColorValue(color);
            colorOption.addEventListener('click', () => this.selectColor(color));
            colorContainer.appendChild(colorOption);
        });

        // Seleccionar primer color por defecto
        if (colores.length > 0) {
            this.selectColor(colores[0]);
        }
    }

    selectSize(size) {
        this.selectedSize = size;
        
        // Actualizar UI
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = Array.from(document.querySelectorAll('.size-option'))
            .find(option => option.textContent === size);
        
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    selectColor(color) {
        this.selectedColor = color;
        
        // Actualizar UI
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = Array.from(document.querySelectorAll('.color-option'))
            .find(option => option.getAttribute('data-color') === color);
        
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    updateQuantityDisplay() {
        const quantityInput = document.getElementById('quantity-input');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('modal-favorite-btn');
        if (!favoriteBtn || !this.currentProduct) return;

        if (window.favoritosManager && window.favoritosManager.isInFavorites(this.currentProduct.id)) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }

    toggleFavorite() {
        if (!this.currentProduct || !window.favoritosManager) return;

        const productId = this.currentProduct.id;
        const productName = this.currentProduct.nombre;
        const productPrice = this.currentProduct.precio;
        const productImage = this.currentProduct.imagen;

        if (window.favoritosManager.isInFavorites(productId)) {
            window.favoritosManager.removeFromFavorites(productId);
            alert(`¡${productName} ha sido removido de favoritos!`);
        } else {
            window.favoritosManager.addToFavorites(productId, productName, productPrice, productImage);
            alert(`¡${productName} ha sido agregado a favoritos!`);
        }

        this.updateFavoriteButton();
    }

    resetSelections() {
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
        this.updateQuantityDisplay();
    }

    resetModal() {
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    }

    formatCategory(categoryId) {
        if (window.productosLoader && window.productosLoader.categorias) {
            const category = window.productosLoader.categorias.find(cat => cat.id === categoryId);
            return category ? category.nombre : categoryId;
        }
        return categoryId;
    }

    getColorValue(colorName) {
        // Mapeo de nombres de colores a valores hexadecimales
        const colorMap = {
            'Negro': '#000000',
            'Blanco': '#FFFFFF',
            'Azul': '#0066CC',
            'Rosa': '#FF69B4',
            'Beige': '#F5F5DC',
            'Gris': '#808080',
            'Azul marino': '#000080',
            'Azul claro': '#87CEEB',
            'Azul oscuro': '#00008B',
            'Verde': '#008000',
            'Rosa claro': '#FFB6C1',
            'Azul claro': '#ADD8E6',
            'Floral': '#FF69B4'
        };
        
        return colorMap[colorName] || '#CCCCCC';
    }
}

// Inicializar modal cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando ProductModal...');
    window.productModal = new ProductModal();
    console.log('ProductModal inicializado:', window.productModal);
});

// Función global para abrir modal desde cualquier lugar
function openProductModal(productId) {
    console.log('openProductModal llamado con ID:', productId);
    console.log('window.productModal:', window.productModal);
    
    if (window.productModal) {
        console.log('Abriendo modal con productModal.openModal...');
        window.productModal.openModal(productId);
    } else {
        console.error('ProductModal no está inicializado');
    }
} 