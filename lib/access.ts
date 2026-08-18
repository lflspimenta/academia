import { createClient } from '@/lib/supabase/server'

export async function accessContext(){
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return {supabase,user:null,isAdmin:false,initialCourseId:null,accessIds:new Set<number>()}

  const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle()
  const isAdmin=profile?.role==='admin'

  const {data:initial}=await supabase.rpc('initial_course_id')
  const initialCourseId=Number(initial)||null

  const {data:access}=await supabase
    .from('course_access')
    .select('course_id,expires_at')
    .eq('user_id',user.id)

  const now=Date.now()
  const ids=new Set<number>(
    (access||[])
      .filter((a:any)=>!a.expires_at || new Date(a.expires_at).getTime()>now)
      .map((a:any)=>Number(a.course_id))
  )
  if(initialCourseId) ids.add(initialCourseId)

  return {supabase,user,isAdmin,initialCourseId,accessIds:ids}
}

export async function userHasCourseAccess(courseId:number){
  const {supabase,isAdmin}=await accessContext()
  if(isAdmin) return true
  const {data}=await supabase.rpc('has_course_access',{target_course_id:courseId})
  return !!data
}
