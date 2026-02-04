import { defineChain } from '@reown/appkit/networks'

const ip = '192.168.50.143'

export default [
  {
    network: defineChain({
      id: 31337,
      chainNamespace: "eip155",
      name: "networkTest",
      rpcUrls: {
        default: {
          http: [`http://${ip}:8545`],
        }
      }
    }),
    networkType: 'none',
    token: '0x512F7469BcC83089497506b5df64c6E246B39925',
    receiver: '0x1F2C6E90F3DF741E0191eAbB1170f0B9673F12b3',
    publicRpc: `http://${ip}:8545`
  },
  {
    network: defineChain({
      id: 14188,
      chainNamespace: "eip155",
      name: "networkTest2",
      rpcUrls: {
        default: {
          http: [`http://${ip}:8546`],
        }
      }
    }),
    networkType: 'none',
    token: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    receiver: '0x96F3Ce39Ad2BfDCf92C0F6E2C2CAbF83874660Fc',
    publicRpc: `http://${ip}:8546`
  }
]