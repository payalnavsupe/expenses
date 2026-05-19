const API_URL = "http://localhost:3000/expenses";


// ==========================
// GET ALL EXPENSES
// ==========================

async function getExpenses() {

    const response = await fetch(API_URL);

    const data = await response.json();

    let rows = "";

    let total = 0;

    let categories = [];


    data.forEach(expense => {

        total += Number(expense.amount);

        if (!categories.includes(expense.category)) {
            categories.push(expense.category);
        }

        rows += `
            <tr>
                <td>${expense.id}</td>
                <td>₹ ${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.note}</td>
                <td>
                    <button 
                        class="btn btn-sm btn-danger"
                        onclick="deleteExpense(${expense.id})"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });


    // TABLE

    document.getElementById("expenseTable").innerHTML = rows;


    // DASHBOARD CARDS

    document.getElementById("totalExpenses").innerText = `₹ ${total}`;

    document.getElementById("totalCategories").innerText = categories.length;

    document.getElementById("monthlyExpenses").innerText = `₹ ${total}`;
}



// ==========================
// ADD EXPENSE
// ==========================

async function addExpense() {

    const amount = document.getElementById("amount").value;

    const category = document.getElementById("category").value;

    const note = document.getElementById("note").value;


    await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            amount,
            category,
            note
        })

    });


    // CLEAR INPUTS

    document.getElementById("amount").value = "";

    document.getElementById("category").value = "";

    document.getElementById("note").value = "";


    // RELOAD

    getExpenses();
}



// ==========================
// DELETE EXPENSE
// ==========================

async function deleteExpense(id) {

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    });

    getExpenses();
}



// ==========================
// LOGOUT
// ==========================

function logoutUser() {

    alert("Logged out successfully");

    window.location.href = "login.html";
}



// ==========================
// PAGE LOAD
// ==========================

getExpenses();