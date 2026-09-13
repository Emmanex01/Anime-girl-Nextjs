import Link from "next/link";
import { MapPin, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { requireCustomer } from "@/lib/auth/customer";

export default async function ProfilePage() {
  const customer = await requireCustomer();
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Customer";
  const email = customer.emailAddress?.emailAddress ?? "Not available";
  const defaultAddress = customer.defaultAddress;
  const profileCompletion = [
    !!customer.firstName,
    !!customer.lastName,
    !!customer.emailAddress,
    !!defaultAddress,
  ].filter(Boolean).length;

  return (
    <section className="space-y-6">
      <div className="glass rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neon-red/30 bg-neon-red/10 text-neon-red">
              <UserCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{name}</h2>
              <p className="mt-1 text-sm text-slate-300">{email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              Active account
            </span>
            <Link
              href="/account/addresses"
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Update address
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Personal information
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">Account details</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
              {profileCompletion}/4 complete
            </span>
          </div>

          <dl className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Full name</dt>
              <dd className="mt-2 text-base font-medium text-white">{name}</dd>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <Mail className="h-3.5 w-3.5" /> Email
              </dt>
              <dd className="mt-2 text-base font-medium text-white">{email}</dd>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <UserCircle2 className="h-3.5 w-3.5" /> Phone number
              </dt>
              <dd className="mt-2 text-base font-medium text-slate-300">Not provided</dd>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> Default address
              </dt>
              <dd className="mt-2 text-base font-medium text-white">
                {defaultAddress ? (
                  <>
                    {defaultAddress.address1 || "Address line 1 not provided"}
                    {defaultAddress.city ? `, ${defaultAddress.city}` : ""}
                    {defaultAddress.province ? `, ${defaultAddress.province}` : ""}
                  </>
                ) : (
                  "No default address saved yet"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl border p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Security & access
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-slate-400">Login method</p>
                <p className="mt-1 font-medium text-white">Email and password</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-slate-400">Account status</p>
                <p className="mt-1 font-medium text-emerald-300">Verified customer</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-slate-400">Notifications</p>
                <p className="mt-1 font-medium text-white">Managed through your Shopify account</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border p-5 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Profile status
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Complete your profile</h3>
            <p className="mt-3 text-sm text-slate-300">
              Add a phone number and default shipping address to make future orders faster.
            </p>
            <Link
              href="/account/addresses"
              className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/8"
            >
              Manage addresses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
