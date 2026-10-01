import { useEffect, useState } from "react";
import { portfolio } from "./data/portfolio";
import SpotifyAudio from "./components/SpotifyAudio";
import SkillsWindow from "./components/SkillsWindow";
import JourneyWindow from "./components/JourneyWindow";

type HybridStatus = {
  hp: number;
  mp: number;
  from: string | null;
};

function App() {
  const [activeItem, setActiveItem] = useState(0);
  const [notificationItem, setNotificationItem] = useState<number | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [hybridStatus, setHybridStatus] = useState<HybridStatus>({
    hp: -1,
    mp: -1,
    from: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(
      `${import.meta.env.BASE_URL}data/hybrid-charge.json?v=${Date.now()}`,
      {
        cache: "no-store",
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error("Status data unavailable");
        return response.json() as Promise<HybridStatus>;
      })
      .then((status) => {
        if (isMounted) setHybridStatus(status);
      })
      .catch(() => {
        if (isMounted) {
          setHybridStatus({ hp: -1, mp: -1, from: null });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const menuItems = ["Status", "Inventário", "Habilidades", "Jornada"];

  const menuDescriptions = [
    "Resumo, atributos e métricas do perfil.",
    "Projetos, ferramentas e tecnologias que fazem parte do meu trabalho.",
    "Minhas principais competências e áreas de atuação em IA, e gerais.",
    "Minha trajetória, interesses, objetivos e perfil profissional.",
  ];

  function changeActiveItem(index: number) {
    if (index === activeItem) return;
    setActiveItem(index);
    setNotificationItem(index);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        changeActiveItem((activeItem + 1) % menuItems.length);
      }
      if (event.key === "ArrowUp") {
        changeActiveItem(
          (activeItem - 1 + menuItems.length) % menuItems.length,
        );
      }
      if (event.key === "Enter") {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("button, a, input, textarea, select")
        )
          return;
        if (activeItem === 0) {
          setStatusOpen(true);
          setSkillsOpen(false);
          setNotificationItem(null);
        }
        if (activeItem === 2) {
          setSkillsOpen(true);
          setStatusOpen(false);
          setJourneyOpen(false);
          setNotificationItem(null);
        }
        if (activeItem === 3) {
          setJourneyOpen(true);
          setStatusOpen(false);
          setSkillsOpen(false);
          setNotificationItem(null);
        }
      }
      if (event.key === "Escape") {
        setStatusOpen(false);
        setSkillsOpen(false);
        setJourneyOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem]);

  function selectItem(index: number) {
    changeActiveItem(index);
    setNotificationItem(null);
    if (index === 0) {
      setStatusOpen(true);
      setSkillsOpen(false);
    } else if (index === 2) {
      setStatusOpen(false);
      setSkillsOpen(true);
      setJourneyOpen(false);
    } else if (index === 3) {
      setStatusOpen(false);
      setSkillsOpen(false);
      setJourneyOpen(true);
    } else {
      setStatusOpen(false);
      setSkillsOpen(false);
      setJourneyOpen(false);
    }
  }

  return (
    <main className="game-screen">
      <div className="stars" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header className="top-bar">
        <a className="brand" href="#inicio" aria-label="Ir para o início">
          VF<span>//PORTFOLIO</span>
        </a>

        <div className="status-group">
          <SpotifyAudio />
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
                onMouseEnter={() => changeActiveItem(index)}
                onFocus={() => changeActiveItem(index)}
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
            src="./images/profile.jpeg"
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

      {notificationItem !== null && (
        <div className="notification" role="status">
          <strong>{menuItems[notificationItem]}</strong>
          <span>{menuDescriptions[notificationItem]}</span>
          <button
            type="button"
            onClick={() => setNotificationItem(null)}
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
              <div className="status-level">
                <strong>24</strong>
                <span>LEVEL</span>
              </div>
              <div>
                <span className="status-label">PLAYER</span>
                <strong>
                  {portfolio.firstName} {portfolio.lastName}
                </strong>
              </div>
              <div>
                <span className="status-label">CLASS</span>
                <strong>AI Engineer</strong>
              </div>
            </div>

            <div className="status-vitals">
              {(["HP", "MP"] as const).map((attribute) => {
                const value =
                  hybridStatus[attribute.toLowerCase() as "hp" | "mp"];
                const hasValue = Number.isFinite(value) && value >= 0;
                const percentage = hasValue ? Math.min(value, 100) : 0;

                return (
                  <div className="status-vital" key={attribute}>
                    <div className="status-vital-heading">
                      <span>{attribute}</span>
                      <strong>{hasValue ? `${percentage}/100` : "-1"}</strong>
                    </div>
                    <div
                      className="status-vital-track"
                      role="progressbar"
                      aria-label={attribute}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percentage}
                      aria-valuetext={
                        hasValue ? `${percentage}/100` : "Sem dados: -1"
                      }
                    >
                      <span style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
              <details className="status-info">
                <summary aria-label="Informações sobre HP e MP">i</summary>
                <p>
                  Métricas obtidas por meio do Hybrid Charge do relógio Zepp
                  T-Rex 3, calculadas com base na média dos últimos 10 registros
                  disponíveis. O horário a seguir indica a primeira leitura
                  desse grupo
                  {hybridStatus.from
                    ? `: ${new Date(hybridStatus.from).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}.`
                    : ". Se não houver leituras, os valores aparecem como -1."}
                </p>
              </details>
            </div>

            <div className="status-attributes-heading">
              <span className="status-label">ATRIBUTOS</span>
              <details className="status-info status-attributes-info">
                <summary aria-label="Informações sobre as soft skills">
                  i
                </summary>
                <p>
                  Estes valores são inicialmente autoavaliativos e refletem
                  minha percepção atual sobre cada habilidade.
                </p>
              </details>
            </div>
            <div
              className="status-attributes"
              aria-label="Soft skills do perfil"
            >
              {[
                ["COMUNICAÇÃO", 65],
                ["COLABORAÇÃO", 50],
                ["RESOLUÇÃO DE PROBLEMAS", 80],
                ["ADAPTAÇÃO", 90],
                ["AUTOGESTÃO", 70],
                ["LIDERANÇA", 40],
              ].map(([label, value]) => (
                <div className="status-attribute" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {skillsOpen && <SkillsWindow onClose={() => setSkillsOpen(false)} />}
      {journeyOpen && <JourneyWindow onClose={() => setJourneyOpen(false)} />}
    </main>
  );
}

export default App;
