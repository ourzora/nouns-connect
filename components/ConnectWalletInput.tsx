import { useCallback, useState } from 'react'
import jsQr from 'jsqr'
import { blobToImageData } from '../utils/images'
// import { format } from 'date-fns'

type ConnectWalletInputProps = {
  client: any
  onConnect: (data: { uri: string }) => void
}

export const ConnectWalletInput = ({ client, onConnect }: ConnectWalletInputProps) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const onWCPaste = useCallback(
     (event: any) => {
      const connectWithUri = (data: string) => {
        if (data.startsWith('wc:')) {
          setIsConnecting(true)
          onConnect({ uri: data })
        }
      }

      const connectWithQR = (item: DataTransferItem) => {
        const blob = item.getAsFile()
        const reader = new FileReader()
        reader.onload = async (event: ProgressEvent<FileReader>) => {
          const imageData = await blobToImageData(event.target?.result as string)
          const code = jsQr(imageData.data, imageData.width, imageData.height)
          if (code?.data) {
            setIsConnecting(true)
            onConnect({ uri: code.data })
          } else {
            // setInvalidQRCode(true)
            setInputValue(
              `Screen Shot ` //${format(new Date(), 'yyyy-MM-dd')} at ${format(
              // new Date(),
              // 'hh.mm.ss'
              // )}`
            )
          }
        }
        reader.readAsDataURL(blob as Blob)
      }

      // setInvalidQRCode(false)
      setInputValue('')

      if (client) {
        return
      }

      const items = event.clipboardData.items

      for (const index in items) {
        const item = items[index]

        if (item.kind === 'string' && item.type === 'text/plain') {
          connectWithUri(event.clipboardData.getData('Text'))
        }

        if (item.kind === 'file') {
          connectWithQR(item)
        }
      }
    },
    [client, onConnect]
  )

  return (
    <div className='my-6'>
      Walletconnect URI: (or paste image)
      <input className="border-2 border-gray-200 shadow-md p-2 text-large block mt-2" type="text" onPaste={onWCPaste} />
      {/* <Label>{error}</Label> */}
    </div>
  )
}
