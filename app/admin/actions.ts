'use server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin(){
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) redirect('/login')
  const {data:p}=await supabase.from('profiles').select('role').eq('id',user.id).single()
  if(p?.role!=='admin') redirect('/dashboard')
  return {supabase,user}
}

export async function createCourse(formData:FormData){const {supabase:s}=await requireAdmin();const title=String(formData.get('title')||'').trim(),slug=String(formData.get('slug')||'').trim(),description=String(formData.get('description')||'').trim(),level=String(formData.get('level')||'').trim();if(!title||!slug)return;await s.from('courses').insert({title,slug,description,level,status:'draft',position:99});revalidatePath('/admin');revalidatePath('/academia')}
export async function createModule(formData:FormData){const {supabase:s}=await requireAdmin();const course_id=Number(formData.get('course_id')),title=String(formData.get('title')||'').trim(),description=String(formData.get('description')||'').trim(),position=Number(formData.get('position')||1);if(!course_id||!title)return;await s.from('modules').insert({course_id,title,description,position,status:'draft'});revalidatePath('/admin')}
export async function createLesson(formData:FormData){const {supabase:s}=await requireAdmin();const module_id=Number(formData.get('module_id')),title=String(formData.get('title')||'').trim(),slug=String(formData.get('slug')||'').trim(),intro=String(formData.get('intro')||'').trim(),duration_minutes=Number(formData.get('duration_minutes')||8),legal_sensitive=formData.get('legal_sensitive')==='on',source_url=String(formData.get('source_url')||'').trim()||null;if(!module_id||!title||!slug)return;await s.from('lessons').insert({module_id,title,slug,duration_minutes,legal_sensitive,verified_at:legal_sensitive?new Date().toISOString().slice(0,10):null,source_url,status:'draft',position:99,content:{intro,sections:[],takeaway:''}});revalidatePath('/admin')}
export async function createRadarUpdate(formData:FormData){const {supabase:s}=await requireAdmin();const title=String(formData.get('title')||'').trim(),topic=String(formData.get('topic')||'').trim(),summary=String(formData.get('summary')||'').trim(),impact=String(formData.get('impact')||'').trim(),source_url=String(formData.get('source_url')||'').trim();if(!title||!topic||!summary||!source_url)return;await s.from('legislative_updates').insert({title,topic,summary,impact,source_url,status:'draft',verified_at:new Date().toISOString().slice(0,10)});revalidatePath('/admin');revalidatePath('/radar')}
export async function togglePublish(formData:FormData){const {supabase:s}=await requireAdmin();const table=String(formData.get('table')||''),id=Number(formData.get('id')),status=String(formData.get('status'))==='published'?'draft':'published';if(!['courses','modules','lessons','legislative_updates'].includes(table)||!id)return;await s.from(table as any).update({status}).eq('id',id);revalidatePath('/admin');revalidatePath('/academia');revalidatePath('/radar')}

export async function createAppUser(formData:FormData){
  await requireAdmin()
  const fullName=String(formData.get('full_name')||'').trim()
  const email=String(formData.get('email')||'').trim().toLowerCase()
  const password=String(formData.get('password')||'')
  const role=String(formData.get('role')||'student')==='admin'?'admin':'student'
  if(!fullName||!email||password.length<8) redirect('/admin/utilizadores?error=Dados%20inválidos')
  const admin=createAdminClient()
  const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:fullName}})
  if(error||!data.user) redirect(`/admin/utilizadores?error=${encodeURIComponent(error?.message||'Não foi possível criar o utilizador')}`)
  const {error:profileError}=await admin.from('profiles').update({full_name:fullName,role}).eq('id',data.user.id)
  if(profileError) redirect(`/admin/utilizadores?error=${encodeURIComponent(profileError.message)}`)
  revalidatePath('/admin');revalidatePath('/admin/utilizadores')
  redirect('/admin/utilizadores?created=1')
}

export async function changeUserRole(formData:FormData){
  const {user:current}=await requireAdmin()
  const id=String(formData.get('id')||'')
  const role=String(formData.get('role')||'student')==='admin'?'admin':'student'
  if(!id||id===current.id) return
  const admin=createAdminClient()
  await admin.from('profiles').update({role}).eq('id',id)
  revalidatePath('/admin/utilizadores')
}

export async function toggleUserBlocked(formData:FormData){
  const {user:current}=await requireAdmin()
  const id=String(formData.get('id')||'')
  const blocked=String(formData.get('blocked'))==='true'
  if(!id||id===current.id) return
  const admin=createAdminClient()
  await admin.auth.admin.updateUserById(id,{ban_duration:blocked?'none':'876000h'})
  revalidatePath('/admin/utilizadores')
}

export async function sendUserRecovery(formData:FormData){
  const {supabase}=await requireAdmin()
  const email=String(formData.get('email')||'').trim().toLowerCase()
  if(!email)return
  const site=(process.env.NEXT_PUBLIC_SITE_URL||'').replace(/\/$/,'')
  await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${site}/auth/callback?next=/reset-password`})
  redirect('/admin/utilizadores?recovery=1')
}

export async function setCourseAccess(formData:FormData){
  const {user:adminUser}=await requireAdmin()
  const userId=String(formData.get('user_id')||'')
  const courseId=Number(formData.get('course_id'))
  const enabled=String(formData.get('enabled'))==='true'
  if(!userId||!courseId)return
  const admin=createAdminClient()
  if(enabled){
    await admin.from('course_access').upsert({
      user_id:userId,course_id:courseId,access_type:'purchase',
      granted_by:adminUser.id,notes:'Acesso atribuído no backoffice'
    },{onConflict:'user_id,course_id'})
  }else{
    const {data:initial}=await admin.rpc('initial_course_id')
    if(Number(initial)===courseId)return
    await admin.from('course_access').delete().eq('user_id',userId).eq('course_id',courseId)
  }
  revalidatePath('/admin/utilizadores')
  revalidatePath('/academia')
}
