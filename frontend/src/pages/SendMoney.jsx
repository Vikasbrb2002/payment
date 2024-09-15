import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import Button2 from "../components/Button2";
import Header from "../components/Header";
import InputBox from "../components/InputBox";

function SendMoney({ User, UserImage }) {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const handleTransfer = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3001/api/v1/account/transfer", {
        to: id,
        amount: amount
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Transfer failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-400 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="rounded-lg flex flex-col p-6 space-y-4 bg-white shadow-xl w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
        <Header label="Send Money" />
        <div className="flex flex-col gap-4">
          <div className='flex items-center gap-2'>
            <button className='bg-green-500 rounded-full py-2 px-4 text-2xl text-white font-bold'>{name[0].toUpperCase()}</button>
            <div className='text-black font-bold text-xl sm:text-2xl md:text-3xl'>{name}</div>
          </div>
          <InputBox onChange={(e) => setAmount(e.target.value)} label="Amount (in Rs)" placeholder="Enter amount" type={'number'} />
          <Button2 onClick={handleTransfer} label={loading ? "Processing..." : success ? "Success!" : "Initiate Transfer"} disabled={loading || success} />
        </div>
      </div>
    </div>
  );
}

export default SendMoney;
