FROM node:16.14.2-alpine

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./src ./src

COPY ./test ./test

COPY ./src/lib/students.ts ./src/lib/students.ts

COPY .env tsconfig.build.json tsconfig.json nest-cli.json ./

RUN yarn build

## application 실행
CMD ["yarn", "start:prod"]
