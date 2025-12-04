import { useState, FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { storage } from '../lib/supabase';

interface TicketFormProps {
  onTicketAdded: () => void;
}

export default function TicketForm({ onTicketAdded }: TicketFormProps) {
  const [formData, setFormData] = useState({
    cliente: '',
    ticket_itop: '',
    observacao: '',
    responsavel: '',
	linkcall: '',
	datahora: '',
	instancia: '',
    status: 'AGUARDANDO' as const,
    prioridade: 'MEDIA' as const,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      storage.addTicket(formData);

      setFormData({
        cliente: '',
        ticket_itop: '',
        observacao: '',
        responsavel: '',
        linkcall: '',
    	datahora: '',
	    instancia: '',
        status: 'AGUARDANDO',
        prioridade: 'MEDIA',
      });

      onTicketAdded();
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('Erro ao adicionar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-600" />
        Novo Ticket
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cliente *
          </label>
          <input
            type="text"
            required
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nome do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ticket Itop *
          </label>
          <input
            type="text"
            required
            value={formData.ticket_itop}
            onChange={(e) => setFormData({ ...formData, ticket_itop: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Número do ticket"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Responsável *
          </label>
          <input
            type="text"
            required
            value={formData.responsavel}
            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nome do responsável"
          />
        </div>
		
		 <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Link Call *
          </label>
          <input
            type="text"
            required
            value={formData.linkcall}
            onChange={(e) => setFormData({ ...formData, linkcall: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Link da Call"
          />
        </div>
		
		<div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data e Hora *
          </label>
          <input
            type="text"
            required
            value={formData.datahora}
            onChange={(e) => setFormData({ ...formData, datahora: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Data e Hora"
          />
        </div>
		
		<div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instância *
          </label>
          <input
            type="text"
            required
            value={formData.instancia}
            onChange={(e) => setFormData({ ...formData, instancia: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Instância"
          />
        </div>
		

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prioridade *
          </label>
          <select
            value={formData.prioridade}
            onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="AGUARDANDO">Aguardando</option>
            <option value="EM ANDAMENTO">Em Andamento</option>
            <option value="CONCLUÍDO">Concluído</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observação
          </label>
          <textarea
            value={formData.observacao}
            onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            rows={3}
            placeholder="Detalhes adicionais sobre o ticket..."
          />
        </div>
		
		
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adicionando...' : 'Adicionar Ticket'}
      </button>
    </form>
  );
}
