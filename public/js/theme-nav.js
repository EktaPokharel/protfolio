

// Theme colors configuration
const themeConfig = {
    light: {
        themeColor: '#74b9ff',
        background: '#ffffff'
    },
    dark: {
        themeColor: '#1a1a1a',
        background: '#121212'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle?.querySelector('ion-icon');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Theme Toggle Setup
    if (themeToggle && themeIcon) {
        // Set initial icon state
        themeIcon.setAttribute('name', 'moon-outline');

        // Check system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        setTheme(savedTheme);

        // Theme Toggle Setup
        if (themeToggle && themeIcon) {
            // Set initial icon state
            themeIcon.setAttribute('name', 'moon-outline');

            // Check system preference
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            // Check for saved theme preference or use system preference
            const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
            setTheme(savedTheme);        // Theme toggle click handler
            themeToggle.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
            });

            // Handle system theme changes
            prefersDarkScheme.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Theme functions

        function setTheme(theme) {
            // Update HTML and localStorage
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            // Update theme colors
            const colors = themeConfig[theme];

            // Update theme-color meta tags
            document.querySelector('meta[name="theme-color"]')?.remove();
            const metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            metaThemeColor.content = colors.themeColor;
            document.head.appendChild(metaThemeColor);

            // Update manifest theme colors
            fetch('favicon/site.webmanifest')
                .then(response => response.json())
                .then(data => {
                    data.theme_color = colors.themeColor;
                    data.background_color = colors.background;
                    return data;
                })
                .catch(console.error);

            // Update body color scheme
            document.body.style.setProperty('color-scheme', theme);

            // Update icon
            updateThemeIcon(theme);
        }

        function updateThemeIcon(theme) {
            if (themeIcon) {
                themeIcon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
            }
        }

        // Mobile Navigation Setup
        function setupMobileNavigation() {
            if (!mobileNavToggle || !navLinksContainer) return;

            // Function to close mobile menu
            function closeMobileMenu() {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                navLinksContainer.classList.remove('active');
                const icon = mobileNavToggle.querySelector('ion-icon');
                if (icon) {
                    icon.setAttribute('name', 'menu-outline');
                }
            }

            // Mobile menu toggle
            mobileNavToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
                mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
                navLinksContainer.classList.toggle('active');

                // Toggle icon
                const icon = mobileNavToggle.querySelector('ion-icon');
                if (icon) {
                    icon.setAttribute('name', isExpanded ? 'menu-outline' : 'close-outline');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinksContainer.contains(e.target) &&
                    !mobileNavToggle.contains(e.target) &&
                    navLinksContainer.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Close menu when clicking nav links
            navLinksContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    closeMobileMenu();
                    // Add smooth scroll if needed
                    const targetId = e.target.getAttribute('href');
                    if (targetId.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });

            // Handle navigation clicks
            navLinksContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    // Immediate UI feedback
                    const activeLink = document.querySelector('.nav-link.active');
                    if (activeLink) activeLink.classList.remove('active');
                    e.target.classList.add('active');

                    // Close mobile menu
                    navLinksContainer.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileNavToggle.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'menu-outline');
                    }
                }
            });
        }

        // Initialize mobile navigation
        setupMobileNavigation();

        // Active link highlighting with Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px',
            threshold: [0, 0.25],
            trackVisibility: true,
            delay: 100 // Debounce time in milliseconds
        };

        const navLinks = document.querySelectorAll('.nav-link');
        let currentSections = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (entry.isIntersecting) {
                    currentSections.add(id);
                } else {
                    currentSections.delete(id);
                }
            });

            // If at top of page and no sections are intersecting, highlight home
            if (window.scrollY < 50) {
                updateActiveLink('home');
            } else {
                // Get the first visible section
                const visibleSection = Array.from(currentSections)[0];
                if (visibleSection) {
                    updateActiveLink(visibleSection);
                }
            }
        }, observerOptions);

        function updateActiveLink(id) {
            requestAnimationFrame(() => {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            });
        }

        // Observe all sections for scroll spy
        document.querySelectorAll('section').forEach(section => {
            if (section.id) { // Only observe sections with IDs
                observer.observe(section);
            }
        });
    };

})