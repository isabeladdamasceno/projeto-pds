import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Search, X } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/modelos.css";

export default function Modelos() {
  const navigate = useNavigate();

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

  // Carrega modelos do backend
  useEffect(() => {
    const carregarModelos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/modelos");
        setModelos(response.data);
      } catch (error) {
        console.error("Erro ao carregar modelos:", error);
        setErroValidacao("Não foi possível carregar os modelos.");
      }
    };

    carregarModelos();
  }, []);

  // busca
  const modelosFiltrados = modelos.filter((m) =>
    m.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Cadastro  e editar
  const handleGravar = async () => {
    const nome = nomeModelo.trim();
    const marca = marcaModelo.trim();

    if (!nome || !marca) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Verificação de duplicação 
    const duplicado = modelos.some(
      (m) =>
        m.nome.toLowerCase() === nome.toLowerCase() &&
        m.marca.toLowerCase() === marca.toLowerCase() &&
        (!editando || m.id !== modeloEditando?.id)
    );

    if (duplicado) {
      setErroValidacao("Já existe um modelo com este nome e marca.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    try {
      if (editando && modeloEditando) {
        await axios.put(`http://localhost:3000/modelos/${modeloEditando.id}`, {
          nome,
          marca,
        });

        const atualizados = modelos.map((m) =>
          m.id === modeloEditando.id ? { ...m, nome, marca } : m
        );
        setModelos(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");
      } else {
        const response = await axios.post("http://localhost:3000/modelos", {
          nome,
          marca,
        });

        setModelos([...modelos, response.data]);
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      setMostrarFormulario(false);
      setEditando(false);
      setNomeModelo("");
      setMarcaModelo("");
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      setErroValidacao(
        error.response?.data?.error || "Erro ao salvar modelo. Verifique o servidor."
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleEditar = (modelo) => {
    setEditando(true);
    setMostrarFormulario(true);
    setModeloEditando(modelo);
    setNomeModelo(modelo.nome);
    setMarcaModelo(modelo.marca);
    setErroValidacao("");
  };

  const handleExcluir = (modelo) => {
    setModeloParaExcluir(modelo);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (modeloParaExcluir) {
      try {
        await axios.delete(`http://localhost:3000/modelos/${modeloParaExcluir.id}`);

        const atualizados = modelos.filter((m) => m.id !== modeloParaExcluir.id);
        setModelos(atualizados);

        setMensagemModal(
          `O modelo ${modeloParaExcluir.nome} (ID: ${modeloParaExcluir.id}) foi excluído com sucesso.`
        );
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
      {/* CABEÇALHO */}
      <header className="modelos__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__modelo"
          onClick={() => {
            if (mostrarFormulario) {
              setMostrarFormulario(false);
            } else {
              navigate("/gerenciamento");
            }
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__modelo">
        <h1>Modelos</h1>
        <Settings size={70} color="#000" />
      </div>

      {/* FORMULÁRIO */}
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
          {/* PESQUISA */}
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

          {/* LISTAGEM */}
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
                    <tr key={modelo.id}>
                      <td>{modelo.id}</td>
                      <td>{modelo.nome}</td>
                      <td>{modelo.marca}</td>
                      <td className="acao__botoes__modelo">
                        <button
                          className="editar__modelo"
                          onClick={() => handleEditar(modelo)}
                        >
                          Editar
                        </button>
                        <button
                          className="excluir__modelo"
                          onClick={() => handleExcluir(modelo)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhum modelo encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cadastrar__container__modelo">
            <button
              className="cadastrar__modelo"
              onClick={() => setMostrarFormulario(true)}
            >
              Cadastrar Modelo
            </button>
          </div>
        </>
      )}

      {/* MODAL CONFIRMAÇÃO */}
      {mostrarModalConfirmacao && (
        <div className="modal__fundo__modelo">
          <div className="modal__confirmacao__modelo">
            <button
              className="modal__fechar__modelo"
              onClick={() => setMostrarModalConfirmacao(false)}
            >
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o modelo{" "}
              <strong>{modeloParaExcluir?.nome}</strong> (ID:{" "}
              {modeloParaExcluir?.id}). <br />
              Esta ação é irreversível.
            </p>

            <div className="modal__botoes__modelo">
              <button
                className="modal__botao__excluir__modelo"
                onClick={confirmarExclusao}
              >
                Excluir Permanentemente
              </button>
              <button
                className="modal__botao__cancelar__modelo"
                onClick={() => setMostrarModalConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUCESSO */}
      {mostrarModalSucesso && (
        <div className="modal__fundo__modelo">
          <div className="modal__sucesso__modelo">
            <button
              className="modal__fechar__modelo"
              onClick={() => setMostrarModalSucesso(false)}
            >
              <X size={26} />
            </button>
            <p>{mensagemModal}</p>
          </div>
        </div>
      )}
    </div>
  );
}
