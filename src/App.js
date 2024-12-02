import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './assets/fonts/fonts.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import ProjectCard from './ProjectCard';
import CustomCursor from './components/CustomCursor'; 
import ParticleCanvas from './components/ParticleCanvas';


function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'; // Default to dark mode
  });



    const [counter, setCounter] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the counter value from the backend
    const fetchCounter = async () => {
      try {
        const response = await fetch('https://portfolio-backend-muddy-sun-3794.fly.dev/count');
        const data = await response.json();
        setCounter(data.count);
      } catch (error) {
        console.error('Error fetching counter:', error);
      } finally {
        setLoading(false); // Loading complete
      }
    };
  
    // Increment the counter in the backend
    const incrementCounter = async () => {
      try {
        const response = await fetch('https://portfolio-backend-muddy-sun-3794.fly.dev/increment', {
          method: 'POST',
        });
        const data = await response.json();
        setCounter(data.count);
      } catch (error) {
        console.error('Error incrementing counter:', error);
      }
    };
  
    useEffect(() => {
      fetchCounter(); // Fetch the initial counter value
    }, []);

    // Dynamically load CSS for the selected theme
    useEffect(() => {
      console.log('Applying theme class:', theme); // Debug log
      if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      }
      localStorage.setItem('theme', theme);
    }, [theme]);
    
    

  // Toggle theme between dark and light modes
  const toggleTheme = () => {
    console.log('Toggle button clicked. Current theme:', theme);
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  // References to each section
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const contentRef = useRef(null);

  // Reference for the blurry shape
  const blurryShapeRef = useRef(null); 

  // Function to scroll to a section
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current && contentRef.current) {
      contentRef.current.scrollTo({
        top: sectionRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Intersection Observer to update active section
  useEffect(() => {
    const options = {
      root: contentRef.current,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    const sections = [aboutRef.current, projectsRef.current, contactRef.current].filter(Boolean);

    sections.forEach((section) => observer.observe(section));

    // Cleanup function
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);


  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.42;
      currentY += (mouseY - currentY) * 0.42;

      if (blurryShapeRef.current) {
        blurryShapeRef.current.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      }

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate(); // Start the animation loop

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);



  useEffect(() => {
    const checkIfTouchDevice = () => {
      const touchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsTouchDevice(touchDevice);
    };

    checkIfTouchDevice();


    window.matchMedia('(hover: none) and (pointer: coarse)').addEventListener('change', checkIfTouchDevice);


    return () => {
      window.matchMedia('(hover: none) and (pointer: coarse)').removeEventListener('change', checkIfTouchDevice);
    };
  }, []);



  // Projects data
  const projects = [
    {
      title: 'Expense Tracker Application',
      description:
        'A web-based full-stack expense management system allowing users to add, edit, and track expenses with analytics and profile management features.',
      technologies: ['React', 'CSS', 'Python', 'MySql', 'Microsoft Azure'],
      image: require('./assets/images/expense-manager.png'),
      githubLink: 'https://github.com/Torteous44/ExpenseTracker',
      liveDemoLink: 'https://torteous44.github.io/ExpenseTracker/',
    },
    // {
    //   title: 'Shazam and SoundCloud DJ Setlist Generator',
    //   description:
    //     'A project that uses the Shazam and SoundCloud APIs to create a setlist of songs used in a DJ’s set.',
    //   image: require('./assets/images/dj-setlist.png'),
    //   technologies: [  'Shazam API', 'SoundCloud API','Python',],
    //   githubLink: 'https://github.com/Torteous44/Soundcloud',
    //   liveDemoLink: null,
    // },
    {
      title: 'Command Line Password Manager Written in C',
      description: 'Allows users to securely store and manage their passwords for various websites or services. The passwords are encrypted using a master password and an encryption key, providing an additional layer of security.',
      image: require('./assets/images/passwordmanager.png'),
      technologies: ['C'],
      githubLink: 'https://github.com/Torteous44/PasswordManager',

    },
    {
      title: 'Terminal-Based Chat Application in C',
      description: 'A real-time multi-client chat application built using C with support for public and private chat rooms, direct messaging, and user management. The application uses socket programming and multithreading for seamless communication between the server and multiple clients.',
      image: require('./assets/images/terminalchat.png'),
      technologies: ['C', 'Socket Programming', 'Multithreading'],
      githubLink: 'https://github.com/Torteous44/TerminalChat',
    }
    
  ];



  // Reusable navigation click handler
  const handleNavClick = (e, sectionRef) => {
    e.preventDefault();
    scrollToSection(sectionRef);
  };

  return (
    <div className="app-container">
      <div className="blurry-shape" ref={blurryShapeRef}></div>

      {!isTouchDevice && <ParticleCanvas theme={theme} />}
    
      {!isTouchDevice && <CustomCursor />}

      <aside className="sidebar">
        <div className="profile">
          <a href="#top" onClick={() => scrollToSection(aboutRef)} className="logo" >
            <h1>Matthew Porteous</h1>
          </a>
          <p>CS and AI Student <p></p> IE University</p>
        </div>

        {/* Navigation Links */}

        <nav className="toc">
          <ul>
            <li>
              <a
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => handleNavClick(e, aboutRef)}
              >
                About Me
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={activeSection === 'projects' ? 'active' : ''}
                onClick={(e) => handleNavClick(e, projectsRef)}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => handleNavClick(e, contactRef)}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

  {/* Counter Tooltip */}
    <div>
      <div id="counter-tooltip" onClick={incrementCounter}>
        {loading ? (
          <div className="spinner"></div> // Render spinner while loading
        ) : (
          <span>{counter}</span> // Display counter after loading
        )}
        <div className="tooltip">
          This button has been clicked {counter} times globally.
        </div>
      </div>
    </div>





        <button className="theme-toggle-wrapper" onClick={toggleTheme}>
  <span className="theme-toggle-text">
    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
  </span>
  <div
    className="theme-toggle-circle"
    style={{
      backgroundColor: theme === 'dark' ? '#fff' : '#000',
    }}
  ></div>
</button>



      </aside>

      {/* Right-side Scrollable Content */}
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
            <a href="mailto:mattporteous44@gmail.com">mattporteous44@gmail.com</a> or find me on any of these platforms:
          </p>
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



        <footer className="footer">
        <p>
          Built with <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> |
          <a href="https://github.com/Torteous44/portfolio" target="_blank" rel="noopener noreferrer"> View on GitHub</a>
        </p>
      </footer>
      </main>
    </div>
  );
}

export default App;
