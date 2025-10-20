import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Search, X, Check, FileText } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/procedimentos.css";

export default function Procedimentos() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001/procedimentos";

  const [procedimentos, setProcedimentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [procedimentoEditando, setProcedimentoEditando] = useState(null);

  const [descricao, setDescricao] = useState("");
  const [idSetor, setIdSetor] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [procedimentoParaExcluir, setProcedimentoParaExcluir] = useState(null);

  useEffect(() => {
    const carregarProcedimentos = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(API_URL);
        setProcedimentos(response.data);
      } catch (error) {
        console.error("Erro ao carregar procedimentos:", error);
        setErroValidacao("Erro ao carregar procedimentos. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarProcedimentos();
  }, []);

  const procedimentosFiltrados = procedimentos.filter((p) =>
  p.id?.toString().includes(busca.toLowerCase()) ||
  p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
  p.setor?.toLowerCase().includes(busca.toLowerCase())
);

  const handleGravar = async () => {
    if (!descricao || !valorUnitario || !idSetor) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    const novoProcedimento = {
      descricao,
      valor_unitario: parseFloat(valorUnitario),
      id_setor: idSetor,
    };

    try {
      if (editando && procedimentoEditando) {
        await axios.put(`${API_URL}/${procedimentoEditando.id_procedimento}`, novoProcedimento);

        const atualizados = procedimentos.map((p) =>
          p.id_procedimento === procedimentoEditando.id_procedimento ? { ...p, ...novoProcedimento } : p
        );

        setProcedimentos(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");
      } else {
        const response = await axios.post(API_URL, novoProcedimento);
        setProcedimentos([...procedimentos, response.data]);
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar procedimento:", error);
      setErroValidacao("Erro ao salvar procedimento. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setDescricao("");
    setValorUnitario("");
    setIdSetor("");
    setProcedimentoEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleEditar = (procedimento) => {
    setEditando(true);
    setMostrarFormulario(true);
    setProcedimentoEditando(procedimento);
    setDescricao(procedimento.descricao);
    setValorUnitario(procedimento.valor_unitario);
    setIdSetor(procedimento.id_setor);
  };

  const handleExcluir = (procedimento) => {
    setProcedimentoParaExcluir(procedimento);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (procedimentoParaExcluir) {
      try {
        await axios.delete(`${API_URL}/${procedimentoParaExcluir.id_procedimento}`);
        setProcedimentos(procedimentos.filter((p) => p.id_procedimento !== procedimentoParaExcluir.id_procedimento));
        setMensagemModal(`O procedimento "${procedimentoParaExcluir.descricao}" foi excluído com sucesso.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir procedimento:", error);
        setErroValidacao("Erro ao excluir procedimento. Verifique o servidor.");
      } finally {
        setMostrarModalConfirmacao(false);
        setProcedimentoParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__procedimento">
      <header className="procedimento__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__procedimento"
          onClick={() => {
            if (mostrarFormulario) setMostrarFormulario(false);
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__procedimento">
        <h1>Procedimentos</h1>
        <FileText size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__procedimento">
          <div className="formulario__titulo__procedimento">
            {editando ? "Editar Procedimento" : "Cadastro de Procedimento"}
          </div>

          <div className="formulario__campo__procedimento">
            <div className="campo__input__procedimento">
              <label>Descrição*</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição"
              />
            </div>

            <div className="campo__input__procedimento">
              <label>Setor*</label>
              <input
                type="text"
                value={idSetor}
                onChange={(e) => setIdSetor(e.target.value)}
                placeholder="Digite o ID do setor"
              />
            </div>

            <div className="campo__input__procedimento">
              <label>Valor Unitário (R$)*</label>
              <input
                type="number"
                step="0.01"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                placeholder="Digite o valor"
              />
            </div>
          </div>

          {erroValidacao && <div className="erro__mensagem__procedimento">{erroValidacao}</div>}

          <div className="formulario__acoes__procedimento">
            <button className="gravar__procedimento" onClick={handleGravar} disabled={carregando}>
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="acoes__procedimento">
            <div className="barra__pesquisa__procedimento">
              <Search className="icone__pesquisa__procedimento" size={28} color="black" />
              <input
                type="text"
                placeholder="Pesquisar procedimento"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="tabela__container__procedimento">
            <table className="tabela__procedimento">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Setor</th>
                  <th>Valor Unitário</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {procedimentosFiltrados.length > 0 ? (
                  procedimentosFiltrados.map((p) => (
                    <tr key={p.id_procedimento}>
                      <td>{p.id_procedimento}</td>
                      <td>{p.descricao}</td>
                      <td>{p.id_setor}</td>
                      <td>{parseFloat(p.valor_unitario).toFixed(2)}</td>
                      <td className="acao__botoes__procedimento">
                        <button className="editar__procedimento" onClick={() => handleEditar(p)}>Editar</button>
                        <button className="excluir__procedimento" onClick={() => handleExcluir(p)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                      Nenhum procedimento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cadastrar__container__procedimento">
            <button
              className="cadastrar__procedimento"
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(false);
                limparFormulario();
              }}
            >
              Cadastrar Procedimento
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo__procedimento">
          <div className="modal__confirmacao__procedimento">
            <button className="modal__fechar__procedimento" onClick={() => setMostrarModalConfirmacao(false)}>
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o procedimento{" "}
              <strong>{procedimentoParaExcluir?.descricao}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__procedimento">
              <button className="modal__botao__excluir__procedimento" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button className="modal__botao__cancelar__procedimento" onClick={() => setMostrarModalConfirmacao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__procedimento">
          <div className="modal__sucesso__procedimento">
            <button className="modal__fechar__procedimento" onClick={() => setMostrarModalSucesso(false)}>
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
