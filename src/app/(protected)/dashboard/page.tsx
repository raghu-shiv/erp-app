import { requireAuth } from "@/lib/rbac";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
        <h1 className="text-2xl font-bold">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-indigo-100 mt-1">
          Here&apos;s your business overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: "₹0.00", icon: "💰", change: "+0%" },
          { label: "Orders", value: "0", icon: "📦", change: "+0%" },
          { label: "Products", value: "0", icon: "📋", change: "—" },
          { label: "Low Stock", value: "0", icon: "⚠️", change: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Recent Orders</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No orders yet. Start selling from the POS terminal.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Inventory Alerts</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No alerts. All stock levels are healthy.</p>
        </div>
      </div>
    </div>
  );
}
