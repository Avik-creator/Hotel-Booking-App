import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { Register } from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout children={<Home />} />} />
        <Route path="/search" element={<Layout children={<Search />} />} />
        <Route
          path="/detail/:hotelId"
          element={<Layout children={<Detail />} />}
        />
        {isLoggedIn && (
          <>
            <Route
              path="/add-hotel"
              element={<Layout children={<AddHotel />} />}
            />

            <Route path="/hotel/:hotelId/booking" element={<Booking />} />

            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />

            <Route
              path="/my-hotels"
              element={<Layout children={<MyHotels />} />}
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={<Layout children={<EditHotel />} />}
            />
          </>
        )}
        <Route path="/sign-in" element={<Layout children={<SignIn />} />} />
        <Route path="/register" element={<Layout children={<Register />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
