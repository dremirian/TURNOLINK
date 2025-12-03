import { FileDown } from 'lucide-react';
import { Ticket } from '../lib/supabase';

interface ExportPDFProps {
  tickets: Ticket[];
}

export default function ExportPDF({ tickets }: ExportPDFProps) {
  const generatePDFContent = () => {
    const now = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e40af;
            margin: 0;
          }
          .date {
            text-align: right;
            color: #666;
            font-size: 12px;
            margin-bottom: 20px;
          }
          .ticket {
            margin-bottom: 25px;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            page-break-inside: avoid;
          }
          .ticket-priority {
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .priority-baixa {
            background-color: #22c55e;
            color: white;
          }
          .priority-media {
            background-color: #eab308;
            color: white;
          }
          .priority-alta {
            background-color: #ef4444;
            color: white;
          }
          .ticket-field {
            margin: 8px 0;
          }
          .field-label {
            font-weight: bold;
            color: #374151;
          }
          .field-value {
            color: #4b5563;
            margin-left: 5px;
          }
          .separator {
            border-bottom: 1px solid #e5e7eb;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 11px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TurnoLink | REPASSE DE TICKETS</h1>
        </div>
        <div class="date">Gerado em: ${now}</div>
    `;

    const sortedTickets = [...tickets].sort((a, b) => {
      const priorityOrder = { ALTA: 0, MEDIA: 1, BAIXA: 2 };
      return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
    });

    sortedTickets.forEach((ticket) => {
      html += `
        <div class="ticket">
          <div class="ticket-priority priority-${ticket.prioridade.toLowerCase()}">
            PRIORIDADE: ${ticket.prioridade}
          </div>
          <div class="ticket-field">
            <span class="field-label">CLIENTE:</span>
            <span class="field-value">${ticket.cliente}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">TICKET / ITOP:</span>
            <span class="field-value">${ticket.ticket_itop}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">OBSERVAÇÃO:</span>
            <span class="field-value">${ticket.observacao || 'N/A'}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">RESPONSÁVEL:</span>
            <span class="field-value">${ticket.responsavel}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">STATUS:</span>
            <span class="field-value">${ticket.status}</span>
          </div>
        </div>
      `;
    });

    html += `
        <div class="footer">
          Gerado automaticamente pelo sistema de repasse
        </div>
      </body>
      </html>
    `;

    return html;
  };

  const handleExport = () => {
    if (tickets.length === 0) {
      alert('Nenhum ticket disponível para exportar');
      return;
    }

    const htmlContent = generatePDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repasse_tickets_${new Date().getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 transition shadow-md"
    >
      <FileDown size={20} />
      Exportar Relatório (HTML)
    </button>
  );
}
