import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog } from '@mui/material';
import transactionService from '../../services/transactionService';
import TransactionForm from './TransactionForm';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await transactionService.listTransactions({ skip: page * limit, limit });
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Failed to load transactions', err);
      setTransactions([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const openCreate = () => { setSelected(null); setFormOpen(true); };
  const openEdit = (t) => { setSelected(t); setFormOpen(true); };

  const handleFormClose = (refresh) => { setFormOpen(false); setSelected(null); if (refresh) fetch(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Transactions</Typography>
        <Button variant="contained" onClick={openCreate}>Add Transaction</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Renewals</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.transaction_id}</TableCell>
                <TableCell>{t.member_id}</TableCell>
                <TableCell>{t.book_id}</TableCell>
                <TableCell>{t.issue_date}</TableCell>
                <TableCell>{t.due_date}</TableCell>
                <TableCell>{t.return_date || '-'}</TableCell>
                <TableCell>{t.renewal_count}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(t)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => handleFormClose(false)} maxWidth="md" fullWidth>
        <TransactionForm transaction={selected} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
