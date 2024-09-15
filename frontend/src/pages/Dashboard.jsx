import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import UserSection from "../components/UserSection";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get("http://localhost:3001/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const balanceResponse = await axios.get("http://localhost:3001/api/v1/account/balance", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(userResponse.data);
        setBalance(balanceResponse.data.balance);
      } catch (error) {
        console.error("Error fetching user data or balance:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="text-black">
      <Appbar user={user.firstname} userImage={'A'} />
      <Balance Balance={`${balance}`} />
      <UserSection />
    </div>
  );
}

export default Dashboard;
