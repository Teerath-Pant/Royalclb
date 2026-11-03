/** Page chrome the landscape games share: top bar with the round timer, fullscreen button, wallet and chips. */
import type { ReactNode } from "react";

// The page CSS was built by Vue, so its rules are scoped to these two attributes.
export const A = { "data-v-03b808c2": "" };
export const B = { "data-v-106b99c8": "" };

export function Navbar({ base, seconds, title = "Royalclub" }: { base: string; seconds: string; title?: string }) {
  return (
    <div className="navbar" {...B} {...A}>
      <div className="navbar-left" {...B} onClick={() => (window.location.href = "/home")}>
        <div className="c-row c-row-middle-center" {...A} {...B}>
          <img src={`${base}/images/XZDS.png`} className="navbar-back" {...A} {...B} />
        </div>
      </div>
      <div className="navbar-title" {...B}>
        <div className="c-row c-row-middle-center" {...A} {...B}>
          {title}
        </div>
      </div>
      <div className="navbar-right" {...B}>
        <div className="c-row navbarR" {...A} {...B}>
          <div className="content" {...A}>
            <div className="page-box" {...A}>
              <div className="flex-row-between flex-center period-span" {...A}>
                <div className="flex-row-end" {...A}>
                  <div className="li-item" {...A}>
                    {seconds[0]}
                  </div>
                  <div className="li-item" {...A}>
                    {seconds[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenButton({ base, fullscreen, supported, onClick }: { base: string; fullscreen: boolean; supported: boolean; onClick: () => void }) {
  return (
    <button id="fullscreenBtn" disabled={!supported} onClick={onClick}>
      <img
        id="fullscreenIcon"
        src={`${base}/images/${fullscreen ? "minimize" : "maximize"}-square-minimalistic-svgrepo-com.svg`}
        alt={supported ? (fullscreen ? "Exit Fullscreen" : "Enter Fullscreen") : "Fullscreen not supported"}
      />
    </button>
  );
}

export function WalletBox({ text }: { text: string }) {
  return (
    <div className="wallet">
      <div className="c-row c-row-left" {...A}>
        <div className="num" {...A}>
          <span className="moneyU" id="wallet" {...A}>
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}

/** The 10/50/100/200/500 chips. `flash` is the chip that was just tapped (the original highlighted it for 200ms). */
export function AmountChips({ amounts, selected, flash, onPick, trailingSpace }: { amounts: number[]; selected: number | null; flash: number | null; onPick: (amount: number) => void; trailingSpace?: boolean }) {
  return (
    <div className={`bet-section${trailingSpace ? " " : ""}`}>
      <div>
        {amounts.map((amount) => (
          <button key={amount} className={`bet-btn-value bet-${amount} ${selected === amount || flash === amount ? "active" : ""}`} onClick={() => onPick(amount)} />
        ))}
      </div>
    </div>
  );
}

export function ConfettiBanner({ bannerRef, headingRef }: { bannerRef: React.Ref<HTMLDivElement>; headingRef: React.Ref<HTMLHeadingElement> }): ReactNode {
  return (
    <div className="contentt" ref={bannerRef}>
      <h1 ref={headingRef} />
    </div>
  );
}
