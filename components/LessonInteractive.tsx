'use client'
import {useState} from 'react'
import {CheckCircle2,CircleAlert,FileSearch,MousePointerClick,RotateCcw} from 'lucide-react'
type Props={lessonTitle:string;courseSlug?:string}
type Question={q:string;options:string[];correct:number;why:string}
type Scenario={title:string;intro:string;questions:Question[]}
const scenarios:Record<string,Scenario>={
 registry:{title:'Laboratório · Ler uma Certidão Permanente',intro:'Treine a leitura do registo antes de concluir quem é titular, que ónus existem ou se a descrição corresponde ao imóvel.',questions:[
 {q:'A certidão mostra uma hipoteca registada. O que deve fazer?',options:['Ignorar porque o imóvel pode ser vendido','Assinalar o ónus e perceber como será tratado no negócio','Retirar a hipoteca do anúncio'],correct:1,why:'A hipoteca é um ónus relevante. Deve ser identificada e o tratamento no negócio confirmado; não desaparece por decisão comercial.'},
 {q:'A área do registo difere da matriz. Qual a conclusão correta?',options:['A matriz prevalece sempre','O registo prevalece sempre','Existe uma divergência que deve ser investigada e cruzada com outros documentos'],correct:2,why:'Registo e matriz têm funções diferentes. Uma divergência é um sinal para validação documental e, quando necessário, urbanística.'}]},
 cmi:{title:'Decisão profissional · CMI',intro:'Escolha a resposta mais segura antes de iniciar a promoção de um imóvel.',questions:[
 {q:'O proprietário autorizou verbalmente a publicação. Pode avançar?',options:['Sim, a autorização verbal basta','Só depois de confirmar o enquadramento contratual exigível e o CMI','Sim, se não colocar o preço'],correct:1,why:'A atuação da mediadora deve respeitar o regime da mediação e o contrato aplicável. Uma autorização informal não substitui o enquadramento exigível.'},
 {q:'O imóvel tem um anexo não referido no objeto contratual. O que fazer?',options:['Assumir que está incluído','Clarificar documentalmente o objeto e evitar promover o que não está devidamente enquadrado','Ignorar porque é acessório'],correct:1,why:'O objeto mediado deve ser claro. Elementos adicionais podem ter situação registral, matricial ou urbanística própria.'}]},
 cpcv:{title:'Decisão profissional · Antes do CPCV',intro:'Treine a diferença entre acompanhamento comercial e aconselhamento jurídico.',questions:[
 {q:'Há uma divergência documental relevante ainda por esclarecer. O melhor passo é:',options:['Dizer que não tem importância','Sinalizar a divergência e recomendar validação adequada antes da vinculação','Escolher a interpretação mais favorável ao negócio'],correct:1,why:'O consultor deve comunicar factos e riscos identificados sem substituir aconselhamento jurídico nem ocultar informação material.'}]},
 land:{title:'Mito ou realidade · Terrenos',intro:'Em terrenos, uma palavra isolada raramente responde à pergunta “posso construir?”.',questions:[
 {q:'“Está em solo urbano, portanto posso construir.”',options:['Correto','Incorreto'],correct:1,why:'É necessário cruzar classificação/qualificação, regulamento, parâmetros, condicionantes, servidões, acessos e o procedimento aplicável.'},
 {q:'“Tem RAN ou REN, portanto é sempre impossível construir.”',options:['Correto','Incorreto'],correct:1,why:'RAN e REN são condicionantes relevantes, mas a consequência depende da incidência concreta, do regime aplicável e da operação pretendida.'},
 {q:'Um PIP favorável é o mesmo que uma licença de construção.',options:['Sim','Não'],correct:1,why:'O PIP não deve ser apresentado como licença de construção. É um instrumento prévio com efeitos próprios, que deve ser lido no contexto do procedimento urbanístico.'}]},
 aml:{title:'Sinal de alerta · AML',intro:'Identifique situações que justificam diligência reforçada ou validação adicional.',questions:[
 {q:'O cliente insiste em estruturas de pagamento pouco claras e evita explicar a origem dos fundos. Isto é:',options:['Irrelevante para a mediadora','Um potencial sinal de alerta que exige atuação de acordo com os deveres aplicáveis','Apenas uma questão do banco'],correct:1,why:'A mediação imobiliária está sujeita a deveres preventivos. Situações atípicas não devem ser normalizadas ou ignoradas.'}]},
 inheritance:{title:'Caso prático · Herança',intro:'Nem sempre quem apresenta o imóvel é quem pode, sozinho, decidir o negócio.',questions:[
 {q:'Um dos herdeiros quer assinar sozinho a venda de um imóvel da herança. O que faz?',options:['Aceita porque é herdeiro','Confirma a situação sucessória, titularidade, poderes e intervenientes necessários','Pede apenas a caderneta predial'],correct:1,why:'É necessário confirmar documentalmente quem tem legitimidade e poderes para o ato pretendido.'}]}
}
function QuizBlock({scenario}:{scenario:Scenario}){
 const [answers,setAnswers]=useState<Record<number,number>>({});const [checked,setChecked]=useState(false)
 const score=scenario.questions.reduce((n,q,i)=>n+(answers[i]===q.correct?1:0),0)
 return <section className="interactive-lab"><div className="interactive-lab-head"><div className="interactive-lab-icon"><MousePointerClick size={20}/></div><div><div className="eyebrow">Aprender fazendo</div><h2>{scenario.title}</h2><p>{scenario.intro}</p></div></div>
 <div className="interactive-question-list">{scenario.questions.map((q,i)=><div className="interactive-question" key={i}><strong>{i+1}. {q.q}</strong><div className="interactive-options">{q.options.map((o,j)=><button type="button" key={j} className={`interactive-option ${answers[i]===j?'selected':''} ${checked&&answers[i]===j?(j===q.correct?'right':'wrong'):''}`} onClick={()=>{setChecked(false);setAnswers(a=>({...a,[i]:j}))}}>{o}</button>)}</div>{checked&&answers[i]!==undefined&&<div className={`interactive-feedback ${answers[i]===q.correct?'ok':'attention'}`}>{answers[i]===q.correct?<CheckCircle2 size={17}/>:<CircleAlert size={17}/>}<span>{q.why}</span></div>}</div>)}</div>
 <div className="interactive-actions"><button type="button" className="btn" disabled={Object.keys(answers).length!==scenario.questions.length} onClick={()=>setChecked(true)}>Verificar respostas</button>{checked&&<><span className="interactive-score">{score}/{scenario.questions.length} corretas</span><button type="button" className="text-button" onClick={()=>{setAnswers({});setChecked(false)}}><RotateCcw size={14}/> Repetir</button></>}</div></section>
}
const taxFields=[
 {key:'land',label:'Área total do terreno',value:'420,0000 m²',text:'Área total da parcela associada ao prédio na matriz. Não corresponde à área construída. Neste exemplo, o terreno tem 420 m².'},
 {key:'implant',label:'Área de implantação do edifício',value:'135,0000 m²',text:'Área situada dentro do perímetro de fixação do edifício ao solo, medida pela parte exterior. A AT esclarece regras próprias para elementos como alpendres, telheiros e caves.'},
 {key:'private',label:'Área bruta privativa',value:'190,0000 m²',text:'Superfície total medida pelo perímetro exterior e eixos das paredes ou elementos separadores, incluindo os espaços que o CIMI integra nesta categoria. Não é sinónimo automático de área útil ou habitável.'},
 {key:'dependent',label:'Área bruta dependente',value:'55,0000 m²',text:'Áreas cobertas e fechadas de uso exclusivo com função acessória, como certas garagens, parqueamentos, arrecadações, caves, sótãos ou varandas quando não integram a área bruta privativa.'},
 {key:'construction',label:'Área bruta de construção',value:'245,0000 m²',text:'Na explicação da Autoridade Tributária, corresponde ao somatório da área bruta privativa com a área bruta dependente. Neste exemplo: 190 + 55 = 245 m².'},
 {key:'free',label:'Área de terreno livre',value:'285,0000 m²',text:'Terreno não ocupado pelas construções. Neste exemplo: 420 m² de área total do terreno menos 135 m² de implantação = 285 m².'},
]
function CadernetaLab(){
 const [active,setActive]=useState('land');const [answer,setAnswer]=useState<boolean|null>(null)
 const correct=false
 return <section className="document-lab"><div className="interactive-lab-head"><div className="interactive-lab-icon"><FileSearch size={20}/></div><div><div className="eyebrow">Laboratório documental</div><h2>Aprenda a ler uma Caderneta Predial Urbana</h2><p>Exemplo pedagógico fictício. Clique nos campos para perceber o que significam e como se relacionam.</p></div></div>
 <div className="document-lab-grid"><div className="mock-document"><div className="mock-doc-top"><span>Autoridade Tributária e Aduaneira</span><strong>CADERNETA PREDIAL URBANA</strong><small>Exemplo exclusivamente pedagógico · dados fictícios</small></div><div className="mock-doc-section"><b>IDENTIFICAÇÃO DO PRÉDIO</b><div className="mock-doc-row"><span>Distrito: Porto</span><span>Concelho: Exemplo</span><span>Artigo: 1234</span></div></div><div className="mock-doc-section"><b>ÁREAS</b>{taxFields.map(f=><button type="button" key={f.key} onClick={()=>setActive(f.key)} className={`mock-doc-field ${active===f.key?'active':''}`}><span>{f.label}</span><strong>{f.value}</strong></button>)}</div><div className="mock-doc-section muted"><b>VALOR PATRIMONIAL TRIBUTÁRIO</b><div className="mock-doc-row"><span>VPT: 198 450,00 €</span><span>Ano: 2026</span></div></div></div>
 <div className="field-explainer">{taxFields.filter(f=>f.key===active).map(f=><div key={f.key}><div className="eyebrow">Campo selecionado</div><h3>{f.label}</h3><div className="field-value">{f.value}</div><p>{f.text}</p>{f.key==='construction'&&<div className="formula-box">190 m² <span>privativa</span> + 55 m² <span>dependente</span> = <strong>245 m²</strong></div>}{f.key==='free'&&<div className="formula-box">420 m² <span>terreno</span> − 135 m² <span>implantação</span> = <strong>285 m²</strong></div>}</div>)}<div className="gold-rule"><strong>Regra profissional</strong><p>A caderneta é uma fonte matricial/fiscal. Cruze áreas e características com registo predial, documentação urbanística, plantas e realidade física quando sejam relevantes para o negócio.</p></div></div></div>
 <div className="document-challenge"><div className="eyebrow">Agora analise</div><h3>Os 245 m² de área bruta de construção podem ser anunciados automaticamente como 245 m² de área habitável?</h3>{answer===null?<div className="yn-actions"><button type="button" className="btn" onClick={()=>setAnswer(true)}>Sim</button><button type="button" className="btn secondary-outline" onClick={()=>setAnswer(false)}>Não</button></div>:<><div className={`interactive-feedback ${answer===correct?'ok':'attention'}`}>{answer===correct?<CheckCircle2 size={17}/>:<CircleAlert size={17}/>}<span>Não. Área bruta de construção, área bruta privativa e área útil/habitável não são conceitos equivalentes. A métrica anunciada deve ser identificada corretamente.</span></div><button type="button" className="text-button" onClick={()=>setAnswer(null)}><RotateCcw size={14}/> Tentar novamente</button></>}</div>
 <div className="official-note">Definições pedagógicas alinhadas com o artigo 40.º do CIMI e com as FAQ da Autoridade Tributária sobre áreas dos prédios edificados.</div></section>
}

