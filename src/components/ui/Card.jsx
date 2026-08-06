export function Card({ children, className = '', padding = 'p-6', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`bg-white rounded-2xl border border-dark/5 shadow-[0_1px_3px_rgba(62,46,93,0.06)] ${padding} ${className}`}
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
