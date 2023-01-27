import { useMemo, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useDebounce } from "../hooks/useDebounce";

const ImageItem = ({ id, x, y }: { id: number; x: number; y: number }) => {
  const item = {
    hidden: {
      opacity: 0,
      rotate: 25,
    },
    show: {
      opacity: 1,
      rotate: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.25,
      rotate: -360,
    },
  };

  const size = useMemo(() => Math.random() * (17 - 7) + 7, []);

  return (
    <motion.div
      style={{
        top: y,
        left: x,
        width: `${size}vmin`,
        height: `${size}vmin`,
      }}
      key={`${x}-${y}`}
      variants={item}
      className="absolute z-0"
    >
      <img
        alt=""
        className="w-full h-full object-contain inset-0 margin-auto top-0 bottom-0 left-0 right-0 absolute"
        srcSet={`/img/splash/${id}.png 2x`}
      />
    </motion.div>
  );
};

export default function SplashImageScatter() {
  const [coords, setCoords] = useState([]);
  const [sizes, setSizes] = useState([0, 0]);

  // Might debounce this or sense for mobile or more substantial viewport change
  const debouncedResizeHandler = useDebounce(() => {
    setSizes([window.innerWidth, window.innerHeight]);
  }, 300);

  useEffect(() => {
    window.addEventListener("resize", debouncedResizeHandler);
    return () => {
      window.removeEventListener("resize", debouncedResizeHandler);
    };
  });

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const imageIds = [...Array.from({ length: 10 }).map((_, indx) => indx + 1)];
    setCoords(
      imageIds.map((id) => {
        const x = Math.floor(
          ((Math.random() + 1) * width) / 8 +
            (width / 3.5) *
              (Math.sin((id / 5) * Math.PI + Math.random() / 10) + 1)
        );
        const y = Math.floor(
          ((Math.random() + 1) * height) / 8 +
            (height / 3.75) *
              (Math.cos((id / 5) * Math.PI + Math.random() / 10) + 1)
        );
        return { x, y, id };
      })
    );
  }, [sizes]);

  const { pathname } = useRouter();

  const container = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
      },
    },
  };

  return (
    <AnimatePresence>
      {pathname === "/" && coords.length && (
        <motion.div
          key="scatter"
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
          id="splash-scatter"
          className="fixed w-screen h-[80vh] top-0 pointer-events-none"
        >
          {coords.map(({ x, y, id }) => (
            <ImageItem key={id} id={id} x={x} y={y} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
