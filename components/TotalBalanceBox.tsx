import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";
import { FadeIn } from "@/components/ui/fade-in";

const TotalBalanceBox = ({ balance, accountNumber }: TotalBalanceBoxProps) => {
  return (
    <FadeIn delay={160}>
      <section
        className="flex w-full items-center gap-5 rounded-xl border p-5 sm:gap-8 sm:p-6"
        style={{ borderColor: "var(--ds-border)", background: "var(--ds-card)" }}
      >
        <div className="flex w-[88px] shrink-0 items-center sm:w-[104px]">
          <DoughnutChart balance={balance} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="eyebrow">Current Balance</span>
          <div className="total-balance-amount">
            <AnimatedCounter amount={balance} />
          </div>
          <p
            className="font-mono text-12 tracking-widest"
            style={{ color: "var(--ds-muted-foreground)" }}
          >
            {accountNumber}
          </p>
        </div>
      </section>
    </FadeIn>
  );
};

export default TotalBalanceBox;
