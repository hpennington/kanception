import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Kanception from "../images/kanception.png"
import GraphImage from "./graph.png"
import Demo from './demo.mp4'
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Kanban Home" />
    <MainVideoBlock />
    <KanbanDetailBlock />
  </Layout>
)

const MainVideoBlock = () => (
  <>
    <h1 className="center-text mid-width">A nested Kanban board for creative teams</h1>
    <a className="sign-up-btn" href="https://app.kanception.io">Sign In / Sign Up</a>
    <video
      className="main-video"
      autoPlay={true}
      loop={true}
      controls={true}
      muted={true}
      width={900}
      style={{
        boxShadow: "0 0 5px 10px #ccc",
        margin: "40px auto",
        borderRadius: "5px",
      }}
    >
      <source src={Demo} type="video/mp4" />
    </video>
  </>
)

const KanbanDetailBlock = () => (
  <div className="kanban-detail-block">
    <img style={{marginRight: '20px'}} src={GraphImage} alt="kanban graph" />
    <div
      className="card"
    >
      <h1 style={{fontSize: '2.5em', fontStyle: 'normal', color: '#555'}}>Break down large tasks into bite-sized, nested subtasks.</h1>
    </div>
  </div>
)

export default IndexPage
