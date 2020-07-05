import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Kanception from "../images/kanception.png"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Kanban Home" />
    <h1>A recursive Kanban board</h1>
    <a className="sign-up-btn" href="https://app.kanception.io">Sign In / Sign Up</a>
    <img style={{
        boxShadow: "0 0 5px 10px #ccc",
        margin: "40px auto",
        borderRadius: "5px"
      }}
      src={Kanception}
    />
  </Layout>
)

export default IndexPage
