import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/auth/signout/actions'

const baseNav = [
  ['/dashboard', 'Início'],
  ['/academia', 'Academia'],
  ['/documentos', 'Documentos'],
  ['/radar', 'Radar legislativo'],
  ['/terrenos', 'Analisar Terreno'],
  ['/alteracao-uso', 'Alterar Uso do Imóvel'],
  ['/checklist-documentos', 'Que documentos preciso?'],
]

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    isAdmin = profile?.role === 'admin'
  }

  const nav = isAdmin ? [...baseNav, ['/admin', 'Administração']] : baseNav

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-kicker">Academia</div>
        <div className="brand-title">Imobiliária</div>
        <div className="brand-sub">Formação profissional · Portugal</div>

        <nav className="nav">
          {nav.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-legal-note">
            Conteúdo legal com data de verificação e fonte oficial.
          </div>
          <form action={signOutAction}>
            <button className="logout-button" type="submit">Terminar sessão</button>
          </form>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  )
}
