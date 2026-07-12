import { Routes, Route } from "react-router-dom"
import Home from "../src/pages/home"
import AdminLogin from "../src/pages/admin/AdminLogin"
import AdminDashboard from "../src/pages/admin/AdminDashboard"
import RequireAdmin from "../src/components/RequireAdmin"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
    </Routes>
  )
}

export default App
