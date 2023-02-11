import './About.css';
import './Home.css';
import './Project.css';
import './Footer.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import travel from './Assets/travel.png';
import chat from './Assets/chat.png';
import chanel from './Assets/chanel.png';
import bundle from './Assets/bundle.png';
import transcribe from './Assets/transcribe.png';
import cash from './Assets/cash.png';
import useWindowDimensions from './Components/Hook/useWindowDimensions';

function App(props) {
  const { width } = useWindowDimensions();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const goToTOP = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
    text: {
      height: 100,
      width: 100,
      x: mousePosition.x - 50,
      y: mousePosition.y - 50,
    },
  };
  const [show, setShow] = useState({
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
  });

  const textEnter = () => setCursorVariant('text');
  const textLeave = () => setCursorVariant('default');

  return (
    <div className="App">
      {/* HEADER */}
      <div className="header">
        <div className="header-row-top">
          <motion.div
            className="header-row-component1"
            transition={{ duration: 0.6, delay: 0.7 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: '25px' }}
          >
            Arjun Sethi™️
          </motion.div>
          <motion.div
            className="header-row-component2"
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
            transition={{ duration: 0.6, delay: 0.6 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: '25px' }}
          >
            WEB /SOFTWARE DEVELOPER
            <br />
            PORTFOLIO /2021—2022
          </motion.div>
          <motion.div
            className="header-row-component2"
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
            transition={{ duration: 0.6, delay: 0.5 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: '25px' }}
          >
            AVAILABLE FOR FREELANCE
            <br />
            PROJECTS IN SEPTEMBER 2022
          </motion.div>
          <div
            style={{ minWidth: '60px' }}
            className="button rollover"
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
          >
            <a
              href="mailto:arjunsethi33@gmail.com"
              style={{ minWidth: '60px' }}
              className="roll-text"
            >
              lET'S TALK
            </a>
            <a
              href="mailto:arjunsethi33@gmail.com"
              style={{ minWidth: '60px' }}
              className="roll-text"
            >
              lET'S TALK
            </a>
          </div>
        </div>
        <div className="titleupblock" />
        <div className="titleContainer">
          <div className="titlePosition">
            <motion.div
              className="TitleText"
              transition={{ duration: 0.6 }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: '25px' }}
            >
              Hi, Im Arjun
              <br />
              Independant Creative
              <br /> Frontend &
              <br /> Software Developer based
              <br /> in New Delhi - India
            </motion.div>
            <div className="Button">
              <div
                style={{ minWidth: '135px' }}
                className="button rollover"
                onMouseEnter={textEnter}
                onMouseLeave={textLeave}
              >
                <a
                  href="#about"
                  style={{ minWidth: '135px' }}
                  className="roll-text"
                >
                  SCROLL TO DISCOVER
                </a>
                <a
                  href="#about"
                  style={{ minWidth: '135px' }}
                  className="roll-text"
                >
                  SCROLL TO DISCOVER
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="header-row-bottom">
          <div className="header-row-component1 footerComp1">
            <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <a href="https://twitter.com/fishMeisterFTW">TWITTER</a>
            </div>
            <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <a href="https://www.linkedin.com/in/arjun-sethi-a75a48118">
                LINKEDIN
              </a>
            </div>
            <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <a href="https://github.com/fishmeister09">GITHUB</a>
            </div>
          </div>
          <div className="header-row-component2 footerComp2">
            N 20.5937° E 78.9629°
          </div>

          <div className="header-row-component2 footerComp2">© 2022</div>
        </div>
      </div>
      {/* ABOUT */}{' '}
      <div id="about" className="about-container">
        <div className="about">
          <motion.div className="header" {...props}>
            ABOUT
          </motion.div>
          <div className="top-container">
            <motion.div className="about-text" {...props}>
              I am passionate about everything that has to do with Digital
              Design and Art Direction. I enjoy working with agencies and
              enthusiastic people who want to solve problems through beautiful
              design and experiences.
            </motion.div>
            <div className="about-profile-pic"></div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="bottom-sub-container">
            <div className="hr" />
            <motion.div className="info" {...props}>
              <div className="Title">Mobile and Web Design</div>
              <p>
                I always strive to create memorable experiences that are
                aesthetically appealing, functional and distinctive. Whether
                it's inspiring marketing websites, convincing e-commerce sites
                or apps that are truly beneficial to users.
              </p>
            </motion.div>
            <div className="hr" />
            <motion.div className="info" {...props}>
              <div className="Title">My Tools</div>
              <p>
                JavaScript, HTML5, CSS, Tailwind, C++, Python, Pygame, React.js,
                React Native, Babel, NPM, Node.js/Express, MongoDB, Firebase,
                Postman, Git/Github
              </p>
            </motion.div>

            <div></div>
            <div className="Button1">
              <div
                style={{ minWidth: '130px' }}
                className="button rollover"
                onMouseEnter={textEnter}
                onMouseLeave={textLeave}
              >
                <a
                  href="#project"
                  style={{ minWidth: '130px' }}
                  className="roll-text"
                >
                  EXPLORE MY WORK
                </a>
                <a
                  href="#project"
                  style={{ minWidth: '130px' }}
                  className="roll-text"
                >
                  EXPLORE MY WORK
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PROJECT */}
      <div id="project" className="Project">
        <div className="heading">Playground and experiments</div>
        <div className="sub-heading">
          I love playing with new layouts and typographies. Explore my concepts
          and experiments for more work
        </div>
        <div className="project-section">
          <div className="hr" />
          <motion.img
            className="imaged"
            src={bundle}
            alt="bundle"
            animate={
              show.show1
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />
          <motion.a
            href="https://github.com/fishmeister09/Bundle"
            onHoverStart={() => setShow({ ...show, show1: true })}
            onHoverEnd={() => setShow({ ...show, show1: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            BUNDLE
          </motion.a>
          <div className="hr" />
          <motion.img
            className="imaged"
            src={cash}
            alt="helo"
            animate={
              show.show2
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />
          <motion.a
            href="https://github.com/fishmeister09/cashiflux"
            onHoverStart={() => setShow({ ...show, show2: true })}
            onHoverEnd={() => setShow({ ...show, show2: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            CASHIFLUX
          </motion.a>
          <div className="hr" />
          <motion.img
            className="imaged"
            src={travel}
            alt="travel"
            animate={
              show.show3
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />
          <motion.a
            href="https://github.com/fishmeister09/Travel-Homepage"
            onHoverStart={() => setShow({ ...show, show3: true })}
            onHoverEnd={() => setShow({ ...show, show3: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            TRAVEL HOMEPAGE
          </motion.a>
          <div className="hr" />
          <motion.img
            className="imaged"
            src={transcribe}
            alt="transcribe"
            animate={
              show.show4
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />
          <motion.a
            href="https://github.com/fishmeister09/Transcribe"
            onHoverStart={() => setShow({ ...show, show4: true })}
            onHoverEnd={() => setShow({ ...show, show4: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            TRANSCRIBE
          </motion.a>
          <div className="hr" />
          <motion.img
            className="imaged"
            src={chat}
            alt="chat-invader"
            animate={
              show.show6
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />

          <motion.a
            href="https://chat-app-q9tg.vercel.app/"
            onHoverStart={() => setShow({ ...show, show6: true })}
            onHoverEnd={() => setShow({ ...show, show6: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            CHAT-APP
          </motion.a>
          <div className="hr" />
          <motion.img
            className="imaged"
            src={chanel}
            alt="chanel"
            animate={
              show.show5
                ? { opacity: 1, x: '1vw', translateY: '-50%' }
                : { opacity: 0, x: '0px', translateY: '-50%' }
            }
          />
          <motion.a
            href="https://github.com/fishmeister09/Chanel"
            onHoverStart={() => setShow({ ...show, show5: true })}
            onHoverEnd={() => setShow({ ...show, show5: false })}
            className="project-title"
            whileHover={{ paddingRight: '2rem' }}
          >
            CHANEL
          </motion.a>
          <div className="hr" />
        </div>
      </div>
      {/* FOOTER */}
      <div className="footer">
        <div className="footer-container">
          <div className="Button">
            <div
              style={{ minWidth: '135px' }}
              className="button rollover"
              onMouseEnter={textEnter}
              onMouseLeave={textLeave}
            >
              <div style={{ minWidth: '135px' }} className="roll-text">
                HAVE A PROJECT IN MIND?
              </div>
              <div style={{ minWidth: '135px' }} className="roll-text">
                HAVE A PROJECT IN MIND?
              </div>
            </div>
          </div>
          <a
            href="mailto:arjunsethi33@gmail.com"
            className="email"
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
          >
            LET'S TALK
          </a>
        </div>
        <div className="footer-footer">
          <div>
            DEVELOPED BY:
            <br />
            ARJUN SETHI
          </div>
          <button
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
            onClick={() => goToTOP()}
          >
            BACK TO TOP
          </button>
        </div>
      </div>
      {width >= 760 ? (
        <motion.div
          className="cursor"
          variants={variants}
          animate={cursorVariant}
        ></motion.div>
      ) : null}
    </div>
  );
}

export default App;
