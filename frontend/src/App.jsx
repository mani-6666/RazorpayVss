import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trainings from "./pages/Trainings";
import Checkout from "./pages/Checkout";
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Trainings />} />
        <Route path="/checkout/:trainingId" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
