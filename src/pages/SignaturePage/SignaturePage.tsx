import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

export const SignaturePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const invoiceId = searchParams.get('invoiceId')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const sigCanvas = useRef<SignatureCanvas | null>(null)
  const [trimmedDataURL, setTrimmedDataURL] = useState<string | null>(null)

  console.log(invoiceId)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (!invoiceId) {
      timer = setTimeout(() => {
        navigate('/dashboard/login')
      }, 3000)
    } else {
      setIsLoading(false)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [invoiceId, navigate])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const clear = () => {
    sigCanvas.current?.clear()
  }

  const saveSignature = () => {
    if (sigCanvas.current) {
      const signatureImage = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
      setTrimmedDataURL(signatureImage)
      console.log(signatureImage)
    }
  }

  return (
    <div>
      <h1>Sign Here</h1>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <button onClick={clear}>Clear</button>
      <button onClick={saveSignature}>Save</button>

      {trimmedDataURL && (
        <div>
          <h2>Preview</h2>
          <img src={trimmedDataURL} alt="Signature" />
        </div>
      )}
    </div>
  )
}
