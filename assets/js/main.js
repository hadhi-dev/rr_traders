/* RR Traders — Custom Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initProductFilters();
  initQuoteModal();
  initStatsCounter();
});

/* 1. Navbar Interactive Effects */
function initNavbar() {
  const header = document.querySelector('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  // Change nav styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* 2. Scroll Reveal Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.15 // trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if observer not supported
    animatedElements.forEach(element => element.classList.add('visible'));
  }
}

/* 3. Product Sorting & Filtering */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      // Animate grid sorting
      productCards.forEach(card => {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        
        if (filterValue === 'all' || card.getAttribute('data-cat') === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* 4. Quote Modal Handler & WhatsApp Integration */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('modalClose');
  const quoteTriggerBtns = document.querySelectorAll('.trigger-quote-modal');
  const modalForm = document.getElementById('modalForm');
  const productSelect = document.getElementById('modalProductSelect');

  // Open modal functions
  function openModal(preselectedProduct = '') {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scroll

    if (preselectedProduct && productSelect) {
      // Set select option matching product name or category
      productSelect.value = preselectedProduct;
    }
  }

  // Close modal functions
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // restore scroll
    if (modalForm) modalForm.reset();
  }

  // Bind trigger buttons (like product cards CTAs)
  quoteTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Get associated product name if button is inside a product card
      const productCard = btn.closest('.product-card');
      let prodName = '';
      if (productCard) {
        prodName = productCard.querySelector('.product-name').textContent;
      }
      openModal(prodName);
    });
  });

  // Bind close events
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const company = document.getElementById('modalCompany').value.trim();
      const category = document.getElementById('modalProductSelect').value;
      const qty = document.getElementById('modalQty').value.trim();
      const details = document.getElementById('modalDetails').value.trim();

      if (!name || !phone) {
        alert('Please fill out your Name and WhatsApp/Phone Number.');
        return;
      }

      // Construct WhatsApp message
      let waMessage = `*RR Traders — Quote Enquiry*\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `👤 *Client Name:* ${name}\n`;
      waMessage += `📞 *WhatsApp:* ${phone}\n`;
      if (company) waMessage += `🏢 *Company:* ${company}\n`;
      waMessage += `📦 *Product Selected:* ${category || 'General Enquiry'}\n`;
      if (qty) waMessage += `🔢 *Required Qty:* ${qty}\n`;
      if (details) {
        waMessage += `\n💬 *Requirements / Details:*\n${details}\n`;
      }
      waMessage += `━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `_Sent from RR Traders Web Portal_`;

      const encodedMsg = encodeURIComponent(waMessage);
      const whatsappURL = `https://wa.me/919095128786?text=${encodedMsg}`;
      
      // Open in WhatsApp and close modal
      window.open(whatsappURL, '_blank');
      closeModal();
    });
  }
}

/* 5. Statistics Count Up Animation */
function initStatsCounter() {
  const countElements = document.querySelectorAll('.count-up');
  if (countElements.length === 0) return;

  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // Duration of animation in ms
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const rate = Math.min(progress / duration, 1);
      
      // Easing out quadratic function (starts fast, slows down)
      const easeOutQuad = rate * (2 - rate);
      const currentValue = Math.floor(easeOutQuad * target);
      
      // Formatting thousands with commas (e.g. 5,000)
      if (currentValue >= 1000) {
        element.textContent = currentValue.toLocaleString('en-IN');
      } else {
        element.textContent = currentValue;
      }

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target >= 1000 ? target.toLocaleString('en-IN') : target;
      }
    };

    window.requestAnimationFrame(step);
  };

  // Trigger when stats section enters viewport
  const statsSection = document.getElementById('statsSection');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countElements.forEach(el => animateCount(el));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  } else {
    // Fallback
    countElements.forEach(el => {
      const target = el.getAttribute('data-target');
      el.textContent = parseInt(target, 10).toLocaleString('en-IN');
    });
  }
}
