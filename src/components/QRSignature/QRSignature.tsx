import { QRCodeCanvas } from 'qrcode.react'
import React, { useState } from 'react'

export const QRSignature: React.FC<{ orderId: string; terms: string }> = ({ orderId, terms }) => {
  const [signUrl] = useState(
    `${window.location.origin}/orders/sign?orderId=${orderId}&data=${btoa(encodeURIComponent(terms))}`
  )

  return (
    <div style={{ width: '100%', textAlign: 'center', margin: '10px' }}>
      {import.meta.env.DEV && (
        <a href={signUrl} target="_blank">
          Link
        </a>
      )}
      <QRCodeCanvas value={signUrl} size={256} />
    </div>
  )
}
