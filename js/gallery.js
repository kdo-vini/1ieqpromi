// Galeria - JavaScript funcional
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== VARIÁVEIS GLOBAIS =====
    let currentImageIndex = 0;
    let currentFilter = 'all';
    let galleryItems = [];
    let filteredItems = [];
    let isModalOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // ===== ELEMENTOS DOM =====
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const currentImageSpan = document.getElementById('current-image');
    const totalImagesSpan = document.getElementById('total-images');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const shareBtn = document.getElementById('share-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadMoreBtn = document.getElementById('load-more');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modalLoading = document.querySelector('.modal-loading');
    
    // ===== INICIALIZAÇÃO =====
    function init() {
        galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        updateFilteredItems();
        setupEventListeners();
        setupIntersectionObserver();
        preloadImages();
    }
    
    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Filtros
        filterBtns.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });
        
        // Galeria
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openModal(index));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });
        });
        
        // Modal
        modalClose.addEventListener('click', closeModal);
        modalPrev.addEventListener('click', prevImage);
        modalNext.addEventListener('click', nextImage);
        shareBtn.addEventListener('click', shareImage);
        downloadBtn.addEventListener('click', downloadImage);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Touch gestures
        galleryModal.addEventListener('touchstart', handleTouchStart, { passive: true });
        galleryModal.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Close modal on background click
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeModal();
            }
        });
        
        // Load more
        loadMoreBtn.addEventListener('click', loadMoreImages);
        
        // Prevent context menu on long press (mobile)
        galleryItems.forEach(item => {
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        });
    }
    
    // ===== FILTROS =====
    function handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        if (filter === currentFilter) return;
        
        // Update active button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        currentFilter = filter;
        filterImages();
    }
    
    function filterImages() {
        galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = currentFilter === 'all' || category === currentFilter;
            
            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.display = 'block';
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        updateFilteredItems();
    }
    
    function updateFilteredItems() {
        filteredItems = galleryItems.filter(item => {
            const category = item.dataset.category;
            return currentFilter === 'all' || category === currentFilter;
        });
        
        if (totalImagesSpan) {
            totalImagesSpan.textContent = filteredItems.length;
        }
    }
    
    // ===== MODAL =====
    function openModal(index) {
        currentImageIndex = index;
        isModalOpen = true;
        
        // Get filtered index
        const globalIndex = galleryItems.indexOf(filteredItems[index]);
        const item = filteredItems[index] || galleryItems[index];
        
        if (!item) return;
        
        // Show modal
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load image
        loadModalImage(item);
        
        // Update info
        updateModalInfo(item);
        updateModalCounter();
        
        // Focus management
        modalClose.focus();
        
        // Preload adjacent images
        preloadAdjacentImages();
    }
    
    function closeModal() {
        isModalOpen = false;
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset image
        modalImage.src = '';
        modalImage.style.opacity = '0';
    }
    
    function loadModalImage(item) {
        const imageSrc = item.dataset.src;
        const img = item.querySelector('img');
        
        // Show loading
        modalLoading.style.display = 'block';
        modalImage.style.opacity = '0';
        
        // Create new image for loading
        const newImage = new Image();
        
        newImage.onload = function() {
            modalImage.src = this.src;
            modalImage.alt = img.alt;
            modalLoading.style.display = 'none';
            modalImage.style.opacity = '1';
        };
        
        newImage.onerror = function() {
            // Fallback to thumbnail
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalLoading.style.display = 'none';
            modalImage.style.opacity = '1';
        };
        
        newImage.src = imageSrc;
    }
    
    function updateModalInfo(item) {
        const overlay = item.querySelector('.gallery-overlay');
        const title = overlay.querySelector('h3').textContent;
        const description = overlay.querySelector('p').textContent;
        
        modalTitle.textContent = title;
        modalDescription.textContent = description;
    }
    
    function updateModalCounter() {
        currentImageSpan.textContent = currentImageIndex + 1;
        totalImagesSpan.textContent = filteredItems.length;
    }
    
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = filteredItems.length - 1;
        }
        
        const item = filteredItems[currentImageIndex];
        loadModalImage(item);
        updateModalInfo(item);
        updateModalCounter();
        preloadAdjacentImages();
    }
    
    function nextImage() {
        if (currentImageIndex < filteredItems.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0;
        }
        
        const item = filteredItems[currentImageIndex];
        loadModalImage(item);
        updateModalInfo(item);
        updateModalCounter();
        preloadAdjacentImages();
    }
    
    // ===== NAVEGAÇÃO POR TECLADO =====
    function handleKeydown(e) {
        if (!isModalOpen) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
        }
    }
    
    // ===== TOUCH GESTURES =====
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                prevImage();
            }
        }
    }
    
    // ===== COMPARTILHAMENTO =====
    function shareImage() {
        const item = filteredItems[currentImageIndex];
        const title = modalTitle.textContent;
        const description = modalDescription.textContent;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: `${title} - 1ª IEQ Promissão`,
                text: description,
                url: url
            }).catch(console.error);
        } else {
            // Fallback - copy to clipboard
            const text = `${title} - ${description}\n${url}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('Link copiado para a área de transferência!', 'success');
                }).catch(() => {
                    fallbackCopyText(text);
                });
            } else {
                fallbackCopyText(text);
            }
        }
    }
    
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Link copiado!', 'success');
        } catch (err) {
            showNotification('Não foi possível copiar o link', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    // ===== DOWNLOAD =====
    function downloadImage() {
        const item = filteredItems[currentImageIndex];
        const imageSrc = item.dataset.src;
        const title = modalTitle.textContent;
        
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Download iniciado!', 'success');
    }
    
    // ===== LAZY LOADING =====
    function setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const item = img.closest('.gallery-item');
                    
                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                        img.addEventListener('load', () => {
                            item.classList.remove('loading');
                        });
                        img.addEventListener('error', () => {
                            item.classList.remove('loading');
                            img.src = 'img/placeholder.jpg'; // Fallback image
                        });
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe all images
        const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');
        images.forEach(img => {
            img.closest('.gallery-item').classList.add('loading');
            imageObserver.observe(img);
        });
    }
    
    // ===== PRELOAD =====
    function preloadImages() {
        // Preload first few images for better performance
        const priorityItems = filteredItems.slice(0, 6);
        priorityItems.forEach(item => {
            const img = new Image();
            img.src = item.dataset.src;
        });
    }
    
    function preloadAdjacentImages() {
        // Preload previous and next images
        const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredItems.length - 1;
        const nextIndex = currentImageIndex < filteredItems.length - 1 ? currentImageIndex + 1 : 0;
        
        [prevIndex, nextIndex].forEach(index => {
            const item = filteredItems[index];
            if (item) {
                const img = new Image();
                img.src = item.dataset.src;
            }
        });
    }
    
    // ===== LOAD MORE =====
    function loadMoreImages() {
        // Simulate loading more images (replace with actual API call)
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Carregando...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // Add more images to gallery (this would be dynamic in real implementation)
            const newImages = generateMoreImages();
            galleryGrid.insertAdjacentHTML('beforeend', newImages);
            
            // Update gallery items array
            galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
            updateFilteredItems();
            
            // Setup new event listeners
            const newItems = galleryGrid.querySelectorAll('.gallery-item:not([data-initialized])');
            newItems.forEach((item, index) => {
                item.dataset.initialized = 'true';
                const globalIndex = galleryItems.indexOf(item);
                item.addEventListener('click', () => openModal(globalIndex));
                
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 100);
            });
            
            // Reset button
            loadMoreBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Carregar Mais Fotos';
            loadMoreBtn.disabled = false;
            
            showNotification('Novas fotos carregadas!', 'success');
        }, 1500);
    }
    
    function generateMoreImages() {
        // This would be replaced with actual API data
        const categories = ['cultos', 'eventos', 'batismos', 'infantil', 'conferencias'];
        let html = '';
        
        for (let i = 1; i <= 6; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            html += `
                <div class="gallery-item" data-category="${category}" data-src="img/gallery/${category}${i + 10}.jpg" style="opacity: 0; transform: scale(0.8);">
                    <img src="img/gallery/thumbs/${category}${i + 10}.jpg" alt="Nova foto" loading="lazy">
                    <div class="gallery-overlay">
                        <h3>Nova Foto ${i + 10}</h3>
                        <p>Descrição da nova foto</p>
                        <i class="fas fa-expand-alt"></i>
                    </div>
                </div>
            `;
        }
        
        return html;
    }
    
    // ===== NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        // Use the existing notification system from main script
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Debounce resize events
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
    
    // Handle window resize
    const handleResize = debounce(() => {
        if (isModalOpen) {
            // Adjust modal layout if needed
            const modalImage = document.getElementById('modal-image');
            if (modalImage.src) {
                modalImage.style.maxHeight = '70vh';
            }
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // ===== INICIALIZAR =====
    init();
    
    // Expose some functions globally for external use
    window.galleryAPI = {
        openModal: openModal,
        closeModal: closeModal,
        filterImages: filterImages,
        currentFilter: () => currentFilter
    };
    
    console.log('🖼️ Galeria da 1ª IEQ Promissão carregada com sucesso!');
});