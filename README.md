# Kanception (Now Open Source)
![Logo](https://github.com/hpennington/kanception/blob/master/marketing/src/images/logo.png)

www.kanception.io

![Logo](https://github.com/hpennington/kanception/blob/master/marketing/src/images/kanception.png)

## Contributing

Please come help me work on this project. It needs security hardening, performance optimizations, and lots of features added. Don't hesitate to make a PR!

The code base is a bit of a mess, but it is still quite small. So, it shouln't be hard to clean up.

The tech stack is React, NodeJS, MongoDB, and Docker.

### Roadmap

  - Migrate to MVC architecture with repository layer
  - Move all client_ids, and secrets to a .env file

### Getting started

 - Create auth0 account and configure an application with login / logout / origin urls
 - Add you client_secret from auth0 to api/index.js
 - git clone https://github.com/hpennington/kanception.git
 - cd kanception
 - cp api/sample.env api/.env
 - docker-compose up
 - goto localhost:3000
