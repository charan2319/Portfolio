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


const AnimatedCounter = ({ value, duration = 1000, isDecimal = false, suffix = "" }) => {
  const targetValue = parseFloat(value) || 0;
  const [count, setCount] = useState("0");
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    let animationFrameId;
    let startTimestamp = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const runCounter = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = easedProgress * targetValue;

        if (progress < 1) {
          setCount(isDecimal ? currentVal.toFixed(1) : Math.round(currentVal).toString());
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(isDecimal ? targetValue.toFixed(1) : targetValue.toString());
        }
      };

      animationFrameId = requestAnimationFrame(step);
    };

    const checkVisibility = () => {
      if (animatedRef.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= vh * 0.95 && rect.bottom >= 0) {
        runCounter();
      }
    };

    // Check immediately on mount
    checkVisibility();

    // Listen to scroll events on both wrapper and window
    const wrapper = document.querySelector('.page-wrapper') || window;
    wrapper.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('scroll', checkVisibility, { passive: true });

    // Fallback: If not triggered within 400ms, start animation so it NEVER gets stuck at 0
    const fallbackTimer = setTimeout(() => {
      if (!animatedRef.current) {
        runCounter();
      }
    }, 400);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
      wrapper.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [targetValue, duration, isDecimal]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}>
      {count}{suffix}
    </span>
  );
};

