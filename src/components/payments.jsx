import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Username");
  // Filter payments based on search term

  async function getPaymentsList() {
    try {
      const response = await axios.post(
        "https://bricolat.free.nf/admin/getPaymentsList.php",
        {
          searchTerm,
          filter,
        },
        { withCredentials: true }
      );
      console.log("Payments data:", response.data);

      if (response.data.status === "unauthenticated") {
        window.location.href = "/adminLogin";
      } else setPayments(response.data.result);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  }

  useEffect(() => {
    getPaymentsList();
  }, [searchTerm, filter]);

  return (
    <div className="container mx-auto py-8 px-6">
      <h2 className="text-2xl font-bold mb-6">Payment Transactions</h2>
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
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="workingCityLocation">city</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Worker username
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                City
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Inscription Date
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.transactionID} className="border-t">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {payment.transactionID}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.workerUsername}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.city}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.amount} MAD
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(payment.inscriptionDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
