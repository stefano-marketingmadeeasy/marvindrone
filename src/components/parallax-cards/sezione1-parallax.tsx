"use client";

import { useRef } from "react";
import { CalendarDays, Clapperboard, Film, Megaphone, Tv } from "lucide-react";
import { useScroll } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ParallaxCardEffect from "./parallax-card-effect";

type CardItem = {
  title: string;
  description: string;
  icon: "cinema" | "serie-tv" | "documentari" | "adv" | "eventi";
};

type Props = {
  cards: CardItem[];
};

const iconMap = {
  cinema: Film,
  "serie-tv": Tv,
  documentari: Clapperboard,
  adv: Megaphone,
  eventi: CalendarDays
} as const;

const accentMap = {
  cinema: "from-sky-500/20 via-transparent to-transparent",
  "serie-tv": "from-cyan-400/20 via-transparent to-transparent",
  documentari: "from-stone-400/20 via-transparent to-transparent",
  adv: "from-amber-400/20 via-transparent to-transparent",
  eventi: "from-rose-400/20 via-transparent to-transparent"
} as const;

export default function Sezione1Parallax({ cards }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative">
      <div className="mx-auto max-w-6xl pt-6 sm:pt-8 lg:pt-10">
        {cards.map((card, index) => {
          const Icon = iconMap[card.icon];
          const targetScale = 1 - (cards.length - index) * 0.05;

          return (
            <ParallaxCardEffect
              key={`${card.icon}-${card.title}`}
              id={index}
              progress={scrollYProgress}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
              className="relative w-[calc(100vw-2rem)] max-w-[58rem]">
              <Card className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(18,30,42,0.96),rgba(10,18,28,0.98))] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
                <CardContent className="grid min-h-[25rem] gap-0 p-0 sm:min-h-[28rem] md:grid-cols-[0.92fr_1.08fr]">
                  {/* Visual panel */}
                  <div className="relative flex min-h-[16rem] items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,#172738_0%,#0f1a26_100%)] p-8 md:min-h-full md:border-r md:border-b-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.06),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:auto,28px_28px,28px_28px]" />
                    <div className={cn("absolute inset-0 bg-gradient-to-br", accentMap[card.icon])} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(6,12,18,0.22)_100%)]" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 shadow-[0_18px_42px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:h-32 sm:w-32">
                      <Icon className="h-12 w-12 text-white sm:h-14 sm:w-14" strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="flex items-center p-7 sm:p-9 md:p-12">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        {card.title}
                      </h3>
                      <p className="max-w-[30ch] text-pretty text-base leading-7 text-white/72 sm:text-lg">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ParallaxCardEffect>
          );
        })}
      </div>
    </div>
  );
}
