import type { ComponentProps } from 'react';

type LogoProps = ComponentProps<'svg'>;

function Wordmark({ name, mark, ...props }: LogoProps & { name: string; mark: string }) {
  return (
    <svg viewBox="0 0 240 72" role="img" aria-label={name} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d={mark} fill="currentColor" />
      <text x="54" y="45" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="25" fontWeight="700" letterSpacing="-1">{name}</text>
    </svg>
  );
}

export const Logo01 = (props: LogoProps) => <Wordmark name="TechCorp" mark="M12 22h30v30H12z" {...props} />;
export const Logo02 = (props: LogoProps) => <Wordmark name="InsightTech" mark="M14 46 27 20l13 26H14Zm13-9h15v9H27z" {...props} />;
export const Logo03 = (props: LogoProps) => <Wordmark name="DesignPro" mark="M12 20h30v8H12zm0 14h20v8H12zm0 14h12v8H12z" {...props} />;
export const Logo04 = (props: LogoProps) => <Wordmark name="BrandBoost" mark="M27 12 44 30 27 48 10 30z" {...props} />;
export const Logo05 = (props: LogoProps) => <Wordmark name="CodeCrafters" mark="M14 17h26v26H14z M20 23v14m7-14v14m7-14v14" {...props} />;
export const Logo06 = (props: LogoProps) => <Wordmark name="InnovateX" mark="M11 19h13v13H11zm18 0h13v13H29z M20 37h13v13H20z" {...props} />;
