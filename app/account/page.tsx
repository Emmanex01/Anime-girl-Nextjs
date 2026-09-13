import Link from "next/link";
import { ArrowRight, PackageCheck, PackageOpen, ShoppingBag, Wallet } from "lucide-react";
import { requireCustomer } from "@/lib/auth/customer";
import { getCustomerOrders } from "@/lib/shopify/order";

function formatCurrency(amount: string | number, currencyCode: string) {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export default async function AccountOverviewPage() {
  const customer = await requireCustomer();

  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer";
  const orders = await getCustomerOrders().catch(() => []);

  const totalOrders = orders.length;
  const fulfilled = orders.filter((order) =>
    order.fulfillmentStatus === "FULFILLED" || order.fulfillmentStatus === "PARTIALLY_FULFILLED",
  ).length;
  const pending = orders.filter((order) => {
    const status = order.fulfillmentStatus ?? "UNFULFILLED";
    return status !== "FULFILLED" && status !== "PARTIALLY_FULFILLED";
  }).length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalPrice.amount || 0), 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-2xl border p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Overview
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {name}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {customer.emailAddress?.emailAddress ?? "No email available"}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              View orders
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/account/profile"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/8"
            >
              Profile details
            </Link>
          </div>
        </div>

        <div className="glass rounded-2xl border p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Account
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
              <span>Default address</span>
              <span className="text-right text-slate-100">
                {customer.defaultAddress ? (
                  <>
                    {customer.defaultAddress.city || "Location"}
                    {customer.defaultAddress.province ? `, ${customer.defaultAddress.province}` : ""}
                  </>
                ) : (
                  "Not added"
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
              <span>Order value</span>
              <span className="font-medium text-white">{formatCurrency(totalSpent, "USD")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total orders", value: totalOrders, icon: ShoppingBag, note: "Placed" },
          { label: "Completed", value: fulfilled, icon: PackageCheck, note: "Fulfilled" },
          { label: "Pending", value: pending, icon: PackageOpen, note: "In progress" },
          { label: "Spend", value: formatCurrency(totalSpent, "USD"), icon: Wallet, note: "Lifetime" },
        ].map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="glass rounded-2xl border p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {label}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Recent orders
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">Latest activity</h3>
            </div>
            <Link href="/account/orders" className="text-sm font-medium text-neon-red hover:opacity-90">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 px-5 py-8 text-center">
              <p className="text-base font-medium text-white">No orders yet</p>
              <p className="mt-2 text-sm text-slate-400">Your order history will appear here once you make a purchase.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Order #{order.number}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(order.processedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode)}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        {order.fulfillmentStatus ?? "Processing"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.lineItems.nodes.slice(0, 3).map((item, index) => (
                      <span key={`${order.id}-${index}`} className="rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-[11px] text-slate-300">
                        {item.title} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl border p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Profile
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">Customer details</h3>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl border border-white/8 bg-white/3 p-3">
              <dt className="text-slate-400">Email</dt>
              <dd className="mt-1 font-medium text-white">{customer.emailAddress?.emailAddress ?? "Not available"}</dd>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/3 p-3">
              <dt className="text-slate-400">Name</dt>
              <dd className="mt-1 font-medium text-white">{name}</dd>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/3 p-3">
              <dt className="text-slate-400">Address</dt>
              <dd className="mt-1 font-medium text-white">
                {customer.defaultAddress ? (
                  <>
                    {customer.defaultAddress.address1 || "Address not provided"}
                    {customer.defaultAddress.city ? `, ${customer.defaultAddress.city}` : ""}
                  </>
                ) : (
                  "No default address saved"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}