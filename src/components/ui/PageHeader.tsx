export function PageHeader({ title, description }: { title: string; description: string }) {
  return <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p></div>;
}

