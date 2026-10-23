import type { ComponentProps } from 'react';

type NextImageProps = ComponentProps<'img'> & {
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
};

export default function NextImage({ fill, priority, quality: _quality, unoptimized: _unoptimized, className, ...props }: NextImageProps) {
  return (
    <img
      {...props}
      className={`${className || ''} ${fill ? 'absolute inset-0 h-full w-full object-cover' : ''}`.trim()}
      loading={priority ? 'eager' : props.loading || 'lazy'}
    />
  );
}
