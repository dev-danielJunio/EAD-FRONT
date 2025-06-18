import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

// Tipagem da Unidade
type Unidade = {
  codigo: number;
  nomeUnidade: string;
  endereco: string;
  telefone: number;
  bibliotecaria_responsavel: number;
};

const BibliotecaApp = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddBibliotecaria, setShowAddBibliotecaria] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    nomeUnidade: '',
    endereco: '',
    telefone: '',
    bibliotecaria_responsavel: ''
  });

  const [bibliotecariaForm, setBibliotecariaForm] = useState({
    matricula: '',
    nome: ''
  });

  const API_BASE = 'http://localhost:8080/biblioteca/unidades';
  const API_BIBLIO = 'http://localhost:8080/biblioteca/bibliotecarios';

  const carregarUnidades = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (response.ok) {
        const data = await response.json();
        setUnidades(data);
      }
    } catch (error: any) {
      alert('Erro ao carregar unidades: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const adicionarUnidade = async () => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          codigo: parseInt(formData.codigo),
          telefone: parseInt(formData.telefone),
          bibliotecaria_responsavel: parseInt(formData.bibliotecaria_responsavel)
        })
      });

      if (response.ok) {
        await carregarUnidades();
        setShowAddForm(false);
        limparFormulario();
        alert('Unidade adicionada com sucesso!');
      } else {
        alert('Erro ao adicionar unidade');
      }
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const adicionarBibliotecaria = async () => {
    try {
      const response = await fetch(API_BIBLIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: parseInt(bibliotecariaForm.matricula),
          nome: bibliotecariaForm.nome
        })
      });

      if (response.ok) {
        alert('Bibliotecária adicionada com sucesso!');
        setBibliotecariaForm({ matricula: '', nome: '' });
        setShowAddBibliotecaria(false);
      } else {
        alert('Erro ao adicionar bibliotecária');
      }
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const atualizarUnidade = async (codigo: number) => {
    try {
      const response = await fetch(`${API_BASE}/${codigo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          codigo: parseInt(codigo.toString()),
          telefone: parseInt(formData.telefone),
          bibliotecaria_responsavel: parseInt(formData.bibliotecaria_responsavel)
        })
      });

      if (response.ok) {
        await carregarUnidades();
        setEditingId(null);
        limparFormulario();
        alert('Unidade atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar unidade');
      }
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const excluirUnidade = async (codigo: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        const response = await fetch(`${API_BASE}/${codigo}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await carregarUnidades();
          alert('Unidade excluída com sucesso!');
        } else {
          alert('Erro ao excluir unidade');
        }
      } catch (error: any) {
        alert('Erro: ' + error.message);
      }
    }
  };

  const iniciarEdicao = (unidade: Unidade) => {
    setFormData({
      codigo: unidade.codigo.toString(),
      nomeUnidade: unidade.nomeUnidade,
      endereco: unidade.endereco,
      telefone: unidade.telefone.toString(),
      bibliotecaria_responsavel: unidade.bibliotecaria_responsavel.toString()
    });
    setEditingId(unidade.codigo);
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setShowAddForm(false);
    setShowAddBibliotecaria(false);
    limparFormulario();
  };

  const limparFormulario = () => {
    setFormData({
      codigo: '',
      nomeUnidade: '',
      endereco: '',
      telefone: '',
      bibliotecaria_responsavel: ''
    });
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="card">
          <h1>Sistema de Biblioteca</h1>
          <p>Gerenciamento de Unidades de Atendimento</p>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowAddForm(true)} className="btn-blue">
            <Plus size={20} /> Nova Unidade
          </button>
          <button onClick={() => setShowAddBibliotecaria(true)} className="btn-purple">
            <Plus size={20} /> Nova Bibliotecária
          </button>
        </div>

        {showAddForm && (
          <div className="card">
            <h2>Adicionar Nova Unidade</h2>
            <div className="form-grid">
              <input type="number" placeholder="Código" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} />
              <input type="text" placeholder="Nome da Unidade" value={formData.nomeUnidade} onChange={(e) => setFormData({ ...formData, nomeUnidade: e.target.value })} />
              <input type="text" placeholder="Endereço" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
              <input type="number" placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
              <input type="number" placeholder="Bibliotecária Responsável" value={formData.bibliotecaria_responsavel} onChange={(e) => setFormData({ ...formData, bibliotecaria_responsavel: e.target.value })} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={adicionarUnidade} className="btn-green">
                <Save size={16} /> Salvar
              </button>
              <button onClick={cancelarEdicao} className="btn-gray">
                <X size={16} /> Cancelar
              </button>
            </div>
          </div>
        )}

        {showAddBibliotecaria && (
          <div className="card">
            <h2>Adicionar Nova Bibliotecária</h2>
            <div className="form-grid">
              <input type="number" placeholder="Matrícula" value={bibliotecariaForm.matricula} onChange={(e) => setBibliotecariaForm({ ...bibliotecariaForm, matricula: e.target.value })} />
              <input type="text" placeholder="Nome" value={bibliotecariaForm.nome} onChange={(e) => setBibliotecariaForm({ ...bibliotecariaForm, nome: e.target.value })} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={adicionarBibliotecaria} className="btn-green">
                <Save size={16} /> Salvar
              </button>
              <button onClick={cancelarEdicao} className="btn-gray">
                <X size={16} /> Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <h2>Unidades de Atendimento</h2>
          {loading ? (
            <div><div className="loader"></div><p className="text-center">Carregando...</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th>Bibliotecária</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {unidades.map((unidade) => (
                  <tr key={unidade.codigo}>
                    {editingId === unidade.codigo ? (
                      <>
                        <td>{unidade.codigo}</td>
                        <td><input type="text" value={formData.nomeUnidade} onChange={(e) => setFormData({ ...formData, nomeUnidade: e.target.value })} /></td>
                        <td><input type="text" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} /></td>
                        <td><input type="number" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} /></td>
                        <td><input type="number" value={formData.bibliotecaria_responsavel} onChange={(e) => setFormData({ ...formData, bibliotecaria_responsavel: e.target.value })} /></td>
                        <td>
                          <button onClick={() => atualizarUnidade(unidade.codigo)} className="btn-green"><Save size={16} /></button>
                          <button onClick={cancelarEdicao} className="btn-gray"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{unidade.codigo}</td>
                        <td>{unidade.nomeUnidade}</td>
                        <td>{unidade.endereco}</td>
                        <td>{unidade.telefone}</td>
                        <td>{unidade.bibliotecaria_responsavel}</td>
                        <td>
                          <button onClick={() => iniciarEdicao(unidade)} className="btn-blue"><Edit2 size={16} /></button>
                          <button onClick={() => excluirUnidade(unidade.codigo)} className="btn-red"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibliotecaApp;