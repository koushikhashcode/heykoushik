/**
 * GET IN TOUCH - Modern Single Page Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Tab Configuration Dictionary ---
  const TAB_CONFIGS = {
    recruitment: {
      header: 'Hiring & Career Inquiries',
      responseTime: '24-48 business hours',
      description: 'Interested in hiring or discussing open positions? Reach out regarding job specs, contract roles, or team inquiries.',
      subjectPlaceholder: 'E.g., Senior Product Designer Role / Contract Opportunity',
      messageLabel: 'ROLE & POSITION DETAILS',
      messagePlaceholder: 'Detail the position, team structure, location/remote policy, compensation range, or key responsibilities...',
      submitLabel: 'Send Hiring Inquiry',
      badge: 'Hiring & Roles'
    },
    networking: {
      header: 'Networking & Collaborations',
      responseTime: '24-48 business hours',
      description: "Let's connect! Open to professional networking, advisory, podcasts, and joint creative partnerships.",
      subjectPlaceholder: 'E.g., Coffee chat / Partnership idea / Speaker invite',
      messageLabel: 'YOUR COLLABORATION PROPOSAL',
      messagePlaceholder: "Tell us a bit about yourself, your project, or how we might collaborate together...",
      submitLabel: 'Send Networking Request',
      badge: 'Networking & Collabs'
    },
    praise: {
      header: 'Compliments & Praise',
      responseTime: 'Reviewed & shared with team daily',
      description: "Loved working with us or enjoyed a recent project? We'd be thrilled to hear your kind words!",
      subjectPlaceholder: 'E.g., Loved your design system & brand execution!',
      messageLabel: 'YOUR KIND WORDS',
      messagePlaceholder: 'Share what stood out, what made a positive impression, or how our work impacted you...',
      submitLabel: 'Send Praise',
      badge: 'Praise & Compliments'
    },
    feedback: {
      header: 'Feedback & Critiques',
      responseTime: 'Reviewed directly by our team',
      description: 'Help us improve! Share constructive critiques, bug reports, feature suggestions, or usability thoughts.',
      subjectPlaceholder: 'E.g., Mobile navigation glitch / Feature suggestion',
      messageLabel: 'FEEDBACK & DETAILS',
      messagePlaceholder: 'Describe what happened, steps to reproduce, or your suggestions for improvement...',
      submitLabel: 'Submit Feedback',
      badge: 'Feedback & Critiques'
    }
  };

  // --- State Variables ---
  let activeTab = 'recruitment';
  let isAnonymous = false;
  let isSubmitting = false;

  // --- DOM Elements ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const contactForm = document.getElementById('contact-form');
  const formHeaderTitle = document.getElementById('form-header-title');
  const formHeaderDescText = document.getElementById('form-header-desc-text');
  const responseTimeText = document.getElementById('response-time-text');
  
  const subjectInput = document.getElementById('subject');
  const messageLabel = document.getElementById('message-label');
  const messageInput = document.getElementById('message');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtn = document.getElementById('submit-btn');
  const sendIcon = document.getElementById('send-icon');

  const anonymousContainer = document.getElementById('anonymous-toggle-container');
  const anonymousSwitch = document.getElementById('anonymous-switch');
  const contactFieldsContainer = document.getElementById('contact-fields-container');
  const anonymousShieldBanner = document.getElementById('anonymous-shield-banner');
  const successBanner = document.getElementById('success-banner');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // --- Core Functions ---

  // Update UI according to active Tab
  function setActiveTab(tabId) {
    if (!TAB_CONFIGS[tabId]) return;
    activeTab = tabId;

    // Update tab button styles and attributes
    tabButtons.forEach((btn) => {
      const btnTab = btn.getAttribute('data-tab');
      const isActive = btnTab === activeTab;

      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');

      // Update icon stroke color dynamically
      const icon = btn.querySelector('.tab-icon');
      if (icon) {
        if (btnTab === 'praise') {
          icon.setAttribute('class', `tab-icon ${isActive ? 'text-rose-300' : 'text-rose-500'}`);
        } else {
          icon.setAttribute('class', `tab-icon ${isActive ? 'text-white' : 'text-zinc-700'}`);
        }
      }

      // Manage active background pill element
      let activeBg = btn.querySelector('.tab-active-bg');
      if (isActive) {
        if (!activeBg) {
          activeBg = document.createElement('div');
          activeBg.className = 'tab-active-bg';
          btn.appendChild(activeBg);
        }
      } else if (activeBg) {
        activeBg.remove();
      }
    });

    const config = TAB_CONFIGS[activeTab];

    // Update Header Content
    if (formHeaderTitle) formHeaderTitle.textContent = config.header;
    if (formHeaderDescText) formHeaderDescText.textContent = config.description;
    if (responseTimeText) responseTimeText.textContent = `• ${config.responseTime}`;

    // Update Form Inputs
    if (subjectInput) subjectInput.placeholder = config.subjectPlaceholder;
    if (messageLabel) messageLabel.innerHTML = `${config.messageLabel} <span class="required-asterisk">*</span>`;
    if (messageInput) messageInput.placeholder = config.messagePlaceholder;

    // Handle Anonymous Section Visibility
    if (activeTab === 'feedback') {
      if (anonymousContainer) anonymousContainer.style.display = 'block';
      updateAnonymousVisibility();
    } else {
      if (anonymousContainer) anonymousContainer.style.display = 'none';
      if (contactFieldsContainer) contactFieldsContainer.style.display = 'flex';
      if (anonymousShieldBanner) anonymousShieldBanner.style.display = 'none';
      if (submitBtnText) submitBtnText.textContent = config.submitLabel;
    }

    // Clear any active errors when switching tabs
    clearErrors();
  }

  // Update visibility when toggling anonymous mode
  function updateAnonymousVisibility() {
    if (activeTab !== 'feedback') return;

    if (isAnonymous) {
      if (contactFieldsContainer) contactFieldsContainer.style.display = 'none';
      if (anonymousShieldBanner) anonymousShieldBanner.style.display = 'flex';
      if (submitBtnText) submitBtnText.textContent = 'Submit Anonymous Feedback';
      if (anonymousSwitch) anonymousSwitch.classList.add('active');
    } else {
      if (contactFieldsContainer) contactFieldsContainer.style.display = 'flex';
      if (anonymousShieldBanner) anonymousShieldBanner.style.display = 'none';
      if (submitBtnText) submitBtnText.textContent = TAB_CONFIGS.feedback.submitLabel;
      if (anonymousSwitch) anonymousSwitch.classList.remove('active');
    }

    clearErrors();
  }

  // Clear Form Validation Errors
  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('input-error');
    });
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
  }

  // Validate Form Inputs
  function validateForm() {
    clearErrors();
    let isValid = true;
    const isAnonActive = activeTab === 'feedback' && isAnonymous;

    // Validate Name & Email if not anonymous
    if (!isAnonActive) {
      if (!nameInput.value.trim()) {
        nameInput.classList.add('input-error');
        if (nameError) nameError.textContent = 'Please enter your name';
        isValid = false;
      }

      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        emailInput.classList.add('input-error');
        if (emailError) emailError.textContent = 'Please enter your email address';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        emailInput.classList.add('input-error');
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageInput.classList.add('input-error');
      if (messageError) messageError.textContent = 'Please enter a message';
      isValid = false;
    }

    return isValid;
  }

  // --- Event Listeners ---

  // Tab buttons click & keyboard navigation
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      setActiveTab(tabId);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const tabId = btn.getAttribute('data-tab');
        setActiveTab(tabId);
      }
    });
  });

  // Anonymous Switch click
  if (anonymousSwitch) {
    anonymousSwitch.addEventListener('click', () => {
      isAnonymous = !isAnonymous;
      anonymousSwitch.setAttribute('aria-checked', isAnonymous ? 'true' : 'false');
      updateAnonymousVisibility();
    });
  }

  // Real-time error clearing on typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        if (input.classList.contains('input-error')) {
          input.classList.remove('input-error');
          if (input === nameInput && nameError) nameError.textContent = '';
          if (input === emailInput && emailError) emailError.textContent = '';
          if (input === messageInput && messageError) messageError.textContent = '';
        }
      });
    }
  });

  // Form Submit Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm() || isSubmitting) return;

      // Start loading simulation
      isSubmitting = true;
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Sending...';
      if (sendIcon) sendIcon.classList.add('bouncing');

      setTimeout(() => {
        // Complete submission
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        if (sendIcon) sendIcon.classList.remove('bouncing');

        // Show Success Banner
        if (successBanner) {
          successBanner.style.display = 'flex';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        subjectInput.value = '';
        messageInput.value = '';

        // Auto-hide success banner after 4 seconds
        setTimeout(() => {
          if (successBanner) successBanner.style.display = 'none';
        }, 4000);
      }, 1000);
    });
  }

  // --- Initial Execution ---
  setActiveTab('recruitment');
});
