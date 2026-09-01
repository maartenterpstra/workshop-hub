import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Program from "./pages/Program";
import Submission from "./pages/Submission";
import Registration from "./pages/Registration";
import Organizers from "./pages/Organizers";
import Venue from "./pages/Venue";
import Reviewers from "./pages/Reviewers";
import NotFound from "./pages/NotFound";
import SpeakerUpload from "./pages/Upload";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Submit from "./pages/Submit";
import Review from "./pages/Review";
import Soc from "./pages/Soc";
import AdminAssignments from "./pages/AdminAssignments";
import SetPassword from "./pages/SetPassword";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteSeo from "./components/RouteSeo";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RouteSeo />
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/program" element={<Program />} />
                <Route path="/submission" element={<Submission />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/organizers" element={<Organizers />} />
                <Route path="/venue" element={<Venue />} />
                <Route path="/reviewers" element={<Reviewers />} />
                <Route path="/upload" element={<SpeakerUpload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/submit"
                  element={
                    <ProtectedRoute>
                      <Submit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review"
                  element={
                    <ProtectedRoute roles={["reviewer", "soc", "admin"]}>
                      <Review />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/soc"
                  element={
                    <ProtectedRoute roles={["soc", "admin"]}>
                      <Soc />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/assignments"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminAssignments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/set-password"
                  element={
                    <ProtectedRoute allowPasswordChange>
                      <SetPassword />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
