import { Sidebar } from './Sidebar';

export function DashboardLayout({ title, subtitle, action, children }) {
  return (
    <div className="flex min-h-screen bg-background md:flex-row flex-col">
      <Sidebar />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        {(title || action) && (
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              {title && <h1 className="text-2xl font-bold text-dark">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-medium">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
