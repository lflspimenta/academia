import Link from 'next/link'
import { accessContext } from '@/lib/access'
import { signOutAction } from '@/app/auth/signout/actions'

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const {isAdmin,accessIds,supabase}=await accessContext()
  const {data:courses}=await supabase.from('courses').select('id,slug').eq('status','published')
  const idBySlug=new Map((courses||[]).map((c:any)=>[c.slug,Number(c.id)]))
  const can=(slug:string)=>isAdmin||accessIds.has(idBySlug.get(slug)||-1)

  const nav:any[]=[
    ['/dashboard','Início'],
    ['/academia','Academia'],
    ['/documentos','Documentos'],
    ['/radar','Radar legislativo'],
  ]
  if(can('terrenos')) nav.push(['/terrenos','Analisar Terreno'])
  if(can('urbanismo-pratico')) nav.push(['/alteracao-uso','Alterar Uso do Imóvel'])
  if(can('documentacao-imobiliaria')) nav.push(['/checklist-documentos','Que documentos preciso?'])
  if(isAdmin) nav.push(['/admin','Administração'])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-kicker">Academia</div>
      <div className="brand-title">Imobiliária</div>
      <div className="brand-sub">Formação profissional · Portugal</div>
      <nav className="nav">{nav.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="sidebar-bottom">
        <div className="sidebar-legal-note">Conteúdo legal com data de verificação e fonte oficial.</div>
        <form action={signOutAction}><button className="logout-button" type="submit">Terminar sessão</button></form>
      </div>
    </aside>
    <main className="content">{children}</main>
  </div>
}
