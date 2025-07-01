/**
 * Professional Smooth Scroll Implementation
 * Features:
 * - Customizable scroll duration and offset
 * - URL hash management
 * - Active link highlighting
 * - Easing functions
 * - Mobile-friendly
 */



const smoothScroll = {
  // Configuration
  config: {
    scrollOffset: 80,    // Space for fixed header
    scrollDuration: 800, // Animation duration in ms
    activeClass: 'nav-active', // Class for active links
    easing: 'easeInOutQuad' // Easing function
  },

  // Initialize the smooth scroll
  init() {
    this.links = document.querySelectorAll('a[href^="#"]');
    if (this.links.length === 0) return;

    this.setupEasing();
    this.addEventListeners();
    this.injectStyles();
    this.handleInitialHash();
  },

  // Set up easing functions
  setupEasing() {
    this.easingFunctions = {
      easeInOutQuad: (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      },
      easeOutQuad: (t, b, c, d) => -c *(t/=d)*(t-2) + b
    };
  },

  // Add event listeners to links
  addEventListeners() {
    this.links.forEach(link => {
      link.addEventListener('click', e => this.handleClick(e, link));
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => this.updateActiveLink());
  },

  // Handle click events
  handleClick(e, link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    this.scrollTo(target);
    this.updateUrl(link.getAttribute('href'));
    this.setActiveLink(link);
  },

  // Smooth scroll to element
  scrollTo(target) {
    const start = window.pageYOffset;
    const end = this.calculateScrollPosition(target);
    const distance = end - start;
    let startTime = null;

    const animateScroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / this.config.scrollDuration, 1);
      
      window.scrollTo(0, 
        this.easingFunctions[this.config.easing](
          progress * this.config.scrollDuration, 
          start, 
          distance, 
          this.config.scrollDuration
        )
      );

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  },

  // Calculate scroll position with offset
  calculateScrollPosition(target) {
    return target.getBoundingClientRect().top + 
           window.pageYOffset - 
           this.config.scrollOffset;
  },

  // Update URL without jumping
  updateUrl(hash) {
    if (history.pushState) {
      history.pushState(null, null, hash);
    } else {
      window.location.hash = hash;
    }
  },

  // Set active navigation link
  setActiveLink(activeLink) {
    this.links.forEach(link => {
      link.classList.remove(this.config.activeClass);
    });
    activeLink.classList.add(this.config.activeClass);
  },

  // Update active link based on scroll position
  updateActiveLink() {
    const scrollPosition = window.scrollY + this.config.scrollOffset;
    
    this.links.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      
      const targetTop = target.offsetTop;
      const targetBottom = targetTop + target.offsetHeight;
      
      if (scrollPosition >= targetTop && scrollPosition < targetBottom) {
        this.setActiveLink(link);
      }
    });
  },

  // Handle initial page load with hash
  handleInitialHash() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          this.scrollTo(target);
        }, 100);
      }
    }
  },

  // Inject necessary styles
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .${this.config.activeClass} {
        font-weight: bold;
        color: #2874a6 !important;
        background: rgba(255,255,255,0.2);
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => smoothScroll.init());

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = smoothScroll;
}