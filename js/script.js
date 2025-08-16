// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGAÇÃO =====
    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Efeito de scroll na navegação
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    }
    
    // Menu mobile toggle
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
    
    // Event listeners para navegação
    window.addEventListener('scroll', updateNavbar);
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu mobile ao clicar em um link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // ===== ANIMAÇÕES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animar contadores quando visíveis
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar todos os elementos com classe fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // ===== ANIMAÇÃO DE CONTADORES =====
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000; // 2 segundos
        const start = performance.now();
        const suffix = element.textContent.replace(/\d/g, '');
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Função de easing
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutCubic * target);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // ===== SMOOTH SCROLL PARA LINKS DA NAVEGAÇÃO =====
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensar altura da navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Mostrar loading
            submitButton.innerHTML = '<div class="loading"></div> Enviando...';
            submitButton.disabled = true;
            
            // Simular envio (substitua pela sua lógica de envio real)
            setTimeout(() => {
                // Sucesso
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Reset form
                this.reset();
                
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
            }, 2000);
        });
    }
    
    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        // Remove notificação existente se houver
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        
        // Cores baseadas no tipo
        switch(type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // ===== EFEITOS DE PARALLAX =====
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // Throttle para performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function updateParallax() {
        handleParallax();
        ticking = false;
    }
    
    window.addEventListener('scroll', requestTick);
    
    // ===== LAZY LOADING PARA IMAGENS =====
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===== ANIMAÇÕES DOS PILARES =====
    const pillars = document.querySelectorAll('.pillar-red, .pillar-yellow, .pillar-blue, .pillar-purple');
    
    pillars.forEach((pillar, index) => {
        pillar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-10px) rotateY(5deg)';
            this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
        });
        
        pillar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0) rotateY(0deg)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
        
        // Animação escalonada na entrada
        setTimeout(() => {
            pillar.classList.add('animate-slide-in-left');
        }, index * 200);
    });
    
    // ===== BOTÃO VOLTAR AO TOPO =====
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.className = 'fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-purple-500 text-white p-3 rounded-full shadow-lg opacity-0 invisible transition-all duration-300 hover:scale-110 z-50';
    backToTopButton.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });
    
    // ===== TYPEWRITER EFFECT =====
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // ===== INICIALIZAÇÃO DE ANIMAÇÕES =====
    function initAnimations() {
        // Animar título principal após carregamento
        const mainTitle = document.querySelector('.gradient-bg h1');
        if (mainTitle) {
            const originalText = mainTitle.innerHTML;
            setTimeout(() => {
                typeWriter(mainTitle, originalText.replace(/<[^>]*>/g, ''), 80);
            }, 1000);
        }
        
        // Adicionar delay às animações dos cards
        const cards = document.querySelectorAll('.hover-scale');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce function
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Otimizar eventos de scroll
    const optimizedScrollHandler = debounce(() => {
        updateNavbar();
    }, 10);
    
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // ===== INICIALIZAÇÃO =====
    // Executar animações iniciais
    setTimeout(initAnimations, 500);
    
    // Pré-carregar imagens importantes
    const preloadImages = [
        // Adicione aqui URLs de imagens importantes para pré-carregamento
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // ===== EASTER EGGS =====
    // Konami Code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg ativado!
                document.body.style.animation = 'rainbow 2s infinite';
                showNotification('🎉 Código secreto ativado! Que Deus te abençoe! 🎉', 'success');
                konamiIndex = 0;
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 4000);
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // CSS para o easter egg
    const rainbowCSS = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = rainbowCSS;
    document.head.appendChild(style);
    
    // ===== ACESSIBILIDADE =====
    // Detectar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desabilitar animações para usuários que preferem movimento reduzido
        const animatedElements = document.querySelectorAll('.floating, .animate-bounce, .animate-pulse, .animate-spin');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    // Melhorar navegação por teclado
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #eab308';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    console.log('🙏 Website da 1ª IEQ Promissão carregado com sucesso!');
    console.log('💫 Desenvolvido com amor para a glória de Deus');
});