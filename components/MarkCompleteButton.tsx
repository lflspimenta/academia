'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
export default function MarkCompleteButton({lessonId,initialCompleted=false}:{lessonId:number;initialCompleted?:boolean}){
 const [done,setDone]=useState(initialCompleted);const [busy,setBusy]=useState(false);const [msg,setMsg]=useState('');
 async function toggle(){setBusy(true);setMsg('');const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){setMsg('Sessão não encontrada.');setBusy(false);return}const next=!done;const {error}=await supabase.from('user_lesson_progress').upsert({user_id:user.id,lesson_id:lessonId,completed:next,completed_at:next?new Date().toISOString():null});if(error)setMsg(error.message);else setDone(next);setBusy(false)}
 return <div><button className={done?'btn btn-done':'btn'} onClick={toggle} disabled={busy}>{busy?'A guardar…':done?'Aula concluída ✓':'Marcar aula como concluída'}</button>{msg&&<div className="muted" style={{marginTop:8}}>{msg}</div>}</div>
}
