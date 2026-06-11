# Hello Kitty Game

컨베이어 벨트 위로 지나가는 산리오 스타일 캐릭터 이미지를 알맞은 캐릭터 구역에 드래그해서 분류하는 미니 게임입니다.

제한 시간 안에 최대한 많은 캐릭터를 정확하게 분류하고, 콤보를 이어가며 높은 점수를 노려보세요.

## 프로젝트 소개

이 프로젝트는 React와 Vite로 만든 간단한 드래그 앤 드롭 게임입니다.

- 캐릭터 이미지를 알맞은 구역에 분류하는 게임
- 60초 제한 시간
- 점수, 콤보, 놓친 캐릭터 수 표시
- 마우스와 터치 조작 지원
- 파스텔톤의 귀여운 캐릭터 구역 UI

## 기술 스택

- React
- Vite
- JavaScript
- CSS / inline styles

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 로컬 주소로 접속합니다.

```text
http://localhost:5173
```

## 사용 가능한 명령어

```bash
npm run dev
```

개발 서버를 실행합니다.

```bash
npm run build
```

프로덕션용 파일을 빌드합니다.

```bash
npm run preview
```

빌드된 결과물을 로컬에서 미리 확인합니다.

```bash
npm run lint
```

ESLint 검사를 실행합니다.

## 폴더 구조

```text
hello-kitty-game/
+-- public/
|   +-- favicon.svg
|   +-- icons.svg
+-- src/
|   +-- assets/
|   |   +-- images/
|   +-- App.jsx
|   +-- App.css
|   +-- index.css
|   +-- main.jsx
+-- index.html
+-- package.json
+-- vite.config.js
```

## 게임 방법

1. 게임을 시작합니다.
2. 컨베이어 벨트 위로 지나가는 캐릭터 카드를 확인합니다.
3. 캐릭터 카드를 알맞은 캐릭터 구역으로 드래그합니다.
4. 정답이면 점수와 콤보가 올라갑니다.
5. 오답이면 점수가 깎이고 콤보가 초기화됩니다.
6. 시간이 끝나기 전에 최대한 많은 캐릭터를 분류합니다.

## 참고

이 프로젝트는 학습용 팬 프로젝트이며 Sanrio와 공식적으로 관련이 없습니다.
