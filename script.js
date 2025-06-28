        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');

        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // Here you would typically send the form data to a server
                // For this example, we'll just show an alert
                alert(`Gracias ${name}! Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.`);
                
                // Reset the form
                contactForm.reset();
            });
        }

        // Create floating elements dynamically
        const floatingContainer = document.querySelector('.floating-elements');
        if (floatingContainer) {
            for (let i = 0; i < 8; i++) {
                const element = document.createElement('div');
                element.classList.add('floating-element');
                
                // Random size between 50 and 200px
                const size = Math.floor(Math.random() * 150) + 50;
                
                // Random position
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                
                // Random animation delay
                const delay = Math.random() * 8;
                
                // Random opacity
                const opacity = Math.random() * 0.2 + 0.1;
                
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.top = `${top}%`;
                element.style.left = `${left}%`;
                element.style.animationDelay = `${delay}s`;
                element.style.backgroundColor = `rgba(255, 102, 179, ${opacity})`;
                
                floatingContainer.appendChild(element);
            }
        }

        // Animate elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate');
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.animation = `${element.dataset.animation} 1s forwards`;
                }
            });
        };

        // Set animation attributes on page load
        window.addEventListener('load', () => {
            const sections = document.querySelectorAll('.section');
            sections.forEach((section, index) => {
                const children = section.children;
                for (let i = 1; i < children.length; i++) {
                    children[i].classList.add('animate');
                    children[i].dataset.animation = index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight';
                }
            });
            
            // Initial check
            animateOnScroll();
        });

        // Check on scroll
        window.addEventListener('scroll', animateOnScroll);

        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`¡Gracias por suscribirte! Te enviaremos novedades a ${email}`);
                this.reset();
            });
        }