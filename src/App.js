
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

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'; // Default to dark mode
  });
  const [musicPlaying, setMusicPlaying] = useState(false);

  const playlist = [RedMusic, DreamDeath, OutCasts]; // Your playlist

  const [easterEggActive, setEasterEggActive] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(1); // Controls the fade effect
  const audioRef = useRef(new Audio(RedMusic)); // Initialize the first song in the playlist

  // Handle Easter egg activation from AsciiCactus
  const handleEasterEggActivation = () => {
    setEasterEggActive(true);
  };



  const playMusic = () => {
    if (!musicPlaying && audioRef.current) {
      audioRef.current.play();
      setMusicPlaying(true);
    }
  };

  
  
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const maxScroll = e.target.scrollHeight - e.target.clientHeight;
  
    // Calculate opacity based on scroll position, reaching 0 at 50% scroll
    const halfwayPoint = maxScroll * 0.5; // 50% of the scroll
    const opacity = scrollTop <= halfwayPoint
      ? 1 - scrollTop / halfwayPoint // Fade out
      : 0; // Fully white after halfway point
    setFadeOpacity(opacity);
  
    // Play music when halfway point is reached
    if (scrollTop >= halfwayPoint && !musicPlaying) {
      playMusic();
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
      fetchCounter(); // Fetch the initial counter value
    }, []);

    useEffect(() => {
      // Reset fade and music state when Easter egg is deactivated
      if (!easterEggActive) {
        setFadeOpacity(1);
        setMusicPlaying(false);
        document.body.style.backgroundColor = ''; // Reset background
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
<div
  className="app-container"
  style={{
    backgroundColor: `rgba(255, 255, 255, ${1 - fadeOpacity})`, // Transition to white dynamically
    transition: 'background-color 0.3s ease', // Smooth background color transition
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
    backgroundColor: `rgba(255, 255, 255, ${1 - fadeOpacity})`, // Fade background dynamically
    transition: 'background-color 0.3s ease',
    borderWidth: `${fadeOpacity * 1}px`, // Dynamically adjust border width

  }}
>
  <div
    style={{
      opacity: fadeOpacity, // Fade contents dynamically
      transition: 'opacity 0.3s ease',
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
{/* Main Easter Egg Section */}
{easterEggActive && (
  <div
    className="easter-egg-section"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '30000px', // Extend to create scrollable content
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


    </div>

    {/* Music Visualizer */}
    <div
      style={{
        position: 'absolute', // Positioned at the bottom of the scrollable content
        bottom: '-100px',
        left: '0px',
        width: '1000px',
        height: '150px', // Adjust height as needed
        backgroundColor: '#000',
        zIndex: 10000, // High z-index for visibility
        opacity: 1, // Fully visible
      }}
    >
      {/* Audio Element */}
      <audio ref={audioRef} src={RedMusic} loop></audio>
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
