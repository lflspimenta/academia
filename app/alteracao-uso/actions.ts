'use server'
import { createClient } from '@/lib/supabase/server'

export async function saveUseChangeAnalysis(payload:any){
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return {ok:false,error:'Sessão inválida.'}
  const {error}=await supabase.from('use_change_analyses').insert({
    user_id:user.id,
    municipality:payload.municipality||null,
    property_type:payload.propertyType||null,
    current_use:payload.currentUse,
    intended_use:payload.intendedUse,
    autonomous_fraction:payload.autonomousFraction,
    works:payload.works,
    title_known:payload.titleKnown,
    answers:payload.answers,
    result_status:payload.resultStatus,
    checklist:payload.checklist,
    alerts:payload.alerts,
    next_steps:payload.nextSteps
  })
  return error?{ok:false,error:error.message}:{ok:true}
}
