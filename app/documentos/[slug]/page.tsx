import Link from 'next/link'
import { notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'

type Doc = {
  title:string
  category:string|null
  description:string|null
  source_url:string|null
  where_to_get:string|null
  what_to_check:string[]|null
  alerts:string[]|null
  professional_note:string|null
  verified_at:string|null
}

export default async function DocumentoFicha({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const supabase=await createClient()
  const {data,error}=await supabase
    .from('documents')
    .select('title,category,description,source_url,where_to_get,what_to_check,alerts,professional_note,verified_at')
    .eq('slug',slug)
    .eq('status','published')
    .maybeSingle()

  if(error||!data) notFound()
  const doc=data as Doc

  return <AppShell>
    <div className="back-row"><Link className="back-link" href="/documentos">← Voltar aos documentos</Link></div>
    <div className="reading">
      <div className="eyebrow">{doc.category||'Biblioteca documental'}</div>
      <h1>{doc.title}</h1>
      {doc.verified_at&&<div style={{marginTop:14}}><span className="badge">Verificado em {new Date(doc.verified_at+'T00:00:00').toLocaleDateString('pt-PT')}</span></div>}
      {doc.description&&<p className="lead">{doc.description}</p>}

      {doc.where_to_get&&<section className="reading-section"><h2>Onde obter</h2><p>{doc.where_to_get}</p></section>}

      {Array.isArray(doc.what_to_check)&&doc.what_to_check.length>0&&<section className="reading-section">
        <h2>O que verificar</h2>
        <div className="checklist-plain">{doc.what_to_check.map((x,i)=><div key={i}><span>✓</span><p>{x}</p></div>)}</div>
      </section>}

      {Array.isArray(doc.alerts)&&doc.alerts.length>0&&<section className="reading-section">
        <h2>Sinais de alerta</h2>
        <div className="alert-list">{doc.alerts.map((x,i)=><div key={i}><span>!</span><p>{x}</p></div>)}</div>
      </section>}

      {doc.professional_note&&<div className="takeaway"><strong>Quando encaminhar</strong><p>{doc.professional_note}</p></div>}

      {doc.source_url&&<div className="legal-source"><strong>Fonte oficial</strong><p>Consulte sempre a fonte atual antes de usar esta informação numa situação concreta.</p><a href={doc.source_url} target="_blank" rel="noreferrer">Abrir fonte oficial →</a></div>}
    </div>
  </AppShell>
}
