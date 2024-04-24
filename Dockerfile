FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY . ./
RUN npx browserslist@latest --update-db
RUN npm install
RUN npm build

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
