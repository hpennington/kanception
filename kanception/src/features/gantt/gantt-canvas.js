import React, { useState, useRef, useEffect } from 'react'

const hourMS = 60 * 60 * 1000
const dayMS = 24 * hourMS
const HOUR = 'hour'
const DAY = 'day'
const MONTH = 'month'


class GanttCanvas extends React.Component {

  constructor(props) {
    super(props)

    this.dragPosition = {x: 0, y: 0}
    this.dragging = false
    this.now = new Date().getTime()

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)
  }

  componentDidMount = () => {
    const canvasRef = this.refs.canvas
    if (canvasRef != null) {
      console.log('Adding event listeners')
      canvasRef.addEventListener('mousedown', this.onMouseDown)
      canvasRef.addEventListener('mousemove', this.onMouseMove)
      canvasRef.addEventListener('mouseup', this.onMouseUp)
      canvasRef.addEventListener('mousecancel', this.onMouseUp)
      canvasRef.addEventListener('dblclick', this.onDoubleClick)
      window.addEventListener('mouseup', this.onMouseUp)
    }

    if (canvasRef != null) {
      this.draw()
    }
  }

  componentWillUnmount = () => {
    const canvasRef = this.refs.canvas
    canvasRef.removeEventListener('mousedown', this.onMouseDown)
    canvasRef.removeEventListener('mousemove', this.onMouseMove)
    canvasRef.removeEventListener('mouseup', this.onMouseUp)
    canvasRef.removeEventListener('mousecancel', this.onMouseUp)
    canvasRef.removeEventListener('dblclick', this.onDoubleClick)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

  componentDidUpdate = () => {
    const canvasRef = this.refs.canvas
    if (canvasRef != null) {
      this.draw()
    }
  }

  onMouseDown = e => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    this.dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    this.dragging = true
  }

  onMouseUp = e => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    this.dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    this.dragging = false
  }

  onMouseMove = e => {
    const canvasRef = this.refs.canvas
    if (this.dragging === true) {
      const rect = canvasRef.getBoundingClientRect()
      this.props.onPan({
        x: this.dragPosition.x - (e.clientX - rect.left),
        y: -(this.dragPosition.y - (e.clientY - rect.top))
      })

      this.dragPosition = {x: e.clientX - rect.left, y: e.clientY - rect.top}
    }
  }

  onDoubleClick = e => {
    const canvasRef = this.refs.canvas
    const rowHeight = 50
    const rect = canvasRef.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top - rowHeight

    if (y > 0) {
      // Determine row
      const row = Math.floor((y / rowHeight) + (this.props.offset.y / rowHeight))
      console.log({row})

      // Determine clicked time
      const deltaT = this.props.granularity === HOUR ? hourMS : dayMS
      const milliSecondsPerPixel = deltaT / 150
      const bound0 = this.now - (this.props.offset.x * milliSecondsPerPixel)
      const time = bound0 + (x * milliSecondsPerPixel)

      this.props.onAddNode(this.props.nodes[row]._id, time)
    }
  }

  draw = () => {
    const canvasRef = this.refs.canvas
    const canvas = canvasRef
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, this.props.width, this.props.height)

      this.drawHorizontalLines(ctx)
      this.drawVerticalLines(ctx)
      this.drawNodes(ctx)
      this.drawTopbar(ctx)
      this.drawTicks(ctx)
      this.drawTickText(ctx)
    }
  }

  drawHorizontalLines = ctx => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    const rowHeight = 50
    ctx.beginPath()
    ctx.setLineDash([])
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.moveTo(0, rowHeight)
    ctx.lineTo(this.props.width, rowHeight)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.rect(0, 0, rect.width, rowHeight)
    ctx.fillStyle = '#1c1c1c'
    ctx.zIndex = '100'
    ctx.closePath()
    ctx.fill()

    if ((rowHeight * 2) + (this.props.boards.length * rowHeight) > rect.height) {
      for (const index of [...Array(this.props.boards.length).keys()]) {
        ctx.beginPath()
        ctx.setLineDash([2, 4])
        const y = rowHeight + (-this.props.offset.y % rowHeight) + (index * rowHeight)

        ctx.moveTo(0, y > rowHeight ? y : rowHeight)
        ctx.lineTo(this.props.width, y > rowHeight ? y : rowHeight )
        ctx.closePath()
        ctx.stroke()
      }
    } else {
      for (const index of [...Array(this.props.boards.length).keys()]) {
        ctx.beginPath()
        ctx.setLineDash([2, 4])
        const y = (rowHeight * 2) + (index * 50)
        ctx.moveTo(0, y)
        ctx.lineTo(this.props.width, y)
        ctx.closePath()
        ctx.stroke()
      }
    }

  }

  drawVerticalLines = ctx => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    const deltaT = this.props.granularity === HOUR ? hourMS : dayMS
    const milliSecondsPerPixel = deltaT / 150
    const bound0 = this.now - (this.props.offset.x * milliSecondsPerPixel)
    const bound1 = bound0 + (rect.width * milliSecondsPerPixel)
    //console.log('start: ' + new Date(bound0) + ' end: ' + new Date(bound1))
    //
    const ceilFunction = this.props.granularity === HOUR ? ceilHour : ceilDay
    console.log(this.props.granularity)

    const t0 = ceilFunction(bound0).getTime()
    console.log(new Date(t0))
    var t = t0

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


      t = t + deltaT
    }
  }

  drawTickText = ctx => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    const deltaT = this.props.granularity === HOUR ? hourMS : dayMS
    const milliSecondsPerPixel = deltaT / 150
    const bound0 = this.now - (this.props.offset.x * milliSecondsPerPixel)
    const bound1 = bound0 + (rect.width * milliSecondsPerPixel)
    console.log('start: ' + new Date(bound0) + ' end: ' + new Date(bound1))
    const ceilFunction = this.props.granularity === HOUR ? ceilHour : ceilDay

    const t0 = ceilFunction(bound0).getTime()
    var t = t0

    while (t < bound1) {
      const x = (t - bound0) / milliSecondsPerPixel

      ctx.font = '14px Arial'
      const xDate = new Date(t)
      const dateLabel = this.props.granularity === HOUR
        ? xDate.toLocaleString('en-US', { hour: 'numeric', hour12: true })
        : xDate.toLocaleString('en-US', { day: 'numeric'})
      const labelText = dateLabel
      const labelSize = ctx.measureText(labelText)
      const labelX = x + 4
      ctx.fillStyle = 'white'
      ctx.fillText(labelText,labelX, 40)

      t = t + deltaT
    }
  }

  drawTopbar = ctx => {
    const rowHeight = 50
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    ctx.beginPath()
    ctx.rect(0, 0, rect.width, rowHeight)
    ctx.fillStyle = '#1c1c1c'
    ctx.closePath()
    ctx.fill()
  }

  drawTicks = ctx => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    const deltaT = this.props.granularity === HOUR ? hourMS : dayMS
    const milliSecondsPerPixel = deltaT / 150
    const bound0 = this.now - (this.props.offset.x * milliSecondsPerPixel)
    const bound1 = bound0 + (rect.width * milliSecondsPerPixel)
    //console.log('start: ' + new Date(bound0) + ' end: ' + new Date(bound1))
    const rowHeight = 50

    const ceilFunction = this.props.granularity === HOUR ? ceilHour : ceilDay
    const t0 = ceilFunction(bound0).getTime()
    var t = t0

    while (t < bound1) {
      const x = (t - bound0) / milliSecondsPerPixel

      ctx.beginPath()
      ctx.setLineDash([2, 4])
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rowHeight)
      ctx.closePath()
      ctx.stroke()


      t = t + deltaT
    }

  }

  drawNodes = ctx => {
    const canvasRef = this.refs.canvas
    const rect = canvasRef.getBoundingClientRect()
    const deltaT = this.props.granularity === HOUR ? hourMS : dayMS
    const milliSecondsPerPixel = deltaT / 150
    const bound0 = this.now - (this.props.offset.x * milliSecondsPerPixel)
    const bound1 = bound0 + (rect.width * milliSecondsPerPixel)

    var index = 0
    for (const node of this.props.nodes.map(board => [board.start, board.end])) {
      const t0 = node[0]
      const t1 = node[1]
      if (t0 >= bound0 && t0 <= bound1
        || t1 >= bound0
      ) {
        const x = (t0 - bound0) / milliSecondsPerPixel
        const rowHeight = 50
        const padding = 10
        const y = padding + rowHeight + (-this.props.offset.y) + (index * rowHeight)
        //const y = padding + rowHeight + index * rowHeight - (this.props.offset.y % rowHeight)
        ctx.fillStyle = "rgba(95, 54, 179, 0.5)"
        const nodeWidth = (t1 - t0) * (1 / milliSecondsPerPixel)
        ctx.roundedRect(x, y, nodeWidth, rowHeight - padding * 2, 5)
        ctx.stroke()
        ctx.fill()
      }
      index += 1
    }

  }

  render = () => {
    return (
      <canvas
        ref="canvas"
        height={this.props.height}
        width={this.props.width}
      >
      </canvas>
    )
  }
}

const ceilHour = date => {
  const p = 60 * 60 * 1000
  return new Date(Math.ceil(new Date(date).getTime() / p) * p)
}

const ceilDay = date => {
  const p = 24 * 60 * 60 * 1000
  const newDate = new Date(date + p)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setMilliseconds(0)
  return newDate
}

CanvasRenderingContext2D.prototype.roundedRect = function(x, y, w, h, r) {
 // if (w < 2 * r) r = w / 2;
 // if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}

export default GanttCanvas
