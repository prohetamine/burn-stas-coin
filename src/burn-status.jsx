import styled from "styled-components"
import pol from './assets/networks/pol.svg'
import bnb from './assets/networks/bnb.svg'

const networks = {
    'bnb': bnb,
    'pol': pol,
}

const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
    margin: 0px 20px;
    width: calc(100% - 20px);
`

const BurnItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    font-size: 0px;
`

const Icon = styled.img`
    width: 50px;
    height: 50px;
    border: 2px solid #000;
    border-radius: 100%;
`

const Right = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    max-width: 400px;
    gap: 2px;
`

const SopplyText = styled.div`
    font-size: 11px;
    margin-right: 10px;
`

const OverflowRange = styled.div`
    overflow: hidden;
    background: #000;
    width: 100%;
    max-width: 400px;
    height: 30px;
    border-radius: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const Range = styled.div`
    background: #F2DA3A;
    width: calc(${props => props.procent}% - 8px);
    min-width: calc(30% - 8px);
    height: 22px;
    border-radius: 100px;
    margin-left: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 11px;
`

const B = styled.div`
    margin-left: 3px;
    font-weight: 600;
    display: inline-block;
`

const formatWithCommas = n => {
  if (Number.isNaN(n)) return '0'
  return n.toLocaleString()
}

const BurnStatus = ({ chunks }) => {
    return (
        <Body>
            {
                chunks.map(
                    (chunk, key) => {
                        return (
                            <BurnItem key={key}>
                                <Icon src={networks[chunk.networkType]} />
                                <Right>
                                    <OverflowRange>
                                        <Range procent={(chunk.count / 3820000)}>Burn <B>{(chunk.count / 3820000).toString().slice(0, 4)}%</B></Range>
                                    </OverflowRange>
                                    <SopplyText>
                                       <B>{formatWithCommas(chunk.count)}</B> / {formatWithCommas(382000000)} STAS
                                    </SopplyText>
                                </Right>
                            </BurnItem>
                        )
                    }
                )
            }
        </Body>        
    )
}

export default BurnStatus