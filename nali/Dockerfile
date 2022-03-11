# ---- Base Node ----

FROM node:14-alpine AS base

# ENV NPM_CONFIG_PREFIX=~/.npm-global
# ENV PATH="~/.npm-global/bin:${PATH}"

RUN apk update && apk upgrade && \
    apk add tini bash g++ make libpng-dev python3 nss nss-tools sudo ca-certificates openssl certbot && \
    rm -rf /var/cache/apk/*

WORKDIR /opt/nali/

# RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
# RUN mv mkcert-v1.4.3-linux-amd64 /usr/local/bin/mkcert
# RUN chmod +x /usr/local/bin/mkcert
# RUN mkcert --help

# RUN mkdir -p ./certs && \
#     cd ./certs && \
#     mkcert -cert-file cert.pem -key-file key.pem itv.com "*.itv.com" localhost 127.0.0.1 ::1
# RUN ls -la $(mkcert -CAROOT)
# RUN cp $(mkcert -CAROOT)/rootCA.pem /usr/local/share/ca-certificates/rootCA.pem && \
#     cp $(mkcert -CAROOT)/rootCA-key.pem /usr/local/share/ca-certificates/rootCA-key.pem && \
#     update-ca-certificates

# RUN mkdir ~/.npm-global
# RUN npm config set prefix ~/.npm-global

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

# COPY scripts /opt/nali/scripts
# RUN npm install -g mkcert --unsafe-perm
# RUN ls -la ~/.npm-global/bin
# RUN echo $PATH
# RUN node scripts/create-certs.js
# RUN mkdir -p app/certs
# RUN cp scripts/cert.key app/certs/cert.key
# RUN cp scripts/cert.crt app/certs/cert.crt
# RUN cp scripts/ca.crt /usr/local/share/ca-certificates

# ---- Release ----

FROM build AS release

ENTRYPOINT ["/sbin/tini", "--", "/opt/nali/entrypoint.sh"]
CMD ["node", "index.js"]
