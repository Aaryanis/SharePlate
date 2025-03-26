import anime from 'animejs';

// Hero section animation
export const animateHero = () => {
  // Fade in and slide up animation for hero content
  anime({
    targets: '.hero-content .animated-element',
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(200, { start: 300 }),
    easing: 'easeOutQuad',
    duration: 800
  });

  // Fade in animation for hero image
  anime({
    targets: '.hero-image',
    opacity: [0, 1],
    translateX: [50, 0],
    delay: 500,
    easing: 'easeOutQuad',
    duration: 1000
  });
};

// Features section animation
export const animateFeatures = (inView) => {
  if (inView) {
    anime({
      targets: '.feature-card.animation-stagger',
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(150),
      easing: 'easeOutQuad',
      duration: 800
    });
  }
};

// Stats counter animation
export const animateStats = (inView) => {
  if (inView) {
    anime({
      targets: '.stat-number',
      innerHTML: (el) => {
        return [0, el.getAttribute('data-count')];
      },
      round: 1,
      easing: 'easeInOutQuad',
      duration: 2000
    });
  }
};

// Steps animation
export const animateSteps = (inView) => {
  if (inView) {
    anime({
      targets: '.step-card.animation-stagger',
      opacity: [0, 1],
      translateX: [-50, 0],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 800
    });
  }
};

// Testimonials animation
export const animateTestimonials = (inView) => {
  if (inView) {
    anime({
      targets: '.testimonial-card.animation-stagger',
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 800
    });
  }
};

// CTA section animation
export const animateCta = (inView) => {
  if (inView) {
    anime({
      targets: '.cta-section .animated-element',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(150),
      easing: 'easeOutQuad',
      duration: 800
    });
  }
};

// Food card animation for listings
export const animateFoodCards = () => {
  anime({
    targets: '.food-card.animation-stagger',
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(100),
    easing: 'easeOutQuad',
    duration: 800
  });
};

// Form sections animation
export const animateForm = () => {
  anime({
    targets: '.form-section.animated-element',
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(200),
    easing: 'easeOutQuad',
    duration: 800
  });
};

// Dashboard cards animation
export const animateDashboard = () => {
  anime({
    targets: '.dashboard-card.animation-stagger',
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(150),
    easing: 'easeOutQuad',
    duration: 800
  });
};

// Notification animation
export const animateNotification = (element) => {
  anime({
    targets: element,
    translateX: [50, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutQuad'
  });
};

// Page transition animation
export const pageTransitionIn = () => {
  return anime({
    targets: '.page-transition',
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutQuad',
    duration: 800
  }).finished;
};

export const pageTransitionOut = () => {
  return anime({
    targets: '.page-transition',
    opacity: [1, 0],
    translateY: [0, -20],
    easing: 'easeInQuad',
    duration: 500
  }).finished;
};