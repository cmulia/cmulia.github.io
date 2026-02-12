import "./App.css";
import { useEffect, useRef, useState } from "react";

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

function Project({ title, desc }) {
  return (
    <div className="proj">
      <div className="projTitle">{title}</div>
      <div className="projDesc">{desc}</div>
    </div>
  );
}

export default function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    };
  }, []);

  const jumpWithTransition = (event, targetId) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);

    setIsTransitioning(true);
    scrollTimer.current = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    transitionTimer.current = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  return (
    <div className="page">
      <main className={`wrap${isTransitioning ? " wrapTransition" : ""}`}>
        <section className="hero">
          <h1>Live production & recording meets vibe-coding</h1>
          <p className="lede">
            I&apos;m Chris Mulia, an AV Technician, Videographer, and Builder. I
            build small apps and simple systems that make event ops calmer,
            faster, and more reliable. Jump to
            <span className="ledeLinks">
              <a href="#work">Work</a>
              <span>•</span>
              <a href="#about">About</a>
              <span>•</span>
              <a href="#links">Links</a>
            </span>
            .
          </p>

          <div className="ctaRow">
            <a
              className="btn"
              href="#work"
              onClick={(event) => jumpWithTransition(event, "work")}
            >
              View work
            </a>
            <a
              className="btnGhost"
              href="#links"
              onClick={(event) => jumpWithTransition(event, "links")}
            >
              My links
            </a>
          </div>

          <div className="divider" />
        </section>

        <section id="work" className="section">
          <div className="sectionHead">
            <h2>Selected work</h2>
            <p>Only a few projects. The ones that matter.</p>
          </div>

          <div className="projList">
            {projects.map((p) => (
              <Project key={p.title} title={p.title} desc={p.desc} />
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <div className="sectionHead">
            <h2>About</h2>
          </div>

          <div className="about">
            <p>
              Based in Sydney. I work across events, recording, and streaming. I
              care about clear handovers, consistent archiving, and building
              tools that reduce mistakes.
            </p>

            <div className="skills">
              <span className="skill">Recording</span>
              <span className="skill">Streaming</span>
              <span className="skill">Workflow</span>
              <span className="skill">React</span>
              <span className="skill">AV Systems</span>
            </div>
          </div>
        </section>

        <section id="links" className="section">
          <div className="sectionHead">
            <h2>Links</h2>
            <p>Drop your real URLs in the code.</p>
          </div>

          <div className="linksRow">
            <a className="link" href="#">
              GitHub ↗
            </a>
            <a className="link" href="#">
              LinkedIn ↗
            </a>
            <a className="link" href="#">
              YouTube ↗
            </a>
          </div>
        </section>

        <footer className="footer">
          <span>© {new Date().getFullYear()} Chris Mulia</span>
          <span className="muted">Built with Node.js & React</span>
        </footer>
      </main>
    </div>
  );
}
