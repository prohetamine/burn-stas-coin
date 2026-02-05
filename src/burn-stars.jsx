/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/refs */
import styled from 'styled-components'
import { useEffect, useRef, useState } from "react"
import stas from './assets/stas.svg'

const Body = styled.div`
    width: 100%;
    overflow: hidden;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0px;
    box-sizing: border-box;
`

const Content = styled.div`
    position: absolute;
    color: #000;
    font-family: "inter";
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
`

const BurnCount = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 50px;
    font-size: 62px;
`

const Description = styled.div`
    font-size: 15px;
    font-weight: 600;
`

const OverflowIconCoin = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const IconText = styled.div`
    position: absolute;
    color: #000000;
    font-family: "inter";
    font-weight: 600;
    font-size: 23px;
    display: flex;
`

const IconCoin = styled.div`
    background-image: url("${stas}");
    background-size: cover;
    width: 50px;
    height: 50px;
`


const STAR_COUNT = 150
const MAX_OFFSET = 120

const stars = Array(STAR_COUNT).fill(true).map(() => ({
    t: Math.random(),
    speed: 0.0003 + Math.random() * 0.001,
    offset: 10 + Math.random() * MAX_OFFSET,
    size: 1 + Math.random() * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05
}))

const pointOnRoundedRect = (t, w, h, r) => {
    const pw = w - 2 * r
    const ph = h - 2 * r

    const perimeter =
        2 * (pw + ph) + 2 * Math.PI * r

    let d = t * perimeter;

    if (d < pw) return { x: -pw/2 + d, y: -h/2 }
    d -= pw

    if (d < Math.PI * r / 2) {
        const a = -Math.PI/2 + d / r
        return { x: w/2 - r + Math.cos(a) * r, y: -h/2 + r + Math.sin(a) * r }
    }
    d -= Math.PI * r / 2

    if (d < ph) return { x: w/2, y: -ph/2 + d }
    d -= ph

    if (d < Math.PI * r / 2) {
        const a = d / r
        return { x: w/2 - r + Math.cos(a) * r, y: h/2 - r + Math.sin(a) * r }
    }
    d -= Math.PI * r / 2

    if (d < pw) return { x: pw/2 - d, y: h/2 }
    d -= pw

    if (d < Math.PI * r / 2) {
        const a = Math.PI/2 + d / r
        return { x: -w/2 + r + Math.cos(a) * r, y: h/2 - r + Math.sin(a) * r }
    }
    d -= Math.PI * r / 2

    if (d < ph) return { x: -w/2, y: ph/2 - d }
    d -= ph

    const a = Math.PI + d / r
    return { x: -w/2 + r + Math.cos(a) * r, y: -h/2 + r + Math.sin(a) * r }
}

const lerp = (a, b, t) => a + (b - a) * t

const formatNumber = n => {
    if (!Number.isFinite(n) || n === 0) return '0';

    if (n < 1_000) return String(n);

    if (n < 1_000_000) return Math.round(n / 1_000) + 'k';

    if (n < 1_000_000_000) return Math.round(n / 1_000_000) + 'm';

    return Math.round(n / 100_000_000) / 10 + 'b';
}

const BurnStars = ({ children }) => {
    const canvasRef = useRef()
        , counterRef = useRef()

    const [sizeContent, setSizeContent] = useState([0, 0])
        , [ctx, setCtx] = useState(null)

    useEffect(() => {
        const counter = counterRef.current

        if (counter) {
            const W = counter.getBoundingClientRect().width + 20
                , H = counter.getBoundingClientRect().height + 20
            
            setSizeContent([
                W, 
                H
            ])
        }
    }, [counterRef.current, children])

    useEffect(() => {
        const canvas = canvasRef.current

        if (canvas) {
            const ctx = canvas.getContext('2d')

            canvas.width = 600
            canvas.height = 400

            setCtx(ctx)
        }
    }, [canvasRef.current])

    useEffect(() => {
        if (ctx) {
            const timeId = setInterval(() => {
                ctx.clearRect(0, 0, 600, 400)
                const c = { 
                    x:  300, 
                    y: 200
                }

                for (const s of stars) {
                    s.t = (s.t + s.speed) % 1

                    const roundness = Math.min(s.offset / MAX_OFFSET, 1)
                    const r = lerp(0, Math.min(sizeContent[0], sizeContent[1]) / 2 + s.offset, roundness)

                    const base = pointOnRoundedRect(
                        s.t,
                        sizeContent[0] + s.offset * 2,
                        sizeContent[1] + s.offset * 2,
                        r
                    )

                    const x = c.x + base.x
                    const y = c.y + base.y

                    const size = s.size * 1
                    const radius = size / 2

                    ctx.beginPath()
                    ctx.arc(x, y, radius, 0, Math.PI * 2)
                    ctx.fillStyle = '#000'
                    ctx.fill()
                }
            }, 50)

            return () => clearInterval(timeId)
        }
    }, [ctx, sizeContent])

    return (
        <Body>
            <Content ref={counterRef}>
                <BurnCount>
                    {formatNumber(parseInt(children || 0))}
                    <OverflowIconCoin>
                        <IconCoin className='spin' />
                        <IconText>S</IconText>
                    </OverflowIconCoin>
                </BurnCount>
                <Description>Burn STAS coin.</Description>
            </Content>
            <canvas ref={canvasRef} />
        </Body>
    )
}

export default BurnStars