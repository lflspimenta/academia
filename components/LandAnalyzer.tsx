'use client'
import { useMemo,useState } from 'react'
import { saveLandAnalysis } from '@/app/terrenos/actions'

type Rule={id:number;rule_type:string;category:string;severity:string;title:string;message:string;next_step?:string;conditions:any;position:number}
const labels:any={
 objective:{moradia:'Construir uma moradia',varias_moradias:'Construir várias moradias',empreendimento:'Desenvolver empreendimento',loteamento:'Criar lotes',revenda:'Analisar para revenda',desconhecido:'Ainda não definido'},
 soil:{desconhecido:'Não sei',urbano:'Solo urbano',rustico:'Solo rústico'},
 pdm:{nao:'Ainda não consultei',sim:'Já consultei'},
 constraints:{desconhecidas:'Não sei',nenhuma_identificada:'Nenhuma identificada',identificadas:'Existem condicionantes'},
 access:{desconhecido:'Não sei',direto_publico:'Acesso direto a via pública',servidao:'Acesso por servidão',sem_acesso:'Sem acesso identificado'},
 infra:{desconhecidas:'Não sei',completas:'Redes disponíveis',parciais:'Algumas redes',ausentes:'Sem redes identificadas'},
 pip:{nao:'Não existe',pedido:'Pedido em análise',favoravel:'Existe PIP favorável',desfavoravel:'Existe PIP desfavorável'},
 lotting:{desconhecido:'Não sei',nao_aplicavel:'Não aplicável',existente:'Existe loteamento/título',a_estudar:'Pretende-se estudar loteamento'}
}
function matches(cond:any,a:any){
 if(!cond||Object.keys(cond).length===0)return true
 return Object.entries(cond).every(([k,v]:any)=>{
   if(Array.isArray(v))return v.includes(a[k])
   if(v&&typeof v==='object'&&'not' in v)return a[k]!==v.not
   return a[k]===v
 })
}
export default function LandAnalyzer({rules}:{rules:Rule[]}){
 const [step,setStep]=useState(1)
 const [saving,setSaving]=useState(false)
 const [saved,setSaved]=useState('')
 const [a,setA]=useState<any>({municipality:'',article:'',objective:'desconhecido',soil:'desconhecido',pdm:'nao',constraints:'desconhecidas',access:'desconhecido',infra:'desconhecidas',pip:'nao',lotting:'desconhecido'})
 const matched=useMemo(()=>rules.filter(r=>matches(r.conditions,a)),[rules,a])
 const checklist=matched.filter(r=>r.rule_type==='checklist')
 const alerts=matched.filter(r=>r.rule_type==='alert')
 const nextSteps=matched.filter(r=>r.rule_type==='next_step')
 const risk=alerts.some(r=>r.severity==='alto')?'alto':alerts.some(r=>r.severity==='medio')?'médio':'baixo'
 const set=(k:string,v:string)=>setA((x:any)=>({...x,[k]:v}))
 const save=async()=>{setSaving(true);setSaved('');const r=await saveLandAnalysis({municipality:a.municipality,article:a.article,objective:a.objective,answers:a,riskLevel:risk,checklist,alerts,nextSteps});setSaved(r.ok?'Análise guardada no seu perfil.':`Não foi possível guardar: ${r.error}`);setSaving(false)}
 return <div className="section">
   <div className="analyzer-progress"><span style={{width:`${step*25}%`}}/></div>
   <div className="analyzer-step-label">Passo {step} de 4</div>

   {step===1&&<div className="card analyzer-card">
     <div className="eyebrow">Identificação e objetivo</div><h2>O que pretende analisar?</h2>
     <div className="grid grid-2 section">
       <label className="field">Município<input value={a.municipality} onChange={e=>set('municipality',e.target.value)} placeholder="Ex.: Matosinhos"/></label>
       <label className="field">Artigo matricial (opcional)<input value={a.article} onChange={e=>set('article',e.target.value)} placeholder="Ex.: 1234"/></label>
       <label className="field">Objetivo<select value={a.objective} onChange={e=>set('objective',e.target.value)}>{Object.entries(labels.objective).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
       <label className="field">Classificação que conhece<select value={a.soil} onChange={e=>set('soil',e.target.value)}>{Object.entries(labels.soil).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
     </div>
   </div>}
   {step===2&&<div className="card analyzer-card">
     <div className="eyebrow">Planeamento e condicionantes</div><h2>O que já foi confirmado?</h2>
     <div className="grid grid-2 section">
       <label className="field">PDM / planos aplicáveis<select value={a.pdm} onChange={e=>set('pdm',e.target.value)}>{Object.entries(labels.pdm).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
       <label className="field">Condicionantes<select value={a.constraints} onChange={e=>set('constraints',e.target.value)}>{Object.entries(labels.constraints).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
       <label className="field">Acesso<select value={a.access} onChange={e=>set('access',e.target.value)}>{Object.entries(labels.access).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
       <label className="field">Infraestruturas<select value={a.infra} onChange={e=>set('infra',e.target.value)}>{Object.entries(labels.infra).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
     </div>
   </div>}
   {step===3&&<div className="card analyzer-card">
     <div className="eyebrow">Informação urbanística existente</div><h2>Há PIP ou loteamento?</h2>
     <div className="grid grid-2 section">
       <label className="field">Pedido de Informação Prévia<select value={a.pip} onChange={e=>set('pip',e.target.value)}>{Object.entries(labels.pip).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
       <label className="field">Loteamento<select value={a.lotting} onChange={e=>set('lotting',e.target.value)}>{Object.entries(labels.lotting).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
     </div>
     <div className="admin-note section">A ferramenta organiza a due diligence. Não declara automaticamente que o terreno é edificável nem substitui arquiteto, urbanista, advogado ou decisão municipal.</div>
   </div>}
   {step===4&&<div>
     <div className="topbar"><div><div className="eyebrow">Resultado guiado</div><h2>Mapa de due diligence</h2><p className="muted">{a.municipality||'Terreno'} · {labels.objective[a.objective]}</p></div><span className={`risk-badge risk-${risk==='médio'?'medio':risk}`}>Risco preliminar: {risk}</span></div>
     <div className="grid grid-2 section">
       <div className="card"><h2>Checklist</h2><div className="checklist-plain">{checklist.map(r=><div key={r.id}><span>✓</span><p><strong>{r.title}</strong><br/><span className="muted">{r.message}</span></p></div>)}</div></div>
       <div className="card"><h2>Alertas</h2><div className="alert-list">{alerts.length?alerts.map(r=><div key={r.id}><span>!</span><p><strong>{r.title}</strong><br/><span className="muted">{r.message}</span></p></div>):<p className="muted">Nenhum alerta adicional pelas respostas dadas. Continue a verificação documental e técnica.</p>}</div></div>
     </div>
     <div className="card section"><h2>Próximos passos</h2><div className="numbered-steps">{nextSteps.map((r,i)=><div key={r.id}><b>{i+1}</b><div><strong>{r.title}</strong><p>{r.next_step||r.message}</p></div></div>)}</div></div>
     <div className="document-footer-meta"><div><strong>Importante</strong><br/>Resultado orientador baseado nas respostas introduzidas. A classificação do solo, os parâmetros e as condicionantes devem ser confirmados nas fontes oficiais aplicáveis ao município e ao prédio.</div><div>Regras verificadas: 18/08/2026</div></div>
     <div className="lesson-actions"><button className="btn" onClick={save} disabled={saving}>{saving?'A guardar...':'Guardar análise'}</button><button className="btn secondary-outline" onClick={()=>setStep(1)}>Nova análise</button></div>
     {saved&&<div className={saved.startsWith('Análise guardada')?'success-note section':'error-note section'}>{saved}</div>}
   </div>}
   {step<4&&<div className="lesson-actions"><button className="btn secondary-outline" onClick={()=>setStep(Math.max(1,step-1))} disabled={step===1}>← Anterior</button><button className="btn" onClick={()=>setStep(Math.min(4,step+1))}>Continuar →</button></div>}
 </div>
}
