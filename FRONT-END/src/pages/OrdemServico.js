import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Wrench, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/ordemservico.css";

export default function OrdemServico() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/ordem_servico";

  const [ordens, setOrdens] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [ordemEditando, setOrdemEditando] = useState(null);

  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [problema, setProblema] = useState("");
  const [quilometragemAtual, setQuilometragemAtual] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [dataFechamento, setDataFechamento] = useState("");
  const [valorTotalItens, setValorTotalItens] = useState("");
  const [valorTotalProcedimento, setValorTotalProcedimento] = useState("");
  const [erroValidacao, setErroValidacao] = useState("");

  // Carregar ordens
  useEffect(() => {
    const carregarOrdens = async () => {
      try {
        const response = await axios.get(API_URL);
        setOrdens(response.data);
      } catch (error) {
        console.error("Erro ao carregar ordens:", error);
        setErroValidacao("Erro ao carregar ordens de serviço. Verifique o servidor.");
      }
    };
    carregarOrdens();
  }, []);

  const ordensFiltradas = ordens.filter(
    (o) =>
      o.id_os?.toString().includes(busca.toLowerCase()) ||
      o.problema?.toLowerCase().includes(busca.toLowerCase()) ||
      o.status?.toLowerCase().includes(busca.toLowerCase())
  );

  const limparFormulario = () => {
    setTipo("");
    setStatus("");
    setPrioridade("");
    setProblema("");
    setQuilometragemAtual("");
    setDataAbertura("");
    setDataFechamento("");
    setValorTotalItens("");
    setValorTotalProcedimento("");
    setOrdemEditando(null);
    setEditando(false);
    setErroValidacao("");
  };

  // Gravar
  const handleGravar = async () => {
    if (!tipo || !status || !prioridade || !problema || !quilometragemAtual || !dataAbertura) {
      setErroValidacao("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const novaOrdem = {
      tipo,
      status,
      prioridade,
      problema,
      quilometragem_atual: parseFloat(quilometragemAtual),
      data_abertura: dataAbertura,
      data_fechamento: dataFechamento || null,
      valor_total_itens: parseFloat(valorTotalItens) || 0,
      valor_total_procedimento: parseFloat(valorTotalProcedimento) || 0,
    };

    try {
      if (editando && ordemEditando) {
        await axios.put(`${API_URL}/${ordemEditando.id_os}`, novaOrdem);
        const atualizadas = ordens.map((o) =>
          o.id_os === ordemEditando.id_os ? { ...o, ...novaOrdem } : o
        );
        setOrdens(atualizadas);
      } else {
        const response = await axios.post(API_URL, novaOrdem);
        setOrdens([...ordens, response.data]);
      }

      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErroValidacao("Erro ao salvar ordem. Verifique o servidor.");
    }
  };

  return (
    <div className="pagina__ordemservico">
      {/* Header fixo */}
      <header className="ordemservico__header">
        <img src={logo} alt="Transvicon Logística" className="logo__ordemservico" />
        <button
          className="botao__voltar__ordemservico"
          onClick={() => {
            if (mostrarFormulario) {
              setMostrarFormulario(false);
              limparFormulario();
            } else {
              navigate("/menu");
            }
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="conteudo__ordemservico">
        {/* Título */}
        <div className="titulo__central__ordemservico">
          <h1>Ordens de Serviço</h1>
          <Wrench size={70} color="#000" />
        </div>

        {/* Formulário */}
        {mostrarFormulario ? (
          <div className="formulario__container__ordemservico">
            <div className="formulario__titulo__ordemservico">
              {editando ? "Editar Ordem de Serviço" : "Cadastro de Ordem de Serviço"}
            </div>

            <div className="formulario__campo__ordemservico">
            
            <div className="campo__input__ordemservico">
              <label>Tipo*</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Preventiva">Preventiva</option>
                <option value="Corretiva">Corretiva</option>
              </select>
              </div>

            <div className="campo__input__ordemservico">
              <label>Status*</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Aberta">Aberta</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizada">Finalizada</option>
              </select>
              </div>

              <div className="campo__input__ordemservico">
              <label>Prioridade*</label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
              </div>

             <div className="campo__input__ordemservico">
              <label>Problema*</label>
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder="Descreva o problema"
              />
              </div>

              <div className="campo__input__ordemservico">
              <label>Quilometragem Atual*</label>
              <input
                type="number"
                value={quilometragemAtual}
                onChange={(e) => setQuilometragemAtual(e.target.value)}
                placeholder="Digite a quilometragem"
              />
              </div>

             <div className="campo__input__ordemservico">
              <label>Data Abertura*</label>
              <input
                type="date"
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
              />
              </div>

              <div className="campo__input__ordemservico">
              <label>Data Fechamento</label>
              <input
                type="date"
                value={dataFechamento}
                onChange={(e) => setDataFechamento(e.target.value)}
              />
              </div>

              <div className="campo__input__ordemservico">
              <label>Valor Total Peças (R$)</label>
              <input
                type="number"
                value={valorTotalItens}
                onChange={(e) => setValorTotalItens(e.target.value)}
                placeholder="Digite o valor das peças"
              />
              </div>

             <div className="campo__input__ordemservico">
              <label>Valor Total Procedimento (R$)</label>
              <input
                type="number"
                value={valorTotalProcedimento}
                onChange={(e) => setValorTotalProcedimento(e.target.value)}
                placeholder="Digite o valor do procedimento"
              />
              </div>
            </div>

            {erroValidacao && (
              <div className="erro__mensagem__ordemservico">{erroValidacao}</div>
            )}

            <button className="gravar__ordemservico" onClick={handleGravar}>
              Gravar
            </button>
          </div>
        ) : (
          <>
            <div className="acoes__ordemservico">
              <div className="barra__pesquisa__ordemservico">
                <Search className="icone__pesquisa__ordemservico" size={28} color="black" />
                <input
                  type="text"
                  placeholder="Pesquisar ordem de serviço"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            <div className="tabela__container__ordemservico">
              <table className="tabela__ordemservico">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Problema</th>
                    <th>Data Abertura</th>
                    <th>Data Fechamento</th>
                    <th>Valor Peças</th>
                    <th>Valor Procedimento</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ordensFiltradas.map((o) => (
                    <tr key={o.id_os}>
                      <td>{o.id_os}</td>
                      <td>{o.tipo}</td>
                      <td>{o.status}</td>
                      <td>{o.prioridade}</td>
                      <td>{o.problema}</td>
                      <td>{new Date(o.data_abertura).toLocaleDateString()}</td>
                      <td>
                        {o.data_fechamento
                          ? new Date(o.data_fechamento).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{o.valor_total_itens?.toFixed(2)}</td>
                      <td>{o.valor_total_procedimento?.toFixed(2)}</td>
                      <td>
                        <button onClick={() => setMostrarFormulario(true)}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          <div className="cadastrar__container__ordemservico">
            <button
              className="cadastrar__ordemservico"
              onClick={() => setMostrarFormulario(true)}
            >
              Cadastrar Ordem de Serviço
            </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
