import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LandAnalyzer from '@/components/LandAnalyzer'

export default async function TerrenosPage(){
  const supabase=await createClient()
  const {data:course}=await supabase.from('courses').select('id').eq('slug','terrenos').eq('status','published').maybeSingle()
  if(!course) redirect('/academia')
  const {data:allowed}=await supabase.rpc('has_course_access',{target_course_id:course.id})
  if(!allowed) redirect('/academia/terrenos')
  const {data:rules}=await supabase
    .from('land_analysis_rules')
    .select('id,rule_type,category,severity,title,message,next_step,conditions,position')
    .eq('status','published')
    .order('position')

  const {data:{user}}=await supabase.auth.getUser()
  let recent:any[]=[]
  if(user){
    const {data}=await supabase
      .from('land_analyses')
      .select('id,municipality,article,objective,risk_level,created_at')
      .eq('user_id',user.id)
      .order('created_at',{ascending:false})
      .limit(5)
    recent=data||[]
  }

  return <AppShell>
    <div className="topbar">
      <div>
        <div className="eyebrow">Ferramenta profissional</div>
        <h1>Analisar Terreno</h1>
        <p className="muted">Due diligence guiada para organizar a análise antes de anunciar, comprar ou desenvolver um terreno.</p>
      </div>
      <Link className="btn secondary-outline" href="/academia/terrenos-potencial-construtivo">Abrir especialização</Link>
    </div>
    <LandAnalyzer rules={rules||[]} />
    {recent.length>0 && <section className="section">
      <h2>Análises recentes</h2>
      <div className="list">
        {recent.map((r:any)=><div className="lesson" key={r.id}>
          <div className="topbar">
            <div><strong>{r.municipality||'Município não indicado'}{r.article?` · Artigo ${r.article}`:''}</strong><div className="muted small">{r.objective}</div></div>
            <span className={`badge ${r.risk_level==='alto'?'badge-danger':''}`}>{r.risk_level||'por avaliar'}</span>
          </div>
        </div>)}
      </div>
    </section>}
  </AppShell>
}
