import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
   faTachometerAlt,
  faClipboardList,
 faCreditCard,
   faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function SidePanel() {
  const [isVisible, setVisibility] = useState(false);

  // Updated styles for better design
  const linkStyle =
    "flex items-center px-2 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200";

  return (
    <div
      id="dvSidePanel"
      className=" border-r-2 border-[#2E5077]  text-left  px-4 py-3  border-l-2 border-gray-100 bg-white shadow-sm h-full"
    >
      <div className="">
        <div className="grid grid-cols-12 items-center">
          <button
            className="col-span-1 w-max p-1 text-gray-600 hover:text-blue-600 sm:hidden hover:bg-[#F6F4F0] rounded-lg transition-colors duration-200"
            onClick={() => {
              setVisibility(!isVisible);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <p className="font-bold col-span-11   text-gray-800 text-sm">
            ADMIN MENU
          </p>
        </div>

        <nav
          className={isVisible ? "block mt-4" : "hidden mt-4  sm:block mt-4"}
        >
          <ul className="space-y-1">
            <Link to="/overview">
              <li className={linkStyle}>
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  className="w-4 h-4 mr-2 text-gray-500"
                />
                OverView
              </li>
            </Link>

            <Link to="/workersList">
              <li className={linkStyle}>
                <FontAwesomeIcon
                  icon={faUserCog}
                  className="w-4 h-4 mr-2 text-gray-500  "
                />
                Users
              </li>
            </Link>
            <Link to="/jobPostsList">
              <li className={linkStyle}>
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="w-4 h-4 mr-2 text-gray-500"
                />
                Job Posts
              </li>
            </Link>
            <Link to="/payments">
              <li className={linkStyle}>
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="w-4 h-4 mr-2 text-gray-500"
                />
                payments
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default SidePanel;
