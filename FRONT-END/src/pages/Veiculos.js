import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Truck, Search, X, Check } from "lucide-react";
import axios from "axios";
import logo from "../img/logo.png";
import "../style/veiculos.css";

export default function Veiculos() {
  const navigate = useNavigate();

  const [veiculos, setVeiculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [veiculoEditando, setVeiculoEditando] = useState(null);

  const [placa, setPlaca] = useState("");
  const [idModelo, setIdModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [tipo, setTipo] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [cor, setCor] = useState("");
  const [chassi, setChassi] = useState("");
  const [situacao, setSituacao] = useState("");

  const [erroValidacao, setErroValidacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);

  // 🔧 Dados fictícios temporários
  useEffect(() => {
    setVeiculos([
      {
        placa: "ABC1D23",
        id_modelo: "3",
        marca: "Volvo",
        tipo: "Caminhão Refrigerado",
        ano_fabricacao: "2022",
        quilometragem: "158000.50",
        cor: "Branco",
        chassi: "9BWZZZ377VT004251",
        situacao: "Ativo",
      },
      {
        placa: "XYZ9K88",
        id_modelo: "5",
        marca: "Scania",
        tipo: "Graneleiro",
        ano_fabricacao: "2020",
        quilometragem: "289000.00",
        cor: "Azul",
        chassi: "8ABZZZ123TT004298",
        situacao: "Inativo",
      },
    ]);
  }, []);

  const veiculosFiltrados = veiculos.filter((v) =>
  v.placa.toLowerCase().includes(busca.toLowerCase()) ||
  v.marca.toLowerCase().includes(busca.toLowerCase()) ||
  v.tipo.toLowerCase().includes(busca.toLowerCase()) ||
  v.cor.toLowerCase().includes(busca.toLowerCase()) ||
  v.chassi.toLowerCase().includes(busca.toLowerCase()) ||
  v.ano_fabricacao.toString().includes(busca) ||
  v.situacao.toLowerCase().includes(busca.toLowerCase())
);


  const handleGravar = () => {
    if (!placa || !idModelo || !tipo || !anoFabricacao || !quilometragem || !chassi || !situacao) {
      setErroValidacao("Preencha todos os campos obrigatórios.");
      return;
    }

    const novoVeiculo = {
      placa,
      id_modelo: idModelo,
      marca,
      tipo,
      ano_fabricacao: anoFabricacao,
      quilometragem,
      cor,
      chassi,
      situacao,
    };

    if (editando && veiculoEditando) {
      const atualizados = veiculos.map((v) =>
        v.placa === veiculoEditando.placa ? novoVeiculo : v
      );
      setVeiculos(atualizados);
      setMensagemModal("Veículo atualizado com sucesso!");
    } else {
      setVeiculos([...veiculos, novoVeiculo]);
      setMensagemModal("Veículo cadastrado com sucesso!");
    }

    setMostrarModalSucesso(true);
    limparFormulario();
    setMostrarFormulario(false);
  };

  const limparFormulario = () => {
    setPlaca("");
    setIdModelo("");
    setMarca("");
    setTipo("");
    setAnoFabricacao("");
    setQuilometragem("");
    setCor("");
    setChassi("");
    setSituacao("");
    setEditando(false);
    setVeiculoEditando(null);
    setErroValidacao("");
  };

  const handleEditar = (veiculo) => {
    setEditando(true);
    setMostrarFormulario(true);
    setVeiculoEditando(veiculo);
    setPlaca(veiculo.placa);
    setIdModelo(veiculo.id_modelo);
    setMarca(veiculo.marca);
    setTipo(veiculo.tipo);
    setAnoFabricacao(veiculo.ano_fabricacao);
    setQuilometragem(veiculo.quilometragem);
    setCor(veiculo.cor);
    setChassi(veiculo.chassi);
    setSituacao(veiculo.situacao);
  };

  const handleExcluir = (veiculo) => {
    setVeiculoParaExcluir(veiculo);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = () => {
    if (veiculoParaExcluir) {
      setVeiculos(veiculos.filter((v) => v.placa !== veiculoParaExcluir.placa));
      setMensagemModal(`Veículo ${veiculoParaExcluir.placa} excluído com sucesso!`);
      setMostrarModalSucesso(true);
      setMostrarModalConfirmacao(false);
    }
  };

  return (
    <div className="pagina__veiculo">
      <header className="veiculo__header">
        <img src={logo} alt="Transvicon Logística" className="logo" />
        <button
          className="botao__voltar__veiculo"
          onClick={() => {
            if (mostrarFormulario) setMostrarFormulario(false);
            else navigate("/gerenciamento");
          }}
        >
          ⬅ Voltar
        </button>
      </header>

      <div className="titulo__central__veiculo">
        <h1>Veículos</h1>
        <Truck size={70} color="#000" />
      </div>

      {mostrarFormulario ? (
        <div className="formulario__container__veiculo">
          <div className="formulario__titulo__veiculo">
            {editando ? "Editar Veículo" : "Cadastro de Veículo"}
          </div>

          <div className="formulario__campo__veiculo">
            <div className="campo__input__veiculo">
              <label>Placa*</label>
              <input type="text" placeholder="Ex: ABC1D23" value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())} maxLength={8} />
            </div>

            <div className="campo__input__veiculo">
              <label>Modelo*</label>
              <input type="number" placeholder="Digite o modelo" value={idModelo} onChange={(e) => setIdModelo(e.target.value)} />
            </div>

            <div className="campo__input__veiculo">
              <label>Marca*</label>
              <input type="text" placeholder="Digite a marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
            </div>

            <div className="campo__input__veiculo">
              <label>Tipo*</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Caminhão Refrigerado">Caminhão Refrigerado</option>
                <option value="Sider">Sider</option>
                <option value="Graneleiro">Graneleiro</option>
                <option value="Câmara Fria">Câmara Fria</option>
                <option value="Carreta Tanque">Carreta Tanque</option>
                <option value="V.U.C">V.U.C</option>
              </select>
            </div>

            <div className="campo__input__veiculo">
              <label>Ano Fabricação*</label>
              <input type="number" placeholder="Digite o ano" value={anoFabricacao} onChange={(e) => setAnoFabricacao(e.target.value)} />
            </div>

            <div className="campo__input__veiculo">
              <label>Quilometragem*</label>
              <input type="number" placeholder="Ex: 120000" value={quilometragem} onChange={(e) => setQuilometragem(e.target.value)} />
            </div>

            <div className="campo__input__veiculo">
              <label>Cor*</label>
              <input type="text" placeholder="Digite a cor" value={cor} onChange={(e) => setCor(e.target.value)} />
            </div>

            <div className="campo__input__veiculo">
              <label>Chassi*</label>
              <input type="text" placeholder="Ex: 9BWZZZ377VT004251" value={chassi} onChange={(e) => setChassi(e.target.value.toUpperCase())} maxLength={17} />
            </div>

            <div className="campo__input__veiculo">
              <label>Situação*</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {erroValidacao && <div className="erro__mensagem__veiculo">{erroValidacao}</div>}

          <div className="formulario__acoes__veiculo">
            <button className="gravar__veiculo" onClick={handleGravar}>
              Gravar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="acoes__veiculo">
            <div className="barra__pesquisa__veiculo">
              <Search className="icone__pesquisa__veiculo" size={28} color="black" />
              <input type="text" placeholder="Pesquisar veículo" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
          </div>

          <div className="tabela__container__veiculo">
  <table className="tabela__veiculo">
    <thead>
      <tr>
        <th>ID</th>
        <th>Placa</th>
        <th>Modelo</th>
        <th>Marca</th>
        <th>Tipo</th>
        <th>Ano</th>
        <th>KM</th>
        <th>Cor</th>
        <th>Chassi</th>
        <th>Situação</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {veiculosFiltrados.length > 0 ? (
        veiculosFiltrados.map((v, index) => (
          <tr key={v.placa}>
            <td>{index + 1}</td> 
            <td>{v.placa}</td>
            <td>{v.id_modelo}</td> 
            <td>{v.marca}</td>
            <td>{v.tipo}</td>
            <td>{v.ano_fabricacao}</td>
            <td>{v.quilometragem}</td>
            <td>{v.cor}</td>
            <td>{v.chassi}</td>
            <td>{v.situacao}</td>
            <td className="acao__botoes__veiculo">
              <button className="editar__veiculo" onClick={() => handleEditar(v)}>Editar</button>
              <button className="excluir__veiculo" onClick={() => handleExcluir(v)}>Excluir</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="11">Nenhum veículo encontrado</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          <div className="cadastrar__container__veiculo">
            <button
              className="cadastrar__veiculo"
              onClick={() => {
                setMostrarFormulario(true);
                setEditando(false);
                limparFormulario();
              }}
            >
              Cadastrar Veículo
            </button>
          </div>
        </>
      )}

      {mostrarModalConfirmacao && (
        <div className="modal__fundo__veiculo">
          <div className="modal__confirmacao__veiculo">
            <button className="modal__fechar__veiculo" onClick={() => setMostrarModalConfirmacao(false)}>
              <X size={26} />
            </button>
            <p>
              Você está prestes a excluir permanentemente o veículo <strong>{veiculoParaExcluir?.placa}</strong>.
              <br /> Esta ação é irreversível.
            </p>
            <div className="modal__botoes__veiculo">
              <button className="modal__botao__excluir__veiculo" onClick={confirmarExclusao}>Excluir</button>
              <button className="modal__botao__cancelar__veiculo" onClick={() => setMostrarModalConfirmacao(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSucesso && (
        <div className="modal__fundo__veiculo">
          <div className="modal__sucesso__veiculo">
            <button className="modal__fechar__veiculo" onClick={() => setMostrarModalSucesso(false)}>
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
