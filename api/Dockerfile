FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y npm nodejs

RUN groupadd -r ubuntu && useradd -r -g ubuntu ubuntu && \
    mkdir /home/ubuntu && chown ubuntu:ubuntu /home/ubuntu

USER ubuntu
RUN mkdir -p /home/ubuntu/api
WORKDIR /home/ubuntu/api
COPY package*.json ./
RUN npm install

COPY --chown=ubuntu:ubuntu ./ /home/ubuntu/api
CMD ["npm", "run", "dev"]
