import { useInfiniteQuery } from "@tanstack/react-query";

import { claimHistoryQueryOptions } from "@/queries/gift-code";
import { formatISTDate } from "@/utils/format-ist-date";

export function ClaimHistory() {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(claimHistoryQueryOptions);

  // Flatten all pages into a single list
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div style={{ padding: "0 15px 15px" }}>
      <div className="gift-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          <i
            className="van-icon van-icon-notes-o"
            style={{ color: "#dca654", fontSize: "16px" }}
          />
          History
        </div>

        {isPending ? (
          <div
            style={{ textAlign: "center", color: "#777", padding: "40px 0" }}
          >
            <i
              className="van-icon van-icon-replay"
              style={{ fontSize: "30px", opacity: 0.4 }}
            />
          </div>
        ) : items.length === 0 ? (
          <div
            style={{ textAlign: "center", color: "#777", padding: "40px 0" }}
          >
            <i
              className="van-icon van-icon-description"
              style={{ fontSize: "50px", opacity: 0.3 }}
            />
            <p style={{ marginTop: "10px" }}>No data</p>
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #3a2e35",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: "#fde4bc",
                      letterSpacing: "1px",
                    }}
                  >
                    {item.giftCode.code}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#777",
                      marginTop: "3px",
                    }}
                  >
                    {formatISTDate(item.claimedAt)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#FED358",
                    }}
                  >
                    +₹{Number(item.giftCode.amount).toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#4caf50",
                      marginTop: "2px",
                    }}
                  >
                    Claimed
                  </div>
                </div>
              </div>
            ))}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid #3a2e35",
                  borderRadius: "20px",
                  color: "#dca654",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