type RiskLevel='Verde'|'Atenção'|'Crítico'
const riskCases=[
 {label:'Hipoteca registada, já identificada e com procedimento de cancelamento definido para o negócio.',correct:'Atenção' as RiskLevel,why:'É um ónus relevante, mas a existência de um procedimento confirmado permite geri-lo. Deve continuar a ser acompanhado.'},
 {label:'Diferença relevante entre áreas anunciadas, matriz e documentação disponível, ainda sem explicação.',correct:'Crítico' as RiskLevel,why:'Uma divergência material não esclarecida pode afetar informação comercial e o próprio negócio. Deve ser investigada antes de assumir conclusões.'},
 {label:'Certidão permanente válida e titularidade coerente com os restantes elementos verificados.',correct:'Verde' as RiskLevel,why:'Não elimina outras verificações, mas este ponto documental não apresenta, por si, um alerta evidente.'},
]
function RiskClassifier(){
 const [answers,setAnswers]=useState<Record<number,RiskLevel>>({})
 return <section className="micro-activity"><div className="eyebrow">Classificar risco</div><h3>Verde, Atenção ou Crítico?</h3><p>Classifique cada situação. O objetivo é treinar triagem profissional, não substituir validação jurídica ou técnica.</p>
 <div className="risk-case-list">{riskCases.map((x,i)=><div className="risk-case" key={i}><strong>{x.label}</strong><div className="risk-buttons">{(['Verde','Atenção','Crítico'] as RiskLevel[]).map(r=><button type="button" key={r} onClick={()=>setAnswers(a=>({...a,[i]:r}))} className={`risk-choice ${answers[i]===r?'selected':''}`}>{r}</button>)}</div>{answers[i]&&<div className={`interactive-feedback ${answers[i]===x.correct?'ok':'attention'}`}><span><b>{answers[i]===x.correct?'Correto.':'Reveja.'}</b> {x.why}</span></div>}</div>)}</div></section>
}

