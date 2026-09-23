import { useEffect, useState } from "react";
import { portfolio } from "./data/portfolio";

function App() {
  const [activeItem, setActiveItem] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [started, setStarted] = useState(false);

  const menuItems = ["Iniciar portfólio", "Projetos", "Habilidades", "Contato"];

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
        setStarted(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuItems.length]);

  function selectItem(index: number) {
    setActiveItem(index);
    setStarted(true);
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

        <div className="visual-panel" aria-label="Núcleo de energia interativo">
          <div className="hud-corner corner-one" />
          <div className="hud-corner corner-two" />
          <div className="orbit orbit-one">
            <span />
          </div>
          <div className="orbit orbit-two">
            <span />
          </div>
          <div className="core">
            <div className="core-inner">VF</div>
          </div>
          <div className="power-label">
            <span>NÚCLEO</span>
            <strong>100%</strong>
          </div>
        </div>
      </section>

      <footer className="footer-bar">
        <span>↑ ↓ NAVEGAR</span>
        <button type="button" onClick={() => setStarted(true)}>
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
    </main>
  );
}

export default App;
