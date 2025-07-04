ARG BUILDPLATFORM=linux/amd64
ARG DEBIAN_FRONTEND=noninteractive
FROM --platform=${BUILDPLATFORM} node:22-alpine AS base

# 패키지 업데이트 및 Python3, g++, make 설치
RUN apk update && apk add --no-cache python3 g++ make
# 타임존 설정
ENV TZ=Asia/Seoul
RUN echo "${TZ}" > /etc/timezone && \
    ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime

# 패키지매니저 설치
RUN npm install -g pnpm

WORKDIR /usr/app

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.build.json .
COPY tsconfig.json .

RUN node --version

# npm install 실행 전 Python 심볼릭 링크 추가
RUN ln -sf /usr/bin/python3 /usr/bin/python

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 4000
ENTRYPOINT [ "pnpm", "start:prod" ]
