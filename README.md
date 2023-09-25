# Concurrent-world-kor
Concurrent-world는 분산형 SNS 플랫폼입니다.[Concurrent](https://github.com/totegamma/concurrent)
이 중 kor은 한글화 테스트용 포크 버전입니다.

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
### 前準備
nodeとpnpmがインストールされている必要があります。  

> [volta](https://volta.sh/) を使うことをお勧めします。
> ```shell
> # package.jsonで指定されているNode.jsをインストールする
> volta install node
> volta install pnpm
> ```

```
pnpm i
```

### devビルド
```
pnpm dev
```
### 本番ビルド
```
pnpm build
```

### schemaファイルの生成
concurrentはサーバー間でやりとりするオブジェクトのIDと内容をjsonSchemaで担保しています。
利用するjsonSchemaを`src/schemas.ts`で定義し、以下のコマンドを実行すると外部からjsonSchemaをダウンロードし、typescriptの型定義に変換した上で`src/schemas/`へ格納してくれます。

```
deno run -A collectSchemas.ts
```

`dist/`下に成果物が出力されます。

## Contributing
現在は絶賛開発中な為、PR前にissueの起票をお願いします。

大きいissueを除いて基本的にはissueとPRは1対1対応になるようにします。

issueはその仕様が妥当かどうかの議論に、はPRその実装が妥当かどうかの議論に使います。
