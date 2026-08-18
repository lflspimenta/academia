'use server'
import { createClient } from '@/lib/supabase/server'
import { courseCompletion,certificateCode } from '@/lib/certificates'
import { redirect } from 'next/navigation'
export async function issueCertificate(formData:FormData){
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const courseId=Number(formData.get('course_id'));const check=await courseCompletion(user.id,courseId)
 if(!check.eligible)redirect('/progresso')
 const {data:existing}=await s.from('certificates').select('code').eq('user_id',user.id).eq('course_id',courseId).maybeSingle()
 if(existing?.code)redirect(`/certificado/${existing.code}`)
 let code=certificateCode()
 const {error}=await s.from('certificates').insert({code,user_id:user.id,course_id:courseId,final_score:check.score,total_minutes:check.totalMinutes})
 if(error)redirect('/progresso')
 redirect(`/certificado/${code}`)
}