/* ===== Clean High-Tech Dot-Matrix Glyphs ===== */
const DOT_GLYPHS = {
  "8": [
    " 111 ",
    "1   1",
    "1   1",
    " 111 ",
    "1   1",
    "1   1",
    " 111 "
  ],
  ".": [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "1"
  ],
  "3": [
    " 111 ",
    "1   1",
    "    1",
    "  11 ",
    "    1",
    "1   1",
    " 111 "
  ],
  "4": [
    "   1 ",
    "  11 ",
    " 1 1 ",
    "1  1 ",
    "11111",
    "   1 ",
    "   1 "
  ],
  "5": [
    "11111",
    "1    ",
    "1111 ",
    "    1",
    "    1",
    "1   1",
    " 111 "
  ],
  "+": [
    "     ",
    "  1  ",
    "  1  ",
    "11111",
    "  1  ",
    "  1  ",
    "     "
  ],
  "1": [
    " 1 ",
    "11 ",
    " 1 ",
    " 1 ",
    " 1 ",
    " 1 ",
    "111"
  ],
  "0": [
    " 111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ]
};

/* ===== Sleek Diagonal Arrow Component (Renders sharp vector across mobile & laptop) ===== */
const ArrowUpRight = ({ className = "" }) => (
  <svg
    className={`mc-editorial-arrow ${className}`}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path
      d="M3 11L11 3M11 3H5.5M11 3V8.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ===== Playful Dot-Matrix Number Component ===== */
const PlayfulDotNumber = ({ text, width = 140, height = 78 }) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef(null);
  const animIdRef = useRef(null);

  const initDots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const spacing = 9.2;
    const dotRadius = 3.2;

    // Calculate total character width in columns
    let totalCols = 0;
    const charDefs = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const glyph = DOT_GLYPHS[ch];
      if (!glyph) continue;
      const cols = glyph[0].length;
      charDefs.push({ glyph, cols });
      totalCols += cols;
      if (i < text.length - 1) {
        totalCols += (ch === "." || text[i + 1] === ".") ? 1.2 : 2.0;
      }
    }

    const totalWidthPx = (totalCols - 1) * spacing;
    const startX = Math.max(dotRadius + 4, (width - totalWidthPx) / 2);
    const startY = Math.max(dotRadius + 4, (height - (7 - 1) * spacing) / 2);

    const newDots = [];
    let currentCol = 0;

    for (let i = 0; i < charDefs.length; i++) {
      const { glyph, cols } = charDefs[i];

      for (let r = 0; r < 7; r++) {
        const rowStr = glyph[r];
        for (let c = 0; c < cols; c++) {
          if (rowStr[c] === "1") {
            const hX = startX + (currentCol + c) * spacing;
            const hY = startY + r * spacing;

            const scatterAngle = Math.random() * Math.PI * 2;
            const scatterDist = Math.random() * 14 + 3;

            newDots.push({
              homeX: hX,
              homeY: hY,
              x: hX + Math.cos(scatterAngle) * scatterDist,
              y: hY + Math.sin(scatterAngle) * scatterDist,
              vx: 0,
              vy: 0,
              baseRadius: dotRadius,
              radius: dotRadius,
            });
          }
        }
      }

      currentCol += cols;
      if (i < charDefs.length - 1) {
        currentCol += (text[i] === "." || text[i + 1] === ".") ? 1.2 : 2.0;
      }
    }

    dotsRef.current = newDots;
  };

  useEffect(() => {
    initDots();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const mouse = mouseRef.current;
      const dots = dotsRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (mouse) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 44;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist);
            const angle = Math.atan2(dy, dx);
            const push = force * 4.6;
            dot.vx += Math.cos(angle) * push;
            dot.vy += Math.sin(angle) * push;
            dot.radius = dot.baseRadius * (1 + force * 0.7);
          }
        }

        const spring = 0.12;
        const friction = 0.76;
        dot.vx += (dot.homeX - dot.x) * spring;
        dot.vy += (dot.homeY - dot.y) * spring;
        dot.vx *= friction;
        dot.vy *= friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        dot.radius += (dot.baseRadius - dot.radius) * 0.12;

        const displacement = Math.hypot(dot.x - dot.homeX, dot.y - dot.homeY);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(1, dot.radius), 0, Math.PI * 2);

        if (displacement > 2.0) {
          ctx.fillStyle = "#264df3";
          ctx.shadowColor = "rgba(38, 77, 243, 0.75)";
          ctx.shadowBlur = 7;
        } else if (displacement > 0.8) {
          ctx.fillStyle = "#3b82f6";
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "#0f172a";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.restore();
      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [text, width, height]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = null;
  };

  const handleClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    dotsRef.current.forEach((dot) => {
      const dx = dot.x - clickX;
      const dy = dot.y - clickY;
      const dist = Math.hypot(dx, dy);
      if (dist < 56) {
        const force = (1 - dist / 56) * 9.5;
        const angle = Math.atan2(dy, dx);
        dot.vx += Math.cos(angle) * force;
        dot.vy += Math.sin(angle) * force;
      }
    });
  };

  const handleTouchMove = (e) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  };

  const handleTouchEnd = () => {
    mouseRef.current = null;
  };

  return (
    <div
      className="mc-playful-dot-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      title="Hover or click to play!"
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <span className="sr-only">{text}</span>
    </div>
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
    category: "WEB DEVELOPMENT & DESIGN",
    title: "Shivohara Technologies",
    desc: "Designed and developed the corporate web platform for Shivohara Technologies, showcasing enterprise software engineering and cybersecurity solutions.",
    tags: "Web Design  /  UI/UX  /  Frontend",
    image: "/shivohara.png",
    link: "https://www.shivoharatechnologies.com/",
    bg: "#ffffff"
  },
  {
    num: "03",
    category: "APP DEVELOPMENT",
    title: "Alliance Alumni Connect",
    desc: "A Flutter app bridging the gap between alumni, students, and the university to foster a thriving community network.",
    tags: "Flutter  /  Firebase  /  Cloudinary",
    image: "/Alumni.PNG",
    link: null,
    bg: "#fcfaf7"
  },
  {
    num: "04",
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
    num: "05",
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
  { title: "Shivohara Technologies", category: { name: 'Web Development', className: 'web-dev' }, desc: "Designed and developed the corporate web platform for Shivohara Technologies, showcasing enterprise software engineering and cybersecurity solutions.", tech: ['Web Design', 'UI/UX', 'React', 'Frontend'], image: "/shivohara.png", link: "https://www.shivoharatechnologies.com/" },
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

/* ===== Zigzag Education Curved Timeline Component ===== */
const EducationZigzagTimeline = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const entryCoordsRef = useRef({
    pExpTop: null,
    pExpBottom: null,
    p0: null,
    p2: null,
    pCertKicker: null,
    pCertS: null,
    pCertDot: null,
  });

  const [pathD, setPathD] = useState("");
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
  const [orbOpacity, setOrbOpacity] = useState(1);
  const [orbScale, setOrbScale] = useState(1);
  const [orbAngle, setOrbAngle] = useState(0);
  const [isAirplane, setIsAirplane] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  const cards = [
    {
      id: "btech",
      side: "left",
      year: "2022 — 2026",
      degree: (
        <>
          B.Tech — Computer Science<br />
          & Engineering
        </>
      ),
      institution: "Alliance University",
      grade: "8.3 CGPA",
    },
    {
      id: "grade12",
      side: "right",
      year: "2022",
      degree: "12th Grade",
      institution: "Amaravathi Jr. College",
      grade: "76%",
    },
    {
      id: "grade10",
      side: "left",
      year: "2020",
      degree: "10th Grade",
      institution: "PCMR EM School",
      grade: "100%",
    },
  ];

  // Recalculate curved SVG path connecting cards with a rounded wave crest
  const updateSvgPath = () => {
    if (
      !containerRef.current ||
      !cardRefs[0].current ||
      !cardRefs[1].current ||
      !cardRefs[2].current
    ) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const r0 = cardRefs[0].current.getBoundingClientRect();
    const r1 = cardRefs[1].current.getBoundingClientRect();
    const r2 = cardRefs[2].current.getBoundingClientRect();

    const isMobile = window.innerWidth <= 768;

    const buildFlightSegment = (start, end, radius, flip = -1, isFirst = true) => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 10) return isFirst ? `M ${start.x} ${start.y} L ${end.x} ${end.y}` : `L ${end.x} ${end.y}`;

      const ux = dx / dist;
      const uy = dy / dist;
      const nx = -uy * flip;
      const ny = ux * flip;

      const W = (u, n) => ({
        x: Number((start.x + u * ux + n * nx).toFixed(2)),
        y: Number((start.y + u * uy + n * ny).toFixed(2)),
      });

      const uMid = dist * 0.48;
      const nCenter = radius * 1.30;
      const k = radius * 0.55228;

      const uIn = Math.max(0, uMid - radius * 2.0);
      const uOut = Math.min(dist, uMid + radius * 2.0);

      const pIn = W(uIn, 0);
      const cp1 = W(uMid - radius * 0.8, 0);
      const cp2 = W(uMid + radius, nCenter - radius * 0.6);
      const pRight = W(uMid + radius, nCenter);

      const pTop = W(uMid, nCenter + radius);
      const cpTop1 = W(uMid + radius, nCenter + k);
      const cpTop2 = W(uMid + k, nCenter + radius);

      const pLeft = W(uMid - radius, nCenter);
      const cpLeft1 = W(uMid - k, nCenter + radius);
      const cpLeft2 = W(uMid - radius, nCenter + k);

      const pOut = W(uOut, 0);
      const cp3 = W(uMid - radius, nCenter - radius * 0.6);
      const cp4 = W(uMid + radius * 0.8, 0);

      const prefix = isFirst ? `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} ` : "";
      return (
        `${prefix}` +
        `L ${pIn.x} ${pIn.y} ` +
        `C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${pRight.x} ${pRight.y} ` +
        `C ${cpTop1.x} ${cpTop1.y}, ${cpTop2.x} ${cpTop2.y}, ${pTop.x} ${pTop.y} ` +
        `C ${cpLeft1.x} ${cpLeft1.y}, ${cpLeft2.x} ${cpLeft2.y}, ${pLeft.x} ${pLeft.y} ` +
        `C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${pOut.x} ${pOut.y} ` +
        `L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
      );
    };

    let p0, p1, p2, p1In, p1Out, cornerD, R;

    if (!isMobile) {
      // Desktop: anchor at middle of side borders
      p0 = {
        x: r0.right - cRect.left,
        y: r0.top + r0.height / 2 - cRect.top,
      };
      p1 = {
        x: r1.left - cRect.left,
        y: r1.top + r1.height / 2 - cRect.top,
      };
      p2 = {
        x: r2.right - cRect.left,
        y: r2.top + r2.height / 2 - cRect.top,
      };

      R = Math.min(38, Math.max(30, Math.abs(p1.x - p0.x) * 0.14));

      const d1x = p1.x - p0.x;
      const d1y = p1.y - p0.y;
      const len1 = Math.hypot(d1x, d1y);
      const u1x = d1x / len1;
      const u1y = d1y / len1;

      const d2x = p2.x - p1.x;
      const d2y = p2.y - p1.y;
      const len2 = Math.hypot(d2x, d2y);
      const u2x = d2x / len2;
      const u2y = d2y / len2;

      const filletR = Math.min(55, len1 * 0.15, len2 * 0.15);
      p1In = {
        x: p1.x - u1x * filletR,
        y: p1.y - u1y * filletR,
      };
      p1Out = {
        x: p1.x + u2x * filletR,
        y: p1.y + u2y * filletR,
      };

      const cpCorner1 = {
        x: Number((p1In.x + u1x * (filletR * 0.55)).toFixed(2)),
        y: Number((p1In.y + u1y * (filletR * 0.55)).toFixed(2)),
      };
      const cpCorner2 = {
        x: Number((p1Out.x - u2x * (filletR * 0.55)).toFixed(2)),
        y: Number((p1Out.y - u2y * (filletR * 0.55)).toFixed(2)),
      };
      cornerD = `C ${cpCorner1.x} ${cpCorner1.y}, ${cpCorner2.x} ${cpCorner2.y}, ${p1Out.x.toFixed(2)} ${p1Out.y.toFixed(2)}`;
    } else {
      // Mobile calculation: loop radius scaled for mobile screen gap
      R = 20;

      // Card 0 (Left): exit from bottom-right border area
      p0 = {
        x: r0.right - cRect.left - 6,
        y: r0.bottom - cRect.top - 12,
      };

      // Card 1 (Right): enter near top-left, sweep down along left border
      p1In = {
        x: r1.left - cRect.left + 4,
        y: r1.top - cRect.top + 16,
      };
      p1Out = {
        x: r1.left - cRect.left + 4,
        y: r1.bottom - cRect.top - 16,
      };

      // Gentle curve along the left flank of Card 1
      const cp1y = r1.top - cRect.top + r1.height * 0.35;
      const cp2y = r1.top - cRect.top + r1.height * 0.65;
      cornerD = `C ${p1In.x - 6} ${cp1y}, ${p1Out.x - 6} ${cp2y}, ${p1Out.x.toFixed(2)} ${p1Out.y.toFixed(2)}`;

      // Card 2 (Left): enter near top-right
      p2 = {
        x: r2.right - cRect.left - 6,
        y: r2.top - cRect.top + 16,
      };
    }

    // Store Experience divider and Certifications target coordinates
    const expDiv = document.querySelector(".mc-experience-divider");
    const kickerEl = document.querySelector(".mc-cert-kicker-c");
    const studentWordEl = document.querySelector(".mc-cert-student-word");
    const sEl = document.querySelector(".mc-cert-student-s");
    const dotEl = document.querySelector(".mc-cert-dot");
    const eduEl = document.getElementById("education");
    const certEl = document.getElementById("certifications");

    const yLine1 = eduEl ? eduEl.getBoundingClientRect().top - cRect.top : -160;
    const yLine2 = certEl ? certEl.getBoundingClientRect().top - cRect.top : cRect.height + 70;

    let pExpTop = { x: p0.x, y: p0.y - 240 };
    let pExpBottom = { x: p0.x, y: p0.y - 100 };

    if (expDiv) {
      const expRect = expDiv.getBoundingClientRect();
      pExpTop = {
        x: expRect.left + expRect.width / 2 - cRect.left,
        y: expRect.top - cRect.top,
      };
      pExpBottom = {
        x: expRect.left + expRect.width / 2 - cRect.left,
        y: expRect.bottom - cRect.top,
      };
    }

    const pCertKicker = kickerEl ? {
      x: kickerEl.getBoundingClientRect().left + kickerEl.getBoundingClientRect().width / 2 - cRect.left,
      y: kickerEl.getBoundingClientRect().top - cRect.top - 14,
    } : { x: 50, y: cRect.height + 100 };

    const pCertS = sEl ? {
      x: sEl.getBoundingClientRect().left + sEl.getBoundingClientRect().width / 2 - cRect.left,
      y: (studentWordEl ? studentWordEl.getBoundingClientRect().top : sEl.getBoundingClientRect().top) - cRect.top - 14,
    } : { x: 180, y: cRect.height + 140 };

    const pCertStudentEnd = studentWordEl ? {
      x: studentWordEl.getBoundingClientRect().right - cRect.left - 4,
      y: studentWordEl.getBoundingClientRect().top - cRect.top - 14,
    } : { x: 280, y: cRect.height + 140 };

    const pCertDot = dotEl ? {
      x: dotEl.getBoundingClientRect().left + dotEl.getBoundingClientRect().width / 2 - cRect.left,
      y: dotEl.getBoundingClientRect().top + dotEl.getBoundingClientRect().height / 2 - cRect.top,
    } : { x: 310, y: cRect.height + 165 };

    entryCoordsRef.current = {
      pExpTop,
      pExpBottom,
      p0: { x: p0.x, y: p0.y },
      p2: {
        x: isMobile ? (r2.right - cRect.left - 6) : p2.x,
        y: isMobile ? (r2.bottom - cRect.top - 12) : p2.y
      },
      pCertKicker,
      pCertS,
      pCertStudentEnd,
      pCertDot,
      yLine1,
      yLine2,
    };

    if (currentProgressRef.current <= -1.0) {
      const t = Math.max(0, Math.min(1, currentProgressRef.current + 2.0));
      setOrbPos({
        x: pExpTop.x,
        y: pExpTop.y + t * (pExpBottom.y - pExpTop.y),
      });
    }

    const seg1 = buildFlightSegment(p0, p1In, R, -1, true);
    const seg2 = buildFlightSegment(p1Out, p2, R, 1, false);

    // Continuous, smooth aerodynamic timeline path with zero sharp vertices:
    setPathD(`${seg1} ${cornerD} ${seg2}`);
  };

  useEffect(() => {
    updateSvgPath();
    const timer1 = setTimeout(updateSvgPath, 150);
    const timer2 = setTimeout(updateSvgPath, 600);

    window.addEventListener("resize", updateSvgPath);
    window.addEventListener("load", updateSvgPath);

    let ro = null;
    if (window.ResizeObserver && containerRef.current) {
      ro = new ResizeObserver(() => updateSvgPath());
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", updateSvgPath);
      window.removeEventListener("load", updateSvgPath);
      if (ro) ro.disconnect();
    };
  }, []);

  // Update total length and initial orb position when path string updates
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        setTotalLength(len);
        if (len > 0 && currentProgressRef.current >= 0) {
          const d = Math.max(0, Math.min(1, currentProgressRef.current)) * len;
          const pt = pathRef.current.getPointAtLength(d);
          setOrbPos({ x: pt.x, y: pt.y });
          const d1 = Math.max(0, d - 3);
          const d2 = Math.min(len, d + 3);
          const pA = pathRef.current.getPointAtLength(d1);
          const pB = pathRef.current.getPointAtLength(d2);
          setOrbAngle(Math.atan2(pB.y - pA.y, pB.x - pA.x) * (180 / Math.PI));
        }
      } catch (e) {}
    }
  }, [pathD]);

  // Smooth lerp animation loop for traveling blue indicator
  useEffect(() => {
    const loop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0008) {
        currentProgressRef.current += diff * 0.085;
        setProgress(currentProgressRef.current);

        const p = currentProgressRef.current;

        // Opacity: fade in smoothly when reaching Experience from above
        if (p < -2.0) {
          const op = Math.max(0, 1 - (-2.0 - p) * 3);
          setOrbOpacity(op);
        } else if (p <= 1.7) {
          setOrbOpacity(1);
        }

        // 1. If p < -1.0: indicator travels straight down along the Experience vertical blue line
        if (p < -1.0) {
          setIsAirplane(false);
          const t = Math.max(0, Math.min(1, p + 2.0));
          const { pExpTop, pExpBottom } = entryCoordsRef.current;
          if (pExpTop && pExpBottom) {
            setOrbPos({
              x: pExpTop.x,
              y: pExpTop.y + t * (pExpBottom.y - pExpTop.y),
            });
            setOrbScale(1.0);
          }
        } else if (p < 0) {
          // 2. If -1.0 <= p < 0: Indicator travels smoothly through the air from bottom of Experience blue line down to B.Tech
          const t = Math.max(0, Math.min(1, p + 1.0));
          const { pExpBottom, p0, yLine1 = -160, yLine2 = 1200 } = entryCoordsRef.current;
          if (pExpBottom && p0) {
            const dy = p0.y - pExpBottom.y;
            const c0 = { x: pExpBottom.x, y: pExpBottom.y + dy * 0.45 };
            const c1 = { x: p0.x + 35, y: p0.y - dy * 0.20 };
            const u = 1 - t;
            const x = u*u*u * pExpBottom.x + 3*u*u*t * c0.x + 3*u*t*t * c1.x + t*t*t * p0.x;
            const y = u*u*u * pExpBottom.y + 3*u*u*t * c0.y + 3*u*t*t * c1.y + t*t*t * p0.y;
            setOrbPos({ x, y });
            setOrbScale(1.0);

            // Compute tangent angle for aeroplane flight heading
            const vx = 3*u*u * (c0.x - pExpBottom.x) + 6*u*t * (c1.x - c0.x) + 3*t*t * (p0.x - c1.x);
            const vy = 3*u*u * (c0.y - pExpBottom.y) + 6*u*t * (c1.y - c0.y) + 3*t*t * (p0.y - c1.y);
            setOrbAngle(Math.atan2(vy, vx) * (180 / Math.PI));

            // Becomes aeroplane once crossing the top section line entering Education
            setIsAirplane(y >= yLine1 && y <= yLine2);
          }
        } else if (p <= 1.0) {
          // 3. Once at B.Tech or beyond, follow the Education path with Aeroplane
          setIsAirplane(true);
          if (pathRef.current && totalLength > 0) {
            try {
              const d = Math.max(0, Math.min(1, p)) * totalLength;
              const pt = pathRef.current.getPointAtLength(d);
              setOrbPos({ x: pt.x, y: pt.y });

              // Tangent angle for aeroplane flight rotation
              const d1 = Math.max(0, d - 3);
              const d2 = Math.min(totalLength, d + 3);
              const pA = pathRef.current.getPointAtLength(d1);
              const pB = pathRef.current.getPointAtLength(d2);
              const ang = Math.atan2(pB.y - pA.y, pB.x - pA.x) * (180 / Math.PI);
              setOrbAngle(ang);
            } catch (e) {}
          }
          setOrbScale(1.0);
          setOrbOpacity(1.0);
          const dotEl = document.querySelector(".mc-cert-dot");
          if (dotEl) dotEl.classList.remove("is-infused");
        } else {
          // 4. Past 10th Grade (p > 1.0): Traveling into Certifications section!
          const { p2, pCertKicker, pCertS, pCertStudentEnd, pCertDot, yLine1 = -160, yLine2 = 1200 } = entryCoordsRef.current;
          const dotEl = document.querySelector(".mc-cert-dot");

          if (p2 && pCertKicker && pCertS && pCertDot) {
            const pEnd = pCertStudentEnd || { x: pCertDot.x - 12, y: pCertS.y };

            if (p <= 1.35) {
              // 1.0 -> 1.35: Swooping down through the air onto the top of 'C' in CERTIFICATIONS (above letter)
              const t = (p - 1.0) / 0.35;
              const dx = pCertKicker.x - p2.x;
              const dy = pCertKicker.y - p2.y;
              const c0 = { x: p2.x + dx * 0.20, y: p2.y + dy * 0.70 };
              const c1 = { x: pCertKicker.x - dx * 0.20, y: pCertKicker.y - dy * 0.25 };
              const u = 1 - t;
              const x = u*u*u * p2.x + 3*u*u*t * c0.x + 3*u*t*t * c1.x + t*t*t * pCertKicker.x;
              const y = u*u*u * p2.y + 3*u*u*t * c0.y + 3*u*t*t * c1.y + t*t*t * pCertKicker.y;
              setOrbPos({ x, y });
              setOrbScale(1.0);
              setOrbOpacity(1.0);
              if (dotEl) dotEl.classList.remove("is-infused");

              // Compute dive angle for aeroplane
              const vx = 3*u*u * (c0.x - p2.x) + 6*u*t * (c1.x - c0.x) + 3*t*t * (pCertKicker.x - c1.x);
              const vy = 3*u*u * (c0.y - p2.y) + 6*u*t * (c1.y - c0.y) + 3*t*t * (pCertKicker.y - c1.y);
              setOrbAngle(Math.atan2(vy, vx) * (180 / Math.PI));

              // Remains an aeroplane until crossing the bottom section line into Certifications
              setIsAirplane(y >= yLine1 && y <= yLine2);
            } else if (p <= 1.45) {
              setIsAirplane(false);
              // 1.35 -> 1.45: Rolling slightly on top of 'C'
              const t = (p - 1.35) / 0.10;
              const x = pCertKicker.x + t * 16;
              const y = pCertKicker.y;
              setOrbPos({ x, y });
              setOrbScale(1.0);
              setOrbOpacity(1.0);
              if (dotEl) dotEl.classList.remove("is-infused");
            } else if (p <= 1.70) {
              setIsAirplane(false);
              // 1.45 -> 1.70: Roll off 'C' and fall down onto top of 's' in Always a student. (strictly above)
              const t = (p - 1.45) / 0.25;
              const startX = pCertKicker.x + 16;
              const startY = pCertKicker.y;
              const dx = pCertS.x - startX;
              const dy = pCertS.y - startY;
              const c0 = { x: startX + dx * 0.40, y: startY + dy * 0.10 };
              const c1 = { x: pCertS.x - dx * 0.20, y: pCertS.y - dy * 0.40 };
              const u = 1 - t;
              const x = u*u*u * startX + 3*u*u*t * c0.x + 3*u*t*t * c1.x + t*t*t * pCertS.x;
              const y = u*u*u * startY + 3*u*u*t * c0.y + 3*u*t*t * c1.y + t*t*t * pCertS.y;
              setOrbPos({ x, y });
              setOrbScale(1.0);
              setOrbOpacity(1.0);
              if (dotEl) dotEl.classList.remove("is-infused");
            } else if (p <= 1.95) {
              setIsAirplane(false);
              // 1.70 -> 1.95: Roll horizontally along the roof (above) "student"
              const t = (p - 1.70) / 0.25;
              const x = pCertS.x + t * (pEnd.x - pCertS.x);
              // Micro rolling hop on top edge of the letters
              const hop = Math.sin(t * Math.PI * 4) * 1.5;
              const y = pCertS.y - hop;
              setOrbPos({ x, y });
              setOrbScale(1.0);
              setOrbOpacity(1.0);
              if (dotEl) dotEl.classList.remove("is-infused");
            } else if (p <= 2.05) {
              setIsAirplane(false);
              // 1.95 -> 2.05: Reached end of 'student' (above 't'), drop down into '.' and dissolve/mix
              const t = (p - 1.95) / 0.10;
              const dx = pCertDot.x - pEnd.x;
              const dy = pCertDot.y - pCertS.y;
              const u = 1 - t;
              const c0 = { x: pEnd.x + dx * 0.5, y: pCertS.y + dy * 0.1 };
              const c1 = { x: pCertDot.x, y: pCertS.y + dy * 0.7 };
              const x = u*u*u * pEnd.x + 3*u*u*t * c0.x + 3*u*t*t * c1.x + t*t*t * pCertDot.x;
              const y = u*u*u * pCertS.y + 3*u*u*t * c0.y + 3*u*t*t * c1.y + t*t*t * pCertDot.y;
              setOrbPos({ x, y });

              const scale = Math.max(0.1, 1 - t * 0.9);
              const opacity = Math.max(0, 1 - t);
              setOrbScale(scale);
              setOrbOpacity(opacity);

              if (t >= 0.5) {
                if (dotEl) dotEl.classList.add("is-infused");
              } else {
                if (dotEl) dotEl.classList.remove("is-infused");
              }
            } else {
              // p > 2.05: Absorbed and disappeared into the dot
              setOrbPos(pCertDot);
              setOrbScale(0.1);
              setOrbOpacity(0);
              if (dotEl) dotEl.classList.add("is-infused");
            }
          }
        }
      }

      const p = currentProgressRef.current;
      if (p < -0.05) {
        setActiveStep(-1);
      } else if (p < 0.35) {
        setActiveStep(0); // B.Tech active
      } else if (p < 0.85) {
        setActiveStep(1); // 12th Grade active
      } else {
        setActiveStep(2); // 10th Grade active
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [totalLength]);

  // Scroll listener: directly tracks the cards & Certifications section
  useEffect(() => {
    const wrapper = document.querySelector(".page-wrapper") || window;

    const handleScroll = () => {
      if (!cardRefs[0].current || !cardRefs[1].current || !cardRefs[2].current) return;
      const r0 = cardRefs[0].current.getBoundingClientRect();
      const r1 = cardRefs[1].current.getBoundingClientRect();
      const r2 = cardRefs[2].current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Center focus line in viewport
      const focusY = vh * 0.52;

      // Keep entryCoordsRef updated with live target positions
      const kickerEl = document.querySelector(".mc-cert-kicker-c");
      const studentWordEl = document.querySelector(".mc-cert-student-word");
      const sEl = document.querySelector(".mc-cert-student-s");
      const dotEl = document.querySelector(".mc-cert-dot");
      if (kickerEl && sEl && dotEl && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const kRect = kickerEl.getBoundingClientRect();
        const sRect = sEl.getBoundingClientRect();
        const dotRect = dotEl.getBoundingClientRect();
        const wRect = studentWordEl ? studentWordEl.getBoundingClientRect() : sRect;
        entryCoordsRef.current.pCertKicker = {
          x: kRect.left + kRect.width / 2 - cRect.left,
          y: kRect.top - cRect.top - 14,
        };
        entryCoordsRef.current.pCertS = {
          x: sRect.left + sRect.width / 2 - cRect.left,
          y: wRect.top - cRect.top - 14,
        };
        entryCoordsRef.current.pCertStudentEnd = {
          x: wRect.right - cRect.left - 4,
          y: wRect.top - cRect.top - 14,
        };
        entryCoordsRef.current.pCertDot = {
          x: dotRect.left + dotRect.width / 2 - cRect.left,
          y: dotRect.top + dotRect.height / 2 - cRect.top,
        };
        const isMobile = window.innerWidth <= 768;
        entryCoordsRef.current.p0 = {
          x: r0.right - cRect.left - (isMobile ? 6 : 0),
          y: isMobile ? (r0.bottom - cRect.top - 12) : (r0.top + r0.height / 2 - cRect.top),
        };
        entryCoordsRef.current.p2 = {
          x: r2.right - cRect.left - (isMobile ? 6 : 0),
          y: isMobile ? (r2.bottom - cRect.top - 12) : (r2.top + r2.height / 2 - cRect.top),
        };

        const eduEl = document.getElementById("education");
        const certEl = document.getElementById("certifications");
        if (eduEl) {
          entryCoordsRef.current.yLine1 = eduEl.getBoundingClientRect().top - cRect.top;
        }
        if (certEl) {
          entryCoordsRef.current.yLine2 = certEl.getBoundingClientRect().top - cRect.top;
        }
      }

      let p = 0;
      if (r0.top <= focusY) {
        if (r1.top > focusY) {
          // Between B.Tech (p = 0.0) and 12th Grade (p = 0.5)
          const span = Math.max(1, r1.top - r0.top);
          const progressThrough = (focusY - r0.top) / span;
          const t = Math.max(0, Math.min(1, progressThrough));
          p = t * 0.5;
        } else if (r2.top > focusY) {
          // Between 12th Grade (p = 0.5) and 10th Grade (p = 1.0)
          const span = Math.max(1, r2.top - r1.top);
          const progressThrough = (focusY - r1.top) / span;
          const t = Math.max(0, Math.min(1, progressThrough));
          p = 0.5 + t * 0.5;
        } else {
          // Past 10th Grade (r2.top <= focusY): Continuing towards CERTIFICATIONS!
          const certHeader = document.querySelector(".mc-certifications-section .mc-section-header");
          if (certHeader) {
            const certRect = certHeader.getBoundingClientRect();
            const spanToCert = Math.max(1, certRect.top - r2.top);
            const distPastR2 = focusY - r2.top;
            const certProgress = Math.max(0, distPastR2 / spanToCert);

            if (certProgress <= 0.65) {
              // 1.0 -> 1.4: Swoop down to 'C' in CERTIFICATIONS
              const t = Math.min(1.0, certProgress / 0.65);
              p = 1.0 + t * 0.4;
            } else {
              // 1.4 -> 2.0: Roll to 's' and merge into '.'
              const headerProgress = Math.min(1.0, (certProgress - 0.65) / 0.55);
              p = 1.4 + headerProgress * 0.6;
            }
          } else {
            p = 1.0;
          }
        }
      } else {
        // Above B.Tech (r0.top > focusY)
        const expDiv = document.querySelector(".mc-experience-divider");
        if (expDiv) {
          const expRect = expDiv.getBoundingClientRect();
          if (focusY >= expRect.bottom) {
            // Between bottom of Experience divider and B.Tech: p is [-1.0, 0.0]
            const span = Math.max(1, r0.top - expRect.bottom);
            const t = Math.max(0, Math.min(1, (focusY - expRect.bottom) / span));
            p = -1.0 + t * 1.0;
          } else if (focusY >= expRect.top) {
            // Moving down along the Experience divider: p is [-2.0, -1.0]
            const span = Math.max(1, expRect.bottom - expRect.top);
            const t = Math.max(0, Math.min(1, (focusY - expRect.top) / span));
            p = -2.0 + t * 1.0;
          } else {
            // Above the top of the Experience divider
            const distAbove = expRect.top - focusY;
            const t = Math.min(1, distAbove / (vh * 0.35));
            p = -2.0 - t * 0.5;
          }
        } else {
          const dist = r0.top - focusY;
          const maxDist = vh * 0.40;
          const t = Math.max(0, Math.min(1, dist / maxDist));
          p = -t;
        }
      }

      targetProgressRef.current = p;
    };

    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCardClick = (stepIndex) => {
    if (stepIndex === 0) targetProgressRef.current = 0;
    else if (stepIndex === 1) targetProgressRef.current = 0.5;
    else if (stepIndex === 2) targetProgressRef.current = 1.0;
  };

  return (
    <div className="mc-edu-zigzag-container" ref={containerRef}>
      {/* SVG Canvas for curved breaking line and traveling blue orb */}
      <svg className="mc-edu-svg-canvas" aria-hidden="true">
        {pathD && (
          <>
            {/* Background Breaking (dashed) Line with rounded wave crest */}
            <path
              d={pathD}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* Glowing Active Royal Blue Trail */}
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="#264df3"
              strokeWidth="2.5"
              strokeDasharray={totalLength || 1000}
              strokeDashoffset={(totalLength || 1000) * (1 - Math.max(0, Math.min(1, progress)))}
              strokeLinecap="round"
            />

            {/* Traveling indicator: Aeroplane while crossing between Education top line and Certifications top line */}
            {(totalLength > 0 || progress < 0 || progress > 1) && (
              isAirplane ? (
                <g
                  transform={`translate(${orbPos.x}, ${orbPos.y}) rotate(${orbAngle}) scale(${orbScale})`}
                  className="mc-edu-airplane-group"
                  style={{ opacity: orbOpacity, transition: "opacity 0.15s ease" }}
                >
                  {/* Subtle speed trail glow */}
                  <ellipse cx="-8" cy="0" rx="14" ry="5" fill="#38bdf8" opacity="0.4" />
                  <ellipse cx="-4" cy="0" rx="20" ry="9" fill="#264df3" opacity="0.18" />

                  {/* Aerodynamic Aeroplane Vector pointing forward along flight tangent */}
                  <path
                    d="M 18 0 C 13 -1.8, 6 -2.4, 3 -2.4 L -3 -16 C -3.8 -16.5, -5.5 -16, -5 -14.5 L -2 -2.4 L -11 -2.4 L -15 -7.5 C -15.6 -8.2, -17 -7.8, -16.5 -6.5 L -14.5 0 L -16.5 6.5 C -17 7.8, -15.6 8.2, -15 7.5 L -11 2.4 L -2 2.4 L -5 14.5 C -5.5 16, -3.8 16.5, -3 16 L 3 2.4 C 6 2.4, 13 1.8, 18 0 Z"
                    fill="#264df3"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    filter="drop-shadow(0 2px 8px rgba(38, 77, 243, 0.65))"
                  />

                  {/* Cockpit spark */}
                  <circle cx="7" cy="0" r="1.5" fill="#ffffff" />
                </g>
              ) : (
                <g
                  transform={`translate(${orbPos.x}, ${orbPos.y}) scale(${orbScale})`}
                  className="mc-edu-indicator-group"
                  style={{ opacity: orbOpacity, transition: "opacity 0.15s ease" }}
                >
                  {/* Outer Ambient Pulse Aura */}
                  <circle r="22" fill="#264df3" opacity="0.12" className="mc-edu-orb-aura" />

                  {/* Glowing Energy Halo Ring */}
                  <circle
                    r="13"
                    fill="rgba(38, 77, 243, 0.16)"
                    stroke="#264df3"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 0 8px rgba(38, 77, 243, 0.7))"
                  />

                  {/* Dual Orbiting Satellite Accents */}
                  <g className="mc-edu-orb-satellites">
                    <circle cx="0" cy="-13" r="2.2" fill="#38bdf8" />
                    <circle cx="0" cy="13" r="2.2" fill="#38bdf8" />
                  </g>

                  {/* Royal Blue Donut Core */}
                  <circle r="7.5" fill="#264df3" />

                  {/* Crisp White Aperture Spark */}
                  <circle r="3.2" fill="#ffffff" />
                </g>
              )
            )}
          </>
        )}
      </svg>

      {/* Alternating Zigzag Education Cards (without static edge dots) */}
      {cards.map((card, idx) => (
        <div
          key={card.id}
          className={`mc-edu-zigzag-item mc-edu-${card.side} ${activeStep === idx ? "is-active" : ""}`}
          onClick={() => handleCardClick(idx)}
        >
          <div className="mc-edu-card-inner" ref={cardRefs[idx]}>
            <div className="mc-edu-year">{card.year}</div>
            <h3 className="mc-edu-degree">{card.degree}</h3>
            <div className="mc-edu-institution">{card.institution}</div>
            <div className="mc-edu-grade">{card.grade}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Interactive Playful Blueprint Grid with Smooth Cursor Spotlight, Spark Trails & Light Waves
const InteractiveHeroLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = null;
    let isVisible = true;

    // Smooth cursor interpolation
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isActive: false,
    };

    // Expanding light waves on click
    const lightWaves = [];

    // Interactive glowing sparks on grid intersections touched by cursor
    const sparks = new Map();

    const GRID_SIZE = 54;
    const SPOTLIGHT_RADIUS = 175;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const parent = canvas.parentElement || canvas;

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (!mouse.isActive) {
        mouse.x = currentX;
        mouse.y = currentY;
        mouse.isActive = true;
      }

      mouse.targetX = currentX;
      mouse.targetY = currentY;
    };

    const handlePointerLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      lightWaves.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.75,
        speed: 7.5,
        life: 1.0,
      });
    };

    const handlePointerCancel = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    parent.addEventListener("pointermove", handlePointerMove);
    parent.addEventListener("pointerleave", handlePointerLeave);
    parent.addEventListener("pointerdown", handlePointerDown);
    parent.addEventListener("pointercancel", handlePointerCancel);

    let observer = null;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(parent);
    }

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;
      }

      // 1. Draw subtle base architectural grid (clean, stable, non-distracting)
      ctx.strokeStyle = "rgba(15, 23, 42, 0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // 2. Update and render expanding light waves (from clicks)
      for (let wIdx = lightWaves.length - 1; wIdx >= 0; wIdx--) {
        const wave = lightWaves[wIdx];
        wave.radius += wave.speed;
        wave.life -= 0.018;

        if (wave.life <= 0 || wave.radius > wave.maxRadius) {
          lightWaves.splice(wIdx, 1);
          continue;
        }

        const ringGrad = ctx.createRadialGradient(
          wave.x, wave.y, Math.max(0, wave.radius - 28),
          wave.x, wave.y, wave.radius + 28
        );
        ringGrad.addColorStop(0, "rgba(38, 77, 243, 0)");
        ringGrad.addColorStop(0.5, `rgba(56, 189, 248, ${wave.life * 0.22})`);
        ringGrad.addColorStop(1, "rgba(38, 77, 243, 0)");

        ctx.strokeStyle = ringGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Interactive Cursor Spotlight (smooth illuminated grid lines near cursor)
      if (mouse.isActive && mouse.x > -100 && mouse.y > -100) {
        // Ambient soft spotlight glow
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, SPOTLIGHT_RADIUS);
        glow.addColorStop(0, "rgba(38, 77, 243, 0.055)");
        glow.addColorStop(0.5, "rgba(56, 189, 248, 0.02)");
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Highlight grid lines within spotlight radius
        const minX = Math.max(0, Math.floor((mouse.x - SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const maxX = Math.min(width, Math.ceil((mouse.x + SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const minY = Math.max(0, Math.floor((mouse.y - SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);
        const maxY = Math.min(height, Math.ceil((mouse.y + SPOTLIGHT_RADIUS) / GRID_SIZE) * GRID_SIZE);

        // Vertical lines near cursor
        for (let x = minX; x <= maxX; x += GRID_SIZE) {
          const dx = Math.abs(x - mouse.x);
          if (dx < SPOTLIGHT_RADIUS) {
            const span = Math.sqrt(SPOTLIGHT_RADIUS * SPOTLIGHT_RADIUS - dx * dx);
            const y1 = Math.max(0, mouse.y - span);
            const y2 = Math.min(height, mouse.y + span);

            const vGrad = ctx.createLinearGradient(0, y1, 0, y2);
            vGrad.addColorStop(0, "rgba(38, 77, 243, 0)");
            vGrad.addColorStop(0.5, `rgba(38, 77, 243, ${0.32 * Math.pow(1 - dx / SPOTLIGHT_RADIUS, 1.5)})`);
            vGrad.addColorStop(1, "rgba(38, 77, 243, 0)");

            ctx.strokeStyle = vGrad;
            ctx.lineWidth = 1.35;
            ctx.beginPath();
            ctx.moveTo(x + 0.5, y1);
            ctx.lineTo(x + 0.5, y2);
            ctx.stroke();
          }
        }

        // Horizontal lines near cursor
        for (let y = minY; y <= maxY; y += GRID_SIZE) {
          const dy = Math.abs(y - mouse.y);
          if (dy < SPOTLIGHT_RADIUS) {
            const span = Math.sqrt(SPOTLIGHT_RADIUS * SPOTLIGHT_RADIUS - dy * dy);
            const x1 = Math.max(0, mouse.x - span);
            const x2 = Math.min(width, mouse.x + span);

            const hGrad = ctx.createLinearGradient(x1, 0, x2, 0);
            hGrad.addColorStop(0, "rgba(38, 77, 243, 0)");
            hGrad.addColorStop(0.5, `rgba(38, 77, 243, ${0.32 * Math.pow(1 - dy / SPOTLIGHT_RADIUS, 1.5)})`);
            hGrad.addColorStop(1, "rgba(38, 77, 243, 0)");

            ctx.strokeStyle = hGrad;
            ctx.lineWidth = 1.35;
            ctx.beginPath();
            ctx.moveTo(x1, y + 0.5);
            ctx.lineTo(x2, y + 0.5);
            ctx.stroke();
          }
        }

        // Activate intersection sparks near the cursor
        for (let x = minX; x <= maxX; x += GRID_SIZE) {
          for (let y = minY; y <= maxY; y += GRID_SIZE) {
            const dist = Math.hypot(x - mouse.x, y - mouse.y);
            if (dist < 42) {
              const key = `${x}_${y}`;
              sparks.set(key, { x, y, alpha: 1.0 });
            }
          }
        }
      }

      // 4. Render and fade active intersection sparks (playful light trail)
      sparks.forEach((spark, key) => {
        spark.alpha -= 0.024;
        if (spark.alpha <= 0) {
          sparks.delete(key);
          return;
        }

        const alpha = spark.alpha;
        const size = 2.2 * alpha;

        // Glowing center dot
        ctx.fillStyle = `rgba(38, 77, 243, ${alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(spark.x + 0.5, spark.y + 0.5, size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle micro-crosshair mark
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.6})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(spark.x - 3.5, spark.y + 0.5);
        ctx.lineTo(spark.x + 4.5, spark.y + 0.5);
        ctx.moveTo(spark.x + 0.5, spark.y - 3.5);
        ctx.lineTo(spark.x + 0.5, spark.y + 4.5);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
      parent.removeEventListener("pointerdown", handlePointerDown);
      parent.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("resize", handleResize);
      if (observer) observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="mc-hero-interactive-canvas" />;
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
        <InteractiveHeroLines />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-profile-card">
              <div className="mc-profile-frame">
                <img
                  src="/IMG_5281.jpg"
                  alt="Maruveni Charan"
                  className="mc-profile-photo"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center bottom",
                    transformOrigin: "center bottom",
                  }}
                />
              </div>
              <div className="mc-profile-caption">
                <span className="mc-caption-name">MARUVENI CHARAN</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sub-Hero Continuous Moving Ticker Bar */}
        <div className="mc-subhero-bar">
          <div className="mc-subhero-marquee">
            <div className="mc-subhero-track">
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
            </div>
            <div className="mc-subhero-track" aria-hidden="true">
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
              <span>DATA ANALYST</span>
              <span>APP DEVELOPER</span>
              <span>UI/UX DESIGNER</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Redesigned About Section (Headline & Narrative on Left, Stats on Right) ===== */}
      <section className="mc-section mc-about-section" id="about">
        <div className="mc-container">
          <div className="mc-about-grid">
            {/* Left Column: Heading, Subtitle & Narrative */}
            <motion.div
              className="mc-about-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mc-kicker">A LITTLE ABOUT ME</div>

              <h2 className="mc-about-title">
                Curiosity is the<br />
                common thread.
              </h2>
              <p className="mc-about-subtitle">
                A designer's eye. A developer's mindset.
              </p>

              <p className="mc-about-narrative">
                I am a dedicated Computer Science graduate from Alliance University with a focus on iOS development and Data Analytics. My passion lies in crafting seamless digital experiences and deriving powerful insights from data to solve real-world challenges.
              </p>
            </motion.div>

            {/* Right Column: ONLY the Stats (Increased Size) */}
            <motion.div
              className="mc-about-right mc-about-stats-only"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mc-stats-row">
                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <PlayfulDotNumber text="8.3" width={140} height={78} />
                  </div>
                  <div className="mc-stat-label">CGPA</div>
                </div>

                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <PlayfulDotNumber text="5+" width={126} height={78} />
                  </div>
                  <div className="mc-stat-label">PROJECTS</div>
                </div>

                <div className="mc-stat-item">
                  <div className="mc-stat-number">
                    <PlayfulDotNumber text="10+" width={172} height={78} />
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
                Five projects. Different challenges.<br />
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
            ].map((skill) => (
              <div
                key={skill.name}
                className="mc-toolkit-card"
              >
                <div className="mc-toolkit-icon-wrap">
                  <img
                    src={skill.src}
                    alt={skill.name}
                    className="mc-toolkit-icon"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <span className="mc-toolkit-name">{skill.name}</span>
              </div>
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

          <EducationZigzagTimeline />
        </div>
      </section>

      {/* ===== Redesigned Certifications Section (Matching Image) ===== */}
      <section className="mc-section mc-certifications-section" id="certifications">
        <div className="mc-container mc-certifications-container">
          <div className="mc-section-header">
            <div className="mc-section-header-left">
              <span className="mc-kicker">
                <span className="mc-cert-kicker-c">C</span>ERTIFICATIONS
              </span>
              <h2 className="mc-section-title">
                Always a <span className="mc-cert-student-word"><span className="mc-cert-student-s">s</span>tudent</span><span className="mc-cert-dot">.</span>
              </h2>
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
                <span className="mc-cert-arrow"><ArrowUpRight /></span>
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
                <span className="mc-cert-arrow"><ArrowUpRight /></span>
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
                <span className="mc-cert-arrow"><ArrowUpRight /></span>
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
                <span className="mc-cert-arrow"><ArrowUpRight /></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Redesigned Achievements Section (Matching Image) ===== */}
      <section className="mc-section mc-achievements-section" id="achievements">
        <div className="mc-container mc-achievements-container">
          <motion.div
            className="mc-section-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mc-section-header-left">
              <span className="mc-kicker">ACHIEVEMENTS</span>
              <h2 className="mc-section-title">Small wins. Lasting momentum.</h2>
            </div>
            <div className="mc-section-header-right">
              <p className="mc-section-subtitle">Alliance University · 2025</p>
            </div>
          </motion.div>

          <div className="mc-achievements-grid">
            <motion.div
              className="mc-achievement-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mc-achievement-badge">WINNER</span>
              <h3 className="mc-achievement-title">Application Hackathon — E-Cell</h3>
              <p className="mc-achievement-desc">
                Developed "Stady", a dynamic web application providing educational resources and collaboration tools for students.
              </p>
            </motion.div>

            <motion.div
              className="mc-achievement-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mc-achievement-badge">WINNER</span>
              <h3 className="mc-achievement-title">Tackathon — Smart India Hackathon</h3>
              <p className="mc-achievement-desc">
                Developed an AI-based Internship Recommendation Engine for the PM Internship Scheme to match students with internships.
              </p>
            </motion.div>

            <motion.div
              className="mc-achievement-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mc-achievement-badge">RUNNER-UP</span>
              <h3 className="mc-achievement-title">Cultural Events</h3>
              <p className="mc-achievement-desc">
                Achieved 2nd place in Alliance 2.0 cultural competitions for teamwork and creativity.
              </p>
            </motion.div>
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
          <motion.span
            className="mc-kicker"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            LET'S CONNECT
          </motion.span>

          <div className="mc-contact-grid">
            <motion.div
              className="mc-contact-left"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mc-contact-title">
                <span className="mc-contact-title-sans">Have an idea?</span>
                <span className="mc-contact-title-serif">Let’s make it real.</span>
              </h2>
              <p className="mc-contact-desc">
                I'm always open to new opportunities, creative UI/UX design projects, mobile app development, or a good conversation.
              </p>
            </motion.div>

            <div className="mc-contact-right">
              <motion.a
                href="mailto:charanm2319@gmail.com"
                className="mc-contact-row"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">EMAIL</span>
                  <span className="mc-contact-val">charanm2319@gmail.com</span>
                </div>
                <span className="mc-contact-arrow"><ArrowUpRight /></span>
              </motion.a>

              <motion.a
                href="tel:+918639839229"
                className="mc-contact-row"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">PHONE</span>
                  <span className="mc-contact-val">+91 8639839229</span>
                </div>
                <span className="mc-contact-arrow"><ArrowUpRight /></span>
              </motion.a>

              <motion.div
                className="mc-contact-row"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mc-contact-row-info">
                  <span className="mc-contact-label">BASED IN</span>
                  <span className="mc-contact-val">Bengaluru, Karnataka, India</span>
                </div>
                <span className="mc-contact-arrow"><ArrowUpRight /></span>
              </motion.div>
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