/**
 * Premium Portfolio Template - JavaScript
 * Elegant motion, smooth scroll, and interaction handling
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const config = {
        loadingDuration: 2000,
        cursorSize: 12,
        revealThreshold: 0.15,
        parallaxSpeed: 0.08,
        staggerDelay: 100
    };

    const projectLoaderPromise = import(new URL('project-loader.js', document.currentScript.src).href);

    // ========================================
    // LOADING SCREEN
    // ========================================
    function initLoadingScreen() {
        const counter = document.getElementById('counterNumber');
        const loadingScreen = document.getElementById('loadingScreen');
        const shouldSkipLoading = window.location.hash === '#projects' && sessionStorage.getItem('returnToProjects') === 'true';

        if (shouldSkipLoading) {
            sessionStorage.removeItem('returnToProjects');
            loadingScreen.classList.add('loaded');
            counter.textContent = 100;
            initHeroReveal();
            return;
        }

        let count = 0;
        const duration = config.loadingDuration;
        const interval = 20;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            count += increment;
            if (count >= 100) {
                count = 100;
                clearInterval(timer);
                
                setTimeout(() => {
                    loadingScreen.classList.add('loaded');
                    initHeroReveal();
                }, 300);
            }
            counter.textContent = Math.floor(count);
        }, interval);
    }

    // ========================================
    // HERO TEXT REVEAL
    // ========================================
    function initHeroReveal() {
        const lines = document.querySelectorAll('.hero__line');
        const subtitle = document.querySelector('.hero__subtitle');

        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('revealed');
            }, index * 200);
        });

        setTimeout(() => {
            if (subtitle) {
                subtitle.classList.add('revealed');
            }
        }, lines.length * 200 + 300);
    }

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    function initCustomCursor() {
        const cursor = document.getElementById('cursor');
        
        // Only enable on non-touch devices
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursor.classList.contains('visible')) {
                cursor.classList.add('visible');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
        });

        // Smooth cursor following
        function updateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }

        updateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('[data-hover]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    }

    // ========================================
    // NAVIGATION VISIBILITY
    // ========================================
    function initNavigation() {
        const navigation = document.getElementById('navigation');
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavigation() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    navigation.classList.add('hidden');
                } else {
                    navigation.classList.remove('hidden');
                }
            } else {
                navigation.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.project-card, .timeline-item, .reveal-on-scroll'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: config.revealThreshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el, index) => {
            // Add stagger delay for project cards
            if (el.classList.contains('project-card')) {
                el.style.transitionDelay = `${(index % 6) * config.staggerDelay}ms`;
            }
            observer.observe(el);
        });
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || config.parallaxSpeed;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const offsetTop = targetElement.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // PROJECT CARD INTERACTIONS
    // ========================================
    function initProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId || card.dataset.id;
                window.location.href = `project.html?slug=${projectId}`;
            });
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    }

async function initializeApp() {

    initLoadingScreen();
    initCustomCursor();
    initNavigation();
    initParallax();
    initSmoothScroll();
    // أولاً أنشئ الـ Cards
    renderProjects();

    if (window.location.hash === '#projects') {
        const projectsSection = document.getElementById('projects');

        if (projectsSection) {
            window.scrollTo({
                top: projectsSection.offsetTop - 100,
                behavior: 'auto'
            });
        }
    }

    // بعد ما اتعملوا اربط الأحداث عليهم
    initProjectCards();

    // وبعدها فعل الـ Reveal عليهم
    initScrollReveal();

}
// ========================================
// LOAD PROJECTS
// ========================================

function renderProjects() {

    const grid = document.getElementById("projectsGrid");

    if (!grid) return;

    const homepageProjects = [
        { folder: "basata", width: 941, height: 1672 },
        { folder: "velox", width: 1440, height: 810 },
        { folder: "nexora", width: 1920, height: 1080 },
        { folder: "nexora-app", width: 375, height: 888 },
        { folder: "vexa", width: 842, height: 596 },
        { folder: "vampirs", width: 1254, height: 1254 },
        { folder: "pretty-lady", width: 1024, height: 1024 },
        { folder: "brgr", width: 2048, height: 1536 },
        { folder: "red-bull", width: 1241, height: 1268 }
    ];

    grid.innerHTML = homepageProjects.map(({ folder }) => `

        <article class="project-card" data-id="${folder}" data-hover aria-busy="true">

            <div class="project-card__image-wrapper">
                <div class="placeholder-pattern"></div>
            </div>

            <div class="project-card__info">
                <span class="project-card__category">&nbsp;</span>
                <h3 class="project-card__title">&nbsp;</h3>
                <p class="project-card__statement">&nbsp;</p>
            </div>

        </article>

    `).join("");

    projectLoaderPromise.then(({ loadProject }) => {
        const renderProjectCard = (project, index, folder) => {
            if (!project) return;

            const card = grid.querySelector(`[data-id="${folder}"]`);

            if (!card) return;

            card.removeAttribute("aria-busy");
            card.innerHTML = `

                <div class="project-card__image-wrapper">

                    <img
                        src="${project.coverImage}"
                        alt="${project.title} ${project.category} project cover"
                        width="${homepageProjects[index].width}"
                        height="${homepageProjects[index].height}"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                        decoding="async"
                        class="project-card__image">

                </div>

                <div class="project-card__info">

                    <span class="project-card__category">
                        ${project.category}
                    </span>

                    <h3 class="project-card__title">
                        ${project.title}
                    </h3>

                    <p class="project-card__statement">
                        ${project.summary}
                    </p>

                </div>

            `;
        };

        loadProject(homepageProjects[0].folder)
            .then(project => renderProjectCard(project, 0, homepageProjects[0].folder));

        homepageProjects.slice(1).forEach(({ folder }, index) => {
            loadProject(folder).then(project => renderProjectCard(project, index + 1, folder));
        });
    });

}


    // Start the application
    init();

})();
