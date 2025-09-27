"use client"

import { useAccount } from "wagmi"
import RecentlyListedNFTs from "@/components/RecentlyListed"
import { useEffect, useState } from "react"

export default function Home() {
    const { isConnected, address } = useAccount()
    const [isCompliance, setIsCompliance] = useState<boolean>(true)

    useEffect(() => {
        if (address) { checkCompliance() }
    }, [address])

    async function checkCompliance() {
        if (!address) return

        const response = await fetch('/api/compliance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        })
        const result = await response.json()
        console.log("Compliance result:", result)
        setIsCompliance(result.success && result.isApproved)

    }

    console.log("isCompliance", isCompliance)
    return (
        <main>
            {!isConnected ? (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    Please connect a wallet
                </div>
            ) : (
                isCompliance ? (

                    <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                        <RecentlyListedNFTs />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
                        <p className="text-lg text-center max-w-md">Your wallet address has not passed the required compliance screening. Please contact support for further assistance.</p>
                    </div>
                )
            )}
        </main>
    )
}
