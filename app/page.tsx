"use client";
import { useWallet } from "@solana/wallet-adapter-react";

import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  {
    ssr: false, // 🔥 关键：服务端不渲染这个组件
    loading: () => <button disabled>加载钱包...</button>, // 可选：加载态
  }
);

export default function Home() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6  ">
      {connected ? (
        <p>已连接: {publicKey?.toBase58().slice(0, 8)}...</p>
      ) : (
        <p>请连接钱包</p>
      )}

      <div className="flex justify-center my-4">
        <div className="w-full max-w-xs flex items-center justify-center">
          <WalletMultiButton
            style={{
              background: "linear-gradient(45deg, #00c8ff, #7e4eff)",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              marginLeft: "-0.6rem",
            }}
          ></WalletMultiButton>
        </div>
      </div>
    </div>
  );
}
