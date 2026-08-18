import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const toolBySlug:Record<string,{href:string,label:string}> = {
  'terrenos':{href:'/terrenos',label:'Abrir Analisar Terreno'},
  'urbanismo-pratico':{href:'/alteracao-uso',label:'Abrir Alterar Uso do Imóvel'},
  'documentacao-imobiliaria-profissional':{href:'/checklist-documentos',label:'Abrir Que documentos preciso?'}
}

export default async function CoursePage({params}:{params:Promise<{courseSlug:string}>}){
 const {courseSlug}=await params
 const {supabase,isAdmin,accessIds}=await accessContext()
 const {data:course}=await supabase.from('courses').select('id,title,description,level').eq('slug',courseSlug).eq('status','published').single()
 if(!course)notFound()
 const unlocked=isAdmin||accessIds.has(Number(course.id))

 if(!unlocked){
   return <AppShell>
     <div className="lesson-breadcrumb"><Link href="/academia">Academia</Link><span>›</span><strong>{course.title}</strong></div>
     <div className="back-row"><Link className="back-link" href="/academia">← Voltar à Academia</Link></div>
     <section className="locked-course-hero">
       <div className="lock-big">🔒</div>
       <div className="eyebrow">{course.level} · Formação disponível separadamente</div>
       <h1>{course.title}</h1>
       <p>{course.description}</p>
       <div className="locked-info">
         <strong>Esta formação não está incluída no seu acesso atual.</strong>
         <span>Pode ser adicionada posteriormente à sua conta sem perder o progresso já realizado.</span>
       </div>
       <Link className="btn secondary-outline" href="/academia">Ver outras formações</Link>
     </section>
   </AppShell>
 }

 const {data:modules}=await supabase.from('modules').select('id,title,description,position,lessons(id,title,duration_minutes,position,status),quizzes(id,title,lesson_id)').eq('course_id',course.id).eq('status','published').order('position')
 const {data:{user}}=await supabase.auth.getUser()
 let completed=new Set<number>()
 if(user){
   const lessonIds=(modules||[]).flatMap((m:any)=>(m.lessons||[]).map((l:any)=>l.id))
   if(lessonIds.length){
     const {data:p}=await supabase.from('user_lesson_progress').select('lesson_id').eq('user_id',user.id).eq('completed',true).in('lesson_id',lessonIds)
     completed=new Set((p||[]).map((x:any)=>x.lesson_id))
   }
 }
 const total=(modules||[]).reduce((n:number,m:any)=>n+(m.lessons||[]).filter((l:any)=>l.status==='published').length,0)
 const done=completed.size
 const pct=total?Math.round(done/total*100):0
 const tool=toolBySlug[courseSlug]

 return <AppShell>
   <div className="lesson-breadcrumb"><Link href="/academia">Academia</Link><span>›</span><strong>{course.title}</strong></div>
   <div className="back-row"><Link className="back-link" href="/academia">← Voltar à Academia</Link></div>
   <div className="topbar"><div><div className="eyebrow">{course.level}</div><h1>{course.title}</h1><p className="muted">{course.description}</p></div><span className="badge">{pct}% concluído</span></div>
   <div className="progress section"><span style={{width:`${pct}%`}}/></div>
   {tool&&<div className="course-tool-callout"><div><strong>Ferramenta incluída nesta formação</strong><span>Use o conhecimento do curso numa análise prática.</span></div><Link className="btn" href={tool.href}>{tool.label} →</Link></div>}
   <section className="section module-stack">{(modules||[]).map((m:any)=><div className="card module-card" id={`modulo-${m.position}`} key={m.id}><div className="module-head"><div><div className="eyebrow">Módulo {m.position}</div><h2>{m.title}</h2><p className="muted">{m.description}</p></div></div><div className="lesson-items">{(m.lessons||[]).filter((l:any)=>l.status==='published').sort((a:any,b:any)=>a.position-b.position).map((l:any)=><Link href={`/aula/${l.id}`} className="lesson-row" key={l.id}><span className={completed.has(l.id)?'status-dot done':'status-dot'}></span><div><strong>{l.title}</strong><div className="muted small">{l.duration_minutes||8} min {completed.has(l.id)?'· concluída':''}</div></div><span className="row-arrow">→</span></Link>)}
   {(m.quizzes||[]).filter((q:any)=>!q.lesson_id).map((q:any)=><Link href={`/teste/${q.id}`} className="lesson-row quiz-row" key={q.id}><span className="status-dot quiz-dot"></span><div><strong>{q.title}</strong><div className="muted small">Teste de avaliação do módulo</div></div><span className="row-arrow">→</span></Link>)}</div></div>)}</section>
 </AppShell>
}
