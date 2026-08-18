'use client'
import { useState } from 'react'
import { ChevronLeft,ChevronRight,ClipboardCheck } from 'lucide-react'
import { savePropertyAnalysis } from '@/app/analisar-imovel/actions'

const YNU=({name,required=false}:{name:string,required?:boolean})=><select name={name} required={required} defaultValue=""><option value="" disabled>Selecionar</option><option value="yes">Sim</option><option value="no">Não</option><option value="unknown">Não sei / por confirmar</option></select>
const steps=['Imóvel','Titularidade','Documentação','Urbanismo','Situação','Confirmar']

export default function PropertyAnalysisForm(){
 const [step,setStep]=useState(0)
 return <form action={savePropertyAnalysis} className="analysis-form">
  <div className="analysis-stepper">{steps.map((s,i)=><div key={s} className={i===step?'active':i<step?'done':''}><i>{i+1}</i><span>{s}</span></div>)}</div>

  <div className={step===0?'analysis-panel':'analysis-panel hidden'}>
   <div className="eyebrow">PASSO 1 DE 6</div><h2>Identificação do imóvel</h2><p className="muted">Comece pelos elementos essenciais da angariação.</p>
   <div className="analysis-fields"><label className="field wide">Nome da análise<input name="title" placeholder="Ex.: Apartamento Matosinhos · Cliente Silva" required/></label>
   <label className="field">Município<input name="municipality" placeholder="Ex.: Matosinhos"/></label>
   <label className="field">Tipo de imóvel<select name="property_type" required defaultValue=""><option value="" disabled>Selecionar</option><option value="house">Moradia</option><option value="apartment">Apartamento</option><option value="shop">Loja / comércio</option><option value="office">Escritório / serviços</option><option value="land">Terreno</option><option value="warehouse">Armazém / industrial</option><option value="other">Outro</option></select></label>
   <label className="field">Objetivo<select name="purpose" defaultValue="sale"><option value="sale">Venda</option><option value="rent">Arrendamento</option><option value="purchase">Apoio à compra</option></select></label>
   <label className="field">Existe componente de terreno?<YNU name="is_land"/></label></div>
  </div>

  <div className={step===1?'analysis-panel':'analysis-panel hidden'}>
   <div className="eyebrow">PASSO 2 DE 6</div><h2>Titularidade</h2><p className="muted">Confirme quem pode efetivamente contratar e transmitir.</p>
   <div className="analysis-fields"><label className="field">Titularidade confirmada?<YNU name="ownership_confirmed"/></label><label className="field">Existem vários proprietários?<YNU name="multiple_owners"/></label><label className="field">Existe herança envolvida?<YNU name="inheritance"/></label><label className="field">Existe hipoteca?<YNU name="mortgage"/></label><label className="field">Existe penhora?<YNU name="seizure"/></label><label className="field">Outros ónus/encargos?<YNU name="other_encumbrance"/></label></div>
  </div>

  <div className={step===2?'analysis-panel':'analysis-panel hidden'}>
   <div className="eyebrow">PASSO 3 DE 6</div><h2>Documentação</h2><p className="muted">Indique o que já foi efetivamente conferido.</p>
   <div className="analysis-fields"><label className="field">Certidão predial atualizada?<YNU name="registry"/></label><label className="field">Caderneta predial?<YNU name="tax_record"/></label><label className="field">Divergência de áreas?<YNU name="area_mismatch"/></label><label className="field">Elementos do condomínio?<YNU name="condominium_docs"/></label><label className="field">Certificado energético?<YNU name="energy_certificate"/></label><label className="field">Faltam documentos relevantes?<YNU name="documents_missing"/></label></div>
  </div>

  <div className={step===3?'analysis-panel':'analysis-panel hidden'}>
   <div className="eyebrow">PASSO 4 DE 6</div><h2>Urbanismo e utilização</h2><p className="muted">Não presuma regularidade: assinale apenas o que consegue confirmar.</p>
   <div className="analysis-fields"><label className="field">Licenciamento/utilização confirmado?<YNU name="license"/></label><label className="field">Uso real diverge do autorizado?<YNU name="use_mismatch"/></label><label className="field">Existem obras/alterações por regularizar?<YNU name="illegal_works"/></label><label className="field">Acesso ao imóvel confirmado?<YNU name="access_confirmed"/></label></div>
  </div>

  <div className={step===4?'analysis-panel':'analysis-panel hidden'}>
   <div className="eyebrow">PASSO 5 DE 6</div><h2>Situação da operação</h2><p className="muted">Algumas circunstâncias exigem verificações adicionais.</p>
   <div className="analysis-fields"><label className="field">Imóvel ocupado?<YNU name="occupied"/></label><label className="field">Pode existir direito de preferência?<YNU name="preemption"/></label><label className="field">O cliente quer avançar com urgência?<YNU name="client_urgent"/></label></div>
  </div>

  <div className={step===5?'analysis-panel':'analysis-panel hidden'}>
   <div className="analysis-confirm"><ClipboardCheck size={38}/><div className="eyebrow">PASSO 6 DE 6</div><h2>Gerar Due Diligence da Angariação</h2><p>As respostas serão transformadas numa análise estruturada com alertas, documentação em falta, próximos passos e encaminhamento para as ferramentas adequadas.</p><div className="analysis-disclaimer">A ferramenta apoia a organização da due diligence. Não substitui a consulta dos documentos, das fontes oficiais nem aconselhamento jurídico/técnico quando necessário.</div></div>
  </div>

  <div className="analysis-nav">{step>0?<button type="button" className="btn secondary-outline" onClick={()=>setStep(x=>x-1)}><ChevronLeft size={16}/> Anterior</button>:<span/>}{step<5?<button type="button" className="btn" onClick={()=>setStep(x=>x+1)}>Continuar <ChevronRight size={16}/></button>:<button className="btn">Gerar análise</button>}</div>
 </form>
}
