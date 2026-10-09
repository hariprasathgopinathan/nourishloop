import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] duration-200 tracking-wide";

  const variants = {
    primary: "bg-brand-donor text-white hover:bg-brand-donor-hover focus:ring-brand-donor shadow-sm",
    secondary: "bg-white text-brand-text border border-gray-200 hover:bg-gray-50 focus:ring-brand-donor shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    dangerOutline: "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-brand-text focus:ring-gray-200",
    ngoPrimary: "bg-brand-ngo text-white hover:bg-brand-ngo-hover focus:ring-brand-ngo shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-60 cursor-not-allowed active:scale-100' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
