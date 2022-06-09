FROM node:16.14.2-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install --legacy-peer-deps

COPY ./src ./src

COPY ./test ./test

COPY ./src/lib/students.ts ./src/lib/students.ts

COPY .env tsconfig.build.json tsconfig.json nest-cli.json ./

RUN npm run build

## application 실행
CMD ["npm", "run", "start:prod"]
