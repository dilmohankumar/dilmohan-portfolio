import { Routes, Route } from "react-router-dom"
import Landing from "../src/pages/Landing"
import Signup from "../src/pages/Signup"
import Home from "../src/pages/home"
import AdminLogin from "../src/pages/admin/AdminLogin"
import AdminDashboard from "../src/pages/admin/AdminDashboard"
import RequireAdmin from "../src/components/RequireAdmin"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route path="/u/:username" element={<Home />} />
    </Routes>
  )
}

export default App
