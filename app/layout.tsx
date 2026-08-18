import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata={title:'Academia Imobiliária',description:'Formação profissional imobiliária em Portugal'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt"><body>{children}</body></html>}
