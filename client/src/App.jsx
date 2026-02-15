import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";

const THEME_KEY = "theme-preference";

const projects = [
  {
    title: "Inventory Check App",
    desc: "Track gear check-in/out with clean history and notes.",
  },
  {
    title: "Event Archiving Workflow",
    desc: "Simple steps to dump audio + footage to NAS, consistently.",
  },
  {
    title: "AV Prep Checklist",
    desc: "Fast pre-show checks that prevent missing recordings.",
  },
];

function TopNav() {
  const navClass = ({ isActive }) => (isActive ? "navLink navLinkActive" : "navLink");

  return (
    <nav className="topNav fade" style={{ "--delay": "100ms" }}>
      <Link className="brand" to="/">
        Chris Mulia
      </Link>
      <div className="navLinks">
        <NavLink className={navClass} to="/work">
          Work
        </NavLink>
        <NavLink className={navClass} to="/about">
          About
        </NavLink>
        <NavLink className={navClass} to="/links">
          Links
        </NavLink>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <section className="splash">
      <div className="splashInner">
        <p className="tag fade" style={{ "--delay": "140ms" }}>
          Portfolio
        </p>
        <h1 className="heroName fade" style={{ "--delay": "200ms" }}>
          Chris Mulia
        </h1>
        <p className="lede fade" style={{ "--delay": "260ms" }}>
          I build clean systems for AV, software, and creative projects.
        </p>
        <div className="ctaRow fade" style={{ "--delay": "320ms" }}>
          <Link className="btn" to="/work">
            View my work
          </Link>
          <Link className="btnGhost" to="/about">
            About
          </Link>
          <Link className="btnGhost" to="/links">
            Links
          </Link>
        </div>
      </div>
    </section>
  );
}

function PageShell({ title, children, showFooter = false }) {
  return (
    <section className="contentPage">
      <TopNav />
      <div className="section fade" style={{ "--delay": "180ms" }}>
        <div className="sectionHead">
          <h2>{title}</h2>
        </div>
        {children}
      </div>
      {showFooter ? (
        <footer className="footer fade" style={{ "--delay": "300ms" }}>
          <span>&copy; 2026 Chris Mulia</span>
        </footer>
      ) : null}
    </section>
  );
}

function AboutPage() {
  return (
    <PageShell title="About" showFooter>
      <div className="about aboutFree fade" style={{ "--delay": "240ms" }}>
        <p>
          Hi! I am Chris, currently based in Sydney, and I primarily work on
          audio-visual systems for events, recording, and streaming, including
          workflow design and operations across tools like Q-SYS and BMD.
          <br />
          <br />I am also interested in blockchain technology, though I am
          still learning. Outside of all these, I make chill instrumentals and
          collab with friends as Final Sushi that you can hear on Spotify.
        </p>
        <div className="skills aboutSkills">
          <span className="skill">Audio-Visual</span>
          <span className="skill">Design</span>
          <span className="skill">Workflow</span>
          <span className="skill">Systems</span>
          <span className="skill">Blockchain</span>
          <span className="skill">Music</span>
        </div>
      </div>
    </PageShell>
  );
}

function WorkPage() {
  return (
    <PageShell title="Selected work">
      <div className="projList">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="proj fade"
            style={{ "--delay": `${230 + index * 60}ms` }}
          >
            <div className="projTitle">{project.title}</div>
            <div className="projDesc">{project.desc}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function LinksPage() {
  return (
    <PageShell title="Links">
      <div className="linksRow fade" style={{ "--delay": "240ms" }}>
        <a className="link" href="#">
          GitHub
        </a>
        <a className="link" href="#">
          LinkedIn
        </a>
        <a className="link" href="#">
          YouTube
        </a>
      </div>
    </PageShell>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [isManualTheme, setIsManualTheme] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = window.localStorage.getItem(THEME_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      setIsManualTheme(true);
    } else {
      setTheme(mediaQuery.matches ? "dark" : "light");
    }

    const handleSystemThemeChange = (event) => {
      if (!isManualTheme) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [isManualTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setIsManualTheme(true);
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return (
    <div className="page">
      <button
        className="themeToggle"
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          >
            <line x1="12" y1="1.8" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22.2" />
            <line x1="1.8" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22.2" y2="12" />
            <line x1="4.8" y1="4.8" x2="7.1" y2="7.1" />
            <line x1="16.9" y1="16.9" x2="19.2" y2="19.2" />
            <line x1="16.9" y1="7.1" x2="19.2" y2="4.8" />
            <line x1="4.8" y1="19.2" x2="7.1" y2="16.9" />
          </g>
        </svg>
      </button>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}
