/*
  # Create TEXPERIA 2026 Event Registrations Table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key) - Unique registration identifier
      - `full_name` (text) - Participant's full name
      - `mobile_number` (text) - Contact number
      - `email` (text) - Email address
      - `college_name` (text) - Name of college/institution
      - `department` (text) - Department of study
      - `participation_day` (text) - Day 1 or Day 2
      - `selected_events` (jsonb) - Array of selected events with details
      - `total_participants` (integer) - Total number of participants in team
      - `payment_amount` (integer) - Total payment amount
      - `upi_transaction_id` (text) - UPI transaction reference
      - `payment_screenshot_url` (text) - URL to uploaded payment proof
      - `created_at` (timestamptz) - Registration timestamp
      
  2. Security
    - Enable RLS on `registrations` table
    - Add policy for public insert access (registration form)
    - Add policy for authenticated admin read access
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  email text NOT NULL,
  college_name text NOT NULL,
  department text NOT NULL,
  participation_day text NOT NULL,
  selected_events jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_participants integer NOT NULL DEFAULT 1,
  payment_amount integer NOT NULL,
  upi_transaction_id text NOT NULL,
  payment_screenshot_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public registration submissions"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);