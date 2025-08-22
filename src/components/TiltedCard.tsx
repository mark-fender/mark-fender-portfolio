'use client';

import type { PropsWithChildren } from 'react';
import type { SpringOptions } from 'framer-motion';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type TiltedCardProps = PropsWithChildren<{
  scaleOnHover?: number;
  rotateAmplitude?: number;
  displayOverlayContent?: boolean;
}>;

const SPRING_CONFIG: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const CARD_SIZE = 256;

const TiltedCard = ({
  children,
  scaleOnHover = 1.1,
  rotateAmplitude = 28,
  displayOverlayContent = false,
}: TiltedCardProps) => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), SPRING_CONFIG);
  const rotateY = useSpring(useMotionValue(0), SPRING_CONFIG);
  const scale = useSpring(1, SPRING_CONFIG);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const lastY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(clientX - rect.left);
    y.set(clientY - rect.top);

    const velocityY = offsetY - lastY.current;
    rotateFigcaption.set(-velocityY * 0.6);
    lastY.current = offsetY;
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
      style={{ height: CARD_SIZE, width: CARD_SIZE }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <motion.div
        className='relative [transform-style:preserve-3d]'
        style={{
          width: CARD_SIZE,
          height: CARD_SIZE,
          rotateX,
          rotateY,
          scale,
        }}>
        <motion.img
          src='/assets/photo.jpeg'
          alt='marek-lipcak-portrait'
          className='absolute top-0 left-0 object-cover will-change-transform [transform:translateZ(0)] intro-image'
          style={{ width: CARD_SIZE, height: CARD_SIZE }}
        />
        {displayOverlayContent && children && (
          <motion.div className='absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]'>
            {children}
          </motion.div>
        )}
      </motion.div>
    </figure>
  );
};

export default TiltedCard;
