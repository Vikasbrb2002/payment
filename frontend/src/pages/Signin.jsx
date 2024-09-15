import React, { useState } from 'react';
import Button from "../components/Button";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import WarningBottom from "../components/WarningBottom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

export function Signin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/v1/user/signin", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during signin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-400">
      <div className="rounded-lg flex flex-col p-6 h-auto w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] space-y-4 bg-white shadow-xl">
        <Header label="Sign in" />
        <SubHeading label="Enter your credentials to access your account" />
        <InputBox
          onChange={(e) => setUsername(e.target.value)}
          label="Email"
          placeholder="abc001@gmail.com"
        />
        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="01234567"
        />
        <Button
          onClick={handleSignin}
          label={loading ? <ClipLoader size={20} color={"#fff"} /> : "Sign in"}
          disabled={loading}
        />
        <WarningBottom label="Don't have an account?" buttonText="Sign up" to="/" />
      </div>
    </div>
  );
}
