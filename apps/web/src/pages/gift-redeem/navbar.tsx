export function Navbar() {
  return (
    <div
      data-v-12a80a3e=""
      data-v-f1e983bd=""
      className="navbar activity"
      style={{ background: "#232328", height: "47.83px" }}
    >
      <div
        data-v-12a80a3e=""
        className="navbar-fixed"
        style={{ background: "#232328", height: "47.83px" }}
      >
        <div
          data-v-12a80a3e=""
          className="navbar__content"
          style={{ height: "47.83px", background: "#241e22" }}
        >
          <div
            data-v-12a80a3e=""
            className="navbar__content-left"
            onClick={() => window.history.back()}
            style={{ cursor: "pointer" }}
          >
            <i
              data-v-12a80a3e=""
              className="van-badge__wrapper van-icon van-icon-arrow-left"
              style={{ color: "#dca654", fontSize: "24px" }}
            />
          </div>
          <div data-v-12a80a3e="" className="navbar__content-center">
            <div
              data-v-12a80a3e=""
              className="navbar__content-title"
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "normal",
                lineHeight: "60px",
              }}
            >
              Gift
            </div>
          </div>
          <div data-v-12a80a3e="" className="navbar__content-right" />
        </div>
      </div>
    </div>
  );
}
