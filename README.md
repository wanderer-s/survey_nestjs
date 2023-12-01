# 목표
설문지의 Database를 설계하고 해당 설문지를 이용할 수 있게 graqhQL로 api 구현
# 제약사항
해당 기술을 사용해야 함
- typescript
- nest.js
- graphql
- typeorm
- postgresql
- 그 외 다른 라이브러리 사용 가능

# 상세내용
- 설문지를 생성하고 해당 설문지로 응답자에게 응답을 받을 수 있음
- 응답자가 응답한 설문지의 점수를 계산 할 수 있음

# 실행방법
1. npm package 설치를 위한 명령어 `npm install`
2. 환경변수를 위한 `.env` 파일 생성 후 `JWT_SECRET`과 `JWT_PERIOD` 설정
2. docker-compose 실행을 위한 명령어 `docker-compose up -d` (local db를 위함)
3. application 실행을 위한 명령어 `npm start`
4. `localhost:4000/graphql` 에서 api 호출 가능
5. `userSignUp` 부터 시작해야 권한을 얻어 다른 api를 호출 할 수 있음
6. `{ "headers": "Bearer signIn시 반환된 토큰 기입}` 후 api 호출 가능