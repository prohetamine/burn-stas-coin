/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import useCrypto from './crypto/use-crypto.js'
import BurnStars from './burn-stars.jsx'
import Wallet from './wallet.jsx'
import styled from 'styled-components'
import BurnStatus from './burn-status.jsx'
import BurnForm from './burn-form.jsx'

const Body = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const App = () => {
  const { isConnected, open, burn, getBalance, getBurnedBalance } = useCrypto()
  const [burnedCount, setBurnedCount] = useState({ all: 0, chunks: [] })
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const timeId = setTimeout(async () => 
      isConnected && setBalance(
        await getBalance()
      )
    , 1000)

    return () => clearTimeout(timeId)
  }, [isConnected])

  useEffect(() => {
    const intervalId = setInterval(async () => 
       setBurnedCount(
        await getBurnedBalance()
      )
    , 30000)

    const timeId = setTimeout(async () => 
       setBurnedCount(
        await getBurnedBalance()
      )
    , 1000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeId)
    }
  }, [])

  const handleBurn = async count => {
    if (!isConnected) {
      return
    }

    await burn(count)
    
    setBalance(
      await getBalance()
    )
  
    setBurnedCount(
      await getBurnedBalance()
    )
  }

  return (
    <Body>
        <Wallet onClick={() => open()} isConnected={isConnected} />
        <BurnStars>{burnedCount.all}</BurnStars>
        <BurnForm 
            balance={balance} 
            onBurn={burnCount => handleBurn(burnCount)}
        />
        <BurnStatus chunks={burnedCount.chunks} />
    </Body>
  )
}

export default App