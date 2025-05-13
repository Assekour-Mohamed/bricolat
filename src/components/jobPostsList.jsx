import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function AdminJobPosts() {
  const [jobPosts, setJobPosts] = useState([]);
  const [filter, setfilter] = useState("Client");
  const [searchTerm, setSearchTerm] = useState("");

  function ContactViaWhatssap(phone) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent("hello")}`;
    window.open(url, "_blank");
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://bricolat.free.nf/admin/getJobPostsList.php",
          {
            searchTerm,
            filter,
          },
          {
            withCredentials: true,
          }
        );
        console.log(res.data);
        setJobPosts(res.data);
      } catch (err) {
        console.error("Error fetching job posts:", err);
      }
    };

    fetchData();
  }, [searchTerm, filter]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to permanently delete this post?")
    ) {
      try {
        await axios.delete(
          `http://bricolat.free.nf/admin/deleteJobPost.php?id=${id}`,
          {
            withCredentials: true,
          }
        ); // Change this URL to your actual delete endpoint
        setJobPosts((prev) => prev.filter((post) => post.jobPostID !== id));
      } catch (err) {
        console.error("Error deleting job post:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Job Posts</h1>

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
          onChange={(e) => setfilter(e.target.value)}
        >
          <option value="title">title</option>
          <option value="Client">Client username</option>
          <option value="Category">Category</option>
        </select>
      </div>
      <div className="space-y-6">
        {jobPosts.length === 0 ? (
          <h2 className="text-xl font-semibold  text-gray-600">
            no job posts{" "}
          </h2>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {jobPosts.map((post) => (
              <div
                key={post.jobPostID}
                className={`border sm:col-span-1 rounded-xl p-5 shadow-md transition duration-300  `}
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {post.title}
                  </h2>
                  <button
                    onClick={() => handleDelete(post.jobPostID)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-gray-700 mb-2">{post.description}</p>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="mr-4">📍 {post.city}</span>
                  <span>
                    📅 {new Date(post.publishDate).toLocaleDateString()}
                  </span>
                </div>

                {/* <div className="mb-2">
                    <strong className="text-gray-800 mr-2">Categories:</strong>
                    {post.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div> */}

                <div className="border-t mt-4 pt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-1">
                    Client Info
                  </h3>
                  <p className="text-sm text-gray-700">
                    👤
                    {post.client.user.userName}
                  </p>
                  <p className="text-sm text-gray-700">
                    📞 {post.client.user.phone} | 📧 {post.client.user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    🗓️ Joined on{" "}
                    {new Date(
                      post.client.user.inscriptionDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1 text-gray-500">
                    Client Status:{" "}
                    <span
                      className={`font-semibold ${
                        post.client.isDeleted
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {post.client.isDeleted ? "Disabled" : "Active"}
                    </span>
                  </p>
                  <button
                    onClick={() => ContactViaWhatssap(post.client.user.phone)}
                    className="  px-10 py-1 bg-[#198754] text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
