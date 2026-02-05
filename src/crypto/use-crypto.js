import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract, JsonRpcProvider, getAddress, MaxUint256, formatUnits } from 'ethers'
import config from './config.js'

const DEAD_ADDRESS = getAddress('0x000000000000000000000000000000000000dEaD')

const useCrypto = () => {
    const { open } = useAppKit()
        , { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
        , { walletProvider } = useAppKitProvider('eip155')

    const getWriteContext = async () => {
        if (!walletProvider || !address) {
            throw new Error('Wallet not connected')
        }

        const provider = new BrowserProvider(walletProvider)
        const network = await provider.getNetwork()
        const signer = await provider.getSigner()

        return {
            signer,
            chainId: Number(network.chainId)
        }
    }

    const getTokenContract = (tokenAddress, providerOrSigner) => {
        return new Contract(tokenAddress, config.ABI.token, providerOrSigner)
    }

    const getBalance = async () => {
        const { signer, chainId } = await getWriteContext()
        const tokenAddress = config.address[chainId]?.token

        if (!tokenAddress) {
            throw new Error(`Unsupported chainId: ${chainId}`)
        }

        const token = getTokenContract(tokenAddress, signer)
        const balance = await token.balanceOf(address)

        return parseInt(balance)
    }

    const getBurnedBalance = async () => {
        const chunks = await Promise.all(
            config.blockChainsData.map(async ({ token, publicRpc, networkType }) => {
                const provider = new JsonRpcProvider(publicRpc)
                const contract = getTokenContract(token, provider)

                const [balance, decimals] = await Promise.all([
                    contract.balanceOf(DEAD_ADDRESS),
                    contract.decimals()
                ])

                return {
                    networkType,
                    count: formatUnits(balance, decimals)
                }
            })
        )

        return {
            all: chunks.reduce(
                (acc, x) => acc + Number(x.count),
                0
            ),
            chunks
        }
    }

    const burn = async (amount) => {
        if (!amount || Number(amount) <= 0) {
            throw new Error('Invalid burn amount')
        }

        const { signer, chainId } = await getWriteContext()
        const addresses = config.address[chainId]

        if (!addresses) {
            throw new Error(`Unsupported chainId: ${chainId}`)
        }

        const token = getTokenContract(addresses.token, signer)
        const receiver = new Contract(
            addresses.receiver,
            config.ABI.receiver,
            signer
        )

        const allowance = await token.allowance(address, addresses.receiver)
        
        if (allowance < amount) {
            const approveTx = await token.approve(addresses.receiver, MaxUint256)
            await approveTx.wait()
        }

        const burnTx = await receiver.burn(amount)
        const receipt = await burnTx.wait()

        return receipt.status === 1
    }

    return {
        open, 
        isConnected, 
        getBalance, 
        getBurnedBalance,
        burn
    }
}

export default useCrypto