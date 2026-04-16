import { FadeIn } from "@/components/ui/fade-in";

const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className="header-box space-y-1">
      <FadeIn delay={0}>
        <span className="eyebrow">{title}</span>
      </FadeIn>
      <FadeIn delay={80}>
        <h2 className="ds" style={{ color: "var(--ds-foreground)" }}>
          {type === "greeting" ? (
            <>
              Good to see you, <em>{user}.</em>
            </>
          ) : (
            <>{title}</>
          )}
        </h2>
      </FadeIn>
      <FadeIn delay={140}>
        <p className="feature-text" style={{ color: "var(--ds-muted-foreground)" }}>
          {subtext}
        </p>
      </FadeIn>
    </div>
  );
};

export default HeaderBox;
