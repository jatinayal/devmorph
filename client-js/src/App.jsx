import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/auth/authThunk";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import Preview from "./pages/Preview";
import Community from "./pages/Community";
import View from "./pages/View";
import Docs from "./pages/Docs";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import ProjectShortcut from "./components/ProjectShortcut";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/adminlogin";
import AdminSignup from "./pages/adminSignup";
import AdminDashboard from "./pages/adminDashboard";
import Mobile from "./pages/Mobile";
import ProtectedRoute from "./components/ProtectedRoute";

import { BlurBackground } from "./components/ui/BlurBackground";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const isViewRoute = pathname.startsWith("/view/") || pathname.startsWith("/preview/");

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname === "/signup";

  const hideShortcut =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/";

  return (
    <>
      <BlurBackground />

      {!isViewRoute && <Mobile />}
      {!hideNavbar && <Navbar />}
      {!hideShortcut && <ProjectShortcut />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/projects/:projectId" element={<Projects />} />
          <Route path="/preview/:projectId" element={<Preview />} />
          <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        </Route>

        <Route path="/morphspace" element={<Community />} />
        <Route path="/view/:projectId" element={<View />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(0, 0, 0, 0.6)",
            color: "#d1fae5",
            border: "1px solid rgba(163, 230, 53, 1)",
            backdropFilter: "blur(12px)",
            borderRadius: "9999px",
            padding: "10px 14px",
            fontSize: "12px",
            fontWeight: 600,
          },
        }}
      />
    </>
  );
};

export default App;
