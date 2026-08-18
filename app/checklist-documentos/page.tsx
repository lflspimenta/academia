import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {createClient} from '@/lib/supabase/server'
import DocumentChecklist from '@/components/DocumentChecklist'

export default async function Page(){
 const s=await createClient()
 const {data:course}=await s.from('courses').select('id').eq('slug','documentacao-imobiliaria-profissional').eq('status','published').maybeSingle()
 if(!course) redirect('/academia')
 const {data:allowed}=await s.rpc('has_course_access',{target_course_id:course.id})
 if(!allowed) redirect('/academia/documentacao-imobiliaria-profissional')
 const {data:rules}=await s.from('document_check_rules').select('*').eq('status','published').order('position')
 return <AppShell>
   <div className="topbar"><div>
     <div className="eyebrow">Ferramenta profissional</div>
     <h1>Que documentos preciso?</h1>
     <p className="muted">Checklist dinâmica por tipo de imóvel e operação.</p>
   </div><Link className="btn secondary-outline" href="/academia/documentacao-imobiliaria-profissional">Abrir especialização</Link></div>
   <DocumentChecklist rules={rules||[]}/>
 </AppShell>
}
