import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect,notFound } from 'next/navigation'
import Link from 'next/link'

export default async function UserDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient()
 const {data:{user:authUser}}=await a.auth.admin.getUserById(id);if(!authUser)notFound()
 const [{data:profile},{data:courses},{data:access},{data:progress},{data:attempts},{data:certs},{data:mods},{data:lessons}]=await Promise.all([
   a.from('profiles').select('*').eq('id',id).maybeSingle(),
   a.from('courses').select('id,title,slug,status').eq('status','published').order('position'),
   a.from('course_access').select('course_id').eq('user_id',id),
   a.from('user_lesson_progress').select('lesson_id,completed').eq('user_id',id).eq('completed',true),
   a.from('quiz_attempts').select('quiz_id,score,created_at').eq('user_id',id).order('created_at',{ascending:false}),
   a.from('certificates').select('id,course_id,code,status,issued_at').eq('user_id',id).order('issued_at',{ascending:false}),
   a.from('modules').select('id,course_id').eq('status','published'),
   a.from('lessons').select('id,module_id').eq('status','published')
 ])
 const {data:initial}=await a.rpc('initial_course_id');const accessIds=new Set((access||[]).map((x:any)=>Number(x.course_id)));accessIds.add(Number(initial))
 const done=new Set((progress||[]).map((x:any)=>Number(x.lesson_id)))
 const courseStats=(courses||[]).filter((c:any)=>profile?.role==='admin'||accessIds.has(Number(c.id))).map((c:any)=>{const mids=(mods||[]).filter((m:any)=>m.course_id===c.id).map((m:any)=>m.id);const ls=(lessons||[]).filter((l:any)=>mids.includes(l.module_id));const d=ls.filter((l:any)=>done.has(Number(l.id))).length;return {...c,total:ls.length,done:d,pct:ls.length?Math.round(d/ls.length*100):0}})
 return <AppShell><div className="lesson-breadcrumb"><Link href="/admin/utilizadores">Utilizadores</Link><span>›</span><strong>{profile?.full_name||authUser.email}</strong></div><div className="admin-head"><div><div className="eyebrow">FICHA DO FORMANDO</div><h1>{profile?.full_name||'Sem nome'}</h1><p className="muted">{authUser.email} · {profile?.role==='admin'?'Administrador':'Aluno'}</p></div></div><AdminNav/>
 <section className="section stat-grid"><div className="stat-card"><div><span>Aulas concluídas</span><strong>{done.size}</strong><small>no total</small></div></div><div className="stat-card"><div><span>Tentativas de teste</span><strong>{attempts?.length||0}</strong><small>média {attempts?.length?Math.round(attempts.reduce((s:any,x:any)=>s+Number(x.score),0)/attempts.length):0}%</small></div></div><div className="stat-card"><div><span>Certificados</span><strong>{certs?.filter((x:any)=>x.status==='valid').length||0}</strong><small>válidos</small></div></div></section>
 <section className="section card"><h2>Progresso por formação</h2><div className="progress-course-grid">{courseStats.map((c:any)=><div className="progress-course-card admin-progress-card" key={c.id}><div className="course-card-top"><span className="badge">{c.pct}%</span><span>{c.done}/{c.total}</span></div><h3>{c.title}</h3><div className="mini-progress"><i style={{width:`${c.pct}%`}}/></div></div>)}</div></section>
 <section className="section admin-grid"><div className="card"><h2>Últimos testes</h2><div className="compact-admin-list">{(attempts||[]).slice(0,10).map((x:any,i:number)=><div key={`${x.quiz_id}-${i}`}><div><strong>Teste #{x.quiz_id}</strong><span>{new Date(x.created_at).toLocaleDateString('pt-PT')}</span></div><span className="badge">{Math.round(Number(x.score))}%</span></div>)}{!attempts?.length&&<p className="muted">Sem testes realizados.</p>}</div></div>
 <div className="card"><h2>Certificados</h2><div className="compact-admin-list">{(certs||[]).map((x:any)=><div key={x.id}><div><strong>{x.code}</strong><span>{new Date(x.issued_at).toLocaleDateString('pt-PT')}</span></div><Link className="text-link" href={`/certificado/${x.code}`}>{x.status==='valid'?'Ver':'Invalidado'}</Link></div>)}{!certs?.length&&<p className="muted">Sem certificados emitidos.</p>}</div></div></section>
 </AppShell>
}
