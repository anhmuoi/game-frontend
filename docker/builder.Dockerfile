FROM node:10.24.1
LABEL maintainer="The Hiep <hiep@duali.com>"

RUN mkdir -p /app/internals
WORKDIR /app

# Copy all local files into the image.
COPY ./package.json .
COPY ./package-lock.json .
COPY ./internals ./internals

RUN npm install --unsafe-perm --no-optional
#fix vulnerabilities
RUN npm audit fix
