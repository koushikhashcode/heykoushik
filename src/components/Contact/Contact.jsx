import React, { useState } from "react";
import "./Contact.css";
import heroBg from "../../assets/herobg.png";

const TAB_CONFIGS = {
  recruitment: {
    id: "recruitment",
    title: "Hiring",
    subtitle: "Job opportunities & career inquiries",
    header: "Hiring & Career Inquiries",
    responseTime: "24-48 business hours",
    description:
      "Interested in hiring or discussing open positions? Reach out regarding job specs, contract roles, or team inquiries.",
    subjectPlaceholder:
      "E.g., Senior Product Designer Role / Contract Opportunity",
    messageLabel: "ROLE & POSITION DETAILS",
    messagePlaceholder:
      "Detail the position, team structure, location/remote policy, compensation range, or key responsibilities...",
    submitLabel: "Send Hiring Inquiry",
  },
  networking: {
    id: "networking",
    title: "Networking",
    subtitle: "Professional collabs & partnerships",
    header: "Networking & Collaborations",
    responseTime: "24-48 business hours",
    description:
      "Let's connect! Open to professional networking, advisory, podcasts, and joint creative partnerships.",
    subjectPlaceholder: "E.g., Coffee chat / Partnership idea / Speaker invite",
    messageLabel: "YOUR COLLABORATION PROPOSAL",
    messagePlaceholder:
      "Tell us a bit about yourself, your project, or how we might collaborate together...",
    submitLabel: "Send Networking Request",
  },
  praise: {
    id: "praise",
    title: "Praise",
    subtitle: "Positive feedback & compliments",
    header: "Compliments & Praise",
    responseTime: "Reviewed & shared with team daily",
    description:
      "Loved working with us or enjoyed a recent project? We'd be thrilled to hear your kind words!",
    subjectPlaceholder: "E.g., Loved your design system & brand execution!",
    messageLabel: "YOUR KIND WORDS",
    messagePlaceholder:
      "Share what stood out, what made a positive impression, or how our work impacted you...",
    submitLabel: "Send Praise",
  },
  feedback: {
    id: "feedback",
    title: "Feedback",
    subtitle: "Bug reports & constructive critiques",
    header: "Feedback & Critiques",
    responseTime: "Reviewed directly by our team",
    description:
      "Help us improve! Share constructive critiques, bug reports, feature suggestions, or usability thoughts.",
    subjectPlaceholder: "E.g., Mobile navigation glitch / Feature suggestion",
    messageLabel: "FEEDBACK & DETAILS",
    messagePlaceholder:
      "Describe what happened, steps to reproduce, or your suggestions for improvement...",
    submitLabel: "Submit Feedback",
  },
};

