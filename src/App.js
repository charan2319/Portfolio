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


const AnimatedCounter = ({ value, duration = 900, isDecimal = false, suffix = "" }) => {
  const [count, setCount] = useState(isDecimal ? "0.0" : "0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const targetValue = parseFloat(value);
    let startTimestamp = null;
    let animationFrameId;

    // Smooth cubic ease-out for a natural, premium deceleration
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = easedProgress * targetValue;

      if (isDecimal) {
        setCount(currentVal.toFixed(1));
      } else {
        setCount(Math.round(currentVal).toString());
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(isDecimal ? targetValue.toFixed(1) : targetValue.toString());
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startTimestamp = null;
          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [value, duration, isDecimal, hasAnimated]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}>
      {count}{suffix}
    </span>
  );
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
            if (entry.isIntersecting) {
              setIsInView(true);
              if (observer) {
                observer.disconnect();
              }
            }
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

// Reusable Animation Variants for premium transitions
const bentoContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const skillsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

const skillCardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -3 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const certContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const certLeftCardVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const certRightCardVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const achievementContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const achievementCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const contactLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
  }
};

const contactContainerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
};

const contactCardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
  }
};

const footerContainerVariants = {
  hidden: {},
  visible: {}
};

const footerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 1, 0.5, 1]
    }
  }
};

const footerNameWrapVariants = {
  hidden: {},
  visible: {}
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      y: { duration: 1.4, ease: [0.25, 1, 0.5, 1], delay: index * 0.12 },
      scale: { duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: index * 0.12 }
    }
  })
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

// Word Reveal Component — staggered word-by-word entrance for a premium feel
const WordReveal = ({ text, className, delayOffset = 0 }) => {
  const words = text.split(" ");

  return (
    <div className={className} style={{ display: "inline" }}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          style={{ display: "inline-block", marginRight: "0.25em" }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: (delayOffset + index) * 0.08,
            ease: [0.25, 1, 0.5, 1]
          }}
        >
          {word === "Charan" || word === "Maruveni" ? (
            <span className="hero-gradient">{word}</span>
          ) : (
            word
          )}
        </motion.span>
      ))}
    </div>
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

