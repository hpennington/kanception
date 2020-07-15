import React, { useRef, useEffect } from 'react'

const GanttCanvas = props => {
  const canvasRef = useRef(null)

    useEffect(() => {
      if (canvasRef !== null) {
        draw()
      }
    })

   const draw = () => {
     const canvas = canvasRef.current
     if (canvas.getContext) {
       const ctx = canvas.getContext('2d')
       ctx.clearRect(0, 0, props.width, props.height)

       // Draw horizontal lines
       ctx.beginPath()
       ctx.setLineDash([2, 4])
       ctx.lineWidth = 1
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
       ctx.lineWidth = 1
       ctx.strokeStyle = 'black'

       for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
         ctx.moveTo(index * 150, 0);
         ctx.lineTo(index * 150, props.height);
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
