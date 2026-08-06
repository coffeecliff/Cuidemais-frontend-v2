import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export const FormSelect = forwardRef(function FormSelect(
  { label, error, hint, className = '', id, children, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          ref={ref}
          className={`h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm text-dark bg-white
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            ${error ? 'border-red-300' : 'border-dark/10'} ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-medium" size={16} />
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
      {!error && hint && <span className="text-xs text-medium">{hint}</span>}
    </div>
  );
});
