import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'bg-light text-white hover:bg-medium border border-transparent',
  secondary: 'bg-transparent text-medium border border-light hover:bg-light/10',
  ghost: 'bg-transparent text-medium border border-transparent hover:bg-dark/5',
  danger: 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2',
};

export function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  const Component = as || 'button';
  return (
    <Component
      className={classes}
      disabled={disabled}
      type={Component === 'button' ? props.type || 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
