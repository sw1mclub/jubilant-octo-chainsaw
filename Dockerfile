FROM node:12.13.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
COPY application/ .
RUN npm install
RUN chown -R app /opt/app
USER app
CMD [ "npm", "run", "start" ]