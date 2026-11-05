import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Send, CheckCircle2, AlertCircle, Moon, Box, Layers, Cuboid, 
  Cpu, ShieldCheck, TrendingUp, Sparkles, Terminal, Code2, Database, X, ChevronRight 
} from 'lucide-react';
import profileImg from './profile.jpg';

// --- GLOBAL STYLES & FONTS ---
// Injecting the Kanit font and custom scrollbar styles
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;700;900&display=swap');
    
    html, body, #root {
      background-color: #0e4f4a;
      color: #f1eee8;
      font-family: 'Kanit', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .hero-heading {
      background: linear-gradient(180deg, #f1eee8 0%, rgba(241, 238, 232, 0.6) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0e4f4a;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(241, 238, 232, 0.6);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #f1eee8;
    }
  `}</style>
);

// --- REUSABLE COMPONENTS ---

const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Magnet = ({ children, padding = 150, strength = 3, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (Math.abs(distanceX) < padding && Math.abs(distanceY) < padding) {
      setPosition({ x: distanceX / strength, y: distanceY / strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedText = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const characters = text.split("");

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + 1 / characters.length;
        return (
          <Character key={i} progress={scrollYProgress} range={[start, end]}>
            {char === " " ? "\u00A0" : char}
          </Character>
        );
      })}
    </p>
  );
};

const Character = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 text-[#f1eee8]">
        {children}
      </motion.span>
    </span>
  );
};

// --- SECTIONS ---

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip px-6 md:px-10 py-6 md:py-8">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="flex justify-between items-center w-full z-20 relative">
        <div className="text-xl font-bold text-[#f1eee8] tracking-widest uppercase">Shaanthakumar</div>
        <nav className="hidden md:flex gap-8">
          {["About", "Services", "Projects", "Contact"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[#f1eee8]/60 hover:text-[#f1eee8] text-sm lg:text-[1.2rem] font-medium uppercase tracking-wider transition-colors duration-200">
              {link}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <div className="relative z-20 flex flex-col items-center mt-auto md:mt-20">
        <FadeIn delay={0.15} y={40} className="w-full flex justify-center">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap text-[12vw] sm:text-[14vw] md:text-[15vw] lg:text-[14vw]">
            hi, i'm shaanthakumar
          </h1>
        </FadeIn>
      </div>

      {/* Hero Portrait */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 pointer-events-none sm:pointer-events-auto">
        <Magnet strength={4} padding={200}>
          <img 
            src={profileImg || "./profile.jpg"} 
            alt="Shaanthakumar"
            className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] object-cover object-top h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] rounded-t-[40px] shadow-[0_0_50px_rgba(241,238,232,0.1)] opacity-95 transition-transform duration-500 hover:scale-[1.01]"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', 
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' 
            }}
          />
        </Magnet>
      </FadeIn>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end w-full pb-4 sm:pb-8 md:pb-10 z-20 relative">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          
        </FadeIn>
        
        <FadeIn delay={0.5} y={20}>
          <a href="#contact">
            <Magnet>
              <button className="bg-[#FF655E] text-[#f1eee8] px-6 py-3 md:px-10 md:py-4 rounded-full font-medium uppercase tracking-widest text-xs md:text-sm hover:bg-[#f1eee8] hover:text-[#0e4f4a] transition-colors duration-300 shadow-[0_0_20px_rgba(255,101,94,0.4)]">
                Contact Me
              </button>
            </Magnet>
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

const MarqueeSection = () => {
  const { scrollY } = useScroll();
  const x1 = useTransform(scrollY, [0, 2000], [0, -600]);
  const x2 = useTransform(scrollY, [0, 2000], [0, 600]);

  const itemsRow1 = [
    { title: "AI & Neural Networks", tag: "Deep Learning & Tensors", img: "/marquee/ai_neural.jpg" },
    { title: "DocsDefender Cryptography", tag: "AES-256 & Steganography", img: "/marquee/cyber_security.jpg" },
    { title: "Predictive Data Science", tag: "ML Forecasting & Analytics", img: "/marquee/data_science.jpg" },
  ];

  const itemsRow2 = [
    { title: "Computer Vision & YOLOv8", tag: "Real-time Phone Detection", img: "/marquee/computer_vision.jpg" },
    { title: "High-Concurrency Backend", tag: "Multiprocessing & Microservices", img: "/marquee/cloud_backend.jpg" },
    { title: "LLM & Agent Workflows", tag: "Ollama Mistral Automation", img: "/marquee/llm_nlp.jpg" },
  ];

  return (
    <section className="pt-20 sm:pt-28 pb-10 overflow-hidden bg-[#0e4f4a]">
      {/* Row 1 */}
      <motion.div style={{ x: x1 }} className="flex gap-6 mb-6 whitespace-nowrap min-w-max">
        {[...itemsRow1, ...itemsRow1, ...itemsRow1, ...itemsRow1].map((item, i) => (
          <div 
            key={`r1-${i}`} 
            className="group relative w-[300px] md:w-[440px] h-[190px] md:h-[260px] flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border border-[#f1eee8]/15 bg-[#0e4f4a]/60 shadow-xl transition-all duration-300 hover:border-[#FF655E]/60 hover:scale-[1.02]"
          >
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e4f4a] via-[#0e4f4a]/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1">
              <span className="text-[#FF655E] text-xs font-bold uppercase tracking-widest">{item.tag}</span>
              <h4 className="text-[#f1eee8] font-bold text-lg md:text-xl drop-shadow-md">{item.title}</h4>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Row 2 */}
      <motion.div style={{ x: x2 }} className="flex gap-6 whitespace-nowrap min-w-max -ml-[500px]">
        {[...itemsRow2, ...itemsRow2, ...itemsRow2, ...itemsRow2].map((item, i) => (
          <div 
            key={`r2-${i}`} 
            className="group relative w-[300px] md:w-[440px] h-[190px] md:h-[260px] flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border border-[#f1eee8]/15 bg-[#0e4f4a]/60 shadow-xl transition-all duration-300 hover:border-[#FF655E]/60 hover:scale-[1.02]"
          >
            <img 
              src={item.img} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e4f4a] via-[#0e4f4a]/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
            <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1">
              <span className="text-[#FF655E] text-xs font-bold uppercase tracking-widest">{item.tag}</span>
              <h4 className="text-[#f1eee8] font-bold text-lg md:text-xl drop-shadow-md">{item.title}</h4>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 py-20 bg-[#0e4f4a] overflow-hidden">
      {/* Decorative Corners */}
      <FadeIn delay={0.1} x={-80} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="Moon" className="w-full h-auto opacity-70 mix-blend-lighten" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="3D Object" className="w-full h-auto opacity-70 mix-blend-lighten" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="Lego" className="w-full h-auto opacity-70 mix-blend-lighten" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="3D Group" className="w-full h-auto opacity-70 mix-blend-lighten" />
      </FadeIn>

      <div className="z-10 flex flex-col items-center gap-16 md:gap-24 text-center max-w-4xl">
        <FadeIn y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[3rem] sm:text-[8vw] md:text-[140px]">
            About me
          </h2>
        </FadeIn>

        <AnimatedText 
          text="Specializing in cutting-edge AI & Machine Learning solutions, responsive web applications, and end-to-end software development. I create high-performance digital experiences tailored to solve real problems. Let's build something incredible together!" 
          className="font-medium leading-relaxed max-w-[700px] text-[1rem] sm:text-[1.5vw] md:text-[1.35rem]"
        />

        <FadeIn delay={0.2} y={30}>
          <a href="#contact">
            <Magnet>
              <button className="bg-transparent border-2 border-[#FF655E] text-[#f1eee8] px-8 py-4 rounded-full font-medium uppercase tracking-widest hover:bg-[#FF655E] transition-colors duration-300">
                Let's Talk
              </button>
            </Magnet>
          </a>
        </FadeIn>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    { 
      num: "01", 
      name: "AI and ML Related", 
      desc: "Developing intelligent algorithms, machine learning models, predictive data systems, and custom AI integrations tailored to optimize processes and solve complex problems." 
    },
    { 
      num: "02", 
      name: "Web Page and Application", 
      desc: "Designing and building high-performance, responsive websites and dynamic modern web applications with elegant interfaces, intuitive user experiences, and clean code." 
    },
    { 
      num: "03", 
      name: "Application Development", 
      desc: "End-to-end custom application development across mobile, desktop, and cloud platforms, engineered for scalability, robust security, and seamless maintainability." 
    }
  ];

  return (
    <section id="services" className="bg-[#f1eee8] text-[#0e4f4a] rounded-t-[40px] md:rounded-t-[60px] px-5 sm:px-10 py-24 md:py-32 relative z-20 -mt-10">
      <h2 className="font-black uppercase text-center mb-16 md:mb-28 text-[3rem] sm:text-[8vw] md:text-[120px]">
        Services
      </h2>

      <div className="max-w-6xl mx-auto flex flex-col">
        {services.map((svc, idx) => (
          <FadeIn key={svc.num} delay={idx * 0.1} y={20} className="border-b border-[#0e4f4a]/15 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 hover:bg-[#0e4f4a]/5 px-6 rounded-2xl transition-colors">
            <div className="text-[3rem] md:text-[100px] font-black text-[#0e4f4a] leading-none">
              {svc.num}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="font-bold uppercase text-[1.5rem] md:text-[2.5rem]">{svc.name}</h3>
              <p className="font-light leading-relaxed max-w-2xl text-[1rem] md:text-[1.25rem] text-[#0e4f4a]/70">
                {svc.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    {
      num: "01",
      name: "AutoApply",
      category: "AI & Browser Automation",
      subtitle: "High-Concurrency Autonomous Job Application Platform",
      desc: "Architected an enterprise-grade AI-powered job application platform leveraging multiprocessing, multithreading, and nested parallelism for concurrent task execution. Integrated Ollama Mistral to autonomously parse resumes, extract professional competencies, and generate job-specific resume variants while streamlining LinkedIn application workflows through headless browser automation.",
      technologies: ["Python", "Ollama Mistral", "Multiprocessing", "Multithreading", "Browser Automation", "LinkedIn API", "LaTeX / Markdown"],
      metrics: [
        { label: "Execution Engine", value: "Nested Parallelism", detail: "Multi-core worker queues" },
        { label: "LLM Intelligence", value: "Ollama Mistral", detail: "Local private inferencing" },
        { label: "Workflow Target", value: "LinkedIn Automated", detail: "Frictionless batch applications" }
      ],
      highlights: [
        "Concurrent task execution engine scaling over multi-core worker queues for high-throughput job batch processing.",
        "Local LLM inferencing with Ollama Mistral analyzing job requirements and generating dynamically tailored resume variants.",
        "Headless browser automation executing dynamic form handling and rate-limited LinkedIn Easy Apply workflows."
      ],
      img1: "/projects/autoapply_main.jpg",
      img2: "/projects/autoapply_ui.jpg",
    },
    {
      num: "02",
      name: "DocsDefender",
      category: "Enterprise Security & Computer Vision",
      subtitle: "Forensic Document Leak Prevention & Provenance Tracing",
      desc: "Engineered an enterprise document leak prevention and forensic tracing platform combining cryptography, steganography, computer vision, and network security. Secured documents using AES-256 encryption, SHA-256 hashing, LSB steganography, and DCT-based frequency watermarking. Incorporated YOLOv8 for mobile phone detection, Scapy for network egress monitoring, and Watchdog for filesystem activity tracking and session locking. Established forensic watermark extraction and SQLite audit logging through Streamlit and FastAPI interfaces.",
      technologies: ["Python", "YOLOv8", "AES-256", "SHA-256", "LSB Steganography", "DCT Watermarking", "FastAPI", "Streamlit", "SQLite", "Scapy", "Watchdog"],
      metrics: [
        { label: "Data Encryption", value: "AES-256 & SHA-256", detail: "Military-grade data at rest" },
        { label: "Vision Defense", value: "YOLOv8 Camera Scan", detail: "Real-time screen-capture block" },
        { label: "Provenance Tracing", value: "LSB & DCT Watermark", detail: "Invisible forensic signature" }
      ],
      highlights: [
        "Real-time YOLOv8 computer vision detection of unauthorized phone cameras with automated screen locking via Watchdog.",
        "Discrete Cosine Transform (DCT) frequency domain forensic watermarking for tamper-proof provenance recovery.",
        "Enterprise network egress monitoring using Scapy with immutable SQLite audit logging through FastAPI."
      ],
      img1: "/projects/docsdefender_main.jpg",
      img2: "/projects/docsdefender_ui.jpg",
    },
    {
      num: "03",
      name: "RevIntel",
      category: "AI Hospitality Revenue Intelligence",
      subtitle: "Dynamic Pricing & Demand Forecasting Analytics Platform",
      desc: "Created an AI-driven hotel revenue intelligence platform for demand forecasting, anomaly detection, dynamic pricing, and room inventory optimization. Analyzed occupancy, ADR (Average Daily Rate), RevPAR (Revenue Per Available Room), booking pace, and cancellation rates through interactive dashboards. Built machine learning pipelines and recommendation engines using historical demand, seasonality, booking trends, and customer segments. Integrated an AI revenue intelligence agent to generate explainable insights, alerts, and pricing recommendations.",
      technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Pandas", "Scikit-learn", "Machine Learning", "Dynamic Pricing"],
      metrics: [
        { label: "Core KPI Tracking", value: "RevPAR & ADR", detail: "Revenue yield optimization" },
        { label: "ML Pipelines", value: "Demand Forecasting", detail: "Seasonality & cancellation pace" },
        { label: "Architecture", value: "FastAPI + Postgres", detail: "Real-time explainable AI agent" }
      ],
      highlights: [
        "Scikit-learn and Pandas predictive pipelines forecasting booking pace, occupancy spikes, and cancellation probabilities.",
        "Dynamic pricing recommendation engine calculating optimal yields against seasonal elasticity and competitor trends.",
        "Explainable AI intelligence agent serving automated alerts, margin diagnostics, and pricing advice through React dashboards."
      ],
      img1: "/projects/revintel_main.jpg",
      img2: "/projects/revintel_ui.jpg",
    }
  ];

  return (
    <section id="projects" ref={containerRef} className="bg-[#0e4f4a] rounded-t-[40px] md:rounded-t-[60px] relative z-30 -mt-10 pt-24 pb-[20vh] px-5 sm:px-10">
      <h2 className="hero-heading font-black uppercase text-center mb-6 md:mb-10 text-[3rem] sm:text-[8vw] md:text-[120px]">
        Projects
      </h2>
      <p className="text-center text-[#f1eee8]/70 max-w-2xl mx-auto mb-16 md:mb-24 text-base md:text-lg font-light">
        Engineered systems spanning Artificial Intelligence, Cybersecurity, Machine Learning, and High-Throughput Automation from my technical portfolio.
      </p>

      <div className="max-w-7xl mx-auto flex flex-col gap-0 relative">
        {projects.map((proj, idx) => {
          const targetScale = 1 - (projects.length - 1 - idx) * 0.04;
          const range = [idx * 0.25, 1];
          const scale = useTransform(scrollYProgress, range, [1, targetScale]);
          
          return (
            <motion.div
              key={proj.num}
              style={{ scale, top: `calc(8vh + ${idx * 25}px)` }}
              className="sticky h-fit mb-16 sm:mb-24 w-full rounded-[36px] md:rounded-[50px] border-2 border-[#f1eee8]/25 bg-[#0e4f4a]/95 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col gap-6 transform-origin-top"
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#f1eee8]/15 pb-6">
                <div className="flex items-start sm:items-end gap-4 sm:gap-6">
                  <span className="text-[3.5rem] md:text-[5.5rem] font-black text-[#FF655E] leading-none">{proj.num}</span>
                  <div>
                    <span className="text-[#f1eee8]/60 text-xs sm:text-sm uppercase tracking-widest font-semibold">{proj.category}</span>
                    <h3 className="text-[#f1eee8] text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight">{proj.name}</h3>
                    <p className="text-[#f1eee8]/80 text-sm sm:text-base font-normal mt-1">{proj.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => setSelectedProject(proj)}
                    className="rounded-full bg-[#FF655E] text-[#f1eee8] px-6 py-2.5 uppercase tracking-wider font-semibold text-xs md:text-sm hover:bg-[#f1eee8] hover:text-[#0e4f4a] transition-all duration-300 shadow-md flex items-center gap-2"
                  >
                    <span>System Architecture</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-2">
                {proj.technologies.map((tech) => (
                  <span key={tech} className="bg-[#f1eee8]/10 text-[#f1eee8] border border-[#f1eee8]/20 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Card Images Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">
                <div className="lg:col-span-7 relative group rounded-[24px] md:rounded-[30px] overflow-hidden border border-[#f1eee8]/20 shadow-lg h-[260px] sm:h-[340px] md:h-[400px]">
                  <img 
                    src={proj.img1} 
                    alt={`${proj.name} System Dashboard`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-[#0e4f4a]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#f1eee8] border border-[#f1eee8]/20">
                    Primary System Dashboard
                  </div>
                </div>
                <div className="lg:col-span-5 relative group rounded-[24px] md:rounded-[30px] overflow-hidden border border-[#f1eee8]/20 shadow-lg h-[260px] sm:h-[340px] md:h-[400px]">
                  <img 
                    src={proj.img2} 
                    alt={`${proj.name} Architecture & Telemetry`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-[#0e4f4a]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-[#f1eee8] border border-[#f1eee8]/20">
                    Telemetry & Engine View
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="bg-[#0e4f4a]/80 border border-[#f1eee8]/15 rounded-[24px] p-5 md:p-6 flex flex-col gap-4">
                <p className="text-[#f1eee8]/90 text-sm sm:text-base leading-relaxed font-light">
                  {proj.desc}
                </p>

                {/* Metrics / Key Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f1eee8]/10">
                  {proj.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-[#f1eee8]/5 rounded-xl p-3 border border-[#f1eee8]/10">
                      <span className="text-xs uppercase text-[#FF655E] font-bold tracking-wider block">{m.label}</span>
                      <span className="text-[#f1eee8] font-semibold text-sm sm:text-base block mt-0.5">{m.value}</span>
                      <span className="text-[#f1eee8]/60 text-xs block mt-0.5">{m.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Architecture Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e4f4a] border border-[#f1eee8]/30 text-[#f1eee8] max-w-3xl w-full rounded-[32px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#f1eee8]/10 hover:bg-[#FF655E] transition-colors text-[#f1eee8]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <span className="text-[#FF655E] font-bold text-xs uppercase tracking-widest block mb-1">
                Project Deep Dive • {selectedProject.num}
              </span>
              <h3 className="text-3xl font-black uppercase text-[#f1eee8] mb-2">{selectedProject.name}</h3>
              <p className="text-[#f1eee8]/70 text-sm font-medium mb-6">{selectedProject.subtitle}</p>

              <div className="space-y-6 text-sm sm:text-base font-light">
                <div>
                  <h4 className="font-bold text-base text-[#f1eee8] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#FF655E]" />
                    <span>Project Overview</span>
                  </h4>
                  <p className="text-[#f1eee8]/90 leading-relaxed bg-[#f1eee8]/5 p-4 rounded-xl border border-[#f1eee8]/10">
                    {selectedProject.desc}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#f1eee8] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Cpu size={16} className="text-[#FF655E]" />
                    <span>Core Architectural Highlights</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((h: string, hIdx: number) => (
                      <li key={hIdx} className="flex items-start gap-3 bg-[#f1eee8]/5 p-3 rounded-lg border border-[#f1eee8]/10">
                        <CheckCircle2 size={18} className="text-[#FF655E] flex-shrink-0 mt-0.5" />
                        <span className="text-[#f1eee8]/90">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#f1eee8] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Database size={16} className="text-[#FF655E]" />
                    <span>Complete Technology Stack</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string) => (
                      <span key={tech} className="bg-[#FF655E]/20 text-[#f1eee8] border border-[#FF655E]/40 px-3.5 py-1 rounded-full text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Visual Previews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl overflow-hidden border border-[#f1eee8]/20">
                    <img src={selectedProject.img1} alt="Dashboard" className="w-full h-[180px] object-cover" />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#f1eee8]/20">
                    <img src={selectedProject.img2} alt="Telemetry" className="w-full h-[180px] object-cover" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// =========================================================================
// SMTP CONFIGURATION PLACEHOLDER
// Point this to your backend SMTP API endpoint (e.g. server.js running on port 5000)
// =========================================================================
const SMTP_API_ENDPOINT = import.meta.env?.VITE_CONTACT_API_URL || '/api/contact';

// Placeholders for your public contact info
const MY_INBOX_EMAIL = 'shaanthakumar4u@gmail.com'; // <-- REPLACE WITH YOUR INBOX EMAIL

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(SMTP_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message via SMTP server.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', query: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err: any) {
      console.error('SMTP submit error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Unable to connect to the SMTP server. Please ensure the backend is running.');
      setTimeout(() => setStatus('idle'), 8000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="bg-[#0e4f4a] text-[#f1eee8] rounded-t-[40px] md:rounded-t-[60px] relative z-40 -mt-10 py-24 md:py-32 px-5 sm:px-10 border-t border-[#f1eee8]/10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        
        {/* Text Area */}
        <div className="flex-1">
          <FadeIn>
            <h2 className="hero-heading font-black uppercase text-[3rem] md:text-[5rem] leading-none mb-6">
              Let's Create <br /> Together.
            </h2>
            <p className="text-[1.1rem] font-medium opacity-80 max-w-sm mb-10">
              Ready to bring your ideas to life with AI, web applications, and custom software development? Drop your details below and I'll get back to you immediately.
            </p>
            <div className="space-y-4 font-medium text-[#f1eee8]/80">
              <p>Email: <a href={`mailto:${MY_INBOX_EMAIL}`} className="hover:text-[#FF655E] transition-colors">{MY_INBOX_EMAIL}</a></p>
              <p>Location: Coimbatore, Tamil Nadu</p>
            </div>
          </FadeIn>
        </div>

        {/* Form Area */}
        <div className="flex-1 w-full bg-[#0e4f4a] p-8 md:p-10 rounded-[40px] border border-[#f1eee8]/20 shadow-2xl relative overflow-hidden">
          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 bg-[#FF655E] z-20 flex flex-col items-center justify-center text-[#f1eee8] text-center p-8 rounded-[40px]"
              >
                <CheckCircle2 size={60} className="mb-4 text-[#f1eee8]" />
                <h3 className="text-2xl font-bold uppercase mb-2">Message Sent!</h3>
                <p className="font-light">Your inquiry was delivered directly to my inbox via SMTP. I'll get back to you soon.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-[#f1eee8]">
            <h3 className="text-2xl font-bold uppercase mb-2 text-[#f1eee8]/70">Contact Form</h3>
            
            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm tracking-widest uppercase opacity-70">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border-b border-[#f1eee8]/50 py-3 outline-none focus:border-[#f1eee8] transition-colors font-medium text-lg placeholder:text-[#f1eee8]/20"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm tracking-widest uppercase opacity-70">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent border-b border-[#f1eee8]/50 py-3 outline-none focus:border-[#f1eee8] transition-colors font-medium text-lg placeholder:text-[#f1eee8]/20"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm tracking-widest uppercase opacity-70">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-transparent border-b border-[#f1eee8]/50 py-3 outline-none focus:border-[#f1eee8] transition-colors font-medium text-lg placeholder:text-[#f1eee8]/20"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="query" className="text-sm tracking-widest uppercase opacity-70">Your Query</label>
              <textarea 
                id="query" 
                name="query" 
                required
                value={formData.query}
                onChange={handleChange}
                rows={4}
                className="bg-transparent border-b border-[#f1eee8]/50 py-3 outline-none focus:border-[#f1eee8] transition-colors font-medium text-lg resize-none placeholder:text-[#f1eee8]/20"
                placeholder="Tell me about your project..."
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="bg-[#FF655E] text-[#f1eee8] py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#f1eee8] hover:text-[#0e4f4a] transition-all duration-300 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending via SMTP...' : 'Send Message'}
              {status !== 'submitting' && <Send size={18} />}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <>
      <GlobalStyles />
      <main className="w-full bg-[#0e4f4a] font-sans selection:bg-[#FF655E] selection:text-[#f1eee8]">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
        
        {/* Footer */}
        <footer className="bg-[#0e4f4a] pb-10 pt-4 px-10 text-center text-[#f1eee8]">
          <p className="text-sm font-medium uppercase tracking-widest opacity-60">
            © {new Date().getFullYear()} Shaanthakumar. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}