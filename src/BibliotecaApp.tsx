import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, List } from 'lucide-react';

// Tipagem
type Unidade = {
  codigo: number;
  nomeUnidade: string;
  endereco: string;
  telefone: number;
  bibliotecaria_responsavel: number;
  nome_bibliotecaria: string;
};

type Bibliotecaria = {
  matricula: number;
  nome: string;
};

const BibliotecaApp = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [bibliotecarias, setBibliotecarias] = useState<Bibliotecaria[]>([]);
  const [showList, setShowList] = useState<'unidades' | 'bibliotecarias'>('unidades');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddBibliotecaria, setShowAddBibliotecaria] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBibliotecaria, setEditingBibliotecaria] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nomeUnidade: '',
    endereco: '',
    telefone: '',
    bibliotecaria_responsavel: '',
  });
  const [editBibliotecariaForm, setEditBibliotecariaForm] = useState({
    nome: ''
  });

  const [codigoUnidade, setCodigoUnidade] = useState('');
  const [nomeUnidade, setNomeUnidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bibliotecariaResp, setBibliotecariaResp] = useState<number | ''>('');

  const [matriculaBibliotecaria, setMatriculaBibliotecaria] = useState('');
  const [nomeBibliotecaria, setNomeBibliotecaria] = useState('');

  const API_BASE = 'http://localhost:8080/biblioteca/unidades';
  const API_BIBLIO = 'http://localhost:8080/biblioteca/bibliotecarios';

  useEffect(() => {
    carregarUnidades();
    carregarBibliotecarias();
  }, []);

  const carregarUnidades = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUnidades(data);
    } catch {
      alert('Erro ao carregar unidades.');
    }
  };

  const carregarBibliotecarias = async () => {
    try {
      const res = await fetch(API_BIBLIO);
      const data = await res.json();
      setBibliotecarias(data);
    } catch {
      alert('Erro ao carregar bibliotecárias.');
    }
  };

  const adicionarUnidade = async () => {
    if (!codigoUnidade || !nomeUnidade || !endereco || !telefone || bibliotecariaResp === '') {
      alert('Preencha todos os campos da unidade!');
      return;
    }
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: Number(codigoUnidade),
          nomeUnidade,
          endereco,
          telefone: Number(telefone),
          bibliotecaria_responsavel: Number(bibliotecariaResp),
        }),
      });
      if (!res.ok) throw new Error();
      await carregarUnidades();
      setShowAddForm(false);
      setCodigoUnidade('');
      setNomeUnidade('');
      setEndereco('');
      setTelefone('');
      setBibliotecariaResp('');
    } catch {
      alert('Erro ao adicionar unidade.');
    }
  };

  const adicionarBibliotecaria = async () => {
    if (!matriculaBibliotecaria || !nomeBibliotecaria) {
      alert('Preencha todos os campos da bibliotecária!');
      return;
    }
    try {
      const res = await fetch(API_BIBLIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: Number(matriculaBibliotecaria),
          nome: nomeBibliotecaria,
        }),
      });
      if (!res.ok) throw new Error();
      await carregarBibliotecarias();
      setShowAddBibliotecaria(false);
      setMatriculaBibliotecaria('');
      setNomeBibliotecaria('');
    } catch {
      alert('Erro ao adicionar bibliotecária.');
    }
  };

  const excluirUnidade = async (codigo: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
      try {
        const res = await fetch(`${API_BASE}/${codigo}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        carregarUnidades();
      } catch {
        alert('Erro ao excluir unidade. Verifique se ela não está vinculada a outras entidades.');
      }
    }
  };

  const excluirBibliotecaria = async (matricula: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta bibliotecária?')) {
      try {
        const res = await fetch(`${API_BIBLIO}/${matricula}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        carregarBibliotecarias();
      } catch {
        alert('Erro ao excluir bibliotecária. Verifique se ela não está vinculada a uma unidade.');
      }
    }
  };

  const iniciarEdicaoUnidade = (u: Unidade) => {
    setEditingId(u.codigo);
    setEditForm({
      nomeUnidade: u.nomeUnidade,
      endereco: u.endereco,
      telefone: u.telefone.toString(),
      bibliotecaria_responsavel: u.bibliotecaria_responsavel.toString(),
    });
  };

  const salvarEdicaoUnidade = async (codigo: number) => {
    if (!window.confirm('Deseja realmente salvar as alterações desta unidade?')) return;
    try {
      const res = await fetch(`${API_BASE}/${codigo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo,
          nomeUnidade: editForm.nomeUnidade,
          endereco: editForm.endereco,
          telefone: Number(editForm.telefone),
          bibliotecaria_responsavel: Number(editForm.bibliotecaria_responsavel),
        }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      await carregarUnidades();
      alert('Unidade alterada com sucesso!');
    } catch {
      alert('Erro ao salvar alterações.');
    }
  };
  
  const iniciarEdicaoBibliotecaria = (b: Bibliotecaria) => {
    setEditingBibliotecaria(b.matricula);
    setEditBibliotecariaForm({ nome: b.nome });
  };

  const salvarEdicaoBibliotecaria = async (matricula: number) => {
    if (!window.confirm('Deseja realmente salvar as alterações desta bibliotecária?')) return;
    try {
      const res = await fetch(`${API_BIBLIO}/${matricula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula,
          nome: editBibliotecariaForm.nome,
        }),
      });
      if (!res.ok) throw new Error();
      setEditingBibliotecaria(null);
      await carregarBibliotecarias();
      await carregarUnidades(); 
      alert('Bibliotecária alterada com sucesso!');
    } catch {
      alert('Erro ao salvar bibliotecária.');
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="card">
          <h1>Sistema de Biblioteca</h1>
          <h2>Daniel Junio Barbosa Souza Filho</h2>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => { setShowList('unidades'); setShowAddForm(false); setShowAddBibliotecaria(false); }} className="btn-blue">
            <List size={16} /> Ver Unidades
          </button>
          <button onClick={() => { setShowList('bibliotecarias'); setShowAddForm(false); setShowAddBibliotecaria(false); }} className="btn-purple">
            <List size={16} /> Ver Bibliotecárias
          </button>
          <button onClick={() => {
            if (showList === 'unidades') {
              setShowAddForm(true);
              setShowAddBibliotecaria(false);
            } else {
              setShowAddForm(false);
              setShowAddBibliotecaria(true);
            }
          }} className="btn-green">
            <Plus size={16} /> {showList === 'unidades' ? 'Nova Unidade' : 'Nova Bibliotecária'}
          </button>
        </div>

        {showAddForm && (
          <div className="card">
            <h3>Nova Unidade</h3>
            <input type="number" placeholder="Código" value={codigoUnidade} onChange={(e) => setCodigoUnidade(e.target.value)} />
            <input type="text" placeholder="Nome" value={nomeUnidade} onChange={(e) => setNomeUnidade(e.target.value)} />
            <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            <select value={bibliotecariaResp} onChange={(e) => setBibliotecariaResp(Number(e.target.value))}>
              <option value="">Selecione a Bibliotecária Responsável</option>
              {bibliotecarias.map((b) => (
                <option key={b.matricula} value={b.matricula}>{b.nome}</option>
              ))}
            </select>
            <button className="btn-green" onClick={adicionarUnidade}>Salvar</button>
            <button className="btn-red" onClick={() => setShowAddForm(false)}>Cancelar</button>
          </div>
        )}

        {showAddBibliotecaria && (
          <div className="card">
            <h3>Nova Bibliotecária</h3>
            <input type="number" placeholder="Matrícula" value={matriculaBibliotecaria} onChange={(e) => setMatriculaBibliotecaria(e.target.value)} />
            <input type="text" placeholder="Nome" value={nomeBibliotecaria} onChange={(e) => setNomeBibliotecaria(e.target.value)} />
            <button className="btn-green" onClick={adicionarBibliotecaria}>Salvar</button>
            <button className="btn-red" onClick={() => setShowAddBibliotecaria(false)}>Cancelar</button>
          </div>
        )}

        {showList === 'unidades' && (
          <div className="card">
            <h2>Unidades de Atendimento</h2>
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
                {unidades.map((u) => (
                  <tr key={u.codigo}>
                    <td>{u.codigo}</td>
                    {editingId === u.codigo ? (
                      <>
                        <td><input value={editForm.nomeUnidade} onChange={(e) => setEditForm({ ...editForm, nomeUnidade: e.target.value })} /></td>
                        <td><input value={editForm.endereco} onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })} /></td>
                        <td><input value={editForm.telefone} onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })} /></td>
                        <td><input value={editForm.bibliotecaria_responsavel} onChange={(e) => setEditForm({ ...editForm, bibliotecaria_responsavel: e.target.value })} /></td>
                        <td>
                          <button onClick={() => salvarEdicaoUnidade(u.codigo)} className="btn-green"><Save size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="btn-gray"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{u.nomeUnidade}</td>
                        <td>{u.endereco}</td>
                        <td>{u.telefone}</td>
                        <td>{u.nome_bibliotecaria}</td>
                        <td>
                          <button onClick={() => iniciarEdicaoUnidade(u)} className="btn-blue"><Edit2 size={16} /></button>
                          <button onClick={() => excluirUnidade(u.codigo)} className="btn-red"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showList === 'bibliotecarias' && (
          <div className="card">
            <h2>Bibliotecárias</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {bibliotecarias.map((b) => (
                  <tr key={b.matricula}>
                    <td>{b.matricula}</td>
                    {editingBibliotecaria === b.matricula ? (
                      <>
                        <td><input value={editBibliotecariaForm.nome} onChange={(e) => setEditBibliotecariaForm({ nome: e.target.value })} /></td>
                        <td>
                          <button onClick={() => salvarEdicaoBibliotecaria(b.matricula)} className="btn-green"><Save size={16} /></button>
                          <button onClick={() => setEditingBibliotecaria(null)} className="btn-gray"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{b.nome}</td>
                        <td>
                          <button onClick={() => iniciarEdicaoBibliotecaria(b)} className="btn-blue"><Edit2 size={16} /></button>
                          <button onClick={() => excluirBibliotecaria(b.matricula)} className="btn-red"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibliotecaApp;