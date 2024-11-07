FROM node:23-alpine

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

EXPOSE 3000

# Default command
CMD ["npm", "run", "serve"]
