import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function courseCompletion(userId:string,courseId:number){
 const s=await createClient()
 const {data:mods}=await s.from('modules').select('id').eq('course_id',courseId).eq('status','published')
 const mids=(mods||[]).map((m:any)=>m.id)
 if(!mids.length)return {eligible:false,lessonsDone:0,lessonsTotal:0,testsPassed:0,testsTotal:0,score:0,totalMinutes:0}
 const {data:lessons}=await s.from('lessons').select('id,duration_minutes').in('module_id',mids).eq('status','published')
 const lids=(lessons||[]).map((l:any)=>l.id)
 const {data:done}=lids.length?await s.from('user_lesson_progress').select('lesson_id').eq('user_id',userId).eq('completed',true).in('lesson_id',lids):{data:[] as any[]}
 const {data:quizzes}=await s.from('quizzes').select('id,pass_percentage').in('module_id',mids)
 const qids=(quizzes||[]).map((q:any)=>q.id)
 const {data:attempts}=qids.length?await s.from('quiz_attempts').select('quiz_id,score').eq('user_id',userId).in('quiz_id',qids):{data:[] as any[]}
 let passed=0;const best:number[]=[]
 for(const q of quizzes||[]){const scores=(attempts||[]).filter((a:any)=>a.quiz_id===q.id).map((a:any)=>Number(a.score));const b=scores.length?Math.max(...scores):0;if(b>=Number(q.pass_percentage||80))passed++;best.push(b)}
 const lessonOk=lids.length>0&&(done||[]).length===lids.length
 const testOk=qids.length===0||passed===qids.length
 const score=best.length?Math.round(best.reduce((a,b)=>a+b,0)/best.length):100
 return {eligible:lessonOk&&testOk,lessonsDone:(done||[]).length,lessonsTotal:lids.length,testsPassed:passed,testsTotal:qids.length,score,totalMinutes:(lessons||[]).reduce((n:any,l:any)=>n+Number(l.duration_minutes||0),0)}
}
export function certificateCode(){return `AI-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`}
