// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainSection";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import PersonalDetail from "./pages/PersonalDetails";
import SchoolChoice from "./pages/SchoolChoice";
import PreviewPage from "./pages/PreviewPage";
import DownloadPage from "./pages/DownloagPage";
import DownloadTable from "./pages/DownloadTable";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Layout Wrap */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route
            path="candidate"   // ✅ FIXED
            element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"   // ✅ FIXED
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="team"   // ✅ FIXED
            element={
              <ProtectedRoute role="team">
                <TeamDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/personal-details" element={<PersonalDetail />} />
          <Route path="/school-choice" element={<SchoolChoice />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/downloadFile" element={<DownloadTable />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;