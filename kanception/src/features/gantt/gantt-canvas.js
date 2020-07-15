import React, { useState, useRef, useEffect } from 'react'

const GanttCanvas = props => {
  const canvasRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  var dragPosition = {x: 0, y: 0}
  var dragging = false

  useEffect(() => {
    if (isMounted === false && canvasRef !== null) {
      console.log('Adding event listeners')
      canvasRef.current.addEventListener('mousedown', onMouseDown)
      canvasRef.current.addEventListener('mousemove', onMouseMove)
      canvasRef.current.addEventListener('mouseup', onMouseUp)
      canvasRef.current.addEventListener('mousecancel', onMouseUp)
      window.addEventListener('mouseup', onMouseUp)
      setIsMounted(true)
    }

    if (canvasRef !== null) {
      draw()
    }

    return () => {
      canvasRef.current.removeEventListener('mousedown', onMouseDown)
      canvasRef.current.removeEventListener('mousemove', onMouseMove)
      canvasRef.current.removeEventListener('mouseup', onMouseUp)
      canvasRef.current.removeEventListener('mousecancel', onMouseUp)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    if (canvasRef !== null && isMounted === true) {
      draw()
    }
  }, [props.offset, props.width, props.height])

  const onMouseDown = e => {
    const rect = canvasRef.current.getBoundingClientRect()
    dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    dragging = true
  }

  const onMouseUp = e => {
    const rect = canvasRef.current.getBoundingClientRect()
    dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    dragging = false
  }

  const onMouseMove = e => {
    if (dragging === true) {
      const rect = canvasRef.current.getBoundingClientRect()
      props.onPan({x: e.clientX - rect.left - dragPosition.x, y: e.clientY - rect.top})
    }
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, props.width, props.height)

      // Draw horizontal lines
      ctx.beginPath()
      ctx.setLineDash([2, 4])
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'

      for (const index of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        ctx.moveTo(0, index * 50);
        ctx.lineTo(props.width, index * 50);
      }

      ctx.closePath();
      ctx.stroke();

      // Draw vertical lines
      ctx.beginPath()
      ctx.setLineDash([2, 4])
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'

      for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        ctx.moveTo(props.offset.x + (index * 150), 0);
        ctx.lineTo(props.offset.x + (index * 150), props.height);
      }

      ctx.closePath();
      ctx.stroke();

    }
  }

  return (
    <canvas
      ref={canvasRef}
      height={props.height}
      width={props.width}
    >
    </canvas>
  )
}

export default GanttCanvas