function FindError(){
 const items=[
  {text:'“Moradia com 245 m² de área habitável” — valor copiado diretamente da área bruta de construção da caderneta.',error:true,why:'Área bruta de construção não deve ser convertida automaticamente em área habitável.'},
  {text:'“Imóvel totalmente legalizado” — conclusão baseada apenas na inscrição matricial.',error:true,why:'A matriz tem função fiscal e, isoladamente, não demonstra toda a situação urbanística.'},
  {text:'“Área total do terreno: 420 m²” — valor identificado como área total do terreno na caderneta.',error:false,why:'A métrica está identificada pelo nome correto, sem a transformar noutra área.'},
  {text:'“Anexo incluído na venda” — sem confirmação de como surge no registo, matriz ou documentação urbanística.',error:true,why:'A situação e o enquadramento do anexo devem ser confirmados antes de afirmações categóricas.'}
 ]
 const [picked,setPicked]=useState<number[]>([]);const [checked,setChecked]=useState(false)
 const toggle=(i:number)=>setPicked(a=>a.includes(i)?a.filter(x=>x!==i):[...a,i])
 return <section className="micro-activity"><div className="eyebrow">Encontre o erro</div><h3>Reveja esta ficha comercial</h3><p>Selecione as afirmações que exigem correção ou validação adicional.</p><div className="error-list">{items.map((x,i)=><button type="button" key={i} onClick={()=>{setChecked(false);toggle(i)}} className={`error-item ${picked.includes(i)?'selected':''}`}><span className="error-check">{picked.includes(i)?'✓':''}</span><span>{x.text}</span></button>)}</div><button type="button" className="btn activity-check" onClick={()=>setChecked(true)}>Verificar</button>{checked&&<div className="feedback-stack">{items.map((x,i)=>picked.includes(i)||x.error?<div key={i} className={`interactive-feedback ${(picked.includes(i)===x.error)?'ok':'attention'}`}><span><b>{picked.includes(i)===x.error?'Correto.':'Atenção.'}</b> {x.why}</span></div>:null)}</div>}</section>
}

