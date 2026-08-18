import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revokeCertificate,restoreCertificate } from '../actions'

export default async function CertificatesAdmin(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient()
 const [{data:certs},{data:profiles},{data:courses}]=await Promise.all([
   a.from('certificates').select('*').order('issued_at',{ascending:false}),
   a.from('profiles').select('id,full_name'),
   a.from('courses').select('id,title')
 ])
 const pm=new Map((profiles||[]).map((x:any)=>[x.id,x.full_name]));const cm=new Map((courses||[]).map((x:any)=>[x.id,x.title]))
 return <AppShell><div className="admin-head"><div><div className="eyebrow">ADMINISTRAÇÃO</div><h1>Certificados</h1><p className="muted">Consultar, validar e invalidar credenciais emitidas.</p></div><span className="badge">{certs?.length||0} emitidos</span></div><AdminNav/>
 <section className="section card"><div className="table-scroll"><table className="table"><thead><tr><th>Formando</th><th>Formação</th><th>Código</th><th>Emissão</th><th>Estado</th><th>Ações</th></tr></thead><tbody>{(certs||[]).map((c:any)=><tr key={c.id}><td><strong>{pm.get(c.user_id)||'Formando'}</strong></td><td>{cm.get(c.course_id)||'Formação'}</td><td><Link className="text-link" href={`/certificado/${c.code}`}>{c.code}</Link></td><td>{new Date(c.issued_at).toLocaleDateString('pt-PT')}</td><td><span className={c.status==='valid'?'badge':'badge badge-danger'}>{c.status==='valid'?'Válido':'Invalidado'}</span>{c.revoked_reason&&<div className="small muted">{c.revoked_reason}</div>}</td><td>{c.status==='valid'?<form action={revokeCertificate} className="inline-form"><input type="hidden" name="id" value={c.id}/><input name="reason" placeholder="Motivo" required/><button className="text-button">Invalidar</button></form>:<form action={restoreCertificate}><input type="hidden" name="id" value={c.id}/><button className="text-button">Reativar</button></form>}</td></tr>)}</tbody></table></div></section>
 </AppShell>
}
