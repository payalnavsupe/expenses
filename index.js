require("dotenv").config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(express.json());

app.use(express.static('public'));


// =====================
// ENV VARIABLES
// =====================

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseKey = process.env.SUPABASE_KEY;


// =====================
// SUPABASE CLIENT
// =====================

const supabase = createClient(supabaseUrl, supabaseKey);


// =====================
// HOME ROUTE
// =====================

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/login.html');

});


// =====================
// REGISTER API
// =====================

app.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                username,
                email,
                password
            }
        ])
        .select();

    if (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    res.json({
        message: "Registration Successful",
        data
    });

});


// =====================
// LOGIN API
// =====================

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password);

    if (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    if (data.length === 0) {

        return res.status(401).json({
            message: "Invalid Email or Password"
        });

    }

    res.json({
        message: "Login Successful",
        user: data[0]
    });

});


// =====================
// GET EXPENSES
// =====================

app.get('/expenses', async (req, res) => {

    const { data, error } = await supabase
        .from('expenses')
        .select('*');

    if (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    res.json(data);

});


// =====================
// ADD EXPENSE
// =====================

app.post('/expenses', async (req, res) => {

    const { amount, category, note, user_id } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .insert([
            {
                amount,
                category,
                note,
                user_id
            }
        ])
        .select();

    if (error) {

        return res.status(500).json({
            error: error.message
        });

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
        .eq('id', id);

    if (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    res.json({
        message: "Expense Deleted",
        data
    });

});


// =====================
// EXPORT APP FOR VERCEL
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});