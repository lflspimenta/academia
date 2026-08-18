import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Academia(){
 const supabase=await createClient()
 const {data:courses}=await supabase.from('courses').select('id,title,slug,description,level,position').eq('status','published').order('position')
 return <AppShell><div className="eyebrow">Formação profissional</div><h1>Academia</h1><p className="muted">Percurso recomendado e especializações para desenvolver competências práticas no setor imobiliário.</p><section className="section list">{(courses||[]).map((c:any)=><Link className="lesson course-link" href={`/academia/${c.slug}`} key={c.id}><span className="badge">{c.level}</span><h2 style={{marginTop:10}}>{c.title}</h2><p className="muted">{c.description}</p><div className="link-arrow">Abrir percurso →</div></Link>)}</section></AppShell>
}
