import React, { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Floating macOS-style overlay scrollbar:
 * - Zero layout shift (native scrollbar hidden)
 * - Appears smoothly on right-edge hover or scroll, fades out on idle
 * - Thick, easy-to-grab pill thumb with direct click-and-drag support
 */
const CustomScrollbar: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [thumbHeight, setThumbHeight] = useState(64)
  const [thumbTop, setThumbTop] = useState(0)
  const [scrollable, setScrollable] = useState(false)

  const hideTimerRef = useRef<number | undefined>(undefined)
  const dragStartYRef = useRef(0)
  const dragStartScrollRef = useRef(0)

  const updateMetrics = useCallback(() => {
    const doc = document.documentElement
    const scrollHeight = doc.scrollHeight
    const clientHeight = window.innerHeight
    const maxScroll = scrollHeight - clientHeight

    if (maxScroll <= 10) {
      setScrollable(false)
      return
    }
    setScrollable(true)

    const trackPadding = 12
    const trackHeight = clientHeight - trackPadding * 2
    const calculatedHeight = Math.max(48, (clientHeight / scrollHeight) * trackHeight)
    const maxThumbTop = trackHeight - calculatedHeight
    const progress = window.scrollY / maxScroll

    setThumbHeight(calculatedHeight)
    setThumbTop(trackPadding + progress * maxThumbTop)
  }, [])

  const revealTemporarily = useCallback((ms = 1100) => {
    setVisible(true)
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = undefined
    }
    if (ms > 0) {
      hideTimerRef.current = window.setTimeout(() => {
        hideTimerRef.current = undefined
        setVisible(false)
      }, ms)
    }
  }, [])

  useEffect(() => {
    updateMetrics()

    const onScroll = () => {
      updateMetrics()
      revealTemporarily(1100)
    }

    const onResize = () => updateMetrics()

    const onMouseMove = (e: MouseEvent) => {
      if (dragging) return
      if (e.clientX >= window.innerWidth - 44) {
        revealTemporarily(0)
      } else if (!hideTimerRef.current) {
        setVisible(false)
      }
    }

    const onMouseLeave = () => {
      if (!dragging) {
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = undefined
        setVisible(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    const resizeObserver = new ResizeObserver(updateMetrics)
    resizeObserver.observe(document.body)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      resizeObserver.disconnect()
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [dragging, revealTemporarily, updateMetrics])

  useEffect(() => {
    if (!dragging) return

    const onDragMove = (e: MouseEvent) => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - window.innerHeight
      const trackHeight = window.innerHeight - 24
      const maxThumbTravel = trackHeight - thumbHeight
      if (maxThumbTravel <= 0) return

      const deltaY = e.clientY - dragStartYRef.current
      const scrollDelta = (deltaY / maxThumbTravel) * maxScroll
      window.scrollTo({ top: dragStartScrollRef.current + scrollDelta, behavior: 'auto' })
    }

    const onDragEnd = () => {
      setDragging(false)
      revealTemporarily(900)
    }

    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    return () => {
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup', onDragEnd)
    }
  }, [dragging, thumbHeight, revealTemporarily])

  if (!scrollable) return null

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragStartYRef.current = e.clientY
    dragStartScrollRef.current = window.scrollY
    setDragging(true)
    setVisible(true)
  }

  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed top-0 right-1.5 bottom-0 z-50 pointer-events-none select-none"
      style={{ width: 12 }}
    >
      <div
        onMouseDown={handleThumbMouseDown}
        onMouseEnter={() => revealTemporarily(0)}
        className={`pointer-events-auto absolute right-0 rounded-full cursor-grab active:cursor-grabbing transition-[opacity,width,background-color] duration-200 ${
          visible || dragging ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          height: thumbHeight,
          transform: `translate3d(0, ${thumbTop}px, 0)`,
          width: dragging ? 8 : 6,
          backgroundColor: dragging ? 'rgba(212, 175, 103, 0.92)' : 'rgba(212, 175, 103, 0.6)',
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)',
        }}
      />
    </div>
  )
}

export default CustomScrollbar
