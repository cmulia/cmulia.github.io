import "./App.css";
import { useEffect, useRef, useState } from "react";

const SYDNEY_FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-33.8688&longitude=151.2093&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code&timezone=Australia%2FSydney&forecast_days=1";

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

const weatherCodeMeta = {
  0: { icon: "☀️", label: "Clear" },
  1: { icon: "🌤️", label: "Mostly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Cloudy" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Rime fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌧️", label: "Heavy drizzle" },
  56: { icon: "🌧️", label: "Freezing drizzle" },
  57: { icon: "🌧️", label: "Heavy freezing drizzle" },
  61: { icon: "🌦️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  66: { icon: "🌨️", label: "Freezing rain" },
  67: { icon: "🌨️", label: "Heavy freezing rain" },
  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "❄️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  77: { icon: "🌨️", label: "Snow grains" },
  80: { icon: "🌦️", label: "Rain showers" },
  81: { icon: "🌧️", label: "Heavy showers" },
  82: { icon: "⛈️", label: "Violent showers" },
  85: { icon: "🌨️", label: "Snow showers" },
  86: { icon: "🌨️", label: "Heavy snow showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Storm + hail" },
  99: { icon: "⛈️", label: "Severe storm + hail" },
};

const getWeatherMeta = (code) => {
  if (typeof code !== "number") return { icon: "🌤️", label: "Forecast" };
  return weatherCodeMeta[code] || { icon: "🌤️", label: "Forecast" };
};

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
  const [weatherState, setWeatherState] = useState({
    loading: true,
    error: false,
    current: null,
    today: null,
  });
  const transitionTimer = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        const response = await fetch(SYDNEY_FORECAST_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Weather request failed");
        const data = await response.json();

        const daily = data.daily || {};
        const current = data.current || {};
        const today = {
          code: daily.weather_code?.[0],
          max: daily.temperature_2m_max?.[0],
          min: daily.temperature_2m_min?.[0],
        };

        setWeatherState({
          loading: false,
          error: false,
          current: {
            temp: current.temperature_2m,
            code: current.weather_code,
          },
          today,
        });
      } catch (error) {
        if (error.name === "AbortError") return;
        setWeatherState({
          loading: false,
          error: true,
          current: null,
          today: null,
        });
      }
    };

    fetchWeather();
    return () => controller.abort();
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
          <div className="heroMain">
            <h1 className="heroName">
              {"Chris".split("").map((char, i) => (
                <span key={i} className="heroChar" style={{ "--i": i }}>
                  {char}
                </span>
              ))}
              <br />
              {"Mulia".split("").map((char, i) => (
                <span key={5 + i} className="heroChar" style={{ "--i": 5 + i }}>
                  {char}
                </span>
              ))}
            </h1>
            <p className="lede">
              I build small apps and simple systems that make life easier
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
          </div>

          <div className="heroRail">
            <aside className="weatherCard" aria-label="Sydney weather forecast">
              {weatherState.loading || weatherState.error ? (
                <>
                  <div className="weatherTitle">Sydney Today</div>
                  <div className="weatherNow">--</div>
                  <div className="weatherRange">-- / --</div>
                </>
              ) : (
                <>
                  <div className="weatherTitle">Sydney Today</div>
                  <div className="weatherNowWrap">
                    <span className="weatherNowIcon" aria-hidden="true">
                      {getWeatherMeta(weatherState.current?.code).icon}
                    </span>
                    <span className="weatherNowTemp">
                      {Math.round(weatherState.current?.temp ?? 0)}°
                    </span>
                  </div>
                  <div className="weatherDesc">
                    {getWeatherMeta(weatherState.current?.code).label}
                  </div>
                  <div className="weatherRange">
                    H {Math.round(weatherState.today?.max ?? 0)}° / L{" "}
                    {Math.round(weatherState.today?.min ?? 0)}°
                  </div>
                </>
              )}
            </aside>

            <aside className="spotifyCard" aria-label="Spotify featured song">
              <div className="spotifyTitle">Now Playing</div>
              <div className="spotifyTrack">Holiday</div>
              <div className="spotifyArtist">Final Sushi</div>
              <a
                className="spotifyLink"
                href="https://open.spotify.com/track/78Z0QizUKErGo1D6xFIfw1?si=26b2245d2a364843"
                target="_blank"
                rel="noreferrer"
              >
                Open in Spotify ↗
              </a>
            </aside>
          </div>
        </section>

        <section id="about" className="section">
          <div className="sectionHead">
            <h2>About</h2>
          </div>

          <div className="about">
            <p>
              I primarily work on Audio-Visual that involves operating & designing workflows/systems for events, recording & streaming ie. Q-SYS, BMD, etc. I'm also interested in blockchain tech & crypto itself. When I'm not building, you can find me on Spotify as Final Sushi, making chill instrumentals primarily and collaborate with friends.

            </p>

            <div className="skills">
              <span className="skill">Audio-Visual</span>
              <span className="skill">Design</span>
              <span className="skill">Workflow</span>
              <span className="skill">Systems</span>
              <span className="skill">Blockchain</span>
              <span className="skill">Music</span>
            </div>
          </div>
        </section>

        <section id="work" className="section">
          <div className="sectionHead">
            <h2>Selected work</h2>
          </div>

          <div className="projList">
            {projects.map((p) => (
              <Project key={p.title} title={p.title} desc={p.desc} />
            ))}
          </div>
        </section>

        <section id="links" className="section">
          <div className="sectionHead">
            <h2>Links</h2>
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
