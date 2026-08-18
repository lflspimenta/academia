'use client'
import { useEffect,useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Answer={id:number;answer:string;position:number}
type Question={id:number;question:string;position:number;answers:Answer[]}
type Quiz={id:number;title:string;pass_percentage:number;questions:Question[]}

export default function QuizClient({quizId}:{quizId:number}){
 const [quiz,setQuiz]=useState<Quiz|null>(null)
 const [selected,setSelected]=useState<Record<number,number>>({})
 const [result,setResult]=useState<any>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const supabase=createClient()
 useEffect(()=>{(async()=>{const {data,error}=await supabase.rpc('get_quiz_safe',{p_quiz_id:quizId});if(error)setError('Não foi possível carregar o teste. Tente novamente.');else setQuiz(data as Quiz);setLoading(false)})()},[quizId])
 async function submit(){if(!quiz)return;setError('');const missing=quiz.questions.some(q=>!selected[q.id]);if(missing){setError('Responda a todas as perguntas antes de submeter.');return}setLoading(true);const payload=quiz.questions.map(q=>({question_id:q.id,answer_id:selected[q.id]}));const {data,error}=await supabase.rpc('submit_quiz',{p_quiz_id:quizId,p_answers:payload});if(error)setError('Não foi possível submeter o teste. Tente novamente.');else setResult(data);setLoading(false)}
 if(loading&&!quiz)return <div className="card">A carregar teste…</div>
 if(error&&!quiz)return <div className="admin-note">{error}</div>
 if(!quiz)return null
 const feedbackMap=new Map((result?.feedback||[]).map((f:any)=>[f.question_id,f]))
 return <div className="quiz-wrap"><div className="topbar"><div><div className="eyebrow">Avaliação</div><h1>{quiz.title}</h1></div><span className="badge">Aprovação · {quiz.pass_percentage}%</span></div>
 <div className="section list">{quiz.questions.map((q,i)=>{const fb:any=feedbackMap.get(q.id);return <div className="card" key={q.id}><div className="question-number">Pergunta {i+1}</div><h2>{q.question}</h2><div className="answer-list">{q.answers.map(a=>{const chosen=selected[q.id]===a.id;const cls=result?(a.id===fb?.correct_answer_id?'answer correct':chosen?'answer wrong':'answer'):(chosen?'answer selected':'answer');return <label className={cls} key={a.id}><input type="radio" name={`q-${q.id}`} disabled={!!result} checked={chosen} onChange={()=>setSelected(s=>({...s,[q.id]:a.id}))}/><span>{a.answer}</span></label>})}</div>{result&&fb?.explanation&&<div className="feedback"><strong>Explicação:</strong> {fb.explanation}</div>}</div>})}</div>
 {!result?<><button className="btn section" onClick={submit} disabled={loading}>{loading?'A corrigir…':'Submeter teste'}</button>{error&&<div className="admin-note section">{error}</div>}</>:<div className="result-box section"><div className="eyebrow">Resultado</div><div className="metric">{Number(result.score).toFixed(0)}%</div><div className={result.passed?'result-pass':'result-fail'}>{result.passed?'Aprovado ✓':'Ainda não aprovado'}</div><p className="muted">Pode rever as explicações acima. Cada tentativa fica registada no seu progresso.</p></div>}
 </div>
}
