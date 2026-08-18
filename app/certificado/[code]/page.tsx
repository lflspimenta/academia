import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import CertificateActions from '@/components/CertificateActions'

export default async function Certificate({params}:{params:Promise<{code:string}>}){
 const {code}=await params
 const s=await createClient()
 const {data:c}=await s.from('valid_certificates').select('*').eq('code',code).maybeSingle()
 if(!c)notFound()
 const hours=Math.round((Number(c.total_minutes||0)/60)*10)/10
 return <main className="public-certificate">
   <CertificateActions code={c.code}/>
   <section className="certificate-sheet">
     <div className="certificate-brand">
       <div className="certificate-brand-mark">AI</div>
       <div><strong>Academia Imobiliária</strong><span>Formação profissional · Portugal</span></div>
     </div>
     <div className="certificate-seal"><BadgeCheck size={30}/></div>
     <div className="eyebrow">CERTIFICADO DE CONCLUSÃO</div>
     <h1>{c.course_title}</h1>
     <p className="certificate-intro">Certifica-se que</p>
     <h2>{c.full_name||'Formando'}</h2>
     <p>concluiu com aproveitamento a formação indicada, cumprindo a totalidade das aulas e os critérios de avaliação definidos pela Academia.</p>
     <div className="certificate-data">
       <div><span>Resultado</span><strong>{Math.round(Number(c.final_score||0))}%</strong></div>
       <div><span>Carga horária</span><strong>{hours} h</strong></div>
       <div><span>Emissão</span><strong>{new Date(c.issued_at).toLocaleDateString('pt-PT')}</strong></div>
     </div>
     <div className="certificate-code"><span>Código de validação</span><strong>{c.code}</strong><small>Certificado válido</small></div>
     <CertificateActions code={c.code}/>
   </section>
 </main>
}
