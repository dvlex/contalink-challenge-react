import React, { useState } from 'react';
import { format } from "date-fns"
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchInvoices } from '../features/invoices/invoicesSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';

const InvoiceSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: invoices, loading, error } = useAppSelector((state) => state.invoices);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      dispatch(fetchInvoices({ 
        start_date: startDate ? startDate.toISOString() : new Date().toISOString(), 
        end_date: endDate ? endDate.toISOString() : new Date().toISOString()
      }));
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-row justify-around">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                        >
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar
                        mode="single"
                        required={true}
                        selected={startDate || undefined}
                        onSelect={setStartDate}
                        />
                    </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">End Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                            >
                            {endDate ? format(endDate, "dd/MM/yyyy") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                            mode="single"
                            required={true}
                            selected={endDate || undefined}
                            onSelect={setEndDate}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {/* Submit Button */}
            <Button type="submit" disabled={loading === 'pending'}>
                {loading === 'pending' ? 'Loading...' : 'Submit'}
            </Button>
        </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {invoices.length > 0 && (
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableHead>Id</TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <tbody aria-hidden="true" className="table-row h-2"></tbody>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            {invoices.map(inv => (
              <TableRow key={inv.id}
              className="odd:bg-muted/5 odd:hover:bg-muted/50 border-none hover:bg-muted/15">
                <TableCell className="py-2.5 text-left font-medium">{inv.id}</TableCell>
                <TableCell className="py-2.5 text-left">{inv.invoice_number}</TableCell>
                <TableCell className="py-2.5 text-left">
                        {Number(inv.total).toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                            minimumFractionDigits: 2,
                        })}
                </TableCell>
                <TableCell className="py-2.5 text-left">
                    {new Date(inv.invoice_date).toLocaleDateString('es-MX')}
                </TableCell>
                <TableCell className="py-2.5 text-left">{inv.status}</TableCell>
                <TableCell className="py-2.5 text-left">{inv.active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {loading === 'succeeded' && invoices.length === 0 && <p>No invoices found for this range.</p>}
    </div>
  );
};

export default InvoiceSearch;
