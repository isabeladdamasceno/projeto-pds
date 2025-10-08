import React from "react";
import "../style/menu.css";
import { Database, Wrench, BarChart3 } from "lucide-react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

export default function Menu() {
    const navigate = useNavigate();

  return (
    <div className="pagina__menu">
      
      <header className="menu__logo">
        <img src={logo} alt="Transvicon Logística" />

      </header>

      <div className="menu__opcoes">

          <div className="menu__item" onClick={() => navigate("/gerenciamento")}>
           <Database size={60} color="#e60000" />
            <p>GERENCIAMENTO</p>
            </div>

        <div className="menu__item">
          <Wrench size={60} color="#e60000" />
          <p>ORDENS DE SERVIÇO</p>
        </div>

        <div className="menu__item">
          <BarChart3 size={60} color="#e60000" />
          <p>RELATÓRIOS</p>
        </div>

      </div>
      </div>
  );
}
