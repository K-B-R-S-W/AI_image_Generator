import { ImageGenerator } from './pages/image-generator.js';
import { BackgroundRemover } from './pages/background-remover.js';

class App {
    constructor() {
        console.log('Initializing App...');
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
            }

            console.log('DOM is ready');

            // Get page container
            this.pageContainer = document.getElementById('page-container');
            if (!this.pageContainer) {
                throw new Error('Page container not found');
            }
            console.log('Page container found:', this.pageContainer);

            // Initialize page components
            this.pages = {
                'image-generator': new ImageGenerator(),
                'background-remover': new BackgroundRemover()
            };
            console.log('Pages initialized:', Object.keys(this.pages));

            this.currentPage = null;
            this.setupNavigation();
            
            // Initialize with image generator page
            console.log('Loading initial page...');
            this.navigateToPage('image-generator');

        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    setupNavigation() {
        try {
            // Setup navigation
            const navLinks = document.querySelectorAll('.nav-link');
            console.log('Found nav links:', navLinks.length);

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageName = link.dataset.page;
                    console.log('Navigation clicked:', pageName);
                    this.navigateToPage(pageName);

                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });

            // Handle mobile menu
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(menuToggle);

            menuToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('active');
            });

        } catch (error) {
            console.error('Error setting up navigation:', error);
        }
    }

    navigateToPage(pageName) {
        try {
            console.log('Navigating to page:', pageName);
            console.log('Current page:', this.currentPage);

            if (this.currentPage) {
                console.log('Clearing current page');
                this.pageContainer.innerHTML = '';
            }

            const page = this.pages[pageName];
            console.log('New page component:', page);

            if (page) {
                const element = page.getElement();
                console.log('Page element:', element);
                this.pageContainer.appendChild(element);
                this.currentPage = pageName;
                console.log('Page navigation complete');
            } else {
                console.error('Page not found:', pageName);
            }
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }
}

// Initialize the app
console.log('Starting app initialization...');
new App(); 