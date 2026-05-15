import { formatCurrency } from "../shared/credit-api";

type CreditLedgerStatsProps = {
  totalCreditAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  overdueCredits: number;
  pendingCredits: number;
  partiallyPaidCredits: number;
};

export default function CreditLedgerStats({
  totalCreditAmount,
  totalPaidAmount,
  totalRemainingAmount,
  overdueCredits,
  pendingCredits,
  partiallyPaidCredits,
}: CreditLedgerStatsProps) {
  const cards = [
    { label: "Total Credit Amount", value: formatCurrency(totalCreditAmount) },
    { label: "Total Paid Amount", value: formatCurrency(totalPaidAmount) },
    { label: "Total Remaining Amount", value: formatCurrency(totalRemainingAmount) },
    { label: "Overdue Credits", value: overdueCredits.toLocaleString() },
    { label: "Pending Credits", value: pendingCredits.toLocaleString() },
    { label: "Partially Paid Credits", value: partiallyPaidCredits.toLocaleString() },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl border border-[#c5c6cd] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#64748b]">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#1b1b1d]">{card.value}</p>
        </article>
      ))}
    </section>
  );
}

