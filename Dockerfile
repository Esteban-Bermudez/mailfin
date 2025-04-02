FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/index.js"]
