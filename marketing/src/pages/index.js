import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Kanception from "../images/kanception.png"
import GraphImage from "./graph.png"
import GanttImage from "./gantt.png"
import RoadmapImage from "./roadmap.png"
import Demo from './demo.mp4'
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Kanban Project Management Tool" />
    <MainVideoBlock />
    <KanbanDetailBlock />
    <GanttBlock />
    <RoadmapBlock />
    <PricingBlock />
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

const GanttBlock = () => (
  <div style={{background: 'white', width: '100vw', textAlign: 'center'}}>
    <h1 style={{fontSize: '3em', margin: '40px auto', maxWidth: '700px'}}>Schedule cards with the Gantt chart</h1>
    <img style={{maxWidth: '95%'}} src={GanttImage} alt="Gantt Chart" />
  </div>
)

const RoadmapBlock = () => (
  <div
    style={{
      background: '#0090E5',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <h1 style={{fontSize: '3em', margin: '40px auto'}}>Roadmap</h1>
    <img src={RoadmapImage} alt="Roadmap" />
  </div>
)

const PricingBlock = () => (
  <div
    style={{
      background: 'black',
      width: '100vw',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <h1 style={{fontSize: '4em', margin: '40px auto', textAlign: 'center'}}>Pricing</h1>
    <h1 style={{fontSize: '4em', margin: '60px auto', textAlign: 'center'}}>It's free!</h1>
    <a className="sign-up-btn sign-up-btn-bottom" href="https://app.kanception.io">Sign In / Sign Up</a>
  </div>
)

export default IndexPage
