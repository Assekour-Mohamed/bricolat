import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

function Header({ admin, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const containerRef = useRef(null);

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
      setIsNotifOpen(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await axios.get(
        `https://bricolat.free.nf/admin/getNotifications.php?adminID=${admin.adminId}`,
        { withCredentials: true }
      );
      setNotifications(response.data);
      setIsNotifOpen((prev) => !prev); // toggle notification dropdown
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

  return (
    <div className="bg-gray-800 text-white p-2">
      <div className="flex justify-between items-center">
        <Link to="/overview">
          <h1 className="text-xl px-4 font-bold">Bricolat</h1>
        </Link>

        <div className="relative" ref={containerRef}>
          <div className="flex items-center">
            <button
              onClick={loadNotifications}
              className="p-2 pr-4 hover:bg-gray-700 rounded-md"
            >
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </button>

            {isNotifOpen && (
              <div className="absolute top-12 left-0 bg-white shadow-lg rounded-md w-auto z-50">
                <div className="p-4 border-b font-bold text-gray-800">
                  Notifications
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.notificationID}
                        className={`px-4 py-3 border-b  `}
                      >
                        <h4 className={`font-semibold text-gray-800 `}>
                          {notif.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {notif.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button
              className="hover:bg-gray-600 text-sm text-white px-4 py-1 rounded-md flex items-center justify-center"
              onClick={toggleProfileDropdown}
            >
              <span className="pr-3 pl-4">{admin.username}</span>
              <img
                src={admin.imageUrl}
                className="rounded-full w-10 h-10 object-cover"
                alt="admin"
              />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 rounded-b-md border-t-2 w-full bg-gray-700 text-white shadow-xl z-10">
              <ul className="py-2 text-xs">
                <Link to="/adminInfo">
                  <li className="px-4 py-2 hover:bg-gray-800">Admin Info</li>
                </Link>

                <li className="px-4 py-2 hover:bg-gray-800">
                  <button onClick={onLogout}>Log out</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
