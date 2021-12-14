FROM reactioncommerce/reaction:4.1.5
USER root
RUN npm install -g husky is-ci is-docker
USER node
# Rather than copy this over, it should move just the dependencies over to the existing
COPY --chown=node:node package.json /usr/local/src/app/
COPY --chown=node:node package-lock.json /usr/local/src/app/
COPY --chown=node:node plugins.json /usr/local/src/app/
WORKDIR /usr/local/src/app
RUN npm install --no-audit --only=production