const modernProjectsList = [
  {
    num: "01",
    category: "FEATURED PROJECT",
    title: "Founder's Mart",
    desc: "For the ones who build. A digital space for the entrepreneurship community at Alliance University.",
    tags: "E-Cell × Alliance University",
    image: "/hero.png",
    link: "http://www.ecellstore.com",
    bg: "#f3f4f6"
  },
  {
    num: "02",
    category: "APP DEVELOPMENT",
    title: "Alliance Alumni Connect",
    desc: "A Flutter app bridging the gap between alumni, students, and the university to foster a thriving community network.",
    tags: "Flutter  /  Firebase  /  Cloudinary",
    image: "/Alumni.PNG",
    link: null,
    bg: "#fcfaf7"
  },
  {
    num: "03",
    category: "APP DEVELOPMENT",
    title: "Mymedicare",
    desc: "An iOS application that sends timely medication reminders to users, helping them maintain their health routines with smart notification features.",
    tags: "Swift  /  Firebase  /  Xcode",
    image: "/unnamed-1.jpg",
    video: "/VIDEO-2025-11-22-23-56-57.MP4",
    link: null,
    bg: "#f4f6f8"
  },
  {
    num: "04",
    category: "DATA ANALYTICS",
    title: "Road Accident Analysis Dashboard",
    desc: "A comprehensive Power BI dashboard analyzing road accident trends, patterns, and contributing factors to provide actionable insights for traffic safety.",
    tags: "Power BI",
    image: "/IMG_6393.jpg",
    link: "https://github.com/charan2319/Road-Accident-Analysis-Dashboard",
    bg: "#fdf6f2"
  }
];

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
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96
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
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
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
        const targetScrollTop = wrapper.scrollTop + elementRect.top - wrapperRect.top;

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
      const sections = ['about', 'projects', 'services', 'skills', 'experience', 'education', 'certifications', 'achievements', 'contact'];
      let current = 'home';

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 250) {
            current = sections[i];
          }
        }
      }

      if (wrapper.scrollTop < 120) {
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
      {/* ===== New Modern Header (Matching Design) ===== */}
      <nav className="mc-navbar">
        <div className="mc-navbar-container">
          <a href="#" className="mc-logo-brand" onClick={(e) => handleNavClick(e, 'home')}>
            <span className="mc-logo-symbol">mc.</span>
            <div className="mc-brand-text">
              <span className="mc-brand-name">MARUVENI CHARAN</span>
              <span className="mc-brand-tagline">Design × Development × Data</span>
            </div>
          </a>

          <div className="mc-nav-right">
            <ul className="mc-nav-links">
              <li>
                <a
                  href="#projects"
                  className={activeSection === 'projects' ? 'mc-nav-link active' : 'mc-nav-link'}
                  onClick={(e) => handleNavClick(e, 'projects')}
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className={activeSection === 'about' ? 'mc-nav-link active' : 'mc-nav-link'}
                  onClick={(e) => handleNavClick(e, 'about')}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className={activeSection === 'experience' ? 'mc-nav-link active' : 'mc-nav-link'}
                  onClick={(e) => handleNavClick(e, 'experience')}
                >
                  Experience
                </a>
              </li>
            </ul>

            <a
              href="#contact"
              className="mc-talk-btn"
              onClick={(e) => handleNavClick(e, 'contact')}
            >
              <span>Let's talk</span>
              <span className="mc-btn-arrow">↗</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ===== Redesigned Hero Section (Matching Image 1) ===== */}
      <header className="mc-hero-section" id="home">
        <div className="mc-hero-container">
          {/* Left Column: Hero Text */}
          <motion.div
            className="mc-hero-left"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-hero-kicker">HELLO, I'M CHARAN</div>

            <h1 className="mc-hero-title">
              <span className="mc-hero-title-sans">Design. Develop.</span>
              <span className="mc-hero-title-serif">Decode.</span>
            </h1>

            <p className="mc-hero-desc">
              Intuitive interfaces. Thoughtful apps. Actionable insights.<br />
              I connect design, development and data to create<br />
              digital experiences that make sense.
            </p>

            <div className="mc-hero-actions">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#projects"
                className="mc-btn mc-btn-primary"
                onClick={(e) => handleNavClick(e, 'projects')}
              >
                <span>Explore my work</span>
                <span className="mc-btn-arrow">↗</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="/charan_app_developer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn mc-btn-secondary"
              >
                <span>View resume</span>
                <span className="mc-btn-arrow">↗</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Hero Profile Card */}
          <motion.div
            className="mc-hero-right"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-profile-card">
              <div className="mc-profile-frame">
                <img
                  src="/IMG_5281.jpg"
                  alt="Maruveni Charan"
                  className="mc-profile-photo"
                />
              </div>
              <div className="mc-profile-caption">
                <span className="mc-caption-name">MARUVENI CHARAN</span>
                <span className="mc-caption-location">Bengaluru, India</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sub-Hero Ticker / Divider Bar */}
        <div className="mc-subhero-bar">
          <div className="mc-subhero-container">
            <div className="mc-subhero-roles">
              <span>DATA ANALYST</span>
              <span className="mc-subhero-slash">/</span>
              <span>APP DEVELOPER</span>
              <span className="mc-subhero-slash">/</span>
              <span>UI/UX DESIGNER</span>
            </div>

            <a
              href="#about"
              className="mc-subhero-scroll"
              onClick={(e) => handleNavClick(e, 'about')}
            >
              <span>SCROLL TO DISCOVER</span>
              <span className="mc-scroll-arrow">↓</span>
            </a>
          </div>
        </div>
      </header>

      {/* ===== Redesigned About Section (Matching Image 1: A LITTLE ABOUT ME) ===== */}
      <section className="mc-section mc-about-section" id="about">
        <div className="mc-container">
          <div className="mc-kicker">A LITTLE ABOUT ME</div>

          <div className="mc-about-grid">
            {/* Left Column: Headline */}
            <motion.div
              className="mc-about-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mc-about-title">
                Curiosity is the<br />
                common thread.
              </h2>
              <p className="mc-about-subtitle">
                A designer's eye. A developer's mindset.
              </p>
            </motion.div>

            {/* Right Column: Bio & Stats */}
            <motion.div
              className="mc-about-right"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mc-about-narrative">
                I am a dedicated Computer Science graduate from Alliance University with a focus on iOS development and Data Analytics. My passion lies in crafting seamless digital experiences and deriving powerful insights from data to solve real-world challenges.
              </p>

              <div className="mc-stats-row">
                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <AnimatedCounter value="8.1" isDecimal={true} />
                  </div>
                  <div className="mc-stat-label">CGPA</div>
                </div>

                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <AnimatedCounter value="4" suffix="+" />
                  </div>
                  <div className="mc-stat-label">PROJECTS</div>
                </div>

                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <AnimatedCounter value="10" suffix="+" />
                  </div>
                  <div className="mc-stat-label">TECH STACK</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Projects Section (Matching New Design) ===== */}
      <section className="mc-section mc-projects-section" id="projects">
        <div className="mc-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">PROJECTS</span>
              <h2 className="mc-section-title">Ideas, made real.</h2>
            </div>
            <div className="mc-section-header-right">
              <p className="mc-section-subtitle">
                Four projects. Different challenges.<br />
                One thoughtful approach to building.
              </p>
            </div>
          </div>

          <div className="mc-projects-grid">
            {modernProjectsList.map((project, index) => (
              <motion.div
                key={index}
                className="mc-project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={`mc-project-media-box ${project.video ? 'has-video-trigger' : ''}`}
                  style={{ backgroundColor: project.bg }}
                  onClick={() => project.video && openVideoModal(project.video)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="mc-project-img"
                  />
                  {project.video && (
                    <div className="mc-project-play-badge">
                      <i className="fas fa-play"></i> Watch Demo
                    </div>
                  )}
                </div>

                <div className="mc-project-body">
                  <div className="mc-project-meta">
                    <span className="mc-project-num">{project.num}</span>
                    <span className="mc-project-sep">/</span>
                    <span className="mc-project-category">{project.category}</span>
                  </div>

                  <h3 className="mc-project-title">{project.title}</h3>
                  <p className="mc-project-desc">{project.desc}</p>
                  <div className="mc-project-tags">{project.tags}</div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mc-project-visit-link"
                    >
                      <span>Visit work</span>
                      <span className="mc-visit-arrow">↗</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Services / What I Bring Section (Matching New Design) ===== */}
      <section className="mc-section mc-services-section" id="services">
        <div className="mc-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">WHAT I BRING</span>
              <h2 className="mc-section-title">One mind. Many possibilities.</h2>
            </div>
            <div className="mc-section-header-right">
              <p className="mc-section-subtitle">From the first sketch to the final build.</p>
            </div>
          </div>
        </div>
        {/* Desktop View: 3D Coverflow */}
        <Desktop3DServices services={servicesData} />

        {/* Mobile View: Swipable Slider */}
        <div className="mobile-only">
          <ServiceSlider services={servicesData} />
        </div>
      </section>

      {/* ===== Redesigned Toolkit Section (Matching New Design) ===== */}
      <section className="mc-section mc-toolkit-section" id="skills">
        <div className="mc-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">THE TOOLKIT</span>
              <h2 className="mc-section-title">The tools behind the thinking.</h2>
            </div>
            <div className="mc-section-header-right">
              <span className="mc-section-subtitle">10+ technologies. One connected approach.</span>
            </div>
          </div>

          <div className="mc-toolkit-grid">
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
                className="mc-toolkit-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="mc-toolkit-icon-wrap">
                  <img src={skill.src} alt={skill.name} className="mc-toolkit-icon" />
                </div>
                <span className="mc-toolkit-name">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Redesigned Experience Section (Matching Image 1) ===== */}
      <section className="mc-section mc-experience-section" id="experience">
        <div className="mc-container mc-experience-container">
          <div className="mc-experience-grid">
            {/* Left Column: Heading */}
            <div className="mc-experience-left">
              <span className="mc-kicker">EXPERIENCE</span>
              <h2 className="mc-experience-title">
                Learning by<br />
                building.
              </h2>
            </div>

            {/* Vertical Blue Line Divider */}
            <div className="mc-experience-divider"></div>

            {/* Right Column: Experience Details */}
            <div className="mc-experience-right">
              <div className="mc-exp-meta-bar">
                <span className="mc-exp-date">FEB 2026 — APR 2026</span>
                <span className="mc-exp-type">INTERNSHIP</span>
              </div>

              <h3 className="mc-exp-role">iOS App Development</h3>
              <div className="mc-exp-company">Alliance University</div>

              <p className="mc-exp-desc">
                Completed hands-on training in iOS development using Swift and Xcode. Built mobile applications with UI/UX design principles, integrated Firebase for backend and real-time data handling, and developed functional prototypes with improved app performance.
              </p>

              <div className="mc-exp-tags">
                <span>SWIFT</span>
                <span className="mc-tag-slash">/</span>
                <span>FIREBASE</span>
                <span className="mc-tag-slash">/</span>
                <span>XCODE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Education Section (Matching Image 2) ===== */}
      <section className="mc-section mc-education-section" id="education">
        <div className="mc-container mc-education-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">EDUCATION</span>
              <h2 className="mc-section-title">A foundation for what’s next.</h2>
            </div>
            <div className="mc-section-header-right">
              <p className="mc-section-subtitle">The journey so far.</p>
            </div>
          </div>

          <div className="mc-education-grid">
            <div className="mc-edu-card">
              <div className="mc-edu-year">2022 — 2026</div>
              <h3 className="mc-edu-degree">
                B.Tech — Computer Science<br />
                & Engineering
              </h3>
              <div className="mc-edu-institution">Alliance University</div>
              <div className="mc-edu-grade">8.1 CGPA</div>
            </div>

            <div className="mc-edu-card">
              <div className="mc-edu-year">2022</div>
              <h3 className="mc-edu-degree">12th Grade</h3>
              <div className="mc-edu-institution">Amaravathi Jr. College</div>
              <div className="mc-edu-grade">76%</div>
            </div>

            <div className="mc-edu-card">
              <div className="mc-edu-year">2020</div>
              <h3 className="mc-edu-degree">10th Grade</h3>
              <div className="mc-edu-institution">PCMR EM School</div>
              <div className="mc-edu-grade">100%</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Certifications Section (Matching Image) ===== */}
      <section className="mc-section mc-certifications-section" id="certifications">
        <div className="mc-container mc-certifications-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">CERTIFICATIONS</span>
              <h2 className="mc-section-title">Always a student.</h2>
            </div>
            <div className="mc-section-header-right">
              <span className="mc-certifications-count">04 CREDENTIALS</span>
            </div>
          </div>

          <div className="mc-certifications-grid">
            <div className="mc-cert-col">
              <a
                href="/iOS_certification.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-cert-item"
              >
                <div className="mc-cert-item-text">
                  <h3 className="mc-cert-item-name">App Development with Swift Certified User</h3>
                  <span className="mc-cert-item-issuer">Apple / 2025</span>
                </div>
                <span className="mc-cert-arrow">↗</span>
              </a>

              <a
                href="/python.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-cert-item"
              >
                <div className="mc-cert-item-text">
                  <h3 className="mc-cert-item-name">Data Analysis with Python</h3>
                  <span className="mc-cert-item-issuer">Coursera / 2024</span>
                </div>
                <span className="mc-cert-arrow">↗</span>
              </a>
            </div>

            <div className="mc-cert-col">
              <a
                href="/Excel.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-cert-item"
              >
                <div className="mc-cert-item-text">
                  <h3 className="mc-cert-item-name">Excel</h3>
                  <span className="mc-cert-item-issuer">Infosys / 2025</span>
                </div>
                <span className="mc-cert-arrow">↗</span>
              </a>

              <a
                href="/powerbi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-cert-item"
              >
                <div className="mc-cert-item-text">
                  <h3 className="mc-cert-item-name">Power BI for Business Professionals</h3>
                  <span className="mc-cert-item-issuer">Infosys / 2025</span>
                </div>
                <span className="mc-cert-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Achievements Section (Matching Image) ===== */}
      <section className="mc-section mc-achievements-section" id="achievements">
        <div className="mc-container mc-achievements-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">ACHIEVEMENTS</span>
              <h2 className="mc-section-title">Small wins. Lasting momentum.</h2>
            </div>
            <div className="mc-section-header-right">
              <p className="mc-section-subtitle">Alliance University · 2025</p>
            </div>
          </div>

          <div className="mc-achievements-grid">
            <div className="mc-achievement-card">
              <span className="mc-achievement-badge">WINNER</span>
              <h3 className="mc-achievement-title">Application Hackathon — E-Cell</h3>
              <p className="mc-achievement-desc">
                Developed "Stady", a dynamic web application providing educational resources and collaboration tools for students.
              </p>
            </div>

            <div className="mc-achievement-card">
              <span className="mc-achievement-badge">WINNER</span>
              <h3 className="mc-achievement-title">Tackathon — Smart India Hackathon</h3>
              <p className="mc-achievement-desc">
                Developed an AI-based Internship Recommendation Engine for the PM Internship Scheme to match students with internships.
              </p>
            </div>

            <div className="mc-achievement-card">
              <span className="mc-achievement-badge">RUNNER-UP</span>
              <h3 className="mc-achievement-title">Cultural Events</h3>
              <p className="mc-achievement-desc">
                Achieved 2nd place in Alliance 2.0 cultural competitions for teamwork and creativity.
              </p>
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

      {/* ===== Redesigned Contact Section (Matching Image) ===== */}
      <section className="mc-section mc-contact-section" id="contact">
        <div className="mc-container mc-contact-container">
          <span className="mc-kicker">LET'S CONNECT</span>

          <div className="mc-contact-grid">
            <div className="mc-contact-left">
              <h2 className="mc-contact-title">
                <span className="mc-contact-title-sans">Have an idea?</span>
                <span className="mc-contact-title-serif">Let’s make it real.</span>
              </h2>
              <p className="mc-contact-desc">
                I'm always open to new opportunities, creative UI/UX design projects, mobile app development, or a good conversation.
              </p>
            </div>

            <div className="mc-contact-right">
              <a href="mailto:charanm2319@gmail.com" className="mc-contact-row">
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">EMAIL</span>
                  <span className="mc-contact-val">charanm2319@gmail.com</span>
                </div>
                <span className="mc-contact-arrow">↗</span>
              </a>

              <a href="tel:+918639839229" className="mc-contact-row">
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">PHONE</span>
                  <span className="mc-contact-val">+91 8639839229</span>
                </div>
                <span className="mc-contact-arrow">↗</span>
              </a>

              <div className="mc-contact-row">
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">BASED IN</span>
                  <span className="mc-contact-val">Bengaluru, Karnataka, India</span>
                </div>
                <span className="mc-contact-arrow">↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Footer (Matching Image) ===== */}
      <footer className="mc-footer">
        <div className="mc-container mc-footer-container">
          <div className="mc-footer-big-brand">
            <span className="mc-footer-name">CHARAN</span>
            <div className="mc-footer-star">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#264df3">
                <path d="M12 0c.7 0 1.3.6 1.3 1.3v6.4l4.5-4.5c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L15.1 9.5h6.4c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3h-6.4l4.5 4.5c.5.5.5 1.3 0 1.8s-1.3.5-1.8 0L13.3 14v6.4c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3V14l-4.5 4.5c-.5.5-1.3.5-1.8 0s-.5-1.3 0-1.8l4.5-4.5H2.5C1.8 12.2 1.2 11.6 1.2 10.9s.6-1.3 1.3-1.3h6.4L4.4 5.1c-.5-.5-.5-1.3 0-1.8s1.3-.5 1.8 0l4.5 4.5V1.3C10.7.6 11.3 0 12 0z"/>
              </svg>
            </div>
          </div>

          <div className="mc-footer-bottom">
            <div className="mc-footer-copy">© 2026 Maruveni Charan. All rights reserved.</div>
            <div className="mc-footer-socials">
              <a
                href="https://linkedin.com/in/maruveni-charan-631766281"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://github.com/charan2319"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.hackerrank.com/profile/charanm2319"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HackerRank"
              >
                <i className="fab fa-hackerrank"></i>
              </a>
              <a
                href="mailto:charanm2319@gmail.com"
                aria-label="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <a href="#" className="mc-footer-back-to-top" onClick={(e) => handleNavClick(e, 'home')}>
              <span>BACK TO TOP</span>
              <span className="mc-top-arrow">↑</span>
            </a>
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