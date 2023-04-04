FROM node:19.8.1
RUN npm install -g yarn
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn add
COPY . .
COPY ./dist ./dist
CMD ["yarn", "start:dev"]