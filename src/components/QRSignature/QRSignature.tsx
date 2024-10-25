import { QRCodeCanvas } from 'qrcode.react'
import React, { useState } from 'react'

export const QRSignature: React.FC<{ invoiceId: string }> = ({ invoiceId }) => {
  const [signUrl] = useState(`${window.location.origin}/dashboard/invoices/sign?invoiceId=${invoiceId}`)

  return (
    <div style={{ width: '100%', textAlign: 'center', margin: '10px' }}>
      <a href={signUrl} target="_blank">
        Link
      </a>
      <QRCodeCanvas value={signUrl} size={256} />
    </div>
  )
}
