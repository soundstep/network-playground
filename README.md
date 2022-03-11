# CTV Kali

## Summary

### dnschef

```
dnschef.py --interface 0.0.0.0 --fakeip=0.0.0.0 --fakedomains=config.10ft.itv.com
```

This redirects DNS to local IP.

Local Chrome reaching cassandra is displaying CORS errors:

```
Access to XMLHttpRequest at 'http://config.10ft.itv.com/2.93.2/amazonfiretv?dm=dummyModel' from origin 'http://app.10ft.itv.com' has been blocked by CORS policy: The request client is not a secure context and the resource is in more-private address space `private`.
```

On an Amaxon FireTV stick pointing to the DNS server, cassandra is also failing in the same manner.

### Kali linux

A lot of tools that seems to be more active than passive, to create attacks.

### Bettercap

Amazing tool to inspect network. The few things I tried to seems to be stopped by some router checks:

```
192.168.1.0/24 > 192.168.1.202  » [08:28:38] [sys.log] [inf] arp.spoof arp spoofer started, probing 1 targets.
192.168.1.0/24 > 192.168.1.202  » [08:28:38] [sys.log] [war] arp.spoof full duplex spoofing enabled, if the router has ARP spoofing mechanisms, the attack will fail.
```

### ARP attack with Kali Linux

https://www.youtube.com/watch?v=A7nih6SANYs

### Decrypting HTTPS

This is really hard, and still in progress.

Having difficulting creating a fully trusted certificate to use as a proxy server.

See the nali folder which create a CA cert that can be truted (instead of the certificate themselves but that won't work on a TV).

TO be able to do: DNS Checf --> proxy server --> real server, to have a better chance at inspecting https traffic (and decrypting), we need:

- a proxy server with a fully trusted certificate as any https website
- the same proxy server must have a static IP, to be used with DNS proxying
- The certificate (cert and key) must be "downloadable" so be used to decrypt SSL packets
- It is possible that the certificate needs to contains the DNS proxy IP

## Docker Kali playground

### 1. Pull and Run

```
docker pull kalilinux/kali-rolling
docker run --privileged -ti kalilinux/kali-rolling /bin/bash
```

### 2. Update container

In Kali container:

```
apt update && apt -y install kali-linux-headless dnschef ettercap-text-only dnsutils curl vim locate iproute2
```

Questions to answer:

- `Install Kismet "setuid root"? [yes/no]` yes
- `Users to add to the kismet group:` root
- `Change MAC automatically? [yes/no]` no
- `Should non-superusers be able to capture packets? [yes/no]` yes
- `Encoding to use on the console:`: 27 (UTF-8)
- `Character set to support:`: 14 (Latin1 and Latin5 - western Europe and Turkic languages)
- `Run sslh:` 1 (from inetd)

### 3. Create base image from container

Find `kalilinux/kali-rolling` container id using `docker ps`

```
docker commit <CONTAINER_ID> ctv-kali-base
```

### 3. Configure Kali

Enable IP forwarding:

```
sysctl -w net.ipv4.ip_forward=1
/proc/sys/net/ipv4/ip_forward
```

Backup configs

```
cp /etc/ettercap/etter.conf /etc/ettercap/etter.conf.backup
cp /etc/ettercap/etter.dns /etc/ettercap/etter.dns.backup
```

Update `etter.conf`:

```
vim /etc/ettercap/etter.conf

Update:

[privs]
ec_uid = 0
ec_gid = 0
```

## Various commands and notes

### create certificate

Use `GB` and `United Kingdom`

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

### bettercap

```
net.show
net.probe on
net.show
net.probe off

help arp.spoof
set arp.spoof.fullduplex true
set arp.spoof.targets 192.168.1.148 (victim IP address)
arp.spoof on

net.sniff on
net.sniff off

help dns.spoof
```

### DNS proxy (linux)

```
sudo dnschef --interface 0.0.0.0 --fakeip=172.17.0.2 --fakedomains=google.com
```

### Update linux DNS server

```
vim /etc/resolv.conf
nameserver 127.0.0.1
```

### See DNS resolution for a domain

```
dig @127.0.0.1 google.com A
```

### update /etc/ettercap/etter.dns

```
* A 172.17.0.2
```

### local ip

```
hostname -I | awk '{print $1}'
```

osx:

```
ifconfig -l | xargs -n1 ipconfig getifaddr
```

### list interface:

```
ettercap -Tq -I
```

### print router ip
```
ip r
```

### Rename container

Find `kalilinux/kali-rolling` container id using `docker ps`

```
docker rename <CONTAINER_ID> ctv-kali
```

### Create image from container

Find `kalilinux/kali-rolling` container id using `docker ps`

```
docker commit <CONTAINER_ID> ctv-kali-base
```
