// Main JavaScript file
import BackgroundAnimation from './background.js';
import { initAnimations } from './animations.js';
import './theme-nav.js';

// Initialize Three.js background and animations
document.addEventListener('DOMContentLoaded', () => {
    // Wait for a frame to ensure DOM is ready
    requestAnimationFrame(() => {
        // Initialize background animation
        const backgroundAnim = new BackgroundAnimation();
        
        // Initialize GSAP animations
        initAnimations();
    });

    // Theme change handler
    const html = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');

    themeToggle.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        backgroundAnimation.updateTheme(isDark);
    });
});