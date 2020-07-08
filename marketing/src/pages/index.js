import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Kanception from "../images/kanception.png"
import Demo from './demo.mp4'
import "./index.css"

const IndexPage = () => {
  const [width, setWidth] = useState(900)

  useEffect(() => {
    if (layout !== null) {
      const width = window.innerWidth
      if (width <= 900) {
        setWidth(width * 0.8)
      }
    }
  })

  return (
    <Layout>
      <SEO title="Kanban Home" />
      <h1 className="center-text mid-width">A nested Kanban board for creative professionals</h1>
      <a className="sign-up-btn" href="https://app.kanception.io">Sign In / Sign Up</a>
      <video
        autoPlay={true}
        loop={true}
        controls={true}
        muted={true}
        width={width}
        style={{
          boxShadow: "0 0 5px 10px #ccc",
          margin: "40px auto",
          borderRadius: "5px"
        }}
      >
        <source src={Demo} type="video/mp4" />
      </video>
    </Layout>
  )
}

export default IndexPage
