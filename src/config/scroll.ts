export const scrollConfig = {
  lenis: {
    disableOnMobile: true,
    mobileMaxWidth: 1023,
    duration: 1.2,
    wheelMultiplier: 3,
    touchMultiplier: 1.15,
    syncTouch: true,
    syncTouchLerp: 0.08,
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
