import { FileDown } from 'lucide-react';
import { Ticket } from '../lib/supabase';
import logo from '../assets/logo.png'; // pode estar em src/assets

interface ExportPDFProps {
  tickets: Ticket[];
}

export default function ExportPDF({ tickets }: ExportPDFProps) {
  // Função que converte a logo importada em Base64
  const assetToDataURL = async (assetUrl: string): Promise<string> => {
    const res = await fetch(assetUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const generatePDFContent = (logoBase64: string) => {
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
            background: linear-gradient(to bottom right, #eff6ff, #ffffff, #eff6ff);
          }
          .header-container {
            background: #ffffff;
            border-top: 4px solid #2563eb;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 32px;
            margin-bottom: 32px;
          }
          .header-flex {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
          }
          .logo {
            width: 80px;
            height: 80px;
          }
          .title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
          }
          .title span {
            color: #2563eb;
          }
          .subtitle {
            color: #4b5563;
            margin-top: 4px;
            font-size: 14px;
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
          .priority-baixa { background-color: #22c55e; color: white; }
          .priority-media { background-color: #eab308; color: white; }
          .priority-alta  { background-color: #ef4444; color: white; }
          .ticket-field { margin: 8px 0; }
          .field-label { font-weight: bold; color: #374151; }
          .field-value { color: #4b5563; margin-left: 5px; }
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
        <div class="header-container">
          <div class="header-flex">
            <div style="display:flex; align-items:center; gap:16px;">
              <img src="${logoBase64}" alt="Logo" class="logo" />
              <div>
                <h1 class="title">
                  <span>T</span>urno<span>L</span>ink
                </h1>
                <p class="subtitle">Gerencie e acompanhe seus tickets de suporte</p>
              </div>
            </div>
          </div>
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
            <span class="field-label">LINK CALL:</span>
            <span class="field-value">${ticket.linkcall}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">DATA E HORA:</span>
            <span class="field-value">${ticket.datahora}</span>
          </div>
          <div class="ticket-field">
            <span class="field-label">INSTÂNCIA:</span>
            <span class="field-value">${ticket.instancia}</span>
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

  const handleExport = async () => {
    if (tickets.length === 0) {
      alert('Nenhum ticket disponível para exportar');
      return;
    }

    try {
      // Converte a logo importada em Base64
      const logoBase64 = await assetToDataURL(logo);

      // Gera o HTML com a logo embutida
      const htmlContent = generatePDFContent(logoBase64);

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `repasse_tickets_${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao converter logo em Base64:', err);
      alert('Não foi possível carregar a logo no relatório.');
    }
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
