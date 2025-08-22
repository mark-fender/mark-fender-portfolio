const MOBILE_WIDTH = 640;

const useIsMobile = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_WIDTH;
  return { isMobile };
};

export default useIsMobile;
