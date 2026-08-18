import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'
import { ArrowRight, LockKeyhole, Check, Map, Building2, ClipboardCheck, GraduationCap } from 'lucide-react'

const tool:any={
 'terrenos':['Analisar Terreno',Map],
 'urbanismo-pratico':['Alterar Uso do Imóvel',Building2],
 'documentacao-imobiliaria':['Checklist documental',ClipboardCheck]
}
export default async function Academia(){
 const {supabase,isAdmin,accessIds}=await accessContext()
 const {data:courses}=await supabase.from('courses').select('id,title,slug,description,level,position').eq('status','published').order('position')
 return <AppShell><header className="welcome-head"><div><div className="eyebrow">ACADEMIA</div><h1>Formação para cada fase da carreira.</h1><p className="muted">Comece pelos fundamentos e acrescente especializações quando fizerem sentido para o seu percurso.</p></div></header>
 <section className="section academy-grid">{(courses||[]).map((c:any)=>{const unlocked=isAdmin||accessIds.has(Number(c.id));const t=tool[c.slug];const Icon=t?.[1]||GraduationCap;return unlocked?
 <Link className="academy-card owned" href={`/academia/${c.slug}`} key={c.id}><div className="academy-card-icon"><Icon size={20}/></div><div className="course-card-top"><span className="badge">{c.level}</span><span className="access-ok"><Check size={13}/> Na sua conta</span></div><h2>{c.title}</h2><p>{c.description}</p>{t&&<div className="included-tool">Inclui ferramenta · {t[0]}</div>}<div className="academy-card-foot"><span>Abrir formação</span><ArrowRight size={17}/></div></Link>
 :<Link className="academy-card locked" href={`/academia/${c.slug}`} key={c.id}><div className="academy-card-icon lock"><LockKeyhole size={20}/></div><div className="course-card-top"><span className="badge">{c.level}</span><span className="lock-pill">Especialização</span></div><h2>{c.title}</h2><p>{c.description}</p>{t&&<div className="included-tool">Inclui ferramenta · {t[0]}</div>}<div className="academy-card-foot"><span>Conhecer formação</span><ArrowRight size={17}/></div></Link>})}</section></AppShell>
}
