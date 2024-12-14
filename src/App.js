
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './assets/fonts/fonts.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import ProjectCard from './components/ProjectCard';
import CustomCursor from './components/CustomCursor'; 
import ParticleCanvas from './components/ParticleCanvas';
import AsciiLizard from './components/lizard.js'; 
import AsciiCactus from './components/cactus.js';
import './asciiStyles.css'
import RedMusic from './music/Red.mp3';
import DreamDeath from './music/dreamdeath.mp3'
import OutCasts from './music/Outcasts.mp3'
import MusicVisualizer from './components/MusicVisualizer';
import Grandma from './music/grandma.mp3';
import Forget from './music/forget.mp3';
import SendMe from './music/sendme.mp3';
import TropicBirds from './music/tropicbirds.mp3'
import Twenny from './music/twenny.mp3'
import UrEyes from './music/urEyes.mp3'
import Giggle from './music/Giggle.mp3'
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css'; 
import wombCore from './music/wombCore.mp3';
import silver from './music/silver.mp3';
import Prim from './music/Prim.mp3';
import pinCycle from './music/pinCycle.mp3';
import deceptacon from './music/Deceptacon.mp3';
import DateAsciiArt from './components/date';
import deadDog from './music/DeadDogsSkin.mp3';
import electronicShop from './music/electronicShop.mp3';


function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isTouchDevice, setIsTouchDevice] = useState(false);


  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'; // Default to dark mode
  });



  const [musicPlaying, setMusicPlaying] = useState(false);

  const playlist = [RedMusic, DreamDeath, OutCasts, Grandma, Forget, SendMe, TropicBirds, Twenny, UrEyes, Giggle, wombCore, silver, Prim, pinCycle, deceptacon, deadDog, electronicShop ];
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [easterEggActive, setEasterEggActive] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1); // Controls the fade effect
  const audioRef = useRef(new Audio(RedMusic)); 

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        const locomotive = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
        });
        return () => {
            locomotive.destroy();
        };
    }
}, []);



  const handleEasterEggActivation = () => {
    if (window.innerWidth === window.screen.width) {
      setEasterEggActive(true);
    } else {
      alert("Please resize the window to match the full screen width to activate this feature!");
    }
  };

  useEffect(() => {
    const checkWindowWidth = () => {
      if (window.innerWidth !== window.screen.width) {
        setEasterEggActive(false); 
      }
    };

    window.addEventListener("resize", checkWindowWidth);
    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []);


  const playMusic = () => {
    if (!musicPlaying && audioRef.current) {
      audioRef.current.play();
      setMusicPlaying(true);
    }
  };

  
  
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const maxScroll = e.target.scrollHeight - e.target.clientHeight;
  

    const halfwayPoint = maxScroll * 0.5; 
    const opacity = scrollTop <= halfwayPoint
      ? 1 - scrollTop / halfwayPoint 
      : 0; // Fully white after halfway point
    setFadeOpacity(opacity);
  
    // Play music when halfway point is reached
    if (scrollTop >= halfwayPoint && !musicPlaying) {
      playMusic();

      
    }

    
    if (scrollTop === 0 && easterEggActive) {
      setEasterEggActive(false);


    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset the music
    }
    setMusicPlaying(false); // Reset the ability to play music
    }
  };
  
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
      fetchCounter(); 
    }, []);

    useEffect(() => {
      
      if (!easterEggActive) {
        setFadeOpacity(1);
        setMusicPlaying(false);
        document.body.style.backgroundColor = ''; 
      }
    }, [easterEggActive]);
    useEffect(() => {

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
        'A web-based full-stack expense management application allowing users to add, edit, and track expenses with analytics and profile management features.',
      technologies: ['React', 'CSS', 'Python', 'MySQL', 'Microsoft Azure'],
      image: require('./assets/images/expense-manager.png'),
      githubLink: 'https://github.com/Torteous44/ExpenseTracker',
      liveDemoLink: 'https://torteous44.github.io/ExpenseTracker/',
    },
    {
      title: 'Restaurant Menu Management System',
      description: 'An AI-powered system for managing restaurant menus, allowing users to create, view, and update menu items, sections, and dietary restrictions.',
      image: require('./assets/images/restaurantmenu.png'),
      technologies: ['Python', 'Django', 'React', 'JavaScript', 'MySQL'],
      githubLink: 'https://github.com/Torteous44/Restaurant_Menu_DB',
    },
    
    {
      title: 'Terminal-Based Chat Application in C',
      description: 'A real-time multi-client chat application built in C, supporting public/private chat rooms, direct messaging, and user management. It uses socket programming and multithreading for seamless server-client communication.',
      image: require('./assets/images/terminalchat.png'),
      technologies: ['C', 'Socket Programming', 'Multithreading'],
      githubLink: 'https://github.com/Torteous44/TerminalChat',
    },

    {
      title: 'SoundCloud Track Downloader and DJ Setlist Curator',
      description: 'A Python-based tool to download tracks from SoundCloud, trim audio clips using FFmpeg, and identify songs using the AudD.io API. It provides detailed metadata about the tracks, including title, artist, album, and lyrics.',
      image: require('./assets/images/dj-setlist.png'),
      technologies: ['Python', 'yt-dlp', 'FFmpeg', 'AudD.io API'],
      githubLink: 'https://github.com/Torteous44/Soundcloud',
    },

    {
      title: 'Command-Line Password Manager',
      description: 'A simple command-line tool written in C for securely storing and managing passwords. The application encrypts passwords using a master password and an encryption key, ensuring secure access to stored credentials.',
      image: require('./assets/images/passwordmanager.png'),
      technologies: ['C'],
      githubLink: 'https://github.com/Torteous44/PasswordManager',
    }
    
    
    
  ];
  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3);



  // Reusable navigation click handler
  const handleNavClick = (e, sectionRef) => {
    e.preventDefault();
    scrollToSection(sectionRef);
  };

  
  
  
  
  
  
  return (
<div
  className="app-container"
  style={{
    backgroundColor: `rgba(255, 255, 255, ${1 - fadeOpacity})`, 
    transition: 'background-color 0.3s ease', 
  }}
>
{!easterEggActive && (
    <div className="blurry-shape" ref={blurryShapeRef}></div>
  )}

      {!isTouchDevice && <ParticleCanvas theme={theme} />}
    
      {!isTouchDevice && <CustomCursor />}
      <aside


  className="sidebar"
  style={{

    opacity: fadeOpacity,
    transition: 'background-color 0.3s ease',
    borderWidth: `${fadeOpacity * 1}px`, 
    display: fadeOpacity === 0 ? 'none' : 'block', 
    zIndex: '9999',

  }}

>
  <div
    style={{
      opacity: fadeOpacity, // Fade contents dynamically
      transition: 'opacity 0.3s ease',
      zIndex: '100',
    }}
  >
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
          <div className="spinner"></div> 
        ) : (
          <span>{counter}</span> 
        )}
        <div className="tooltip">
          This button has been clicked {counter} times globally.
        </div>
      </div>
    </div>

        <button className="theme-toggle-wrapper" onClick={toggleTheme}>
  {/* <span className="theme-toggle-text">
    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
  </span> */}
  <div
    className="theme-toggle-circle"

  ></div>
</button>


