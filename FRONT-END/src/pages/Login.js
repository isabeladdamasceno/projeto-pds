import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../style/login.css";
import logo from "../img/logo.png"; 
import background from "../img/frotaLogin.jpg";  

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Dados de Login:", { usuario, senha });

    navigate("/menu"); 
  };

  return (
    <div className="login__caixa">
      <img src={logo} alt="Logo da empresa" className="login__logo" />
      

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <h1>Login</h1>

        <div className="login__campo">
          <label htmlFor="usuario">Usuário</label>
          <input
            type="text"
            id="usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="login__campo">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="login__links">
          <a href="#">Esqueceu a Senha?</a>
        </div>

        <button type="submit" className="login__botao">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
