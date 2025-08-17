// JavaScript Principal - 1ª IEQ Promissão
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
    if (mobileMenuButton) {
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
    }
    
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
            const href = this.getAttribute('href');
            
            // Se for link para outra página com âncora, não interceptar
            if (href.includes('.html#')) {
                return; // Deixa o navegador lidar com isso
            }
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Compensar altura da navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
                notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        <span>${message}</span>
                        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span>${message}</span>
                        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500', 'text-white');
                notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <span>${message}</span>
                        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                break;
            default:
                notification.classList.add('bg-blue-500', 'text-white');
                notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        <span>${message}</span>
                        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
        }
        
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
    
    // Expor função globalmente para uso em outras páginas
    window.showNotification = showNotification;
    
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
    backToTopButton.setAttribute('aria-label', 'Voltar ao topo');
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
    
    // ===== DETECÇÃO DE DISPOSITIVO =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouch) {
        document.body.classList.add('is-mobile');
        
        // Otimizações específicas para mobile
        const pillars = document.querySelectorAll('.pillar-card');
        pillars.forEach(pillar => {
            pillar.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            pillar.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // ===== SEO E ANALYTICS =====
    // Google Analytics (substitua pelo seu ID)
    function gtag(){
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push(arguments);
        }
    }
    
    // Track page views
    function trackPageView(page) {
        if (typeof gtag === 'function') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }
    
    // Track events
    function trackEvent(action, category, label = null, value = null) {
        if (typeof gtag === 'function') {
            const eventData = {
                event_category: category,
                event_label: label,
                value: value
            };
            gtag('event', action, eventData);
        }
    }
    
    // Expose tracking functions
    window.trackEvent = trackEvent;
    window.trackPageView = trackPageView;
    
    // ===== ACESSIBILIDADE =====
    // Detectar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desabilitar animações para usuários que preferem movimento reduzido
        const animatedElements = document.querySelectorAll('.floating, .animate-bounce, .animate-pulse, .animate-spin');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
        
        document.body.classList.add('reduce-motion');
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
                
                // Track easter egg
                trackEvent('easter_egg', 'engagement', 'konami_code');
                
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
    
    // ===== PRELOAD DE RECURSOS CRÍTICOS =====
    const criticalResources = [
        'img/ieqlogo.png',
        'css/style.css'
    ];
    
    criticalResources.forEach(src => {
        if (src.endsWith('.css')) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'style';
            document.head.appendChild(link);
        } else {
            const img = new Image();
            img.src = src;
        }
    });
    
    // ===== SERVICE WORKER PARA PWA =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registrado: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW falhou: ', registrationError);
                });
        });
    }
    
    // ===== MANIFEST PWA =====
    const manifest = {
        name: '1ª Igreja do Evangelho Quadrangular - Promissão',
        short_name: '1ª IEQ Promissão',
        description: 'Igreja baseada nos 4 pilares: Jesus Salva, Batiza, Cura e Voltará',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ef4444',
        icons: [
            {
                src: 'img/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'img/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    };
    
    // Criar manifest dinamicamente
    const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(manifestBlob);
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = manifestURL;
    document.head.appendChild(manifestLink);
    
    // ===== INICIALIZAÇÃO FINAL =====
    console.log('🙏 Website da 1ª IEQ Promissão carregado com sucesso!');
    console.log('💫 Desenvolvido com amor para a glória de Deus');
    console.log('📱 Modo mobile:', isMobile ? 'Ativado' : 'Desativado');
    console.log('♿ Movimento reduzido:', prefersReducedMotion.matches ? 'Ativado' : 'Desativado');
    
    // Track page load
    trackPageView(window.location.pathname);
});