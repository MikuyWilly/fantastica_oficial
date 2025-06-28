// Sistema de favoritos
class FavoritosManager {
    constructor() {
        this.favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        this.init();
    }

    init() {
        this.updateFavoritosCount();
        this.loadFavoritosPage();
        this.setupEventListeners();
        
        // Asegurar que el modal se inicialice
        this.initializeModal();
    }

    initializeModal() {
        console.log('Inicializando modal en favoritos...');
        
        // Esperar a que se cargue el modal
        setTimeout(() => {
            const modal = document.getElementById('product-modal');
            console.log('Modal encontrado:', modal);
            
            if (!window.productModal && window.location.pathname.includes('favoritos.html')) {
                console.log('ProductModal no existe, creando fallback...');
                // Si no existe el modal, crearlo
                if (typeof ProductModal !== 'undefined') {
                    console.log('ProductModal disponible, creando instancia...');
                    window.productModal = new ProductModal();
                } else {
                    console.log('ProductModal no disponible, creando modal básico...');
                    // Fallback: crear una función básica de modal
                    this.createBasicModal();
                }
            } else if (window.productModal) {
                console.log('ProductModal ya existe');
            }
        }, 1000);
    }

    createBasicModal() {
        console.log('Creando modal básico...');
        // Crear un modal básico si no existe ProductModal
        const modal = document.getElementById('product-modal');
        if (modal) {
            const closeBtn = modal.querySelector('#modal-close');
            const overlay = modal.querySelector('.modal-overlay');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    console.log('Modal cerrado por botón X');
                });
            }
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    modal.classList.remove('active');
                    console.log('Modal cerrado por overlay');
                });
            }

            // Agregar evento para cerrar con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    console.log('Modal cerrado con ESC');
                }
            });

            console.log('Modal básico creado correctamente');
        } else {
            console.error('Modal no encontrado para crear modal básico');
        }
    }

    // Agregar producto a favoritos
    addToFavorites(productId, productName, productPrice, productImage) {
        const existingIndex = this.favoritos.findIndex(item => item.id === productId);
        
        if (existingIndex === -1) {
            this.favoritos.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                addedAt: new Date().toISOString()
            });
            
            // Actualizar botón
            const button = document.querySelector(`[data-product-id="${productId}"]`);
            if (button) {
                button.classList.add('favorited');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            }
            
            this.saveFavoritos();
            this.updateFavoritosCount();
            
            return true; // Agregado exitosamente
        }
        
        return false; // Ya existe
    }

    // Remover producto de favoritos
    removeFromFavorites(productId) {
        const existingIndex = this.favoritos.findIndex(item => item.id === productId);
        
        if (existingIndex !== -1) {
            this.favoritos.splice(existingIndex, 1);
            
            // Actualizar botón en la página principal
            const button = document.querySelector(`[data-product-id="${productId}"]`);
            if (button) {
                button.classList.remove('favorited');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
            
            this.saveFavoritos();
            this.updateFavoritosCount();
            this.loadFavoritosPage();
            
            return true; // Removido exitosamente
        }
        
        return false; // No existe
    }

    // Verificar si un producto está en favoritos
    isInFavorites(productId) {
        return this.favoritos.some(item => item.id === productId);
    }

    // Guardar favoritos en localStorage
    saveFavoritos() {
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }

    // Actualizar contador de favoritos
    updateFavoritosCount() {
        const countElements = document.querySelectorAll('#favoritos-count');
        countElements.forEach(element => {
            element.textContent = this.favoritos.length;
        });
    }

    // Cargar página de favoritos
    loadFavoritosPage() {
        const favoritosGrid = document.getElementById('favoritos-grid');
        const favoritosEmpty = document.getElementById('favoritos-empty');
        
        if (!favoritosGrid) return; // No estamos en la página de favoritos
        
        if (this.favoritos.length === 0) {
            favoritosGrid.style.display = 'none';
            favoritosEmpty.style.display = 'block';
        } else {
            favoritosGrid.style.display = 'grid';
            favoritosEmpty.style.display = 'none';
            
            favoritosGrid.innerHTML = '';
            
            this.favoritos.forEach(product => {
                const productCard = this.createProductCard(product);
                favoritosGrid.appendChild(productCard);
            });
        }
    }

    // Crear tarjeta de producto para favoritos
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        
        // Hacer la tarjeta clickeable para abrir modal
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // No abrir modal si se hace clic en el botón de eliminar
            if (!e.target.closest('.remove-from-favorites')) {
                this.openProductModal(product.id);
            }
        });
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Producto agregado a favoritos</p>
                <div class="product-price">
                    <div>
                        <span class="price">$${product.price.toLocaleString()}</span>
                    </div>
                    <button class="remove-from-favorites" data-product-id="${product.id}" title="Eliminar de favoritos">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Agregar evento para remover de favoritos
        const removeButton = card.querySelector('.remove-from-favorites');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se abra el modal
            this.removeFromFavorites(product.id);
        });
        
        return card;
    }

    // Método para abrir modal de producto
    openProductModal(productId) {
        console.log('Intentando abrir modal para producto:', productId);
        
        // Primero intentar cargar los datos completos del producto
        this.loadProductData(productId).then(productData => {
            console.log('Datos del producto cargados:', productData);
            
            if (window.productModal) {
                window.productModal.openModal(productId);
            } else {
                // Fallback: abrir modal básico
                this.openBasicModal(productData);
            }
        }).catch(error => {
            console.error('Error al cargar datos del producto:', error);
            // Intentar abrir modal con datos básicos del favorito
            const favorito = this.favoritos.find(f => f.id == productId);
            if (favorito) {
                this.openBasicModal(favorito);
            }
        });
    }

    openBasicModal(productData) {
        const modal = document.getElementById('product-modal');
        if (!modal) {
            console.error('Modal no encontrado');
            return;
        }

        console.log('Abriendo modal con datos:', productData);

        // Llenar datos del modal
        const modalImage = modal.querySelector('#modal-product-image');
        const modalName = modal.querySelector('#modal-product-name');
        const modalPrice = modal.querySelector('#modal-price');
        const modalOldPrice = modal.querySelector('#modal-old-price');
        const modalDescription = modal.querySelector('#modal-product-description');
        const modalStock = modal.querySelector('#modal-stock');
        const modalCategory = modal.querySelector('#modal-category');
        const modalSku = modal.querySelector('#modal-sku');
        const modalBadge = modal.querySelector('#modal-product-badge');

        // Actualizar imagen
        if (modalImage) {
            // Usar múltiples imágenes si están disponibles, sino usar imagen única
            const images = productData.imagenes || [productData.image];
            
            modalImage.src = images[0];
            modalImage.alt = productData.name || productData.nombre;
            
            // Agregar manejo de errores para la imagen
            modalImage.onload = () => {
                console.log('Imagen cargada correctamente:', images[0]);
            };
            
            modalImage.onerror = () => {
                console.error('Error al cargar imagen:', images[0]);
                // Usar imagen por defecto si falla
                modalImage.src = 'https://via.placeholder.com/400x500/f8f9fa/6c757d?text=Imagen+no+disponible';
            };
            
            console.log('Imagen actualizada:', images[0]);
            
            // Configurar galería de imágenes si hay múltiples
            this.setupImageGallery(images, productData.name || productData.nombre);
        } else {
            console.error('Elemento de imagen no encontrado en el modal');
        }

        // Actualizar nombre
        if (modalName) {
            modalName.textContent = productData.name || productData.nombre;
            console.log('Nombre actualizado:', productData.name || productData.nombre);
        }

        // Actualizar precio
        if (modalPrice) {
            modalPrice.textContent = this.formatPrice(productData.price || productData.precio);
            console.log('Precio actualizado:', productData.price || productData.precio);
        }

        // Actualizar precio anterior
        if (modalOldPrice) {
            if (productData.precioAnterior) {
                modalOldPrice.textContent = this.formatPrice(productData.precioAnterior);
                modalOldPrice.style.display = 'inline';
            } else {
                modalOldPrice.style.display = 'none';
            }
        }

        // Actualizar descripción
        if (modalDescription) {
            modalDescription.textContent = productData.descripcion || 'Producto agregado a favoritos';
            console.log('Descripción actualizada:', productData.descripcion);
        }

        // Actualizar stock
        if (modalStock) {
            modalStock.textContent = productData.stock || 'Disponible';
            console.log('Stock actualizado:', productData.stock);
        }

        // Actualizar categoría
        if (modalCategory) {
            modalCategory.textContent = this.formatCategory(productData.categoria);
            console.log('Categoría actualizada:', productData.categoria);
        }

        // Actualizar SKU
        if (modalSku) {
            modalSku.textContent = `SKU-${(productData.id || '000').toString().padStart(3, '0')}`;
        }

        // Actualizar badge
        if (modalBadge) {
            if (productData.badge) {
                modalBadge.textContent = productData.badge;
                modalBadge.style.display = 'inline-block';
            } else {
                modalBadge.style.display = 'none';
            }
        }

        // Actualizar opciones de talla
        this.updateSizeOptions(productData.tallas);

        // Actualizar opciones de color
        this.updateColorOptions(productData.colores);

        // Actualizar enlaces de WhatsApp con información del producto
        this.updateWhatsAppLinks(productData);

        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        console.log('Modal abierto correctamente');
    }

    updateSizeOptions(tallas) {
        const sizeOptionsContainer = document.getElementById('modal-size-options');
        if (!sizeOptionsContainer || !tallas) return;

        sizeOptionsContainer.innerHTML = '';
        
        tallas.forEach(talla => {
            const sizeOption = document.createElement('button');
            sizeOption.className = 'size-option';
            sizeOption.textContent = talla;
            sizeOption.addEventListener('click', () => {
                // Remover selección previa
                sizeOptionsContainer.querySelectorAll('.size-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Seleccionar actual
                sizeOption.classList.add('selected');
            });
            sizeOptionsContainer.appendChild(sizeOption);
        });

        console.log('Opciones de talla actualizadas:', tallas);
    }

    updateColorOptions(colores) {
        const colorOptionsContainer = document.getElementById('modal-color-options');
        if (!colorOptionsContainer || !colores) return;

        colorOptionsContainer.innerHTML = '';
        
        colores.forEach(color => {
            const colorOption = document.createElement('button');
            colorOption.className = 'color-option';
            colorOption.textContent = color;
            colorOption.style.setProperty('--color', this.getColorValue(color));
            colorOption.addEventListener('click', () => {
                // Remover selección previa
                colorOptionsContainer.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Seleccionar actual
                colorOption.classList.add('selected');
            });
            colorOptionsContainer.appendChild(colorOption);
        });

        console.log('Opciones de color actualizadas:', colores);
    }

    getColorValue(colorName) {
        const colorMap = {
            'Negro': '#000000',
            'Blanco': '#ffffff',
            'Azul': '#0066cc',
            'Rosa': '#ff69b4',
            'Verde': '#228b22',
            'Gris': '#808080',
            'Beige': '#f5f5dc',
            'Rojo': '#ff0000',
            'Azul marino': '#000080',
            'Azul claro': '#87ceeb',
            'Rosa claro': '#ffb6c1',
            'Azul claro': '#add8e6',
            'Verde militar': '#4b5320',
            'Multicolor': 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)'
        };
        return colorMap[colorName] || '#cccccc';
    }

    formatCategory(categoria) {
        const categoryMap = {
            'vestidos': 'Vestidos',
            'tops': 'Tops',
            'pantalones': 'Pantalones',
            'conjuntos': 'Conjuntos',
            'abrigos': 'Abrigos'
        };
        return categoryMap[categoria] || categoria;
    }

    updateWhatsAppLinks(productData) {
        const productName = productData.name || productData.nombre;
        const productPrice = this.formatPrice(productData.price || productData.precio);
        
        // Crear mensaje para WhatsApp
        const message = `Hola! Me interesa el producto:

*${productName}*

Precio: ${productPrice}

¿Podrían ayudarme con más información?`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/56979361659?text=${encodedMessage}`;
        
        // Actualizar enlace de WhatsApp
        const whatsappBtn = document.querySelector('.btn-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.href = whatsappUrl;
        }
    }

    formatPrice(precio) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    }

    // Cargar datos completos del producto desde JSON
    async loadProductData(productId) {
        try {
            console.log('Cargando datos del producto ID:', productId);
            const response = await fetch('productos.json');
            const data = await response.json();
            const product = data.productos.find(p => p.id == productId);
            
            if (product) {
                console.log('Producto encontrado:', product);
                
                // Actualizar los datos del favorito con información completa
                const favoritoIndex = this.favoritos.findIndex(f => f.id == productId);
                if (favoritoIndex !== -1) {
                    this.favoritos[favoritoIndex] = {
                        ...this.favoritos[favoritoIndex],
                        descripcion: product.descripcion,
                        categoria: product.categoria,
                        stock: product.stock,
                        tallas: product.tallas,
                        colores: product.colores,
                        precioAnterior: product.precioAnterior,
                        badge: product.badge
                    };
                    this.saveFavoritos();
                    console.log('Favorito actualizado con datos completos');
                }
                return product;
            } else {
                console.error('Producto no encontrado en JSON');
                // Si no se encuentra en JSON, usar datos del favorito
                const favorito = this.favoritos.find(f => f.id == productId);
                if (favorito) {
                    console.log('Usando datos del favorito:', favorito);
                    return favorito;
                }
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al cargar producto:', error);
            // Fallback: usar datos del favorito
            const favorito = this.favoritos.find(f => f.id == productId);
            if (favorito) {
                console.log('Usando datos del favorito como fallback:', favorito);
                return favorito;
            }
            throw error;
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para botones de favoritos en la página principal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-favorites')) {
                const button = e.target.closest('.add-to-favorites');
                const productId = button.getAttribute('data-product-id');
                const productName = button.getAttribute('data-product-name');
                const productPrice = parseInt(button.getAttribute('data-product-price'));
                const productImage = button.getAttribute('data-product-image');
                
                if (this.isInFavorites(productId)) {
                    // Remover de favoritos
                    this.removeFromFavorites(productId);
                    button.innerHTML = '<i class="far fa-heart"></i>';
                    button.classList.remove('favorited');
                    alert(`¡${productName} ha sido removido de favoritos!`);
                } else {
                    // Agregar a favoritos
                    this.addToFavorites(productId, productName, productPrice, productImage);
                    button.innerHTML = '<i class="fas fa-heart"></i>';
                    button.classList.add('favorited');
                    alert(`¡${productName} ha sido agregado a favoritos!`);
                }
            }
        });
    }

    // Inicializar estado de botones en la página principal
    initializeButtons() {
        document.querySelectorAll('.add-to-favorites').forEach(button => {
            const productId = button.getAttribute('data-product-id');
            if (this.isInFavorites(productId)) {
                button.classList.add('favorited');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            }
        });
    }

    setupImageGallery(images, productName) {
        const thumbnailsContainer = document.getElementById('image-thumbnails');
        const imageCounter = document.getElementById('image-counter');
        const currentImageSpan = document.getElementById('current-image');
        const totalImagesSpan = document.getElementById('total-images');
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');
        
        if (!thumbnailsContainer) return;
        
        // Limpiar contenedor de miniaturas
        thumbnailsContainer.innerHTML = '';
        
        // Mostrar/ocultar contador y botones de navegación
        if (images.length > 1) {
            if (imageCounter) imageCounter.style.display = 'block';
            if (prevButton) prevButton.style.display = 'flex';
            if (nextButton) nextButton.style.display = 'flex';
            if (currentImageSpan) currentImageSpan.textContent = '1';
            if (totalImagesSpan) totalImagesSpan.textContent = images.length.toString();
            
            // Crear miniaturas
            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = image;
                thumbnailImg.alt = `${productName} - Vista ${index + 1}`;
                
                thumbnail.appendChild(thumbnailImg);
                
                // Evento para cambiar imagen principal
                thumbnail.addEventListener('click', () => {
                    this.changeImage(index, images, productName);
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
            
            // Configurar navegación
            this.setupImageNavigation(images, productName);
        } else {
            if (imageCounter) imageCounter.style.display = 'none';
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
        }
    }

    changeImage(index, images, productName) {
        const mainImage = document.getElementById('modal-product-image');
        const thumbnailsContainer = document.getElementById('image-thumbnails');
        const currentImageSpan = document.getElementById('current-image');
        
        if (!mainImage || !thumbnailsContainer) return;
        
        // Actualizar imagen principal
        mainImage.src = images[index];
        mainImage.alt = `${productName} - Vista ${index + 1}`;
        
        // Actualizar contador
        if (currentImageSpan) {
            currentImageSpan.textContent = (index + 1).toString();
        }
        
        // Actualizar miniatura activa
        thumbnailsContainer.querySelectorAll('.thumbnail').forEach((thumb, thumbIndex) => {
            thumb.classList.toggle('active', thumbIndex === index);
        });
    }

    setupImageNavigation(images, productName) {
        if (images.length <= 1) return;
        
        let currentImageIndex = 0;
        const prevButton = document.getElementById('prev-image');
        const nextButton = document.getElementById('next-image');
        
        // Función para cambiar imagen
        const changeImage = (direction) => {
            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % images.length;
            } else {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            }
            
            this.changeImage(currentImageIndex, images, productName);
        };
        
        // Eventos para botones de navegación
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                changeImage('prev');
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                changeImage('next');
            });
        }
        
        // Agregar navegación con click en imagen principal
        const mainImage = document.getElementById('modal-product-image');
        if (mainImage) {
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
    }
}

// Inicializar el sistema de favoritos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const favoritosManager = new FavoritosManager();
    
    // Si estamos en la página principal, inicializar los botones
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        favoritosManager.initializeButtons();
    }
    
    // Hacer el manager disponible globalmente
    window.favoritosManager = favoritosManager;
}); 