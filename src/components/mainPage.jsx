//import { useState } from 'react'
import Header from "./header.jsx";
import SidePannel from "./sidePannel.jsx";
import {
   Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Overview from "./overview.jsx";
import WorkersList from "./users.jsx";
import JobPostsList from "./jobPostsList.jsx";
import WorkerProfile from "./workerProfile.jsx";
import NotFound from "./notFound.jsx";
import AdminInfo from "./adminInfo.jsx";
import Payment from "./payments.jsx";

function Main({ currentAdmin, onLogout }) {
  return (
    <div className="">
      <Header admin={currentAdmin} onLogout={onLogout} />

      <div>
        <div className=" grid grid-cols-1 sm:grid-cols-12 ">
          <div className=" sm:col-span-2  ">
            {" "}
            <SidePannel />
          </div>
          <div className="sm:col-span-10 mx-8">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" />} />
              <Route
                path="/adminInfo"
                element={<AdminInfo admin={currentAdmin} />}
              />
              <Route path="/overview" element={<Overview />} />
              <Route path="/workersList" element={<WorkersList />} />
              <Route
                path="/workerProfile/:workerID"
                element={<WorkerProfile />}
              />
              <Route path="/jobPostsList" element={<JobPostsList />} />
              <Route path="/payments" element={<Payment />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