</div>

      </aside>
      

      {/* Right-side Scrollable Content */}
      <main
        className={`content ${easterEggActive ? 'easter-active' : ''}`}
        ref={contentRef}
        onScroll={easterEggActive ? handleScroll : undefined}
        style={{


        }}>
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
  <div className="projects-header">
    <h2>Projects</h2>
    <label className="container">
      <input
        type="checkbox"
        checked={showAllProjects}
        onChange={() => setShowAllProjects(!showAllProjects)}
      />
      <svg
        className="chevron-right"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 320 512"
      >
        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
      </svg>
      <svg
        className="chevron-down"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 512 512"
      >
        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
      </svg>
    </label>
  </div>
  <div className="projects-grid">
    {displayedProjects.map((project, index) => (
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


        <footer className="footer"
        >
  {theme === 'light' && (

  <div className="ascii-art-container">
  <div className="ascii-art-lizard">
          <AsciiLizard />
          <AsciiCactus onEasterEggActivate={handleEasterEggActivation} />
      </div>

    </div>
  )}

          
        <p>
          Built with<a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> |
          <a href="https://github.com/Torteous44/portfolio" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </p>

      </footer>

{/* Main Easter Egg Section */}
{easterEggActive && (
  <div
    className="easter-egg-section"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '27000px', // Extend to create scrollable content
      backgroundColor: `rgba(255, 255, 255, ${1 - fadeOpacity})`,
      transition: 'background-color 0.3s ease',
      zIndex: 9999,
      pointerEvents: 'auto',
    }}
  >
    {/* Fading Content */}
    <div
      style={{
        transition: 'opacity 0.3s ease',
      }}
    >
      <div style={{ height: '28000px' }}></div> {/* Filler content */}
    </div>

    {/* ASCII Art Containers */}
    <div className="ascii-art">
      
      <div className="ascii-art-item" id="ascii-art-1">
        <pre>
          {`
                      __         __
                      /.-'       '-.\\
                     //             \\\\
                    /j_______________j\\
                   /o.-==-. .-. .-==-.o\\
                   ||      )) ((      ||
                    \\\\____//   \\\\____//   
                     '-==-'     '-==-'
           
          
          `}
        </pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-2">
<pre>
  {`
  
          ..
           $. ,o$$$o.
           $. $$$$$$$o.   ..
          .$. $' $$$$$$ ,o''
         .$'  $  '$$$$$,o'.,'   .oo'
        .$'   $.   $$$$'  ,,  .o'.
       .$'    '$o. 'O$ ..ooo''',oo'
      .$'     .o$'  '$$''     ,,o'
    .%$,,,,,ooO'      '      ,,o''
  .$o.          ,o'   $o    ..oo'
   ''O'''''''''','      $'$. .o'
      '$        $       '$,'o' '
      '$        $      .o $
       '$       $       .$$
        '$      $,     .o$$
         '$     $.    ,o' $
          $.    '$.   $,oooo''o,
          $.     $.  'o'       '$
          $.     $.     .,ooo,  $
        .''      'oo...o'  $ 'o $
                        $  $   ''
                        $  $
                        $  %
                       ,$  $
                       $  $'
                        ''
  `}
</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-3">
        <pre>
          
          {
          `
          .========================================================================.
          |        F   '-._                                                       J|
          |       J        '-._                                                   F|
          |       |       J    '-.                                                L|
          |--...__|_      |     F '-.                                            J |
          |       F '''-- L..  J    J'-._                                        | |
          |      J       J   '-|-.. |   J'-.___                                  L |
          |      J       |     |   '|--.|__|   ''''''''------......_______...--- F |
          |      |       |     |    |   |  F                                    J  |
          |'''---|--.... L.    L    L   | J                                     |  |
          |      |      J  '''J----J-...L_|                                     |  |
          |      F      J     |    J   J  |       _..__    --======..______     |  |
          |      L      J     |    |   |  |      /'    \\     |/ / /:   ||       '  |
          |------L----..|.....J....|__ L_ F      L.____)     |/ / /:   ||       |  |
          |     J       |     |    |  J  J       (-(- c\\ -.  |/ / /:   ||       |  |
          |     |       |     L    L  |__|       /    |    '-. ___ :   ||       F  |
          |     |       L  __J.---J'''|  |        \\_.'        \\    )___|'           |
          |     |__..--J-''  |    |  _|-''_...  __|            \\               J   |
          |---''F      |     |    |-'_:-'' _. ,'   \\  -._.\\     \\              ,   |
          |     L      |     L_.-':-'  _.-'  /      \\      \\     |             |   |
          |    J       L _.-J  .-'  .-'   _ /    )   \\     .''.   )  _          |   |
          |    |     .J-'   :-'   .'.--.   /    /     a#--'   |  ''   '''----...'  |
          |    | _.-' |   .'    .'  Cc_ '-'  _.' \\.  (U/      |  |             |   |
          |-_.-:'     | .'    .'       'L _)/     '-._J      .|  :             J   |
          |'   |      |(    .'   ___    '._J     . /  |   './ L  J>             L  |
          |    |      |'.  (   ____  . .  _.  ) . /   L   _/  '--'              J  |
          |    |    .-'  \\-.'    ___ \\  \\._ -' . /    (    (                    'L |
          |    | .-'      '.'-._      '-._   .' /      \\   J                     ' |
          |    .'          )    '-._  ._ _.-' .'        )  \\                      '|
          | .-'           (_..--..  '-..___.-'         / '' ))                     |
          |                       '-.      .'       ,-'/,  /                       |
          |                          '.   /         C/juu,'                        |
          |                            \\ |                                         |
          |                            (_)                   ._                    |
          |                                                 F  ' -..__             |
          |                                                J         | '-- .__     |
          |                                                F  '--.. _F       |'--..|
          |                                               J         J '--..__|_    |
    `}</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-4">
        <pre>{` 
        

            (                 ,&&&.
             )                .,.&&
            (  (              \\=__/
                )             ,'-'.
          (    (  ,,      _.__|/ /|
           ) /\\ -((------((_|___/ |
         (  // | (''      ((  ''--|
       _ -.;_/ \\\\--._      \\\\ \\-._/.
      (_;-// | \\ \\-'.\\    <_,\\_\\'--'|
      ( '.__ _  ___,')      <_,-'__,'
       ''(_ )_)(_)_)'


  `}</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-5">
        <pre>{`
        

                                .-""""-.
                              F       'Y
                              F          Y
                            I            I
                              L          J          ##
                              L        J          ###
                          #    '-.__.-'          ####
                  _____   ##                 .---#####-...__
              .--'     '-###          .--..-'    ######     ""'---....
    _____.----.        ###''.._____ .'          #######
                        ###       /       -.    ####### _.---
                        ###     .(              #######
                        #      : '--...        ######
                        #       '.     ''.     ######
                              _   :       :.    #####
                              ( )            )    ###
                            ,- -.           /    ##
                            |,   .|          |   .##
                            || ' |;         |     '
                        .  ((_, J         <
                      .'    | | |         |
                      /      | ; )         |
                    '       |_ -          .
                                            
        
        `}</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-6">
        <pre>{`  



                               /
                              /               .'
                             /              .'
                            /   ______.   .'
                           /   / __/_//  '
                          /   / /  c c
                         /    \\ G    >                    _.-'
                        /      \\/.  -                 _.-'
                       /     .---\\  / --.         _.-'
                      /     /     \\(     \\    _.-'
                     /     /  \\    \\  (.  )  '
                    /     /   /\\       \\ /
                   /      \\  |  \\       \\               __..--''
                  /   .'   \\_\\   )     )\\      __..--''
                 /  .'      ) \\  |    /   \\  -''
                / .'   _   '///' (   /\\    \\
               /.' _.-'  __     /    ) )    )
               '.-'..--''      /   ,' /    /
                .__---------- /__./  /    / --------------------a:f
                   ''--..  __//  /   )   /
                          /    _J)   /)'-\\
                          '-__/-'  '' \\\\  |(
                                      '\\   \\  -..__
                                        '--'       ''--..__
                                                           ''--

 
 
 `}</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-7">
        <pre>{`
                                 ________________
                                 .-- _______________ .|
                               _____F________       T:]
                              F              Y .-""""-.
                              [ \\:.-.=''     ]'        'c
                              [              :           a
                              [ A            :   .aa.     )
                              [ S            ]   8()8     J
              _a:f___________ [ C        88  ]   '9P'     s  ____________________
                              [ I        88  ]           v                    __
                              [ I        88  ]         .'                    (__.'
             .._              L______________J '-.__.-'      _..aaaaaaaaa.._     \\'.
             8888b.                                       .888888888P888888888'   |]
             )88888)      .---c--c---c -,-,-,--a         c8888888a'_'_'a8888888a  |]
             d8888P)    .'  .  .   .   n / /  / '       /'a88888888888888888889'  |/
             88P"_/   .'  .' .'  .'_  / n n  / '        '. '"Y888888888888PP"'./
             ---'  ,.'  ======== /_/=====   ( .           '--.____________.--'
                   _\\______________________/_
             
             
             
        
        `}</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-8">
        <pre>{`  
        
                                        _
                              .(_)_
                             /,    \\                 .
                            <_)    |\\
                           __/._ .-|/_         '     .     '
                            (   .   )             .  |  .
                            : .d8b-'/       _      \\.-./      _
        a:f.-.-..-.--.--._  ( ( Y 'n   ____________'...'__________
        '/    '-.  . -      : : # .v       .    ----==-----    .
           .'-.   ' .-,_.-' ( )_#_/  '-._.   -     ---     --
                  ._.-'      O/ #        '/:_      ---  -
          '.,   .-'          "' #          ' '=. .  -
            _.-'                #               '-:
                                .
                                '':
                                 '
      



        `}</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-9">
<pre>

  {`
  
  b.
  88b
  888b.
  88888b
  888888b.
  8888P"
  P" '8.
      '8.   
       '8
  `}
</pre>
      </div>
            
      <div className="ascii-art-item" id="ascii-art-10">
<pre>

  {`
  
              __________________________
  __..--/".'                             '.
__..--""      | |                          |
/              | |                          |
/               | |    ___________________   |
;                | |   :__________________/:  |
|                | |   |                 '.|  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |                  ||  |
|                | |   |______......-----"\\|  |
|                | |   |_______......-----"   |
|                | |                          |
|                | |                          |
|                | |                  ____----|
|                | |_____.....----|#######|---|
|                | |______.....----""""       |
|                | |                          |
|. ..            | |   ,                      |
|... ....        | |  (c ----- """           .'
|..... ......  |\\|_|    ____......------"""|"
|. .... .......| |""""""                   |
'... ..... ....| |                         |
"-._ .....  .| |                         |
"-._.....| |             ___...---"""'
 "-._.| | ___...---"""
     """""             

  `}
</pre>
      </div>

      
      <div className="ascii-art-item" id="ascii-art-11">
        <pre>
{`


                                            . 
                        .   \\ \\ / \\ \\|   \\ | / /  ,
                      \\  \\  | | |  |/ \\  | | |/  /  | .
                    \\  |  \\ \\ | \\ / | | / / / | |   /_/  /
                \\_ \\ \\ \\  |  |\\ | | | / | | | / _/,-'/_,-' /
            _   _ \\ \\|  \\_\\_  \\| \\ \\ | |/ / / / _/ _/,---'  /
             \\___\\ \\_ \\__ \\ \\ | \\ \\ | / // | / // _/_/__/ __/_
           __  _ \\_  \\   \\  |  \\ \\  |/ |/  | | / / / /___/ _/ _/
         _   \\___  \\                                 /  _____/
          \\_ \\__ \\    -------.___    -----._______     / _/  __/
            \\__ \\    _____       -----              __  / __/
               \\               _______   ------'         /
            __ |     ___________         ___________     | __
           /  '| ,-' ___________ '.   ,' ___________ '-. |'  \\
           | /' (_,-' _______   './   \\,'   _______ '-._) '\\ |
           | |     ,-'   '._,'-.         ,-'   '._,'-.     | |
           | |.  ,' '.          ''.     ,' '.          '.  :| |
           | \\   ''.   '-._____,-,'     '.   '-._____,-,'   / |
            \\  '   '-._______,-'  :   :  '-._______,-'    ' / 
             \\_.                  |   |                  ._/
               |                  |   |                  |
                \\                /     \\                /
                 \\              /       \\              /
                  \\            |         |            /
                   |           \\,--._,--./           |
                   |       _,.--''''-''''--.._       |
--.  ,---.  ,---.  |     ,' __,-----------.__ '.     ,---.  ,---.  ,---.  ,---.
-- \\(     \\(  -- \\_|____/_,'\\/|  |  |  |  |\\/'._\\__ / --  )/     )/ --  )/,--, )
.--.\\\\  -- \\ .--.\\           '-.|__|__|,-'        /,--, // --  //,--, /(/__/ /
 \\__\\)\\ .--.\\ \\__\\)                              (/__/ //,--, /(/__/ /  '---'
'---'  \\ \\__\\)'---'                                '---'(/__/ /  '---'
        '---'                                            '---'





`}</pre>
      </div>

      
      <div className="ascii-art-item" id="ascii-art-12">
<pre>
  {`
  
  __________-------____                 ____-------__________
  \\------____-------___--__---------__--___-------____------/
   \\//////// / / / / / \\   _-------_   / \\ \\ \\ \\ \\ \\\\\\\\\\\\\\\\/
     \\////-/-/------/_/_| /___   ___\\ |_\\_\\------\\-\\-\\\\\\\\/
       --//// / /  /  //|| (O)\\ /(O) ||\\\\  \\  \\ \\ \\\\\\\\--
            ---__/  // /| \\_  /V\\  _/ |\\ \\\\  \\__---
                 -//  / /\\_ ------- _/\\ \\  \\\\-
                   \\_/_/ /\\---------/\\ \\_\\_/
                       ----\\   |   /----
                            | -|- |
                           /   |   \\
                           ---- \\___|


  `}
</pre>
      </div>
      
      <div className="ascii-art-item" id="ascii-art-13">
        <pre>
{`

                          __..__             
                      _.sMSMMMMMMb.          
                   .-"TMMMMSMMMMMMMb.    
                 .'    TMMMMSMMMMMMMMb       
                /       TMMMSMMMMMMSSS;      
               :        :MMMMSMMMSSMMMM;     
               ;       @ MMMMSMMSMMMMMMS     
              :    _,   ,P"TMSMSMMMMMMSM     
              : .+""',  :    'TMMMMMSSMM     
               ) c),     '-,-=,TSSSSMMMM     
              /  ''         ,-;|MMMMMMMM;     
             /     _.'(o)  '-';SMSSSSSS      
            (  ,   o       ,-"''^MMMM'       
             )''            :'.    .'         
             )-.           ;  '- /           
             \\         _.-'     :            
             (     _.-"   '.     \\           
              "---"--.      \\     \\          
                      ''.     \\     \\         
                         \\       _.sSb        
                         \\ _.sSSSSSSSb       
                         dSSSSSSSSP^" \\      
                         SSSP^" ___    \\     
                        /    .gP""""Tp. \\    
                       :    d'     .  'b \\   
                       ;   d'       o  'b ;  
                      /   d;            'b|  
                     /,   $;          @  ':  
                    /'    $$               ; 
                  .'      $$b         (o)  | 
                .'       d$$$;             : 
               /       .d$$$$;          ,   ;
              d      .d$$$$$$$          $   |
             :bp.__.g$$$$$$$$$         :$   ;
             $$$$$$$$$$$$$$$$$         $$b : 


`}</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-14">
        <pre>
{`
                        .   *        .       .
                        *      -0-
                           .                .  *       - )-
                        .      *       o       .       *
                  o                |
                            .     -O-
                 .                 |        *      .     -0-
                        *  o     .    '       *      .        o
                               .         .        |      *
                    *             *              -O-          .
                          .             *         |     ,
                                 .           o
                         .---.
                   =   _/__~0_\\_     .  *            o       '
                  = = (_________)             .
                                  .                        *
                        *               - ) -       *
                               .               .

`}</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-15">
<pre>
  {`
  


                              \\|       ...
                              -:.     //||\\\\       _.
                                '::::' Q Q ''::::::+.
                                      ._"__.'      \\
                                  ____ '==' _._
                                .'             '.
                              .' .:-      .-.    '
                            .' '.')       ' _  /||.
                       __.--|_.'  '      : ( \\/' /\\\\
                      /,=-U'     '      :   '.  ''. /U
                                ' '  .  (     -._.---"
                      ....-----( ' . '   -.
                )   .:\\:::\\    ''. '  '  .'
            _  (  .:::::::::....--'--..-' \\
           ( ''-.\\\\:::''               \\    \\
           \\\\ ""\\\\-'                   ''..:.\\
            '':-=/)                       '(::)
                 ''                      .:::/
 a:f_______________________________     |::/   _________
                     ______...       .."\\\\/
  .......------""""""       __..   . \\\\ -. _   .
                    __..--''    ..'...'- (\\\\ '-'
          __..---"""  ..:::::::::::::::.'.'-.   .
        ''               ''''''''':::::::.'._)   .
                       .-'            ':'''       .
                    .-'               .            .
                   '                 .              .
                                    .                .

       

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-16">
<pre>
  {`
                                               _.-''''-,_
                                   _,.,_ ,-''           ''-.,_
                                 /)     (\\                   '''-.
                                ((      ) )                      '\\
                                 \\)    (_/                        )\\
                                  |       /)           '    ,'    / \\
                                  '\\    ^'            '     (    /  ))
                                    |      _/\\ ,     /    ,,'\\   (  "'
                                     \\Y,   |  \\  \\  | ''''| / \\_ \\
                                       '')_/    \\  \\  )    ( >  ( >
                                                \\( \\(     |/   |/
                                               /_(/_(    /_(  /_(
          

  `}
</pre>
      </div>


      <div className="ascii-art-item" id="ascii-art-17">
<pre>
  {`

       899X7                                                X8997
     g999999Wm_                                         ,gm999999W.
   gW99*~~~~VM9Ws                                     ,m99*~~~~VM99m.
  g999'       '*99i                                  W9Af        Y99W.
  999[          '*9W_                             ,g9Af           999b
  999W            '*9W.                          g9Af            i9999
  9999W_            'V9W.       \\.    ./       g9A~            ,g99999
  99999**Nm__          ~MW_.     N.  .N     _g9f'         ,_gm**M99999
  9999|   89999mms___    ~MWm.    [ ]'    gm9f'   ,___mmW9999|   8999P
  99999mmW99A***M9999999mms2M9s_,g+=Ye.,_W95_mmW9999999****999mmW9999[
  999999999'     '9999Af'  ~VM999P    9999*~'  ~*9999P      Y99999999[
  M9999AM99s.   ,g9999'       '99[    99P        Y999W_    _W99*99999!
  ]9999b'*999999999999b       _999.  d99b.      ,999999999999Af,99999
  'M9999i 'V*9999999999Wm__gmW9999[  99999mm__gm9999999999A*~  W9999f
    M9999s      ~~~~~~~~~~~~LmW99f   'M99ms7~~~~~~~~~~~'     ,W9999!
     V9999Ws_        ___mmW99999[      999999mms__.       ,_m9999A'
      '~*999999999999A**f~   ]9A[      A99   '~***999999999999Af~
          2999A*~~'          d9 9     ][]9.          ~~V*999K.
       ,gW9A~             ,_W9! 9[    9[ M9s_             'V99m_
      i999A            ,_W99f' i9[    9W  ~M99s_            !999W
      !9999ms_______mW99Af'   d99A.  /999.   ~*999ms_______mW999A
       Y9999f~~~~~~~~~'     gW9f~ +_z''~M9m.     ~~~~~~~~~~M9999'
        V999            ,gm9Af'          ~*9Wm_            ]99A'
          ~*Nm______mmW99Af                 '*999mms_____gm*f'
             99999999                              99999999




  `}
</pre>
      </div>


      <div className="ascii-art-item" id="ascii-art-18">
<pre>
  {`
    ___
    ,'   '.
   /_. _,. \\
  ( /('   \\ :
   \\\\|    / ;
    ''   / /
        / /
       : :
       | :    _______
       :  \\ ,'       '-._
       '   /    .  .  .  \\
        : '' ;  ;  ;  ; , :
         \\'./  /  /  / ; ;;
          '. ''../__/ / ,.\\
             ''-.____;-''\\\\\\
                 \\ //   / '|
                  ::\\
                  ||\\\\
                  || \\\\
                  ||  ))
                  || //
                  ||//
                  ||/
                  ||
                 /||
                 '||-
               __,';     

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-19">
<pre>
  {`
                                  _.._
                                  /   a\\__,
                                  \\  -.___/
                                   \\  \\
                              (\\____)  \\
                          |\\_(         ))
                     _____|   (_        /________
                          _\\____(______/__
                                ______

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-20">
<pre>
  {`

#####\\             _             /#####
#( )# |          _( )__         | #( )#
##### |         /_    /         | #####
#" "# |     ___m/I_ //_____     | #" "#
# O # |____#-x.\\ /++m\\ /.x-#____| # O #
#m.m# |   /" \\ ///###\\\\\\ / "\\   | #m.m#
#####/    ######/     \\######    \\#####
  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-21">
<pre>
  {`

                         ,_  .--.
                   , ,   _)\\/    ;--.
           . ' .    \\_\\-'   |  .'    \\
          -= * =-   (.-,   /  /       |
           ' .\\'    ).  ))/ .'   _/\\ /
               \\_   \\_  /( /     \\ /(
               /_\\ .--'   '-.    //  \\
               ||\\/        , '._//    |
               ||/ /'(_ (_,;'-._/     /
               \\_.'   )   /'\\       .'
                    .' .  |  ;.   /'
                   /      |\\(  '.(
                  |   |/  | '    '
                  |   |  /
                  |   |.'
               __/'  /
           _ .'  _.-'
        _.' '.-;'/
       /_.-'' / /
             | /
            ( /
           /_/




  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-22">
<pre>
  {`



                          .    . ///
                      ____J)   (//<_
                       -__ \\   Y .--'
                          \\ ' / /
                           ' / '   |\\  __
                            ' /. ('  ')  '-.
                           (  '. /  o2 _    \\
                a8.         \\   '-.--.  '- /
                888          \\_.   ) '._.'
               88P'        +_.)_   .              88a.
     8a       888( .a88   *_.'  '==)             888888a
     '8ba.ad8888888888P    ''...-'  '            888888888
       Y888P88888             )  ./            88888888888
           a88888             (   (           88P 88888 88)
          888888              *_.' \\          P  888888 8P
         88Y'888           .-  )  ' \\            888888
       a88"   88          (_.-'  ) ) )          888888
      888'    Y88     .-"" '. .-'.' .          a88 '88a
       Y8b.    '88   '       )   .-'          8P8   '88a
     aa8888     888. \\ ' _._.--"" '         888P      Y8P
                      '.   '. '-.  '                    "
                        '.   '   '._)
                          '.  '. '( )
 a:f___________________     '.--)'|_\\   ___________________________
                          __//_ \\
                        (:___/ #_\\



  `}
</pre>
      </div>


      <div className="ascii-art-item" id="ascii-art-23">
<pre>
  {`

                                         .--.
                  _______             .-"  .'
          .---u"""       """"---._  ."    %
        .'                        "--.    %
   __.--'  o                          "".. "
  (____.                                  ":
   '----.__                                 ".
           '----------__                     ".
                 ".   . ""--.                 ".
                   ". ". bIt ""-.              ".
                     "-.)        ""-.           ".
                                     "".         ".
                                        "".       ".
                                           "".      ".
                                              "".    ".
                        ^~^~^~^~^~^~^~^~^~^~^~^~^"".  "^~^~^~^~^
                                              ^~^~^~^  ~^~
                                                   ^~^~^~

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-24">
<pre>
  {`

                                    _______________________      |      
                                   |  ________   ________  |     |      
                                   | |        | |    ___ | |     |      
                                   | |        | |  ,',.('| |     |      
                                   | |        | | :  '   | |     |      
                                   | |        | | :) _  (| |     |      
                                   | |        | |  ':_)_,| |     |      
                                   | |________| |________| |     |      
                                   |  ________   ________  |     |      
                                   | |        | |        | |     |      
                                   | |        | |        | |     |      
                                   | |        | |        | |     |      
                                   | |        | |        | |     |      
                                   | |        | |        | |     |      
                                   | |________| |________| |     |      
                                   |_______________________|     |      
                                                                 |      
                                                                 |      
                                                                 |      
                    _____________________________________________|      
                                                                 '.     
                          .::.                                     '.   
                       .:::::::.                                     '. 
                    .:::::::::' .:.                                    '
                   ::::::::::' .::::.                                   
               .::. ':::::::' .:::::::.                                 
            .::::::.  '::::' .::::::::::                                
         .:::::::::::.  ':' .::::::::::'                                
      .::::::::::::::::.    :::::::::::                                 
   .::::::::::::::::::::' .  '::::::::'                                 
  :::::::::::::::::::::' .::.  '::::::                                  
   '::::::::::::::::::' .:::::.  ':::'                                  
     ':::::::::::::::' .::::::::.  ''                                   
       '::::::::::::' .::::::::::.                                      
         '::::::::'  .:::::::::::::.                                    
           '::::'   .::::::::::::::'                                 

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-25">
<pre>
  {`

      *                                                            *
                              aaaaaaaaaaaaaaaa               *
                          aaaaaaaaaaaaaaaaaaaaaaaa
                       aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                     aaaaaaaaaaaaaaaaa           aaaaaa
                   aaaaaaaaaaaaaaaa                  aaaa
                  aaaaaaaaaaaaa aa                      aa
 *               aaaaaaaa      aa                         a
                 aaaaaaa aa aaaa
           *    aaaaaaaaa     aaa
                aaaaaaaaaaa aaaaaaa                               *
                aaaaaaa    aaaaaaaaaa
                aaaaaa a aaaaaa aaaaaa
                 aaaaaaa  aaaaaaa
                 aaaaaaaa                                 a
                  aaaaaaaaaa                            aa
                   aaaaaaaaaaaaaaaa                  aaaa
                     aaaaaaaaaaaaaaaaa           aaaaaa        *
       *               aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                          aaaaaaaaaaaaaaaaaaaaaaaa
                       *      aaaaaaaaaaaaaaaa


  `}
</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-26">
<pre>
  {`
           _,               A                     /\\
         O/                / \\                   /  \\         _
         /\\ __  _         /   '.   A            /  ' \\        |\\
         \\ '. \\/ )       /      './ \\          /   \\  \\      /  \\    ,'
        '  \\/ /       /        /   \\         / ,    \\     /    \\  /
             / /       /       ,',--. \\  /\\   /   /  \\ \\   /      \\/
       '.   (_/       /      .' / ___) \\/  \\ /  /  '    \\.'        '.
         'A          /    _,'  / / @/  /    /,       \\   \\           '.
           'AA      /   ,'___  \\/  .|       /   ,'||'. \\ \\
        ,-'  '.    /   ,-'   '-''._/       /_.-'  ||  '-._\\
               '._/ ,-'   _    ''./              _.||._
                  '/  _.-"/    / ''.         _,-'      '-.
                  /  /'-./    /    \\    _.-'             '-.
                 /  /   /    /   A  \\.-'                    '-.
                /'./   /    /   / \\  \\     _                   :
               (()|    (      ,'   \\  '--+/ 3                 ''.
                \\||    |   |  \\     \\____|__3                    '._.-.
                    _,-|   |   \\                                  /
                _,-'   |   |\\   \\
             ,-'       )   ) \\   )  _.-"-.
          ,-'          /  /  /'./.-"     )
        ,'            /  /  /  /        /
       '             /'./.-/  /       ,'
                    /  /   \\  \\    ,-'
                _.-/  /     \\_/_.-"
            _.-"   \\  \\    _.-"                    
       __.-"        \\_/_.-"
       \\           _.-"
        \\      _.-"
         \\__.-"


  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-27">
<pre>
  {`
                ._,.
                "..-..pf.
               -L   ..#'
             .+_L  ."]#
             ,'j' .+.j'                 -'.__..,.,p.
            _~ #..<..0.                 .J-.''..._f.
           .7..#_.. _f.                .....-..,'4'
           ;' ,#j.  T'      ..         ..J....,'.j'
          .' .."^.,-0.,,,,yMMMMM,.    ,-.J...+'.j@
         .'.'...' .yMMMMM0M@^='""g.. .'..J..".'.jH
         j' .'1'  q'^)@@#"^".'"='BNg_...,]_)'...0-
        .T ...I. j"    .'..+,_.'3#MMM0MggCBf....F.
        j/.+'.{..+       '^~'-^~~""""'"""?'"'''1'
        .... .y.}                  '.._-:'_...jf
        g-.  .Lg'                 ..,..'-....,'.
       .'.   .Y^                  .....',].._f
       ......-f.                 .-,,.,.-:--&''
                                 .''...'..'_J'
                                 .~......'#'
                                 '..,,.,_]''     
                                 .L..''..''.     
     

  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-28">
