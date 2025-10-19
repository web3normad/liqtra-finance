interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-700'
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const skeletonStyle = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : undefined),
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={skeletonStyle}
    />
  ))

  return count > 1 ? (
    <div className="space-y-3">{skeletons}</div>
  ) : (
    <>{skeletons}</>
  )
}
