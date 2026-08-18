import
          <Link href="/checklist-documentos">Que documentos preciso?</Link> Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
const baseNav=[['/dashboard','Início'],['/academia','Academia'],['/documentos','Documentos'],['/radar','Radar legislativo'],['/terrenos','Analisar Terreno'],['/alteracao-uso','Alterar Uso do Imóvel']]
export default async function AppShell({children}:{children:React.ReactNode}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();let isAdmin=false;if(user){const {data:p}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();isAdmin=p?.role==='admin'}
 const nav=isAdmin?[...baseNav,['/admin','Administração']]:baseNav
 return <div className="app-shell"><aside className="sidebar"><div className="brand-kicker">Academia</div><div className="brand-title">Imobiliária</div><div className="brand-sub">Formação profissional · Portugal</div><nav className="nav">{nav.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</nav><div style={{marginTop:34,fontSize:12,opacity:.55}}>Conteúdo legal com data de verificação e fonte oficial.</div></aside><main className="content">{children}</main></div>
}
