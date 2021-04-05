# Kanception (Now Open Source)
![Logo](https://github.com/hpennington/kanception/blob/master/marketing/src/images/logo.png)

www.kanception.io

![Logo](https://github.com/hpennington/kanception/blob/master/marketing/src/images/kanception.png)

## Contributing

. It needs security hardening, performance optimizations, and lots of features added. Don't hesitate to make a PR!

The code base is a bit of a mess, but it is still quite small. So, it shouln't be hard to clean up.

The tech stack is React, NodeJS, MongoDB (Migrating to Postgres) MERN -> PERN.

### Roadmap

  - Move all client_ids, and secrets to a .env file
  - Migrate to a repository layer
  - Migrate to Sequelize
  - Migrate to Heroku & Netlify
  - Create CI/CD pipeline

### Getting started

 - git clone https://github.com/hpennington/kanception.git
 - cp kanception/sample.env kanception/.env
 - docker-compose up
 - goto localhost:3000
