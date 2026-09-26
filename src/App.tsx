import { useEffect, useState } from "react";
import { portfolio } from "./data/portfolio";

function App() {
  const [activeItem, setActiveItem] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const menuItems = ["Status", "Inventário", "Habilidades", "Comunicação"];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setActiveItem((current) => (current + 1) % menuItems.length);
      }
      if (event.key === "ArrowUp") {
        setActiveItem(
          (current) => (current - 1 + menuItems.length) % menuItems.length,
        );
      }
      if (event.key === "Enter") {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("button, a, input, textarea, select")
        ) return;
        if (activeItem === 0) setStatusOpen(true);
        else setStarted(true);
      }
      if (event.key === "Escape") setStatusOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuItems.length, activeItem]);

  function selectItem(index: number) {
    setActiveItem(index);
    if (index === 0) {
      setStatusOpen(true);
      setStarted(false);
    } else {
      setStarted(true);
      setStatusOpen(false);
    }
  }

  return (
    <main className="game-screen">
      <div className="stars" aria-hidden="true" />
      <div className="grid" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header className="top-bar">
        <a className="brand" href="#inicio" aria-label="Ir para o início">
          VF<span>//PORTFOLIO</span>
        </a>

        <div className="status-group">
          <button
            className="audio-button"
            type="button"
            onClick={() => setAudioEnabled((value) => !value)}
          >
            Áudio: {audioEnabled ? "ON" : "OFF"}
          </button>
          <span className="status">
            <i /> STATUS: ONLINE
          </span>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="intro-panel">
          <p className="eyebrow">PLAYER 01 // AI Enginner</p>
          <h1>
            {portfolio.firstName}
            <span>{portfolio.lastName}</span>
          </h1>
          <p className="summary">{portfolio.summary}</p>

          <nav className="game-menu" aria-label="Menu principal">
            {menuItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={activeItem === index ? "active" : ""}
                onMouseEnter={() => setActiveItem(index)}
                onFocus={() => setActiveItem(index)}
                onClick={() => selectItem(index)}
              >
                <span className="selector">▶</span>
                {item}
              </button>
            ))}
          </nav>

          <div className="social-links">
            <a href={portfolio.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="visual-panel" aria-label="Perfil do jogador">
          <div className="player-aura" aria-hidden="true" />
          <img
            className="player-image"
            src="public/images/profile.jpeg"
            alt="Foto de perfil"
            aria-hidden="true"
          ></img>
        </div>
      </section>

      <footer className="footer-bar">
        <span>↑ ↓ NAVEGAR</span>
        <button type="button" onClick={() => selectItem(activeItem)}>
          ENTER SELECIONAR
        </button>
        <span>BUILD 01.00</span>
      </footer>

      {started && (
        <div className="notification" role="status">
          <strong>{menuItems[activeItem]}</strong>
          <span>Base pronta. Esta ação poderá abrir a próxima seção.</span>
          <button
            type="button"
            onClick={() => setStarted(false)}
            aria-label="Fechar aviso"
          >
            ×
          </button>
        </div>
      )}

      {statusOpen && (
        <div
          className="status-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setStatusOpen(false);
          }}
        >
          <section
            className="status-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-title"
          >
            <button
              className="status-close"
              type="button"
              onClick={() => setStatusOpen(false)}
              aria-label="Fechar status"
            >
              ×
            </button>
            <p className="eyebrow">PLAYER PROFILE // 01</p>
            <h2 id="status-title">Status</h2>

            <div className="status-profile">
              <div className="status-level"><strong>24</strong><span>LEVEL</span></div>
              <div><span className="status-label">PLAYER</span><strong>{portfolio.firstName} {portfolio.lastName}</strong></div>
              <div><span className="status-label">CLASS</span><strong>AI Engineer</strong></div>
            </div>

            <div className="status-progress">
              <div><span>EXPERIENCE</span><strong>72%</strong></div>
              <div className="status-track"><span /></div>
            </div>

            <div className="status-attributes" aria-label="Atributos do perfil">
              {[["STR", 239], ["VIT", 211], ["AGI", 235], ["INT", 240], ["PER", 207], ["POINTS", 3]].map(([label, value]) => (
                <div className="status-attribute" key={label}>
                  <span>{label}</span><strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