const Contact = () => {
  const [activeTab, setActiveTab] = useState("recruitment");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "1234@gmail.com",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const currentConfig = TAB_CONFIGS[activeTab];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setErrors({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;
    const isAnon = activeTab === "feedback" && isAnonymous;

    if (!isAnon) {
      if (!formData.name.trim()) {
        newErrors.name = "Please enter your name";
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Please enter your email address";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  const getIconClass = (tabId) => {
    const isActive = activeTab === tabId;
    if (tabId === "praise") {
      return `tab-icon ${isActive ? "text-rose-300" : "text-rose-500"}`;
    }
    return `tab-icon ${isActive ? "text-white" : "text-zinc-700"}`;
  };

  return (
    <div className="contact-wrapper">
      <main className="main-wrapper">
        {/* Section 1: Hero Header Card */}
        <section className="hero-section">
          <div className="hero-card">
            {/* Background Image */}
            <img src={heroBg} alt="Hero Background" className="hero-bg-img" />

            {/* Hero Main Content */}
            <div className="hero-content">
              <div className="hero-status-pill">
                <span className="emerald-pulse-dot" />
                <span className="hero-status-text">Open to opportunities</span>
              </div>

              <h1 className="hero-title">Get in touch</h1>
              <p className="hero-description">
                Kindly designate your preferred vector of discourse below to
                establish contact regarding prospective engagements, collective
                endeavors, or feedback.
              </p>
            </div>
          </div>

          {/* Bottom Integrated Category Navigation Bar */}
          <div className="hero-nav-container">
            <div className="hero-nav-wrapper">
              <div className="tablist-container">
                <div
                  className="tablist"
                  role="tablist"
                  aria-label="Contact category tabs"
                >
                  {/* Tab 1: Hiring */}
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === "recruitment" ? "active" : ""}`}
                    onClick={() => handleTabChange("recruitment")}
                    role="tab"
                    id="tab-recruitment"
                    aria-selected={activeTab === "recruitment"}
                    aria-controls="contact-form-panel"
                  >
                    {activeTab === "recruitment" && (
                      <div className="tab-active-bg" />
                    )}
                    <div className="tab-icon-badge">
                      <svg
                        className={getIconClass("recruitment")}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <div className="tab-text-wrapper">
                      <span className="tab-title">Hiring</span>
                      <div className="tab-subtitle-container">
                        <p className="tab-subtitle">
                          Job opportunities & career inquiries
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 2: Networking */}
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === "networking" ? "active" : ""}`}
                    onClick={() => handleTabChange("networking")}
                    role="tab"
                    id="tab-networking"
                    aria-selected={activeTab === "networking"}
                    aria-controls="contact-form-panel"
                  >
                    {activeTab === "networking" && (
                      <div className="tab-active-bg" />
                    )}
                    <div className="tab-icon-badge">
                      <svg
                        className={getIconClass("networking")}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="tab-text-wrapper">
                      <span className="tab-title">Networking</span>
                      <div className="tab-subtitle-container">
                        <p className="tab-subtitle">
                          Professional collabs & partnerships
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 3: Praise */}
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === "praise" ? "active" : ""}`}
                    onClick={() => handleTabChange("praise")}
                    role="tab"
                    id="tab-praise"
                    aria-selected={activeTab === "praise"}
                    aria-controls="contact-form-panel"
                  >
                    {activeTab === "praise" && (
                      <div className="tab-active-bg" />
                    )}
                    <div className="tab-icon-badge">
                      <svg
                        className={getIconClass("praise")}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <div className="tab-text-wrapper">
                      <span className="tab-title">Praise</span>
                      <div className="tab-subtitle-container">
                        <p className="tab-subtitle">
                          Positive feedback & compliments
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 4: Feedback */}
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === "feedback" ? "active" : ""}`}
                    onClick={() => handleTabChange("feedback")}
                    role="tab"
                    id="tab-feedback"
                    aria-selected={activeTab === "feedback"}
                    aria-controls="contact-form-panel"
                  >
                    {activeTab === "feedback" && (
                      <div className="tab-active-bg" />
                    )}
                    <div className="tab-icon-badge">
                      <svg
                        className={getIconClass("feedback")}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="tab-text-wrapper">
                      <span className="tab-title">Feedback</span>
                      <div className="tab-subtitle-container">
                        <p className="tab-subtitle">
                          Bug reports & constructive critiques
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Main Contact Form Card */}
        <section className="form-section">
          <div
            id="contact-form-panel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="form-card"
          >
            <div className="form-inner">
              {/* Header Title & Description */}
              <div className="form-header-row">
                <div className="sparkle-badge">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                  >
                    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
                  </svg>
                </div>
                <h2 id="form-header-title" className="form-header-title">
                  {currentConfig.header}
                </h2>
              </div>

              <p className="form-header-desc">
                <span id="form-header-desc-text">
                  {currentConfig.description}
                </span>{" "}
                <span id="response-time-text" className="response-time-badge">
                  • {currentConfig.responseTime}
                </span>
              </p>

              {/* Success Banner */}
              {submitted && (
                <div id="success-banner" className="success-banner">
                  <svg
                    className="success-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <p className="success-title">Message sent successfully!</p>
                    <p className="success-sub">
                      Thank you for reaching out. We will get back to you
                      shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Element */}
              <form id="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group-list">
                  {/* Anonymous Toggle Option (Shown when Feedback tab is active) */}
                  {activeTab === "feedback" && (
                    <div id="anonymous-toggle-container">
                      <div className="anonymous-box">
                        <div className="anonymous-left">
                          <div className="anonymous-icon-badge">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          </div>
                          <div>
                            <p className="anonymous-title">Hide my identity</p>
                            <p className="anonymous-subtitle">
                              Send feedback anonymously without sharing your
                              name or email
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          id="anonymous-switch"
                          className={`switch-btn ${isAnonymous ? "active" : ""}`}
                          onClick={() => setIsAnonymous(!isAnonymous)}
                          role="switch"
                          aria-checked={isAnonymous}
                          aria-label="Hide my identity"
                        >
                          <span className="switch-thumb" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contact Info Inputs Container (Hidden if Feedback & Anonymous) */}
                  {!(activeTab === "feedback" && isAnonymous) && (
                    <div
                      id="contact-fields-container"
                      className="form-group-list"
                    >
                      {/* Field 1: Name */}
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          YOUR NAME <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-wrapper">
                          <svg
                            className="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="E.g., Julian Brandt"
                            className={`form-input ${errors.name ? "input-error" : ""}`}
                          />
                        </div>
                        {errors.name && (
                          <p id="name-error" className="error-msg">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Field 2: Email */}
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          EMAIL ADDRESS{" "}
                          <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-wrapper">
                          <svg
                            className="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="julian@brandt-design.com"
                            className={`form-input ${errors.email ? "input-error" : ""}`}
                          />
                        </div>
                        {errors.email && (
                          <p id="email-error" className="error-msg">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Field 3: Phone */}
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          PHONE NUMBER
                        </label>
                        <div className="input-wrapper">
                          <svg
                            className="input-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="E.g., +91 8637863786"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Anonymous Shield Banner */}
                  {activeTab === "feedback" && isAnonymous && (
                    <div
                      id="anonymous-shield-banner"
                      className="anonymous-shield-banner"
                    >
                      <svg
                        className="anonymous-shield-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      <span>
                        Your identity is hidden. This feedback will be submitted
                        completely anonymously.
                      </span>
                    </div>
                  )}

                  {/* Field 4: Subject */}
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      SUBJECT
                    </label>
                    <div className="input-wrapper">
                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={currentConfig.subjectPlaceholder}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Field 5: Message */}
                  <div className="form-group">
                    <label
                      id="message-label"
                      htmlFor="message"
                      className="form-label"
                    >
                      {currentConfig.messageLabel}{" "}
                      <span className="required-asterisk">*</span>
                    </label>
                    <div className="input-wrapper">
                      <svg
                        className="input-icon input-icon-top"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={currentConfig.messagePlaceholder}
                        className={`form-input form-textarea ${errors.message ? "input-error" : ""}`}
                      />
                    </div>
                    {errors.message && (
                      <p id="message-error" className="error-msg">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="submit-btn-wrapper">
                    <button
                      type="submit"
                      id="submit-btn"
                      disabled={isSubmitting}
                      className="submit-btn"
                    >
                      <svg
                        id="send-icon"
                        className={`send-icon ${isSubmitting ? "bouncing" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span id="submit-btn-text">
                        {isSubmitting
                          ? "Sending..."
                          : activeTab === "feedback" && isAnonymous
                            ? "Submit Anonymous Feedback"
                            : currentConfig.submitLabel}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
