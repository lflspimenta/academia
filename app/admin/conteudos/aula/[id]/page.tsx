import AppShell from '@/components/AppShell'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect,notFound } from 'next/navigation'
import Link from 'next/link'
import { updateLessonBody } from '../../../actions'

export default async function EditLesson({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',user.id).single();if(p?.role!=='admin')redirect('/dashboard')
 const a=createAdminClient();const {data:l}=await a.from('lessons').select('id,title,content').eq('id',Number(id)).maybeSingle();if(!l)notFound()
 const content:any=l.content||{};const sections=Array.isArray(content.sections)?content.sections:[]
 return <AppShell><div className="lesson-breadcrumb"><Link href="/admin/conteudos">Conteúdos</Link><span>›</span><strong>{l.title}</strong></div><div className="admin-head"><div><div className="eyebrow">EDITOR DE AULA</div><h1>{l.title}</h1><p className="muted">Edite o conteúdo principal sem tocar no código.</p></div></div><AdminNav/>
 <section className="section card"><form action={updateLessonBody}><input type="hidden" name="id" value={l.id}/><label className="field">Introdução<textarea name="intro" rows={6} defaultValue={content.intro||''}/></label><div className="admin-grid"><div><label className="field">Secção 1 — título<input name="section1_title" defaultValue={sections[0]?.title||''}/></label><label className="field">Texto<textarea name="section1_body" rows={9} defaultValue={sections[0]?.body||''}/></label></div><div><label className="field">Secção 2 — título<input name="section2_title" defaultValue={sections[1]?.title||''}/></label><label className="field">Texto<textarea name="section2_body" rows={9} defaultValue={sections[1]?.body||''}/></label></div></div><label className="field">Conclusão / takeaway<textarea name="takeaway" rows={5} defaultValue={content.takeaway||''}/></label><button className="btn">Guardar conteúdo</button></form></section></AppShell>
}
