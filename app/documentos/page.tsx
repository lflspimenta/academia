import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'

type Rule = {
  id:number
  operation:string
  property_type:string
  situation:string
  title:string
  items:Array<{item:string;why?:string;document_slug?:string}>
  notes:string|null
  verified_at:string|null
  source_url:string|null
}

function valueOf(v:string|string[]|undefined, fallback:string){
  return Array.isArray(v)?(v[0]||fallback):(v||fallback)
}

export default async function Documentos({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams
  const supabase=await createClient()

  const {data:meta,error:metaError}=await supabase
    .from('document_checklist_rules')
    .select('operation,property_type,situation')
    .eq('status','published')
    .order('operation')
    .order('property_type')

  const operations=[...new Set((meta||[]).map(x=>x.operation))]
  const propertyTypes=[...new Set((meta||[]).map(x=>x.property_type))]
  const situations=[...new Set((meta||[]).map(x=>x.situation))]

  const operation=valueOf(params.operacao,operations[0]||'Venda')
  const propertyType=valueOf(params.imovel,propertyTypes[0]||'Apartamento')
  const situation=valueOf(params.situacao,'normal')
  const shouldGenerate=params.gerar==='1'

  let rule:Rule|null=null
  let fallbackUsed=false
  let loadError=''

  if(shouldGenerate){
    const exact=await supabase
      .from('document_checklist_rules')
      .select('*')
      .eq('status','published')
      .eq('operation',operation)
      .eq('property_type',propertyType)
      .eq('situation',situation)
      .maybeSingle()

    if(exact.error){loadError=exact.error.message}
    if(exact.data){rule=exact.data as Rule}

    if(!rule && situation!=='normal'){
      const base=await supabase
        .from('document_checklist_rules')
        .select('*')
        .eq('status','published')
        .eq('operation',operation)
        .eq('property_type',propertyType)
        .eq('situation','normal')
        .maybeSingle()
      if(base.data){rule=base.data as Rule;fallbackUsed=true}
      if(base.error&&!loadError){loadError=base.error.message}
    }
  }

  const labelSituation=(s:string)=>({normal:'Normal',heranca:'Herança',hipoteca:'Hipoteca',arrendado:'Arrendado'} as Record<string,string>)[s]||s

  return <AppShell>
    <div className="eyebrow">Ferramenta profissional</div>
    <h1>Que documentos preciso?</h1>
    <p className="muted">Escolha a operação, o tipo de imóvel e a situação. A checklist é gerada a partir das regras publicadas no Supabase.</p>

    {metaError&&<div className="error-note section">Não foi possível carregar as regras documentais: {metaError.message}</div>}

    <section className="section card">
      <form method="get" className="grid grid-3">
        <label className="field">Operação
          <select name="operacao" defaultValue={operation}>
            {(operations.length?operations:['Venda']).map(v=><option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label className="field">Tipo de imóvel
          <select name="imovel" defaultValue={propertyType}>
            {(propertyTypes.length?propertyTypes:['Apartamento','Moradia','Terreno']).map(v=><option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label className="field">Situação
          <select name="situacao" defaultValue={situation}>
            {(situations.length?situations:['normal','heranca','hipoteca']).map(v=><option key={v} value={v}>{labelSituation(v)}</option>)}
          </select>
        </label>
        <input type="hidden" name="gerar" value="1"/>
        <div className="form-end"><button className="btn" type="submit">Gerar checklist</button></div>
      </form>
    </section>

    {loadError&&<div className="error-note section">Erro ao gerar a checklist: {loadError}</div>}

    {shouldGenerate&&!rule&&!loadError&&<section className="section card empty-state">
      <div className="eyebrow">Ainda sem regra específica</div>
      <h2>Não existe uma checklist publicada para esta combinação.</h2>
      <p className="muted">Pode escolher outra situação ou criar uma nova regra no backoffice.</p>
    </section>}

    {rule&&<section className="section">
      <div className="topbar">
        <div>
          <div className="eyebrow">Checklist gerada</div>
          <h2>{rule.title}</h2>
          <p className="muted">{operation} · {propertyType} · {labelSituation(situation)}</p>
        </div>
        {rule.verified_at&&<span className="badge">Verificado em {new Date(rule.verified_at+'T00:00:00').toLocaleDateString('pt-PT')}</span>}
      </div>

      {fallbackUsed&&<div className="admin-note section">Ainda não existe uma regra específica para “{labelSituation(situation)}”. Está a ver a checklist base de {propertyType}. Confirme os elementos adicionais aplicáveis à situação concreta.</div>}

      <div className="document-results section">
        {(Array.isArray(rule.items)?rule.items:[]).map((it,index)=><article className="document-item" key={`${it.item}-${index}`}>
          <div className="document-number">{String(index+1).padStart(2,'0')}</div>
          <div className="document-main">
            <h3>{it.item}</h3>
            {it.why&&<p>{it.why}</p>}
            {it.document_slug
              ? <Link className="text-link" href={`/documentos/${it.document_slug}`}>Saber mais →</Link>
              : <span className="small muted">Ficha detalhada a adicionar à biblioteca.</span>}
          </div>
        </article>)}
      </div>

      {rule.notes&&<div className="takeaway"><strong>Nota de utilização</strong><p>{rule.notes}</p></div>}

      <div className="document-footer-meta">
        <div><strong>Regra:</strong> esta checklist é um guia operacional. A situação concreta pode exigir documentação adicional.</div>
        {rule.source_url&&<a href={rule.source_url} target="_blank" rel="noreferrer">Consultar fonte oficial →</a>}
      </div>
    </section>}

    <section className="section card">
      <div className="topbar"><div><div className="eyebrow">Biblioteca</div><h2>Documentos essenciais</h2></div></div>
      <p className="muted">As fichas explicam onde obter cada documento, o que verificar e quais os sinais que justificam análise adicional.</p>
      <Link className="text-link" href="/documentos/certidao-permanente-registo-predial">Abrir exemplo de ficha →</Link>
    </section>
  </AppShell>
}
