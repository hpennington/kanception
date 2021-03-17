import React, { useEffect, useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Kanception from "../images/kanception.png"
import GraphImage from "./graph.png"
import GanttImage from "./gantt.png"
import RoadmapImage from "./roadmap.png"
import Demo from './demo.mp4'
import GanttDemo from './gantt.mp4'
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Kanban Board | Project Management Software" />
    <MainBlock />
    <CurveBlock />
    <KanbanDetailBlock />
    <GanttBlock />
    <RoadmapBlock />
    <PricingBlock />
    <ContactBlock />
  </Layout>
)

const MainBlock = () => (
  <>
    <div className="top-block">
      <div className="top-block-inner">
        <h1 className="title center-text mid-width">A Nested Kanban Board for Creative Teams</h1>
        <h2>Breakdown tasks in a natural way with nested cards. Organize your tasks and plan your day.
        </h2>
        <p style={{whiteSpace: "nowrap"}}>In Beta</p>
        <a style={{whiteSpace: "nowrap"}} className="sign-up-btn" href="https://app.kanception.io">Sign In / Sign Up</a>
      </div>
    </div>
  </>
)

const CurveBlock = () => (
  <svg
    viewBox="0 0 500 150"
    preserveAspectRatio="none"
    style={{height: "100%", width: "100%", marginBottom: "-1px"}}
  >
    <defs>
      <linearGradient id="gradient">
        <stop offset="0%" style={{stopColor: "#6f27cf"}} />
        <stop offset="100%" style={{stopColor: "#4d27cf"}} />
      </linearGradient>
    </defs>
    <g fill={"url(#gradient)"}>
      <path
        d="M0.00,49.98 C247.74,167.27 246.05,-24.17 500.00,49.98 L523.14,173.19 L0.00,150.00 Z"
        style={{stroke: "none"}}>
      </path>
    </g>
  </svg>
)

const KanbanDetailBlock = () => (
  <div className="kanban-detail-text-block">
    <h4>Team based project management software.</h4>
    <h4>Create spaces, projects, boards, and nested cards with the Kanban board.</h4>
  <div className="kanban-detail-block">
    <div className="card-container">
      <div
        className="card"
      >
        <div className="color-strip blue">
        </div>
        <h2 style={{fontSize: '1em', fontstyle: 'normal', color: '#555'}}>Break down large tasks into bite-sized, nested subtasks.</h2>
      </div>
      <div
        className="card"
      >
        <div className="color-strip red">
        </div>
        <h2 style={{fontSize: '1em', fontstyle: 'normal', color: '#555'}}>Use the nested Kanban board to model the hierarchy that is inherent to complex tasks.</h2>
      </div>
      <div
        className="card"
      >
        <div className="color-strip blue">
        </div>
        <h2 style={{fontSize: '1em', fontstyle: 'normal', color: '#555'}}>Give your brain a break.</h2>
      </div>
    </div>
    <img src={GraphImage} alt="kanban graph" />
  </div>
  </div>
)

const GanttBlock = () => (
  <div className="gantt-block" style={{paddingBottom: "40px", background: 'white', width: '100vw', textAlign: 'center'}}>
    <h2 style={{margin: "40px", fontSize: "2em"}}>Video Demo</h2>
    <p style={{textAlign: "center"}}>Single click on a card to access the inner Kanban board.</p>
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
    <p>
      Here at Kanception we believe apps should be intuitive and simple to use.
      We have a standard Gantt chart with the key difference being it is nested, like the Kanban board.
    </p>
  </div>
)

const RoadmapBlock = () => (
  <div
    className="roadmap-block"
    style={{
      background: '#0090E5',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <h1 style={{margin: '40px auto'}}>Product Roadmap</h1>
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
    <h1 style={{fontsize: '4em', margin: '60px auto', textalign: 'center'}}>It's free!</h1>
    <a className="sign-up-btn sign-up-btn-bottom" href="https://app.kanception.io">Sign In / Sign Up</a>
    <p>We will offer paid features in the future.</p>
  </div>
)

const ContactBlock = () => (
  <div
    style={{
      background: 'black',
      width: '100vw',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <p>Contact us @ info@kanception.io</p>
  </div>
)

export default IndexPage
