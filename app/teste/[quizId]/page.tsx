import AppShell from '@/components/AppShell'
import QuizClient from '@/components/QuizClient'
import { notFound } from 'next/navigation'
export default async function TestPage({params}:{params:Promise<{quizId:string}>}){const {quizId}=await params;const id=Number(quizId);if(!Number.isFinite(id))notFound();return <AppShell><QuizClient quizId={id}/></AppShell>}
