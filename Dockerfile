
FROM node

# ARG backend_host
# ENV REACT_APP_SERVER_API_URL=$backend_host
ENV REACT_APP_SERVER_API_URL=http://localhost:4000/api/
# ENV REACT_APP_SERVER_API_URL=http://172.21.0.3:4000/api/

COPY . /application

WORKDIR /application
RUN npm install
EXPOSE 3000
# EXPOSE 4000
CMD ["npm","start"]


# ----------------------
# FROM node

# ENV REACT_APP_SERVER_API_URL=http://backend:4000/api/
# COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh
# WORKDIR /application
# COPY . .
# RUN npm install
# EXPOSE 3000
# ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# CMD ["npm", "start"]

