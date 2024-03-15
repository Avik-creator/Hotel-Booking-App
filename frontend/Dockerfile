FROM node:21.7.1-alpine3.18

WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]