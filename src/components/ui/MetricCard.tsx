export function MetricCard({
  label,
  value,
  eyebrow,
}: {
  label: string;
  value: string;
  eyebrow?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      {eyebrow && (
        <p className="text-xs font-medium uppercase text-slate-400">
          {eyebrow}
        </p>
      )}
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}
