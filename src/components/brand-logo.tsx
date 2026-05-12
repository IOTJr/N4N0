import Image from 'next/image';

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, className = '' }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className={compact ? 'logo-badge logo-badge-sm' : 'logo-badge'}>
        <Image
          src="/logo.png"
          alt="N4N0 logo"
          width={compact ? 28 : 40}
          height={compact ? 28 : 40}
          className="h-full w-full object-contain"
          priority={false}
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-sky-200/90">N4N0</p>
        <p className="text-sm text-slate-300">Booking + Acquisition System</p>
      </div>
    </div>
  );
}
