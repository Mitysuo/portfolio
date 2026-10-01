import { useState } from "react";
import { portfolio } from "../data/portfolio";
import { journey } from "../data/journey";

function JourneyWindow({ onClose }: { onClose: () => void }) {
  const [activeChapter, setActiveChapter] = useState(3);
  const chapter = journey.chapters[activeChapter];

  return (
    <div
      className="journey-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="journey-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-title"
      >
        <header className="journey-header">
          <div>
            <p className="eyebrow">PLAYER PROFILE // STORY LOG</p>
            <h2 id="journey-title">Minha jornada</h2>
            <p className="journey-intro">
              Quatro fases, muitas versões de mim. Selecione um capítulo para
              explorar.
            </p>
          </div>
          <button
            className="journey-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar jornada"
          >
            ×
          </button>
        </header>

        <div className="journey-layout">
          <nav className="journey-chapters" aria-label="Fases da vida">
            <span className="journey-section-label">LINHA DO TEMPO</span>
            <div
              className="journey-chapter-list"
              role="tablist"
              aria-orientation="vertical"
            >
              {journey.chapters.map((item, index) => (
                <button
                  key={item.id}
                  id={`chapter-tab-${item.id}`}
                  type="button"
                  role="tab"
                  tabIndex={activeChapter === index ? 0 : -1}
                  aria-selected={activeChapter === index}
                  aria-controls="chapter-panel"
                  className={activeChapter === index ? "active" : ""}
                  onClick={() => setActiveChapter(index)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
                      return;
                    event.preventDefault();
                    const nextIndex =
                      (index +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        journey.chapters.length) %
                      journey.chapters.length;
                    setActiveChapter(nextIndex);
                    document
                      .getElementById(
                        `chapter-tab-${journey.chapters[nextIndex].id}`,
                      )
                      ?.focus();
                  }}
                >
                  <span className="journey-chapter-number">{item.number}</span>
                  <span className="journey-chapter-copy">
                    <strong>{item.title}</strong>
                    <small>{item.period}</small>
                  </span>
                  <span className="journey-chapter-marker" aria-hidden="true">
                    {item.symbol}
                  </span>
                </button>
              ))}
            </div>
            <div className="journey-personal-data">
              <span className="journey-section-label">DADOS DO PERSONAGEM</span>
              <dl>
                <div>
                  <dt>Origem</dt>
                  <dd>Não informado</dd>
                </div>
                <div>
                  <dt>Altura</dt>
                  <dd>Não informado</dd>
                </div>
                <div>
                  <dt>Peso</dt>
                  <dd>Não informado</dd>
                </div>
                <div>
                  <dt>Classe atual</dt>
                  <dd>AI Engineer</dd>
                </div>
              </dl>
            </div>
          </nav>

          <section
            className="journey-chapter-panel"
            id="chapter-panel"
            role="tabpanel"
            aria-labelledby={`chapter-tab-${chapter.id}`}
            key={chapter.id}
          >
            <div
              className={`journey-portrait journey-portrait-${chapter.id}`}
              aria-label={`Representação abstrata da fase ${chapter.title}`}
              role="img"
            >
              <div className="journey-orbit journey-orbit-one" />
              <div className="journey-orbit journey-orbit-two" />
              <div className="journey-avatar">
                <span>{chapter.symbol}</span>
              </div>
              <span className="journey-portrait-caption">
                {chapter.period} // {chapter.number}
              </span>
            </div>

            <div className="journey-story">
              <span className="journey-section-label">
                CAPÍTULO {chapter.number} / 04
              </span>
              <h3>{chapter.heading}</h3>
              <p>{chapter.text}</p>
              <div className="journey-traits" aria-label="Temas do capítulo">
                {chapter.traits.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </div>
              <div className="journey-current-profile">
                <span>HOBBIES</span>
                <strong>
                  {portfolio.firstName} {portfolio.lastName}
                </strong>
                <small>{journey.hobby}</small>
              </div>
            </div>
          </section>
        </div>

        <footer className="journey-footer">
          <span>← → ESCOLHER CAPÍTULO</span>
          <span>JORNADA EM ANDAMENTO</span>
        </footer>
      </section>
    </div>
  );
}

export default JourneyWindow;
