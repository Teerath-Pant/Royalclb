import type { CSSProperties } from "react";

import { ClaimHistory } from "./claim-history";
import { Navbar } from "./navbar";
import { RedeemForm } from "./redeem-form";

export function GiftRedeem() {
  return (
    <div
      data-v-f1e983bd=""
      className="dailySignIn__container"
      style={{ "--f13b4d11-currentFontFamily": "'Roboto', 'Inter', sans-serif" } as CSSProperties}
    >
      <Navbar />
      <div style={{ width: "100%", overflow: "hidden" }}>
        <img
          src="/User/assets/images/gift-D229Mngm.png"
          style={{ width: "100%", display: "block" }}
        />
      </div>
      <RedeemForm />
      <ClaimHistory />
    </div>
  );
}

