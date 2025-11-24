/* ============================================
   JavaScript del Sidebar Híbrido
   Mobile: Índice plegable superior
   Desktop: Sidebar flotante lateral
   ============================================ */

(function() {
    'use strict';

    /**
     * Genera automáticamente el índice desde los h2 y h3 del artículo
     */
    function generateTableOfContents() {
        const article = document.querySelector('article');
        const tocContainer = document.querySelector('.table-of-contents-content nav');
        
        if (!article || !tocContainer) return;
        
        // Seleccionar h2 y h3 dentro del artículo
        const headings = article.querySelectorAll('h2, h3');
        
        if (headings.length === 0) {
            // Si no hay encabezados, ocultar el sidebar
            const toc = document.querySelector('.table-of-contents');
            if (toc) toc.style.display = 'none';
            return;
        }
        
        let tocHTML = '<ol>';
        let currentLevel = 2;
        
        headings.forEach(function(heading, index) {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent;
            
            // Generar ID si no existe
            if (!heading.id) {
                const slug = text
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                heading.id = slug || 'seccion-' + (index + 1);
            }
            
            // Manejar cambios de nivel
            if (level > currentLevel) {
                tocHTML += '<ol>';
            } else if (level < currentLevel) {
                tocHTML += '</li></ol></li>';
            } else if (index > 0) {
                tocHTML += '</li>';
            }
            
            tocHTML += '<li><a href="#' + heading.id + '">' + text + '</a>';
            currentLevel = level;
        });
        
        // Cerrar listas abiertas
        while (currentLevel >= 2) {
            tocHTML += currentLevel === 2 ? '</li></ol>' : '</ol></li>';
            currentLevel--;
        }
        
        tocContainer.innerHTML = tocHTML;
    }

    /**
     * Inicializa funcionalidad de colapsar/expandir (mobile)
     */
    function initCollapsible() {
        const toc = document.querySelector('.table-of-contents');
        const header = document.querySelector('.table-of-contents-header');
        
        if (!toc || !header) return;
        
        // Click en el header para toggle
        header.addEventListener('click', function() {
            toc.classList.toggle('collapsed');
            
            // Guardar estado en localStorage
            const isCollapsed = toc.classList.contains('collapsed');
            localStorage.setItem('tocCollapsed', isCollapsed);
        });
        
        // Restaurar estado desde localStorage
        const savedState = localStorage.getItem('tocCollapsed');
        if (savedState === 'true') {
            toc.classList.add('collapsed');
        }
        
        // Auto-colapsar después de hacer clic en un enlace (solo en mobile)
        const links = toc.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                // Solo auto-colapsar en mobile (<1200px)
                if (window.innerWidth < 1200) {
                    setTimeout(function() {
                        toc.classList.add('collapsed');
                        localStorage.setItem('tocCollapsed', 'true');
                    }, 300);
                }
            });
        });
    }

    /**
     * Implementa scroll spy usando Intersection Observer
     */
    function initScrollSpy() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        const headings = document.querySelectorAll('article h2, article h3');
        const tocLinks = toc.querySelectorAll('a');
        
        if (headings.length === 0 || tocLinks.length === 0) return;
        
        // Crear mapa de IDs a enlaces
        const linkMap = new Map();
        tocLinks.forEach(function(link) {
            const id = link.getAttribute('href').substring(1);
            linkMap.set(id, link);
        });
        
        // Configurar Intersection Observer
        const observerOptions = {
            rootMargin: '-100px 0px -66%',
            threshold: 0
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    
                    // Remover clase active de todos
                    tocLinks.forEach(function(link) {
                        link.classList.remove('active');
                    });
                    
                    // Agregar clase active al enlace correspondiente
                    const activeLink = linkMap.get(id);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        // Observar todos los encabezados
        headings.forEach(function(heading) {
            if (heading.id) {
                observer.observe(heading);
            }
        });
    }

    /**
     * Implementa smooth scroll para enlaces del índice
     */
    function initSmoothScroll() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        const links = toc.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 100;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL
                    history.pushState(null, null, '#' + targetId);
                }
            });
        });
    }

    /**
     * Oculta el sidebar si el artículo es muy corto
     */
    function hideIfTooShort(minHeadings) {
        minHeadings = minHeadings || 3;
        
        const headings = document.querySelectorAll('article h2, article h3');
        const toc = document.querySelector('.table-of-contents');
        
        if (headings.length < minHeadings && toc) {
            toc.style.display = 'none';
        }
    }

    /**
     * Ajusta el comportamiento según el tamaño de pantalla
     */
    function handleResize() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        // En desktop (≥1200px), siempre mostrar el contenido
        if (window.innerWidth >= 1200) {
            toc.classList.remove('collapsed');
        }
    }

    /**
     * Inicializa todas las funcionalidades del sidebar
     */
    function initTableOfContents() {
        // Solo inicializar si existe el sidebar
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        generateTableOfContents();
        initCollapsible();
        initScrollSpy();
        initSmoothScroll();
        hideIfTooShort(3);
        
        // Manejar resize
        window.addEventListener('resize', handleResize);
        handleResize();
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableOfContents);
    } else {
        initTableOfContents();
    }

})();