<pre>
  {`
  


             .
                            _..------.._        +    ,'
                         .-'    i       '-.        ,;
                   .   .'.      |.         '.    .'/
            '-_       ;.      , jl.____     '. .'.'
              '';-_   ;. ._..---"""     """--.:' /
     .          '.-..:,-"   ,_.-'''--'''-9"h' .'   .
                  '.'^.,-Ce/    .'"'.   _.'  /
                    '. '-h'_.._/0 " 0\\''    {\\
            +         '.      |'-^Y^- |     //       .
                       ('\\     \\_."._/\\...-;..-.
                       '._'._,'' '''    _.:---'''
                          ;-....----''''
                         /   (                   +
                         |  (''
                         ''.^'


  `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-29">
<pre>
  {`
                                                         _..._       .-'''-.                                                              .-'''-.                                                                       .-'''-.                               
                                             .---.    .-'_..._''.   '   _    \\                                                           '   _    \\                                                                    '   _    \\          .---._______       
                               __.....__     |   |  .' .'      '.\\/   /' '.   \\  __  __   ___         __.....__                        /   /' '.   \\            __  __   ___                                         /   /' '.   \\         |   |\\  ___ ''.    
                   _     _ .-''         '.   |   | / .'          .   |     \\  ' |  |/  '.'   '.   .-''         '.                     .   |     \\  '           |  |/  '.'   '..-.          .-                _     _.   |     \\  '         |   | ' |--.\\  \\   
             /\\    \\\\   ///     .-''"'-.  '. |   |. '            |   '      |  '|   .-.  .-.   ' /     .-''"'-.  '.                .| |   '      |  '          |   .-.  .-.   '\\ \\        / /          /\\    \\\\   //|   '      |  '.-,.--. |   | | |    \\  '  
             '\\\\  //\\\\ ///     /________\\   \\|   || |            \\    \\     / / |  |  |  |  |  |/     /________\\   \\             .' |_\\    \\     / /           |  |  |  |  |  | \\ \\      / /           '\\\\  //\\\\ // \\    \\     / / |  .-. ||   | | |     |  ' 
               \\'//  \\'/ |                  ||   || |             '.   ' ..' /  |  |  |  |  |  ||                  |           .'     |'.   ' ..' /            |  |  |  |  |  |  \\ \\    / /              \\'//  \\'/   '.   ' ..' /  | |  | ||   | | |     |  | 
                \\|   |/  \\    .-------------'|   |. '                '-...-''   |  |  |  |  |  |\\    .-------------'          '--.  .-'   '-...-''             |  |  |  |  |  |   \\ \\  / /                \\|   |/       '-...-''   | |  | ||   | | |     ' .' 
                 '        \\    '-.____...---.|   | \\ '.          .              |  |  |  |  |  | \\    '-.____...---.             |  |                          |  |  |  |  |  |    \\ '  /                  '                       | |  '- |   | | |___.' /'  
                           '.             .' |   |  '. '._____.-'/              |__|  |__|  |__|  '.             .'              |  |                          |__|  |__|  |__|     \\  /                                           | |     |   |/_______.'/   
                             '''-...... -'   '---'    '-.______ /                                   '''-...... -'                |  '.'                                             / /                                            | |     '---'\\_______|/    
                                                               '                                                                 |   /                                          |'-' /                                             |_|                        
                                                                                                                                 ''-'                                            '..'                                                                         
 `}
</pre>
      </div>


      <div className="ascii-art-item" id="ascii-art-30">
<pre>
  {`


                                /|
                               / |                                           /|
                              /  |                                          / |
                             /    \\                                        /  /
                  ____---~~~~      ~~~~~-------_______                    /   |
___________----~~~ O \\                                ~~~~~----_____----~~    |
      ~~~~~~~--_____  )                                         _____         |
             __--~~~ /                                _____----~~~~~~------   \\
               ~~~~~~----_\\ \\____________--------~~~~~                     \\  |
                           \\ \\                                              \\ |
                             \\|                                              \\|


 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-31">
<pre>
  {`


                                                        ,
                                            .__ ._       \\_.
                                     _, _.  '  \\/   \\.-  /
                                      \\/     .-_'   // |/     \\,
                     .-""""-.          \\.   '   \\'. ||  \\.-'  /
                    F        Y        .-.'-(   _/\\ V/ \\\\//,-' >-'   ._,
                   F          Y   .__/   '. \\.   ' J   ) ./  / __._/
                  J         \\, I    '   _/ \\  \\  | |  / /  .'-'.-' '._,
           (       L   \\_.--.| \\_.      ' .___ '\\: | / .--'.-'"     \\
         \\ '\\    .  L   /    \\\\/        ._/'-.'  \\ .'.' .'---./__   '
    \\__  '\\ ) \\._/   '-.__. ' \\\\_. '   .---.  \\     /  /  ,   '  '
  --'  \\\\  ): // \\,            '-.'__.'     '- \\  /   / _/-.---.__.- .
     _.-'.'/ /'\\_, ._     >--.-""'____.--"'_     '   /.'..' \\   \\   _/'
 _ .---._\\ \\'/ '__./__.-..  / .-|(    x_.-'___  |   :' /    _..---_' \\
 .:' /'\\ '. '..'.--'\\      /.' /'-'._  '-,'   ' '   I '_.--'__--..___.--._.-
     '  '. '\\/'/  _.   _.-'      _.____./ .-.--""-. .-"    ' _..-.---'   \\
  -._ .--.\\ / /-./     /   .---'-//.___. .-'       \\__ .--.  '    '.     ''-
 ,--'/.-. ^.   .-.--.  ' _/    _//     ./   _..   .'  '.    \\ \\    |_.
    /' | >.   ' | \\._.-       '    _..'  '.' . '.       )    | |\\  '
  ./ \\ \\'  ) c| /  \\     \\_..  .--'    ,\\ \\_/'  :    )  ('-. '.|'\\\\
   \\'  / ,-.  | ' ./'  ._/ '\\\\'.--.,-((  '.'.__ |   _/   \\    |)  '--._/'
______'\\   |  < __________  //'  //  _)   )/-._'.  (,-')  )  / \\_.    /\\. _____
a:f        |  |        .__./    //  '\\  |//    '.\\ '\\ (  (  <'   ._  '
           >  |      _.  /   ..-\\ _    _/ \\_.  \\ '\\    \\_ '---.-'__
        . /  '-   _.'        /   '   _/|       J  /'     '-,,-----.'-.
            '  .:'          ''      '          < '   f  I //        '-\\_,
              '                         \\.     J        I/\\_.        ./
         __/                            ':     I  .:    K  '          '
         \\/ )                            ',   J         L
          )_(_                             .  F  .-'    J
         /    '.                           .  I  (.   . I _.-.._
   '    <'    \\ )                     _.---.J/      :'   L -'
 .:.     \\. _.->/                        _.-'_.)     ' '-.'---.,_.
:<        (    \\                    .--""   .F' J) '.'L.__'-.___
.:        |-'\\_.|                          Y ..Z     ))   '--'  '-
.         ) | > :                            . '    :'
          / ) L_J                            .x,.
          L_J .,                             .:<.,
        .''   '                               :J.,'
                                           . ;.+K,:.
                                               .,L+.,


 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-32">
<pre>
  {`

                                 _ .--.
                                ( '    )
                             .-'      '--,
                  _..----.. (             )'-.
                .'_|' _|' _|(  .__,           )
               /_|  _|  _|  _(        (_,  .-'
              ;|  _|  _|  _|  '-'__,--''--'
              | _|  _|  _|  _| |
          _   ||  _|  _|  _|  _|
        _( '--.\\_|  _|  _|  _|/
     .-'       )--,|  _|  _|.'
    (__, (_      ) )_|  _| /
   jgs'-.__.\\ _,--'\\|__|__/
                    ;____;
                     \\YT/
                      ||
                     |""|
                     '=='



 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-34">
<pre>
  {`

                            |
            '               |                      
                            I      / '
                     \\      8
                 '    \\          /
        .'     ,          .---.      .'     ,
     /                   '..   '       ,
            -- , --==   : <     :  ====-----
        .                . -'  .'
                .'        '---'          ,       ,
                       '         \\
     /       .        /  /  I ,'  \\          /      .'
         ,  '               I
  / '         .'            |
                       '              .'                 ,
                     /          /             /
     .'       .'    .'             .    ,    .'     /
                          _                             .
  /       .              (")   _                  .'
         ''        a___.'  \\  $"$  ,k
     ,        ,    '---'  || ,$..\\//                 /
                      / _ ||//'. ('      .'     .'   ,
 __________  ____    ( '^.'%/  ( x\\_   ________________________a:f__
           /          \\\\ | "   |/ '.)
                '     /J ||   //  (/         .'
   '         ,      .a   ''   ''        '           .
    ,  /           88   a8    8a   8.              '
                   '8a.8P     '88a.88      ,'
        .'       .a8888:a888a  '8888'
              a888888b88P  'Y88d88P888a
                 a88b           888   "
                 '"'




 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-33">
<pre>
  {`


                                  ,~-.
                                 (  ' )-.          ,~''-.
                              ,~' '  ' ) )       _(   _) )
                             ( ( .--.===.--.    (  '    ' )
                              '.%%.;::|888.#'.   '-''~~=~'
                              /%%/::::|8888\\##\\
                             |%%/:::::|88888\\##|
                             |%%|:::::|88888|##|.,-.
                             \\%%|:::::|88888|##/    )_
                              \\%\\:::::|88888/#/ ( ''  )
                               \\%\\::::|8888/#/(  ,  -''-.
                           ,~-. '%\\:::|888/#'(  (     ') )
                          (  ) )_ '\\__|__/'   '~-~=--~~='
                         ( ' ')  ) [VVVVV]
                        (_(_.~~~'   \\|_|/   hjw
                                    [XXX]
                                    '"""'



 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-35">
<pre>
  {`

         _               a  h u
        (_)       __/7 a        U 
\\               c' ^C             U                     UUUUUUU
 >   ,---.--.__.{{,/'               UUU         UUUUUU
 _  '^^' )_,_  . '/      .--.           UUUUUU        
' \\     < \\  '--)/|   '---._ \\ ^.    
 .--._          / '         '--..-._           _________..--------a:f 
'   / '--._              /\\_.    '---._____.--'



 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-36">
<pre>
  {`

          _________________________________________________
         /                                                /|
        / _/_/_/_/_/ _/_/_/_/_/ _/_/_/_/ _/___/ _/_/_/_/ //
       /                                                //|
      / _/_/_/_/_/_/_/_/_/_/_/_/_/__/  _/_/_/ _/_/_/_/ //||
     / __/_/_/_/_/_/_/_/_/_/_/_/_/  / _/_/_/ _/_/_/_/ //_|/    ,---------
    /_/__/_/_/_/_/_/_/_/_/_/_/_/___/   _/   _/_/_/_/ //       /__/__/__/ /|
   / __/_/_/_/_/_/_/_/_/_/_/_/__/   _/_/_/ _/_/_/ / //       /          / |
  /   __/_________________/               ___/_/_/ //       /          /  .
 /                                                //       /          / .'
(________________________________________________(/       (__________(.'


 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-37">
<pre>
  {`


                     ,-.
         '._        /  |        ,
            '--._  ,   '    _,-'
     _       __  '.|  / ,--'
      '-._,-'  '-. \\ : /
           ,--.-.-''.'.-.,_-
         _ '--'-'-;.'.'-''--
     _,-' '-.__,-' / : \\
                _,'|  \\ '--._
           _,--'   '   .     '-.
         ,'         \\  |        '



 `}
</pre>
      </div>

      <div className="ascii-art-item" id="ascii-art-38">
<pre>
  {`


             |                              ____.......__
             |\\      .'           _.--""''''             ''''--._
             | \\   .'/      ..--''                             .-''
      .._    |  \\.' /  ..-''                                .-'
       '.''"-:  '  .-''                                  .-'
         '.             __...----""""""""""--..           \\
         -         ..-''                       ''""-._     \\
       .'  _.      \\                                  '"-   \\
      _.-'' |  /-.  \\                                    '-. \\
            | /   '. \\                                      '.\\
            |/      '-\\                                       '.
            |

 `}
</pre>
      </div>
      <div className="ascii-art-item" id="ascii-art-39">
<pre>
  {`

                  ,,
      _  -.      /(
       \\,  \\    /  \\     /
        )   \\(')  ,/   ,/
        \\-,_(("))//   /
 ,___,   '.,[_V_]"  _/    
 '  ,"'-;;=,' v '.;;/
           |' | '|'
          ,|- | -|"-._
         //| o|o |'"-.\\
        '/ '/,|,\\'    |
        |     "       |
        |,           '(
    ctr )              '.
       /
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-40">
<pre>
  {`

                           __
                          [__]
                          |  |
                          |  |
                          |  |
                          |  |
                          |  |
             ,----.      /'-. \\
            (      )    /-._|  \\
            |'----'|   |        |
            \\      /   |'-...   |
             '.  ,'    |'' . |  |
               ||      |','- |  |
             ,-||-.    |'-...|  |
            (  ''  )   |        |
             '----'     '-....-'

 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-41">
<pre>
  {`
                                          _____________               
                                          __/_|_|_|_|_|_|_\\__               
                                         /                   \\    .           
                    .       ____________/  ____               \\   :            
                    :    __/_|_|_|_|_|_(  |    |               )  |           
                    |   /               \\ | () |()  ()  ()  ()/   *          
                    *  /  ____           \\|____|_____________/            
       .              (  |    |            \\_______________/
       :               \\ | () |()  ()  ()    \\___________/
       |                \\|____|____________ /   \\______/     .
       *                  \\_______________/       \\  /       :
             3         .    \\___________/         (__)       |    .
               3       :       \\______/           /  \\       *    :
                3      |         \\  /            /    \\           |
                 3     *         (__)           /      \\          *
           ,,     3              /  \\          /        \\
         w'\\v',___n___          /    \\        /          \\
         v\\'|Y/      /\\        /      \\      /            \\
         '-Y/-'_____/  \\      /        \\    /              \\
          '|-'      |  |     /          \\  /                \\
   ________|_|______|__|____/____________\\/__________________\\__

 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-42">
<pre>
  {`
            ________
        _jgN########Ngg_
      _N##N@@""  ""9NN##Np_
     d###P            N####p
     "^^"              T####
                       d###P
                    _g###@F
                 _gN##@P
               gN###F"
              d###F
             0###F
             0###F
             0###F
             "NN@'

              ___
             q###r
              ""

 `}
</pre>

      </div>
      <div className="ascii-art-item" id="ascii-art-43">
<pre>
  {`
             :
             ,         ,-':'-._             ,;
              ', __..-'   :    '-.___...-,;'
                ;,        :           ,;';
                ; ',      :        ,;'   ;
                ;   ', _.-:-,_  ,;'      ;
                ;     ;,/\\:/\\,;'        ;
                ;    ; /\\,O;/\\:         ;
               ;    ,__/\\(+)/\\ ;        ;
              .,_,--',  /; ;\\ '-,_      ',
             -;      ", ;  _',,'  '-,_   ;
              ;       ';-'' '-;       '-,_;
               ;      ;        ',       ,-"-,_
               ;     ;           ;     ,'
                ;   ;             ',   ;
                ;  ;     _.._       ; ;
                 ;;  _.-'    '--..___;;
                 ;.-'                  ;
                ;'                      ',
               ;                          ;
              ;                            ltb
             ;                               ;
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-44">
<pre>
  {`


__________...----..____..-'''-..___
,'.                                  '''--.._
:                                             ''._
|                           --                    ''.
|                <o>   -.-      -.     -   -.        '.
:                     __           --            .     \\
'._____________     (  '.   -.-      --  -   .   '     \\
   '-----------------\\   \\_.--------..__..--.._ '. '.   :
                      '--'     SSt             '-._ .   |
                                                   '.'  |
                                                     \\' |
                                                      \\ |
                                                      / \\'.
                                                     /  _\\-'
                                                    /_,'


 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-45">
<pre>
  {`


               __ ___
             .'. -- . '.
            /U)  __   (O|
           /.'  ()()   '.\\._
         .',/;,_.--._.;;) . '--..__
        /  ,///|.__.|.\\\\\\  \\ '.  '.''---..___
       /'._ '' ||  ||  '' _'\\  :   \\   '   . '.
      /        ||  ||        '.,    )   )   :  \\
     :'-.__ _  ||  ||   _ __.' _\\_ .'  '   '   ,)
     (          '  |'        ( __= ___..-._ ( (.\\\\
    ('\\      .___ ___.      /'.___=          \\.\\.\\
     \\\\\\-..____________..-'' 


 `}
</pre>

      </div>


      <div className="ascii-art-item" id="ascii-art-46">
<pre>
  {`



                      {}
                     oIIo
                     oIIo
                      ||
                      ||       I.
                      ||       |:
                     _||_      |:
                   .' || '.    |:
                  /   ||   \\   |:
                 |    ::    |  |:
                 )_   ::   _(  |:
                  _)( :: )(_   |:
                 ) ._)::(_. (  |:
                /     II     \\ |:
                |  .-.||     | |:
                 \\(___)(    /  |:
                  '.__\\/__.'   I'

 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-47">
<pre>
  {`

                                 _--._
              ___-----___      ,'  .  '-
          _,-'           '-._   ' ''_   '.
        ,'.    --.     '':::.'.      '  ' )
       /          '.           \\_     )   /
     )' '._ ' ('    '-.    ._ __(__,-'_,-'
     ;m   ,'     -##,  ""    "--_:  ""
    : #   '      m ww =(\\   '    :\\ .
    | '    (_           '       ' |(
    |    .            '           / '
    : '   '-.__    .            ) :
   --'    oO '-'        ::     / ;
  ( ::\\            ,##. '  ' ,' /
   )_-_\\      \\     ''   /,-'  /
       ''._    '   __,--'--'_,'
           '-____     ___,-v     rjm
            '    -----


 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-48">
<pre>
  {`

                  ____________                  
           _.--""'            '""--._           
       _.-'                          '-._       
     .'              ______              '.     
   .'         _.--""'      '""--._         '.   
  .'        .'  ,<    \\_|  -v'    '.        '.  
 .'        /   X_v \\|   \\_,-'  ,    \\        '. 
 |       .' ,-<    /' . ( '  >'\\  ,- '.       | 
 |/|     | V\\_ '--'  ')  \\_.   '\\_|   |     |\\| 
 | |    .'/    ,_;==./   //'=:.   '\\,_'.    | | 
 [ |--===<__,=={_,  ':=="' ,_ '===='/'>===--| ] 
 | |    '.  '--v'\\,  '-,  -' >-.__x--'.'    | | 
  \\|      '"--.__''       --' '__.--"'      |/  
              \\_ '"\\"------"/hjm_/              
                '"--|  --  |--"'                
                    |      |                    
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-49">
<pre>
  {`
             _              _
          _.(_)..__________(_)
       .''.'""""\\             "".
      '-'/__     |_________..--..'
            '.   ||  /    |  /
              )  ;| (    (  (
             /  //   |    |__|___
            /   ||   |__.-'      '.
          .:    |L.-'"             \\
         |                         |
         |            _            ;
         |      _.-'/"_'"         /
         '..__.T    ''           /
               |                /
               |               /
                '.            /
                  )--._      /
                .'     \\    /
               /        ;  /
               |       / .'
                '.__.-' /
                    /   |
                   /   /
                  /   /
                 /  .'
   .__          /  /
       "'-._  _/  /lka
            ./   /-.
             ////   |
                    |
                    |
                
 `}
</pre>

      </div>


      <div className="ascii-art-item" id="ascii-art-50">
<pre>
  {`
 .      .      .      .      .      .      .      .      .      .      .
 .                               .       .       .       .       .       .
    .        .        .        .        .        .        .        .        .
      .         .         .        _......____._        .         .
    .          .          . ..--'"" .           """"""---...          .
                    _...--""        ................       '-.              .
                 .-'        ...:'::::;:::%:.::::::_;;:...     '-.
              .-'       ..::::'''''   _...---'"""":::+;_::.      '.      .
   .        .' .    ..::::'      _.-""               :::)::.       '.
          .      ..;:::'     _.-'         .             f::'::    o  _
         /     .:::%'  .  .-"                        .-.  ::;;:.   /" "x
   .   .'  ""::.::'    .-"     _.--'"""-.           (   )  ::.::  |_.-' |
      .'    ::;:'    .'     .-" .d@@b.   \\    .    . '-'   ::%::   \\_ _/    .
     .'    :,::'    /   . _'    8@@@@8   j      .-'       :::::      " o
     | .  :.%:' .  j     (_)    '@@@P'  .'   .-"         ::.::    .  f
     |    ::::     (        -..____...-'  .-"          .::::'       /
 .   |    ':'::    '.                ..--'        .  .::'::   .    /
     j     ':::::    '-._____...---""             .::%:::'       .'  .
      \\      ::.:%..             .       .    ...:,::::'       .'
  .    \\       ':::':..                ....::::.::::'       .-'          .
        \\    .   '':::%::'::.......:::::%::.::::''       .-'
       . '.        . ''::::::%::::.::;;:::::'''      _.-'          .
   .       '-..     .    .   '''''''''         . _.-'     .          .
          .    ""--...____    .   ______......--' .         .         .
   .        .        .    """"""""     .        .        .        .        .
  .       .       .       .       .       .       .       .       .
      .      .      .      .      .      .      .      .      .      .      .
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-51">
<pre>
  {`

     ^   sin x
     |
    ,|, 1    _....._
     |    ,="       "=.
     |  ,"             ".                           ,"
     |,"        ,        ".,          ,          ,,"
"""".*""""""""""|""""""""""|."""""""""|""""""""".|"""">
  ." |                       ".               ." __    x
,"   |                         "._         _,"   ||
    ,|,                  sm       "-.....-"
     |  -1
     |

 `}
</pre>

      </div>


      <div className="ascii-art-item" id="ascii-art-52">
<pre>
  {`

                                      ,-.. _. ,. ,._
                                  .-'         .     '.
                                 /             .      /_./.
                                '                        '.
                               .                           '
                              '            =\\ : , \\         \\
                             '            '' '   '  =        '
                             |,.        _\\           ',       \\
                             /   \\    ."               ',.    /
                            || ,' '  ,                  ' \\_.'
                            |\\ -. / ,       ''":,      /
                          ,-= .   ,'       '_   ';.    |
                         /  /  -'            "''    ,:,
                      _,/|,'    ,                   '
               ___,--' | |                    (    /
          _,-''        . .      .            , '- _'          .-.
        ,'              \\        .       ','"'';/.          ,'   )
      ,'                 .'       :     /  ';\\\\   '.     ,'    .'
    ,'                   |.\\       ';.'.,. .;.\\\\  ,..:_'_    .
   /  .                    '.       .'';_:;''  '_(        ' '-.
   |   .                     '.'.,-'   ,       (    '" - ._    )
  / .   '                      '.             _,'-._        ' (
 /    .       [lf]             _ |   '      .' '.    ' .  _    )
                              (:)          '      '        '   '


 `}
</pre>

      </div>
      <div className="ascii-art-item" id="ascii-art-53">
<pre>
  {`

                                  ____
                                _(    )_
                               (  _ _   )
                                (_")" __)
                                  \\=_/   
                                   _)\\___
                                  /-----'\\
                                 ((  (    \\       (
                                 |_\\   /\\__\\       )
                                  //)  |   \\\\     (
                               __//(____\\   \\\\     )
                              /_,/ |     \\   \\\\_
                                   |    | )  /-,|=*
                                   |____A_|
                                   | |   |
                                   | |  / 
                                   ( ( <
                                   | \\\\ \\
                                   | | \\ |
                                   |/   \\|__
                                   |\\    \\(
                              gnv__/|    _\\)
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-54">
<pre>
  {`

                   .+'"+
                  ,   b '
                  (      +
                  ' '+,.+ '.
                   '  .  ': .
                    '  .   '.+
                     '  +    ':.
                     ;   '     '.
                ..,,+     '
             .+'          '
           +'             '
          '              '
         +             .'
        .
                   '  '
       '        ,+' .'
      +      .+'   +
     '     .'     +
    +   .+'  _.,+''
   '  ,' .+''    /
   '-'.+'       /
   '-'         |
               |
               b
               |
               |
               |
               |
               |                      
               |                      
             .,|-,..              

 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-55">
<pre>
  {`

          
  -      __
     - -    @%o.            _
  - - _ _  %%'.'&  __     _//
           %b  ~ %'  ""--" ,'
        =#=,-%%%"    _   _-'
   _,    .'         \\ "-"
  (_|"-.' .'\\   '.   \\
     \\__.'   \\        \\        _ _ - -..__
              \\   '.  _\\__--"""           "-,_
  "--.._       \\,--,-" |        --""--.._     "
 ,'"'_(.--""   /  /   |   __             ""::--""
(  (      )   (   (   \\     ""- .  __..--""  .-'
 \\   \\ ( .. )  \\   \\   /\\________         \\,'  ."
 - ( _ )  __,,--\\   \\_/|/ __  __ ""-,     ;  ,'
- -.    ,'_ _ _  \\_/ (_/ /_/ / _ .-':    ,' ,'
; ' ' ,'         (_/    /   |__/ _,'  ,'
PGMG '"""""----____________..--"" _  _ _ __



 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-56">
<pre>
  {`

    ,o888b,'?88888          Matthew  Porteous        88888P',d888o,
  ,8888 888   ?888         matthewporteous.com       888P   888 8888,
  8888888P'    888                                   888    '?8888888
  888P'        888               Peace!              888        '?888
  '88   O     d888    (Through superior firepower)   888b     O   88'
    '?._  _.o88888                                   88888o._  _.P'


 `}
</pre>

      </div>
{/* 
      <div className="ascii-art-item" id="ascii-art-57">
<pre>
  {`

<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:
 `}
</pre>

      </div>
      <div className="ascii-art-item" id="ascii-art-58">
<pre>
  {`

<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-59">
<pre>
  {`

<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-60">
<pre>
  {`

<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:><:>:<:>:<:>:<:>:<:>:<:>:<:>:<:>:<:
 `}
</pre>

      </div>

      <div className="ascii-art-item" id="ascii-art-61">
<pre>
  {`
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%*,,.:---88#%%%%%%%%%%%%%%%%%%##888*#%#88**#%@%%%=8#8#####88888888888888888+-+8#####888##8++++***++*+=#%#,:
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%-,,.---:8##%*+=+8#%%%%%%%#%#888***++++****##%%%%8===+***+*****8888888*=+**=::+###88####8**+===*======#%%,:
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%,,,.----8#8#*++++++*######88+=-----=+*8#%%%%%%%%+=*==,==*=-**++++*****--=+-::-+8*8*88###8*+*==*+====+8%%+:
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%,,,.----*8*8+=++=+8+88888###888888888######%%%%%=+-=*===--:=++********::-=:::,:-+*88#####888==*+++*+=8%%%,
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,,,.---+***8*8##888*8*8888888888888888##%%%%%%%%%*=++==-::-==++****+++:::::::::--*88#######888+*8*8*=*%%%,
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%#,,,.:,:+***8****88888****8888888888888*+88%%%%%%%*=+=---:::===+++==+++-::,:,,:::-=+8######8*88**#***++#%%*
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%8,,,.,,:+++++-==+***88**8*888888#888888###%###%###*==--:::::-=======+==-:,,,,,::::--*88########8**+*++=#%%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%+,,.,,,,==-:::-=+**88******88888888**88#####%#%####---:,:::::-===--====-:,,,,,::::--=8###8###8#888**+++#%%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%-,,.,,,,:--:::---+***8*******88888+++*8############---:,,,::::-==-----=-:,,,,,:::::==##8##8##88#8888*+*8%%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,,,.,,,,,,,,,:--=++**********88888*+*8###8888*8888#*:::,,,:::::------=-=-:,,,,,:::-=*8#8#####888#8888*+*%%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,,,.,,,,,,,:,:--====+*********8888**888###8#8*8*+=8+::,,,:-::::::-::---=::,,,,,::--+*888#8#8#####8##88**%%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,,,.,,,,,,,,,::--====+***************888##88+**++-=+::,,,:::::::=-------=:,,,,,---=+*88888888########88+#%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%##,,..,,,,:,,,,::::-----=++==+=+*8*****888**++=---=--+-,,,,::::::-------===:,,,,,--=+**8888888#########88*#%%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%##,,..,,,,,,,,:::-:-:----====+==*+=:-*+++===-=------:--,:,,:::---------====-,,,,,:--=+*#8888*88888#####88*##%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#=,,..,,,.,,,,:::::::---::--==-==-:::=-:--::-=:::::::::,::::::-----=====++=:,,,,::--=++*******+*+####888*+##%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#:,..,,,,,,,.,:::::,:::::::---:::-:::::::-:-:,::::::::::::::::-----=====+++::,,,:::====**++++**8#88##88*++8#%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,,..,..,,,:,,:,::,,,:,,,,::::,::,:::::::::,:,,,,,,,,:::,:::----=====+++++*-,:,,,,::-==-=+=++++8+++88***+++##
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,...,...,,-:,:::,,,,,,,,,,:::,::::,,,,,,,,,::::-,:,,::-::::---===++++++***+::,,,,::----:---=-=-===+*++*+==#%
@@@@@@@@@@@@@@@@@@@@@@@@@@@@##....,...,,-,,,::,,,,,,,,,:::,,:-:.....:...,,,.,:-::,:::,::--===+++++++*****::,,,,::--------------=++++++++8%
@@@@@@@@@@@@@@@@@@@@@@@@@@@%##......,,,,-,,,,,,,,,,,,,,:::,,:....,..,.,.,...,,,.,,,,,,::-==+++++++*****88:,,::::::::===--==----==+++++++8#
@@@@@@@@@@@@@@@@@@@@@@@@@@@%#8......,,,,-:,,,,,,,,,,,,,,,:,,....,,,,.,:--=*#8:,,,,,-.,,,:*=+++++*****8888-::::::-:::----==----===+++*++**8
@@@@@@@@@@@@@@@@@@@@@@@@@@@%#=....,,,..,:,,:,,,,,,,,,,,:,,,.......,,==::###-##:,-,::=.=-==-=++******+++=-,................,,,,::::------==
@@@@@@@@@@@@@@@@@@@@@@@@@@@%#,...,....:,,,.,,,,,,,,,,,,,:,....,.:,.,,+**-8##*+,:,:::--.,.......................,,,,,,,,,,,,,::::::-----===
@@@@@@@@@@@@@@@@@@@@@@@@@@@%#..,.....*8#,................,..,,,.::,,=+***=###+,-:,,,:,.=...................,,,,,,,,,,,,,:::::---===++++***
@@@@@@@@@@@@@@@@@@@@@@@@@@@##***+=...=8##....................,....,=**8*-*#8#8,,-:,,,:,,.....,,:---------------=====+++**88###%%%@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@%#**+=**,..888#,,,.,,,,,,,,,,,,.,....,:,,.,,:-*##*-,,,,.,,,,,.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@%##+***8888*8##%%%%%@@@@@@@@@@@.......=====:-=.,=*=+**#%88=,.-@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%@@@@@@**8##@@@@@@@@@@@@@@@@.,....-+=:,.::-+%#+-:-8%%+.=.,:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@++=======+*#@@@@@@@888#%@@@@@@@@@@@@@@@@@......+8***+=+-*##%####%%+.,.::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@===--====-=---------+8#######%%@@@@@@@@@@@@@......+**+====+8###8##%%#=.,.::8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@+=-------------------+888888###%%%@@@%@@@@@@@@......=****===:=*+#88#%%%:....:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%##8888*8
@@@@@@@@@@=------------::::::::+**888888###%%%%@@@:::::--8.....-++++===-=+###88#%%,....8@@@@@@@@@@@@@@@@@@@@@@@@@#88***+*+=+++**+**8=++***
@@@@@@@@@#--------------::::::*888888*8888#%@%##%@::,,,,,......:=++::--=888#8==#%#....,@@@@@@@@@@@@@@@@@@@@@%=-=+*-::-===,=8=======++-===+
@@@@@@@@@----:-::--::::::::::888888888**88##%%%@@%,,,,,.,......,:-====--*8###8*#8*....@@@@@@@@@@@@@@@@@%=---===+*+**:-,.-+*8-----=====-===
@@@@@@@@+-::::--:::::::::::*888**8**88*88#%%%%#%%%=,............:---=====*##%##88:=,:=:-====+++++==:-=-:,,:---=++=++=:,:=*8,::::----------
@@@@@@%%--:::::::::::::::-888888888888888#%@%%@@##,.............::--====+8#####8#,.,,=:-,=+--==+=,.,=-:,,,:--==+===-:,=+*-.,,,:::::::-----
%%%%%%%+--::::::::::::::8**888********++**#%%%%%@*,.............=--:---==*88####%.,,.--,-=.:--==,.,-=:,,,,:-=====---==++*.....,:::::::::--
%%%%%%#--:::::::::::::+**********888888888#%%8#%%,............=:=+=:::::-=+**8%%%@.=,=-,=.,:--=:,,-=-,,,,:-----::--==+***,...,,,,,:::::::-
######8::::::::::,,::*****+****+****888888#%%%@@:,...........#*.=+===-:::-+#%#%%=@@-:--:..,,--:-,---,.,,,,::::::---=++***......,,,::::::::
######-:::,,,,,,,,,:*++*+*******++****++++**#%%%,........,.###%.-=+++++*###%%##=8@%8:-==...:,::,:--:..,,,,,::::::--=+++**+......,,,,::::::
####8-:::,,,,,,,,,-+++++**8888*++***888*88+#,,,..==-==-#@+%%%%@*:=+8888###%%#8=8@@:%-,::8=:--*8**+:..,,,,,:::::::-=======+=-....,,,,,:::::
###8:::,,,,,,,,,,+++++++*88***+=======-,,,,..,:-++=---..@@@@%@+%-88##%%##8##*=+@@-@@%*,+:-:-+*8*+*=-=,,,,,,,,::--====*++++++........,,,,,,
888+::,,,,,,,,,,*+++++++*8#88#8*+-,,,,:++=--::++=-+*=+,:.+%%--+--=##%%###88+=++%@-@@@%8.,::-+**++=++-:--,,,,:-==---==++**+*++......,,,,,,,
888:,,,,,,,,,,,++++=+++*8######=,,,.,:-+*+=-++-:++-=+==::,::......,####8*+=::=**8:---:::,.,-,,:+**+=+*=,8,,:-=-::--=+++++++++:....,,,,,,,,
88::,,,,,,,,,,++++++++**8####%:,...=-::==+++=:++-=+=+---::=-:,,,,:..,*+==,.......,=----:::,,,-,,:8*8*+=:88*=-:::-==+==++***+++...,...,,,,,
8*::,,,,,,,,-++++++++**88###%=..-===-:--:=+=-+-:+-+=---::++=--:::-:,,++=+:,,--:,::==-+*-=#**8,::.:88**:-8888::--=====+=++*++++.......,,,,,
8:,,,,,,,,,=*+++++****88##%%*.,-+=---,==::+=+,-=+=----::+++==--::-:,=+++==,:+=,::::+8:-##++:-:,:,.+88+:888*88:-----======++*++:......,,,,,
+:,,,,,,,,**+++++****8###%%%-,::-=---,==:,:=,-%+---#=::++++===--:-+-===++-:==::--:::+:88--@+--:::,-**,+88****8::-=-=---=+++=++=.......,,,,
:,,,,,,,:*+++++*****8###%%%:-+=,,,-:,,==:,:-:-@@%#--::++++=====-:-+-+=+=+-:,:--==---:=#-@@8@=%=:,,:+:=@@@%%@@@#--:,:-=++==+++++:.......,,,
:,,,,,,+++++++****88###%%%,#%#--+:,:,,+-:,=,-:-:,--:-=+++====+=--=+-==+==,,---======---#=*%=@++,,:,:=*%@#%@#+%%=:-=======++=++=::........,
,,,,,,*++++++****88###%%%@@+@@@#:=---.=,-,=,,,.::::-===++====+=--===+==::=----=========-+@@*++*-:,,=+*8%8+8==#@@-------==+++==--=........,
,,,,:++++++*****888#%%%%##8@@*@@@--==-,:,:,,,.,,::---==++====+=--=+=+=,-============+++====++=:,,,:=+**%8%*+@@%@@:---=====+=-====:....,...
,,,==++++++****88###%%%#%%%%@@*@@@==++:=.:.,..,::------=++=========:,==============++++++=-+=-+,,.:=+***%#88%%@@@8--=========-===-:....,..
,,+++++++++****88##%%%%#%%%%%#@*@@@:===-,,,..,,::------=========-,:=--#*:===========+++++**=-*=-..:++++-=8%@@@@#%8+---==========-=-,...,..
.=++++++++***888##%%%%8#%%%%%@%@+@@@:==-.,..,:::-------=======::-=-@.#:%,%:===========+++++*+-+:..-++=-::=++***88*8----=======:..,::....,,
===+++++++***88###%%%#####%%%%%@@*@@8:--..,,,:::::::::----=-:,-====:@,@-#:============++++==+*--.,==-::-=+++%@@@@@@8--==--:::-::,-==,....,
=++=+=+++***888##%%%%%%###%%%%%%@%@@@,,,..,...,,,,,,,::::-::::8=::,#.#.*,*+:,,,,,,,,:==++++*+=+-.,-::-=+@@@@@@@@@@@@--:,---:,,,:-======:..
=+==+++++**88###%%%%%%%##%%%%%%%8@=%8,,...,,,,,,:::::::,,:::::##888:----====@@@@%---:,,:==:=+*+-.,,:*#%@@@@@@#88#####--:,,.,:::--=-======.
====++++**888##%%%%%@%%%%#%%%%%##%=*=.....,,,,::::::----+*:--=@*@+=@-==*@@*=#-%@@+++++++++=:-+-:-,=+*8#%8=*@@@@@%#8-=@:::,,,,,,:::---=====
====++++**88###%%%%%%%%%%%%%%#8*++-,....,,,:::::::::::::,,%@@@#--@@@@@@@-@@@@+@@@%@8@+8*++**+**+-,,=-:=#%%%%%%%%%%%%*,,....,,::::--::,.,--
====+++***88####%%#%%%%%%%##88**-:......,,,,,,,,,,,,::,,,::@=@-----=-@%@====@=+++@#8%@@@++++****+-.-+*++*8##%%%%%%%%+::-:,,:::::---:----=-
====++++**88####%##%%%%%%##88*+,........,,,,,::::::::::,::-----===============+=+++++++++++****++=..:==+*88##%%%%%%%%-::::,,,:::::-------=



 `}
</pre>

      </div> */}

      

      <DateAsciiArt />

    
      
    </div>

    {/* Music Visualizer */}
    <div
      style={{
        position: 'absolute', 
        bottom: '6000px',
        padding: 0,
        left: '250px',
        width: '1000px',
        height: '100px', 
        backgroundColor: '#000',
        zIndex: 10000, 
        opacity: 1,
      }}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src={RedMusic}></audio>
      {/* Visualizer Component */}
      <MusicVisualizer audioElement={audioRef.current} playlist={playlist}/>
    </div>

  </div>

  
)}



      </main>
    </div>
  );
}

export default App;
