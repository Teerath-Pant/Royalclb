import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ViewMember = lazy(() => import("./pages/ViewMember"));
const ViewMemberDetails = lazy(() => import("./pages/ViewMemberDetails"));
const SearchMember = lazy(() => import("./pages/SearchMember"));
const WinGo = lazy(() => import("./pages/WinGo"));
const WinGoBets = lazy(() => import("./pages/WinGoBets"));
const GameHistoryK3 = lazy(() => import("./pages/GameHistoryK3"));
const BetHistoryK3 = lazy(() => import("./pages/BetHistoryK3"));
const GameHistoryDT = lazy(() => import("./pages/GameHistoryDT"));
const BetHistoryDT = lazy(() => import("./pages/BetHistoryDT"));
const Animal = lazy(() => import("./pages/Animal"));
const AnimalBets = lazy(() => import("./pages/AnimalBets"));
const GameHistoryAviator = lazy(() => import("./pages/GameHistoryAviator"));
const BetHistoryAviator = lazy(() => import("./pages/BetHistoryAviator"));
const Recharges = lazy(() => import("./pages/Recharges"));
const FundDepositHistory = lazy(() => import("./pages/FundDepositHistory"));
const GiftCodes = lazy(() => import("./pages/GiftCodes"));
const FundTransfer = lazy(() => import("./pages/FundTransfer"));
const FundTransferHistory = lazy(() => import("./pages/FundTransferHistory"));
const WalletDeduct = lazy(() => import("./pages/WalletDeduct"));
const Withdrawals = lazy(() => import("./pages/Withdrawals"));
const BannerUpdate = lazy(() => import("./pages/BannerUpdate"));
const NewsUpdate = lazy(() => import("./pages/NewsUpdate"));
const WalletStatement = lazy(() => import("./pages/WalletStatement"));
const Upi = lazy(() => import("./pages/Upi"));
const WalletAddress = lazy(() => import("./pages/WalletAddress"));
const PopupUpdate = lazy(() => import("./pages/PopupUpdate"));
const LinksSettings = lazy(() => import("./pages/LinksSettings"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const ViewActiveMember = lazy(() => import("./pages/ViewActiveMember"));
const ViewInActiveMember = lazy(() => import("./pages/ViewInActiveMember"));
const ActiveIncomeUserMember = lazy(() => import("./pages/ActiveIncomeUserMember"));
const WalletOutstanding = lazy(() => import("./pages/WalletOutstanding"));
const NewSupportTicket = lazy(() => import("./pages/NewSupportTicket"));
const SupportTicket = lazy(() => import("./pages/SupportTicket"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense>
              <Login />
            </Suspense>
          }
        />
        <Route
          element={
            <Suspense>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewMember" element={<ViewMember />} />
          <Route path="/viewMemberDetails" element={<ViewMemberDetails />} />
          <Route path="/searchMember" element={<SearchMember />} />
          <Route path="/winGo" element={<WinGo />} />
          <Route path="/winGoBets" element={<WinGoBets />} />
          <Route path="/gameHistoryK3" element={<GameHistoryK3 />} />
          <Route path="/betHistoryK3" element={<BetHistoryK3 />} />
          <Route path="/gameHistoryDT" element={<GameHistoryDT />} />
          <Route path="/betHistoryDT" element={<BetHistoryDT />} />
          <Route path="/animal" element={<Animal />} />
          <Route path="/animalBets" element={<AnimalBets />} />
          <Route path="/gameHistoryAviator" element={<GameHistoryAviator />} />
          <Route path="/betHistoryAviator" element={<BetHistoryAviator />} />
          <Route path="/recharges" element={<Recharges />} />
          <Route path="/funddepositHistory" element={<FundDepositHistory />} />
          <Route path="/gift-codes" element={<GiftCodes />} />
          <Route path="/fundTransfer" element={<FundTransfer />} />
          <Route path="/fundTransferHistory" element={<FundTransferHistory />} />
          <Route path="/walletDeduct" element={<WalletDeduct />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/bannerUpdate" element={<BannerUpdate />} />
          <Route path="/newsUpdate" element={<NewsUpdate />} />
          <Route path="/walletStatement" element={<WalletStatement />} />
          <Route path="/upi" element={<Upi />} />
          <Route path="/wallet-address" element={<WalletAddress />} />
          <Route path="/popupUpdate" element={<PopupUpdate />} />
          <Route path="/linksSettings" element={<LinksSettings />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/viewActiveMember" element={<ViewActiveMember />} />
          <Route path="/viewInActiveMember" element={<ViewInActiveMember />} />
          <Route path="/activeIncomeUserMember" element={<ActiveIncomeUserMember />} />
          <Route path="/walletOutstanding" element={<WalletOutstanding />} />
          <Route path="/newSupportTicket" element={<NewSupportTicket />} />
          <Route path="/supportTicket" element={<SupportTicket />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
