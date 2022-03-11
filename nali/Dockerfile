# ---- Base Node ----

FROM node:14-alpine AS base

RUN apk update && apk upgrade && \
    apk add tini bash g++ make libpng-dev python3 nss nss-tools sudo ca-certificates openssl certbot && \
    rm -rf /var/cache/apk/*

WORKDIR /opt/nali/

COPY package.json /opt/nali
COPY index.js /opt/nali
COPY entrypoint.sh /opt/nali
COPY app /opt/nali/app

RUN cp app/certs/ca.crt /usr/local/share/ca-certificates
RUN sudo update-ca-certificates
RUN awk -v cmd='openssl x509 -noout -subject' '/BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-certificates.crt | grep Hello

RUN npm install -g pnpm

# ---- Dependencies ----

FROM base AS build

RUN pnpm install

# ---- Release ----

FROM build AS release

ENTRYPOINT ["/sbin/tini", "--", "/opt/nali/entrypoint.sh"]
CMD ["node", "index.js"]
