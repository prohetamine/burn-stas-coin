import { useState } from 'react'
import styled from 'styled-components'
import useCrypto from './crypto/use-crypto'

const Body = styled.div`
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`

const Overflow = styled.div`
    display: flex;
`

const Variants = styled.div`
    display: flex;
    justify-content: space-between;
    width: calc(100% - 40px);
    margin: 0px 20px;
`

const Input = styled.input`
    border: 2px solid #000;
    background: #F2DA3A;
    color: #000;
    outline: none;
    font-family: "inter";
    font-weight: 500;
    font-size: 23px;
    padding: 8px 14px;
    border-radius: 15px 0px 0px 15px;
    width: 150px;

    &::placeholder {
        color: #8f801a;
    }
`

const Button = styled.div`
    background: #000;
    outline: none;
    border: none;
    font-family: "inter";
    font-weight: 500;
    font-size: 23px;
    padding: 8px 14px;
    border-radius: 0px 15px 15px 0px;
    user-select: none;
    cursor: pointer;
`

const SmallText = styled.div`
    font-size: 11px;
    user-select: none;
    cursor: pointer;
`

const B = styled.div`
    font-weight: 600;
    display: inline-block;
    text-decoration: underline;

    &:hover,:active {
        text-decoration: none;
    }
`

const BurnForm = ({ balance, onBurn }) => {
    const { isConnected, open } = useCrypto()
    const [burnCount, setBurnCount] = useState(100)

    const handleBurn = async () => {
        if (!isConnected) {
            open()
            return
        }

        if (burnCount !== 0 && balance < burnCount) {
            return
        }

        await onBurn(burnCount)
        setBurnCount(0)
    }

    return (
        <Body>
            <Overflow>
                <Input 
                    value={burnCount} 
                    onChange={({ target: { value } }) => {
                        const burnCount = value.match(/\d+/gi)
                        alert(balance)
                        setBurnCount(() => burnCount > balance ? balance : parseInt(burnCount) || 0)
                    }}
                />
                <Button onClick={handleBurn}>🔥</Button>
            </Overflow>
            <Variants>
                <SmallText>Burn:</SmallText>
                <SmallText onClick={() => !isConnected ? open() : setBurnCount(parseInt(balance / 10))}><B>10%</B></SmallText>
                <SmallText onClick={() => !isConnected ? open() : setBurnCount(parseInt(balance / 4))}><B>25%</B></SmallText>
                <SmallText onClick={() => !isConnected ? open() : setBurnCount(parseInt(balance / 2))}><B>50%</B></SmallText>
                <SmallText onClick={() => !isConnected ? open() : setBurnCount(balance)}><B>MAX</B></SmallText>
            </Variants>
        </Body>
    )
}

export default BurnForm