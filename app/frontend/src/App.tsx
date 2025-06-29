import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import ThemeToggleButton from './components/common/ThemeToggleButton';
import MainContainer from './components/layout/MainContainer';
import { useTheme } from './hooks/useTheme';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { useAuthStore } from './store/auth.store';
import RegisterPage from './pages/RegisterPage'; // Import the new page

// This component checks if a user is authenticated.
// If yes, it renders the chat page; otherwise, it redirects to the login page.
const ProtectedRoute = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// This prevents logged-in users from accessing login/register pages
const PublicRoute = () => {
  const { user } = useAuthStore();
  return !user ? <Outlet /> : <Navigate to="/chat" replace />;
}

const App = () => {
  useTheme();

  return (
    <main
      className="w-full h-screen flex items-center justify-center 
                 bg-gray-200 dark:bg-gray-900 transition-colors duration-300
                 bg-cover bg-center
                 "
      style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2018/03/02/19/21/nature-3194001_640.jpg')" }}
    // style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2940&auto=format&fit=crop')" }}
    >
      {/* <ThemeToggleButton /> */}
      <MainContainer>
        <Routes>
          {/* Public Routes - only accessible when not logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes - only accessible when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </MainContainer>
    </main>
  );
};

export default App;
