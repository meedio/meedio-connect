# ---------- Base ----------
FROM nginx:1.20.2 AS base

LABEL org.opencontainers.image.source=https://github.com/meedio/meedio
LABEL org.opencontainers.image.title=meedio-connect
LABEL org.opencontainers.image.ref.name=meedio/meedio-connect

RUN rm /etc/nginx/conf.d/default.conf
RUN sed -i '/^types {$/a \    application/wasm                                 wasm;' /etc/nginx/mime.types

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./build /usr/share/nginx/html  
