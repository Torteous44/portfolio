// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './assets/fonts/fonts.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // Import icons
import ProjectCard from './ProjectCard'; // Import the ProjectCard component


function App() {
  const [activeSection, setActiveSection] = useState('about');

  // References to each section
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null); // Removed blogRef
  
  // Reference to the content area
  const contentRef = useRef(null);

  // Function to scroll to the top
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', // Smooth scrolling
      });
    }
  };
  useEffect(() => {
    const options = {
      root: contentRef.current,
      rootMargin: '0px',
      threshold: 0.6, // Adjust this value as needed
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(callback, options);
    
    const sections = [aboutRef.current, projectsRef.current, contactRef.current];


    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Cleanup function to unobserve when the component unmounts
    return () => {
      if (sections.length > 0) {
        sections.forEach((section) => {
          if (section) observer.unobserve(section);
        });
      }
    };
  }, []);

  const projects = [
    {
      title: "Expense Tracker Application",
      description: "A web-based full-stack expense management system allowing users to add, edit, and track expenses with analytics and profile management features.",
      technologies: ["React", "CSS", "Node.js", "MySql", "Azure Functions"],
      image: require('./assets/images/expense-manager.png'),
      githubLink: "https://github.com/Torteous44/ExpenseTracker_group4",
      liveDemoLink: "https://torteous44.github.io/ExpenseTracker_group4/"
    },
    
    
      {
        title: 'Shazam and SoundCloud DJ Setlist generator',
        description: 'A project that uses the Shazam and SoundCloud APIs to create a setlist of songs used in a DJ’s set.',
        image: require('./assets/images/dj-setlist.png'),
        technologies: ['JavaScript', 'Node.js', 'Shazam API', 'SoundCloud API'],
        githubLink: 'https://github.com/Torteous44/Soundcloud',
        liveDemoLink: null,
      }
      ,
    // Add more projects as needed
  ];


  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="profile">
        <a href="#top" onClick={scrollToTop} className="logo">
            <h1>Matthew Porteous</h1>
          </a>
          <p>CS and AI student <p></p> ie university </p>

        </div>
{/* Navigation Links */}
<nav className="toc">
  <ul>
    <li>
      <a
        href="#about"
        className={activeSection === 'about' ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          if (aboutRef.current && contentRef.current) {
            contentRef.current.scrollTo({
              top: aboutRef.current.offsetTop,
              behavior: 'smooth',
            });
          }
        }}
      >
        About Me
      </a>
    </li>
    <li>
      <a
        href="#projects"
        className={activeSection === 'projects' ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          if (projectsRef.current && contentRef.current) {
            contentRef.current.scrollTo({
              top: projectsRef.current.offsetTop,
              behavior: 'smooth',
            });
          }
        }}
      >
        Projects
      </a>
    </li>
    <li>
      <a
        href="#contact"
        className={activeSection === 'contact' ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          if (contactRef.current && contentRef.current) {
            contentRef.current.scrollTo({
              top: contactRef.current.offsetTop,
              behavior: 'smooth',
            });
          }
        }}
      >
        Contact
      </a>
    </li>
  </ul>
</nav>

      </aside>

      {/* Right Scrollable Content */}
      <main className="content" ref={contentRef}>
      <section id="about" className="section" ref={aboutRef}>
  <h2>About Me</h2>
  <p>
    I’m a developer with a passion for building innovative software solutions that seamlessly blend technology with real-world impact. I specialize in crafting clean, efficient code and designing intuitive user experiences, always focusing on performance and scalability.
  </p>
  <p>
    Currently, I’m studying Computer Science and Artificial Intelligence at IE University in Madrid, where I’m expanding my skills in software development and AI. I’m driven to tackle complex challenges and create solutions that push the boundaries of what’s possible in the tech space.
  </p>
  <p>
    In the past, I’ve worked on various projects ranging from personal coding endeavors to collaborative team efforts, honing my abilities in a wide array of programming languages and tools. I’m particularly interested in applying my knowledge to real-world projects and contributing to the advancement of technology.
  </p>
  <p>
    Outside of coding, I enjoy exploring new technologies, staying active, and immersing myself in music and nature.
  </p>
</section>

        <section id="projects" className="section" ref={projectsRef}>
          <h2>Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </section>
        <section id="contact" className="section" ref={contactRef}>
    <h2>Contact</h2>
    <p>
      Feel free to reach out to me via email at{' '}
      <a href="mailto:mattporteous44@gmail.com">mattporteous44@gmail.com</a> or find me on any one of these pages: </p>
    <div className="social-icons">
      <a
        href="https://www.linkedin.com/in/matthew-porteous-23847a2b2/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <FaLinkedin />
      </a>
      <a
        href="https://github.com/torteous44"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <FaGithub />
      </a>
    </div>
  </section>
      </main>
    </div>
  );
}

export default App;
