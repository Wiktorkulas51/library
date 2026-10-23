import type { ComponentProps, ReactNode } from 'react';

type MarqueeProps = ComponentProps<'div'> & {
  children: ReactNode;
  pauseOnHover?: boolean;
};

export function Marquee({ children, className = '', pauseOnHover = false, ...props }: MarqueeProps) {
  return (
    <div
      className={`twentyfirst-marquee relative flex overflow-hidden ${pauseOnHover ? 'twentyfirst-marquee-pause' : ''} ${className}`}
      {...props}
    >
      <div className="twentyfirst-marquee-track flex shrink-0 items-stretch">
        <div className="flex shrink-0 items-stretch">{children}</div>
        <div className="flex shrink-0 items-stretch" aria-hidden="true">{children}</div>
      </div>
      <style>{`
        @keyframes twentyfirst-marquee-scroll {
          to { transform: translateX(calc(-50% - var(--gap, 0px) / 2)); }
        }
        .twentyfirst-marquee-track {
          min-width: max-content;
          gap: var(--gap, 0px);
          animation: twentyfirst-marquee-scroll var(--duration, 40s) linear infinite;
        }
        .twentyfirst-marquee-pause:hover .twentyfirst-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .twentyfirst-marquee-track { animation-play-state: paused; }
        }
      `}</style>
    </div>
  );
}
