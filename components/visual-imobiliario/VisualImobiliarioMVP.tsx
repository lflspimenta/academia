"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import styles from "./visual-imobiliario.module.css";

type Mode = "land" | "room";
type Step = "choose" | "upload" | "configure" | "result";

const LAND_TYPES = ["Moradia térrea", "Moradia de 2 pisos", "Moradia contemporânea", "Pequeno empreendimento"];
const ARCH_STYLES = ["Contemporâneo", "Minimalista", "Mediterrânico", "Tradicional português", "Luxo discreto"];
const ROOM_TYPES = ["Sala", "Quarto", "Cozinha", "Escritório", "Terraço", "Hall"];
const INTERIOR_STYLES = ["Contemporâneo", "Minimalista", "Escandinavo", "Mediterrânico", "Japandi", "Luxo discreto"];

export default function VisualImobiliarioMVP() {
  const [step, setStep] = useState<Step>("choose");
  const [mode, setMode] = useState<Mode | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [generated, setGenerated] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [compare, setCompare] = useState(52);
  const [status, setStatus] = useState<"idle" | "generating" | "ready">("idle");
  const [propertyType, setPropertyType] = useState(LAND_TYPES[0]);
  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [visualStyle, setVisualStyle] = useState(ARCH_STYLES[0]);
  const [furnishing, setFurnishing] = useState("Equilibrado");
  const [preserve, setPreserve] = useState({
    geometry: true,
    windows: true,
    access: true,
    vegetation: true,
    floor: true,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const title = mode === "land" ? "Terreno → Potencial" : "Divisão → Mobilada";
  const subtitle =
    mode === "land"
      ? "Apresente uma proposta conceptual mantendo o contexto real do terreno."
      : "Mostre o potencial de uma divisão sem alterar a sua geometria essencial.";

  const progressLabel = useMemo(() => {
    if (status !== "generating") return "";
    return mode === "land"
      ? "A preparar a proposta arquitectónica…"
      : "A preparar o ambiente e o mobiliário…";
  }, [mode, status]);

  function chooseMode(next: Mode) {
    setMode(next);
    setVisualStyle(next === "land" ? ARCH_STYLES[0] : INTERIOR_STYLES[0]);
    setStep("upload");
  }

  function acceptFile(next: File | null) {
    if (!next || !next.type.startsWith("image/")) return;
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(next);
    setFile(next);
    setPreview(url);
    setGenerated("");
    setStatus("idle");
    setStep("configure");
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0] ?? null);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function generateDemo() {
    setStatus("generating");
    await new Promise((resolve) => setTimeout(resolve, 1700));
    // Interface MVP: o motor de IA é ligado posteriormente nesta função.
    // Até essa integração, mantemos a fotografia real como referência visual segura.
    setGenerated(preview);
    setStatus("ready");
    setStep("result");
  }

  function resetAll() {
    setStep("choose");
    setMode(null);
    setFile(null);
    setGenerated("");
    setStatus("idle");
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>ACADEMIA IMOBILIÁRIA · FERRAMENTAS</span>
          <h1>Visual Imobiliário</h1>
        </div>
        <div className={styles.headerActions}>
          {step !== "choose" && (
            <button className={styles.ghostButton} onClick={resetAll}>
              Nova visualização
            </button>
          )}
          <span className={styles.badge}>MVP</span>
        </div>
      </header>

      {step === "choose" && (
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Apresente potencial. Não apenas metros quadrados.</span>
            <h2>Transforme uma fotografia real numa apresentação visual do imóvel.</h2>
            <p>
              Escolha o tipo de visualização. A ferramenta foi desenhada para agentes imobiliários:
              sem prompts, sem parâmetros técnicos e com informação clara sobre o carácter ilustrativo do resultado.
            </p>
          </div>

          <div className={styles.modeGrid}>
            <button className={styles.modeCard} onClick={() => chooseMode("land")}>
              <div className={styles.modeNumber}>01</div>
              <div className={styles.modeVisual}>
                <div className={styles.landLine} />
                <div className={styles.houseShape}>
                  <span />
                </div>
              </div>
              <div>
                <h3>Terreno → Potencial</h3>
                <p>Visualize uma implantação conceptual de moradia ou pequeno empreendimento.</p>
              </div>
              <span className={styles.cardAction}>Criar visualização →</span>
            </button>

            <button className={styles.modeCard} onClick={() => chooseMode("room")}>
              <div className={styles.modeNumber}>02</div>
              <div className={styles.modeVisual}>
                <div className={styles.roomFrame}>
                  <div className={styles.sofa} />
                  <div className={styles.table} />
                </div>
              </div>
              <div>
                <h3>Divisão → Mobilada</h3>
                <p>Apresente virtual staging preservando paredes, vãos e perspectiva da divisão.</p>
              </div>
              <span className={styles.cardAction}>Criar visualização →</span>
            </button>
          </div>

          <div className={styles.trustStrip}>
            <span>Fotografia real preservada</span>
            <span>Resultado identificado como visualização</span>
            <span>Preparado para imagem e vídeo</span>
          </div>
        </section>
      )}

      {step === "upload" && (
        <section className={styles.workspace}>
          <div className={styles.stepTop}>
            <button className={styles.back} onClick={() => setStep("choose")}>← Voltar</button>
            <div>
              <span className={styles.stepLabel}>PASSO 1 DE 3</span>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <div
            className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} hidden />
            <div className={styles.uploadMark}>+</div>
            <h3>Carregar fotografia</h3>
            <p>Arraste uma imagem para aqui ou clique para selecionar.</p>
            <span>JPG · PNG · WEBP</span>
          </div>

          <div className={styles.tip}>
            <strong>Para melhores resultados</strong>
            <p>Use uma fotografia nítida, sem filtros fortes e com o espaço principal totalmente visível.</p>
          </div>
        </section>
      )}

      {step === "configure" && (
        <section className={styles.editorLayout}>
          <aside className={styles.controls}>
            <button className={styles.back} onClick={() => setStep("upload")}>← Substituir fotografia</button>
            <span className={styles.stepLabel}>PASSO 2 DE 3</span>
            <h2>{title}</h2>
            <p className={styles.controlsIntro}>{subtitle}</p>

            {mode === "land" ? (
              <>
                <Field label="O que pretende visualizar?">
                  <Select value={propertyType} onChange={setPropertyType} options={LAND_TYPES} />
                </Field>
                <Field label="Estilo arquitectónico">
                  <ChoiceGrid value={visualStyle} onChange={setVisualStyle} options={ARCH_STYLES} />
                </Field>
                <Field label="Preservar no terreno">
                  <Check label="Topografia / perspectiva" checked={preserve.geometry} onChange={(v) => setPreserve({ ...preserve, geometry: v })} />
                  <Check label="Acesso e estrada" checked={preserve.access} onChange={(v) => setPreserve({ ...preserve, access: v })} />
                  <Check label="Vegetação relevante" checked={preserve.vegetation} onChange={(v) => setPreserve({ ...preserve, vegetation: v })} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Tipo de divisão">
                  <Select value={roomType} onChange={setRoomType} options={ROOM_TYPES} />
                </Field>
                <Field label="Estilo">
                  <ChoiceGrid value={visualStyle} onChange={setVisualStyle} options={INTERIOR_STYLES} />
                </Field>
                <Field label="Nível de mobiliário">
                  <ChoiceGrid value={furnishing} onChange={setFurnishing} options={["Essencial", "Equilibrado", "Completo"]} />
                </Field>
                <Field label="Preservar">
                  <Check label="Paredes e proporções" checked={preserve.geometry} onChange={(v) => setPreserve({ ...preserve, geometry: v })} />
                  <Check label="Janelas e portas" checked={preserve.windows} onChange={(v) => setPreserve({ ...preserve, windows: v })} />
                  <Check label="Pavimento" checked={preserve.floor} onChange={(v) => setPreserve({ ...preserve, floor: v })} />
                </Field>
              </>
            )}

            <button className={styles.primaryButton} onClick={generateDemo} disabled={status === "generating"}>
              {status === "generating" ? "A preparar…" : "Gerar visualização"}
            </button>
            <p className={styles.legalMicro}>A visualização gerada terá carácter meramente ilustrativo.</p>
          </aside>

          <div className={styles.previewStage}>
            <div className={styles.previewMeta}>
              <span>FOTOGRAFIA ORIGINAL</span>
              <span>{file?.name}</span>
            </div>
            {preview && <img src={preview} alt="Fotografia carregada" className={styles.mainImage} />}
            {status === "generating" && (
              <div className={styles.generatingOverlay}>
                <div className={styles.loader} />
                <strong>{progressLabel}</strong>
                <span>Preservar geometria · analisar luz · preparar composição</span>
              </div>
            )}
          </div>
        </section>
      )}

      {step === "result" && (
        <section className={styles.resultPage}>
          <div className={styles.resultHeading}>
            <div>
              <span className={styles.stepLabel}>PASSO 3 DE 3</span>
              <h2>Visualização pronta para revisão</h2>
              <p>Compare sempre com a fotografia original antes de utilizar o resultado comercialmente.</p>
            </div>
            <span className={styles.statusReady}>● Pronto</span>
          </div>

          <div className={styles.compareCard}>
            <div className={styles.compareLabels}>
              <span>REALIDADE</span>
              <span>VISUALIZAÇÃO</span>
            </div>
            <div className={styles.comparator}>
              {preview && <img src={preview} alt="Original" className={styles.compareImage} />}
              <div className={styles.afterClip} style={{ width: `${compare}%` }}>
                {generated && <img src={generated} alt="Visualização" className={styles.compareImage} />}
                <div className={styles.demoOverlay}>
                  <span>PRÉ-VISUALIZAÇÃO DO MVP</span>
                  <small>Motor de IA ainda não ligado</small>
                </div>
              </div>
              <div className={styles.divider} style={{ left: `${compare}%` }}>
                <span>↔</span>
              </div>
              <input
                className={styles.range}
                type="range"
                min="4"
                max="96"
                value={compare}
                onChange={(e) => setCompare(Number(e.target.value))}
                aria-label="Comparar antes e depois"
              />
            </div>
          </div>

          <div className={styles.outputGrid}>
            <div className={styles.outputCard}>
              <span className={styles.outputIcon}>□</span>
              <h3>Imagem</h3>
              <p>Preparada para apresentação, anúncio ou dossier comercial.</p>
              <button disabled>Descarregar imagem</button>
            </div>
            <div className={styles.outputCard}>
              <span className={styles.outputIcon}>▶</span>
              <h3>Vídeo</h3>
              <p>Próxima fase: transformação progressiva em 9:16, 4:5 ou 16:9.</p>
              <button disabled>Criar vídeo</button>
            </div>
            <div className={styles.outputCard}>
              <span className={styles.outputIcon}>↗</span>
              <h3>Apresentar ao cliente</h3>
              <p>Versão com antes/depois e nota de visualização meramente ilustrativa.</p>
              <button disabled>Criar apresentação</button>
            </div>
          </div>

          <div className={styles.notice}>
            <strong>Nota de utilização</strong>
            <p>
              Visualização digital meramente ilustrativa. Não representa projeto aprovado, garantia de viabilidade construtiva,
              solução de arquitectura contratada nem características existentes no imóvel.
            </p>
          </div>

          <div className={styles.resultActions}>
            <button className={styles.secondaryButton} onClick={() => setStep("configure")}>Ajustar opções</button>
            <button className={styles.primaryButton} onClick={resetAll}>Nova visualização</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className={styles.field}><label>{label}</label>{children}</div>;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function ChoiceGrid({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className={styles.choiceGrid}>
      {options.map((option) => (
        <button key={option} className={value === option ? styles.choiceActive : styles.choice} onClick={() => onChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={styles.checkRow} onClick={() => onChange(!checked)}>
      <span className={checked ? styles.checkOn : styles.checkOff}>{checked ? "✓" : ""}</span>
      <span>{label}</span>
    </button>
  );
}