function ProcessOrder({kind}:{kind:'cpcv'|'land'}){
 const correct=kind==='cpcv'?['Reunir e conferir informação documental','Identificar divergências e pontos por esclarecer','Encaminhar validações necessárias','Preparar/validar a vinculação adequada','Acompanhar condições e passos até ao ato final']:['Identificar o prédio e objetivo do cliente','Consultar PDM e enquadramento territorial','Verificar condicionantes e servidões','Analisar acessos e infraestruturas','Avaliar procedimento/PIP quando adequado']
 const [items,setItems]=useState(()=>[...correct].reverse());const [checked,setChecked]=useState(false)
 const move=(i:number,d:number)=>{const j=i+d;if(j<0||j>=items.length)return;const a=[...items];[a[i],a[j]]=[a[j],a[i]];setItems(a);setChecked(false)}
 return <section className="micro-activity"><div className="eyebrow">Ordenar o processo</div><h3>Coloque as etapas numa sequência profissional lógica</h3><div className="order-list">{items.map((x,i)=><div className="order-item" key={x}><span>{i+1}</span><strong>{x}</strong><div><button type="button" onClick={()=>move(i,-1)} aria-label="Subir">↑</button><button type="button" onClick={()=>move(i,1)} aria-label="Descer">↓</button></div></div>)}</div><button type="button" className="btn activity-check" onClick={()=>setChecked(true)}>Verificar ordem</button>{checked&&<div className={`interactive-feedback ${items.every((x,i)=>x===correct[i])?'ok':'attention'}`}><span>{items.every((x,i)=>x===correct[i])?'Sequência correta.':'Ainda não. Repare que primeiro se identifica e verifica; só depois se conclui ou avança para a etapa seguinte.'}</span></div>}</section>
}

