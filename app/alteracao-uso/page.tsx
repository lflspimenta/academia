import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import UseChangeAnalyzer from '@/components/UseChangeAnalyzer'

export default async function Page(){
  const supabase=await createClient()
  const {data:course}=await supabase.from('courses').select('id').eq('slug','urbanismo-pratico').eq('status','published').maybeSingle()
  if(!course) redirect('/academia')
  const {data:allowed}=await supabase.rpc('has_course_access',{target_course_id:course.id})
  if(!allowed) redirect('/academia/urbanismo-pratico')
  const {data:rules}=await supabase.from('use_change_rules')
    .select('id,rule_type,severity,title,message,next_step,conditions,position,verified_at')
    .eq('status','published').order('position')
  return <AppShell>
    <div className="topbar"><div>
      <div className="eyebrow">Ferramenta profissional</div>
      <h1>Posso mudar o uso deste imóvel?</h1>
      <p className="muted">Diagnóstico guiado para organizar uma alteração de utilização antes de a apresentar como viável.</p>
    </div></div>
    <UseChangeAnalyzer rules={rules||[]} />
  </AppShell>
}
