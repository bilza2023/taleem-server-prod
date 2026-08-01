server {
    listen 80;
    server_name taleem.help;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name taleem.help;

    ssl_certificate /etc/letsencrypt/live/taleem.help/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taleem.help/privkey.pem;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /home-links {
        proxy_pass http://127.0.0.1:9000;
    }

    location /article {
        proxy_pass http://127.0.0.1:9000;
    }

    location /content {
        proxy_pass http://127.0.0.1:9000;
    }
}