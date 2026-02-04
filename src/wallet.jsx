import styled from "styled-components"

const Body = styled.div`
    position: absolute;
    z-index: 99999;
    right: 15px;
    top: 15px;
    color: #000;
    font-family: "inter";
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    padding: 8px 14px;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
`

const Wallet = ({ isConnected, onClick }) => (
    <Body onClick={onClick}>{isConnected ? 'Wallet' : 'Connect wallet'}</Body>
)

export default Wallet