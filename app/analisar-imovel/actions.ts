'use server'
import { createClient } from '@/lib/supabase/server'
import { analyseProperty } from '@/lib/propertyAnalysis'
import { redirect } from 'next/navigation'

function val(fd:FormData,k:string){return String(fd.get(k)||'')}
export async function savePropertyAnalysis(fd:FormData){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:course}=await s.from('courses').select('id').eq('slug','pratica-profissional-avancada').eq('status','published').maybeSingle()
 if(!course) redirect('/academia')
 const {data:allowed}=await s.rpc('has_course_access',{target_course_id:course.id})
 if(!allowed) redirect('/academia/pratica-profissional-avancada')
 const answers={
  is_land:val(fd,'is_land'),registry:val(fd,'registry'),tax_record:val(fd,'tax_record'),
  area_mismatch:val(fd,'area_mismatch'),ownership_confirmed:val(fd,'ownership_confirmed'),
  multiple_owners:val(fd,'multiple_owners'),inheritance:val(fd,'inheritance'),
  mortgage:val(fd,'mortgage'),seizure:val(fd,'seizure'),other_encumbrance:val(fd,'other_encumbrance'),
  condominium_docs:val(fd,'condominium_docs'),energy_certificate:val(fd,'energy_certificate'),
  license:val(fd,'license'),use_mismatch:val(fd,'use_mismatch'),illegal_works:val(fd,'illegal_works'),
  occupied:val(fd,'occupied'),access_confirmed:val(fd,'access_confirmed'),preemption:val(fd,'preemption'),
  documents_missing:val(fd,'documents_missing'),client_urgent:val(fd,'client_urgent')
 }
 const result=analyseProperty({...answers,property_type:val(fd,'property_type')})
 const payload={
  user_id:user.id,title:val(fd,'title')||'Análise de imóvel',
  municipality:val(fd,'municipality')||null,property_type:val(fd,'property_type'),
  purpose:val(fd,'purpose')||null,answers,result,risk_level:result.risk,status:'completed',
  updated_at:new Date().toISOString()
 }
 const existing=Number(fd.get('analysis_id')||0)
 let id=existing
 if(existing){
   const {error}=await s.from('property_analyses').update(payload).eq('id',existing).eq('user_id',user.id)
   if(error)redirect('/analisar-imovel?erro=guardar')
 }else{
   const {data,error}=await s.from('property_analyses').insert(payload).select('id').single()
   if(error||!data)redirect('/analisar-imovel?erro=guardar')
   id=data.id
 }
 redirect(`/analisar-imovel/${id}`)
}

export async function archivePropertyAnalysis(fd:FormData){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:course}=await s.from('courses').select('id').eq('slug','pratica-profissional-avancada').eq('status','published').maybeSingle()
 if(!course) redirect('/academia')
 const {data:allowed}=await s.rpc('has_course_access',{target_course_id:course.id})
 if(!allowed) redirect('/academia/pratica-profissional-avancada')
 const id=Number(fd.get('id'));if(id)await s.from('property_analyses').update({status:'archived',updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',user.id)
 redirect('/analisar-imovel')
}
