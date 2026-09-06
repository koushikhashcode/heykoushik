import React, { useState } from 'react';
import { PERSONAL_INFO, PROJECTS_DATA, SKILLS_DATA, EDUCATION_DATA } from './data/portfolioData';
import { Download, Printer, X, Mail, Phone, MapPin, FileText } from 'lucide-react';
import './ResumeModal.css';

// ============================================================================
// 1. STATE & ACTION HANDLERS
// ============================================================================
export const ResumeModal = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Ignore if print dialog is blocked in iframe sandbox
    }
  };

  const handleDownload = () => {
    try {
      // Generate downloadable CV text/data
      const cvContent = `
===========================================================
KOUSHIK MANDAL - CURRICULUM VITAE
Software Engineer | Backend Developer | UI/UX Designer
Email: ${PERSONAL_INFO.email}
Phone: ${PERSONAL_INFO.phone}
Location: ${PERSONAL_INFO.location}
GitHub: ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}
===========================================================

SUMMARY:
${PERSONAL_INFO.aboutLong}

TECHNICAL SKILLS:
- Languages: Java, Python, Go, TypeScript, JavaScript, HTML5, CSS3
- Frameworks & Backend: Spring Boot, FastAPI, Node.js, Express, RESTful APIs
- Frontend & UI/UX: React, Tailwind CSS, Figma Design Systems, Motion
- Databases & Infra: PostgreSQL, MySQL, Redis, Docker, Git, Microservices

FEATURED PROJECTS:
${PROJECTS_DATA.map(p => `
* ${p.title} (${p.category})
  Technologies: ${p.technologies.join(', ')}
  Description: ${p.longDescription}
  Key Metric: ${p.metrics || 'N/A'}
`).join('\n')}

EDUCATION:
${EDUCATION_DATA.map(e => `
* ${e.degree} - ${e.field}
  ${e.institution} (${e.period}) - Grade: ${e.grade}
  Highlights: ${e.highlights.join('; ')}
`).join('\n')}
===========================================================
      `;

      const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Koushik_Mandal_CV.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      setDownloadSuccess(false);
    }
  };

  // ============================================================================
  // 2. RENDER CV LAYOUT
  // ============================================================================
  return (
    <div data-lenis-prevent className="resume-modal-overlay">
      <div data-lenis-prevent className="resume-modal-dialog">
        {/* Header Action Bar */}
        <div className="resume-modal-header">
          <div className="resume-header-left">
            <div className="resume-header-icon">
              <FileText />
            </div>
            <div className="resume-header-titles">
              <h3 className="resume-header-title">
                Koushik Mandal — CV
              </h3>
              <p className="resume-header-sub">Software Engineer & UI/UX</p>
            </div>
          </div>

          <div className="resume-header-actions">
            <button
              onClick={handlePrint}
              className="resume-print-btn"
              title="Print Resume"
            >
              <Printer />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="resume-download-btn"
            >
              <Download />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download'}</span>
            </button>

            <button
              onClick={onClose}
              className="resume-close-btn"
              aria-label="Close modal"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="resume-modal-body custom-scrollbar">
          {/* Header section */}
          <div className="resume-profile-header">
            <h1 className="resume-name">
              {PERSONAL_INFO.name}
            </h1>
            <p className="resume-headline">
              {PERSONAL_INFO.headline}
            </p>

            <div className="resume-contact-badges">
              <span className="resume-badge-item">
                <Mail />
                {PERSONAL_INFO.email}
              </span>
              <span className="resume-badge-item">
                <Phone />
                {PERSONAL_INFO.phone}
              </span>
              <span className="resume-badge-item">
                <MapPin />
                {PERSONAL_INFO.location}
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h4 className="resume-section-title">
              <span className="resume-gold-dot" />
              Professional Overview
            </h4>
            <p className="resume-summary-card">
              {PERSONAL_INFO.aboutLong}
            </p>
          </div>

          {/* Core Technical Matrix */}
          <div>
            <h4 className="resume-section-title">
              <span className="resume-gold-dot" />
              Core Competencies & Stack
            </h4>
            <div className="resume-skills-grid">
              {SKILLS_DATA.map((skill) => (
                <div key={skill.name} className="resume-skill-item">
                  <div className="resume-skill-header">
                    <span className="resume-skill-name">{skill.name}</span>
                    <span className="resume-skill-exp">{skill.experience}</span>
                  </div>
                  <p className="resume-skill-hl">{skill.highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Systems Engineering */}
          <div>
            <h4 className="resume-section-title">
              <span className="resume-gold-dot" />
              Selected Engineering Projects
            </h4>
            <div className="resume-projects-stack">
              {PROJECTS_DATA.slice(0, 4).map((p) => (
                <div key={p.id} className="resume-project-card">
                  <div className="resume-proj-header">
                    <div className="resume-proj-title-box">
                      <h5 className="resume-proj-title">{p.title}</h5>
                      <span className="resume-proj-cat-tag">
                        {p.category}
                      </span>
                    </div>
                    {p.metrics && (
                      <span className="resume-proj-metric">{p.metrics}</span>
                    )}
                  </div>
                  <p className="resume-proj-desc">
                    {p.longDescription}
                  </p>
                  <div className="resume-proj-techs">
                    {p.technologies.map((t) => (
                      <span key={t} className="resume-tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Foundation */}
          <div>
            <h4 className="resume-section-title">
              <span className="resume-gold-dot" />
              Education & Certifications
            </h4>
            <div className="resume-edu-stack">
              {EDUCATION_DATA.map((e) => (
                <div key={e.id} className="resume-edu-card">
                  <div>
                    <div className="resume-edu-degree">{e.degree} — {e.field}</div>
                    <div className="resume-edu-inst">{e.institution}</div>
                  </div>
                  <div className="resume-edu-right">
                    <div className="resume-edu-period">{e.period}</div>
                    {e.grade && <div className="resume-edu-grade">{e.grade}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="resume-modal-footer">
          <span>Koushik Mandal • Ready for engineering & design engagements</span>
          <button
            onClick={onClose}
            className="resume-footer-close-btn"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
