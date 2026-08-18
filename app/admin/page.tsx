import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, BookOpen, CircleHelp, Award, AlertTriangle, ArrowRight } from 'lucide-react'

export default async function Admin(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient()
 const [{count:users},{count:courses},{count:lessons},{count:attempts},{count:certs},{count:review}]=await Promise.all([
   a.from('profiles').select('*',{count:'exact',head:true}),
   a.from('courses').select('*',{count:'exact',head:true}).eq('status','published'),
   a.from('lessons').select('*',{count:'exact',head:true}).eq('status','published'),
   a.from('quiz_attempts').select('*',{count:'exact',head:true}),
   a.from('certificates').select('*',{count:'exact',head:true}).eq('status','valid'),
   a.from('lessons').select('*',{count:'exact',head:true}).eq('legal_sensitive',true).is('verified_at',null)
 ])
 const {data:recentCerts}=await a.from('certificates').select('id,code,user_id,course_id,issued_at,status').order('issued_at',{ascending:false}).limit(5)
 const {data:profiles}=await a.from('profiles').select('id,full_name')
 const {data:courseRows}=await a.from('courses').select('id,title')
 const pm=new Map((profiles||[]).map((x:any)=>[x.id,x.full_name]))
 const cm=new Map((courseRows||[]).map((x:any)=>[x.id,x.title]))
 return <AppShell><div className="admin-head"><div><div className="eyebrow">BACKOFFICE</div><h1>Administração</h1><p className="muted">Gerir a Academia sem entrar na infraestrutura técnica.</p></div><span className="badge">Administrador</span></div>
 <AdminNav/>
 <section className="section admin-metric-grid">
   <Link href="/admin/utilizadores" className="admin-metric"><Users/><span>Utilizadores</span><strong>{users||0}</strong><small>Contas registadas</small></Link>
   <Link href="/admin/conteudos" className="admin-metric"><BookOpen/><span>Formações</span><strong>{courses||0}</strong><small>{lessons||0} aulas publicadas</small></Link>
   <Link href="/admin/avaliacoes" className="admin-metric"><CircleHelp/><span>Avaliações</span><strong>{attempts||0}</strong><small>Tentativas realizadas</small></Link>
   <Link href="/admin/certificados" className="admin-metric"><Award/><span>Certificados</span><strong>{certs||0}</strong><small>Certificados válidos</small></Link>
 </section>
 {Number(review)>0&&<Link href="/admin/conteudos?review=1" className="admin-review-banner"><AlertTriangle size={19}/><div><strong>{review} aula(s) jurídica(s) necessitam revisão</strong><span>Atualize a fonte/data antes de voltar a considerar o conteúdo verificado.</span></div><ArrowRight size={18}/></Link>}
 <section className="section admin-home-grid"><div className="card"><div className="section-heading"><div><div className="eyebrow">CERTIFICAÇÃO</div><h2>Últimos certificados</h2></div><Link className="quiet-link" href="/admin/certificados">Ver todos <ArrowRight size={14}/></Link></div>
   <div className="compact-admin-list">{(recentCerts||[]).map((c:any)=><div key={c.id}><div><strong>{pm.get(c.user_id)||'Formando'}</strong><span>{cm.get(c.course_id)||'Formação'} · {c.code}</span></div><span className={c.status==='valid'?'badge':'badge badge-danger'}>{c.status==='valid'?'Válido':'Invalidado'}</span></div>)}{!recentCerts?.length&&<p className="muted">Ainda não existem certificados emitidos.</p>}</div>
 </div>
 <div className="card"><div className="eyebrow">ACESSOS RÁPIDOS</div><h2>Operação diária</h2><div className="admin-shortcuts"><Link href="/admin/utilizadores">Criar ou gerir formando <ArrowRight size={15}/></Link><Link href="/admin/conteudos">Atualizar aulas e formações <ArrowRight size={15}/></Link><Link href="/admin/avaliacoes">Gerir testes <ArrowRight size={15}/></Link><Link href="/admin/radar">Publicar atualização legislativa <ArrowRight size={15}/></Link></div></div></section>
 </AppShell>
}
