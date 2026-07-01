interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      {icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent shadow-soft">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-foreground/60 max-w-md">{subtitle}</p>
      </div>
    </header>
  );
}
