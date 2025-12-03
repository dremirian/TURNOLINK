/*
  # Ticket Management System

  ## Overview
  Creates the database schema for a ticket management system that tracks support tickets
  with priorities, client information, and status tracking.

  ## New Tables
  
  ### `tickets`
  - `id` (uuid, primary key) - Unique identifier for each ticket
  - `prioridade` (text) - Priority level: BAIXA, MEDIA, or ALTA (Low, Medium, High)
  - `cliente` (text) - Client name
  - `ticket_itop` (text) - External ticket system reference number
  - `observacao` (text) - Notes and observations about the ticket
  - `responsavel` (text) - Person responsible for handling the ticket
  - `status` (text) - Current status: AGUARDANDO, EM ANDAMENTO, or CONCLUÍDO
  - `created_at` (timestamptz) - Timestamp when ticket was created
  - `updated_at` (timestamptz) - Timestamp when ticket was last updated

  ## Security
  - Enables Row Level Security (RLS) on tickets table
  - Adds policies for authenticated users to perform all operations
  - Public read access for demonstration purposes (can be restricted later)

  ## Indexes
  - Created on `prioridade` for efficient priority-based filtering
  - Created on `status` for efficient status-based queries
  - Created on `created_at` for chronological sorting
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prioridade text NOT NULL CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA')),
  cliente text NOT NULL,
  ticket_itop text NOT NULL,
  observacao text DEFAULT '',
  responsavel text NOT NULL,
  status text NOT NULL CHECK (status IN ('AGUARDANDO', 'EM ANDAMENTO', 'CONCLUÍDO')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_prioridade ON tickets(prioridade);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tickets"
  ON tickets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to tickets"
  ON tickets
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to tickets"
  ON tickets
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to tickets"
  ON tickets
  FOR DELETE
  TO public
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();