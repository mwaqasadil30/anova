# Used the dockerfile from here as a base:
# https://hub.docker.com/r/countingup/nswag/dockerfile
FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine3.13-amd64

ARG SWAGGER_API_KEY

ENV API_KEY=$SWAGGER_API_KEY

RUN apk add --no-cache --update unzip curl \
    && curl -O -L https://github.com/RicoSuter/NSwag/releases/download/v13.15.5/NSwag.zip \
    && unzip -q ./NSwag.zip -d NSwag \
    && apk del unzip curl \
    && rm -f NSwag.zip

COPY nswag.json /nswag.json

RUN dotnet NSwag/Net50/dotnet-nswag.dll run

CMD cat /api.ts
