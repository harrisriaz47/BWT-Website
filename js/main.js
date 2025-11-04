document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('main-content');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    // --- Page Routing (hash-based, dynamic fetch) ---
    async function loadPage(pageId) {
        // Map hash fragments to file names
        const pageMap = {
            'home': 'home.html',
            'about': 'about.html',
            'capabilities': 'capabilities.html',
            'approach': 'approach.html',
            'success-stories': 'success-stories.html',
            'insights': 'insights.html',
            'careers': 'careers.html'
        };

        const pageFile = pageMap[pageId] || pageMap['home'];
        const validPageId = Object.keys(pageMap).find(key => pageMap[key] === pageFile) || 'home';

        try {
            const response = await fetch(`pages/${pageFile}`);
            if (!response.ok) throw new Error('Page not found');
            const content = await response.text();
            
            mainContent.innerHTML = content;
            if (window.location.hash !== '#contact') {
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
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!isExpanded));
        mobileMenu.style.maxHeight = isExpanded ? null : `${mobileMenu.scrollHeight}px`;
    });

    mobileMenu.addEventListener('click', e => {
        if (e.target.matches('a.nav-link')) {
            mobileMenu.style.maxHeight = null;
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });

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
                mobileMenu.style.maxHeight = null;
                menuBtn.setAttribute('aria-expanded', 'false');
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