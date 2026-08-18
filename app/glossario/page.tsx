import AppShell from '@/components/AppShell'
import ProfessionalGlossary from '@/components/ProfessionalGlossary'
import {createClient} from '@/lib/supabase/server'
import {redirect} from 'next/navigation'
import {BookOpen,Languages,Search} from 'lucide-react'
export default async function Page(){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:items}=await s.from('real_estate_glossary').select('id,term,full_name,category,language,definition,portugal_usage,caution,related_terms').eq('status','published').order('term')
 return <AppShell><div className="tool-hero glossary-hero"><div><div className="eyebrow">BIBLIOTECA PROFISSIONAL</div><h1>Glossário Profissional</h1><p>A linguagem do imobiliário em Portugal — termos portugueses, siglas e expressões internacionais usadas no mercado.</p></div><BookOpen size={44}/></div>
 <section className="section glossary-intro"><div><Search/><strong>Consulta rápida</strong><span>Pesquise por termo, sigla ou significado.</span></div><div><Languages/><strong>PT + internacional</strong><span>Equivalentes portugueses e nomes estrangeiros usados no setor.</span></div></section>
 <section className="section card"><ProfessionalGlossary items={items||[]}/></section>
 <div className="glossary-note">Conteúdo de apoio profissional. Em matérias jurídicas, fiscais, urbanísticas e financeiras, confirme o enquadramento e a legislação aplicável ao caso concreto.</div></AppShell>
}