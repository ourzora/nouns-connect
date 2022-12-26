import { useCallback, useEffect, useState } from "react";
import jsQr from "jsqr";
import { blobToImageData } from "../utils/images";
// import { format } from 'date-fns'

type ConnectWalletInputProps = {
  client: any;
  onConnect: (data: { uri: string }) => void;
};

export const ConnectWalletInput = ({
  client,
  onConnect,
}: ConnectWalletInputProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const connectWithQR = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        const imageData = await blobToImageData(event.target?.result as string);
        const code = jsQr(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          setIsConnecting(true);
          onConnect({ uri: code.data });
        } else {
          // setInvalidQRCode(true)
          setInputValue(
            `Screen Shot ` //${format(new Date(), 'yyyy-MM-dd')} at ${format(
            // new Date(),
            // 'hh.mm.ss'
            // )}`
          );
        }
      };
      reader.readAsDataURL(file);
    },
    [setIsConnecting, onConnect, setInputValue]
  );

  const connectWithUri = useCallback(
    (data: string) => {
      setInputValue(inputValue);
      if (data.startsWith("wc:")) {
        setIsConnecting(true);
        onConnect({ uri: data });
      }
    },
    [setIsConnecting, onConnect]
  );

  const onPaste = useCallback(
    async (evt: any) => {
      evt.preventDefault();
      if (!evt.clipboardData.files.length) {
        return;
      }
      const file = evt.clipboardData.files[0];
      if (file.type.startsWith("image")) {
        connectWithQR(file);
      } else if (file.type.startsWith("text")) {
        connectWithUri(await file.text());
      }
    },
    [connectWithQR, connectWithUri]
  );
  //   // // Read the file's contents, assuming it's a text file.
  //   // // There is no way to write back to it.
  //   // console.log(await file.text());
  // });

  useEffect(() => {
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
    };
  });

  const onWCChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      connectWithUri(value);
    },
    [connectWithUri]
  );

  const onWCPaste = useCallback(
    (event: any) => {
      console.log({ client });
      if (client) {
        return;
      }

      const items = event.clipboardData.items;

      for (const index in items) {
        const item = items[index];

        if (item.kind === "string" && item.type === "text/plain") {
          connectWithUri(event.clipboardData.getData("Text"));
        }

        if (item.kind === "file") {
          const blob = item.getAsFile();
          connectWithQR(blob);
        }
      }

      // setInvalidQRCode(false)
      setInputValue("");
    },
    [client, onConnect]
  );

  const dragStart = (evt: any) => {
    evt.preventDefault();
  };
  const onDrop = (evt: any) => {
    evt.preventDefault();
    if (evt.dataTransfer.items) {
      evt.dataTransfer.items.forEach((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          connectWithQR(file);
        }
      });
    }
  };

  return (
    <div
      className="my-6 w-50 h-50 m-20"
      onDragStart={dragStart}
      onDrop={onDrop}
      onDragEnter={dragStart}
    >
      WalletConnect URI: (or paste image)
      <input
        className="border-2 border-gray-200 shadow-md p-2 text-large block mt-2"
        type="text"
        onPaste={onWCPaste}
        onChange={onWCChange}
      />
      {/* <Label>{error}</Label> */}
    </div>
  );
};