function LandSimulator(){
 const [pdm,setPdm]=useState('');const [constraints,setConstraints]=useState('');const [access,setAccess]=useState('');const [infra,setInfra]=useState('')
 const ready=[pdm,constraints,access,infra].every(Boolean)
 let result=''; if(ready){if(pdm==='nao')result='Informação insuficiente: antes de falar em potencial construtivo, consulte o PDM e o enquadramento aplicável.';else if(constraints==='sim'||access==='nao')result='Atenção elevada: existem condicionantes ou problemas de acesso que exigem análise específica antes de qualquer conclusão comercial.';else result='Há indicadores favoráveis para continuar a análise, mas ainda não existe fundamento para prometer edificabilidade. Confirme parâmetros, servidões e procedimento aplicável.'}
 const Select=({label,value,set}:{label:string,value:string,set:(v:string)=>void})=><label className="sim-field"><span>{label}</span><select value={value} onChange={e=>set(e.target.value)}><option value="">Escolher…</option><option value="sim">Sim</option><option value="nao">Não</option><option value="desconhecido">Não sei</option></select></label>
 return <section className="micro-activity simulator"><div className="eyebrow">Simulador rápido</div><h3>Triagem inicial de um terreno</h3><p>Não determina edificabilidade. Treina as perguntas que devem surgir antes de dar uma resposta ao cliente.</p><div className="sim-grid"><Select label="Consultou o PDM?" value={pdm} set={setPdm}/><Select label="Há RAN, REN ou outra condicionante conhecida?" value={constraints} set={setConstraints}/><Select label="Existe acesso confirmado?" value={access} set={setAccess}/><Select label="Infraestruturas conhecidas?" value={infra} set={setInfra}/></div>{ready&&<div className="sim-result"><strong>Conclusão provisória</strong><p>{result}</p></div>}</section>
}

function StepCase({kind}:{kind:'docs'|'urban'}){
 const steps=kind==='docs'?[
  ['Recebe uma moradia para angariação. A caderneta indica 180 m², mas o proprietário fala em 230 m².','Pedir e cruzar os restantes documentos antes de anunciar a área','Usar os 230 m² porque o proprietário conhece a casa',0],
  ['A certidão mostra a descrição do prédio, mas a divergência mantém-se.','Assumir que a maior área está correta','Identificar a divergência e avançar para verificação documental/urbanística adequada',1],
  ['Há um anexo fisicamente existente que não consegue ainda enquadrar.','Descrevê-lo como totalmente legal','Não fazer afirmações de legalidade sem confirmação e sinalizar o ponto para validação',1]
 ]:[
  ['Um cliente quer transformar uma loja em habitação.','Prometer que é possível porque existem outras habitações no prédio','Começar por verificar enquadramento urbanístico, título/situação existente e requisitos aplicáveis',1],
  ['O uso pretendido parece admissível no plano.','Dar o processo como concluído','Continuar a verificar requisitos técnicos, procedimento e demais condicionantes',1],
  ['Existem dúvidas relevantes sobre obras necessárias.','Encaminhar a componente técnica para profissional competente e não garantir o resultado','Definir sozinho a solução construtiva',0]
 ]
 const [step,setStep]=useState(0);const [answer,setAnswer]=useState<number|null>(null)
 const cur=steps[step] as [string,string,string,number]
 return <section className="micro-activity step-case"><div className="eyebrow">Caso prático por etapas</div><h3>{kind==='docs'?'A moradia com áreas divergentes':'Alteração de utilização: da intenção à verificação'}</h3><div className="step-progress">Etapa {step+1} de {steps.length}</div><p className="step-story">{cur[0]}</p><div className="interactive-options">{[cur[1],cur[2]].map((o,i)=><button type="button" key={i} className={`interactive-option ${answer===i?'selected':''}`} onClick={()=>setAnswer(i)}>{o}</button>)}</div>{answer!==null&&<><div className={`interactive-feedback ${answer===cur[3]?'ok':'attention'}`}><span>{answer===cur[3]?'Boa decisão: mantém a análise baseada em evidência e dentro dos limites profissionais.':'Esta opção cria uma conclusão prematura ou um risco profissional. Reveja antes de avançar.'}</span></div>{step<steps.length-1?<button type="button" className="btn activity-check" onClick={()=>{setStep(step+1);setAnswer(null)}}>Continuar o caso</button>:<div className="case-complete">Caso concluído · agora já pode comparar a sua decisão com a matéria da aula.</div>}</>}</section>
}

