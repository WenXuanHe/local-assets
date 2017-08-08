openssl req -new -newkey rsa:1024 -sha256 -nodes -out server.csr -keyout server.key -subj "/C=CN/ST=Beijing/L=Beijing/O=Example Inc./OU=Web Security/CN=*.kf5.com"
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
