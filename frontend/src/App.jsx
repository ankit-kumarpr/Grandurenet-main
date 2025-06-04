import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Allmain from "./components/Allmain";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Allmain />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
