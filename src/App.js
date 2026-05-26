import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import "./App.css";
import "./premium_timeline.css";
import "./premium_sizing.css";
import {
  skillsData,
  servicesData,
  educationData,
  experienceData,
  projectsData,
  certificationsData,
  achievementsData
} from "./data.js";


const ProjectCard = ({ title, category, desc, tech, image, video, link, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleOpen = () => onClick({ title, category, desc, tech, image, video, link });
  
  return (
    <motion.div 
      className="pro-project-card premium-card"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      viewport={{ once: false, amount: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      <div className="pro-project-media">
        {isHovered && video ? (
          <motion.video 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            src={video} 
            autoPlay 
            muted 
            loop 
            className="project-video-hover"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img src={image} alt={title} className="project-img-default" />
        )}
      </div>
      <div className="pro-project-content-minimal">
        <div className="pro-card-bottom-row">
          <div className="pro-card-left">
            <span className={`pro-project-category-tag ${category.className}`}>{category.name}</span>
            <h3 className="pro-project-title-minimal">{title}</h3>
          </div>
          <button className="card-view-details-btn" onClick={handleOpen}>View Details →</button>
        </div>
      </div>
    </motion.div>
  );
};

// Word Reveal Component
const WordReveal = ({ text, className, delayOffset = 0 }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: delayOffset * 0.1 } },
  };

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <motion.div style={{ display: "inline-block" }} className={className} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {words.map((word, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block", marginRight: "0.25em" }}>
          {word === "Charan" || word === "Maruveni" ? (
            <span className="hero-gradient">{word}</span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </motion.div>
  );
};
const ServiceSlider = ({ services }) => {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % services.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + services.length) % services.length);

  return (
    <div className="premium-mobile-slider">
      <div className="slider-track-outer">
        <motion.div 
          className="slider-track-inner"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x < -50) handleNext();
            else if (offset.x > 50) handlePrev();
          }}
        >
          {services.map((service, idx) => {
            const relativeIndex = (idx - index + services.length) % services.length;
            const isCenter = relativeIndex === 0;
            
            // Stacking values matching a deck-of-cards offset to the right
            let scale = 1;
            let opacity = 0;
            let x = 0;
            let zIndex = 1;

            if (relativeIndex === 0) {
              scale = 1;
              opacity = 1;
              x = 0;
              zIndex = 10;
            } else if (relativeIndex === 1) {
              scale = 0.95;
              opacity = 0.85;
              x = 24; // Offset to the right side
              zIndex = 9;
            } else if (relativeIndex === 2) {
              scale = 0.90;
              opacity = 0.50;
              x = 48; // Shifted further behind
              zIndex = 8;
            } else {
              scale = 0.85;
              opacity = 0;
              x = 72;
              zIndex = 1;
            }

            return (
              <motion.div 
                key={idx} 
                className={`premium-slider-card ${isCenter ? 'active' : 'inactive'}`}
                animate={{ 
                  scale,
                  opacity,
                  x,
                  zIndex
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="pro-service-icon-bg">
                  {service.isImg ? (
                    <img src={service.icon} alt={service.title} style={{width: "45px", height: "45px"}} />
                  ) : (
                    <span className="pro-service-icon">{service.icon}</span>
                  )}
                </div>
                <h3 className="pro-service-title">{service.title}</h3>
                <p className="pro-service-desc">{service.description}</p>
                <ul className="pro-service-list">
                  {service.list && service.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <div className="premium-dots">
        {services.map((_, i) => (
          <div 
            key={i} 
            className={`premium-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

const projectsList = [
  { title: "Founder's Mart", category: { name: 'E-Commerce', className: 'web-dev' }, desc: "A full-stack e-commerce platform built for efficient product management and an optimized shopping experience.", tech: ['React', 'Node.js', 'PostgreSQL'], image: "/hero.png", link: "http://www.ecellstore.com" },
  { title: "Alliance Alumni Connect", category: { name: 'App Development', className: 'app-dev' }, desc: "A Flutter app bridging the gap between alumni, students, and the university to foster a thriving community network.", tech: ['Flutter', 'Firebase', 'Cloudinary'], image: "/Alumni.PNG" },
  { title: "Mymedicare", category: { name: 'App Development', className: 'app-dev' }, desc: "An iOS application that sends timely medication reminders to users, helping them maintain their health routines with smart notification features.", tech: ['Swift', 'Firebase', 'Xcode'], image: "/unnamed-1.jpg", video: "/VIDEO-2025-11-22-23-56-57.MP4" },
  { title: "Road Accident Analysis Dashboard", category: { name: 'Data Analytics', className: 'data-analytics' }, desc: "A comprehensive Power BI dashboard analyzing road accident trends, patterns, and contributing factors to provide actionable insights for traffic safety.", tech: ['Power BI'], image: "/IMG_6393.jpg", link: "https://github.com/charan2319/Road-Accident-Analysis-Dashboard" }
];

const ProjectCarousel = ({ onSelect }) => {
  return (
    <div className="proj-flat-stack">
      {projectsList.map((proj, i) => (
        <div
          key={proj.title}
          className={`proj-flat-slide${i === projectsList.length - 1 ? ' last' : ''}`}
        >
          <ProjectCard {...proj} onClick={onSelect} />
        </div>
      ))}
    </div>
  );
};

function App() {
  const [visibleSkills, setVisibleSkills] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const [certViewImg, setCertViewImg] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  // Parallax setup for Hero Section

  // Parallax setup for Hero Section
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, 30]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'home') {
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper) {
        wrapper.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;

    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'achievements', 'contact'];
      let current = 'home';
      
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = sections[i];
          }
        }
      }
      
      if (wrapper.scrollTop < 150) {
        current = 'home';
      }
      
      setActiveSection(current);
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'about', label: 'About', icon: 'fas fa-user' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-code' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-briefcase' },
    { id: 'achievements', label: 'Awards', icon: 'fas fa-trophy' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  // Parallax state for hero background
  // const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.className = "light-mode";
    localStorage.removeItem("darkMode");
  }, []);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen) {
        const navbar = document.querySelector('.custom-navbar');
        if (navbar && !navbar.contains(e.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Handle Scroll Locking for Project Detail View
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);

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
    <div className="page-wrapper">
      {/* ===== Universal Top Header ===== */}
      <nav className="desktop-header">
        <div className="header-container">
          <div className="logo-container desktop-only">
            <span className="header-logo">MC</span>
          </div>
          <ul className="desktop-nav-menu">
            {navItems.map((item) => (
              <li key={item.id} className={`nav-item-wrapper ${item.id === 'about' || item.id === 'achievements' ? 'desktop-only' : ''}`}>
                <a 
                  href={item.id === 'home' ? '#' : `#${item.id}`}
                  className={activeSection === item.id ? 'active-link' : 'inactive-link'}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {activeSection === item.id && (
                    <motion.div 
                      layoutId="desktop-pill" 
                      className="desktop-active-pill" 
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="nav-text">
                    <i className={`${item.icon} header-item-icon`}></i>
                    <span className="header-item-label">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>


{/* ===== Premium Split Hero Section ===== */}
      <motion.header 
        className="hero-section custom-hero split-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-3d-bg">
          <div className="clean-bg"></div>
          <div className="subtle-glow">
            <div className="glow-effect glow-1"></div>
            <div className="glow-effect glow-2"></div>
            <div className="glow-effect glow-3"></div>
          </div>
        </div>
        
        <div className="hero-content-wrapper">
          <motion.div 
            className="hero-left-image"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <img src="/IMG_5281.jpg" alt="Maruveni Charan" className="profile-img-full" />
          </motion.div>
          
          <motion.div className="hero-right-text" style={{ y: heroTextY }}>
            <h1 className="hero-title" style={{ overflow: "hidden" }}>
              <WordReveal text="Hi, I'm" delayOffset={0} /> <br className="mobile-break" />
              <WordReveal text="Maruveni Charan" delayOffset={2} />
            </h1>
            
            <h2 className="hero-subtitle" style={{ overflow: "hidden" }}>
              <WordReveal text="Data Analyst | App Developer | UI/UX Designer" delayOffset={5} />
            </h2>
            
            <motion.p 
              className="hero-desc"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, ease: "easeOut" }}
            >
              Passionate about crafting intuitive digital experiences — from designing elegant interfaces in Figma to building multi-platform apps and transforming data into actionable insights.
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, ease: "easeOut" }}
            >
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#contact" className="btn btn-outline">Contact Me</motion.a>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/charan_app_developer.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                View Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        

      </motion.header>

      {/* ===== Bento Grid Section (About + Skills + Stats) ===== */}
      <section className="bento-section" id="about">
        <div className="bento-header">
          <h2 className="section-title">Overview</h2>
        </div>
        
        <div className="bento-grid">
          {/* Bio Box */}
          <motion.div 
            className="bento-box bento-bio"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3>About Me</h3>
            <p>
              I am a dedicated <strong>Computer Science student</strong> at Alliance University with a focus on <strong>iOS development</strong> and <strong>Data Analytics</strong>. My passion lies in crafting seamless digital experiences and deriving powerful insights from data to solve real-world challenges.
            </p>
            <p>
              By combining technical proficiency in Python and Swift with a strategic approach to data visualization in Power BI, I build applications that are as functional as they are intuitive.
            </p>
          </motion.div>

          {/* Stats Boxes */}
          <motion.div className="bento-box bento-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="stat-number">8.1</div>
            <div className="stat-label">CGPA</div>
          </motion.div>
          <motion.div className="bento-box bento-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="stat-number">3+</div>
            <div className="stat-label">Projects</div>
          </motion.div>
          <motion.div className="bento-box bento-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="stat-number">5+</div>
            <div className="stat-label">Tech Stack</div>
          </motion.div>
        </div>
      </section>

      
      {/* ===== Premium Single-Row Skills Marquee Section ===== */}
      <section className="skills-section premium-skills" id="skills" style={{ overflow: "hidden", padding: "25px 0 40px" }}>
        <div className="section-header-center" style={{ marginBottom: "20px" }}>
          <h2 className="section-title" style={{ marginBottom: "20px" }}>Technical Skills</h2>
        </div>
        
        {/* Professional Grid for Laptop View */}
        <div className="skills-grid-desktop desktop-only">
          {[
            { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
            { name: "Swift", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg" },
            { name: "Flutter", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
            { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
            { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
            { name: "Power BI", src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
            { name: "Excel", src: "/Excel.jpg" },
            { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
            { name: "Figma", src: "/figma.png" },
            { name: "Sketch", src: "/sketch.svg" },
            { name: "VS Code", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
            { name: "Xcode", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xcode/xcode-original.svg" }
          ].map((skill, index) => (
            <motion.div 
              key={index}
              className="professional-skill-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
            >
              <img src={skill.src} alt={skill.name} className="professional-skill-icon" />
              <span className="professional-skill-name">{skill.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Mobile Technical Skills Section */}
        <div className="mobile-only mobile-skills-container">
          <div className="skills-grid-mobile">
            {[
              { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
              { name: "Swift", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg" },
              { name: "Flutter", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
              { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
              { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
              { name: "Power BI", src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
              { name: "Excel", src: "/Excel.jpg" },
              { name: "GitHub", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
              { name: "Figma", src: "/figma.png" },
              { name: "Sketch", src: "/sketch.svg" },
              { name: "VS Code", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
              { name: "Xcode", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xcode/xcode-original.svg" }
            ].map((skill, index) => (
              <motion.div 
                key={index}
                className="mobile-skill-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="mobile-skill-icon-wrapper">
                  <img src={skill.src} alt={skill.name} className="mobile-skill-icon" />
                </div>
                <span className="mobile-skill-name">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Projects Section ===== */}
      <section className="projects-section pro-projects-section" id="projects">
        <div className="section-header-center">
          <h2 className="pro-projects-title">Featured Work</h2>
        </div>
        
        <ProjectCarousel onSelect={setSelectedProject} />
      </section>

      {/* ===== Services I Offer Section ===== */}
      <section className="services-section" id="services">
        <div className="section-header-center">
          <h2 className="section-title">Services I Offer</h2>
        </div>
        {/* Desktop View: Grid */}
        <div className="pro-services-grid desktop-only">
          {servicesData.map((service, idx) => (
            <motion.div 
              key={idx} 
              className="pro-service-card" 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }} 
              whileHover={{ y: -5 }}
            >
              <div className="pro-service-icon-bg">
                {service.isImg ? (
                  <img src={service.icon} alt={service.title} style={{width: "40px", height: "40px"}} />
                ) : (
                  <span className="pro-service-icon">{service.icon}</span>
                )}
              </div>
              <h3 className="pro-service-title">{service.title}</h3>
              <p className="pro-service-desc">{service.description}</p>
              <ul className="pro-service-list">
                {service.list && service.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Swipable Slider */}
        <div className="mobile-only">
          <ServiceSlider services={servicesData} />
        </div>
      </section>

      {/* ===== Education Journey Section ===== */}
      <section className="bg-glass-section" id="education">
        <div className="section-header-center">
          <h2 className="section-title">Education Journey</h2>
        </div>
        <div className="ultra-premium-timeline">
          {[
            { year: '2022 – 2026', title: 'B.Tech — Computer Science & Engineering', sub: 'Alliance University', detail: 'CGPA: 8.1', icon: 'fas fa-graduation-cap' },
            { year: '2022', title: '12th Grade', sub: 'Amaravathi Jr. College', detail: 'Percentage: 76%', icon: 'fas fa-school' },
            { year: '2020', title: '10th Grade', sub: 'PCMR EM School', detail: 'Percentage: 100%', icon: 'fas fa-award' }
          ].map((item, i) => (
            <motion.div key={i} className="ultra-timeline-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div className="ultra-timeline-icon">
                <i className={item.icon}></i>
              </div>
              <div className="ultra-timeline-content">
                <div className="ultra-timeline-year">{item.year}</div>
                <h3 className="ultra-timeline-title">{item.title}</h3>
                <div className="ultra-timeline-sub">{item.sub}</div>
                <div className="ultra-timeline-desc">{item.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Internship Experience Section ===== */}
      <section className="bg-glass-section" id="experience">
        <div className="section-header-center">
          <h2 className="section-title">Internship Experience</h2>
        </div>
        <div className="ultra-premium-timeline">
          <motion.div className="ultra-timeline-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="ultra-timeline-icon exp-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="ultra-timeline-content">
              <div className="ultra-timeline-header">
                <div>
                  <div className="ultra-timeline-year">Jan 2025 – Jun 2025</div>
                  <h3 className="ultra-timeline-title">Centre of Excellence — iOS App Development</h3>
                  <div className="ultra-timeline-sub">Alliance University &nbsp;·&nbsp; Internship</div>
                </div>
                <span className="ultra-type-badge">Internship</span>
              </div>
              <ul className="ultra-timeline-bullets">
                <li>Focused on iOS app development using Swift, Firebase, and Xcode.</li>
                <li>Built expertise in mobile app architecture, UI design, and backend integration.</li>
              </ul>
              <div className="pro-tech-tags" style={{marginTop: '16px'}}>
                <span>Swift</span><span>Firebase</span><span>Xcode</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Certifications Section ===== */}
      <section className="bg-glass-section" id="certifications">
        <div className="section-header-center" style={{ position: 'relative', zIndex: 10, marginBottom: '20px' }}>
          <h2 className="section-title">Certifications</h2>
        </div>
        <div className="cert-premium-grid">
          {certificationsData.map((cert, i) => (
            <motion.div
              key={i}
              className="cert-premium-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="cert-premium-img-wrap cert-pdf-wrap">
                <div className="cert-pdf-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
              </div>
              <div className="cert-premium-body">
                <span className="cert-cat-badge">{cert.cat}</span>
                <h4 className="cert-premium-title">{cert.name}</h4>
                <div className="cert-premium-meta">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span className="cert-year">{cert.year}</span>
                </div>
                <motion.button
                  className="cert-view-btn"
                  onClick={() => window.open(cert.pdf, '_blank')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Certification &#8594;
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Achievements Section ===== */}
      <section className="bg-glass-section" id="achievements">
        <div className="section-header-center" style={{ position: 'relative', zIndex: 10, marginBottom: '20px' }}>
          <h2 className="section-title">Achievements</h2>
        </div>
        <div className="unified-premium-grid">
          {[
            {
              badge: "Winner",
              title: "Application Hackathon — E-Cell",
              org: "Alliance University · 2025",
              desc: 'Developed "Stady", a dynamic web application providing educational resources and collaboration tools for students.'
            },
            {
              badge: "Winner",
              title: "Tackathon — Smart India Hackathon",
              org: "Alliance University · 2025",
              desc: "Developed an AI-Based Internship Recommendation Engine for PM Internship Scheme to match students with internships."
            },
            {
              badge: "Runner-up",
              title: "Runner-up in Cultural Events",
              org: "Alliance University · 2025",
              desc: "Achieved 2nd place in Alliance 2.0 cultural competitions for teamwork and creativity."
            }
          ].map((ach, i) => (
            <motion.div
              key={i}
              className="unified-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="unified-card-top">
                <span className="unified-badge highlight-badge">
                  <i className="fas fa-trophy" style={{marginRight: '6px'}}></i> {ach.badge}
                </span>
              </div>
              <h3 className="unified-title">{ach.title}</h3>
              <div className="unified-subtitle">{ach.org}</div>
              <div className="unified-desc">{ach.desc}</div>
            </motion.div>
          ))}
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
        <div className="contact-grid">
          {/* Left Column: Text & Headers */}
          <div className="contact-left-text">
            <h2 className="contact-heading">Get In Touch</h2>
            <div className="contact-divider"></div>
            <p className="contact-subtitle">
              I'm always open to discussing new opportunities, creative UI/UX design projects, or mobile app development ventures.
            </p>
            <p className="contact-desc-detail">
              Whether you're looking for a skilled UI/UX Designer or an App Developer to bring your product ideas to life, interested in collaborating on a creative venture, or just want to connect, I'd love to hear from you.
            </p>
          </div>

          {/* Right Column: Card with Info */}
          <div className="contact-right-card">
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

        {/* ===== Simplified Footer Integrated Inside Contact Section ===== */}
        <footer className="portfolio-footer">
          <div className="footer-container">
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Maruveni Charan. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </section>

      {/* ===== Project Detail Modal ===== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="project-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="project-page-view"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Internal Project Header / Navigation */}
              <div className="project-page-nav">
                <button className="project-back-btn" onClick={() => setSelectedProject(null)}>
                  <i className="fas fa-arrow-left"></i>
                  <span>Back to Portfolio</span>
                </button>
                <div className="project-nav-title">{selectedProject.title}</div>
              </div>
              
              <div className="project-page-content">
                <div className="project-page-container">
                  <div className="project-page-hero">
                    {selectedProject.video ? (
                      <video 
                        src={selectedProject.video} 
                        autoPlay 
                        muted 
                        loop 
                        controls 
                        className="project-hero-media"
                      />
                    ) : (
                      <img src={selectedProject.image} alt={selectedProject.title} className="project-hero-media" />
                    )}
                  </div>
                  
                  <div className="project-page-info">
                    <div className="modal-tag-row">
                      <span className={`pro-project-category-tag ${selectedProject.category.className}`}>
                        {selectedProject.category.name}
                      </span>
                    </div>
                    <h1 className="project-page-title">{selectedProject.title}</h1>
                    
                    <div className="project-page-grid-details">
                      <div className="project-info-section">
                        <h4 className="modal-section-title">Project Overview</h4>
                        <p className="modal-description">{selectedProject.desc}</p>
                      </div>

                      <div className="project-info-section">
                        <h4 className="modal-section-title">Technologies Used</h4>
                        <div className="modal-tech-tags">
                          {selectedProject.tech.map((t, i) => (
                            <span key={i} className="modal-tech-tag">{t}</span>
                          ))}
                        </div>
                      </div>

                      {selectedProject.link && (
                        <div className="project-page-actions">
                          <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="modal-action-btn">
                            Visit Website <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;