import { requireCustomer } from "@/lib/auth/customer";
import { AccountNav } from "@/app/_components/account/account-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await requireCustomer();

  const displayName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ") || "Customer";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-8 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.18),transparent_38%),rgba(255,255,255,0.03)] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.28)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Account center
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {displayName}
            </h1>
          </div>

          <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
            Active customer
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-300">
          {customer.emailAddress?.emailAddress ?? "No email on file"}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <AccountNav />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}