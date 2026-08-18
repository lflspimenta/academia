import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'
import { ArrowRight, CircleCheck, LockKeyhole, Trophy, BadgeCheck } from 'lucide-react'
import { courseCompletion } from '@/lib/certificates'
import { issueCertificate } from '@/app/certificados/actions'

export default async function ProgressPage(){
 const {supabase,user,isAdmin,accessIds}=await accessContext()
 const {data:courses}=await supabase.from('courses').select('id,title,slug,description,level,position').eq('status','published').order('position')
 const available=(courses||[]).filter((c:any)=>isAdmin||accessIds.has(Number(c.id)))
 const ids=available.map((c:any)=>c.id)
 const {data:mods}=ids.length?await supabase.from('modules').select('id,course_id').eq('status','published').in('course_id',ids):{data:[] as any[]}
 const mids=(mods||[]).map((m:any)=>m.id)
 const {data:lessons}=mids.length?await supabase.from('lessons').select('id,module_id').eq('status','published').in('module_id',mids):{data:[] as any[]}
 const lids=(lessons||[]).map((l:any)=>l.id)
 const {data:progress}=user&&lids.length?await supabase.from('user_lesson_progress').select('lesson_id,completed').eq('user_id',user.id).eq('completed',true).in('lesson_id',lids):{data:[] as any[]}
 const done=new Set((progress||[]).map((p:any)=>Number(p.lesson_id)))
 const {data:attempts}=user?await supabase.from('quiz_attempts').select('score').eq('user_id',user.id):{data:[] as any[]}
 const avg=attempts?.length?Math.round(attempts.reduce((s:any,a:any)=>s+Number(a.score),0)/attempts.length):0
 const {data:certs}=user?await supabase.from('certificates').select('course_id,code,status').eq('user_id',user.id):{data:[] as any[]}
 const certMap=new Map((certs||[]).map((x:any)=>[Number(x.course_id),x]))
 const completions=new Map<number,any>()
 if(user){for(const c of available)completions.set(Number(c.id),await courseCompletion(user.id,Number(c.id)))}
 return <AppShell><header className="welcome-head"><div><div className="eyebrow">O MEU PROGRESSO</div><h1>O seu percurso, num só lugar.</h1><p className="muted">Acompanhe as formações disponíveis, aulas concluídas e resultados dos testes.</p></div></header>
 <section className="section stat-grid"><div className="stat-card"><div className="stat-icon"><CircleCheck size={18}/></div><div><span>Aulas concluídas</span><strong>{done.size}</strong><small>de {lids.length} disponíveis</small></div></div><div className="stat-card"><div className="stat-icon"><Trophy size={18}/></div><div><span>Média nos testes</span><strong>{avg?`${avg}%`:'—'}</strong><small>{attempts?.length||0} teste(s) realizado(s)</small></div></div><div className="stat-card"><div className="stat-icon"><LockKeyhole size={18}/></div><div><span>Formações ativas</span><strong>{available.length}</strong><small>na sua conta</small></div></div></section>
 <section className="section"><div className="section-heading"><div><div className="eyebrow">FORMAÇÕES</div><h2>Progresso por formação</h2></div></div><div className="progress-course-grid">{available.map((c:any)=>{const cm=(mods||[]).filter((m:any)=>m.course_id===c.id).map((m:any)=>m.id);const cl=(lessons||[]).filter((l:any)=>cm.includes(l.module_id));const cd=cl.filter((l:any)=>done.has(Number(l.id))).length;const pct=cl.length?Math.round(cd/cl.length*100):0;return <div className="progress-course-card" key={c.id}><div className="course-card-top"><span className="badge">{c.level}</span><strong className="progress-number">{pct}%</strong></div><h3><Link href={`/academia/${c.slug}`}>{c.title}</Link></h3><p>{c.description}</p><div className="mini-progress"><i style={{width:`${pct}%`}}/></div><div className="progress-card-foot"><span>{cd} de {cl.length} aulas</span><span>{pct===100?'Concluída':'Continuar'} <ArrowRight size={14}/></span></div>{(()=>{const cert:any=certMap.get(Number(c.id));const cc:any=completions.get(Number(c.id));return cert?.status==='valid'?<div className="certificate-ready"><BadgeCheck size={16}/><span>Certificado emitido</span><Link href={`/certificado/${cert.code}`}>Ver certificado</div></div>:cc?.eligible?<form action={issueCertificate} className="certificate-ready"><input type="hidden" name="course_id" value={c.id}/><BadgeCheck size={16}/><span>Formação concluída</span><button type="submit" className="text-button">Emitir certificado</button></form>:null})()}</Link>})}</div></section></AppShell>
}
