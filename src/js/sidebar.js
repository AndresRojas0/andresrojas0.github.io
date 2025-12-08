/* ============================================
   JavaScript del TOC Estilo Chirpy - CORREGIDO
   Mobile: Popup Modal
   Desktop: Panel Lateral Sticky
   ============================================ */

(function() {
    'use strict';

    // Constantes
    const SCROLL_LOCK = 'overflow-hidden';
    const CLOSING = 'closing';
    const ACTIVE_CLASS = 'active';

    // Variables globales
    let $tocBar, $soloTrigger, $popup, $btnClose, $popupContent, $tocWrapper;

    /**
     * Inicializa las referencias a elementos del DOM
     */
    function initDOMElements() {
        $tocBar = document.getElementById('toc-bar');
        $soloTrigger = document.getElementById('toc-solo-trigger');
        $popup = document.getElementById('toc-popup');
        $btnClose = document.getElementById('toc-popup-close');
        $popupContent = document.getElementById('toc-popup-content');
        $tocWrapper = document.getElementById('toc-wrapper');

        console.log('DOM Elements initialized:', {
            tocBar: !!$tocBar,
            soloTrigger: !!$soloTrigger,
            popup: !!$popup,
            btnClose: !!$btnClose,
            popupContent: !!$popupContent,
            tocWrapper: !!$tocWrapper
        });
    }

    /**
     * Genera el índice automáticamente desde los encabezados del artículo
     */
    function generateTableOfContents() {
        console.log('Generating table of contents...');
        
        const article = document.querySelector('article');
        if (!article) {
            console.warn('No article element found');
            return;
        }

        // Buscar h2 y h3 dentro del artículo (excluyendo el h1 del título)
        const headings = article.querySelectorAll('h2, h3, h4');
        console.log('Found headings:', headings.length);

        if (headings.length === 0) {
            console.warn('No headings found, hiding TOC');
            // Si no hay encabezados, ocultar TOC
            if ($tocBar) $tocBar.style.display = 'none';
            if ($soloTrigger) $soloTrigger.style.display = 'none';
            if ($tocWrapper) $tocWrapper.style.display = 'none';
            return;
        }

        let tocHTML = '<ol>';
        let currentLevel = 2;
        let openLists = 1; // Contador de listas abiertas

        headings.forEach(function(heading, index) {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.textContent.trim();

            console.log(`Processing heading ${index}: ${heading.tagName} - "${text}"`);

            // Generar ID si no existe
            if (!heading.id) {
                const slug = text
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9\s]+/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/^-+|-+$/g, '');
                heading.id = slug || 'seccion-' + (index + 1);
            }

            // Manejar cambios de nivel
            if (level > currentLevel) {
                // Abrir nueva lista anidada
                tocHTML += '<ol>';
                openLists++;
            } else if (level < currentLevel) {
                // Cerrar listas hasta llegar al nivel correcto
                while (currentLevel > level && openLists > 1) {
                    tocHTML += '</li></ol>';
                    openLists--;
                    currentLevel--;
                }
                tocHTML += '</li>';
            } else if (index > 0) {
                // Mismo nivel, cerrar item anterior
                tocHTML += '</li>';
            }

            // Agregar el item actual
            tocHTML += '<li><a href="#' + heading.id + '">' + text + '</a>';
            currentLevel = level;
        });

        // Cerrar todas las listas abiertas
        while (openLists > 0) {
            tocHTML += '</li></ol>';
            openLists--;
        }

        console.log('Generated TOC HTML:', tocHTML.substring(0, 200) + '...');

        // Insertar en popup (mobile)
        if ($popupContent) {
            $popupContent.innerHTML = tocHTML;
            console.log('TOC inserted in popup');
        }

        // Insertar en panel lateral (desktop)
        if ($tocWrapper) {
            let nav = $tocWrapper.querySelector('nav');
            if (!nav) {
                nav = document.createElement('nav');
                $tocWrapper.appendChild(nav);
            }
            nav.innerHTML = tocHTML;
            console.log('TOC inserted in sidebar');
        }
    }

    /**
     * Inicializa el botón flotante con IntersectionObserver
     */
    function initFloatingButton() {
        if (!$tocBar || !$soloTrigger) {
            console.warn('Cannot init floating button: missing elements');
            return;
        }

        const observer = new IntersectionObserver(
            function(entries) {
                entries.forEach(function(entry) {
                    $tocBar.classList.toggle('invisible', entry.isIntersecting);
                });
            },
            { rootMargin: '-48px 0px 0px 0px' }
        );

        observer.observe($soloTrigger);
        console.log('Floating button initialized');
    }

    /**
     * Muestra el popup modal
     */
    function showPopup() {
        if (!$popup) return;

        console.log('Opening popup');
        lockScroll(true);
        $popup.showModal();

        // Scroll al elemento activo
        const activeItem = $popup.querySelector('a.' + ACTIVE_CLASS);
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'center' });
        }
    }

    /**
     * Oculta el popup modal con animación
     */
    function hidePopup() {
        if (!$popup) return;

        console.log('Closing popup');
        $popup.setAttribute(CLOSING, '');

        $popup.addEventListener(
            'animationend',
            function() {
                $popup.removeAttribute(CLOSING);
                $popup.close();
            },
            { once: true }
        );

        lockScroll(false);
    }

    /**
     * Bloquea/desbloquea el scroll del body
     */
    function lockScroll(enable) {
        document.documentElement.classList.toggle(SCROLL_LOCK, enable);
        document.body.classList.toggle(SCROLL_LOCK, enable);
    }

    /**
     * Maneja click en el backdrop del popup
     */
    function clickBackdrop(event) {
        if (!$popup || $popup.hasAttribute(CLOSING)) return;

        const rect = event.target.getBoundingClientRect();
        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) {
            hidePopup();
        }
    }

    /**
     * Implementa scroll spy usando Intersection Observer
     */
    function initScrollSpy() {
        const headings = document.querySelectorAll('article h2, article h3, article h4');
        const tocLinks = document.querySelectorAll(
            '#toc-popup-content a, #toc-wrapper a'
        );

        if (headings.length === 0 || tocLinks.length === 0) {
            console.warn('Cannot init scroll spy: no headings or links');
            return;
        }

        console.log('Initializing scroll spy with', headings.length, 'headings and', tocLinks.length, 'links');

        // Crear mapa de IDs a enlaces
        const linkMap = new Map();
        tocLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const id = href.substring(1);
                if (!linkMap.has(id)) {
                    linkMap.set(id, []);
                }
                linkMap.get(id).push(link);
            }
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
                        link.classList.remove(ACTIVE_CLASS);
                    });

                    // Agregar clase active a los enlaces correspondientes
                    const activeLinks = linkMap.get(id);
                    if (activeLinks) {
                        activeLinks.forEach(function(link) {
                            link.classList.add(ACTIVE_CLASS);
                        });
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

        console.log('Scroll spy initialized');
    }

    /**
     * Implementa smooth scroll para enlaces del índice
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll(
            '#toc-popup-content a, #toc-wrapper a'
        );

        console.log('Initializing smooth scroll for', links.length, 'links');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offset = 100;
                    const targetPosition = targetElement.getBoundingClientRect().top + 
                                         window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Actualizar URL
                    history.pushState(null, null, '#' + targetId);

                    // Cerrar popup si está abierto
                    if ($popup && $popup.open) {
                        hidePopup();
                    }
                }
            });
        });
    }

    /**
     * Inicializa los event listeners del popup
     */
    function initPopupListeners() {
        if (!$popup) {
            console.warn('Cannot init popup listeners: popup not found');
            return;
        }

        // Botones trigger
        const triggers = document.querySelectorAll('.toc-trigger');
        console.log('Found', triggers.length, 'trigger buttons');
        
        triggers.forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                showPopup();
            });
        });

        // Botón cerrar
        if ($btnClose) {
            $btnClose.addEventListener('click', function(e) {
                e.preventDefault();
                hidePopup();
            });
        }

        // Click en backdrop
        $popup.addEventListener('click', clickBackdrop);

        // ESC key
        $popup.addEventListener('cancel', function(e) {
            e.preventDefault();
            hidePopup();
        });

        console.log('Popup listeners initialized');
    }

    /**
     * Detecta el tamaño de pantalla y ajusta comportamiento
     */
    function handleResize() {
        // En desktop (≥1200px), asegurar que el popup esté cerrado
        if (window.innerWidth >= 1200) {
            if ($popup && $popup.open) {
                $popup.close();
                lockScroll(false);
            }
        }
    }

    /**
     * Inicializa todas las funcionalidades del TOC
     */
    function initTableOfContents() {
        console.log('=== Initializing Table of Contents ===');
        
        // Inicializar referencias al DOM
        initDOMElements();

        // Generar el índice
        generateTableOfContents();

        // Inicializar componentes mobile
        initFloatingButton();
        initPopupListeners();

        // Inicializar funcionalidades comunes
        initScrollSpy();
        initSmoothScroll();

        // Manejar resize
        window.addEventListener('resize', handleResize);
        handleResize();

        console.log('=== Table of Contents initialized ===');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTableOfContents);
    } else {
        initTableOfContents();
    }

})();
