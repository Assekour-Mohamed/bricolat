import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUsers,
  faHelmetSafety,
  faUserTie,
  faClipboardList,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

function LastUsersList() {
  const [UsersTableInfo, setUsersTableInfo] = useState([
    {
      clientID: -1,
      fullName: "client",
      email: "client@example.com",
      inscriptionDate: "12/12/2000",
      type: "c",
      image:
        "https://as2.ftcdn.net/v2/jpg/04/75/00/99/1000_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg",
    },
  ]);

  useEffect(() => {
    axios
      .get("https://bricolat.free.nf/admin/getLastMonthUsers.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "unauthenticated") {
          // redirect to login or show a message
          window.location.href = "/adminLogin";
        } else {
          console.log(response.data);
          setUsersTableInfo(response.data.result.workers);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  return (
    <div>
      {UsersTableInfo.length > 0 ? (
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 ">
              {[
                "Id",
                "Image",
                "Full Name",
                "Email",
                "Inscription Date",
                "type",
              ].map((header) => (
                <th
                  key={header}
                  className=" text-sm border border-gray-300 px-4 py-2"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {UsersTableInfo.map((element, index) => (
              <tr key={index} className="text-xs">
                <td className="border border-gray-300 px-4 py-2">
                  {element.clientID}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={element.image}
                    className="rounded-full w-10 h-10 object-cover"
                    alt="admin Photo"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {element.fullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {element.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {element.inscriptionDate}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {element.type === "w" ? (
                    <div className="bg-[#28a745]  text-white px-4 py-1 rounded-xl font-semibold">
                      <p>Worker</p>
                    </div>
                  ) : (
                    <p className="bg-[#0d6efd] text-white px-4 py-1 rounded-xl font-semibold">
                      Client
                    </p>
                  )}
                </td>
              </tr>
            ))}
            <tr className="font-semibold text-base">
              <td colSpan="6">
                Count:{" "}
                <span className="font-bold text-lg">
                  {UsersTableInfo.length}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <h2>No user inscripted last month</h2>
      )}
    </div>
  );
}

function LastPostsList() {
  const [PostsTableInfo, setClientsTableInfo] = useState([
    {
      jobPostID: -1,
      clientName: -1,
      title: "Post 1",
      city: "marrakech",
      publishDate: "12/12/2001",
    },
  ]);

  useEffect(() => {
    axios
      .get("https://bricolat.free.nf/admin/getLastPosts.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "unauthenticated") {
          window.location.href = "/adminLogin";
        } else setClientsTableInfo(response.data.result);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  return (
    <div className="overflow-x-auto max-h-80 mb-4">
      <table className="w-full text-center border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {[
              "ID",
              "Title",
              "Description",
              "City",
              "Publish Date",
              "Category",
            ].map((header) => (
              <th
                key={header}
                className="text-sm border border-gray-300 px-4 py-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {PostsTableInfo.map((element, index) => (
            <tr key={index} className="text-xs">
              <td className="border border-gray-300 px-4 py-2">
                {element.jobPostID}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {element.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {element.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {element.city}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {element.publishDate}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {element.categoryTitle ? element.categoryTitle : "No Category"}
              </td>
            </tr>
          ))}

          <tr className="font-semibold text-base">
            <td colSpan="6">
              Count:{" "}
              <span className="font-bold text-lg">{PostsTableInfo.length}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Overview() {
  const [OverviewInfo, setOverviewInfo] = useState({
    totalWorkers: 0,
    totalClients: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalJobCategories: 0,
    totalJobsPosts: 0,
  });

  useEffect(() => {
    axios
      .get("https://bricolat.free.nf/admin/getOverviewInfo.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "unauthenticated") {
          window.location.href = "/adminLogin";
        } else {
          setOverviewInfo(response.data.result);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  return (
    <div id="dvOverview" className="  flex flex-col   ">
      <h1 className="text-2xl font-semibold pt-4 text-gray-800">
        Overview statistics
      </h1>
      <div className="mt-4  ">
        <div className="grid sm:grid-cols-12 mb-8 gap-4 ">
          <div className="sm:col-span-8  bg-[#28a745] shadow-lg rounded-2xl p-6  text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faDollarSign} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">
                  Total Revenue
                </h2>
                <p className="text-4xl text-white font-bold   ">
                  {OverviewInfo.totalRevenue}{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="  sm:col-span-4  bg-[#0d6efd] shadow-lg rounded-2xl p-6   text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faHelmetSafety} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">Workers</h2>
                <p className=" text-white text-3xl font-bold   ">
                  {OverviewInfo.totalWorkers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-12 my-4 gap-4 ">
          <div className="sm:col-span-6   bg-[#364958] shadow-lg rounded-2xl p-6  text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faUsers} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">Users</h2>
                <p className="text-4xl text-white font-bold   ">
                  {OverviewInfo.totalUsers}{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="  sm:col-span-4  bg-[#55828B] shadow-lg rounded-2xl p-6   text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faUserTie} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">Clients</h2>
                <p className=" text-white text-3xl font-bold   ">
                  {OverviewInfo.totalClients}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-12  pt-4 gap-4 ">
          <div className="sm:col-span-7  bg-[#0dcaf0] shadow-lg rounded-2xl p-6  text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faClipboardList} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">Job Posts</h2>
                <p className="text-4xl text-white font-bold   ">
                  {OverviewInfo.totalJobPosts}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="  sm:col-span-4  bg-[#ffc107] shadow-lg rounded-2xl p-6   text-center">
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faFolder} size="3x" color="white" />
              <div>
                <h2 className=" text-white text-lg font-meduim">
                  Job Categories
                </h2>
                <p className=" text-white text-3xl font-bold   ">
                  {OverviewInfo.totalJobCategories}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-lg mt-6 mb-4">
          Last users registered last month
        </h2>
        <LastUsersList></LastUsersList>

        <h2 className="font-bold text-lg mt-6 mb-4">
          Last posts published last month
        </h2>
        <LastPostsList></LastPostsList>
      </div>
    </div>
  );
}
export default Overview;
