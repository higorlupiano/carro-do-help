/**
 * Shared JavaScript Logic for NFC-e Tools
 * Handles Navigation & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    highlightActivePage();
});

function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            // Toggle 'items-center' or a 'show' class?
            // In CSS we check for .active on nav-links
            navLinks.classList.toggle('active');

            // Toggle Icon (Hamburger to X) if needed
            const icon = toggleBtn.querySelector('i'); // Assuming FontAwesome or similar, or just text
            if (icon) {
                // Logic to switch icon if we were using icons
            }
        });
    }
}

function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Simple check: if the link href is in the current url
        // or if it's the root index
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}
