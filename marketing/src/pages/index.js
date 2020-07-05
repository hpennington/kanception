import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Kanban Home" />
    <h1>A recursive Kanban board</h1>
    <a className="sign-up-btn" href="https://app.kanception.io">Sign In / Sign Up</a>
  </Layout>
)

export default IndexPage
