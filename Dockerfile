FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY ./canvases /usr/share/nginx/html/canvases
COPY ./css /usr/share/nginx/html/css
COPY ./data /usr/share/nginx/html/data
COPY ./js /usr/share/nginx/html/js

COPY ./index.html /usr/share/nginx/html/index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]