// "use client";

// import TopBar from "./TopBar";
// import PortfolioValueCard from "./PortfolioValueCard";
// import QuickTransferCard from "./QuickTransferCard";
// import CardsCard from "./CardsCard";
// import SpendingAnalysisCard from "./SpendingAnalysisCard";
// import UpcomingBillsCard from "./UpcomingBillsCard";
// import TransactionsTable from "./TransactionsTable";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-8 sm:py-8">
//       <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
//         <TopBar />

//         {/* Row 1: portfolio value (wide) + quick transfer */}
//         <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             <PortfolioValueCard />
//           </div>
//           <QuickTransferCard />
//         </div>

//         {/* Row 2: cards, spending analysis, upcoming bills */}
//         <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
//           <CardsCard />
//           <SpendingAnalysisCard />
//           <UpcomingBillsCard />
//         </div>

//         {/* Row 3: transactions */}
//         <TransactionsTable />
//       </div>
//     </div>
//   );
// }
