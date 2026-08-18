import Link from 'next/link'
import { LayoutDashboard, Users, BookOpen, CircleHelp, Award, Scale } from 'lucide-react'

const items=[
 ['/admin','Visão geral',LayoutDashboard],
 ['/admin/utilizadores','Utilizadores',Users],
 ['/admin/conteudos','Conteúdos',BookOpen],
 ['/admin/avaliacoes','Avaliações',CircleHelp],
 ['/admin/certificados','Certificados',Award],
 ['/admin/radar','Radar Legislativo',Scale],
] as const

export default function AdminNav(){
 return <nav className="admin-tabs">
  {items.map(([href,label,Icon])=><Link key={href} href={href}><Icon size={15}/><span>{label}</span></Link>)}
 </nav>
}
