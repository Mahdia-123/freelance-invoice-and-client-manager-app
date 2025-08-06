let clients = JSON.parse(localStorage.getItem("clients")) || [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

const clientForm = document.getElementById("clientForm");
const clientsList = document.getElementById("clientsList");
const invoiceForm = document.getElementById("invoiceForm");
const invoicesList = document.getElementById("invoicesList");
const invoiceClientSelect = document.getElementById("invoiceClient");

function saveData() {
  localStorage.setItem("clients", JSON.stringify(clients));
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

function renderClients() {
  if (clients.length) {
    clientsList.innerHTML = clients
      .map((c, i) => {
        let companyText;
        if (c.company) {
          companyText = c.company;
        } else {
          companyText = `<div>
  <p style="opacity: 0.6; color:red;">No Company</p>
</div>`;
        }
        let phoneText;
        if (c.phone) {
          phoneText = c.phone;
        } else {
          phoneText = `<div>
  <p style="opacity: 0.6; color:red;">No Phone number</p>
</div>`;
        }
        return `  <div class="client">
            <div class="name d-flex justify-content-between">
              <div>Name:</div>
              <div>${c.name}</div>
            </div>
            <div class="name d-flex justify-content-between">
              <div>Company name:</div>
              <div>${companyText}</div>
            </div>
            <div class="email d-flex justify-content-between">
              <div>Email address:</div>
              <div>${c.email}</div>
            </div>
            <div class="phone d-flex justify-content-between">
              <div>Phone number</div>
              <div>${phoneText}</div>
            </div>
          </div>
         <div class="button">   <button onClick="deleteClient(${i})" class="btn-client">Delete</button></div>
        </div>`;
      })
      .join("");
  } else {
    clientsList.innerHTML = " <p> No client yet.</p>";
  }

  if (clients.length) {
    let options = '<option value="">Select Client</option>';
    for (let i = 0; i < clients.length; i++) {
      options += `<option value="${i}">${clients[i].name}</option>`;
    }
    invoiceClientSelect.innerHTML = options;
  } else {
    invoiceClientSelect.innerHTML = '<option value="">Select Client</option>';
  }
}
function renderInvoices() {
  if (invoices.length) {
    invoicesList.innerHTML = invoices
      .map((inv, i) => {
        const client = clients[inv.clientIndex];
        const clientName = client
          ? client.name
          : `<div>
  <p style="opacity: 0.6; color:red;">Deleted Client</p>
</div>`;

        return ` 
        <div class="invoices">
          <div class="name d-flex justify-content-between">
            <div>Client Name:</div>
            <div>${clientName}</div>
          </div>
          <div class="amount d-flex justify-content-between">
            <div>Amount:</div>
            <div>$ ${inv.amount.toFixed(2)}</div>
          </div>
          <div class="phone d-flex justify-content-between">
            <div>Due:</div>
            <div>${inv.dueDate}</div>
          </div>
          <div class="phone d-flex justify-content-between">
            <div>Status:</div>
            <div>${inv.status}</div>
          </div>
          <div class="button">
            <button onClick="deleteInvoice(${i})" class="btn-client">Delete</button>
          </div>
        </div>`;
      })
      .join("");
  } else {
    invoicesList.innerHTML = "<p>NO invoice yet</p>";
  }
}

clientForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("clientName").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const company = document.getElementById("clientCompany").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();

  if (!name || !email) {
    alert("Name and email are required!");
    return;
  }

  clients.push({ name, email, company, phone });
  saveData();
  renderClients();
  clientForm.reset();
});

invoiceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const clientIndex = invoiceClientSelect.value;
  const amount = parseFloat(document.getElementById("invoiceAmount").value);
  const dueDate = document.getElementById("invoiceDueDate").value;
  const status = document.getElementById("invoiceStatus").value;

  if (clientIndex === "") {
    alert("Select a client");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }
  if (!dueDate) {
    alert("Select a due date");
    return;
  }

  invoices.push({ clientIndex: Number(clientIndex), amount, dueDate, status });
  saveData();
  renderInvoices();
  invoiceForm.reset();
});

window.deleteClient = function (index) {
  if (
    confirm(
      "Delete this client? All their invoices will remain but show 'Deleted Client'."
    )
  ) {
    clients.splice(index, 1);
    saveData();
    renderClients();
    renderInvoices();
  }
};

window.deleteInvoice = function (index) {
  if (confirm("Delete this invoice?")) {
    invoices.splice(index, 1);
    saveData();
    renderInvoices();
  }
};

renderClients();
renderInvoices();
