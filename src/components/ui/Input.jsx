import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, ...props },
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
      <input
        id={inputId}
        ref={ref}
        className={`h-11 rounded-xl border px-4 text-sm text-dark placeholder:text-medium/60 bg-white
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
          ${error ? 'border-red-300' : 'border-dark/10'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      {!error && hint && <span className="text-xs text-medium">{hint}</span>}
    </div>
  );
});
