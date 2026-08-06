import { forwardRef, useId } from 'react';

export const TextArea = forwardRef(function TextArea(
  { label, error, hint, className = '', id, rows = 4, ...props },
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
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={`rounded-xl border px-4 py-3 text-sm text-dark placeholder:text-medium/60 bg-white resize-none
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
          ${error ? 'border-red-300' : 'border-dark/10'} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      {!error && hint && <span className="text-xs text-medium">{hint}</span>}
    </div>
  );
});
