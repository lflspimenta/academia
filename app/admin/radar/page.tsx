import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { createRadarUpdate,togglePublish,updateRadarItem } from '../actions'

export default async function RadarAdmin(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient();const {data:updates}=await a.from('legislative_updates').select('*').order('created_at',{ascending:false})
 return <AppShell><div className="admin-head"><div><div className="eyebrow">ADMINISTRAÇÃO</div><h1>Radar Legislativo</h1><p className="muted">Criar, atualizar, verificar e publicar alterações relevantes.</p></div></div><AdminNav/>
 <section className="section card"><h2>Nova atualização</h2><form action={createRadarUpdate} className="admin-edit-grid"><label className="field">Título<input name="title" required/></label><label className="field">Tema<input name="topic" required/></label><label className="field wide">Resumo<textarea name="summary" rows={3} required/></label><label className="field wide">Impacto<textarea name="impact" rows={3}/></label><label className="field wide">Fonte oficial<input name="source_url" type="url" required/></label><button className="btn">Guardar como rascunho</button></form></section>
 <section className="section card"><h2>Atualizações</h2><div className="admin-edit-list">{(updates||[]).map((u:any)=><details key={u.id}><summary><div><strong>{u.title}</strong><span>{u.topic} · verificado {u.verified_at}</span></div><span className="badge">{u.status}</span></summary><div className="details-body"><form action={updateRadarItem} className="admin-edit-grid"><input type="hidden" name="id" value={u.id}/><label className="field">Título<input name="title" defaultValue={u.title}/></label><label className="field">Tema<input name="topic" defaultValue={u.topic}/></label><label className="field wide">Resumo<textarea name="summary" rows={3} defaultValue={u.summary}/></label><label className="field wide">Impacto<textarea name="impact" rows={3} defaultValue={u.impact||''}/></label><label className="field wide">Fonte<input name="source_url" type="url" defaultValue={u.source_url}/></label><label className="field">Verificado em<input name="verified_at" type="date" defaultValue={u.verified_at}/></label><button className="btn">Guardar</button></form><form action={togglePublish}><input type="hidden" name="table" value="legislative_updates"/><input type="hidden" name="id" value={u.id}/><input type="hidden" name="status" value={u.status}/><button className="text-button">{u.status==='published'?'Despublicar':'Publicar'}</button></form></div></details>)}</div></section>
 </AppShell>
}
