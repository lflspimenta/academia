import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import { lessonText } from '@/lib/content'
import MarkCompleteButton from '@/components/MarkCompleteButton'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function LessonPage({params}:{params:Promise<{lessonId:string}>}){
 const {lessonId}=await params;const id=Number(lessonId);if(!Number.isFinite(id))notFound();const supabase=await createClient()
 const {data:lesson}=await supabase.from('lessons').select('id,title,content,duration_minutes,legal_sensitive,verified_at,source_url,module_id,position,modules(id,title,position,course_id,courses(id,title,slug))').eq('id',id).eq('status','published').single()
 if(!lesson)notFound();const content=lessonText(lesson.content);const {data:{user}}=await supabase.auth.getUser();let done=false;if(user){const {data:p}=await supabase.from('user_lesson_progress').select('completed').eq('user_id',user.id).eq('lesson_id',id).maybeSingle();done=!!p?.completed}
 const mod:any=lesson.modules;const course:any=mod?.courses
 const {data:allowed}=await supabase.rpc('has_course_access',{target_course_id:course?.id})
 if(!allowed)redirect(`/academia/${course?.slug}`)
 const {data:quiz}=await supabase.from('quizzes').select('id,title').eq('lesson_id',id).maybeSingle()
 const {data:siblings}=await supabase.from('lessons').select('id,title,position,module_id,modules(position,course_id)').eq('status','published')
 const sameCourse=(siblings||[]).filter((l:any)=>l.modules?.course_id===course?.id).sort((a:any,b:any)=>(a.modules?.position-b.modules?.position)||(a.position-b.position))
 const idx=sameCourse.findIndex((l:any)=>l.id===id);const coursePct=sameCourse.length?Math.round(((idx+1)/sameCourse.length)*100):0;const prev=idx>0?sameCourse[idx-1]:null;const next=idx>=0&&idx<sameCourse.length-1?sameCourse[idx+1]:null
 return <AppShell>
 <div className="lesson-breadcrumb"><Link href="/academia">Academia</Link><span>›</span>{course?.slug&&<Link href={`/academia/${course.slug}`}>{course.title}</Link>}<span>›</span><Link href={`/academia/${course?.slug}#modulo-${mod?.position}`}>{mod?.title}</Link><span>›</span><strong>{lesson.title}</strong></div>
 <div className="back-row"><Link className="back-link" href={`/academia/${course?.slug}#modulo-${mod?.position}`}>← Voltar ao módulo</Link></div>
 <article className="reading"><div className="lesson-stage"><div><div className="eyebrow">Módulo {mod?.position} · Aula {idx+1} de {sameCourse.length} · {lesson.duration_minutes||8} min</div><h1>{lesson.title}</h1></div><div className="lesson-stage-progress"><span>{coursePct}%</span><div className="mini-progress"><i style={{width:`${coursePct}%`}}/></div></div></div><p className="lead">{content.intro}</p>{content.sections.map((s:any,i:number)=><section className="reading-section" key={i}><h2>{s.title}</h2><p>{s.body}</p></section>)}{content.case_body&&<section className="case-box"><div className="eyebrow">{content.case_title||'Caso prático'}</div><p>{content.case_body}</p></section>}{content.takeaway&&<section className="takeaway"><strong>Ideia principal</strong><p>{content.takeaway}</p></section>}{lesson.legal_sensitive&&<section className="legal-source"><strong>Conteúdo legal/documental verificado</strong><div>Última verificação: {lesson.verified_at||'—'}</div>{lesson.source_url&&<a href={lesson.source_url} target="_blank" rel="noreferrer">Consultar fonte oficial ↗</a>}</section>}
 <div className="lesson-actions"><MarkCompleteButton lessonId={id} initialCompleted={done}/>{quiz&&<Link className="btn secondary-outline" href={`/teste/${quiz.id}`}>Fazer teste →</Link>}</div>
 <nav className="lesson-pagination" aria-label="Navegação entre aulas"><div>{prev&&<Link href={`/aula/${prev.id}`}>← <span>Aula anterior</span><strong>{prev.title}</strong></Link>}</div><div className="next-link">{next&&<Link href={`/aula/${next.id}`}><span>Próxima aula</span><strong>{next.title}</strong> →</Link>}</div></nav>
 </article></AppShell>
}
