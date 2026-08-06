export function Card({ children, className = '', padding = 'p-6', as: Component = 'div', interactive = false, ...props }) {
  return (
    <Component
      className={`bg-white rounded-2xl border border-dark/5 shadow-[0_1px_3px_rgba(62,46,93,0.06)] transition-colors ${
        interactive ? 'cursor-pointer hover:border-accent/30 hover:shadow-[0_4px_16px_rgba(161,142,242,0.15)]' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.Header = function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-dark">{title}</h3>}
        {subtitle && <p className="text-sm text-medium mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};
