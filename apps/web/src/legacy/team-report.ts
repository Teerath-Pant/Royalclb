/** Port of User/TeamReport.js: it fills the compiled TeamReport markup through the DOM, as the original did. */
import { api } from "@/lib/api";

type TeamData = { uid: number; level: number; totalBet: string; totalDeposit: string; totalCommission: string; date: string };
type Report = {
  teamData: TeamData[];
  maxLevel: number;
  depositCount: number;
  depositAmount: string;
  bettorCount: number;
  betAmount: string;
  frCount: number;
  frAmount: string;
};

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel);

function row(d: TeamData) {
  return `
    <div data-v-10d1559c="" class="TeamReport__C-body-item">
      <div data-v-10d1559c="" class="TeamReport__C-body-item-head">
        <div data-v-10d1559c="" class="title">UID:${d.uid}</div>
        <svg data-v-10d1559c="" class="svg-icon icon-copy"><use xlink:href="#icon-copy"></use></svg>
      </div>
      <div data-v-10d1559c="" class="TeamReport__C-body-item-detail">
        <div data-v-10d1559c="" class="TeamReport__C-body-item-detail-lv">Level <span data-v-10d1559c="">${d.level}</span></div>
        <div data-v-10d1559c="" class="TeamReport__C-body-item-detail-commission">Deposit amount <span data-v-10d1559c="">${d.totalDeposit}</span></div>
        <div data-v-10d1559c="" class="TeamReport__C-body-item-detail-commission">Bet amount <span data-v-10d1559c="">${d.totalBet}</span></div>
        <div data-v-10d1559c="" class="TeamReport__C-body-item-detail-commission">Commission <span data-v-10d1559c="">${d.totalCommission}</span></div>
        <div data-v-10d1559c="" class="TeamReport__C-body-item-detail-time">Time <span data-v-10d1559c="">${d.date}</span></div>
      </div>
    </div>`;
}

/** Wires the page and returns a cleanup. Call once the TeamReport markup is mounted. */
export function initTeamReport() {
  const list = $("#team-data");
  const menu = $("#categoryMenu");
  const picker = $<HTMLInputElement>("#datePicker");
  const uidInput = $<HTMLInputElement>("#uidInput");
  const search = $("#uidSearch");
  const dropdown = $("#categoryDropdown");
  const loader = $("#loadingloader");
  if (!list || !menu || !picker || !uidInput || !search || !dropdown) {
    return () => {};
  }

  let uid = "";
  let level = "";
  // The report covers whole days up to yesterday, in IST.
  const yesterday = new Date(Date.now() + 5.5 * 3_600_000 - 86_400_000).toISOString().slice(0, 10);
  picker.value = yesterday;
  picker.max = yesterday;
  let date = yesterday;
  let alive = true;

  const setText = (id: string, value: string | number) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = String(value);
    }
  };

  async function load() {
    if (loader) {
      loader.style.display = "block";
    }
    try {
      const params = new URLSearchParams();
      if (uid) {
        params.set("uid", uid);
      }
      if (level) {
        params.set("level", level);
      }
      if (date) {
        params.set("date", date);
      }
      const data = await api<Report>(`/user/subordinate-data?${params}`);
      if (!alive) {
        return;
      }
      list!.innerHTML =
        data.teamData.map(row).join("") +
        '<div data-v-cbab7763="" class="infiniteScroll__loading"><div data-v-cbab7763="">No more</div></div>';
      menu!.innerHTML = '<div>All</div>' + Array.from({ length: data.maxLevel }, (_, i) => `<div data-level="${i + 1}">Tier ${i + 1}</div>`).join("");
      setText("dc", data.depositCount);
      setText("da", data.depositAmount);
      setText("bc", data.bettorCount);
      setText("ba", data.betAmount);
      setText("fc", data.frCount);
      setText("fa", data.frAmount);
    } finally {
      if (loader) {
        loader.style.display = "none";
      }
    }
  }

  const toggleMenu = () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };
  const onMenu = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.tagName === "DIV" && target !== menu) {
      level = target.getAttribute("data-level") ?? "";
      setText("categoryText", target.textContent ?? "");
      toggleMenu();
      void load();
    }
  };
  const onUid = (e: Event) => {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replaceAll(/\D/g, "");
    uid = input.value;
  };
  const onDate = () => {
    date = picker.value;
    void load();
  };
  const onSearch = () => void load();

  dropdown.addEventListener("click", toggleMenu);
  menu.addEventListener("click", onMenu);
  uidInput.addEventListener("input", onUid);
  picker.addEventListener("change", onDate);
  search.addEventListener("click", onSearch);
  void load();

  return () => {
    alive = false;
    dropdown.removeEventListener("click", toggleMenu);
    menu.removeEventListener("click", onMenu);
    uidInput.removeEventListener("input", onUid);
    picker.removeEventListener("change", onDate);
    search.removeEventListener("click", onSearch);
  };
}
