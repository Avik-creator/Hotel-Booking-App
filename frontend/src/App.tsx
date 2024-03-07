import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { Register } from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout children={<p>Home Page</p>} />} />
        <Route
          path="/search"
          element={<Layout children={<p>Search Page</p>} />}
        />
        <Route path="/sign-in" element={<Layout children={<SignIn />} />} />
        <Route path="/register" element={<Layout children={<Register />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
