'use server'
import {createClient} from '@/lib/supabase/server'
export async function saveDocumentAnalysis(p:any){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)return {ok:false,error:'Sessão inválida.'};const {error}=await s.from('document_check_analyses').insert({user_id:user.id,property_type:p.propertyType,operation:p.operation,municipality:p.municipality||null,answers:p.answers,checklist:p.checklist,alerts:p.alerts});return error?{ok:false,error:error.message}:{ok:true}}
