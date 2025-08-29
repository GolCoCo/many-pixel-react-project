# Stage 1: Build the application
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && rm -rf node_modules && npm install

# Copy the rest of the application files
COPY . .

ARG VITE_APP_SERV_API
ARG VITE_APP_URL
ARG VITE_FILE_API
ARG VITE_SUBSCRIPTIONS_API
ARG VITE_SERV_API
ARG VITE_STRIPE_PK
ARG SKIP_PREFLIGHT_CHECK
ARG VITE_ENV
ARG MAINTENANCE_MODE

ENV VITE_APP_SERV_API=${VITE_APP_SERV_API}
ENV VITE_APP_URL=${VITE_APP_URL}
ENV VITE_FILE_API=${VITE_FILE_API}
ENV VITE_SUBSCRIPTIONS_API=${VITE_SUBSCRIPTIONS_API}
ENV VITE_SERV_API=${VITE_SERV_API}
ENV VITE_STRIPE_PK=${VITE_STRIPE_PK}
ENV SKIP_PREFLIGHT_CHECK=${SKIP_PREFLIGHT_CHECK}
ENV VITE_ENV=${VITE_ENV}
ENV MAINTENANCE_MODE=${MAINTENANCE_MODE}

# Build the app for production
RUN npm run build

FROM ubuntu:24.04 AS builder

RUN apt update \
    && apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget https://nginx.org/download/nginx-1.27.5.tar.gz && tar -zxf nginx-1.27.5.tar.gz
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
RUN cd nginx-1.27.5 && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
    && make modules

FROM nginx:1.27.5-alpine
COPY --from=builder /app/nginx-1.27.5/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-1.27.5/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

RUN apk add --no-cache nodejs npm && npm i -g pm2

WORKDIR /app
COPY --from=build /app ./
# Copy config files
# *.conf files in "conf.d/" dir get included in main config
COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN cat /etc/nginx/nginx.conf
RUN cat /etc/nginx/conf.d/default.conf
# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD ["sh", "-c", "if [ \"$MAINTENANCE_MODE\" = \"true\" ]; then npm run maintenance; else npm run serve; fi & nginx -g 'daemon off;'"]

