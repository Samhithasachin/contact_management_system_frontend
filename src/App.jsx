import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CreditsProvider } from "./context/CreditsContext";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthCallback } from "./pages/AuthCallback";
import { Contacts } from "./pages/Contacts";
import { AddContact } from "./pages/AddContact";
import { FindContacts } from "./pages/FindContacts";
import { Profile } from "./pages/Profile";
import { PersonalInformation } from "./pages/PersonalInformation";
import { ChangePassword } from "./pages/ChangePassword";
import { Integration } from "./pages/Integration";
import { TransactionHistory } from "./pages/TransactionHistory";
import { PrivacyAndSharing } from "./pages/PrivacyAndSharing";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

function AuthLanding({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to="/contacts" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CreditsProvider>
          <Toaster position="top-right" richColors closeButton />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/login"
              element={
                <AuthLanding>
                  <Login />
                </AuthLanding>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLanding>
                  <Register />
                </AuthLanding>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/new" element={<AddContact />} />
              <Route path="/find-contacts" element={<FindContacts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/personal-information" element={<PersonalInformation />} />
              <Route path="/profile/change-password" element={<ChangePassword />} />
              <Route path="/profile/integration" element={<Integration />} />
              <Route path="/profile/transactions" element={<TransactionHistory />} />
              <Route path="/profile/privacy" element={<PrivacyAndSharing />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CreditsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
