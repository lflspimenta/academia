export type Answers=Record<string,string|boolean|number|null|undefined>
export type Finding={level:'ok'|'warning'|'critical',title:string,detail:string,action?:string}
export type AnalysisResult={
 score:number,risk:'low'|'medium'|'high',
 findings:Finding[],missing:string[],nextSteps:string[],
 routes:{href:string;label:string;reason:string}[]
}
const yes=(v:any)=>v==='yes'||v===true
const no=(v:any)=>v==='no'||v===false
const unknown=(v:any)=>!v||v==='unknown'

export function analyseProperty(a:Answers):AnalysisResult{
 const f:Finding[]=[];const missing:string[]=[];const next:string[]=[];const routes:any[]=[]
 const add=(level:Finding['level'],title:string,detail:string,action?:string)=>f.push({level,title,detail,action})

 if(yes(a.is_land)){
   add('warning','Imóvel com componente de terreno','O potencial construtivo não deve ser presumido apenas pela área ou localização.','Confirmar PDM, condicionantes, infraestruturas e, quando adequado, PIP.')
   routes.push({href:'/analisar-terreno',label:'Analisar Terreno',reason:'Aprofundar potencial construtivo e condicionantes.'})
 }
 if(no(a.registry)){missing.push('Certidão permanente do registo predial');add('critical','Registo predial por confirmar','Sem certidão atualizada não é possível validar com segurança titularidade, descrição e ónus.')}
 if(no(a.tax_record)){missing.push('Caderneta predial');add('warning','Matriz predial em falta','A informação matricial deve ser confrontada com o registo e a realidade física.')}
 if(yes(a.registry)&&yes(a.tax_record)&&yes(a.area_mismatch)) add('critical','Divergência de áreas','Foram assinaladas diferenças entre documentação e realidade/elementos disponíveis.','Apurar origem da divergência antes de assumir que a situação está regular.')
 if(no(a.ownership_confirmed)) add('critical','Titularidade não confirmada','A pessoa que pretende contratar a mediação pode não estar ainda documentalmente legitimada.','Confirmar proprietários e poderes de representação.')
 if(yes(a.multiple_owners)) add('warning','Pluralidade de titulares','A operação pode exigir intervenção/consentimento de vários titulares.','Identificar todos os titulares e confirmar poderes para contratar e vender.')
 if(yes(a.inheritance)) add('warning','Herança envolvida','É necessário confirmar habilitação, partilha e/ou legitimidade dos interessados conforme o caso.','Recolher documentação sucessória aplicável.')
 if(yes(a.mortgage)||yes(a.seizure)||yes(a.other_encumbrance)) add(yes(a.seizure)?'critical':'warning','Ónus ou encargos assinalados','A análise identificou encargos que devem ser esclarecidos antes da transmissão.','Confirmar conteúdo da certidão e procedimento para cancelamento/regularização.')
 if(a.property_type==='apartment' || a.property_type==='shop'){
   if(no(a.condominium_docs)){missing.push('Elementos do condomínio');add('warning','Condomínio por verificar','Convém confirmar encargos, deliberações e documentação relevante do condomínio.')}
 }
 if(no(a.energy_certificate) && a.property_type!=='land'){missing.push('Certificado energético, quando legalmente aplicável');add('warning','Certificação energética por confirmar','Verificar se existe certificado válido ou se ocorre alguma exclusão legal.')}
 if(unknown(a.license) && a.property_type!=='land') add('warning','Licenciamento/utilização por confirmar','Não foi possível confirmar a situação urbanística declarada.','Obter os elementos municipais aplicáveis e confrontar o uso autorizado com o uso atual.')
 if(no(a.license) && a.property_type!=='land') add('critical','Situação urbanística não confirmada','Foi indicada ausência ou impossibilidade de comprovar o título/regularidade aplicável.','Não apresentar o imóvel como regularizado sem confirmação municipal/documental.')
 if(yes(a.use_mismatch)){
   add('critical','Uso atual pode divergir do autorizado','Foi indicada possível divergência entre utilização real e utilização autorizada.','Confirmar o título de utilização e avaliar o procedimento urbanístico adequado.')
   routes.push({href:'/alterar-uso',label:'Alterar Uso do Imóvel',reason:'Avaliar os passos para uma eventual alteração de utilização.'})
 }
 if(yes(a.illegal_works)) add('critical','Obras/alterações por esclarecer','Existem alterações físicas cuja conformidade urbanística não está confirmada.','Recolher plantas/licenças/processo municipal e obter validação técnica quando necessário.')
 if(yes(a.occupied)) add('warning','Imóvel ocupado','A entrega e a situação contratual do ocupante devem ser esclarecidas.','Confirmar título de ocupação, prazos e condições de entrega.')
 if(no(a.access_confirmed)) add('critical','Acesso não confirmado','O acesso físico/jurídico ao imóvel apresenta dúvida.','Confirmar acesso, confrontações e eventuais servidões antes de promover conclusões.')
 if(yes(a.preemption)) add('warning','Possível direito legal de preferência','A operação pode estar sujeita a procedimentos de preferência.','Confirmar enquadramento e formalidades aplicáveis à situação concreta.')
 if(yes(a.documents_missing)){
   add('warning','Documentação incompleta','O processo foi assinalado como incompleto.','Fechar a checklist documental antes da fase contratual.')
   routes.push({href:'/checklist-documentos',label:'Que documentos preciso?',reason:'Gerar a checklist documental adequada ao caso.'})
 }
 if(yes(a.client_urgent)) add('warning','Cliente pretende avançar com urgência','A urgência comercial não elimina verificações documentais e urbanísticas.','Registar pendências e evitar afirmações não confirmadas.')

 if(!f.length)add('ok','Sem alertas relevantes nas respostas fornecidas','Não foram detetados sinais de risco nas respostas selecionadas. Isto não substitui a conferência dos documentos e das fontes oficiais.')
 if(!routes.some((x:any)=>x.href==='/checklist-documentos'))routes.push({href:'/checklist-documentos',label:'Que documentos preciso?',reason:'Confirmar a checklist documental da operação.'})

 const critical=f.filter(x=>x.level==='critical').length
 const warning=f.filter(x=>x.level==='warning').length
 const score=Math.max(0,100-critical*18-warning*7)
 const risk=critical>=2||score<55?'high':critical>=1||warning>=3||score<80?'medium':'low'
 if(critical)next.push('Resolver os alertas críticos antes de assumir a situação como regular ou pronta para contratação.')
 if(missing.length)next.push('Recolher e conferir a documentação em falta.')
 next.push('Confrontar os dados declarados com documentos atuais e, quando aplicável, fontes oficiais.')
 if(yes(a.illegal_works)||yes(a.use_mismatch)||no(a.license))next.push('Obter validação municipal/técnica adequada antes de comunicar conclusões ao cliente.')
 next.push('Registar no processo de angariação as verificações efetuadas e as pendências.')
 return {score,risk,findings:f,missing:[...new Set(missing)],nextSteps:next,routes}
}
