import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const WIDTH_TOTAL = 30;

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add = (other: Point) => new Point(this.x + other.x, this.y + other.y);
  sub = (other: Point) => this.add(new Point(other.x * -1, other.y * -1));
  mul = (by: number) => new Point(this.x * by, this.y * by);
  length = () => Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

class Color {
  r: number;
  g: number;
  b: number;
  constructor(r: number, g: number, b: number) {
    this.r = Math.min(255, r);
    this.g = Math.min(255, g);
    this.b = Math.min(255, b);
  }
  merge = (other: Color) =>
    new Color(this.r + other.r, this.g + other.g, this.b + other.b);
  invert = () => new Color(255 - this.r, 255 - this.g, 255 - this.b);
  toHexString = () => `rgb(${this.r}, ${this.g}, ${this.b})`;
  isBlack = () => this.r === 0 && this.g === 0 && this.b === 0;
}

class Circle {
  color: Color;
  position: Point;
  radius: number;
  constructor(position: Point, radius: number, color: Color) {
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  shouldRender(at: Point) {
    const newPoint = this.position.sub(at);
    const result = newPoint.length();
    return result < this.radius;
  }
}

const Logo = ({ size = WIDTH_TOTAL }: { size?: number }) => {
  const originalSize = size;
  size = 30;
  const canvasRef = useRef<HTMLCanvasElement>();
  /**
   * TODO: could animated this - circles rotating.
   */
  useLayoutEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const center = new Point(size / 2, size / 2);
      const radius = Math.sqrt(size) * 1.4;
      const circles = [
        new Circle(
          new Point(0, -1).mul(radius / 2).add(center),
          radius,
          new Color(255, 0, 0)
        ),
        new Circle(
          new Point(-1, 1).mul(radius / 2).add(center),
          radius,
          new Color(0, 255, 0)
        ),
        new Circle(
          new Point(1, 1).mul(radius / 2).add(center),
          radius,
          new Color(0, 0, 255)
        ),
      ];
      for (let xi = 0; xi < size; xi++) {
        for (let yi = 0; yi < size; yi++) {
          const atPoint = new Point(xi, yi);
          const newColor = circles
            .filter((circle) => circle.shouldRender(atPoint))
            .reduce(
              (last: Color, at: Circle) => last.merge(at.color),
              new Color(0, 0, 0)
            );
          ctx.fillStyle = newColor.isBlack()
            ? "#fbfbfb"
            : newColor.toHexString();
          ctx.fillRect(xi, yi, 1, 1);
        }
      }
    }
  }, [canvasRef]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      exit={{ opacity: 0 }}
    >
      <Link href="/">
        <canvas
          width={size}
          height={size}
          style={{
            imageRendering: "pixelated",
            width: originalSize,
            height: originalSize,
          }}
          className="inline-block -mt-2"
          ref={canvasRef}
        />
        <span className="pl-2 hover:underline">NounsConnect</span>
      </Link>
    </motion.div>
  );
};

export default Logo;
