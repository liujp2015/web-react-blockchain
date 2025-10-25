"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui"; // 引入模态框控制
import { Button } from "@/components/ui/button";
import { CustomWalletButton } from "@/components/CustomWalletButton";
import { TokenAccountsViewer } from "@/components/TokenAccountsViewer";

export default function Test() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal(); // 控制钱包选择弹窗

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8   ">
      {/* 钱包连接组件 */}
      <CustomWalletButton />

      {/* 代币账户查询组件 */}
      <TokenAccountsViewer />
    </div>
  );
}
