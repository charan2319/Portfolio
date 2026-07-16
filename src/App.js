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


const AnimatedCounter = ({ value, duration = 1500, isDecimal = false, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;
    const targetValue = parseFloat(value);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = progress * targetValue;
      setCount(isDecimal ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTimestamp = null;
          animationFrameId = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(animationFrameId);
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [value, duration, isDecimal]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ScrollRevealTitle = ({ children, className, style }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let observer = null;
    const timer = setTimeout(() => {
      const scrollContainer = document.querySelector('.page-wrapper');
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsInView(entry.isIntersecting);
          });
        },
        { 
          root: scrollContainer || null,
          threshold: 0.05,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <motion.h2
      ref={ref}
      className={className}
      style={style}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 35
      }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.h2>
  );
};

const ProjectCard = ({ title, category, desc, tech, image, video, link, onClick, disableAnimation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleOpen = () => onClick({ title, category, desc, tech, image, video, link });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      className="pro-project-card premium-card"
      initial={disableAnimation ? { opacity: 1, y: 0, scale: 1 } : (isMobile ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.95 })}
      whileInView={disableAnimation ? { opacity: 1, y: 0, scale: 1 } : (isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 })}
      transition={disableAnimation ? { duration: 0 } : { duration: isMobile ? 0.3 : 0.6, ease: [0.25, 1, 0.5, 1] }}
      viewport={disableAnimation ? undefined : { once: false, amount: 0.15 }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="pro-project-media">
        {!isMobile && isHovered && video ? (
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

// Word Reveal Component — simplified to a single fade-in (no per-word stagger blink)
const WordReveal = ({ text, className, delayOffset = 0 }) => {
  const words = text.split(" ");

  return (
    <motion.div
      style={{ display: "inline-block" }}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delayOffset * 0.05, ease: "easeOut" }}
    >
      {text === "Maruveni Charan" ? (
        <span className="hero-gradient">{text}</span>
      ) : (
        words.map((word, index) => (
          <span key={index} style={{ display: "inline-block", marginRight: "0.25em" }}>
            {word === "Charan" || word === "Maruveni" ? (
              <span className="hero-gradient">{word}</span>
            ) : (
              word
            )}
          </span>
        ))
      )}
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
        <div className="slider-track-inner">
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
              scale = 0.92;      // Smaller card size
              opacity = 0.95;    // Highly visible!
              x = 35;            // Offset to the right side so it peeks out clearly
              zIndex = 9;
            } else if (relativeIndex === 2) {
              scale = 0.84;      // Even smaller card size
              opacity = 0.60;    // Moderately visible
              x = 70;            // Offset further to the right to be clearly visible
              zIndex = 8;
            } else if (relativeIndex === services.length - 1) {
              // The card that was just active exits to the left side
              scale = 0.90;
              opacity = 0;
              x = -400;          // Exit left animation
              zIndex = 12;       // Keeps it on top during swipe exit
            } else {
              scale = 0.80;
              opacity = 0;
              x = 100;
              zIndex = 1;
            }

            return (
              <motion.div
                key={idx}
                className={`premium-slider-card ${isCenter ? 'active' : 'inactive'}`}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x < -60) handleNext();
                  else if (offset.x > 60) handlePrev();
                }}
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
                    <img src={service.icon} alt={service.title} style={{ width: "45px", height: "45px" }} />
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
        </div>
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

const Desktop3DServices = ({ services }) => {
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLargeDesktop = screenWidth > 1200;
  const isMediumDesktop = screenWidth > 992;

  // Custom horizontal fan-out offsets so their bottom edges touch beautifully
  // Custom horizontal fan-out offsets so their bottom edges touch beautifully
  const offsetsX = isLargeDesktop
    ? [-300, -100, 100, 300]
    : isMediumDesktop
      ? [-280, -93, 93, 280]
      : [-260, -87, 87, 260];

  const rotY = [0, 0, 0, 0];
  const rotZ = [-16, -5, 5, 16]; // Bended slightly more for clearer top gaps
  const yOffset = [24, -12, -12, 24]; // Middle cards go up, side cards go down!
  const zOffset = [0, 0, 0, 0];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  return (
    <motion.div
      className="pro-services-3d-stage desktop-only"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      {services.map((service, idx) => {
        const cardVariants = {
          hidden: {
            opacity: 0,
            x: 0,
            y: 0,
            rotateY: 0,
            rotateZ: 0,
            z: -150,
            scale: 0.82,
          },
          visible: {
            opacity: 1,
            x: offsetsX[idx],
            y: yOffset[idx],
            rotateY: rotY[idx],
            rotateZ: rotZ[idx],
            z: zOffset[idx],
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 85,
              damping: 17,
              mass: 1.1
            }
          }
        };

        return (
          <motion.div
            key={idx}
            className={`pro-service-card-3d service-theme-card-${idx}`}
            variants={cardVariants}
            style={{ transformOrigin: "bottom center" }}
            whileHover={{
              scale: 1.05,
              z: 120,
              y: -30,
              rotateY: 0,
              rotateZ: 0,
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.18)",
              transition: { type: "spring", stiffness: 120, damping: 20 }
            }}
          >
            <div className="pro-service-icon-bg">
              {service.isImg ? (
                <img src={service.icon} alt={service.title} style={{ width: "42px", height: "42px" }} />
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
  );
};

const projectsList = [
  { title: "Founder's Mart", category: { name: 'E-Commerce', className: 'web-dev' }, desc: "A full-stack e-commerce platform built for efficient product management and an optimized shopping experience.", tech: ['React', 'Node.js', 'PostgreSQL'], image: "/hero.png", link: "http://www.ecellstore.com" },
  { title: "Alliance Alumni Connect", category: { name: 'App Development', className: 'app-dev' }, desc: "A Flutter app bridging the gap between alumni, students, and the university to foster a thriving community network.", tech: ['Flutter', 'Firebase', 'Cloudinary'], image: "/Alumni.PNG" },
  { title: "Mymedicare", category: { name: 'App Development', className: 'app-dev' }, desc: "An iOS application that sends timely medication reminders to users, helping them maintain their health routines with smart notification features.", tech: ['Swift', 'Firebase', 'Xcode'], image: "/unnamed-1.jpg", video: "/VIDEO-2025-11-22-23-56-57.MP4" },
  { title: "Road Accident Analysis Dashboard", category: { name: 'Data Analytics', className: 'data-analytics' }, desc: "A comprehensive Power BI dashboard analyzing road accident trends, patterns, and contributing factors to provide actionable insights for traffic safety.", tech: ['Power BI'], image: "/IMG_6393.jpg", link: "https://github.com/charan2319/Road-Accident-Analysis-Dashboard" }
];

const ProjectSlider = ({ onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projectsList.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projectsList.length) % projectsList.length);
  };

  const selectProject = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const activeProject = projectsList[currentIndex];

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextProject();
    } else if (info.offset.x > swipeThreshold) {
      prevProject();
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="project-slider-container">
      <div className="project-slider-wrapper">
        <button className="slider-arrow prev-arrow" onClick={prevProject} aria-label="Previous Project">
          <i className="fas fa-chevron-left"></i>
        </button>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="single-project-card"
          >
            <div className="project-card-media-panel">
              {activeProject.video ? (
                <div className="project-video-wrapper">
                  <video
                    src={activeProject.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="project-slider-video"
                  />
                  <div className="video-ambient-glow"></div>
                </div>
              ) : (
                <img src={activeProject.image} alt={activeProject.title} className="project-slider-image" />
              )}
            </div>

            <div className="project-card-info-panel">
              <h3 className="project-slider-title">{activeProject.title}</h3>
              
              <div className="project-slider-actions">
                <button className="btn-slider-primary" onClick={() => onSelect(activeProject)}>
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button className="slider-arrow next-arrow" onClick={nextProject} aria-label="Next Project">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="slider-dots">
        {projectsList.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => selectProject(idx)}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>
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

    const wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;

    if (id === 'home') {
      wrapper.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        // Determine header height offset based on responsive screen widths
        const headerOffset = window.innerWidth <= 768 ? 60 : 0;
        const targetScrollTop = wrapper.scrollTop + elementRect.top - wrapperRect.top - headerOffset;

        wrapper.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
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
          <ScrollRevealTitle className="section-title">Overview</ScrollRevealTitle>
        </div>

        <div className="bento-grid">
          {/* Bio Box */}
          <div className="bento-box bento-bio">
            <h3>About Me</h3>
            <p>
              I am a dedicated <strong>Computer Science graduate</strong> from Alliance University with a focus on <strong>iOS development</strong> and <strong>Data Analytics</strong>. My passion lies in crafting seamless digital experiences and deriving powerful insights from data to solve real-world challenges.
            </p>
            <p>
              By combining technical proficiency in Python and Swift with a strategic approach to data visualization in Power BI, I build applications that are as functional as they are intuitive.
            </p>
          </div>

          {/* Stats Boxes */}
          <div className="bento-box bento-stat">
            <div className="stat-number">
              <AnimatedCounter value="8.1" isDecimal={true} />
            </div>
            <div className="stat-label">CGPA</div>
          </div>
          <div className="bento-box bento-stat">
            <div className="stat-number">
              <AnimatedCounter value="4" suffix="+" />
            </div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="bento-box bento-stat">
            <div className="stat-number">
              <AnimatedCounter value="10" suffix="+" />
            </div>
            <div className="stat-label">Tech Stack</div>
          </div>
        </div>
      </section>


      {/* ===== Premium Single-Row Skills Marquee Section ===== */}
      <section className="skills-section premium-skills" id="skills" style={{ overflow: "hidden", padding: "25px 0 40px" }}>
        {/* Large card wrapping all skills inside it */}
        <div className="skills-outer-card">
          <div className="section-header-center" style={{ marginBottom: "30px" }}>
            <ScrollRevealTitle className="section-title">Technical Skills</ScrollRevealTitle>
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
                whileHover={{ y: -5, scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}
              >
                <img src={skill.src} alt={skill.name} className="professional-skill-icon" />
                <span className="professional-skill-name">{skill.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Mobile Technical Skills Section */}
          <div className="mobile-only mobile-skills-container">
            <motion.div
              className="skills-grid-mobile"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
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
                <div
                  key={index}
                  className="mobile-skill-card"
                >
                  <div className="mobile-skill-icon-wrapper">
                    <img src={skill.src} alt={skill.name} className="mobile-skill-icon" />
                  </div>
                  <span className="mobile-skill-name">{skill.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Projects Section ===== */}
      <section className="projects-section pro-projects-section" id="projects">
        <div className="section-header-center">
          <ScrollRevealTitle className="pro-projects-title">Featured Work</ScrollRevealTitle>
        </div>

        <ProjectSlider onSelect={setSelectedProject} />
      </section>

      {/* ===== Services I Offer Section ===== */}
      <section className="services-section" id="services">
        <div className="section-header-center">
          <ScrollRevealTitle className="section-title">Services I Offer</ScrollRevealTitle>
        </div>
        {/* Desktop View: 3D Coverflow */}
        <Desktop3DServices services={servicesData} />

        {/* Mobile View: Swipable Slider */}
        <div className="mobile-only">
          <ServiceSlider services={servicesData} />
        </div>
      </section>

      {/* ===== Education Journey Section ===== */}
      <section className="bg-glass-section" id="education">
        <div className="section-header-center">
          <ScrollRevealTitle className="section-title">Education Journey</ScrollRevealTitle>
        </div>
        <div className="ultra-premium-timeline">
          {[
            { year: '2022 – 2026', title: 'B.Tech — Computer Science & Engineering', sub: 'Alliance University', detail: 'CGPA: 8.1', icon: 'fas fa-graduation-cap' },
            { year: '2022', title: '12th Grade', sub: 'Amaravathi Jr. College', detail: 'Percentage: 76%', icon: 'fas fa-school' },
            { year: '2020', title: '10th Grade', sub: 'PCMR EM School', detail: 'Percentage: 100%', icon: 'fas fa-award' }
          ].map((item, i) => (
            <motion.div key={i} className="ultra-timeline-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: i * 0.15 }}>
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
          <ScrollRevealTitle className="section-title">Internship Experience</ScrollRevealTitle>
        </div>
        <div className="ultra-premium-timeline">
          <motion.div className="ultra-timeline-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: 0.1 }}>
            <div className="ultra-timeline-icon exp-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="ultra-timeline-content">
              <div className="ultra-timeline-header">
                <div>
                  <div className="ultra-timeline-year">Feb 2026 – Apr 2026</div>
                  <h3 className="ultra-timeline-title">iOS App Development</h3>
                  <div className="ultra-timeline-sub">Alliance University &nbsp;·&nbsp; Internship</div>
                </div>
                <span className="ultra-type-badge">Internship</span>
              </div>
              <ul className="ultra-timeline-bullets">
                <li>Completed hands-on training in iOS development using Swift and Xcode.</li>
                <li>Built mobile applications with UI/UX design principles.</li>
                <li>Integrated Firebase for backend and real-time data handling.</li>
                <li>Developed functional prototypes and improved app performance.</li>
              </ul>
              <div className="pro-tech-tags" style={{ marginTop: '16px' }}>
                <span>Swift</span><span>Firebase</span><span>Xcode</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Certifications Section ===== */}
      <section className="bg-glass-section" id="certifications">
        <div className="section-header-center" style={{ position: 'relative', zIndex: 10, marginBottom: '24px' }}>
          <ScrollRevealTitle className="section-title">Certifications</ScrollRevealTitle>
        </div>
        <motion.div
          className="cert-bento-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {certificationsData.map((cert, i) => (
            <motion.div
              key={i}
              className={`cert-bento-item cert-bento-item-${i}`}
              whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="cert-bento-media-wrap">
                <img src={cert.image} alt={cert.name} className="cert-bento-img" />
              </div>
              <div className="cert-bento-body">
                <h3 className="cert-bento-title">{cert.name}</h3>
                <div className="cert-bento-meta">
                  <span className="cert-bento-issuer">{cert.issuer}</span>
                  <span className="cert-bento-year">{cert.year}</span>
                </div>
                <motion.button
                  className="cert-bento-btn"
                  onClick={() => window.open(cert.pdf, '_blank')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Certificate →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== Achievements Section ===== */}
      <section className="bg-glass-section" id="achievements">
        <div className="section-header-center" style={{ position: 'relative', zIndex: 10, marginBottom: '20px' }}>
          <ScrollRevealTitle className="section-title">Achievements</ScrollRevealTitle>
        </div>
        <motion.div
          className="unified-premium-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
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
              whileHover={{ y: -6 }}
            >
              <div className="unified-card-top">
                <span className="unified-badge highlight-badge">
                  <i className="fas fa-trophy" style={{ marginRight: '6px' }}></i> {ach.badge}
                </span>
              </div>
              <h3 className="unified-title">{ach.title}</h3>
              <div className="unified-subtitle">{ach.org}</div>
              <div className="unified-desc">{ach.desc}</div>
            </motion.div>
          ))}
        </motion.div>
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
            <ScrollRevealTitle className="contact-heading">Get In Touch</ScrollRevealTitle>
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

          </div>
        </div>
      </section>

      {/* ===== Premium Mega Footer ===== */}
      <footer className="mega-footer">
        <div className="mega-footer-inner">
          {/* Giant Name */}
          <div className="mega-footer-name-wrap">
            <h2 className="mega-footer-name">
              {["C", "H", "A", "R", "A", "N"].map((letter, index) => (
                <motion.span
                  key={index}
                  style={{ display: "inline-block" }}
                  initial={{ opacity: 0, y: 70, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                    ease: [0.34, 1.56, 0.64, 1] // Custom elastic spring ease for bounce
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* Tagline */}
          <motion.p
            className="mega-footer-tagline"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Data Analyst · App Developer · UI/UX Designer
          </motion.p>

          {/* Navigation Links */}
          <motion.div
            className="mega-footer-nav"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <a href="#" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
            <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>Skills</a>
            <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
            <a href="#achievements" onClick={(e) => handleNavClick(e, 'achievements')}>Achievements</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="mega-footer-socials"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <a href="https://linkedin.com/in/maruveni-charan-631766281" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com/charan2319" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.hackerrank.com/profile/charanm2319" target="_blank" rel="noopener noreferrer" aria-label="HackerRank">
              <i className="fab fa-hackerrank"></i>
            </a>
            <a href="mailto:charanm2319@gmail.com" aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </motion.div>

          {/* Divider */}
          <div className="mega-footer-divider"></div>

          {/* Copyright Bar */}
          <div className="mega-footer-bottom">
            <p>© {new Date().getFullYear()} Maruveni Charan. All rights reserved.</p>
          </div>
        </div>
      </footer>

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