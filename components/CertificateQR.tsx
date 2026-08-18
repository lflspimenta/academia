'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function CertificateQR({code}:{code:string}){
  const [qr,setQr]=useState('')
  useEffect(()=>{
    const url=`${window.location.origin}/certificado/${code}`
    QRCode.toDataURL(url,{
      width:180,
      margin:1,
      errorCorrectionLevel:'M'
    }).then(setQr).catch(()=>{})
  },[code])

  if(!qr) return <div className="certificate-qr certificate-qr-placeholder">
    <div className="qr-placeholder-box"/>
    <div><span>VALIDAÇÃO DIGITAL</span><strong>Validação disponível através do código</strong><small>{code}</small></div>
  </div>

  return <div className="certificate-qr">
    <img src={qr} alt={`QR Code de validação ${code}`}/>
    <div>
      <span>VALIDAÇÃO DIGITAL</span>
      <strong>Digitalize para confirmar a autenticidade</strong>
      <small>{code}</small>
    </div>
  </div>
}
