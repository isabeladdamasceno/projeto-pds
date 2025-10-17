import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/modelos.css";

export default function Modelos() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001/modelos"; 

  const [modelos, setModelos] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [modeloEditando, setModeloEditando] = useState(null);
  const [nomeModelo, setNomeModelo] = useState("");
  const [marcaModelo, setMarcaModelo] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [modeloParaExcluir, setModeloParaExcluir] = useState(null);

  useEffect(() => {
    const carregarModelos = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(API_URL);
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        setErroValidacao("Erro ao carregar modelos. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarModelos();
  }, []);

  const modelosFiltrados = modelos.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Cadastrar ou Editar
  const handleGravar = async () => {
    const nome = nomeModelo.trim();
    const marca = marcaModelo.trim();

    if (!nome || !marca) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const duplicado = modelos.some(
      (m) =>
        m.nome.toLowerCase() === nome.toLowerCase() &&
        m.marca.toLowerCase() === marca.toLowerCase() &&
        (!editando || m.id_modelo !== modeloEditando?.id_modelo)
    );

    if (duplicado) {
      setErroValidacao("Já existe um modelo com este nome e marca.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    try {
      if (editando && modeloEditando) {
        await axios.put(`${API_URL}/${modeloEditando.id_modelo}`, {
          nome,
          marca,
        });

        const atualizados = modelos.map((m) =>
          m.id_modelo === modeloEditando.id_modelo ? { ...m, nome, marca } : m
        );
        setModelos(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");
      } else {
        const response = await axios.post(API_URL, { nome, marca });
        setModelos([...modelos, response.data]);
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      setErroValidacao("Erro ao salvar modelo. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNomeModelo("");
    setMarcaModelo("");
    setModeloEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleEditar = (modelo) => {
    setEditando(true);
    setMostrarFormulario(true);
    setModeloEditando(modelo);
    setNomeModelo(modelo.nome);
    setMarcaModelo(modelo.marca);
  };

  const handleExcluir = (modelo) => {
    setModeloParaExcluir(modelo);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (modeloParaExcluir) {
      try {
        await axios.delete(`${API_URL}/${modeloParaExcluir.id_modelo}`);
        setModelos(modelos.filter((m) => m.id_modelo !== modeloParaExcluir.id_modelo));
        setMensagemModal(`O modelo ${modeloParaExcluir.nome} foi excluído com sucesso.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir modelo:", error);
        setErroValidacao("Erro ao excluir modelo. Verifique o servidor.");
      } finally {
        setMostrarModalConfirmacao(false);
        setModeloParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__modelos">
      {/* Cabeçalho */}
      <header className="modelos__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__modelo"
          onClick={() => {
            if (mostrarFormulario) setMostrarFormulario(false);
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__modelo">
        <h1>Modelos</h1>
        <Settings size={70} color="#000" />
      </div>

      {/* Formulário */}
      {mostrarFormulario ? (
        <div className="formulario__container__modelo">
          <div className="formulario__titulo__modelo">
            {editando ? "Editar Modelo" : "Cadastro de Modelo"}
          </div>

          <div className="formulario__campo__modelo">
            <div className="campo__input__modelo">
              <label>Nome*</label>
              <input
                type="text"
                placeholder="Digite o nome do modelo"
                value={nomeModelo}
                onChange={(e) => setNomeModelo(e.target.value)}
              />
            </div>

            <div className="campo__input__modelo">
              <label>Marca*</label>
              <input
                type="text"
                placeholder="Digite a marca do modelo"
                value={marcaModelo}
                onChange={(e) => setMarcaModelo(e.target.value)}
              />
            </div>
          </div>

          {erroValidacao && (
            <div className="erro__mensagem__modelo">{erroValidacao}</div>
          )}

          <div className="formulario__acoes__modelo">
            <button
              className="gravar__modelo"
              onClick={handleGravar}
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Pesquisa */}
          <div className="acoes__modelo">
            <div className="barra__pesquisa__modelo">
              <Search className="icone__pesquisa__modelo" size={28} color="black" />
              <input
                type="text"
                placeholder="Pesquisar modelo"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="tabela__container__modelo">
            <table className="tabela__modelo">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {modelosFiltrados.length > 0 ? (
                  modelosFiltrados.map((modelo) => (
                    <tr key={modelo.id_modelo}>
                      <td>{modelo.id_modelo}</td>
                      <td>{modelo.nome}</td>
                      <td>{modelo.marca}</td>
                      <td className="acao__botoes__modelo">
                        <button className="editar__modelo" onClick={() => handleEditar(modelo)}>
                          Editar
                        </button>
                        <button className="excluir__modelo" onClick={() => handleExcluir(modelo)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                      Nenhum modelo encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Botão cadastrar */}
          <div className="cadastrar__container__modelo">
            <button
              className="cadastrar__modelo"
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(false);
                limparFormulario();
              }}
            >
              Cadastrar Modelo
            </button>
          </div>
        </>
      )}

      {/* Modais */}
      {mostrarModalConfirmacao && (
        <div className="modal__fundo__modelo">
          <div className="modal__confirmacao__modelo">
            <button className="modal__fechar__modelo" onClick={() => setMostrarModalConfirmacao(false)}>
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o modelo{" "}
              <strong>{modeloParaExcluir?.nome}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__modelo">
              <button className="modal__botao__excluir__modelo" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button className="modal__botao__cancelar__modelo" onClick={() => setMostrarModalConfirmacao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__modelo">
          <div className="modal__sucesso__modelo">
            <button className="modal__fechar__modelo" onClick={() => setMostrarModalSucesso(false)}>
              <X size={26} />
            </button>
            <p>{mensagemModal}</p>
            <Check size={38} color="#00bf63" />
          </div>
        </div>
      )}
    </div>
  );
}
