import { useState } from "react";
import {
  flattenSkills,
  skillCategories,
  skillLevels,
  type Skill,
} from "../data/skills";

type SkillsWindowProps = { onClose: () => void };

type SkillBranchProps = {
  skill: Skill;
  parentPath: string[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const rankLevels = [1, 2, 3, 4, 5];

function SkillBranch({ skill, parentPath, selectedId, onSelect }: SkillBranchProps) {
  const locked = skill.level === 0;
  const selected = skill.id === selectedId;
  const hasChildren = Boolean(skill.children?.length);
  const levelText = locked
    ? "Bloqueada, nível 0 de 5"
    : `Nível ${skill.level} de 5, ${skillLevels[skill.level]}`;
  const branchLabel = [...parentPath, skill.name].join(" › ");

  return (
    <li className={`skill-tree-branch${hasChildren ? " has-children" : ""}`}>
      <button
        className={`skill-node${selected ? " selected" : ""}${locked ? " locked" : ""}`}
        type="button"
        aria-label={`${branchLabel}: ${levelText}`}
        aria-pressed={selected}
        onClick={() => onSelect(skill.id)}
      >
        <span className="skill-node-emblem" aria-hidden="true">
          <span className="skill-node-badge">
            <span className="skill-node-core">{skill.glyph}</span>
          </span>
          <span className="skill-node-level">{skill.level}/5</span>
        </span>
        <span className="skill-node-name">{skill.name}</span>
        <span className="skill-node-state">
          {locked ? "BLOQUEADA" : "DESBLOQUEADA"}
        </span>
      </button>

      {hasChildren && (
        <ul className="skill-tree-children">
          {skill.children?.map((child) => (
            <SkillBranch
              key={child.id}
              skill={child}
              parentPath={[...parentPath, skill.name]}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function SkillsWindow({ onClose }: SkillsWindowProps) {
  const [categoryId, setCategoryId] = useState(skillCategories[0].id);
  const [skillId, setSkillId] = useState(skillCategories[0].nodes[0].id);
  const category =
    skillCategories.find((item) => item.id === categoryId) ?? skillCategories[0];
  const skills = flattenSkills(category.nodes);
  const selectedEntry =
    skills.find(({ skill }) => skill.id === skillId) ?? skills[0];
  const { skill: selectedSkill, parentPath } = selectedEntry;
  const locked = selectedSkill.level === 0;

  function selectCategory(nextCategoryId: string) {
    const next = skillCategories.find((item) => item.id === nextCategoryId);
    if (!next) return;
    setCategoryId(next.id);
    setSkillId(next.nodes[0].id);
  }

  return (
    <div
      className="skills-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="skills-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skills-title"
      >
        <header className="skills-header">
          <div>
            <p className="eyebrow">PLAYER SKILL TREE // 01</p>
            <h2 id="skills-title">Habilidades</h2>
            <p className="skills-intro">
              Competências autodeclaradas. Selecione um nó para ver o nível.
            </p>
          </div>
          <button
            className="skills-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar habilidades"
          >
            ×
          </button>
        </header>

        <div className="skills-layout">
          <nav className="skills-categories" aria-label="Categorias de habilidades">
            <span className="skills-section-label">ÁRVORES</span>
            {skillCategories.map((item, index) => {
              const categorySkills = flattenSkills(item.nodes);
              const activeCount = categorySkills.filter(
                ({ skill }) => skill.level > 0,
              ).length;

              return (
                <button
                  className={category.id === item.id ? "active" : ""}
                  key={item.id}
                  type="button"
                  aria-pressed={category.id === item.id}
                  onClick={() => selectCategory(item.id)}
                >
                  <span className="category-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="category-name">{item.shortName}</span>
                  <span className="category-count">
                    {activeCount}/{categorySkills.length}
                  </span>
                </button>
              );
            })}
          </nav>

          <section className="skill-map" aria-label={`${category.name} skill tree`}>
            <div className="skill-map-heading">
              <div>
                <span className="skills-section-label">ÁRVORE ATIVA</span>
                <h3>{category.name}</h3>
              </div>
              <span className="skill-map-count">
                {skills.filter(({ skill }) => skill.level > 0).length} NÓS ATIVOS
                / {skills.length}
              </span>
            </div>

            <ul className="skill-tree-roots" aria-label={`Skills de ${category.name}`}>
              {category.nodes.map((skill) => (
                <SkillBranch
                  key={skill.id}
                  skill={skill}
                  parentPath={[]}
                  selectedId={selectedSkill.id}
                  onSelect={setSkillId}
                />
              ))}
            </ul>

            <div className="skill-map-hint">
              <span>◈ NÓS CONECTADOS = SKILLS RELACIONADAS • NÍVEIS INDEPENDENTES</span>
              <span>SELECIONE UM NÓ PARA VER DETALHES</span>
            </div>
          </section>

          <aside className="skill-detail" aria-live="polite">
            <span className="skills-section-label">HABILIDADE SELECIONADA</span>
            <div className={`skill-detail-title${locked ? " locked" : ""}`}>
              <span className="skill-detail-glyph" aria-hidden="true">
                {selectedSkill.glyph}
              </span>
              <div>
                <h3>{selectedSkill.name}</h3>
                <span>{[category.name, ...parentPath].join(" › ")}</span>
              </div>
            </div>

            <div className="skill-detail-rank">
              <strong>{selectedSkill.level} / 5</strong>
              <span>
                {locked ? "BLOQUEADA" : skillLevels[selectedSkill.level]}
              </span>
            </div>
            <div
              className="skill-rank-track"
              role="img"
              aria-label={`${selectedSkill.level} de 5 níveis preenchidos`}
            >
              {rankLevels.map((level) => (
                <span
                  className={level <= selectedSkill.level ? "filled" : ""}
                  key={level}
                />
              ))}
            </div>
            <p className={`skill-detail-note${locked ? " locked" : ""}`}>
              {selectedSkill.note ??
                "Nível informado pelo jogador na escala de proficiência."}
            </p>

            <div className="skill-scale">
              <span className="skills-section-label">ESCALA DE PROFICIÊNCIA</span>
              {Object.entries(skillLevels).map(([level, name]) => (
                <div className="skill-scale-row" key={level}>
                  <span>{level}</span>
                  <span>{name}</span>
                  {selectedSkill.level === Number(level) && !locked && (
                    <span className="skill-scale-current">ATUAL</span>
                  )}
                </div>
              ))}
              <div className="skill-scale-row skill-scale-locked">
                <span>0</span>
                <span>Bloqueada / em estudo</span>
                {locked && <span className="skill-scale-current">ATUAL</span>}
              </div>
            </div>
          </aside>
        </div>

        <footer className="skills-footer">
          <span>ESC / × FECHAR</span>
          <span>SKILL TREE // BUILD 01.00</span>
        </footer>
      </section>
    </div>
  );
}

export default SkillsWindow;
