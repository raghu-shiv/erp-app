type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  minStockAlert: number;
};

export function LowStockAlerts({ products }: { products: LowStockProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No low-stock alerts.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950/30"
        >
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-white">
              {product.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {product.sku}
            </p>
          </div>
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            {product.stockQuantity} / {product.minStockAlert}
          </span>
        </li>
      ))}
    </ul>
  );
}
