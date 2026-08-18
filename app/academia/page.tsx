import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'

export default async function Academia(){
 const {supabase,isAdmin,accessIds}=await accessContext()
 const {data:courses}=await supabase.from('courses').select('id,title,slug,description,level,position').eq('status','published').order('position')

 return <AppShell>
   <div className="eyebrow">Formação profissional</div>
   <h1>Academia</h1>
   <p className="muted">Comece pelo percurso de iniciação e acrescente especializações à medida que evolui.</p>

   <section className="section list">
     {(courses||[]).map((c:any)=>{
       const unlocked=isAdmin||accessIds.has(Number(c.id))
       return unlocked
         ? <Link className="lesson course-link" href={`/academia/${c.slug}`} key={c.id}>
             <div className="course-card-top"><span className="badge">{c.level}</span><span className="access-ok">Acesso ativo</span></div>
             <h2 style={{marginTop:10}}>{c.title}</h2>
             <p className="muted">{c.description}</p>
             <div className="link-arrow">Abrir formação →</div>
           </Link>
         : <div className="lesson course-link course-locked" key={c.id}>
             <div className="course-card-top"><span className="badge">{c.level}</span><span className="lock-pill">🔒 Acesso separado</span></div>
             <h2 style={{marginTop:10}}>{c.title}</h2>
             <p className="muted">{c.description}</p>
             <Link className="btn secondary-outline" href={`/academia/${c.slug}`}>Conhecer formação</Link>
           </div>
     })}
   </section>
 </AppShell>
}
