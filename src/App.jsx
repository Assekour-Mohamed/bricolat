import { useState } from "react";
import axios from "axios";

import AdminLogin from "./components/adminLogin.jsx";
import Main from "./components/mainPage.jsx";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const handleLogout = () => {
    axios
      .get("http://bricolat.free.nf/admin/logout.php", {
        withCredentials: true,
      })
      .then(() => {
        setIsAuth(false);
        setCurrentAdmin(null);
      });
  };
  return (
    <div className="">
      <Router>
        {isAuth ? (
          <Main currentAdmin={currentAdmin} onLogout={handleLogout} />
        ) : (
          <AdminLogin
            onSubmit={(admin) => {
              setIsAuth(true);
              setCurrentAdmin(admin);
            }}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
