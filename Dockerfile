FROM kalilinux/kali-rolling

# https://www.kali.org/docs/general-use/metapackages/
RUN apt update && apt -yqq install kali-linux-headless dnschef ettercap-text-only dnsutils curl vim locate iproute2

