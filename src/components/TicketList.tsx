import { Ticket } from '../lib/supabase';
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  onDelete: (id: string) => void;
}

const priorityTitles = {
  BAIXA: 'Prioridade Baixa',
  MEDIA: 'Prioridade Média',
  ALTA: 'Prioridade Alta',
};

const priorityHeaderColors = {
  BAIXA: 'bg-gradient-to-r from-green-500 to-green-600',
  MEDIA: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
  ALTA: 'bg-gradient-to-r from-red-500 to-red-600',
};

export default function TicketList({ tickets, priority, onDelete }: TicketListProps) {
  const filteredTickets = tickets.filter((t) => t.prioridade === priority);

  return (
    <div className="flex-1 min-w-[320px]">
      <div
        className={`${priorityHeaderColors[priority]} text-white px-6 py-4 rounded-t-xl shadow-md`}
      >
        <h2 className="text-xl font-bold">{priorityTitles[priority]}</h2>
        <p className="text-sm opacity-90 mt-1">{filteredTickets.length} ticket(s)</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-b-xl shadow-md min-h-[400px]">
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Nenhum ticket nesta categoria</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
