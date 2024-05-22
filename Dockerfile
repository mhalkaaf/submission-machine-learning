FROM node:18-alpine3.19

WORKDIR /app

ENV PORT 3000

COPY package.json package-lock.json ./

RUN npm install

COPY . /app

EXPOSE 3000

ENTRYPOINT ["npm", "run"]
CMD ["start"]