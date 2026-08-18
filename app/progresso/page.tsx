import AppShell from '@/components/AppShell'
import { accessContext } from '@/lib/access'
import Link from 'next/link'
import { ArrowRight, CircleCheck, LockKeyhole, Trophy, BadgeCheck } from 'lucide-react'
import { courseCompletion } from '@/lib/certificates'
import { issueCertificate } from '@/app/certificados/actions'

export default async function ProgressPage() {
  const { supabase, user, isAdmin, accessIds } = await accessContext()

  const { data: courses } = await supabase
    .from('courses')
    .select('id,title,slug,description,level,position')
    .eq('status', 'published')
    .order('position')

  const available = (courses || []).filter(
    (course: any) => isAdmin || accessIds.has(Number(course.id))
  )

  const courseIds = available.map((course: any) => course.id)
  const { data: mods } = courseIds.length
    ? await supabase
        .from('modules')
        .select('id,course_id')
        .eq('status', 'published')
        .in('course_id', courseIds)
    : { data: [] as any[] }

  const moduleIds = (mods || []).map((module: any) => module.id)
  const { data: lessons } = moduleIds.length
    ? await supabase
        .from('lessons')
        .select('id,module_id')
        .eq('status', 'published')
        .in('module_id', moduleIds)
    : { data: [] as any[] }

  const lessonIds = (lessons || []).map((lesson: any) => lesson.id)
  const { data: progress } = user && lessonIds.length
    ? await supabase
        .from('user_lesson_progress')
        .select('lesson_id,completed')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('lesson_id', lessonIds)
    : { data: [] as any[] }

  const done = new Set((progress || []).map((item: any) => Number(item.lesson_id)))

  const { data: attempts } = user
    ? await supabase.from('quiz_attempts').select('score').eq('user_id', user.id)
    : { data: [] as any[] }

  const avg = attempts?.length
    ? Math.round(attempts.reduce((sum: number, item: any) => sum + Number(item.score), 0) / attempts.length)
    : 0

  const { data: certs } = user
    ? await supabase
        .from('certificates')
        .select('course_id,code,status')
        .eq('user_id', user.id)
    : { data: [] as any[] }

  const certMap = new Map((certs || []).map((item: any) => [Number(item.course_id), item]))
  const completions = new Map<number, any>()

  if (user) {
    for (const course of available) {
      completions.set(Number(course.id), await courseCompletion(user.id, Number(course.id)))
    }
  }

  return (
    <AppShell>
      <header className="welcome-head">
        <div>
          <div className="eyebrow">O MEU PROGRESSO</div>
          <h1>O seu percurso, num só lugar.</h1>
          <p className="muted">
            Acompanhe as formações disponíveis, aulas concluídas e resultados dos testes.
          </p>
        </div>
      </header>

      <section className="section stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><CircleCheck size={18} /></div>
          <div><span>Aulas concluídas</span><strong>{done.size}</strong><small>de {lessonIds.length} disponíveis</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Trophy size={18} /></div>
          <div><span>Média nos testes</span><strong>{avg ? `${avg}%` : '—'}</strong><small>{attempts?.length || 0} teste(s) realizado(s)</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><LockKeyhole size={18} /></div>
          <div><span>Formações ativas</span><strong>{available.length}</strong><small>na sua conta</small></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><div className="eyebrow">FORMAÇÕES</div><h2>Progresso por formação</h2></div>
        </div>

        <div className="progress-course-grid">
          {available.map((course: any) => {
            const courseModuleIds = (mods || [])
              .filter((module: any) => module.course_id === course.id)
              .map((module: any) => module.id)
            const courseLessons = (lessons || []).filter((lesson: any) => courseModuleIds.includes(lesson.module_id))
            const completedLessons = courseLessons.filter((lesson: any) => done.has(Number(lesson.id))).length
            const pct = courseLessons.length ? Math.round((completedLessons / courseLessons.length) * 100) : 0
            const certificate: any = certMap.get(Number(course.id))
            const completion: any = completions.get(Number(course.id))

            return (
              <div className="progress-course-card" key={course.id}>
                <div className="course-card-top">
                  <span className="badge">{course.level}</span>
                  <strong className="progress-number">{pct}%</strong>
                </div>

                <h3><Link href={`/academia/${course.slug}`}>{course.title}</Link></h3>
                <p>{course.description}</p>
                <div className="mini-progress"><i style={{ width: `${pct}%` }} /></div>

                <div className="progress-card-foot">
                  <span>{completedLessons} de {courseLessons.length} aulas</span>
                  <Link href={`/academia/${course.slug}`}>
                    {pct === 100 ? 'Rever formação' : 'Continuar'} <ArrowRight size={14} />
                  </Link>
                </div>

                {certificate?.status === 'valid' ? (
                  <div className="certificate-ready">
                    <BadgeCheck size={16} />
                    <span>Certificado emitido</span>
                    <Link href={`/certificado/${certificate.code}`}>Ver certificado</Link>
                  </div>
                ) : completion?.eligible ? (
                  <form action={issueCertificate} className="certificate-ready">
                    <input type="hidden" name="course_id" value={course.id} />
                    <BadgeCheck size={16} />
                    <span>Formação concluída</span>
                    <button type="submit" className="text-button">Emitir certificado</button>
                  </form>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}
