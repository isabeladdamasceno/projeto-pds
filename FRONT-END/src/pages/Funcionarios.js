import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/funcionarios.css";

export default function Funcionarios() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001/funcionarios";

  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [idSetor, setIdSetor] = useState("");
  const [situacao, setSituacao] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDemissao, setDataDemissao] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);

  const mascaraCPF = (valor) => {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  useEffect(() => {
    const carregarFuncionarios = async () => {
      setCarregando(true);
      try {
        const response = await axios.get(API_URL);
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
        setErroValidacao("Erro ao carregar funcionários. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarFuncionarios();
  }, []);

  const funcionariosFiltrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cpf.includes(busca)
  );

  const handleGravar = async () => {
    if (!nome || !cpf || !situacao || !dataAdmissao || !idSetor) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setErroValidacao("");
    setCarregando(true);

    const novoFuncionario = {
      nome,
      cpf,
      id_setor: idSetor,
      situacao,
      data_admissao: dataAdmissao,
      data_demissao: dataDemissao,
    };

    try {
      if (editando && funcionarioEditando) {
        await axios.put(`${API_URL}/${funcionarioEditando.id_funcionario}`, novoFuncionario);

        const atualizados = funcionarios.map((f) =>
          f.id_funcionario === funcionarioEditando.id_funcionario ? { ...f, ...novoFuncionario } : f
        );

        setFuncionarios(atualizados);
        setMensagemModal("Alterações salvas com sucesso!");
      } else {
        const response = await axios.post(API_URL, novoFuncionario);
        setFuncionarios([...funcionarios, response.data]);
        setMensagemModal("Cadastro efetuado com sucesso!");
      }

      setMostrarModalSucesso(true);
      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      setErroValidacao("Erro ao salvar funcionário. Verifique o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const limparFormulario = () => {
    setNome("");
    setCpf("");
    setIdSetor("");
    setSituacao("");
    setDataAdmissao("");
    setDataDemissao("");
    setFuncionarioEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  const handleEditar = (funcionario) => {
    setEditando(true);
    setMostrarFormulario(true);
    setFuncionarioEditando(funcionario);
    setNome(funcionario.nome);
    setCpf(funcionario.cpf);
    setIdSetor(funcionario.id_setor);
    setSituacao(funcionario.situacao);
    setDataAdmissao(funcionario.data_admissao || "");
    setDataDemissao(funcionario.data_demissao || "");
  };

  const handleExcluir = (funcionario) => {
    setFuncionarioParaExcluir(funcionario);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (funcionarioParaExcluir) {
      try {
        await axios.delete(`${API_URL}/${funcionarioParaExcluir.id_funcionario}`);
        setFuncionarios(funcionarios.filter((f) => f.id_funcionario !== funcionarioParaExcluir.id_funcionario));
        setMensagemModal(`O funcionário ${funcionarioParaExcluir.nome} foi excluído com sucesso.`);
        setMostrarModalSucesso(true);
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        setErroValidacao("Erro ao excluir funcionário. Verifique o servidor.");
      } finally {
        setMostrarModalConfirmacao(false);
        setFuncionarioParaExcluir(null);
      }
    }
  };

  return (
    <div className="pagina__funcionario">
      <header className="funcionario__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__funcionario"
          onClick={() => {
            if (mostrarFormulario) setMostrarFormulario(false);
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__funcionario">
        <h1>Funcionários</h1>
        <User size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__funcionario">
          <div className="formulario__titulo__funcionario">
            {editando ? "Editar Funcionário" : "Cadastro de Funcionário"}
          </div>

          <div className="formulario__campo__funcionario">
            <div className="campo__input__funcionario">
              <label>Nome*</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" />
            </div>

            <div className="campo__input__funcionario">
              <label>CPF*</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(mascaraCPF(e.target.value))} maxLength={14} placeholder="Digite o CPF" />
            </div>

            <div className="campo__input__funcionario">
              <label>Setor*</label>
              <input type="text" value={idSetor} onChange={(e) => setIdSetor(e.target.value)} placeholder="Digite setor" />
            </div>

            <div className="campo__input__funcionario">
              <label>Situação*</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="campo__input__funcionario">
              <label>Data de Admissão*</label>
              <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} />
            </div>

            <div className="campo__input__funcionario">
              <label>Data de Demissão</label>
              <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} />
            </div>
          </div>

          {erroValidacao && <div className="erro__mensagem__funcionario">{erroValidacao}</div>}

          <div className="formulario__acoes__funcionario">
            <button className="gravar__funcionario" onClick={handleGravar} disabled={carregando}>
              {carregando ? "Salvando..." : "Gravar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="acoes__funcionario">
            <div className="barra__pesquisa__funcionario">
              <Search className="icone__pesquisa__funcionario" size={28} color="black" />
              <input
                type="text"
                placeholder="Pesquisar funcionário"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="tabela__container__funcionario">
            <table className="tabela__funcionario">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Setor</th>
                  <th>Situação</th>
                  <th>Admissão</th>
                  <th>Demissão</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {funcionariosFiltrados.length > 0 ? (
                  funcionariosFiltrados.map((func) => (
                    <tr key={func.id_funcionario}>
                      <td>{func.id_funcionario}</td>
                      <td>{func.nome}</td>
                      <td>{func.cpf}</td>
                      <td>{func.id_setor}</td>
                      <td>{func.situacao}</td>
                      <td>{func.data_admissao || "-"}</td>
                      <td>{func.data_demissao || "-"}</td>
                      <td className="acao__botoes__funcionario">
                        <button className="editar__funcionario" onClick={() => handleEditar(func)}>Editar</button>
                        <button className="excluir__funcionario" onClick={() => handleExcluir(func)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "15px" }}>
                      Nenhum funcionário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cadastrar__container__funcionario">
            <button
              className="cadastrar__funcionario"
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(false);
                limparFormulario();
              }}
            >
              Cadastrar Funcionário
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo__funcionario">
          <div className="modal__confirmacao__funcionario">
            <button className="modal__fechar__funcionario" onClick={() => setMostrarModalConfirmacao(false)}>
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o funcionário <strong>{funcionarioParaExcluir?.nome}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__funcionario">
              <button className="modal__botao__excluir__funcionario" onClick={confirmarExclusao}>
                Excluir Permanentemente
              </button>
              <button className="modal__botao__cancelar__funcionario" onClick={() => setMostrarModalConfirmacao(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__funcionario">
          <div className="modal__sucesso__funcionario">
            <button className="modal__fechar__funcionario" onClick={() => setMostrarModalSucesso(false)}>
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