function LearningChecklist({lessonTitle}:{lessonTitle:string}){
 const items=['Consigo explicar o conceito principal desta aula sem consultar o texto.','Sei identificar pelo menos um erro ou risco frequente relacionado com este tema.','Sei quando devo confirmar informação ou encaminhar a questão para um profissional competente.']
 const [done,setDone]=useState<boolean[]>(items.map(()=>false))
 return <section className="learning-checklist"><div><div className="eyebrow">Antes de avançar</div><h3>Checklist de aprendizagem</h3><p>Autoavaliação sem nota. Não altera o progresso formal da formação.</p></div><div>{items.map((x,i)=><label key={i} className="learn-check"><input type="checkbox" checked={done[i]} onChange={()=>setDone(a=>a.map((v,j)=>j===i?!v:v))}/><span>{x}</span></label>)}</div><div className="check-progress">{done.filter(Boolean).length}/{items.length} confirmados</div></section>
}

function ModuleFinalCase({courseSlug}:{courseSlug?:string}){
 const q=courseSlug==='terrenos'?'Um cliente apresenta um terreno anunciado como “urbanizável”, sem PIP e sem análise de condicionantes. Qual é a atitude profissional mais adequada?':'Antes de fechar um processo, encontra uma divergência documental ainda não esclarecida. O que faz?'
 const options=courseSlug==='terrenos'?['Confirmar ao cliente que pode construir','Explicar que a expressão comercial não basta e realizar/verificar a análise territorial e documental adequada','Publicar e analisar apenas se aparecer comprador']:['Ignorar porque o negócio está avançado','Registar e comunicar a divergência e promover a validação adequada antes de uma conclusão','Escolher o documento com a informação mais conveniente']
 const correct=1;const [a,setA]=useState<number|null>(null)
 return <section className="module-case"><div className="module-case-badge">TREINO FINAL</div><h3>Caso profissional do módulo</h3><p>{q}</p><div className="interactive-options">{options.map((o,i)=><button type="button" key={i} className={`interactive-option ${a===i?'selected':''}`} onClick={()=>setA(i)}>{o}</button>)}</div>{a!==null&&<div className={`interactive-feedback ${a===correct?'ok':'attention'}`}><span>{a===correct?'Correto. A decisão protege a qualidade da informação e evita conclusões sem suporte.':'Reveja: a prioridade é esclarecer informação material antes de criar uma conclusão profissional.'}</span></div>}</section>
}

export default function LessonInteractive({lessonTitle,courseSlug}:Props){
 const t=lessonTitle.toLowerCase()
 const blocks:any[]=[]
 if(t.includes('caderneta predial')) blocks.push(<CadernetaLab key="cad"/>)
 if(t.includes('certidão')||t.includes('registo predial')) blocks.push(<QuizBlock key="reg" scenario={scenarios.registry}/>,<RiskClassifier key="risk"/>,<FindError key="err"/>)
 if(t.includes('cmi')||t.includes('mediação imobiliária')) blocks.push(<QuizBlock key="cmi" scenario={scenarios.cmi}/>)
 if(t.includes('cpcv')) blocks.push(<QuizBlock key="cpcv" scenario={scenarios.cpcv}/>,<ProcessOrder key="order" kind="cpcv"/>)
 if(t.includes('pdm')||t.includes('ran')||t.includes('ren')||t.includes('pip')||t.includes('urbaniz')||courseSlug==='terrenos') blocks.push(<QuizBlock key="land" scenario={scenarios.land}/>,<LandSimulator key="sim"/>)
 if(t.includes('branqueamento')||t.includes('aml')) blocks.push(<QuizBlock key="aml" scenario={scenarios.aml}/>,<RiskClassifier key="amlrisk"/>)
 if(t.includes('herança')||t.includes('herdeir')) blocks.push(<QuizBlock key="her" scenario={scenarios.inheritance}/>)
 if(t.includes('document')||t.includes('caderneta')||t.includes('certidão')) blocks.push(<StepCase key="stepdocs" kind="docs"/>)
 if(t.includes('alteração')||t.includes('uso')||t.includes('urbanismo')) blocks.push(<StepCase key="stepurban" kind="urban"/>)
 if(courseSlug==='terrenos'&&(t.includes('caso')||t.includes('análise económica'))) blocks.push(<ProcessOrder key="landorder" kind="land"/>,<ModuleFinalCase key="final" courseSlug={courseSlug}/>)
 if(t.includes('caso')||t.includes('conclus')||t.includes('revis')) blocks.push(<ModuleFinalCase key="genericfinal" courseSlug={courseSlug}/>)
 if(blocks.length===0) return null
 return <>{blocks}<LearningChecklist lessonTitle={lessonTitle}/></>
}
