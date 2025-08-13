import React, { useState, useEffect } from "react";
import "./App.css";
import {
  skillsData,
  servicesData,
  educationData,
  experienceData,
  projectsData,
  certificationsData,
  achievementsData
} from "./data.js";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [visibleSkills, setVisibleSkills] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  // Parallax state for hero background
  // const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const skillSection = document.getElementById("skills");
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setVisibleSkills(true);
    }, { threshold: 0.3 });
    if (skillSection) observer.observe(skillSection);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.2 });
    elements.forEach((el) => observer.observe(el));
  }, []);

  // Parallax mouse movement effect
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
  //     const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
  //     setParallax({ x, y });
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  const openVideoModal = (videoPath) => {
    setModalVideo(videoPath);
    document.getElementById("video-modal").style.display = "flex";
  };

  const closeVideoModal = () => {
    document.getElementById("video-modal").style.display = "none";
    setModalVideo(null);
  };

  return (
    <div>
      {/* ===== Navbar ===== */}
      <nav className="navbar custom-navbar">
        <div className="navbar-left">
          <h2 className="logo">Maruveni Charan</h2>
        </div>
        <ul className="navbar-menu">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="navbar-right">
          <button 
            className="darkmode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="toggle-icon">
              {darkMode ? "☀️" : "🌙"}
            </span>
          </button>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <header className="hero-section custom-hero fade-in">
        <div className="hero-3d-bg">
          {/* Clean Background */}
          <div className="clean-bg"></div>
          
          {/* Subtle Glow Effects */}
          <div className="subtle-glow">
            <div className="glow-effect glow-1"></div>
            <div className="glow-effect glow-2"></div>
            <div className="glow-effect glow-3"></div>
          </div>
        </div>
        <div className="hero-profile-img-wrapper">
          <img src="/IMG_5281.jpg" alt="Maruveni Charan" className="profile-img-hero" />
        </div>
        <h1 className="hero-title">
          Hi, I'm <span className="hero-gradient">Maruveni Charan</span>
        </h1>
        <h2 className="hero-subtitle">Data Analyst | iOS App Developer</h2>
        <p className="hero-desc">
          Passionate about transforming data into actionable insights and building impactful applications that solve real-world problems through innovative technology solutions.
        </p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-gradient">
            Explore My Work <span className="arrow">&#8595;</span>
          </a>
          <a href="#contact" className="btn btn-outline">Contact Me</a>
          <a href="/MARUVENI CHARAN.pdf" download className="btn btn-solid">
            <span className="download-icon">&#128190;</span> Download Resume
          </a>
        </div>
        <div className="hero-down-arrow">
          <span>&#8595;</span>
        </div>
      </header>

      {/* ===== About ===== */}
      <section className="about-section pro-about-section fade-in" id="about">
        <div className="about-container">
          <div className="about-header">
            <h2 className="about-title">About Me</h2>
            <div className="about-underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-intro">
                I am a passionate <span className="highlight-text">B.Tech Computer Science and Engineering</span> student from 
                <span className="highlight-text"> Alliance University</span> with a strong academic foundation (CGPA: 8.0) and 
                expertise in both <span className="highlight-text">iOS app development</span> and <span className="highlight-text">data analytics</span>.
              </p>
              <p className="about-desc">
                My journey in technology has been driven by a deep curiosity for transforming complex data into actionable insights 
                and building innovative applications that solve real-world problems. I specialize in Python, Swift, Firebase, 
                Power BI, Excel, and MySQL, combining analytical thinking with creative problem-solving.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <div className="stat-number">8.0</div>
                <div className="stat-label">CGPA</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5+</div>
                <div className="stat-label">Technologies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Technical Skills Section ===== */}
      <section className="skills-section pro-skills-section fade-in" id="skills">
        <h2 className="section-title">Technical Skills</h2>
        <div className="skills-divider"></div>
        <div className="skills-card-grid">
          <div className="skill-card-pro">
            <span className="pro-skill-icon">&lt;/&gt;</span>
            <span className="pro-skill-name">Python</span>
            <span className="pro-skill-level">Intermediate</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">📱</span>
            <span className="pro-skill-name">Swift</span>
            <span className="pro-skill-level">Intermediate</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">🗄️</span>
            <span className="pro-skill-name">MySQL</span>
            <span className="pro-skill-level">Intermediate</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">🔥</span>
            <span className="pro-skill-name">Firebase</span>
            <span className="pro-skill-level">Intermediate</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">📊</span>
            <span className="pro-skill-name">Power BI</span>
            <span className="pro-skill-level">Expert</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">📄</span>
            <span className="pro-skill-name">Excel</span>
            <span className="pro-skill-level">Expert</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">💻</span>
            <span className="pro-skill-name">VS Code</span>
            <span className="pro-skill-level">Expert</span>
          </div>
          <div className="skill-card-pro">
            <span className="pro-skill-icon">🖥️</span>
            <span className="pro-skill-name">Xcode</span>
            <span className="pro-skill-level">Intermediate</span>
          </div>
        </div>
      </section>

      {/* ===== Services I Offer Section ===== */}
      <section className="services-section pro-services-section fade-in" id="services">
        <h2 className="section-title">Services I Offer</h2>
        <div className="pro-services-grid">
          <div className="pro-service-card">
            <div className="pro-service-icon-bg"><span className="pro-service-icon">📊</span></div>
            <h3 className="pro-service-title">Data Analytics</h3>
            <p className="pro-service-desc">
              Creating interactive dashboards, performing data visualization, and generating actionable insights from complex datasets.
            </p>
            <ul className="pro-service-list">
              <li>Dashboard Creation</li>
              <li>Data Visualization</li>
              <li>Trend Analysis</li>
              <li>Reporting</li>
            </ul>
          </div>
          <div className="pro-service-card">
            <div className="pro-service-icon-bg"><span className="pro-service-icon">📱</span></div>
            <h3 className="pro-service-title">iOS App Development</h3>
            <p className="pro-service-desc">
              Building iOS applications that solve real-world problems using modern technologies and best practices.
            </p>
            <ul className="pro-service-list">
              <li>iOS Development</li>
              <li>Swift Programming</li>
              <li>Firebase Integration</li>
              <li>UI/UX Design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Education Section ===== */}
      <section className="education-section fade-in" id="education">
        <h2 className="education-title">Education Journey</h2>
        <div className="education-underline"></div>
        <div className="education-timeline">
          <div className="education-card education-card-main">
            <div className="education-card-header">
              <div className="education-degree">
                <span className="education-icon">🎓</span>
                <div className="education-degree-info">
                  <h3 className="education-degree-title">B.Tech Computer Science and Engineering</h3>
                  <div className="education-school">Alliance University</div>
                </div>
                <span className="education-badge-current">Current</span>
              </div>
            </div>
            <div className="education-card-content">
              <div className="education-stats">
                <div className="education-stat">
                  <span className="education-stat-icon">📅</span>
                  <span className="education-stat-label">Graduation</span>
                  <span className="education-stat-value">2026</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">🎯</span>
                  <span className="education-stat-label">CGPA</span>
                  <span className="education-stat-value">8.0</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">📍</span>
                  <span className="education-stat-label">Location</span>
                  <span className="education-stat-value">Bengaluru, Karnataka</span>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-card-header">
              <div className="education-degree">
                <span className="education-icon">📚</span>
                <div className="education-degree-info">
                  <h3 className="education-degree-title">12th Grade</h3>
                  <div className="education-school">Amaravathi Jr. College</div>
                </div>
              </div>
            </div>
            <div className="education-card-content">
              <div className="education-stats">
                <div className="education-stat">
                  <span className="education-stat-icon">📅</span>
                  <span className="education-stat-label">Year</span>
                  <span className="education-stat-value">2022</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">🎯</span>
                  <span className="education-stat-label">Percentage</span>
                  <span className="education-stat-value">76%</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">📍</span>
                  <span className="education-stat-label">Location</span>
                  <span className="education-stat-value">Andhra Pradesh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="education-card">
            <div className="education-card-header">
              <div className="education-degree">
                <span className="education-icon">🏫</span>
                <div className="education-degree-info">
                  <h3 className="education-degree-title">10th Grade</h3>
                  <div className="education-school">PCMR EM School</div>
                </div>
              </div>
            </div>
            <div className="education-card-content">
              <div className="education-stats">
                <div className="education-stat">
                  <span className="education-stat-icon">📅</span>
                  <span className="education-stat-label">Year</span>
                  <span className="education-stat-value">2020</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">🎯</span>
                  <span className="education-stat-label">Percentage</span>
                  <span className="education-stat-value">100%</span>
                </div>
                <div className="education-stat">
                  <span className="education-stat-icon">📍</span>
                  <span className="education-stat-label">Location</span>
                  <span className="education-stat-value">Andhra Pradesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Experience Section ===== */}
      <section className="experience-section fade-in" id="experience">
        <h2 className="experience-title">Professional Experience</h2>
        <div className="experience-underline"></div>
        <div className="experience-container">
          <div className="experience-card">
            <div className="experience-card-header">
              <div className="experience-role">
                <span className="experience-icon">🔖</span>
                <div className="experience-role-info">
                  <h3 className="experience-role-title">Centre of Excellence in iOS App Development</h3>
                  <div className="experience-company">Alliance University</div>
                </div>
                <span className="experience-badge-intern">Internship</span>
              </div>
            </div>
            <div className="experience-card-content">
              <div className="experience-meta">
                <div className="experience-meta-item">
                  <span className="experience-meta-icon">📅</span>
                  <span className="experience-meta-label">Duration</span>
                  <span className="experience-meta-value">Jan 2025 – June 2025</span>
                </div>
              </div>
              <div className="experience-description">
                <p>Focus on iOS app development using Swift, Firebase, and Xcode. Building expertise in mobile app architecture, user interface design, and backend integration.</p>
              </div>
              <div className="experience-skills">
                <h4>Technologies & Skills:</h4>
                <div className="experience-skill-tags">
                  <span className="experience-skill-tag">Swift</span>
                  <span className="experience-skill-tag">Firebase</span>
                  <span className="experience-skill-tag">Xcode</span>
                  <span className="experience-skill-tag">iOS Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Certifications Section ===== */}
      <section className="certifications-section fade-in" id="certifications">
        <h2 className="section-title">Certifications</h2>
        <div className="certifications-grid">
          <div className="certification-card">
            <div className="cert-icon">
              <span>📊</span>
            </div>
            <div className="cert-content">
              <h3 className="cert-title">Data Analysis with Python</h3>
              <p className="cert-issuer">Professional Certification</p>
              <div className="cert-meta">
                <span className="cert-date">2024</span>
                <span className="cert-type">Data Analytics</span>
              </div>
              <a 
                href="/data analysis with python.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="cert-download-btn"
              >
                <span className="download-icon">📄</span> View Certificate
              </a>
            </div>
          </div>
          
          <div className="certification-card">
            <div className="cert-icon">
              <span>📈</span>
            </div>
            <div className="cert-content">
              <h3 className="cert-title">Excel</h3>
              <p className="cert-issuer">Professional Certification</p>
              <div className="cert-meta">
                <span className="cert-date">2025</span>
                <span className="cert-type">Data Analysis</span>
              </div>
              <a 
                href="/Excel.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="cert-download-btn"
              >
                <span className="download-icon">📄</span> View Certificate
              </a>
            </div>
          </div>
          
          <div className="certification-card">
            <div className="cert-icon">
              <span>📊</span>
            </div>
            <div className="cert-content">
              <h3 className="cert-title">Power BI for Business Professionals</h3>
              <p className="cert-issuer">Professional Certification</p>
              <div className="cert-meta">
                <span className="cert-date">2025</span>
                <span className="cert-type">Data Visualization</span>
              </div>
              <a 
                href="/Power BI for Business Professionals.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="cert-download-btn"
              >
                <span className="download-icon">📄</span> View Certificate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Achievements & Participations Section ===== */}
      <section className="achievements-section fade-in" id="achievements">
        <h2 className="section-title">Achievements & Participations</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">
              <span>💡</span>
            </div>
            <div className="achievement-content">
              <h3 className="achievement-title">Techathon Participant</h3>
              <p className="achievement-desc">
                Participated in Techathon at Alliance University, collaborating with peers to solve real-world technical challenges and present innovative solutions.
              </p>
              <div className="achievement-meta">
                <span className="achievement-year">2024</span>
                <span className="achievement-category">Participation</span>
              </div>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">
              <span>🥈</span>
            </div>
            <div className="achievement-content">
              <h3 className="achievement-title">Runner-up - Cultural Events</h3>
              <p className="achievement-desc">
                Achieved runner-up position in cultural events held during Alliance 2.0, showcasing creativity, teamwork, and leadership in a competitive environment.
              </p>
              <div className="achievement-meta">
                <span className="achievement-year">2023</span>
                <span className="achievement-category">Cultural</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Projects Section ===== */}
      <section className="projects-section pro-projects-section fade-in" id="projects">
        <h2 className="pro-projects-title">Latest Projects</h2>
        <div className="pro-projects-grid">
          <div className="pro-project-card">
            <div className="pro-project-image">
              <img src="/istockphoto-1919863292-612x612.jpg" alt="StudyQuerk" />
              <span className="pro-project-category app-dev">App Development</span>
            </div>
            <div className="pro-project-content">
              <div className="pro-project-header">
                <h3 className="pro-project-title">StudyQuerk</h3>
              </div>
              <p className="pro-project-desc">
                A comprehensive education resource-sharing platform built with Swift and Firebase, enabling students to share and access study materials efficiently.
              </p>
              <div className="pro-project-tech">
                <span className="pro-tech-tag">Swift</span>
                <span className="pro-tech-tag">Firebase</span>
                <span className="pro-tech-tag">Xcode</span>
              </div>
              <div className="pro-project-features">
                <h4>Key Features:</h4>
                <ul>
                  <li>User Authentication</li>
                  <li>File Sharing</li>
                  <li>Real-time Notifications</li>
                  <li>Clean UI/UX</li>
                </ul>
              </div>
              <div className="pro-project-buttons">
                <button 
                  className="pro-btn pro-btn-demo"
                  onClick={() => openVideoModal("/1745846946389470.MP4")}
                >
                  <span className="pro-btn-icon">▶</span> Demo Video
                </button>
              </div>
            </div>
          </div>

          <div className="pro-project-card">
            <div className="pro-project-image">
              <img src="/medication.jpeg" alt="Medication Alert System" />
              <span className="pro-project-category app-dev">App Development</span>
            </div>
            <div className="pro-project-content">
              <div className="pro-project-header">
                <h3 className="pro-project-title">Medication Alert System</h3>
              </div>
              <p className="pro-project-desc">
                An iOS application that sends timely medication reminders to users, helping them maintain their health routines with smart notification features.
              </p>
              <div className="pro-project-tech">
                <span className="pro-tech-tag">Swift</span>
                <span className="pro-tech-tag">Firebase</span>
                <span className="pro-tech-tag">Xcode</span>
              </div>
              <div className="pro-project-features">
                <h4>Key Features:</h4>
                <ul>
                  <li>Smart Reminders</li>
                  <li>Medication Tracking</li>
                  <li>Health Monitoring</li>
                  <li>User-friendly Interface</li>
                </ul>
              </div>
              <div className="pro-project-buttons">
                <button 
                  className="pro-btn pro-btn-demo"
                  onClick={() => openVideoModal("/MedicationAlertSystemDemo.mp4")}
                >
                  <span className="pro-btn-icon">▶</span> Demo Video
                </button>
              </div>
            </div>
          </div>

          <div className="pro-project-card">
            <div className="pro-project-image">
              <img src="/IMG_6393.jpg" alt="Road Accident Analysis Dashboard" />
              <span className="pro-project-category data-analytics">Data Analytics</span>
            </div>
            <div className="pro-project-content">
              <div className="pro-project-header">
                <h3 className="pro-project-title">Road Accident Analysis Dashboard</h3>
              </div>
              <p className="pro-project-desc">
                A comprehensive Power BI dashboard analyzing road accident trends, patterns, and contributing factors to provide actionable insights for traffic safety.
              </p>
              <div className="pro-project-tech">
                <span className="pro-tech-tag">Power BI</span>
              </div>
              <div className="pro-project-features">
                <h4>Key Features:</h4>
                <ul>
                  <li>Interactive Visualizations</li>
                  <li>Trend Analysis</li>
                  <li>Geographic Mapping</li>
                  <li>Predictive Insights</li>
                </ul>
              </div>
              <div className="pro-project-buttons">
                <a 
                  href="https://github.com/charan2319/Road-Accident-Analysis-Dashboard" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pro-btn pro-btn-details"
                >
                  <span className="pro-btn-icon">🔗</span> More Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Video Modal ===== */}
      <div id="video-modal" className="video-modal" onClick={closeVideoModal}>
        <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-btn" onClick={closeVideoModal}>&times;</span>
          {modalVideo && (
            <video width="100%" height="auto" controls autoPlay>
              <source src={modalVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      {/* ===== Contact Section ===== */}
      <section className="contact-section custom-contact-section fade-in" id="contact">
        <h2 className="contact-heading">Get In Touch</h2>
        <div className="contact-divider"></div>
        <p className="contact-subtitle">
          I'm always open to discussing new opportunities, projects, or just having a chat about technology and data analytics.
        </p>
        <div className="contact-grid">
          {/* Left: Let's Connect */}
          <div className="contact-left">
            <h3 className="contact-left-title">Let's Connect</h3>
            <p className="contact-left-desc">
              Whether you're looking for a data analyst to help with your next project, interested in collaborating on an app development venture, or just want to connect with a fellow tech enthusiast, I'd love to hear from you.
            </p>
            <div className="contact-info-cards">
              <div className="contact-info-card">
                <span className="contact-info-icon email-icon">📧</span>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">charanm2319@gmail.com</div>
                </div>
              </div>
              <div className="contact-info-card">
                <span className="contact-info-icon phone-icon">📞</span>
                <div>
                  <div className="contact-info-label">Phone</div>
                  <div className="contact-info-value">+91 8639839229</div>
                </div>
              </div>
              <div className="contact-info-card">
                <span className="contact-info-icon location-icon">📍</span>
                <div>
                  <div className="contact-info-label">Location</div>
                  <div className="contact-info-value">Bengaluru, Karnataka, India</div>
                </div>
              </div>
            </div>
            <div className="contact-social">
              <div className="contact-social-label">Follow Me</div>
              <div className="contact-social-icons">
                <a href="https://linkedin.com/in/maruveni-charan-631766281" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://github.com/charan2319" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fab fa-github"></i></a>
                <a href="https://www.hackerrank.com/profile/charanm2319" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fab fa-hackerrank"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer>
        <p>© 2025 Maruveni Charan. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;