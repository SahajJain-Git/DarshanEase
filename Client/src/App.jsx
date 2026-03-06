import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Shared
import Spinner from './components/common/Spinner';

// Public pages
import HomePage         from './pages/Home/HomePage';
import TemplesPage      from './pages/Home/TemplesPage';

// Auth pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Booking pages
import TempleDetailPage   from './pages/Booking/TempleDetailPage';
import BookingPage        from './pages/Booking/BookingPage';
import BookingSuccessPage from './pages/Booking/BookingSuccessPage';
import MyBookingsPage     from './pages/Booking/MyBookingsPage';

// Profile
import ProfilePage from './pages/Profile/ProfilePage';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminTemples   from './pages/Admin/AdminTemples';
import AdminSlots     from './pages/Admin/AdminSlots';
import AdminBookings  from './pages/Admin/AdminBookings';
import AdminUsers     from './pages/Admin/AdminUsers';

// ── Route guards ──────────────────────────────────────────────

/** Requires a logged-in user (any role) */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullPage />;
  return user ? children : <Navigate to="/login" replace />;
}

/** Requires admin role */
function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Spinner fullPage />;
  if (!user)    return <Navigate to="/login"  replace />;
  if (!isAdmin) return <Navigate to="/"       replace />;
  return children;
}

/** Show navbar/footer only on non-admin pages */
function PublicShell({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public (with Navbar + Footer) ── */}
      <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
      <Route path="/temples" element={<PublicShell><TemplesPage /></PublicShell>} />
      <Route path="/temples/:id" element={<PublicShell><TempleDetailPage /></PublicShell>} />
      <Route path="/login"    element={<PublicShell><LoginPage /></PublicShell>} />
      <Route path="/register" element={<PublicShell><RegisterPage /></PublicShell>} />

      {/* ── Private user routes ── */}
      <Route path="/book/:slotId" element={
        <PrivateRoute><PublicShell><BookingPage /></PublicShell></PrivateRoute>
      } />
      <Route path="/booking-success/:bookingId" element={
        <PrivateRoute><PublicShell><BookingSuccessPage /></PublicShell></PrivateRoute>
      } />
      <Route path="/my-bookings" element={
        <PrivateRoute><PublicShell><MyBookingsPage /></PublicShell></PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute><PublicShell><ProfilePage /></PublicShell></PrivateRoute>
      } />

      {/* ── Admin routes (sidebar layout, no public nav) ── */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index          element={<AdminDashboard />} />
        <Route path="temples" element={<AdminTemples />} />
        <Route path="slots"   element={<AdminSlots />} />
        <Route path="bookings"element={<AdminBookings />} />
        <Route path="users"   element={<AdminUsers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}