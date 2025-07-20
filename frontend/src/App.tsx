import Header from "./components/Header"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import NotFound from "./pages/NotFound"
import OTP from "./pages/OTP"
import Verified from "./pages/Verified"
import VerifyEmail from "./pages/VerifyEmail"
import ProtectedRoute from "./components/ProtectedRoute"
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/otp";
  return (
    <main>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="verified" element={<Verified />}></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  )
}

export default App
