"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 设置网络：devnet / mainnet-beta
  // const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const endpoint = "http://127.0.0.1:8899"; // Localnet

  // 钱包适配器列表
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // 可以添加更多钱包
      // new SolflareWalletAdapter(),
      // new BackpackWalletAdapter(),
    ],
    []
  );
  return (
    <html lang="en">
      <body className="bg-white">
        {/* 1. 连接网络 */}
        <ConnectionProvider endpoint={endpoint}>
          {/* 2. 提供钱包支持 */}
          <WalletProvider wallets={wallets} autoConnect>
            {/* 3. 钱包模态框支持（如连接弹窗） */}
            <WalletModalProvider>
              {/* 页面内容：相当于旧版的 <Component {...pageProps} /> */}
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
        <div className="flex mt-0"></div>
      </body>
    </html>
  );
}
