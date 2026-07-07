// ============================================================
// FOODIE — Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initCounters();
    initContactForm();
    initOrderButtons();
});

/* ------------------------------------------------------------
   Mobile nav toggle
------------------------------------------------------------ */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // close menu when a link is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // close menu on outside click
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInside && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

/* ------------------------------------------------------------
   Animated stat counters — run once, when the section scrolls
   into view
------------------------------------------------------------ */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10) || 0;

        if (prefersReducedMotion) {
            el.textContent = formatCount(target);
            return;
        }

        const duration = 1600; // ms
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out for a natural deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = formatCount(current);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = formatCount(target);
            }
        };

        requestAnimationFrame(tick);
    };

    const formatCount = (num) => num.toLocaleString('en-US');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));
}

/* ------------------------------------------------------------
   Contact form — lightweight client-side handling
   (no backend wired up, so this just gives the user feedback)
------------------------------------------------------------ */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // simulate a request — swap this for a real fetch() call
        // to your backend endpoint when one exists
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent ✓';

            setTimeout(() => {
                submitBtn.textContent = originalLabel;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 900);
    });
}

/* ------------------------------------------------------------
   "Order" buttons on menu cards — placeholder feedback
------------------------------------------------------------ */
function initOrderButtons() {
    const orderButtons = document.querySelectorAll('.food-card .price-row button');

    orderButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const dishName = btn.closest('.food-card').querySelector('h3').textContent;
            const original = btn.textContent;

            btn.textContent = 'Added ✓';

            setTimeout(() => {
                btn.textContent = original;
            }, 1200);

            // hook point: replace with real add-to-cart logic
            console.log(`Added "${dishName}" to cart`);
        });
    });
}