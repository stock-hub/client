import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { MessageContext } from '../../context/userMessage.context'
import invoiceService from '../../services/invoice.service'

export const SignaturePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const invoiceId = searchParams.get('invoiceId')
  const terms = searchParams.get('data')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const sigCanvas = useRef<SignatureCanvas | null>(null)
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [conditionsAccepted, setConditionsAccepted] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (!invoiceId) {
      timer = setTimeout(() => {
        navigate('/login')
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

  useEffect(() => {
    const updateCanvasWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth - 25)
      }
    }

    const timeoutId = setTimeout(updateCanvasWidth, 100)

    window.addEventListener('resize', updateCanvasWidth)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateCanvasWidth)
    }
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  const clear = () => {
    sigCanvas.current?.clear()
  }

  const saveSignature = () => {
    if (sigCanvas.current) {
      const signatureImage = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')

      invoiceService
        .newSignature(invoiceId!, signatureImage)
        .then(() => navigate('/'))
        .catch((err: Error) => {
          setShowMessage(true)
          setMessageInfo(err.message)
        })
    }
  }

  return (
    <Container ref={containerRef} style={{ maxHeight: '100vh' }}>
      <h1>Firmar factura {invoiceId}</h1>
      {conditionsAccepted ? (
        <>
          <div style={{ width: '100%', border: '1px solid black' }}>
            <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: canvasWidth, height: 300 }} />
          </div>
          <div style={{ width: '90%', margin: '10px auto', textAlign: 'center' }}>
            <Button style={{ marginRight: '1rem' }} onClick={clear}>
              Repetir
            </Button>
            <Button variant="success" onClick={saveSignature}>
              Guardar
            </Button>
          </div>
        </>
      ) : (
        <div style={{ paddingTop: '1rem' }}>
          <p>{decodeURIComponent(atob(terms!))}</p>
          <Form.Check
            type="checkbox"
            label="He leído y acepto los términos y condiciones"
            onChange={handleCheckboxChange}
          />
          <div style={{ width: '90%', margin: '20px auto', textAlign: 'center' }}>
            <Button variant="primary" onClick={() => setConditionsAccepted(true)} disabled={!isChecked}>
              Continuar
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}
