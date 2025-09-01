import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchInvoices } from '../features/invoices/invoicesSlice';

const InvoiceSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: invoices, loading, error } = useAppSelector((state) => state.invoices);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      dispatch(fetchInvoices({ start_date: startDate, end_date: endDate }));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:{' '}
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            aria-label="Start Date"
          />
        </label>
        <label>
          End Date:{' '}
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            aria-label="End Date"
          />
        </label>
        <button type="submit" disabled={loading === 'pending'}>
          {loading === 'pending' ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {invoices.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Invoice Number</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Active</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.invoice_number}</td>
                <td>{inv.total}</td>
                <td>{inv.invoice_date}</td>
                <td>{inv.status}</td>
                <td>{inv.active ? 'Yes' : 'No'}</td>
                <td><a href={inv.url} target="_blank" rel="noopener noreferrer">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {loading === 'succeeded' && invoices.length === 0 && <p>No invoices found for this range.</p>}
    </div>
  );
};

export default InvoiceSearch;
