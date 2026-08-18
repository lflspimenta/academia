import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'
import { ArrowRight, BookOpen, CircleCheck, Trophy, Scale, Sparkles } from 'lucide-react'

export default async function Dashboard(){
 const {supabase,user,isAdmin,accessIds}=await accessContext()
 const {data:profile}=user?await supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle():{data:null}
 const {data:courses}=await supabase.from('courses').select('id,title,slug,description,level,position').eq('status','published').order('position')
 const available=(courses||[]).filter((c:any)=>isAdmin||accessIds.has(Number(c.id)))
 const courseIds=available.map((c:any)=>c.id)
 const {data:mods}=courseIds.length?await supabase.from('modules').select('id,course_id,position').eq('status','published').in('course_id',courseIds):{data:[] as any[]}
 const moduleIds=(mods||[]).map((m:any)=>m.id)
 const {data:lessons}=moduleIds.length?await supabase.from('lessons').select('id,title,module_id,position').eq('status','published').in('module_id',moduleIds):{data:[] as any[]}
 const ids=(lessons||[]).map((x:any)=>x.id)
 const {data:progress}=user&&ids.length?await supabase.from('user_lesson_progress').select('lesson_id,completed').eq('user_id',user.id).eq('completed',true).in('lesson_id',ids):{data:[] as any[]}
 const doneIds=new Set((progress||[]).map((p:any)=>Number(p.lesson_id)))
 const done=doneIds.size,total=ids.length,pct=total?Math.round(done/total*100):0
 const {data:attempts}=user?await supabase.from('quiz_attempts').select('score').eq('user_id',user.id):{data:[] as any[]}
 const avg=attempts?.length?Math.round(attempts.reduce((s:any,a:any)=>s+Number(a.score),0)/attempts.length):0
 const {data:update}=await supabase.from('legislative_updates').select('title,topic,verified_at').eq('status','published').order('published_on',{ascending:false}).limit(1).maybeSingle()
 const name=profile?.full_name?.trim()?.split(' ')[0]||user?.email?.split('@')[0]||''
 const ordered=(lessons||[]).slice().sort((a:any,b:any)=>{
   const ma=(mods||[]).find((m:any)=>m.id===a.module_id),mb=(mods||[]).find((m:any)=>m.id===b.module_id)
   return ((ma?.course_id||0)-(mb?.course_id||0))||((ma?.position||0)-(mb?.position||0))||(a.position-b.position)
 })
 const next=ordered.find((l:any)=>!doneIds.has(Number(l.id)))
 const lockedCount=(courses||[]).length-available.length

 return <AppShell>
   <header className="welcome-head"><div><div className="eyebrow">O seu espaço de formação</div><h1>Olá{name?`, ${name}`:''}.</h1><p className="muted">Continue a evoluir ao seu ritmo. O seu progresso fica guardado automaticamente.</p></div><Link className="quiet-link" href="/progresso">Ver progresso <ArrowRight size={15}/></Link></header>

   <section className="section learner-hero">
     <div className="learner-hero-copy"><div className="hero-icon"><Sparkles size={20}/></div><div className="eyebrow hero-eyebrow">PRÓXIMO PASSO</div><h2>{next?next.title:'Formação em dia'}</h2><p>{next?'Continue exatamente de onde ficou e avance para a próxima aula disponível.':'Já concluiu todas as aulas atualmente disponíveis na sua conta.'}</p>{next?<Link className="btn btn-light" href={`/aula/${next.id}`}>Continuar formação <ArrowRight size={16}/></Link>:<Link className="btn btn-light" href="/academia">Ver Academia <ArrowRight size={16}/></Link>}</div>
     <div className="hero-progress-ring" style={{'--progress':`${pct*3.6}deg`} as any}><div><strong>{pct}%</strong><span>concluído</span></div></div>
   </section>

   <section className="section stat-grid">
     <div className="stat-card"><div className="stat-icon"><BookOpen size={18}/></div><div><span>Formações disponíveis</span><strong>{available.length}</strong><small>{lockedCount>0?`${lockedCount} especializações por descobrir`:'Acesso completo'}</small></div></div>
     <div className="stat-card"><div className="stat-icon"><CircleCheck size={18}/></div><div><span>Aulas concluídas</span><strong>{done}<em>/{total}</em></strong><small>O seu percurso atual</small></div></div>
     <div className="stat-card"><div className="stat-icon"><Trophy size={18}/></div><div><span>Média nos testes</span><strong>{avg?`${avg}%`:'—'}</strong><small>{attempts?.length||0} teste(s) realizado(s)</small></div></div>
   </section>

   <section className="section dashboard-split">
     <div>
       <div className="section-heading"><div><div className="eyebrow">AS SUAS FORMAÇÕES</div><h2>Continue a aprender</h2></div><Link className="quiet-link" href="/academia">Ver todas <ArrowRight size={15}/></Link></div>
       <div className="owned-course-list">{available.slice(0,3).map((c:any)=>{
         const mids=(mods||[]).filter((m:any)=>m.course_id===c.id).map((m:any)=>m.id)
         const ls=(lessons||[]).filter((l:any)=>mids.includes(l.module_id));const cd=ls.filter((l:any)=>doneIds.has(Number(l.id))).length;const cp=ls.length?Math.round(cd/ls.length*100):0
         return <Link className="owned-course" href={`/academia/${c.slug}`} key={c.id}><div className="course-index">{String(c.position||1).padStart(2,'0')}</div><div className="owned-course-main"><div className="owned-course-title"><strong>{c.title}</strong><span>{cp}%</span></div><div className="mini-progress"><i style={{width:`${cp}%`}}/></div><small>{cd} de {ls.length} aulas concluídas</small></div><ArrowRight className="course-arrow" size={18}/></Link>
       })}</div>
     </div>
     <aside className="radar-card"><div className="radar-icon"><Scale size={19}/></div><div className="eyebrow">RADAR LEGISLATIVO</div><h2>{update?.topic||'Atualizações profissionais'}</h2><p>{update?.title||'Consulte as alterações relevantes para a atividade imobiliária.'}</p>{update&&<div className="verified-pill">Verificado em {update.verified_at}</div>}<Link className="quiet-link" href="/radar">Consultar radar <ArrowRight size={15}/></Link></aside>
   </section>
 </AppShell>
}
