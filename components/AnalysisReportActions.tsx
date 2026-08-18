'use client'
import { Printer } from 'lucide-react'
export default function AnalysisReportActions(){return <button className="btn no-print" onClick={()=>window.print()}><Printer size={16}/> Gerar relatório PDF</button>}
