import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cog, Search, X, Check } from "lucide-react";
import axios from "axios"; // Importante ter o axios
import logo from "../img/logo.png";
import "../style/setores.css";

// URL DO SERVER.JS
const API_URL = "http://localhost:3001";

export default function Setores() {
  const navigate = useNavigate();

  const [setores, setSetores] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [setorEditando, setSetorEditando] = useState(null);
  const [nomeSetor, setNomeSetor] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [setorParaExcluir, setSetorParaExcluir] = useState(null);

  // Carregar setores do backend
  useEffect(() => {
    const carregarSetores = async () => {
      try {
        const response = await axios.get(`${API_URL}/setores`);
        setSetores(response.data);
      } catch (error) {
        console.error("Erro ao carregar setores:", error);
        setErroValidacao("Não foi possível carregar os setores do servidor.");
      }
    };

    carregarSetores();
  }, []); 

  // BUSCA FILTRADA
  const setoresFiltrados = setores.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // FUNÇÃO PARA GRAVAR (CRIAR OU EDITAR)
  const handleGravar = async () => {
    const nome = nomeSetor.trim();

    if (!nome) {
      setErroValidacao("Por favor, preencha o campo obrigatório.");
      return;
    }
    const duplicado = setores.some(
      (s) =>
        s.nome.toLowerCase() === nome.toLowerCase() && s.id !== setorEditando?.id
    );
    if (duplicado) {
      setErroValidacao("Já existe um setor com este nome.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    try {
      if (editando && setorEditando) {
        // EDITAR SETOR
        await axios.put(`${API_URL}/setores/${setorEditando.id}`, { nome });
        const atualizados = setores.map((s) =>
          s.id === setorEditando.id ? { ...s, nome } : s
        );
        setSetores(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");
      } else {
        // CRIAR SETOR
        const response = await axios.post(`${API_URL}/setores`, { nome });
        setSetores([...setores, response.data]); // Adiciona o novo setor na lista
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      setMostrarFormulario(false);
      setEditando(false);
      setNomeSetor("");
      setSetorEditando(null);
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
      setErroValidacao("Erro ao salvar setor. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // FORMULARIO PARA EDIÇÃO
  const handleEditar = (setor) => {
    setEditando(true);
    setMostrarFormulario(true);
    setSetorEditando(setor);
    setNomeSetor(setor.nome);
    setErroValidacao("");
  };

  // PERGUNTA ANTES DE EXCLUIR
  const handleExcluir = (setor) => {
    setSetorParaExcluir(setor);
    setMostrarModalConfirmacao(true);
  };

  // COFIRMAR EXCLUSÃO
  const confirmarExclusao = async () => {
    if (setorParaExcluir) {
      try {
        await axios.delete(`${API_URL}/setores/${setorParaExcluir.id}`);
        const atualizados = setores.filter((s) => s.id !== setorParaExcluir.id);
        setSetores(atualizados); // Remove o setor da lista

        setMensagemModal(
          `O setor ${setorParaExcluir.nome} foi excluído com sucesso.`
        );
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir setor:", error);
        setErroValidacao("Erro ao excluir setor. Verifique o servidor.");
      } finally {
        setMostrarModalConfirmacao(false);
        setSetorParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__setores">
      {/* CABEÇALHO */}
      <header className="setores__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar"
          onClick={() => {
            if (mostrarFormulario) {
              setMostrarFormulario(false);
              setEditando(false);
              setNomeSetor("");
              setErroValidacao("");
            } else {
              navigate("/gerenciamento");
            }
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central">
        <h1>Setores</h1>
        <Cog size={70} color="#000" />
      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario ? (
        <div className="formulario__container">
          <div className="formulario__titulo">
            {editando ? "Editar Setor" : "Cadastro de Setor"}
          </div>

          <div className="formulario__campo">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Digite o nome do setor"
              value={nomeSetor}
              onChange={(e) => setNomeSetor(e.target.value)}
            />
          </div>

          {erroValidacao && (
            <div className="erro__mensagem__setor">{erroValidacao}</div>
          )}

          <div className="formulario__acoes">
            <button className="gravar" onClick={handleGravar} disabled={carregando}>
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* PESQUISA E TABELA */}
          <div className="acoes">
            <div className="barra__pesquisa">
              <Search className="icone__pesquisa" size={28} color="black" />
              <input
                type="text"
                placeholder="Pesquisar setor"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="tabela__container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {setoresFiltrados.length > 0 ? (
                  setoresFiltrados.map((setor) => (
                    <tr key={setor.id}>
                      <td>{setor.id}</td>
                      <td>{setor.nome}</td>
                      <td style={{ textAlign: "right", paddingRight: "60px" }}>
                        <button className="editar" onClick={() => handleEditar(setor)}>
                          Editar
                        </button>
                        <button className="excluir" onClick={() => handleExcluir(setor)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Nenhum setor encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cadastrar__container">
            <button className="cadastrar" onClick={() => {
              setMostrarFormulario(true);
              setEditando(false);
              setNomeSetor('');
              setSetorEditando(null);
            }}>
              Cadastrar Setor
            </button>
          </div>
        </>
      )}

      {/* MODAIS */}
      {mostrarModalConfirmacao && (
        <div className="modal__fundo">
          <div className="modal__confirmacao">
            <button
              className="modal__fechar"
              onClick={() => setMostrarModalConfirmacao(false)}
            >
              <X size={24} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o setor{" "}
              <strong>{setorParaExcluir?.nome}</strong> (ID: {setorParaExcluir?.id}).
              <br />
              Esta ação é irreversível.
            </p>
            <div className="modal__botoes">
              <button className="modal__botao--excluir" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button
                className="modal__botao--cancelar"
                onClick={() => setMostrarModalConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo">
          <div className="modal__sucesso">
            <button
              className="modal__fechar"
              onClick={() => setMostrarModalSucesso(false)}
            >
              <X size={22} />
            </button>
            <p>{mensagemModal}</p>
            <Check size={38} color="#00bf63" />
          </div>
        </div>
      )}
    </div>
  );
}