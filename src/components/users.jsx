import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHelmetSafety,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UsersChart = (props) => (
  <div className="p-4 bg-white shadow-lg rounded-xl ">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={props.UsersLastYear}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 12 }} />
        <YAxis tick={{ fill: "#555", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Clients number"
          stroke="#4F46E5"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Workers number"
          stroke="#16A34A"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const WorkersList = ({ onClose }) => {
  const [workersTableInfo, setWorkersTableInfo] = useState([
    {
      workerID: -1,
      Username: "",
      Email: "",
      Phone: "",
      workingCityLocation: "",
      Rating: 0,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Username");
  async function getWorkersList() {
    try {
      const response = await axios.post(
        "http://bricolat.free.nf/admin/getWorkersList.php",
        {
          searchTerm,
          filter,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      if (response.data.status === "unauthenticated") {
        window.location.href = "/adminLogin";
      } else setWorkersTableInfo(response.data.result);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  }

  useEffect(() => {
    getWorkersList();
  }, [searchTerm, filter]);

  function handelDeleteBtn(workerID) {
    const response = confirm(
      "Are you sure you want to delete the worker with Id : " + workerID
    );
    if (response) {
      axios
        .get(
          `http://bricolat.free.nf/admin/deletWorker.php?workerID=${workerID}`,
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.success)
            alert("Worker with Id : " + workerID + " Deleted succesfully");
          else alert("Worker with Id : " + workerID + "Was not Deleted!!");
        })
        .catch((error) => {
          alert("Worker with Id : " + workerID + "Was not Deleted!!");
          console.error("There was an error fetching the data!", error);
        });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className=" overflow-x-auto relative bg-white p-4 shadow-lg rounded-md z-[1001] ">
        <h2 className="font-semibold mt-4 mb-2"> Workers List: </h2>
        <div className="flex items-center border rounded-lg mb-4 p-2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-500 mx-2"
          />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for users.."
            className="p-2 w-full border-none focus:outline-none text-sm"
          />
          <select
            className="ml-2 p-2 border rounded-lg text-sm"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="WorkerID">Worker ID</option>

            <option value="Username">Username</option>
            <option value="Email">Email</option>
          </select>
        </div>
        <div className="overflow-x-auto max-h-60">
          <table className="w-full text-center  border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Id",
                  "Username",
                  "Email",
                  "Phone",
                  "City",
                  "Rating",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="  text-sm border border-gray-300 px-4 py-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {workersTableInfo.map((element, index) => (
                <tr key={index} className="text-xs">
                  <td className="border border-gray-300 px-4 py-2  ">
                    {element.workerID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2  ">
                    {element.Username}
                  </td>
                  <td className="border   border-gray-300 px-4 py-2  ">
                    {element.Email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2  ">
                    {element.Phone}
                  </td>
                  <td className="border border-gray-300 px-4 py-2   ">
                    {element.workingCityLocation}
                  </td>
                  <td className="border border-gray-300 px-4 py-2   ">
                    {element.Rating}
                  </td>
                  <td className="border  border-gray-300 px-4 py-2">
                    <div className="flex   gap-2">
                      <button
                        onClick={() => handelDeleteBtn(element.workerID)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <Link to={`/workerProfile/${element.workerID}`}>
                        <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                          Details
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="px-2 py-1 mt-4 text-red-600 bg-red-100 rounded hover:bg-red-200"
        >
          {" "}
          close ✕
        </button>
      </div>
    </div>
  );
};
function ClientsList({ onClose }) {
  const [clientsTableInfo, setClientsTableInfo] = useState([
    {
      clientID: 0,
      FullName: " ",
      Email: " ",
      InscriptionDate: "",
      PostsCreated: 0,
      imageUrl: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Username");
  async function getClientsList() {
    try {
      const response = await axios.post(
        "http://bricolat.free.nf/admin/getClientsList.php",
        {
          searchTerm,
          filter,
        },
        { withCredentials: true } // Correctly passing the withCredentials option
      );

      setClientsTableInfo(response.data.result);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  }

  useEffect(() => {
    getClientsList();
  }, [searchTerm, filter]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className=" overflow-x-auto relative bg-white p-4 shadow-lg rounded-md z-[1001] ">
        <h2 className="font-semibold mt-4 mb-2"> Clients List: </h2>
        <div className="flex items-center border rounded-lg mb-4 p-2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-500 mx-2"
          />
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for users.."
            className="p-2 w-full border-none focus:outline-none text-sm"
          />
          <select
            className="ml-2 p-2 border rounded-lg text-sm"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ClientID">Client ID</option>

            <option value="Username">Username</option>
            <option value="Email">Email</option>
          </select>
        </div>
        <div className="overflow-x-auto max-h-60">
          <table className="w-full text-center border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Id",
                  "Image",
                  "Full Name",
                  "Email",
                  "Inscription Date",
                  "Posts Created",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="  text-sm border border-gray-300 px-4 py-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {clientsTableInfo.map((element, index) => (
                <tr key={index} className="text-xs">
                  <td className="border border-gray-300 px-4 py-2">
                    {element.clientID}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={element.imageUrl}
                      className="rounded-full w-10 h-10 object-cover"
                      alt="admin Photo"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {element.FullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {element.Email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {element.InscriptionDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {element.PostsCreated}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      <Link to={`/clientProfile/${element.clientID}`}>
                        <button className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                          Details
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="px-2 py-1 mt-4 text-red-600 bg-red-100 rounded hover:bg-red-200"
        >
          {" "}
          close ✕
        </button>
      </div>
    </div>
  );
}

function Users() {
  const [showWorkersList, setShowWorkersList] = useState(false);
  const [showClientsList, setShowClientsList] = useState(false);
  const [usersNumber, setUsersNumber] = useState({ Workers: 0, Clients: 0 });
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    axios
      .get("http://bricolat.free.nf/admin/getWorkerAndClientsNumber.php", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "unauthenticated") {
          window.location.href = "/adminLogin";
        } else {
          setUsersNumber(response.data.result.totalUsers);

          setChartData(response.data.result.workersAndClientsNumbers);
          setChartData([
            {
              date: "01-2025",
              "Workers number": 3,
              "Clients number": 2,
            },
            {
              date: "02-2025",
              "Workers number": 5,
              "Clients number": 4,
            },
            {
              date: "03-2025",
              "Workers number": 8,
              "Clients number": 7,
            },
            {
              date: "04-2025",
              "Workers number": 12,
              "Clients number": 10,
            },
            {
              date: "05-2025",
              "Workers number": 16,
              "Clients number": 15,
            },
            {
              date: "06-2025",
              "Workers number": 20,
              "Clients number": 18,
            },
            {
              date: "07-2025",
              "Workers number": 25,
              "Clients number": 22,
            },
            {
              date: "08-2025",
              "Workers number": 30,
              "Clients number": 28,
            },
            {
              date: "09-2025",
              "Workers number": 35,
              "Clients number": 32,
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="mx-6 flex flex-col ">
      <h1 className="font-bold my-3 text-2xl text-center">Users Details</h1>

      <div className="m-2">
        <h2 className="font-semibold mb-1"> Clients and workers numbers </h2>

        <UsersChart UsersLastYear={chartData} />
      </div>
      <div className="flex justify-center items-center  mt-8">
        <div className="grid sm:grid-cols-12 gap-4 w-full bg-n max-w-2xl">
          <div className="sm:col-span-6  bg-[#28a745] shadow-lg rounded-2xl p-6   text-center">
            {showWorkersList && (
              <WorkersList onClose={() => setShowWorkersList(false)} />
            )}
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faHelmetSafety} size="3x" color="white" />
              <div>
                <h2 className="text-white text-xl font-bold">
                  Workers {usersNumber.Workers}
                </h2>
                <a
                  onClick={() => setShowWorkersList(true)}
                  className="text-blue text-md font-bold cursor-pointer underline hover:underline"
                >
                  Get all workers
                </a>
              </div>
            </div>
          </div>
          <div className="sm:col-span-6  bg-[#0d6efd] shadow-lg rounded-2xl p-6   text-center">
            {showClientsList && (
              <ClientsList onClose={() => setShowClientsList(false)} />
            )}
            <div className="flex items-center justify-center space-x-2">
              <FontAwesomeIcon icon={faUserTie} size="3x" color="white" />
              <div>
                <h2 className="text-white text-xl font-bold">
                  Clients {usersNumber.Clients}
                </h2>
                <a
                  onClick={() => setShowClientsList(true)}
                  className="text-blue text-md font-bold cursor-pointer underline hover:underline"
                >
                  Get all Clients
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Users;
