export const scrollConfig = {
  lenis: {
    disableOnMobile: true,
    mobileBreakpoint: 768,
    duration: 1.15,
    wheelMultiplier: 1.50,
    touchMultiplier: 1.1,
    smoothWheel: true,
    syncTouch: false,
    gestureOrientation: "vertical" as const,
    infinite: false,
    generalDecelerationPower: 3,
  },
  heroArrow: {
    target: "#home-sub-hero",
    duration: 1.35,
    offset: 0,
    decelerationPower: 4,
    revealHeroFirst: true,
  },
} as const;

export function easeOutPower(power: number) {
  return (t: number) => 1 - Math.pow(1 - t, power);
}
