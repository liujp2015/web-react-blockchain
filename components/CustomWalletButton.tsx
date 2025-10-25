// components/CustomWalletButton.tsx
"use client";

import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function CustomWalletButton() {
  const { wallets, select, wallet, connect, connected, disconnect, publicKey } =
    useWallet();
  const [open, setOpen] = useState(false);

  const handleConnect = async (selectedWallet: Wallet) => {
    try {
      console.log("选择钱包:", selectedWallet.adapter.name);
      setOpen(false);

      // 只需要选择钱包，用户会在钱包扩展中确认连接
      select(selectedWallet.adapter.name);
    } catch (error) {
      console.error("选择钱包失败:", error);
    }
  };

  // 调试用：监听状态变化
  useEffect(() => {
    console.log("钱包状态:", {
      walletName: wallet?.adapter.name,
      connected,
      publicKey: publicKey?.toBase58(),
    });
  }, [wallet, connected, publicKey]);

  return (
    <>
      {!connected ? (
        <div className="flex items-center justify-center">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            🌐 连接钱包
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-green-600 font-mono">
            已连接: {publicKey?.toBase58().slice(0, 8)}...
            {publicKey?.toBase58().slice(-6)}
          </p>
          <Button
            onClick={disconnect}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            断开连接
          </Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>选择钱包</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {wallets.map((w) => (
              <Card
                key={w.adapter.name}
                className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                onClick={() => handleConnect(w)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <img
                    src={w.adapter.icon}
                    alt={w.adapter.name}
                    className="w-10 h-10"
                  />
                  <span className="font-medium">{w.adapter.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
