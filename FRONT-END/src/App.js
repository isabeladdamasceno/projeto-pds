import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Gerenciamento from "./pages/Gerenciamento";
import Setores from "./pages/Setores";
import Modelos from "./pages/Modelos";       
import "./style/global.css";          

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/gerenciamento" element={<Gerenciamento />} />
        <Route path="/setores" element={<Setores />} />
        <Route path="/modelos" element={<Modelos />} />
      </Routes>
    </Router>
  );
}

export default App;