import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAppUser,changeUserRole,toggleUserBlocked,sendUserRecovery } from '../actions'

export default async function UsersAdmin({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const params=await searchParams
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/login')
  const {data:p}=await supabase.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
  const admin=createAdminClient()
  const {data:{users}}=await admin.auth.admin.listUsers({page:1,perPage:200})
  const {data:profiles}=await admin.from('profiles').select('id,full_name,role,created_at')
  const profileMap=new Map((profiles||[]).map((x:any)=>[x.id,x]))
  const rows=(users||[]).map(u=>({
    id:u.id,email:u.email||'—',created_at:u.created_at,
    banned:!!u.banned_until && new Date(u.banned_until).getTime()>Date.now(),
    ...(profileMap.get(u.id)||{full_name:'',role:'student'})
  })).sort((a:any,b:any)=>String(a.full_name||a.email).localeCompare(String(b.full_name||b.email),'pt'))

  return <AppShell>
    <div className="lesson-breadcrumb"><Link href="/admin">Administração</Link><span>›</span><strong>Utilizadores</strong></div>
    <div className="topbar"><div><div className="eyebrow">Administração</div><h1>Utilizadores</h1><p className="muted">Criar contas, alterar perfil, bloquear acesso e enviar recuperação de password.</p></div><span className="badge">{rows.length} contas</span></div>
    {params.created&&<div className="success-note section">Utilizador criado. Entregue-lhe o email e a password temporária.</div>}
    {params.recovery&&<div className="success-note section">Email de recuperação solicitado.</div>}
    {params.error&&<div className="error-note section">{params.error}</div>}

    <section className="section card"><h2>Criar utilizador</h2><p className="muted small">A password temporária deve ter pelo menos 8 caracteres. O utilizador pode depois usar “Esqueceu-se da password?” para escolher uma nova.</p>
      <form action={createAppUser} className="user-create-grid">
        <label className="field">Nome<input name="full_name" required/></label>
        <label className="field">Email<input name="email" type="email" required/></label>
        <label className="field">Password temporária<input name="password" type="password" minLength={8} required/></label>
        <label className="field">Perfil<select name="role" defaultValue="student"><option value="student">Aluno</option><option value="admin">Administrador</option></select></label>
        <div className="form-end"><button className="btn" type="submit">Criar utilizador</button></div>
      </form>
    </section>

    <section className="section card"><div className="topbar"><div><h2>Contas existentes</h2><p className="muted small">A sua própria conta não pode ser bloqueada ou despromovida neste ecrã.</p></div></div>
      <div className="table-scroll"><table className="table"><thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Estado</th><th>Ações</th></tr></thead><tbody>
        {rows.map((r:any)=><tr key={r.id}><td><strong>{r.full_name||'Sem nome'}</strong>{r.id===user.id&&<div className="small muted">A sua conta</div>}</td><td>{r.email}</td><td>
          {r.id===user.id?<span className="badge">{r.role==='admin'?'Administrador':'Aluno'}</span>:<form action={changeUserRole} className="inline-form"><input type="hidden" name="id" value={r.id}/><select name="role" defaultValue={r.role} aria-label={`Perfil de ${r.email}`}><option value="student">Aluno</option><option value="admin">Administrador</option></select><button className="text-button" type="submit">Guardar</button></form>}
        </td><td><span className={r.banned?'badge badge-danger':'badge'}>{r.banned?'Bloqueado':'Ativo'}</span></td><td><div className="actions-inline">
          <form action={sendUserRecovery}><input type="hidden" name="email" value={r.email}/><button className="text-button" type="submit">Recuperar password</button></form>
          {r.id!==user.id&&<form action={toggleUserBlocked}><input type="hidden" name="id" value={r.id}/><input type="hidden" name="blocked" value={String(r.banned)}/><button className="text-button" type="submit">{r.banned?'Reativar':'Bloquear'}</button></form>}
        </div></td></tr>)}
      </tbody></table></div>
    </section>
  </AppShell>
}
