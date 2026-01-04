document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    // --- Page Routing (hash-based, dynamic fetch) ---
    async function loadPage(pageId) {
        // Map hash fragments to file names
        const pageMap = {
            overview: 'home',
            home: 'home',
            engage: 'home',
            about: 'about',
            approach: 'approach',
            services: 'services',
            services2: 'services',
            capabilities: 'capabilities',
            work: 'work',
            'success-stories': 'work',
            insights: 'insights',
            careers: 'careers',
            contact: 'contact'
        };
        
        const pageFile = pageMap[pageId] || pageMap['home'];
        const validPageId = Object.keys(pageMap).find(key => pageMap[key] === pageFile) || 'home';

        try {
            const response = await fetch(`pages/${pageFile}.html`);
            if (!response.ok) throw new Error('Page not found');
            const content = await response.text();
            
              mainContent.innerHTML = content;
              enhanceDynamicContent();
                        if (pageId === 'engage') {
                            const engageSection = document.getElementById('engage');
                            if (engageSection) {
                                engageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else if (window.location.hash !== '#contact') {
                             window.scrollTo({ top: 0, behavior: 'instant' });
                        }
            updateActiveNav(validPageId);

        } catch (error) {
            console.error('Error loading page:', error);
            if (validPageId !== 'home') {
                loadPage('home'); // Fallback to home page on error
            } else {
                 mainContent.innerHTML = `<p class="text-center py-20">Error: Could not load content.</p>`;
            }
        }
    }

    function updateActiveNav(pageId) {
        navLinks.forEach(link => {
            const target = link.getAttribute('href').substring(1);
            link.classList.toggle('active', target === pageId);
        });
    }

    function handleHashChange() {
        // We do NOT want to load a page if the hash is #contact
        const hash = window.location.hash.substring(1);
        if (hash === 'contact') return; // Do nothing if it's the contact hash
        
        loadPage(hash || 'home');
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load


    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobile-menu');

    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        menuBtn?.setAttribute('aria-expanded', 'false');
    };

    const toggleMobileMenu = () => {
        if (!menuBtn || !mobileMenu) return;
        const shouldOpen = !mobileMenu.classList.contains('is-open');
        mobileMenu.classList.toggle('is-open', shouldOpen);
        menuBtn.setAttribute('aria-expanded', String(shouldOpen));
    };

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', toggleMobileMenu);

        mobileMenu.addEventListener('click', e => {
            if (e.target.matches('a.nav-link')) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        });
    }

    // --- Dynamic content enhancers (forms, anchor helpers) ---
    let carouselCleanupFns = [];

    function hashString(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i += 1) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function assignCardBackgrounds() {
        const cards = Array.from(document.querySelectorAll('.card'));
        if (!cards.length) return;

        const rootStyles = window.getComputedStyle(document.documentElement);
        const poolSize = Number.parseInt(rootStyles.getPropertyValue('--card-bg-pool-size') || '30', 10) || 30;

        const positions = [
            'center',
            'center 35%',
            'center 65%',
            'left center',
            'right center',
            'top center',
            'bottom center'
        ];

        cards.forEach((card, index) => {
            // Respect per-card overrides (inline styles set via HTML).
            if (card.style.getPropertyValue('--card-bg')) return;

            const seedText = `${card.textContent || ''}`.replace(/\s+/g, ' ').trim();
            const baseSeed = seedText ? hashString(seedText) : (index + 1);
            const seed = baseSeed + (index + 1) * 97;
            const chosen = (seed % poolSize) + 1;

            const pos = positions[seed % positions.length];

            card.style.setProperty('--card-bg', `var(--card-bg-${chosen})`);
            card.style.setProperty('--card-bg-pos', pos);
        });
    }

    function enhanceDynamicContent() {
        wireMockForm('asset-download-form', 'assetSubmit', 'assetStatus', 'Checklist is on its way.');
        wireMockForm('insight-form', 'insightSubmit', 'insightStatus', 'Report sent to your inbox.');
        wireMockForm('insights-newsletter-form', 'insightsNewsletterSubmit', 'insightsNewsletterStatus', 'Subscribed. Welcome to the Signal.');
        wireMockForm('engage-form', 'engageSubmit', 'engageStatus', 'We will reach out within 1 business day.');
        wireMockForm('qualified-contact-form', 'qualifiedContactSubmit', 'qualifiedContactStatus', 'We received your inquiry. A specialist will respond shortly.');
        focusAssetButtons();
        assignCardBackgrounds();
        initCarousels();
    }

    function initCarousels() {
        // Clean up any previous page's carousels (because content is replaced via fetch)
        if (carouselCleanupFns.length) {
            carouselCleanupFns.forEach(fn => {
                try { fn(); } catch (_) { /* noop */ }
            });
            carouselCleanupFns = [];
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
        const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
        if (!carousels.length) return;

        carousels.forEach(carouselEl => {
            const slides = Array.from(carouselEl.querySelectorAll('.carousel-slide'));
            if (slides.length <= 1) return;

            let activeIndex = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
            if (activeIndex === -1) activeIndex = 0;

            const setActive = (nextIndex) => {
                slides[activeIndex]?.classList.remove('is-active');
                activeIndex = (nextIndex + slides.length) % slides.length;
                slides[activeIndex]?.classList.add('is-active');
            };

            const prevBtn = carouselEl.querySelector('[data-carousel-prev]');
            const nextBtn = carouselEl.querySelector('[data-carousel-next]');

            const onPrev = () => setActive(activeIndex - 1);
            const onNext = () => setActive(activeIndex + 1);

            prevBtn?.addEventListener('click', onPrev);
            nextBtn?.addEventListener('click', onNext);

            let timerId = null;
            const autoplayEnabled = carouselEl.getAttribute('data-autoplay') !== 'false';
            const interval = Number(carouselEl.getAttribute('data-interval') || 6000);

            const start = () => {
                if (prefersReducedMotion) return;
                if (!autoplayEnabled) return;
                if (timerId) return;
                timerId = window.setInterval(() => setActive(activeIndex + 1), Math.max(2500, interval));
            };

            const stop = () => {
                if (!timerId) return;
                window.clearInterval(timerId);
                timerId = null;
            };

            // Pause autoplay on hover/focus for control
            carouselEl.addEventListener('mouseenter', stop);
            carouselEl.addEventListener('mouseleave', start);
            carouselEl.addEventListener('focusin', stop);
            carouselEl.addEventListener('focusout', start);

            start();

            carouselCleanupFns.push(() => {
                stop();
                prevBtn?.removeEventListener('click', onPrev);
                nextBtn?.removeEventListener('click', onNext);
                carouselEl.removeEventListener('mouseenter', stop);
                carouselEl.removeEventListener('mouseleave', start);
                carouselEl.removeEventListener('focusin', stop);
                carouselEl.removeEventListener('focusout', start);
            });
        });
    }


    function wireMockForm(formId, submitId, statusId, successCopy) {
        const form = document.getElementById(formId);
        if (!form) return;
        const submitBtn = submitId ? document.getElementById(submitId) : form.querySelector('button[type="submit"]');
        const statusEl = statusId ? document.getElementById(statusId) : form.querySelector('.form-status');

        form.addEventListener('submit', event => {
            event.preventDefault();
            if (!form.reportValidity()) return;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            if (statusEl) statusEl.textContent = '';

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = 'Sent ✓';
                }
                if (statusEl) {
                    statusEl.textContent = successCopy || 'Thanks!';
                }

                setTimeout(() => {
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = submitBtn.dataset.defaultLabel || 'Submit';
                    }
                    if (statusEl) statusEl.textContent = '';
                }, 1600);
            }, 1200);
        });

        if (submitBtn && !submitBtn.dataset.defaultLabel) {
            submitBtn.dataset.defaultLabel = submitBtn.textContent;
        }
    }

    function focusAssetButtons() {
        const buttons = document.querySelectorAll('[data-open-asset]');
        if (!buttons.length) return;
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const form = document.getElementById('asset-download-form');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const firstInput = form.querySelector('input');
                    if (firstInput) {
                        setTimeout(() => firstInput.focus({ preventScroll: true }), 400);
                    }
                } else {
                    window.location.hash = '#home';
                }
            });
        });
    }

    // --- NEW: Contact Modal Logic ---
    const contactOverlay = document.getElementById('contact-overlay');
    const closeBtn = document.getElementById('modal-close-btn');

    function openModal() {
        if (contactOverlay) {
            contactOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    function closeModal() {
        if (contactOverlay) {
            contactOverlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable background scrolling
        }
    }

    // Close modal listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (contactOverlay) {
        contactOverlay.addEventListener('click', (e) => {
            // Close only if clicked on overlay background, not the modal content
            if (e.target === contactOverlay) {
                closeModal();
            }
        });
         // Close on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactOverlay.style.display === 'block') {
                closeModal();
            }
        });
    }

    // --- NEW: Global Click Handler for Contact Links ---
    document.body.addEventListener('click', (e) => {
        // Check if the clicked element (or its parent) is a link to #contact
        const contactLink = e.target.closest('a[href="#contact"]');
        
        if (contactLink) {
            e.preventDefault(); // Stop the browser from changing the hash
            openModal();
            
            // If in mobile menu, also close the menu
            if (mobileMenu && mobileMenu.contains(contactLink)) {
                closeMobileMenu();
            }
        }
    });


    // --- MODIFIED: Contact Form (mock submission) ---
    const contactForm = document.getElementById('modal-contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('modal-contactSubmit');
        const statusEl = document.getElementById('modal-formStatus');

        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!contactForm.reportValidity()) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusEl.textContent = '';

            setTimeout(() => {
                submitBtn.textContent = 'Sent ✓';
                statusEl.textContent = 'We received your inquiry. A specialist will respond shortly.';
                // IMPORTANT: Do NOT reset the form immediately, let the user see the success message
                
                setTimeout(() => {
                    contactForm.reset();
                    closeModal(); // Close the modal after success
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Inquiry';
                    statusEl.textContent = '';
                }, 1500); // Wait 1.5s after success message to close
            }, 1300);
        });
    }
});