document.addEventListener('DOMContentLoaded', () => {
  const ADESH_EMAIL = 'adeshbhosale36@gmail.com';

  // 1. Dynamic Typewriter Effect for Hero
  const typeElement = document.querySelector('.typewriter-text');
  if (typeElement) {
    const words = JSON.parse(typeElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 85;
    const deleteSpeed = 45;
    const pauseTime = 1800;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typeElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = 400;
      }

      setTimeout(typeEffect, timeout);
    }

    setTimeout(typeEffect, 600);
  }

  // 2. High-Performance IntersectionObserver Active Section Tracker
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // 3. Toast Notification Utility
  const toastEl = document.getElementById('toastNotification');
  let toastTimeout;
  function showToast(message, duration = 3200) {
    if (!toastEl) return;
    toastEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> <span>${message}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // 4. Smooth Focus Contact / Email Form
  const formContainer = document.getElementById('formContainer');
  const nameInput = document.getElementById('name');
  const contactSection = document.getElementById('contact');

  function focusContactForm() {
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (formContainer) {
      formContainer.classList.remove('highlight-pulse');
      // Trigger reflow to restart CSS animation
      void formContainer.offsetWidth;
      formContainer.classList.add('highlight-pulse');
    }
    setTimeout(() => {
      if (nameInput) {
        nameInput.focus();
      }
    }, 450);
  }

  // Click on Direct Email tile -> focuses contact message form
  const emailContactTile = document.getElementById('emailContactTile');
  if (emailContactTile) {
    emailContactTile.addEventListener('click', (e) => {
      // If user clicked any of the action buttons inside, don't hijack focus
      if (e.target.closest('.tile-actions, .tile-action-btn')) return;
      e.preventDefault();
      focusContactForm();
    });

    emailContactTile.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.tile-actions, .tile-action-btn')) {
        e.preventDefault();
        focusContactForm();
      }
    });
  }

  // Click on navbar email link or hero 'Get In Touch'
  document.querySelectorAll('.nav-email-link, a[href="#contact"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Allow default smooth hash scrolling, plus highlight & focus the form
      setTimeout(focusContactForm, 100);
    });
  });

  // Copy email button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(ADESH_EMAIL);
        } else {
          const tempInput = document.createElement('input');
          tempInput.value = ADESH_EMAIL;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast(`Email copied: ${ADESH_EMAIL}`);
      } catch (err) {
        showToast(`Email: ${ADESH_EMAIL}`);
      }
    });
  }

  // 5. Contact Form Submission & Email Delivery
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const formDirectFallback = document.getElementById('formDirectFallback');
  const directGmailFallback = document.getElementById('directGmailFallback');
  const submitBtn = document.getElementById('submitBtn');

  function setFormAlert(type, htmlContent) {
    if (!formAlert) return;
    formAlert.className = `form-alert alert-${type}`;
    formAlert.innerHTML = htmlContent;
    formAlert.style.display = 'flex';
  }

  function clearFormAlert() {
    if (formAlert) {
      formAlert.style.display = 'none';
      formAlert.innerHTML = '';
    }
  }

  function updateGmailFallbackLink(name, email, message) {
    if (!directGmailFallback) return;
    const subject = encodeURIComponent(`Portfolio Message from ${name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Hello Adesh,\n\n${message || ''}\n\n---\nFrom: ${name || 'N/A'}\nEmail: ${email || 'N/A'}`
    );
    directGmailFallback.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADESH_EMAIL}&su=${subject}&body=${body}`;
    if (formDirectFallback) {
      formDirectFallback.style.display = 'flex';
    }
  }

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormAlert();

      const nameVal = (document.getElementById('name')?.value || '').trim();
      const emailVal = (document.getElementById('email')?.value || '').trim();
      const messageVal = (document.getElementById('message')?.value || '').trim();

      if (!nameVal || !emailVal || !messageVal) {
        setFormAlert(
          'warning',
          '<i class="fa-solid fa-triangle-exclamation"></i><div>Please fill in your name, email, and message.</div>'
        );
        return;
      }

      updateGmailFallbackLink(nameVal, emailVal, messageVal);

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span class="btn-text">Sending Message...</span>';
      submitBtn.disabled = true;

      // Handle local file:// protocol
      if (window.location.protocol === 'file:') {
        setFormAlert(
          'warning',
          `<i class="fa-solid fa-circle-info"></i>
           <div>
             <strong>Local Browser Mode:</strong> FormSubmit requires an active web server (or deployment on GitHub Pages / Vercel).<br />
             Click <strong>Open & Send via Gmail</strong> below to send your message to <strong>${ADESH_EMAIL}</strong> right away!
           </div>`
        );
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.disabled = false;
        return;
      }

      try {
        const formData = new FormData(contactForm);
        formData.set('_captcha', 'false');
        formData.set('_template', 'table');
        formData.set('_subject', `New Portfolio Message from ${nameVal}`);

        const response = await fetch(`https://formsubmit.co/ajax/${ADESH_EMAIL}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        let data = {};
        try {
          data = await response.json();
        } catch (jsonErr) {
          data = {};
        }

        const isSuccess = response.ok && (data.success === 'true' || data.success === true);

        if (isSuccess) {
          setFormAlert(
            'success',
            `<i class="fa-solid fa-circle-check"></i>
             <div>
               <strong>Message Sent Successfully!</strong><br />
               Thank you, <strong>${nameVal}</strong>. Your message was delivered directly to Adesh Bhosale (${ADESH_EMAIL}). He will get back to you shortly.
             </div>`
          );

          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="btn-text">Message Delivered!</span>';
          submitBtn.style.background = '#10b981';
          submitBtn.style.borderColor = '#10b981';
          contactForm.reset();

          if (formDirectFallback) {
            formDirectFallback.style.display = 'none';
          }

          setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
          }, 4500);

        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          setFormAlert(
            'warning',
            `<i class="fa-solid fa-envelope-open-text"></i>
             <div>
               <strong>One-Time Activation Required:</strong><br />
               FormSubmit has sent a confirmation email to <strong>${ADESH_EMAIL}</strong>.<br />
               Please open your inbox and click <em>'Activate Form'</em> to complete setup.<br />
               You can also send your message immediately via the Gmail button below.
             </div>`
          );

          submitBtn.innerHTML = '<i class="fa-solid fa-envelope"></i> <span class="btn-text">Activation Pending</span>';
          setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
          }, 3500);

        } else {
          throw new Error(data.message || 'Form submission could not be completed.');
        }

      } catch (error) {
        console.error('Contact form submission error:', error);
        setFormAlert(
          'error',
          `<i class="fa-solid fa-circle-exclamation"></i>
           <div>
             <strong>Could not send automatically (${error.message || 'Network error'}).</strong><br />
             Don't worry—your message is saved! Click <strong>Open & Send via Gmail</strong> below to send it with one click.
           </div>`
        );

        submitBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span class="btn-text">Try Again</span>';
        submitBtn.disabled = false;
      }
    });
  }
});

// Open Project 2 live website when the card itself is clicked/tapped.
document.querySelectorAll('.project-card-live').forEach((card) => {
  const openLiveProject = (event) => {
    if (event.target.closest('a, button')) return;
    window.open(card.dataset.liveUrl, '_blank', 'noopener,noreferrer');
  };

  card.addEventListener('click', openLiveProject);
  card.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
      event.preventDefault();
      openLiveProject(event);
    }
  });
});
