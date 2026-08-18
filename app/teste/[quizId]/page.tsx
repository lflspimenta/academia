import AppShell from '@/components/AppShell'
import QuizClient from '@/components/QuizClient'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
export default async function TestPage({params}:{params:Promise<{quizId:string}>}){
 const {quizId}=await params;const id=Number(quizId);if(!Number.isFinite(id))notFound();const supabase=await createClient()
 const {data:q}=await supabase.from('quizzes').select('id,title,lesson_id,module_id,lessons(id,title,module_id,modules(id,title,position,courses(title,slug))),modules(id,title,position,courses(title,slug))').eq('id',id).single();if(!q)notFound()
 const lesson:any=q.lessons;const mod:any=lesson?.modules||q.modules;const course:any=mod?.courses
 const {data:allowed}=await supabase.rpc('has_course_access',{target_course_id:course?.id});if(!allowed)redirect(`/academia/${course?.slug}`)
 const back=lesson?`/aula/${lesson.id}`:`/academia/${course?.slug}#modulo-${mod?.position}`
 return <AppShell><div className="lesson-breadcrumb"><Link href="/academia">Academia</Link><span>›</span>{course?.slug&&<Link href={`/academia/${course.slug}`}>{course.title}</Link>}<span>›</span><Link href={`/academia/${course?.slug}#modulo-${mod?.position}`}>{mod?.title}</Link><span>›</span><strong>Teste</strong></div><div className="back-row"><Link className="back-link" href={back}>← {lesson?'Voltar à aula':'Voltar ao módulo'}</Link></div><QuizClient quizId={id}/></AppShell>
}
