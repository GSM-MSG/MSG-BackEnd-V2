FROM node:16.14.2-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm i

COPY ./src ./src

COPY ./test ./test

COPY .env tsconfig.build.json tsconfig.json nest-cli.json ./

RUN npm run build

## application 실행
CMD ["npm", "run", "start:prod"]
