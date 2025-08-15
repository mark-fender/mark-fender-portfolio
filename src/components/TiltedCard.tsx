'use client';

import type { SpringOptions } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type TiltedCardProps = {
  scaleOnHover?: number;
  rotateAmplitude?: number;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
};

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const TiltedCard = ({
  scaleOnHover = 1.1,
  rotateAmplitude = 28,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  };

  return (
    <figure
      ref={ref}
      className='relative w-full h-full [perspective:800px] flex flex-col items-center justify-center'
      style={{ height: 256, width: 256 }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <motion.div
        className='relative [transform-style:preserve-3d]'
        style={{
          width: 256,
          height: 256,
          rotateX,
          rotateY,
          scale,
        }}>
        <motion.img
          src='/assets/photo.jpeg'
          alt='marek-lipcak-portrait'
          className='absolute top-0 left-0 object-cover will-change-transform [transform:translateZ(0)] intro-image'
          style={{ width: 256, height: 256 }}
        />
        {displayOverlayContent && overlayContent && (
          <motion.div className='absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]'>
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
    </figure>
  );
};

export default TiltedCard;
