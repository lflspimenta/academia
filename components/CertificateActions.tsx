'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Printer } from 'lucide-react'

export default function CertificateActions({code}:{code:string}){
 const [qr,setQr]=useState('')
 useEffect(()=>{
   const url=`${window.location.origin}/certificado/${code}`
   QRCode.toDataURL(url,{width:220,margin:1,errorCorrectionLevel:'M'}).then(setQr).catch(()=>{})
 },[code])
 return <>
   <div className="certificate-actions no-print">
     <button onClick={()=>window.print()}><Download size={16}/> Descarregar certificado PDF</button>
     <button className="secondary-action" onClick={()=>window.print()}><Printer size={16}/> Imprimir</button>
   </div>
   {qr&&<div className="certificate-qr"><img src={qr} alt={`QR Code de validação ${code}`}/><div><span>VALIDAÇÃO DIGITAL</span><strong>Digitalize para confirmar a autenticidade</strong><small>academia-imobiliaria · {code}</small></div></div>}
 </>
}
