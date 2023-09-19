# Concurrent-world-kor
Concurrent-world는 분산형 SNS 플랫폼입니다.[Concurrent](https://github.com/totegamma/concurrent)
이 중 kor은 한글화 테스트용 포크 버전입니다.

콘커런트는 [concurrent.world](https://concurrent.world)에서 확인하세요

### 단일세계
Concurrent는 따로 서버를 선택하지 않습니다.
계정을 만들면 누구와도 연결이 가능하며
주제별 그룹을 통해 타임라인(콘커런트에서는 stream)을 교류할 수 있습니다.


### 環境は無数
発信する内容はどうしてもそのサーバーが設置してある国や、運用している団体により検閲・制限されてしまいます。
これ自体は仕方ないことですが、利用者としては自身が身を置く環境は選びたいものです。 
Concurrentは分散型なので、自身の発言を管理してくれる「ホスト」を自分で選ぶことができます。もちろん、ホストは自分で建てることもできますよ！

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
