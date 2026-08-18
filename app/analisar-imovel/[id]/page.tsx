import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import { redirect,notFound } from 'next/navigation'
import Link from 'next/link'
import { CircleCheck,TriangleAlert,CircleX,ArrowRight,FileText } from 'lucide-react'
import AnalysisReportActions from '@/components/AnalysisReportActions'
import { archivePropertyAnalysis } from '../actions'

export default async function AnalysisResult({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const s=await createClient()
 const {data:courseAccessTarget}=await s.from('courses').select('id').eq('slug','pratica-profissional-avancada').eq('status','published').maybeSingle()
 if(!courseAccessTarget) redirect('/academia')
 const {data:hasAccess}=await s.rpc('has_course_access',{target_course_id:courseAccessTarget.id})
 if(!hasAccess) redirect('/academia/pratica-profissional-avancada');const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:a}=await s.from('property_analyses').select('*').eq('id',Number(id)).eq('user_id',user.id).maybeSingle();if(!a)notFound()
 const r:any=a.result||{};const Icon=({level}:{level:string})=>level==='critical'?<CircleX/>:level==='warning'?<TriangleAlert/>:<CircleCheck/>
 return <AppShell><div className="analysis-report-head"><div><div className="eyebrow">DUE DILIGENCE DA ANGARIAÇÃO</div><h1>{a.title}</h1><p>{a.municipality||'Município não indicado'} · análise atualizada em {new Date(a.updated_at).toLocaleDateString('pt-PT')}</p></div><div className={`analysis-score ${r.risk}`}><strong>{r.score}</strong><span>/ 100</span><small>{r.risk==='high'?'Risco elevado':r.risk==='medium'?'Requer atenção':'Risco baixo'}</small></div></div>
 <div className="analysis-report-actions"><Link href="/analisar-imovel" className="btn secondary-outline no-print">Nova análise</Link><AnalysisReportActions/></div>
 <section className="section report-card"><div className="report-brand"><strong>Academia Imobiliária</strong><span>Relatório de apoio à due diligence</span></div><h2>Resumo da análise</h2><div className="findings-list">{(r.findings||[]).map((f:any,i:number)=><div className={`finding ${f.level}`} key={i}><Icon level={f.level}/><div><strong>{f.title}</strong><p>{f.detail}</p>{f.action&&<span>Próximo passo: {f.action}</span>}</div></div>)}</div>
 {(r.missing||[]).length>0&&<div className="report-section"><div className="eyebrow">DOCUMENTAÇÃO EM FALTA</div><h3>Elementos a recolher</h3><ul>{r.missing.map((x:string)=><li key={x}>{x}</li>)}</ul></div>}
 <div className="report-section"><div className="eyebrow">PLANO DE AÇÃO</div><h3>Próximos passos recomendados</h3><ol>{(r.nextSteps||[]).map((x:string)=><li key={x}>{x}</li>)}</ol></div>
 {(r.routes||[]).length>0&&<div className="report-section no-print"><div className="eyebrow">FERRAMENTAS RECOMENDADAS</div><div className="route-grid">{r.routes.map((x:any)=><Link href={x.href} key={x.href}><div><strong>{x.label}</strong><span>{x.reason}</span></div><ArrowRight size={17}/></Link>)}</div></div>}
 <div className="analysis-legal-note"><FileText size={16}/><p>Relatório de apoio à organização da informação fornecida. Deve confirmar a documentação atual, as fontes oficiais e obter aconselhamento jurídico, técnico ou municipal quando a situação concreta o exija.</p></div></section>
 <form action={archivePropertyAnalysis} className="archive-analysis no-print"><input type="hidden" name="id" value={a.id}/><button className="text-button">Arquivar esta análise</button></form>
 </AppShell>
}
