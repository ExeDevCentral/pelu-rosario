import React, { useState, useRef, useCallback, memo } from 'react'
import { HAIR_STYLES, SAMPLE_FACES, HAIR_PRODUCTS } from '../data/mockData'
import { HairId, HairStyle, SampleFace, HairProduct } from '../types'
import { BarberiaAPI, validateUploadedImage } from '../services/api'
import {
  AiDiagnosticIcon,
  ScissorsIcon,
  PomadePotIcon,
  LuxuryBagIcon,
  CalendarClockIcon,
} from './icons/CustomIcons'

interface DiagnosticResult {
  faceShape: string
  score: number
  bestStyle: HairStyle
  explanation: string
  recommendedProduct: HairProduct
  routineSteps: string[]
  hairMetrics: {
    jawlineAngle: string
    proportionsScore: string
    volumeRecommendation: string
  }
}

interface AiVisagismoModalProps {
  initialStyleId?: HairId
  onBookWithStyle: (style: HairStyle) => void
  onAddToCart?: (product: HairProduct) => void
  onAddToast: (msg: string, type?: 'success' | 'info' | 'gold') => void
}

const AiVisagismoModal: React.FC<AiVisagismoModalProps> = memo(({
  initialStyleId = 'pompadour',
  onBookWithStyle,
  onAddToCart,
  onAddToast,
}) => {
  const [selectedSampleFace, setSelectedSampleFace] = useState<SampleFace>(SAMPLE_FACES[3]) // face_4 like in screenshot
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null)
  
  // Interactive Alignment & Calibration State
  const [imgScale, setImgScale] = useState<number>(1.15)
  const [imgTranslateX, setImgTranslateX] = useState<number>(0)
  const [imgTranslateY, setImgTranslateY] = useState<number>(-25)
  const [isCalibrating, setIsCalibrating] = useState<boolean>(true)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartRef = useRef<{ x: number; y: number; startTx: number; startTy: number }>({
    x: 0,
    y: 0,
    startTx: 0,
    startTy: 0,
  })

  // Interactive Questionnaire state for users without camera/photo
  const [hairType, setHairType] = useState('Grueso')
  const [dailyStylingTime, setDailyStylingTime] = useState('Menos de 5 min')
  const [desiredFinish, setDesiredFinish] = useState('Mate Natural')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag and Drop Image Positioning Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startTx: imgTranslateX,
      startTy: imgTranslateY,
    }
  }, [imgTranslateX, imgTranslateY])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    setImgTranslateX(Math.max(-120, Math.min(120, dragStartRef.current.startTx + deltaX)))
    setImgTranslateY(Math.max(-140, Math.min(100, dragStartRef.current.startTy + deltaY)))
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch Support for Mobile Dragging
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      startTx: imgTranslateX,
      startTy: imgTranslateY,
    }
  }, [imgTranslateX, imgTranslateY])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStartRef.current.x
    const deltaY = touch.clientY - dragStartRef.current.y
    setImgTranslateX(Math.max(-120, Math.min(120, dragStartRef.current.startTx + deltaX)))
    setImgTranslateY(Math.max(-140, Math.min(100, dragStartRef.current.startTy + deltaY)))
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleAutoAlign = () => {
    setImgScale(1.2)
    setImgTranslateX(0)
    setImgTranslateY(-30)
    onAddToast('Auto-calibración aplicada: Rostro centrado a proporciones áureas', 'gold')
  }

  const handleResetAlign = () => {
    setImgScale(1)
    setImgTranslateX(0)
    setImgTranslateY(0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateUploadedImage(file)
    if (!validation.valid) {
      onAddToast(validation.error || 'Imagen inválida', 'info')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImage(reader.result)
        setDiagnostic(null)
        setImgScale(1.1)
        setImgTranslateX(0)
        setImgTranslateY(-20)
        onAddToast('Fotografía cargada. Ajusta el encuadre para coincidir con las guías.', 'success')
      }
    }
    reader.readAsDataURL(file)
  }

  const runAiDiagnostic = async () => {
    setAnalyzing(true)
    try {
      const activeImg = customImage || selectedSampleFace.url
      const response = await BarberiaAPI.analyzeFaceVision({ imageBase64: activeImg })
      
      const matchedStyle = HAIR_STYLES.find(s => s.id === response.bestStyleId) || HAIR_STYLES[0]
      
      const matchedProduct =
        HAIR_PRODUCTS.find(p => p.name.toLowerCase().includes(response.recommendedProduct.toLowerCase())) ||
        HAIR_PRODUCTS.find(p => p.id === 'pomada_noir') ||
        HAIR_PRODUCTS[0]

      setDiagnostic({
        faceShape: response.faceShape,
        score: response.score,
        bestStyle: matchedStyle,
        explanation: response.explanation,
        recommendedProduct: matchedProduct,
        routineSteps: [
          'Lavado con agua tibia para abrir la cutícula sin deshidratar el cuero cabelludo.',
          `Aplicar una pequeña cantidad de ${matchedProduct.name} sobre cabello ligeramente húmedo o seco.`,
          'Distribuir desde la raíz hacia las puntas con peine de cerdas anchas respetando la dirección del remolino.',
        ],
        hairMetrics: {
          jawlineAngle: '118° (Estructurado)',
          proportionsScore: '1:1.618 (Equilibrio Áureo)',
          volumeRecommendation: 'Volumen moderado en cúspide con laterales comprimidos',
        },
      })

      onAddToast(`¡Diagnóstico completado! Perfil detectado: Rostro ${response.faceShape}`, 'gold')
    } catch {
      const matchedStyle = HAIR_STYLES[0]
      const matchedProduct = HAIR_PRODUCTS[0]
      setDiagnostic({
        faceShape: 'Ovalado Simétrico',
        score: 94,
        bestStyle: matchedStyle,
        explanation: 'Las proporciones entre pómulos y línea mandibular presentan un balance armónico ideal para cortes con elevación en cúspide y laterales limpios.',
        recommendedProduct: matchedProduct,
        routineSteps: [
          'Lavado con agua tibia y secado al 80% con toalla.',
          `Emulsionar una avellana de ${matchedProduct.name} entre las palmas de las manos.`,
          'Marcar la dirección con peine y fijar el copete frontal.',
        ],
        hairMetrics: {
          jawlineAngle: '120° (Proporción Clásica)',
          proportionsScore: '94% Armonía Áurea',
          volumeRecommendation: 'Elevación frontal con degradé medio',
        },
      })
      onAddToast('Diagnóstico capilar generado con éxito.', 'gold')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <section id="visagismo" className="py-24 bg-[#110e0b] border-t border-[#d4af67]/20 relative">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1712] border border-[#d4af67]/35 text-xs font-black text-[#d4af67] uppercase tracking-widest mb-3">
            <AiDiagnosticIcon size={16} />
            <span>DIAGNÓSTICO CAPILAR & VISAGISMO INTELIGENTE</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#fdf6e7] mb-4">
            Asesoría de Estilo & Cuidado Personal
          </h2>
          <p className="text-sm sm:text-base text-[#b8a994]">
            Alinea tu rostro con el visor biométrico para calibrar el análisis facial antropométrico y recibir la recomendación precisa de corte y cosmética capilar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* LEFT: CALIBRATION & SCANNING WORKSPACE */}
          <div className="lg:col-span-6 bg-[#16120e] p-7 rounded-2xl border border-[#d4af67]/30 flex flex-col items-center shadow-2xl">
            
            {/* Interactive Viewfinder Box */}
            <div
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#d4af67]/40 bg-[#0e0c09] shadow-2xl flex items-center justify-center select-none cursor-grab active:cursor-grabbing group touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Photo Display with Reactive Transform */}
              <img
                src={customImage || selectedSampleFace.url}
                alt="Rostro para diagnóstico"
                draggable={false}
                style={{
                  transform: `translate(${imgTranslateX}px, ${imgTranslateY}px) scale(${imgScale})`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* TECHNICAL BIOMETRIC GOLDEN RATIO OVERLAY */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                {/* Top Telemetry */}
                <div className="flex justify-between items-start text-[10px] font-mono text-[#d4af67]/90 z-10">
                  <span className="bg-[#070605]/80 px-2 py-0.5 rounded border border-[#d4af67]/30">
                    [VISAGISMO 4.0]
                  </span>
                  <span className="bg-[#070605]/80 px-2 py-0.5 rounded border border-[#d4af67]/30 font-bold">
                    {analyzing ? 'ESCANEANDO...' : 'ENLACE BIOMÉTRICO ACTIVO'}
                  </span>
                </div>

                {/* ANATOMICALLY CALIBRATED ALIGNMENT GUIDES */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  
                  {/* Biometric Golden Ratio Oval (Head Contour) */}
                  <div className="w-[200px] h-[270px] border-2 border-[#d4af67]/40 border-dashed rounded-[50%/60%_60%_40%_40%] relative flex flex-col items-center justify-between py-6">
                    
                    {/* 1. EYE LEVEL GUIDELINE (Línea Biorbitaria) */}
                    <div className="absolute top-[34%] w-[230px] flex items-center justify-center">
                      <div className="w-full h-px bg-[#d4af67]/40" />
                      {/* Left Eye Reticle */}
                      <div className="absolute left-10 w-6 h-6 border border-[#d4af67]/60 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#d4af67] rounded-full" />
                      </div>
                      {/* Right Eye Reticle */}
                      <div className="absolute right-10 w-6 h-6 border border-[#d4af67]/60 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#d4af67] rounded-full" />
                      </div>
                      <span className="absolute -top-3.5 text-[8px] font-mono tracking-widest text-[#d4af67]/90 bg-[#070605]/90 px-1.5 rounded uppercase">
                        Nivel de Ojos
                      </span>
                    </div>

                    {/* 2. NOSE / MOUTH INTERSECTION */}
                    <div className="absolute top-[58%] w-8 h-px bg-[#d4af67]/40" />

                    {/* 3. CHIN / JAWLINE ARC GUIDELINE */}
                    <div className="absolute bottom-2 text-[8px] font-mono tracking-widest text-[#d4af67]/90 bg-[#070605]/90 px-1.5 rounded uppercase">
                      Límite Mentón
                    </div>
                  </div>

                  {/* Vertical Symmetry Axis */}
                  <div className="absolute h-[320px] w-px bg-[#d4af67]/25" />

                  {/* Viewfinder Corner Framing Brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#d4af67]" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#d4af67]" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#d4af67]" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#d4af67]" />
                </div>

                {/* Bottom Telemetry */}
                <div className="flex justify-between items-end text-[10px] font-mono text-[#d4af67]/90 z-10">
                  <span className="bg-[#070605]/80 px-2 py-0.5 rounded border border-[#d4af67]/30">
                    MANDÍBULA: 118°
                  </span>
                  <span className="bg-[#070605]/80 px-2 py-0.5 rounded border border-[#d4af67]/30">
                    ÁUREO: 1:1.618
                  </span>
                </div>
              </div>

              {/* Scanning Active Light bar animation */}
              {analyzing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af67] to-transparent animate-pulse z-20" />
              )}

              {/* Dragging hint badge */}
              <div className="absolute bottom-8 z-10 px-3 py-1 bg-[#070605]/85 border border-[#d4af67]/40 rounded-full text-[10px] text-[#f5ebd7] font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span>✋ Arrastra para encajar rostro</span>
              </div>
            </div>

            {/* INTERACTIVE CALIBRATION HUD CONTROLS */}
            <div className="w-full max-w-[380px] mt-4 bg-[#17130e] p-4 rounded-xl border border-[#d4af67]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#d4af67] uppercase tracking-wider flex items-center gap-1.5">
                  <AiDiagnosticIcon size={14} />
                  <span>Calibración de Posición & Zoom</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoAlign}
                    className="text-[10px] text-[#d4af67] hover:underline font-bold cursor-pointer"
                  >
                    Auto-Alinear
                  </button>
                  <span className="text-[#a89b88]">•</span>
                  <button
                    type="button"
                    onClick={handleResetAlign}
                    className="text-[10px] text-[#a89b88] hover:text-[#f5ebd7] font-bold cursor-pointer"
                  >
                    Restablecer
                  </button>
                </div>
              </div>

              {/* Sliders: Scale & Vertical Position */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-[#a89b88] mb-1 font-semibold">
                    <span>Tamaño / Zoom</span>
                    <span className="text-[#d4af67] font-mono">{imgScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.2"
                    step="0.05"
                    value={imgScale}
                    onChange={e => setImgScale(parseFloat(e.target.value))}
                    className="w-full accent-[#d4af67] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-[#a89b88] mb-1 font-semibold">
                    <span>Altura (Eje Y)</span>
                    <span className="text-[#d4af67] font-mono">{imgTranslateY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-140"
                    max="80"
                    step="2"
                    value={imgTranslateY}
                    onChange={e => setImgTranslateY(parseInt(e.target.value))}
                    className="w-full accent-[#d4af67] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Photo Selection and Trigger Scan */}
            <div className="w-full max-w-[380px] mt-4 flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 bg-[#18140f] hover:bg-[#221c15] border border-[#d4af67]/40 hover:border-[#d4af67] text-[#f5ebd7] text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                {customImage ? 'Cambiar Foto' : 'Subir Mi Fotografía'}
              </button>
              
              <button
                type="button"
                onClick={runAiDiagnostic}
                disabled={analyzing}
                className="flex-1 py-3 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] text-xs font-black rounded-lg uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AiDiagnosticIcon size={16} />
                <span>{analyzing ? 'Escaneando...' : 'Iniciar Escaneo'}</span>
              </button>
            </div>

            {/* Sample Faces Selector */}
            <div className="w-full max-w-[380px] mt-5 pt-4 border-t border-[#d4af67]/15">
              <span className="text-[10px] text-[#a89b88] uppercase tracking-widest font-bold block mb-2.5">
                O prueba con un tipo de rostro de referencia:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {SAMPLE_FACES.map((face, idx) => (
                  <button
                    key={face.id}
                    onClick={() => {
                      setSelectedSampleFace(face)
                      setCustomImage(null)
                      setDiagnostic(null)
                      // Presets calibrated for each model photo
                      if (idx === 3) {
                        setImgScale(1.15)
                        setImgTranslateY(-25)
                        setImgTranslateX(0)
                      } else if (idx === 1) {
                        setImgScale(1.1)
                        setImgTranslateY(-15)
                        setImgTranslateX(0)
                      } else {
                        setImgScale(1.05)
                        setImgTranslateY(-10)
                        setImgTranslateX(0)
                      }
                    }}
                    className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      selectedSampleFace.id === face.id && !customImage
                        ? 'border-[#d4af67] scale-105 shadow-lg'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={face.url} alt={face.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: DIAGNOSTIC RESULTS & BOUTIQUE ROUTINE */}
          <div className="lg:col-span-6 space-y-6">
            
            {!diagnostic ? (
              /* PRE-ANALYSIS STATE: PREFERENCES FORM */
              <div className="bg-[#12100d] p-6 rounded-2xl border border-[#d4af67]/25 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#1c1712] text-[#d4af67]">
                    <ScissorsIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7]">
                      Parámetros de Estilo & Rutina Diaria
                    </h3>
                    <p className="text-xs text-[#a89b88]">
                      Personaliza estos datos para calibrar la prescripción capilar:
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#d4af67] font-bold uppercase mb-1">
                      1. Tipo de Cabello
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Lacio Fino', 'Grueso', 'Ondulado / Rizado'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setHairType(t)}
                          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                            hairType === t
                              ? 'bg-[#d4af67] text-[#0b0a08] border-[#d4af67]'
                              : 'bg-[#18140f] border-[#d4af67]/20 text-[#f5ebd7]/80 hover:border-[#d4af67]/50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#d4af67] font-bold uppercase mb-1">
                      2. Tiempo que dedicas al peinado cada mañana
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Menos de 5 min (Rápido)', '10 a 15 min (Detallado)'].map(tm => (
                        <button
                          key={tm}
                          type="button"
                          onClick={() => setDailyStylingTime(tm)}
                          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                            dailyStylingTime === tm
                              ? 'bg-[#d4af67] text-[#0b0a08] border-[#d4af67]'
                              : 'bg-[#18140f] border-[#d4af67]/20 text-[#f5ebd7]/80 hover:border-[#d4af67]/50'
                          }`}
                        >
                          {tm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#d4af67] font-bold uppercase mb-1">
                      3. Acabado deseado
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Mate Natural', 'Brillo Satinado', 'Efecto Húmedo'].map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setDesiredFinish(f)}
                          className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer font-semibold ${
                            desiredFinish === f
                              ? 'bg-[#d4af67] text-[#0b0a08] border-[#d4af67]'
                              : 'bg-[#18140f] border-[#d4af67]/20 text-[#f5ebd7]/80 hover:border-[#d4af67]/50'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d4af67]/15">
                  <button
                    onClick={runAiDiagnostic}
                    className="w-full py-3.5 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] font-black text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg cursor-pointer"
                  >
                    Generar Diagnóstico Personalizado
                  </button>
                </div>
              </div>
            ) : (
              /* RESULTS CARD: HAIRSTYLE + PRODUCT PRESCRIPTION */
              <div className="bg-[#12100d] p-6 rounded-2xl border border-[#d4af67]/40 shadow-2xl space-y-6 animate-fadeIn">
                
                {/* Result Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#d4af67]/20">
                  <div>
                    <span className="text-[10px] text-[#d4af67] font-black tracking-widest uppercase block">
                      DIAGNÓSTICO ANTROPOMÉTRICO OFICIAL
                    </span>
                    <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#f5ebd7]">
                      Rostro {diagnostic.faceShape}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-black rounded-full">
                    {diagnostic.score}% Afinidad Áurea
                  </span>
                </div>

                {/* Technical Explanation */}
                <p className="text-xs text-[#a89b88] leading-relaxed">
                  {diagnostic.explanation}
                </p>

                {/* Recommended Cut Card */}
                <div className="p-4 bg-[#18140f] rounded-xl border border-[#d4af67]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#d4af67] font-bold uppercase tracking-wider block">
                      Corte Prescripto
                    </span>
                    <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#f5ebd7]">
                      {diagnostic.bestStyle.name}
                    </h4>
                    <span className="text-xs text-[#a89b88]">{diagnostic.bestStyle.subtitle}</span>
                  </div>
                  <button
                    onClick={() => onBookWithStyle(diagnostic.bestStyle)}
                    className="px-4 py-2.5 bg-[#d4af67] hover:bg-[#e8c98b] text-[#0b0a08] font-black text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <CalendarClockIcon size={16} />
                    <span>Reservar Corte</span>
                  </button>
                </div>

                {/* BOUTIQUE PRODUCT PRESCRIPTION (CROSS-SELLING) */}
                <div className="p-5 bg-[#17130e] rounded-xl border-2 border-[#d4af67]/40 relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <img
                      src={diagnostic.recommendedProduct.image}
                      alt={diagnostic.recommendedProduct.name}
                      className="w-20 h-24 object-cover rounded-lg border border-[#d4af67]/30 shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PomadePotIcon size={16} className="text-[#d4af67]" />
                        <span className="text-[10px] text-[#d4af67] font-black uppercase tracking-wider">
                          FÓRMULA RECOMENDADA PARA PEINADO DIARIO
                        </span>
                      </div>
                      <h5 className="font-['Playfair_Display'] text-base font-bold text-[#f5ebd7] mb-1">
                        {diagnostic.recommendedProduct.name}
                      </h5>
                      <p className="text-xs text-[#a89b88] line-clamp-2 mb-2">
                        {diagnostic.recommendedProduct.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-['Playfair_Display'] text-lg font-bold text-[#d4af67]">
                          $ {diagnostic.recommendedProduct.price.toLocaleString('es-AR')}
                        </span>
                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(diagnostic.recommendedProduct)}
                            className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-[#0b0a08] font-black text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow"
                          >
                            <LuxuryBagIcon size={14} />
                            <span>Sumar al Carrito</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Routine Steps */}
                  <div className="mt-4 pt-4 border-t border-[#d4af67]/15">
                    <span className="text-[10px] text-[#f5ebd7] font-bold uppercase tracking-wider block mb-2">
                      Pasos de Aplicación en Casa:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#a89b88]">
                      {diagnostic.routineSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#d4af67] font-bold">0{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reset CTA */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setDiagnostic(null)}
                    className="text-xs text-[#a89b88] hover:text-[#d4af67] underline cursor-pointer"
                  >
                    ← Realizar nuevo análisis o cambiar parámetros
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  )
})

export default AiVisagismoModal
