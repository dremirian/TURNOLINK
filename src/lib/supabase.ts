import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'tickets_data';

export interface Ticket {
  id: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  cliente: string;
  ticket_itop: string;
  observacao: string;
  responsavel: string;
  status: 'AGUARDANDO' | 'EM ANDAMENTO' | 'CONCLUÍDO';
  created_at: string;
  updated_at: string;
}

export const storage = {
  loadTickets: (): Ticket[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tickets from storage:', error);
      return [];
    }
  },

  saveTickets: (tickets: Ticket[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets to storage:', error);
    }
  },

  addTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Ticket => {
    const tickets = storage.loadTickets();
    const newTicket: Ticket = {
      ...ticket,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tickets.push(newTicket);
    storage.saveTickets(tickets);
    return newTicket;
  },

  deleteTicket: (id: string): void => {
    const tickets = storage.loadTickets();
    const filtered = tickets.filter((t) => t.id !== id);
    storage.saveTickets(filtered);
  },

  updateTicket: (id: string, updates: Partial<Ticket>): void => {
    const tickets = storage.loadTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index !== -1) {
      tickets[index] = {
        ...tickets[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      storage.saveTickets(tickets);
    }
  },
};
