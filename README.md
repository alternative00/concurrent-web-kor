# Concurrent-world-kor
Concurrent-world는 분산형 SNS 플랫폼입니다.[Concurrent](https://github.com/totegamma/concurrent)
이 중 kor은 한글화를위한 테스트용 포크 버전입니다.

This is for the korean translation only.

실제 업데이트 및 관련 사항은 https://github.com/totegamma/concurrent에서 확인하세요

콘커런트는 [concurrent.world](https://concurrent.world)에서 확인하세요

### 단일세계
Concurrent는 따로 서버를 선택하지 않습니다.
계정을 만들면 누구와도 연결이 가능하며
주제별 그룹을 통해 타임라인(콘커런트에서는 stream)을 교류할 수 있습니다.


### 무수한 환경
서버가 설치된 국가나 서버를 운영하는 단체에 따라 게시하는 내용이 검열 및 제한을 받을 수밖에 없습니다. 
이 자체는 어쩔 수 없는 일이지만, 사용자 입장에서는 자신이 처한 환경을 스스로 선택하고 싶을 것입니다. 
컨커런트는 분산형이기 때문에 자신의 발언을 관리해줄 '호스트'를 직접 선택할 수 있습니다. 물론 호스트는 직접 만들 수도 있습니다!

## Getting Started
### 사전 설정
node와 pnpm이 설치되어 있어야 합니다.

> [volta](https://volta.sh/) 를 사용하는 것이 좋습니다.
> ```shell
> # package.json에서 지정한 Node.js를 설치합니다.
> volta install node
> volta install pnpm
> ```

```
pnpm i
```

### dev빌드
```
pnpm dev
```
### 프로덕션 빌드
```
pnpm build
```

### schema파일 생성
concurrent는 서버 간에 주고받는 객체의 ID와 내용을 jsonSchema로 담보하고 있습니다.
사용할 jsonSchema를 `src/schemas.ts`에서 정의하고, 아래 명령어를 실행하면 외부에서 jsonSchema를 다운로드하여 typescript의 타입 정의로 변환한 후 `src/schemas/`에 저장해줍니다.

```
deno run -A collectSchemas.ts
```

`dist/`아래에 결과물이 출력됩니다.

## Contributing
현재 한창 개발 중이기 때문에 PR 전에 issue 기표를 부탁드립니다.

큰 issue를 제외하고 기본적으로 issue와 PR은 1:1로 대응하도록 하겠습니다.

issue는 해당 건의가 타당한지 아닌지, PR은 해당 건의의 구현이 가능한지 아닌지 논의할 때 사용합니다.
