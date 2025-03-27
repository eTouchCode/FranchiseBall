import React, { ReactNode, useState } from "react";
import Header from "../components/Header/index";
import { useLocation } from "react-router-dom";
// import Sidebar from '../components/Sidebar';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = useLocation().pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          {/* <main className={`grow ${(pathname.includes("view_draft") || pathname.includes("draft_player")) && "bg-[url('/background.png')]"}`}> */}
          <main className={`grow ${pathname.includes("draft_player") && "bg-[url('/background.png')]"}`}>
            <div className={`${!pathname.includes("view_draft") && "p-4 md:p-6"}`}>{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
