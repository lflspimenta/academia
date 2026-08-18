import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CoursePage({params}:{params:Promise<{courseSlug:string}>}){
 const {courseSlug}=await params;const supabase=await createClient()
 const {data:course}=await supabase.from('courses').select('id,title,description,level').eq('slug',courseSlug).eq('status','published').single()
 if(!course)notFound()
 const {data:modules}=await supabase.from('modules').select('id,title,description,position,lessons(id,title,duration_minutes,position,status)').eq('course_id',course.id).eq('status','published').order('position')
 const {data:{user}}=await supabase.auth.getUser();let completed=new Set<number>()
 if(user){const lessonIds=(modules||[]).flatMap((m:any)=>(m.lessons||[]).map((l:any)=>l.id));if(lessonIds.length){const {data:p}=await supabase.from('user_lesson_progress').select('lesson_id').eq('user_id',user.id).eq('completed',true).in('lesson_id',lessonIds);completed=new Set((p||[]).map((x:any)=>x.lesson_id))}}
 const total=(modules||[]).reduce((n:number,m:any)=>n+(m.lessons||[]).filter((l:any)=>l.status==='published').length,0);const done=completed.size;const pct=total?Math.round(done/total*100):0
 return <AppShell><div className="topbar"><div><div className="eyebrow">{course.level}</div><h1>{course.title}</h1><p className="muted">{course.description}</p></div><span className="badge">{pct}% concluído</span></div><div className="progress section"><span style={{width:`${pct}%`}}/></div><section className="section module-stack">{(modules||[]).map((m:any)=><div className="card module-card" key={m.id}><div className="module-head"><div><div className="eyebrow">Módulo {m.position}</div><h2>{m.title}</h2><p className="muted">{m.description}</p></div></div><div className="lesson-items">{(m.lessons||[]).filter((l:any)=>l.status==='published').sort((a:any,b:any)=>a.position-b.position).map((l:any)=><Link href={`/aula/${l.id}`} className="lesson-row" key={l.id}><span className={completed.has(l.id)?'status-dot done':'status-dot'}></span><div><strong>{l.title}</strong><div className="muted small">{l.duration_minutes||8} min {completed.has(l.id)?'· concluída':''}</div></div><span className="row-arrow">→</span></Link>)}</div></div>)}</section></AppShell>
}
