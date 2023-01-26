// どんなアダプターを使うのか（adapter） → 今回は Prisma を使います。
// どんな認証方法を採用するのか（providers） → 今回は GitHub を使います。
// openssl コマンドで生成します。
// セッションをどのように保管するか → セッションの保存場所（strategy）・セッションの期限（maxAge）・データベースへの書き込み頻度（updateAge）を設定しています。
// クッキーの安全性（useSecureCookies） → true に設定すると NextAuth.js が設定するすべてのクッキーは、HTTPS URL からしかアクセスできなくなります。
// ログイン画面の設定（pages） → 今回は、pages/auth/signin.tsx をログイン画面にします。
// コールバックの設定（callbacks） → あるアクションが実行されたときに何が起こるかを制御しています。今回は、認証が完了した後のリダイレクト先・セッションを返す関数を定義しています。

import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],

  secret: process.env.SECRET,

  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
  },

  useSecureCookies: process.env.NODE_ENV === 'production',

  pages: {
    signIn: 'auth/signin',
  },

  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session, user }) {
      if (session?.user) session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
