FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y npm nodejs

RUN groupadd -r ubuntu && useradd -r -g ubuntu ubuntu && \
    mkdir /home/ubuntu && chown ubuntu:ubuntu /home/ubuntu

USER ubuntu
RUN mkdir -p /home/ubuntu/kanception
WORKDIR /home/ubuntu/kanception
COPY package*.json ./
RUN npm install

COPY --chown=ubuntu:ubuntu . /home/ubuntu/kanception

CMD ["npm", "run", "start"]

