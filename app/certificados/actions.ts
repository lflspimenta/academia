'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { courseCompletion, certificateCode } from '@/lib/certificates'
import { redirect } from 'next/navigation'

export async function issueCertificate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const courseId = Number(formData.get('course_id'))
  const check = await courseCompletion(user.id, courseId)
  if (!check.eligible) redirect('/progresso')

  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('certificates')
    .select('code,status')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()

  if (existing?.code && existing.status === 'valid') {
    redirect(`/certificado/${existing.code}`)
  }

  const code = certificateCode()
  const { error } = await admin.from('certificates').upsert({
    code,
    user_id: user.id,
    course_id: courseId,
    final_score: check.score,
    total_minutes: check.totalMinutes,
    status: 'valid',
    revoked_at: null,
    revoked_reason: null,
    issued_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,course_id' })

  if (error) redirect('/progresso')
  redirect(`/certificado/${code}`)
}
