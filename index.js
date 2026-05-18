require("dotenv").config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(express.json());


// =====================
// ENV VARIABLES
// =====================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


// Safety check (IMPORTANT)
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in .env file");
}


// =====================
// SUPABASE CLIENT
// =====================
const supabase = createClient(supabaseUrl, supabaseKey);


// =====================
// HOME ROUTE
// =====================
app.get('/', (req, res) => {
    res.json({
        message: 'Expense Tracker API Running'
    });
});


// =====================
// GET ALL EXPENSES
// =====================
app.get('/expenses', async (req, res) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});


// =====================
// GET SINGLE EXPENSE
// =====================
app.get('/expenses/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});


// =====================
// ADD EXPENSE
// =====================
app.post('/expenses', async (req, res) => {
    const { amount, category, note } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .insert([
            { amount, category, note }
        ])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});


// =====================
// UPDATE EXPENSE
// =====================
app.put('/expenses/:id', async (req, res) => {
    const id = req.params.id;
    const { amount, category, note } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .update({ amount, category, note })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});


// =====================
// DELETE EXPENSE
// =====================
app.delete('/expenses/:id', async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({
        message: 'Expense deleted successfully',
        data
    });
});


// =====================
// START SERVER
// =====================
module.exports = app;