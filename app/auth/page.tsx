const sideNavItems = [
  "Dashboard",
  "Customer Registration",
  "Customer Management",
  "Sales & Invoices",
  "Reports",
  "Email Service",
];

function SideNavIcon({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? "#4338CA" : "#64748B";

  if (index === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={stroke} strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={stroke} strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={stroke} strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke={stroke} strokeWidth="2" />
        <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M17.5 5.5v6M14.5 8.5h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke={stroke} strokeWidth="2" />
        <circle cx="16.5" cy="9.5" r="2.5" stroke={stroke} strokeWidth="2" />
        <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M13 18c.4-2 1.9-3.5 4-3.5 1.4 0 2.7.7 3.5 2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="14" height="18" rx="2" stroke={stroke} strokeWidth="2" />
        <path d="M8 3v4M14 3v4M7 10h8M7 14h8M7 18h5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 4) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V12M10 20V5M16 20V9M20 20H3" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={stroke} strokeWidth="2" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
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
                  <span className={item === "Customer Management" ? "leading-[1.05]" : ""}>
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
                <span className="text-base leading-none">⌕</span>
                Global search...
              </label>
              <div className="ml-4 flex items-center gap-6 text-sm text-[#1e293b]">
                <button type="button" className="font-medium text-[#334155]">
                  Help
                </button>
                <button type="button" className="relative text-[#475569]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4a5 5 0 0 0-5 5v3.7c0 .5-.2 1-.5 1.3l-1 1.2c-.6.8 0 1.8 1 1.8h11c1 0 1.6-1 1-1.8l-1-1.2c-.3-.3-.5-.8-.5-1.3V9a5 5 0 0 0-5-5Z"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 18a2.5 2.5 0 0 0 5 0"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
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
                <h1 className="text-4xl font-semibold leading-tight text-[#0f172a]">
                  New Customer
                </h1>
                <p className="mt-2 text-[20px] text-[#334155]">
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
                <p className="text-[14px] text-[#475569]">Recently added registrars</p>
              </div>
            </div>

            <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#f8f9fb] p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#dedcf2] text-[#4338ca]">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect
                          x="3.5"
                          y="6"
                          width="17"
                          height="14.5"
                          rx="1.8"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                        <rect
                          x="9.1"
                          y="2.5"
                          width="5.8"
                          height="5.2"
                          rx="1.3"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        />
                        <circle cx="9.1" cy="12.2" r="1.6" fill="currentColor" />
                        <path
                          d="M6.9 16.3c.35-1.55 1.3-2.35 2.2-2.35.95 0 1.9.84 2.2 2.35"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14.4 12h3.2M14.4 15.6h3.2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
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
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6.4 6.6h11.2l1.6 4.4H4.8l1.6-4.4Z"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="4.8"
                          y="11"
                          width="14.4"
                          height="6.8"
                          rx="1.6"
                          stroke="currentColor"
                          strokeWidth="2.3"
                        />
                        <circle cx="7.9" cy="14.4" r="1.1" fill="currentColor" />
                        <circle cx="16.1" cy="14.4" r="1.1" fill="currentColor" />
                      </svg>
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
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
                      <path
                        d="m8.2 12.2 2.5 2.5 5.1-5.1"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Save Customer</span>
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-[#21314a] p-6 text-white shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
                  <h3 className="mb-5 text-[22px] font-semibold">Atelier Quality Check</h3>
                  <div className="space-y-4 text-[#c7d2e6]">
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center text-[#88f1e7]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M12 3l7 3v5.8c0 4.4-2.8 8.4-7 9.8-4.2-1.4-7-5.4-7-9.8V6l7-3Z"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="m8.7 12.1 2.1 2.1 4.5-4.5"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M12 3l7 3v5.8c0 4.4-2.8 8.4-7 9.8-4.2-1.4-7-5.4-7-9.8V6l7-3Z"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 6.2v12.9M5.9 11.8H12"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <div>
                      <p className="text-[20px] font-semibold text-[#d9fff9]">
                        Privacy Encryption
                      </p>
                      <p className="mt-1 text-[15px] leading-snug">
                        Personal data is secured with AES-256 bank-level encryption.
                      </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center text-[#88f1e7]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M12 3.8 13.5 7l3.5 1.5-3.5 1.5L12 13.2 10.5 10 7 8.5 10.5 7 12 3.8Z"
                            fill="currentColor"
                          />
                          <path
                            d="M18.2 11.6 19 13.3l1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.7ZM7.2 13.6 8.2 15.9l2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1 1-2.3Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <div>
                      <p className="text-[20px] font-semibold text-[#d9fff9]">
                        VIN Auto-Populate
                      </p>
                      <p className="mt-1 text-[15px] leading-snug">
                        Inputting a vin will automatically fetch parts compatibility
                        lists.
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-[#071425] text-white">
                  <div className="absolute inset-0 bg-[url('/car-bg.svg')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,20,37,0.85),rgba(7,20,37,0.18)_50%,rgba(7,20,37,0.12))]" />
                  <div className="relative flex min-h-64 items-end p-5">
                    <div>
                      <p className="text-[20px] font-semibold">Curating Perfection</p>
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
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="m7.2 12.4 3 3 6.6-6.6"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
