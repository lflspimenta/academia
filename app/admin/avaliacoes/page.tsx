import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { createQuiz,updateQuiz,addQuestion } from '../actions'

export default async function Evaluations(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient()
 const [{data:courses},{data:modules},{data:quizzes},{data:questions},{data:attempts}]=await Promise.all([
   a.from('courses').select('id,title').eq('status','published').order('position'),
   a.from('modules').select('id,title,course_id').eq('status','published').order('course_id').order('position'),
   a.from('quizzes').select('id,title,module_id,pass_percentage').order('id'),
   a.from('questions').select('id,quiz_id'),
   a.from('quiz_attempts').select('id,quiz_id,score,user_id')
 ])
 const cm=new Map((courses||[]).map((x:any)=>[x.id,x.title]));const mm=new Map((modules||[]).map((x:any)=>[x.id,x]))
 return <AppShell><div className="admin-head"><div><div className="eyebrow">ADMINISTRAÇÃO</div><h1>Avaliações</h1><p className="muted">Testes, critérios de aprovação, perguntas e resultados.</p></div></div><AdminNav/>
 <section className="section admin-grid"><div className="card"><h2>Novo teste</h2><form action={createQuiz}><label className="field">Módulo<select name="module_id">{(modules||[]).map((m:any)=><option value={m.id} key={m.id}>{cm.get(m.course_id)} · {m.title}</option>)}</select></label><label className="field">Título<input name="title" required/></label><label className="field">Aprovação mínima (%)<input type="number" name="pass_percentage" min={0} max={100} defaultValue={80}/></label><button className="btn">Criar teste</button></form></div>
 <div className="card"><div className="eyebrow">RESULTADOS</div><h2>Visão global</h2><div className="admin-stat-lines"><div><span>Tentativas</span><strong>{attempts?.length||0}</strong></div><div><span>Média global</span><strong>{attempts?.length?Math.round(attempts.reduce((s:any,x:any)=>s+Number(x.score),0)/attempts.length):0}%</strong></div><div><span>Testes</span><strong>{quizzes?.length||0}</strong></div></div></div></section>
 <section className="section card"><h2>Testes existentes</h2><div className="admin-edit-list">{(quizzes||[]).map((q:any)=>{const m:any=mm.get(q.module_id);const qs=(questions||[]).filter((x:any)=>x.quiz_id===q.id).length;const at=(attempts||[]).filter((x:any)=>x.quiz_id===q.id);return <details key={q.id}><summary><div><strong>{q.title}</strong><span>{cm.get(m?.course_id)} · {m?.title}</span></div><span className="badge">{qs} perguntas · {at.length} tentativas</span></summary><div className="details-body"><form action={updateQuiz} className="admin-edit-grid"><input type="hidden" name="id" value={q.id}/><label className="field">Título<input name="title" defaultValue={q.title}/></label><label className="field">Aprovação mínima<input name="pass_percentage" type="number" defaultValue={q.pass_percentage||80}/></label><button className="btn">Guardar</button></form><form action={addQuestion} className="question-form"><input type="hidden" name="quiz_id" value={q.id}/><h3>Adicionar pergunta</h3><label className="field">Pergunta<textarea name="question" rows={2} required/></label><label className="field">Explicação<textarea name="explanation" rows={2}/></label><div className="grid grid-3"><label className="field">Resposta A<input name="a" required/></label><label className="field">Resposta B<input name="b" required/></label><label className="field">Resposta C<input name="c"/></label></div><label className="field">Resposta correta<select name="correct"><option value="a">A</option><option value="b">B</option><option value="c">C</option></select></label><button className="btn secondary-outline">Adicionar pergunta</button></form></div></details>})}</div></section>
 </AppShell>
}
