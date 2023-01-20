import { useCallback, useEffect, useState } from "react";
import jsQR from "jsqr";
import { blobToImageData } from "../utils/images";
import { toast } from "react-hot-toast";
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
  const [dragging, setDragging] = useState(false);

  const connectWithQR = useCallback(
    async (file: File) => {
      console.log("connect as qr");

      const reader = new FileReader();
      reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
        console.log({ event });
      });
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        console.log("onload");
        const imageData = await blobToImageData(event.target?.result as string);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        console.log({ code });

        if (code?.data) {
          setIsConnecting(true);
          onConnect({ uri: code.data });
        } else {
          toast("Invalid QR Code");
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

  const onFileChange = useCallback(
    (event: any) => {
      connectWithQR(event.target.files[0]);
    },
    [connectWithQR]
  );

  const onWCPaste = useCallback(
    (event: any) => {
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
    setDragging(true);
    console.log("drag start");
    evt.preventDefault();
  };
  const dragEnd = () => {
    setDragging(false);
  }
  const onDrop = (evt: any) => {
    dragEnd();
    evt.preventDefault();
    console.log("drop", evt);
    if (evt?.dataTransfer?.items) {
      for (const item of evt.dataTransfer.items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          connectWithQR(file);
        }
      }
    }
  };

  return (
    <div
      className="rounded-lg relative border mx-4 flex flex-col items-center bg-white p-8"
      onDragStart={dragStart}
      onDrop={onDrop}
      onDragEnd={dragEnd}
      onDragExit={dragEnd}
      onDragEnter={dragStart}
      onDragOver={dragStart}
    >
      {dragging && (
        <div className="inset-0 absolute bg-white/60 font-pt font-2xl m-10">
          Drag QR code image here.
        </div>
      )}
      <img
        src="/img/design/walletconnect.png"
        width="160"
        height="80"
        alt="WalletConnect"
      />
      <p className="text-center font-pt font-xl mt-2">
        Go to the app you want to connect to and <br /> select WalletConnect
      </p>
      <div className="my-6 font-pt w-full m-20">
        <input
          type="file"
          id="file-input"
          onChange={onFileChange}
          className="hidden"
        />
        <div className="flex border-2 border-gray-200 shadow-md p-1 text-large rounded-lg">
          <label htmlFor="file-input" className="cursor-pointer block p-4">
            <img
              alt="Upload a file to connect to QR"
              src="/img/design/qr.png"
              width="20"
              height="20"
            />
          </label>
          <input
            className="flex-grow pl-4"
            type="text"
            onPaste={onWCPaste}
            onChange={onWCChange}
            placeholder="  Connection URI or QR Code Image"
          />
        </div>
      </div>
    </div>
  );
};
