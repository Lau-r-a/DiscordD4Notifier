FROM node:lts-alpine3.18


COPY . /app/
WORKDIR /app/

RUN npm install

# Entrypoint
CMD npm run start