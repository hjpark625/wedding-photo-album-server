# Wedding Photo Album Server

NestJS 기반의 웨딩 사진 업로드 목적의 서버입니다.  
AWS S3 연동 이미지 업로드, CSRF 보호 등 RESTful API를 제공합니다.

## 주요 기능

- **이미지 업로드**: 여러 장의 이미지를 한 번에 업로드하고, AWS S3에 저장
- **CSRF 보호**: double submit cookie 방식의 CSRF 방어
  - Header와 Cookie에 CSRF 토큰을 포함하여 요청
- **헬스 체크**: 서버 상태 확인 API 제공
  - 배포 이후 로드밸런서와 연동
- **로깅 미들웨어**: 모든 요청/응답 로깅

## 기술 스택

![NestJS](https://img.shields.io/badge/Nest_JS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
![AWS_ECS](https://img.shields.io/badge/AWS_ECS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)  
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white)  
![PNPM](https://img.shields.io/badge/pnpm-222?style=for-the-badge&logo=pnpm&logoColor=white)

## 설치 및 실행

> 이 프로젝트는 Node.js v22.13.0 이상에서 실행됩니다.  
> nvm을 사용중이라면 `nvm use` 를 활용해 버전을 맞춰주세요.

### 1. 환경 변수 설정

아래 환경 변수를 `.env` 파일에 설정합니다.

```plaintext
PORT=서버포트
CSRF_SECRET_KEY=CSRF 비밀키
AWS_ACCESS_KEY_ID=AWS 액세스 키 ID
AWS_SECRET_ACCESS_KEY=AWS 비밀 액세스 키
AWS_REGION=AWS 리전 (예: ap-northeast-2)
AWS_S3_BUCKET_NAME=저장될 이미지 AWS S3 버킷 이름
AWS_CLOUDFRONT_DOMAIN=이미지 cdn용 도메인
CORS_ORIGIN=프론트엔드 서비스 도메인
MAIN_DOMAIN=메인 도메인
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm start:dev
```

### 4. 프로덕션 빌드 및 실행

```bash
pnpm build
pnpm start:prod
```

## API 엔드포인트

### 1. 헬스 체크

- Method: `GET`
- endpoint: `/health`

Response

```ts
// 별도의 인터페이스 없음
OK;
```

### 2. CSRF 토큰 발급

- Method: `GET`
- endpoint: `/csrf/token`

Response

```json
{
  "csrfToken": "CSRF 토큰 값"
}
```

### 3. 이미지 업로드

- Method: `POST`
- endpoint: `/image/upload`

Request

```ts
// 최대 20장, jpeg/png/webp, 150MB 이하
interface UploadImageRequest {
  files: FormData; // Key: "images", Value: File[]
}
```

Response

```json
{
  "imageUrls": string[] // 업로드된 이미지 cdn URL 배열
}
```
