# Docker で立てた DB を Postgres で扱い NextAuth で認証を実装するチュートリアル

参照：https://zenn.dev/farstep/books/7a6eb67dd3bf1f

## How to start

```
yarn install
```

### Docker 準備

```
docker-compose up
```

別プロンプトのタブで

```
docker ps
```

でコンテナ確認

```
docker container exec -it postgres bash
```

にてコンテナの中へ入る。prisma 側でマイグレーションファイルに更新がある場合は立ち上げ直す。

```
psql -l
```

にて DB 一覧に mydb の確認

### Prisma の準備

```
yarn prisma init
```

#### .env の設定

```
DATABASE_URL="postgresql://root:secret@localhost:5432/mydb"
```

prisma で自動生成された Env の DATABASE_URL の値を docker-compose.yml で記述した内容へ書き換える

```
 GITHUB_ID=取得したClient ID
 GITHUB_SECRET=取得したClient secret
 NEXTAUTH_URL=http://localhost:3000
 SECRET=ランダムな文字列
```

Github の Developper settings のページで OAuth App を作成した際の id とシークレットキーを設定。

SECRET=は

```
openssl rand -base64 32
```

などでランダム生成したものを設定

#### PrismaStudio でテーブル一覧の確認

```
yarn prisma studio
```

<http://localhost:5555>を確認

## migration ファイルを作成する場合

```
yarn prisma migrate dev --name init
```
