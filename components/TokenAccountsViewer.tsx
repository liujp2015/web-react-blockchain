"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface TokenAccount {
  address: string;
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
}

export function TokenAccountsViewer() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenAccounts = async () => {
    if (!publicKey || !connected) {
      setError("请先连接钱包");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("查询钱包地址:", publicKey.toBase58());

      // 获取所有代币账户
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      console.log("找到代币账户数量:", tokenAccounts.value.length);

      const accounts: TokenAccount[] = tokenAccounts.value.map((account) => {
        const accountInfo = account.account.data.parsed.info;
        return {
          address: account.pubkey.toBase58(),
          mint: accountInfo.mint,
          amount: accountInfo.tokenAmount.amount,
          decimals: accountInfo.tokenAmount.decimals,
          uiAmount: accountInfo.tokenAmount.uiAmount,
        };
      });

      setTokenAccounts(accounts);
    } catch (err) {
      console.error("获取代币账户失败:", err);
      setError(err instanceof Error ? err.message : "获取代币账户失败");
    } finally {
      setLoading(false);
    }
  };

  // 自动查询（当钱包连接时）
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokenAccounts();
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>代币账户查询</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">请先连接钱包查看代币账户</p>
        </CardContent>
      </Card>
    );
  }

  // 判断当前网络
  const getNetwork = () => {
    const endpoint = connection.rpcEndpoint;

    if (endpoint.includes("localhost") || endpoint.includes("127.0.0.1")) {
      return "Localnet";
    } else if (endpoint === clusterApiUrl("devnet")) {
      return "Devnet";
    } else if (endpoint === clusterApiUrl("mainnet-beta")) {
      return "Mainnet";
    } else if (endpoint.includes("testnet")) {
      return "Testnet";
    } else {
      return "Custom Endpoint";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          代币账户查询 代币账户查询
          <span className="text-xs font-mono px-2 py-1 bg-gray-200 rounded">
            {getNetwork()}
          </span>
          <Button
            onClick={fetchTokenAccounts}
            disabled={loading}
            className="ml-4"
          >
            {loading ? "查询中..." : "刷新"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 钱包地址显示 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">钱包地址:</h3>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
            {publicKey?.toBase58()}
          </p>
        </div>

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-700">错误: {error}</p>
          </div>
        )}

        {/* 代币账户列表 */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">正在查询代币账户...</p>
          </div>
        ) : tokenAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {error ? "查询失败" : "没有找到代币账户"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              代币账户 ({tokenAccounts.length})
            </h3>
            {tokenAccounts.map((account, index) => (
              <Card
                key={account.address}
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        代币账户 #{index + 1}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            账户地址:
                          </span>
                          <p className="font-mono text-xs bg-gray-100 p-1 rounded mt-1 break-all">
                            {account.address}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            代币地址 (Mint):
                          </span>
                          <p className="font-mono text-xs bg-gray-100 p-1 rounded mt-1 break-all">
                            {account.mint}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        余额信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            原始数量:
                          </span>
                          <p className="font-mono">{account.amount}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            小数位数:
                          </span>
                          <p className="font-mono">{account.decimals}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            实际余额:
                          </span>
                          <p className="font-mono text-lg font-bold text-green-600">
                            {account.uiAmount !== null
                              ? account.uiAmount.toLocaleString()
                              : "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
