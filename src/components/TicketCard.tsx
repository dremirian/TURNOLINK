import { Clock, User, FileText, Trash2 } from 'lucide-react';
import { Ticket } from '../lib/supabase';

interface TicketCardProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
}

const priorityColors = {
  BAIXA: 'bg-green-50 border-green-300 text-green-800',
  MEDIA: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  ALTA: 'bg-red-50 border-red-300 text-red-800',
};

const priorityBadgeColors = {
  BAIXA: 'bg-green-500 text-white',
  MEDIA: 'bg-yellow-500 text-white',
  ALTA: 'bg-red-500 text-white',
};

const statusColors = {
  AGUARDANDO: 'bg-gray-100 text-gray-700',
  'EM ANDAMENTO': 'bg-blue-100 text-blue-700',
  'CONCLUÍDO': 'bg-emerald-100 text-emerald-700',
};

export default function TicketCard({ ticket, onDelete }: TicketCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`border-2 rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
        priorityColors[ticket.prioridade]
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            priorityBadgeColors[ticket.prioridade]
          }`}
        >
          {ticket.prioridade}
        </span>
        <button
          onClick={() => onDelete(ticket.id)}
          className="text-gray-400 hover:text-red-500 transition"
          title="Excluir ticket"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{ticket.cliente}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <FileText size={14} />
            Ticket: {ticket.ticket_itop}
          </p>
        </div>

        {ticket.observacao && (
          <p className="text-sm text-gray-700 bg-white bg-opacity-60 p-3 rounded-lg">
            {ticket.observacao}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={14} />
          <span className="font-medium">{ticket.responsavel}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[ticket.status]
            }`}
          >
            {ticket.status}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {formatDate(ticket.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
