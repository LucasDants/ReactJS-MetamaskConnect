import detectEthereumProvider from "@metamask/detect-provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Web3 from "web3";

export enum StatusDefault {
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending",
    LOADING = "loading",
}

export interface StatusReturns {
    status: StatusDefault;
    message?: string;
    solution?: string;
}

interface UseMetamask {
    detectMetamask: boolean;
    connectMetamask: () => Promise<StatusReturns>;
    walletId?: string;
    metamaskIsConnected: () => boolean;
    walletIdShrunk?: string;
}

export const useMetamask = (): UseMetamask => {
    const [detectMetamask, setDetectMetamask] = useState(false)
    const [ethereum, setEthereum] = useState<MetaMaskInpageProvider | null>(null)
    const [walletId, setWalletId] = useState('')

    const switchNetwork = async () => {
        const chainId = Web3.utils.toHex(Number(process.env.REACT_APP_CHAIN_ID))

        return await ethereum?.request({
            params: [{ chainId }],
            method: 'wallet_switchEthereumChain'
        })
    }

    const connectMetamask = async (): Promise<StatusReturns> => {
        const provider = await detectEthereumProvider()

        if (provider) {
            setDetectMetamask(true)

            // Verify Network
            const validNetwork = (await switchNetwork().catch(err => ({
                status: StatusDefault.ERROR,
                message: err.message,
            }))) === null

            //switch network
            const connectResponse = await ethereum?.request<string[]>({
                method: 'eth_requestAccounts'
            }).catch(({ message }) => ({
                status: StatusDefault.ERROR,
                message,
                solution: 'Please, contact our support.'
            }))

            // get wallet id
            const currentWallet = typeof connectResponse === 'string' ? connectResponse : (connectResponse as string[]).shift() as string
            setWalletId(currentWallet)

            return {
                status: StatusDefault.SUCCESS,
                message: "Metamask is connected"
            }
        }
        
        return {
            status: StatusDefault.ERROR,
            message: "Metamask Not Found.",
            solution: 'Please, install the Metamask chrome extension and try again'
        }
    }

    const metamaskIsConnected = () => detectMetamask && walletId ? true : false

    const walletIdShrunk = walletId.substring(0, 6) + '...' + walletId.substring(walletId.length - 6)

    useEffect(() => {
        setEthereum(window.ethereum as MetaMaskInpageProvider)
    }, [])

    return { detectMetamask, connectMetamask, walletId, walletIdShrunk, metamaskIsConnected }
}