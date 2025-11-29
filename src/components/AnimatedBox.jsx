import { useEffect, useRef } from "react";

const AnimatedBox = ({ bgColor, size }) => {
  const blueBoxRef = useRef(null);

  useEffect(() => {
    const box = blueBoxRef.current;
    if (!box) return;

    let containerWidth = window.innerWidth;
    let containerHeight = window.innerHeight;

    const boxSize = size || 200;

    // Generate random direction but with consistent speed
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const initialSpeed = 3; // Fixed initial speed for all boxes

    let x = containerWidth / 2 - boxSize / 2;
    let y = containerHeight / 2 - boxSize / 2;
    let vx = Math.cos(angle) * initialSpeed;
    let vy = Math.sin(angle) * initialSpeed;
    let animationId;

    const bounce = 0.8; // Bounce damping factor

    // Update container dimensions on window resize
    const handleResize = () => {
      containerWidth = window.innerWidth;
      containerHeight = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      // Update position
      x += vx;
      y += vy;

      // Check boundaries and bounce
      // Left edge
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx) * bounce;
      }
      // Right edge
      if (x + boxSize >= containerWidth) {
        x = containerWidth - boxSize;
        vx = -Math.abs(vx) * bounce;
      }
      // Top edge
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy) * bounce;
      }
      // Bottom edge
      if (y + boxSize >= containerHeight) {
        y = containerHeight - boxSize;
        vy = -Math.abs(vy) * bounce;
      }

      // Add slight random acceleration for organic movement
      vx += (Math.random() - 0.5) * 0.1;
      vy += (Math.random() - 0.5) * 0.1;

      // Limit maximum velocity
      const maxSpeed = 1.5;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > maxSpeed) {
        vx = (vx / speed) * maxSpeed;
        vy = (vy / speed) * maxSpeed;
      }

      // Ensure minimum velocity to keep it moving
      const minSpeed = 1;
      if (speed < minSpeed && speed > 0) {
        vx = (vx / speed) * minSpeed;
        vy = (vy / speed) * minSpeed;
      }

      box.style.transform = `translate(${x}px, ${y}px)`;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [size]);

  return (
    <div
      ref={blueBoxRef}
      className="absolute rounded-full"
      style={{
        left: "0",
        top: "0",
        width: size || "200px",
        height: size || "200px",
        willChange: "transform",
        backgroundColor: bgColor || "#3b82f6",
      }}
    ></div>
  );
};

export default AnimatedBox;
