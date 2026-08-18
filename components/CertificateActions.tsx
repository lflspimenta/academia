'use client'
import { Download, Printer } from 'lucide-react'

export default function CertificateActions(){
  return <div className="certificate-actions no-print">
    <button onClick={()=>window.print()}><Download size={16}/> Descarregar certificado PDF</button>
    <button className="secondary-action" onClick={()=>window.print()}><Printer size={16}/> Imprimir</button>
  </div>
}
