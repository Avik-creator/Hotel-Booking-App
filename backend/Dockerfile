FROM node:21.7.1-alpine3.18

WORKDIR /backend

COPY package*.json .
COPY tsconfig*.json .


RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]