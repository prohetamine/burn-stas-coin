import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract, JsonRpcProvider, Wallet, constants } from 'ethers'

import config from './config.js'

const useCrypto = () => {
    const { open } = useAppKit()
        , { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
        , { walletProvider } = useAppKitProvider('eip155')

    const createSignerPrivate = async () => {
        if (!walletProvider || !address) {
            return
        }
        const provider = new BrowserProvider(walletProvider)
        const network = await provider.getNetwork()
        const signer = await provider.getSigner()
        return [signer, parseInt(network.chainId)]
    }
    
    const getBalance = async () => {
        const [signer, network] = await createSignerPrivate()
        const _address = config.address[network]
        
        const token = new Contract(_address.token, config.ABI.token, signer)
        const balance = await token.balanceOf(address)
        return parseInt(balance)
    }

    const getBurnedBalance = async () => {
        const chunks = []
        for (let x = 0; x < config.blockChainsData.length; x++) {
            const _wallet = Wallet.createRandom()
            const { token, publicRpc, networkType } = config.blockChainsData[x]

            const provider = new JsonRpcProvider(publicRpc)
            const wallet = new Wallet(_wallet.privateKey, provider)

            const receiver = new Contract(token, config.ABI.token, wallet)
                , count = await receiver.balanceOf('0x000000000000000000000000000000000000dEaD')
            
            chunks.push({ 
                networkType,
                count: parseInt(count)
            })
        }

        return {
            all: chunks.reduce((ctx, { count }) => count + ctx, 0),
            chunks
        }
    }

    const burn = async (amount = 0) => {
        const [signer, network] = await createSignerPrivate()
        const _address = config.address[network]

        const token = new Contract(_address.token, config.ABI.token, signer)
            , receiver = new Contract(_address.receiver, config.ABI.receiver, signer)


        const MAX = constants.MaxUint256
        const allowance = await token.allowance(address, _address.receiver)

        if (allowance < MAX) {
            const approveTx = await token.approve(_address.receiver, MAX)
            await approveTx.wait()
        }

        const burnTx = await receiver.burn(amount)
        const tx = await burnTx.wait()
        return tx.status === 1
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