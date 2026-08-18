'use server'
import { createClient } from '@/lib/supabase/server'

export async function saveLandAnalysis(payload:{
  municipality:string, article:string, objective:string, answers:any,
  riskLevel:string, checklist:any[], alerts:any[], nextSteps:any[]
}){
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return {ok:false,error:'Sessão inválida.'}
  const {error}=await supabase.from('land_analyses').insert({
    user_id:user.id,
    municipality:payload.municipality||null,
    article:payload.article||null,
    objective:payload.objective,
    answers:payload.answers,
    risk_level:payload.riskLevel,
    checklist:payload.checklist,
    alerts:payload.alerts,
    next_steps:payload.nextSteps
  })
  if(error) return {ok:false,error:error.message}
  return {ok:true}
}
