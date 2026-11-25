# AI Training participant site. What it contains is set in release.conf (version, sessions or topics).
#   docker build -t ai-training .
#   docker run -d -p 8080:80 ai-training        → http://localhost:8080
# Speaker notes and timings are removed; closed sessions show "Coming soon" and their files are not in the image.

FROM node:22-alpine AS build
WORKDIR /src
COPY . .
RUN node docker/prepare.mjs /src /out && chmod -R u=rwX,go=rX /out

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /out/site/ /usr/share/nginx/html/
COPY --from=build /out/release.txt /release.txt
EXPOSE 80
