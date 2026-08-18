'use client'
import {useMemo,useState} from 'react'
import {Search,ChevronDown,ChevronUp,BookOpen} from 'lucide-react'
type I={id:number,term:string,full_name:string,category:string,language:string,definition:string,portugal_usage:string|null,caution:string|null,related_terms:string|null}
export default function ProfessionalGlossary({items}:{items:I[]}){
 const[q,setQ]=useState('');const[cat,setCat]=useState('Todos');const[open,setOpen]=useState<number|null>(null)
 const cats=['Todos',...Array.from(new Set(items.map(x=>x.category))).sort()]
 const list=useMemo(()=>items.filter(x=>(cat==='Todos'||x.category===cat)&&[x.term,x.full_name,x.definition,x.portugal_usage,x.related_terms].join(' ').toLowerCase().includes(q.toLowerCase().trim())),[items,q,cat])
 return <><div className="glossary-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar: CPCV, NDA, developer, yield, prospeção..."/></div>
 <div className="glossary-cats">{cats.map(c=><button type="button" key={c} className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
 <div className="glossary-count">{list.length} {list.length===1?'termo':'termos'}</div>
 <div className="glossary-list">{list.map(x=><article className="glossary-item" key={x.id}><button type="button" className="glossary-title" onClick={()=>setOpen(open===x.id?null:x.id)}><div><div><strong>{x.term}</strong><span className={'lang '+(x.language==='EN'?'en':'')}>{x.language}</span></div><small>{x.full_name}</small></div>{open===x.id?<ChevronUp/>:<ChevronDown/>}</button>
 {open===x.id&&<div className="glossary-body"><div><label>O que é</label><p>{x.definition}</p></div>{x.portugal_usage&&<div><label>Como é usado em Portugal</label><p>{x.portugal_usage}</p></div>}{x.caution&&<div className="glossary-caution"><label>Atenção</label><p>{x.caution}</p></div>}{x.related_terms&&<div><label>Termos relacionados</label><p>{x.related_terms}</p></div>}</div>}</article>)}</div>
 {!list.length&&<div className="empty-state"><BookOpen/><strong>Nenhum termo encontrado</strong><p>Tente outra palavra ou categoria.</p></div>}</>
}