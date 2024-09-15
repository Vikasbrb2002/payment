import {BrowserRouter, Route, Routes} from "react-router-dom" 
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"
import Profile from "./pages/Profile"
function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/" element={<Signup/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/send" element={<SendMoney User={"Vikar Kumar"} UserImage={'V'}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
