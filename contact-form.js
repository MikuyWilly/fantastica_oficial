// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const name = formData.get('name') || document.getElementById('name').value;
            const email = formData.get('email') || document.getElementById('email').value;
            const phone = formData.get('phone') || document.getElementById('phone').value;
            const message = formData.get('message') || document.getElementById('message').value;
            
            // Validar campos requeridos
            if (!name || !email || !message) {
                showNotification('Por favor completa todos los campos requeridos.', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido.', 'error');
                return;
            }
            
            // Simular envío (en un caso real, aquí se enviaría a un servidor)
            showNotification('Enviando mensaje...', 'info');
            
            // Simular delay de envío
            setTimeout(() => {
                // Crear mensaje para WhatsApp
                const whatsappMessage = `Hola! Soy ${name} y quiero contactarlos:

Email: ${email}
Teléfono: ${phone || 'No proporcionado'}

Mensaje:
${message}

¿Podrían ayudarme?`;
                
                const whatsappUrl = `https://wa.me/56979361659?text=${encodeURIComponent(whatsappMessage)}`;
                
                // Mostrar opciones de contacto
                showContactOptions(whatsappUrl, name, email, phone, message);
                
                // Limpiar formulario
                contactForm.reset();
                
            }, 2000);
        });
    }
    
    // Manejo del formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email) {
                showNotification('Por favor ingresa tu email.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido.', 'error');
                return;
            }
            
            // Simular suscripción
            showNotification('Suscribiendo...', 'info');
            
            setTimeout(() => {
                showNotification('¡Te has suscrito exitosamente! Recibirás nuestras novedades.', 'success');
                emailInput.value = '';
            }, 1500);
        });
    }
});

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

function showContactOptions(whatsappUrl, name, email, phone, message) {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="contact-modal-overlay"></div>
        <div class="contact-modal-content">
            <button class="contact-modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <h3>¡Mensaje Enviado!</h3>
            <p>Gracias por contactarnos, ${name}. Te responderemos pronto.</p>
            <p>Mientras tanto, puedes contactarnos directamente:</p>
            
            <div class="contact-options">
                <a href="${whatsappUrl}" target="_blank" class="contact-option whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>Continuar por WhatsApp</span>
                </a>
                
                <a href="https://www.instagram.com/fantastica.oficial/" target="_blank" class="contact-option instagram">
                    <i class="fab fa-instagram"></i>
                    <span>Seguir en Instagram</span>
                </a>
                
                <a href="mailto:williamsbase42@gmail.com" class="contact-option email">
                    <i class="fas fa-envelope"></i>
                    <span>Enviar Email</span>
                </a>
            </div>
            
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                Cerrar
            </button>
        </div>
    `;
    
    // Agregar estilos
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = modal.querySelector('.contact-modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
    `;
    
    const content = modal.querySelector('.contact-modal-content');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        position: relative;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    const closeBtn = modal.querySelector('.contact-modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    `;
    
    const contactOptions = modal.querySelector('.contact-options');
    contactOptions.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 20px 0;
    `;
    
    const contactOption = modal.querySelectorAll('.contact-option');
    contactOption.forEach(option => {
        option.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            border-radius: 8px;
            text-decoration: none;
            color: white;
            font-weight: 600;
            transition: transform 0.2s;
        `;
        
        if (option.classList.contains('whatsapp')) {
            option.style.background = '#25D366';
        } else if (option.classList.contains('instagram')) {
            option.style.background = 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)';
        } else if (option.classList.contains('email')) {
            option.style.background = '#007bff';
        }
        
        option.addEventListener('mouseenter', () => {
            option.style.transform = 'scale(1.05)';
        });
        
        option.addEventListener('mouseleave', () => {
            option.style.transform = 'scale(1)';
        });
    });
    
    document.body.appendChild(modal);
}

// Agregar estilos CSS para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(style); 