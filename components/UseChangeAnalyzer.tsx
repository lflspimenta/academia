'use client'
import {useMemo,useState} from 'react'
import {saveUseChangeAnalysis} from '@/app/alteracao-uso/actions'

type Rule={id:number;rule_type:string;severity:string;title:string;message:string;next_step?:string;conditions:any;position:number}
function match(c:any,a:any){
 if(!c||!Object.keys(c).length)return true
 return Object.entries(c).every(([k,v]:any)=>Array.isArray(v)?v.includes(a[k]):a[k]===v)
}
const useLabels:any={habitacao:'Habitação',comercio:'Comércio / Loja',servicos:'Serviços / Escritório',armazem:'Armazém',industria:'Indústria',outro:'Outro'}
export default function UseChangeAnalyzer({rules}:{rules:Rule[]}){
 const [step,setStep]=useState(1),[saving,setSaving]=useState(false),[msg,setMsg]=useState('')
 const [a,setA]=useState<any>({municipality:'',propertyType:'fracao',currentUse:'comercio',intendedUse:'habitacao',autonomous_fraction:true,works:'desconhecido',title_known:'nao'})
 const set=(k:string,v:any)=>setA((x:any)=>({...x,[k]:v}))
 const matched=useMemo(()=>rules.filter(r=>match(r.conditions,a)),[rules,a])
 const checklist=matched.filter(r=>r.rule_type==='checklist'), alerts=matched.filter(r=>r.rule_type==='alert'), nextSteps=matched.filter(r=>r.rule_type==='next_step')
 const status=alerts.some(r=>r.severity==='alto')?'Existem obstáculos a analisar':alerts.some(r=>r.severity==='medio')?'Necessita verificação':'Potencialmente viável'
 const save=async()=>{setSaving(true);const r=await saveUseChangeAnalysis({municipality:a.municipality,propertyType:a.propertyType,currentUse:a.currentUse,intendedUse:a.intendedUse,autonomousFraction:a.autonomous_fraction,works:a.works,titleKnown:a.title_known,answers:a,resultStatus:status,checklist,alerts,nextSteps});setMsg(r.ok?'Análise guardada no seu perfil.':`Erro: ${r.error}`);setSaving(false)}
 return <section className="section">
   <div className="analyzer-progress"><span style={{width:`${step*25}%`}}/></div><div className="analyzer-step-label">Passo {step} de 4</div>
   {step===1&&<div className="card analyzer-card"><div className="eyebrow">Situação atual</div><h2>Que imóvel temos?</h2><div className="grid grid-2 section">
     <label className="field">Município<input value={a.municipality} onChange={e=>set('municipality',e.target.value)} placeholder="Ex.: Porto"/></label>
     <label className="field">Tipo<select value={a.propertyType} onChange={e=>set('propertyType',e.target.value)}><option value="fracao">Fração autónoma</option><option value="predio">Prédio não fracionado</option></select></label>
     <label className="field">Uso atual<select value={a.currentUse} onChange={e=>set('currentUse',e.target.value)}>{Object.entries(useLabels).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
     <label className="field">Uso pretendido<select value={a.intendedUse} onChange={e=>set('intendedUse',e.target.value)}>{Object.entries(useLabels).map(([v,l]:any)=><option key={v} value={v}>{l}</option>)}</select></label>
   </div></div>}
   {step===2&&<div className="card analyzer-card"><div className="eyebrow">Documentação</div><h2>O que já está confirmado?</h2><div className="grid grid-2 section">
     <label className="field">Conhece o uso atualmente titulado?<select value={a.title_known} onChange={e=>set('title_known',e.target.value)}><option value="sim">Sim</option><option value="nao">Não / tenho dúvidas</option></select></label>
     <label className="field">É fração autónoma?<select value={String(a.autonomous_fraction)} onChange={e=>set('autonomous_fraction',e.target.value==='true')}><option value="true">Sim</option><option value="false">Não</option></select></label>
   </div></div>}
   {step===3&&<div className="card analyzer-card"><div className="eyebrow">Intervenção</div><h2>A mudança exige obras?</h2><div className="grid grid-2 section">
     <label className="field">Obras<select value={a.works} onChange={e=>set('works',e.target.value)}><option value="desconhecido">Ainda não sei</option><option value="nao">Não</option><option value="sim">Sim</option></select></label>
   </div><div className="admin-note section">O resultado é orientador. A ferramenta não aprova uma alteração de uso nem substitui a Câmara, arquiteto, engenheiro ou aconselhamento jurídico quando necessário.</div></div>}
   {step===4&&<div>
     <div className="topbar"><div><div className="eyebrow">Diagnóstico orientador</div><h2>{useLabels[a.currentUse]} → {useLabels[a.intendedUse]}</h2><p className="muted">{a.municipality||'Município não indicado'}</p></div><span className={`risk-badge ${status==='Existem obstáculos a analisar'?'risk-alto':status==='Necessita verificação'?'risk-medio':'risk-baixo'}`}>{status}</span></div>
     <div className="grid grid-2 section"><div className="card"><h2>Documentos e verificações</h2><div className="checklist-plain">{checklist.map(r=><div key={r.id}><span>✓</span><p><strong>{r.title}</strong><br/><span className="muted">{r.message}</span></p></div>)}</div></div>
     <div className="card"><h2>Alertas</h2><div className="alert-list">{alerts.map(r=><div key={r.id}><span>!</span><p><strong>{r.title}</strong><br/><span className="muted">{r.message}</span></p></div>)}</div></div></div>
     <div className="card section"><h2>Próximos passos</h2><div className="numbered-steps">{nextSteps.map((r,i)=><div key={r.id}><b>{i+1}</b><div><strong>{r.title}</strong><p>{r.next_step||r.message}</p></div></div>)}</div></div>
     <div className="document-footer-meta"><div><strong>Resultado orientador</strong><br/>Não constitui decisão municipal nem certificação de viabilidade. Confirme sempre o regime municipal e a situação concreta.</div><div>Regras verificadas: 18/08/2026</div></div>
     <div className="lesson-actions"><button className="btn" onClick={save} disabled={saving}>{saving?'A guardar...':'Guardar análise'}</button><button className="btn secondary-outline" onClick={()=>setStep(1)}>Nova análise</button></div>{msg&&<div className="success-note section">{msg}</div>}
   </div>}
   {step<4&&<div className="lesson-actions"><button className="btn secondary-outline" disabled={step===1} onClick={()=>setStep(step-1)}>← Anterior</button><button className="btn" onClick={()=>setStep(step+1)}>Continuar →</button></div>}
 </section>
}
