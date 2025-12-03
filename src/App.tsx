import { useEffect, useState } from 'react';
import { Ticket as TicketIcon, RefreshCw } from 'lucide-react';
import { storage, Ticket } from './lib/supabase';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ExportPDF from './components/ExportPDF';
import logo from './assets/logo.png';


function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = () => {
    try {
      const data = storage.loadTickets();
      const sorted = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTickets(sorted);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ticket?')) return;

    try {
      storage.deleteTicket(id);
      loadTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Erro ao excluir ticket');
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <img src={logo} alt="Logo" className="w-20 h-20" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    <span className="text-blue-600">T</span>urno
                    <span className="text-blue-600">L</span>ink
                  </h1>

                  <p className="text-gray-600 mt-1">
                    Gerencie e acompanhe seus tickets de suporte
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={loadTickets}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  Atualizar
                </button>
                <ExportPDF tickets={tickets} />
              </div>
            </div>
          </div>
        </header>

        <TicketForm onTicketAdded={loadTickets} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando tickets...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <TicketList tickets={tickets} priority="ALTA" onDelete={handleDelete} />
            <TicketList tickets={tickets} priority="MEDIA" onDelete={handleDelete} />
            <TicketList tickets={tickets} priority="BAIXA" onDelete={handleDelete} />
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <TicketIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">Nenhum ticket cadastrado ainda</p>
            <p className="text-gray-500 mt-2">
              Use o formulário acima para adicionar seu primeiro ticket
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
