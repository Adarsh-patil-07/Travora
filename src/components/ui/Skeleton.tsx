interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#E5E3DD] rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}
