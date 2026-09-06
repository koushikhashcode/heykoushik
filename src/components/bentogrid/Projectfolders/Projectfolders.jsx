import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/portfolioData';
import { 
  Folder, 
  FolderOpen, 
  Code, 
  ExternalLink, 
  GitBranch, 
  Layers, 
  Search, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import './Projectfolders.css';

export const Projectfolders = ({ onSelectProject, initialCategory = 'All' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(PROJECTS_DATA[0].id);
  const [modalProject, setModalProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const categories = ['All', 'Backend', 'Full-Stack', 'UI/UX', 'Systems'];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeProject = PROJECTS_DATA.find((p) => p.id === activeProjectId) || filteredProjects[0] || PROJECTS_DATA[0];

  const handleOpenDetail = (proj) => {
    if (onSelectProject) {
      onSelectProject(proj);
    } else {
      setModalProject(proj);
    }
  };

  return (
    <div className="pf-container" id="projects-section">
      {/* Header bar */}
      <div className="pf-header">
        <div className="pf-header-brand">
          <div className="pf-header-icon">
            <FolderOpen />
          </div>
          <div>
            <div className="pf-header-tag-row">
              <span className="pf-header-tag">Workspace Explorer</span>
              <span className="pf-header-version">v2.4.0</span>
            </div>
            <h2 className="pf-header-title">Project Directory & Repositories</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pf-search-box">
          <Search className="pf-search-icon" />
          <input
            type="text"
            placeholder="Search stack or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pf-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="pf-search-clear"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="pf-category-bar no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`pf-category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat === 'All' && <Layers />}
            {cat === 'Backend' && <Terminal />}
            {cat === 'Full-Stack' && <Code />}
            {cat === 'UI/UX' && <Sparkles />}
            {cat}
            <span className="pf-cat-count">
              {cat === 'All' ? PROJECTS_DATA.length : PROJECTS_DATA.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Folder List & Active Project Detail */}
      <div className="pf-split-grid">
        {/* Left: Folder Navigator (5 cols) */}
        <div className="pf-nav-list custom-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="pf-empty-search">
              No matching projects found for "{searchQuery}".
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isSelected = project.id === activeProject.id;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProjectId(project.id)}
                  className={`pf-nav-card ${isSelected ? 'selected' : ''}`}
                >
                  {isSelected && (
                    <div className="pf-nav-active-bar" />
                  )}

                  <div className="pf-nav-card-top">
                    <div className="pf-nav-card-info">
                      {isSelected ? (
                        <FolderOpen className="pf-nav-card-icon" />
                      ) : (
                        <Folder className="pf-nav-card-icon" />
                      )}
                      <div className="pf-nav-card-details">
                        <div className="pf-nav-card-title-row">
                          <h4 className="pf-nav-title">
                            {project.title}
                          </h4>
                          {project.featured && (
                            <span className="pf-nav-featured-badge">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="pf-nav-desc">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="pf-nav-chevron" />
                  </div>

                  {/* Technology Tags */}
                  <div className="pf-nav-techs">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="pf-nav-tech-pill"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="pf-nav-tech-more">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Active Project Interactive Workbench (7 cols) */}
        <div className="pf-workbench">
          <div>
            {/* Folder tab bar */}
            <div className="pf-wb-topbar">
              <div className="pf-wb-folder-tag">
                <span className="pf-wb-path">
                  <Terminal />
                  src/{activeProject.folderName}/
                </span>
                <span className="pf-wb-date">{activeProject.date}</span>
              </div>
              <button
                onClick={() => handleOpenDetail(activeProject)}
                className="pf-wb-expand-btn"
                title="Expand Full Details"
              >
                <Maximize2 />
                <span>Deep Dive</span>
              </button>
            </div>

            {/* Title and Category */}
            <div className="pf-wb-title-row">
              <div>
                <span className="pf-wb-cat-label">
                  {activeProject.category} Architecture
                </span>
                <h3 className="pf-wb-title">
                  {activeProject.title}
                </h3>
              </div>
              {activeProject.metrics && (
                <div className="pf-wb-metric-box">
                  <div className="pf-wb-metric-lbl">Performance Metric</div>
                  <div className="pf-wb-metric-val">{activeProject.metrics}</div>
                </div>
              )}
            </div>

            {/* Tab switchers */}
            <div className="pf-wb-tabs-bar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pf-wb-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`pf-wb-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              >
                Key Capabilities ({activeProject.features.length})
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`pf-wb-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
              >
                Tech Stack ({activeProject.technologies.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="pf-wb-overview-stack">
                <p className="pf-wb-long-desc">
                  {activeProject.longDescription}
                </p>
                <div className="pf-wb-highlights-box">
                  <div className="pf-wb-hl-title">
                    <Sparkles />
                    Core Engineering Highlights
                  </div>
                  <div className="pf-wb-hl-grid">
                    {activeProject.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="pf-wb-hl-item">
                        <CheckCircle2 />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="pf-wb-features-list">
                {activeProject.features.map((feat, idx) => (
                  <div key={idx} className="pf-wb-feat-row">
                    <CheckCircle2 />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="pf-wb-arch-view">
                <div className="pf-wb-arch-sub">Technologies & Tooling Configured:</div>
                <div className="pf-wb-arch-tags">
                  {activeProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="pf-wb-arch-tag"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="pf-wb-actions-row">
            <div className="pf-wb-btns-left">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-wb-gh-btn"
                >
                  <GitBranch />
                  <span>GitHub Repository</span>
                </a>
              )}
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-wb-demo-btn"
                >
                  <ExternalLink />
                  <span>Live Production Demo</span>
                </a>
              )}
            </div>

            <button
              onClick={() => handleOpenDetail(activeProject)}
              className="pf-wb-deepdive-link"
            >
              View Full Architecture Log →
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup for Deep Dive */}
      {modalProject && (
        <div className="pf-modal-overlay">
          <div className="pf-modal-card">
            <button
              onClick={() => setModalProject(null)}
              className="pf-modal-close-btn"
              aria-label="Close modal"
            >
              <X />
            </button>

            <div className="pf-modal-cat-tag">
              <FolderOpen />
              <span>{modalProject.category} System Document</span>
            </div>
            
            <h3 className="pf-modal-title">
              {modalProject.title}
            </h3>

            <div className="pf-modal-techs">
              {modalProject.technologies.map((t) => (
                <span key={t} className="pf-modal-tech-pill">
                  {t}
                </span>
              ))}
            </div>

            <div className="pf-modal-body-stack">
              <div>
                <h4 className="pf-modal-sec-title">
                  Abstract & Architectural Intent
                </h4>
                <p className="pf-modal-desc-box">
                  {modalProject.longDescription}
                </p>
              </div>

              <div>
                <h4 className="pf-modal-sec-title">
                  Engineered Features & Capabilities
                </h4>
                <div className="pf-modal-feats-grid">
                  {modalProject.features.map((f, i) => (
                    <div key={i} className="pf-modal-feat-item">
                      <CheckCircle2 />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {modalProject.metrics && (
                <div className="pf-modal-metric-card">
                  <span className="pf-modal-metric-label">Verified Benchmark:</span>
                  <span className="pf-modal-metric-value">{modalProject.metrics}</span>
                </div>
              )}
            </div>

            <div className="pf-modal-footer">
              <button
                onClick={() => setModalProject(null)}
                className="pf-modal-cancel-btn"
              >
                Close
              </button>
              {modalProject.githubUrl && (
                <a
                  href={modalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-modal-source-btn"
                >
                  Inspect Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projectfolders;
