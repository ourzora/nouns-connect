import { CHAIN_ID } from "../utils/constants"

const DAOS_MAINNET = [
  {
    name: 'Nouns',
    token: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
    type: 'NOUNS',
    // treasury is owner
  },
  {
    name: 'Lil Nouns',
    token: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b',
    type: 'NOUNS'
    // treasury is owner
  },
  {
    name: 'Builder DAO',
    token: '0xdf9b7d26c8fc806b1ae6273684556761ff02d422',
    type: 'BUILDER',
    // 
  },
]

const DAOS_GOERLI = [
  {
    name: 'Nouns',
    token: '',
    type: 'NOUNS',
  },
  {
    name: 'Lil Nouns',
    token: '',
    type: 'NOUNS',
  },
  {
    name: 'swirls',
    token: '0x3078cbc3fe832c5d5a2bd7d3105d0859520eb5cf',
    type: 'BUILDER',
  }
]

export const DAOS = {
  '1': DAOS_MAINNET,
  '5': DAOS_GOERLI,
}[CHAIN_ID.toString()];