// GSAP Animations
function initAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initial page load animations
    const tl = gsap.timeline();
    
    tl.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    })
    .from('.hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power4.out'
    }, '-=0.5')
    .from('.social-links a', {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=1');

    // Scroll-triggered animations
    
    // About section
    gsap.from('.about-text .lead', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1
    });

    gsap.from('.stat', {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2
    });

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Skills animation with stagger
    const skillsTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.skills-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    skillsTimeline.from('.skill-item', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: {
            each: 0.1,
            grid: [3, 4],
            from: "center"
        }
    });

    // Projects animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: i * 0.2
        });
    });

    // Tech stack tags animation
    gsap.utils.toArray('.tech-stack span').forEach((tag, i) => {
        gsap.from(tag, {
            scrollTrigger: {
                trigger: tag,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            delay: i * 0.1
        });
    });

    // Contact form animation
    const contactTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    contactTimeline
        .from('.contact-content', {
            opacity: 0,
            y: 50,
            duration: 1
        })
        .from('.form-group', {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8
        }, '-=0.5');

    // Register ScrollToPlugin
    gsap.registerPlugin(ScrollToPlugin);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#') {
                // Immediately update active state for instant feedback
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === target);
                });

                // Get target element and calculate scroll position
                const targetElement = document.querySelector(target);
                if (targetElement) {
                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Use native smooth scroll for better performance
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

export { initAnimations };