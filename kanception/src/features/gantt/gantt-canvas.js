import React, { useState, useRef, useEffect } from 'react'

const GanttCanvas = props => {
  const canvasRef = useRef(null)
  var dragPosition = {x: 0, y: 0}
  var dragging = false
  const now = new Date().getTime()

  useEffect(() => {
    if (canvasRef !== null) {
      console.log('Adding event listeners')
      canvasRef.current.addEventListener('mousedown', onMouseDown)
      canvasRef.current.addEventListener('mousemove', onMouseMove)
      canvasRef.current.addEventListener('mouseup', onMouseUp)
      canvasRef.current.addEventListener('mousecancel', onMouseUp)
      window.addEventListener('mouseup', onMouseUp)
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
    console.log('draw')
    if (canvasRef !== null) {
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
      props.onPan({x: dragPosition.x - (e.clientX - rect.left), y: e.clientY - rect.top})
      dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    }
  }

  const draw = () => {
    console.log('draw')
    const canvas = canvasRef.current
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, props.width, props.height)

      drawHorizontalLines(ctx)
      drawVerticalLines(ctx)

    }
  }

  const drawHorizontalLines = ctx => {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'

    for (const index of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (index === 2) {
        ctx.setLineDash([])
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath()
        ctx.setLineDash([2, 4])
      }

      ctx.moveTo(0, index * 50);
      ctx.lineTo(props.width, index * 50);
    }

    ctx.closePath();
    ctx.stroke();
  }

  const drawVerticalLines = ctx => {
    console.log(props.offset.x)
    const rect = canvasRef.current.getBoundingClientRect()
    const hourMS = 60 * 60 * 1000
    const milliSecondsPerPixel = hourMS / 150
    const bound0 = now - (props.offset.x * milliSecondsPerPixel)
    const bound1 = bound0 + (rect.width * milliSecondsPerPixel)
    console.log('start: ' + new Date(bound0) + ' end: ' + new Date(bound1))

    const t0 = ceilHour(bound0).getTime()
    var t = t0
    const deltaT = hourMS

    while (t < bound1) {
      const x = (t - bound0) / milliSecondsPerPixel

      ctx.beginPath()
      ctx.setLineDash([2, 4])
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.closePath()
      ctx.stroke()

      const xDate = new Date(t)
      const dateLabel = xDate.toLocaleString('en-US',
        { hour: 'numeric', hour12: true })
      const labelText = dateLabel
      const labelSize = ctx.measureText(labelText)
      const labelX = x + 4
      ctx.fillStyle = 'white'
      ctx.fillText(labelText,labelX, 44)

      t = t + deltaT
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

const ceilHour = date => {
  const p = 60 * 60 * 1000
  return new Date(Math.ceil(new Date(date).getTime() / p) * p)
}

export default GanttCanvas
