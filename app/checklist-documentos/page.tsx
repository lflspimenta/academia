import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import {createClient} from '@/lib/supabase/server'
import DocumentChecklist from '@/components/DocumentChecklist'
export default async function Page(){const s=await createClient();const {data:rules}=await s.from('document_check_rules').select('*').eq('status','published').order('position');return <AppShell><div className="topbar"><div><div className="eyebrow">Ferramenta profissional</div><h1>Que documentos preciso?</h1><p className="muted">Checklist dinâmica por tipo de imóvel e operação.</p></div></div><DocumentChecklist rules={rules||[]}/></AppShell>}
