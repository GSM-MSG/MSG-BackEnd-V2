FROM node:16.13.1-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json tsconfig.build.json tsconfig.json nest-cli.json .env ./

RUN npm i

COPY ./src ./src

COPY ./test ./test

RUN npm run build

## application 실행
CMD ["npm", "run", "start:prod"]