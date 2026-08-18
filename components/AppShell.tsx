import Link from 'next/link'
import { accessContext } from '@/lib/access'
import { signOutAction } from '@/app/auth/signout/actions'
import { Home, GraduationCap, ChartNoAxesColumnIncreasing, FolderOpen, Scale, Map as MapIcon, Building2, ClipboardCheck, ShieldCheck, LogOut, type LucideIcon } from 'lucide-react'

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const {isAdmin,accessIds,supabase}=await accessContext()
  const {data:courses}=await supabase.from('courses').select('id,slug').eq('status','published')
  const idBySlug=new globalThis.Map<string, number>((courses||[]).map((c:any)=>[String(c.slug),Number(c.id)]))
  const can=(slug:string)=>isAdmin||accessIds.has(idBySlug.get(slug)||-1)

  type NavItem=[string,string,LucideIcon]
  const main:NavItem[]=[
    ['/dashboard','Início',Home],
    ['/academia','Academia',GraduationCap],
    ['/progresso','O meu progresso',ChartNoAxesColumnIncreasing],
    ['/documentos','Biblioteca',FolderOpen],
    ['/radar','Radar legislativo',Scale],
  ]
  const tools:NavItem[]=[]
  if(can('terrenos')) tools.push(['/terrenos','Analisar Terreno',MapIcon])
  if(can('urbanismo-pratico')) tools.push(['/alteracao-uso','Alterar Uso',Building2])
  if(can('documentacao-imobiliaria')) tools.push(['/checklist-documentos','Checklist documental',ClipboardCheck])

  const nav=(items:NavItem[])=>items.map(([href,label,Icon])=><Link key={href} href={href}><Icon size={17}/><span>{label}</span></Link>)

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-mark"><div className="brand-monogram">AI</div><div><div className="brand-title">Academia Imobiliária</div><div className="brand-sub">Formação profissional · Portugal</div></div></div>
      <div className="nav-label">Aprender</div><nav className="nav">{nav(main)}</nav>
      {tools.length>0&&<><div className="nav-label nav-label-tools">Ferramentas</div><nav className="nav nav-tools">{nav(tools)}</nav></>}
      {isAdmin&&<><div className="nav-label nav-label-tools">Gestão</div><nav className="nav"><Link href="/admin"><ShieldCheck size={17}/><span>Administração</span></Link></nav></>}
      <div className="sidebar-bottom">
        <div className="sidebar-legal-note">Conteúdos profissionais com fontes e datas de verificação.</div>
        <form action={signOutAction}><button className="logout-button" type="submit"><LogOut size={16}/><span>Terminar sessão</span></button></form>
      </div>
    </aside>
    <main className="content">{children}</main>
  </div>
}
