import AppShell from '@/components/AppShell'
import PropertyAnalysisForm from '@/components/PropertyAnalysisForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck,FileSearch,Route,Clock3 } from 'lucide-react'

export default async function AnalyseProperty(){
 const s=await createClient()
 const {data:courseAccessTarget}=await s.from('courses').select('id').eq('slug','pratica-profissional-avancada').eq('status','published').maybeSingle()
 if(!courseAccessTarget) redirect('/academia')
 const {data:hasAccess}=await s.rpc('has_course_access',{target_course_id:courseAccessTarget.id})
 if(!hasAccess) redirect('/academia/pratica-profissional-avancada');const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:history}=await s.from('property_analyses').select('id,title,municipality,property_type,risk_level,updated_at,status').eq('user_id',user.id).neq('status','archived').order('updated_at',{ascending:false}).limit(8)
 return <AppShell><div className="tool-hero analysis-hero"><div><div className="eyebrow">FERRAMENTA PROFISSIONAL</div><h1>Analisar Imóvel</h1><p>Due diligence guiada da angariação. Identifique riscos, documentos em falta e próximos passos antes de avançar.</p></div><div className="analysis-hero-actions"><ShieldCheck size={44}/><Link className="btn secondary-outline" href="/academia/pratica-profissional-avancada">Abrir especialização</Link></div></div>
 <section className="section analysis-benefits"><div><FileSearch/><strong>Documentação</strong><span>Organiza o que existe e o que falta confirmar.</span></div><div><ShieldCheck/><strong>Alertas</strong><span>Sinaliza inconsistências e pontos de risco.</span></div><div><Route/><strong>Próximos passos</strong><span>Indica o que deve verificar a seguir.</span></div></section>
 <section className="section card"><PropertyAnalysisForm/></section>
 {(history||[]).length>0&&<section className="section"><div className="section-heading"><div><div className="eyebrow">HISTÓRICO</div><h2>Análises guardadas</h2></div></div><div className="analysis-history">{history!.map((x:any)=><Link href={`/analisar-imovel/${x.id}`} key={x.id}><div><strong>{x.title}</strong><span>{x.municipality||'Município não indicado'} · {new Date(x.updated_at).toLocaleDateString('pt-PT')}</span></div><span className={`risk-pill ${x.risk_level}`}>{x.risk_level==='high'?'Risco elevado':x.risk_level==='medium'?'Atenção':'Risco baixo'}</span></Link>)}</div></section>}
 </AppShell>
}
