FROM node

ARG backend_host
ENV REACT_APP_BE_HOST=$backend_host
COPY . /application

WORKDIR /application
RUN npm install
EXPOSE 3000

CMD ["npm","start"]
