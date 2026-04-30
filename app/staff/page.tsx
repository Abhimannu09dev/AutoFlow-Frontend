import {
  LayoutGrid,
  UserPlus,
  Users,
  FileText,
  BarChart3,
  Mail,
  Search,
  Bell,
  IdCard,
  Car,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const sideNavItems = [
  "Dashboard",
  "Customer Registration",
  "Customer Management",
  "Sales & Invoices",
  "Reports",
  "Email Service",
];

const iconMap = [LayoutGrid, UserPlus, Users, FileText, BarChart3, Mail];

function SideNavIcon({ index, active }: { index: number; active: boolean }) {
  const IconComponent = iconMap[index];
  const stroke = active ? "#4338CA" : "#64748B";

  return (
    <IconComponent width={18} height={18} stroke={stroke} aria-hidden="true" />
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-[#dfe4ee] bg-[#f3f5fa] px-4 py-8 lg:flex lg:flex-col">
          <div className="mb-10 px-3">
            <h2 className="text-[26px] font-semibold leading-none text-[#4b3bb8]">
              Kinetic Atelier
            </h2>
            <p className="mt-2 text-[10px] font-semibold tracking-[0.18em] text-[#6b7280]">
              STAFF PANEL
            </p>
          </div>

          <nav className="space-y-2">
            {sideNavItems.map((item, index) => {
              const active = index === 1;
              return (
                <button
                  key={item}
                  className={`relative flex w-full items-center gap-3 px-3 py-3 text-left text-[14px] font-medium transition ${
                    active
                      ? "bg-[#eceef5] text-[#4b3bb8]"
                      : "text-[#6d7785] hover:bg-[#eceef5]"
                  }`}
                  type="button"
                >
                  <span className="inline-flex w-7 items-center justify-center">
                    <SideNavIcon index={index} active={active} />
                  </span>
                  <span
                    className={
                      item === "Customer Management" ? "leading-[1.05]" : ""
                    }
                  >
                    {item === "Customer Management" ? (
                      <>
                        Customer
                        <br />
                        Management
                      </>
                    ) : (
                      item
                    )}
                  </span>
                  {active ? (
                    <span className="absolute right-0 top-1/2 h-11 w-1.5 -translate-y-1/2 rounded-l bg-[#4b3bb8]" />
                  ) : null}
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            className="mt-auto h-12 rounded-xl bg-gradient-to-r from-[#2f1ed0] to-[#5970ff] text-[16px] font-semibold text-white shadow-[0_8px_16px_rgba(64,58,208,0.24)]"
          >
            + New Service
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-[#e4e7f0] bg-[#f1f3f7]">
            <div className="flex h-14 items-center justify-between px-4 sm:px-8">
              <label className="flex h-9 w-full max-w-md items-center gap-2 rounded-full border border-[#e6e9f1] bg-white px-4 text-sm text-[#9aa4b2]">
                <Search width={18} height={18} />
                Global search...
              </label>
              <div className="ml-4 flex items-center gap-6 text-sm text-[#1e293b]">
                <button type="button" className="font-medium text-[#334155]">
                  Help
                </button>
                <button type="button" className="relative text-[#475569]">
                  <Bell width={22} height={22} />
                  <span className="absolute -right-1 top-0 size-2 rounded-full bg-[#dc2626]" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right leading-tight">
                    <p className="text-sm font-semibold">Alex Fischer</p>
                    <p className="text-[10px] uppercase tracking-wide text-[#64748b]">
                      Senior Curator
                    </p>
                  </div>
                  <div className="size-9 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8]" />
                </div>
              </div>
            </div>
          </header>

          <main className="  flex-1 px-4 py-8 sm:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold leading-tight text-[#0f172a]">
                  New Customer
                </h1>
                <p className="mt-2 text-[16px] text-[#334155]">
                  Initialize a new relationship within the Atelier ecosystem.
                </p>
              </div>
              <div className="hidden items-center gap-4 xl:flex">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-[#0f172a]" />
                  <div className="size-8 rounded-full border-2 border-white bg-[#7c4f35]" />
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#dbe5ff] text-[10px] font-semibold text-[#4f46e5]">
                    +12
                  </div>
                </div>
                <p className="text-[14px] text-[#475569]">
                  Recently added registrars
                </p>
              </div>
            </div>

            <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#f8f9fb] p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#dedcf2] text-[#4338ca]">
                      <IdCard width={22} height={22} />
                    </div>
                    <h2 className="text-[24px] font-semibold text-[#111827]">
                      Identity &amp; Contact
                    </h2>
                  </div>
                  <div className="space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#475569]">
                        Full Legal Name
                      </span>
                      <input
                        className="h-12 w-full rounded-xl border border-transparent bg-[#edf0f8] px-4 text-[17px] text-[#334155] outline-none placeholder:text-[#9aa5b1] focus:border-[#c7cffc]"
                        defaultValue="e.g. Maximilian Weber"
                      />
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#475569]">
                          Phone Number
                        </span>
                        <input
                          className="h-12 w-full rounded-xl border border-transparent bg-[#edf0f8] px-4 text-[17px] text-[#334155] outline-none placeholder:text-[#9aa5b1] focus:border-[#c7cffc]"
                          defaultValue="+49 123 4567 890"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#475569]">
                          Email Address
                        </span>
                        <input
                          className="h-12 w-full rounded-xl border border-transparent bg-[#edf0f8] px-4 text-[17px] text-[#334155] outline-none placeholder:text-[#9aa5b1] focus:border-[#c7cffc]"
                          defaultValue="m.weber@example.com"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#475569]">
                        Residential Address
                      </span>
                      <input
                        className="h-16 w-full rounded-xl border border-transparent bg-[#edf0f8] px-4 text-[17px] text-[#334155] outline-none placeholder:text-[#9aa5b1] focus:border-[#c7cffc]"
                        defaultValue="Street name, Building, City, ZIP"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#eef1fa] p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#dff3ef] text-[#0f766e]">
                      <Car width={22} height={22} />
                    </div>
                    <h3 className="text-[24px] font-semibold text-[#111827]">
                      Vehicle Specification{" "}
                      <span className="text-[18px] font-normal text-[#64748b]">
                        (Optional)
                      </span>
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    {[
                      ["Make", "Porsche"],
                      ["Model", "911 Carrera"],
                      ["Year", "2024"],
                      ["VIN", "17-Digit VIN"],
                    ].map(([label, value]) => (
                      <label key={label} className="block">
                        <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#475569]">
                          {label}
                        </span>
                        <input
                          className="h-12 w-full rounded-xl border border-transparent bg-[#f9fafc] px-4 text-[17px] text-[#475569] outline-none focus:border-[#c7cffc]"
                          defaultValue={value}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    className="h-12 min-w-36 rounded-xl border border-[#d9ddea] bg-white px-6 text-[16px] font-semibold text-[#374151]"
                  >
                    Reset Fields
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-12 min-w-48 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4338ca] to-[#4f46e5] px-6 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(67,56,202,0.35)]"
                  >
                    <Check width={20} height={20} />
                    <span>Save Customer</span>
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-[#21314a] p-6 text-white shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
                  <h3 className="mb-5 text-[22px] font-semibold">
                    Atelier Quality Check
                  </h3>
                  <div className="space-y-4 text-[#c7d2e6]">
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center text-[#88f1e7]">
                        <ShieldCheck width={24} height={24} />
                      </span>
                      <div>
                        <p className="text-[20px] font-semibold text-[#d9fff9]">
                          Identity Verification
                        </p>
                        <p className="mt-1 text-[15px] leading-snug">
                          System cross-references regional databases for profile
                          accuracy.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center text-[#88f1e7]">
                        <ShieldCheck width={24} height={24} />
                      </span>
                      <div>
                        <p className="text-[20px] font-semibold text-[#d9fff9]">
                          Privacy Encryption
                        </p>
                        <p className="mt-1 text-[15px] leading-snug">
                          Personal data is secured with AES-256 bank-level
                          encryption.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center text-[#88f1e7]">
                        <Sparkles width={24} height={24} />
                      </span>
                      <div>
                        <p className="text-[20px] font-semibold text-[#d9fff9]">
                          VIN Auto-Populate
                        </p>
                        <p className="mt-1 text-[15px] leading-snug">
                          Inputting a vin will automatically fetch parts
                          compatibility lists.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-[#071425] text-white">
                  <Image
                    src="/auth-bg.svg"
                    alt="Atelier workspace background"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,20,37,0.85),rgba(7,20,37,0.18)_50%,rgba(7,20,37,0.12))]" />
                  <div className="relative flex min-h-64 items-end p-5">
                    <div>
                      <p className="text-[20px] font-semibold">
                        Curating Perfection
                      </p>
                      <p className="mt-2 text-[15px] text-white/80">
                        Every customer profile allows for precision maintenance
                        planning.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-[#0b7b73] px-6 py-5 text-white shadow-[0_10px_22px_rgba(11,123,115,0.26)]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#05645f] text-white">
                      <Check width={13} height={13} />
                    </span>
                    <div>
                      <p className="text-[19px] font-semibold leading-tight text-[#7de6db]">
                        Ready to Register
                      </p>
                      <p className="mt-1 text-[12px] text-[#86d8cf]">
                        All mandatory fields have been validated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
