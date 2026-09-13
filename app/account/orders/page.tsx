import Link from "next/link";
import { AlertCircle, PackageOpen, ShoppingBag } from "lucide-react";
import { getCustomerOrders } from "@/lib/shopify/order";

function formatCurrency(amount: string | number, currencyCode: string) {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function inferStatusTone(status?: string | null) {
  const normalized = (status || "").toUpperCase();

  if (["FULFILLED", "PAID", "COMPLETE", "DELIVERED"].includes(normalized)) {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
  }

  if (["PENDING", "OPEN", "UNFULFILLED", "PROCESSING"].includes(normalized)) {
    return "border-amber-500/25 bg-amber-500/10 text-amber-300";
  }

  if (["PARTIALLY_FULFILLED", "PARTIALLY_PAID"].includes(normalized)) {
    return "border-blue-500/25 bg-blue-500/10 text-blue-300";
  }

  return "border-white/10 bg-white/5 text-slate-200";
}

function formatStatusLabel(status?: string | null) {
  if (!status) return "Processing";

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof getCustomerOrders>> = [];

  try {
    orders = await getCustomerOrders();
  } catch {
    return (
      <section className="glass rounded-2xl border p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-400" />
        <h2 className="mt-4 text-xl font-semibold text-white">Unable to load orders</h2>
        <p className="mt-2 text-sm text-slate-300">Your order history is temporarily unavailable.</p>
        <Link
          href="/account/orders"
          className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/8"
        >
          Try again
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Orders
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Order history</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
          <ShoppingBag className="h-3.5 w-3.5" />
          {orders.length} total
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-neon-red/25 bg-neon-red/10 text-neon-red">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">No orders yet</h3>
          <p className="mt-2 text-sm text-slate-300">
            Your purchases will appear here once they are placed.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const financialStatus = formatStatusLabel(order.financialStatus);
            const fulfillmentStatus = formatStatusLabel(order.fulfillmentStatus);
            const summarizedItems = order.lineItems.nodes.slice(0, 3);

            return (
              <article
                key={order.id}
                id={`order-${order.id}`}
                className="glass rounded-2xl border p-4 transition hover:border-white/20 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Order #{order.number}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {new Date(order.processedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${inferStatusTone(order.financialStatus)}`}>
                      {financialStatus}
                    </span>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${inferStatusTone(order.fulfillmentStatus)}`}>
                      {fulfillmentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Items
                    </p>
                    <ul className="mt-3 space-y-2">
                      {summarizedItems.map((item, index) => (
                        <li key={`${order.id}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-sm text-slate-200">
                          <span className="truncate pr-3">{item.title || "Product"}</span>
                          <span className="shrink-0 text-slate-400">Qty {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Total
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                    </p>
                    <a
                      href={`#order-${order.id}`}
                      className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/8"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}