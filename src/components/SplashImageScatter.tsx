import { useCallback, useEffect, useState } from "react";

const ImageItem = ({ id, x, y }: { id: number; x: number; y: number }) => {
  return (
    <img
      alt=""
      srcSet={`/img/splash/${id}.png 2x`}
      style={{ top: y, left: x }}
      className="absolute"
    />
  );
};

export const SplashImageScatter = () => {
  const [coords, setCoords] = useState([]);
  const [sizes, setSizes] = useState([0, 0]);

  const resizeHandler = useCallback(() => {
    setSizes([window.innerWidth, window.innerHeight]);
  }, [setSizes]);

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  })

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const imageIds = [...Array.from({ length: 10 }).map((_, indx) => indx + 1)];
    setCoords(
      imageIds.map((id) => {
        const x = Math.floor(
          (Math.random()+1) * width / 8 + width/3.5 * (Math.sin(id/5*Math.PI + Math.random()/4) + 1)
        );
        const y = Math.floor(
          (Math.random()+1) * height/6 + height/3.5  * (Math.cos(id/5*Math.PI + Math.random()/4) + 1)
        );
        return { x, y, id };
      })
    );
  }, [sizes]);

  return (
    <div className={"absolute inset-0 -z-10"}>
      {coords.map(({ x, y, id }) => (
        <ImageItem id={id} key={id} x={x} y={y} />
      ))}
    </div>
  );
};
