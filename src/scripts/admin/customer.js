import { validatedCustomerSchema } from '../../validation/customerSchema.js';
import { saveCustomer,loadAllCustomers } from '../../api/customerApi.js';

const customerForm = document.getElementById('customer_Form');
const customerIdElement = document.getElementById("customer_id");
const customerNameElement = document.getElementById("customer_name");
const customerContactElement = document.getElementById("customer_contact");
const customerCreditStatuslement = document.getElementById("customer_credit_status");

const customerSaveBtn = document.getElementById("btn_save_customer");
const customerUpdateBtn = document.getElementById("btn_update_customer");
const customerDeleteBtn = document.getElementById("btn_delete_customer");

const customerInputs = document.querySelectorAll('.customer-input-field');


const tblCustomers = document.getElementById("tbl_customer_body");

let isEditModeCustomer = false;

document.addEventListener('DOMContentLoaded', async function () {
    const baseUrl = await window.api.getBaseUrl();

    customerNameElement.focus();
     loadAllCustomerToTable(baseUrl,0, 8);


    customerSaveBtn.addEventListener('click', function () {
        handleSaveCustomer(baseUrl)
    });

    customerUpdateBtn.addEventListener('click', function () {
        upadateCustomer(baseUrl)
    })

    customerDeleteBtn.addEventListener('click', function () {
        deleteCustomer(baseUrl)
    });

})


customerForm.addEventListener('input', () => {
    const formData = new FormData(customerForm);
    const data = Object.fromEntries(formData.entries());

    const allFields = ['customerName', 'customerContact', 'customerCreditStatus'];
    const editModeFields = ['customerName', 'customerContact', 'customerCreditStatus'];

    const fieldsToValidate = isEditModeCustomer ? editModeFields : allFields;


    const allEmpty = fieldsToValidate.every(field => {
        if (field === 'customerCreditStatus') {
            return !data[field];
        }
        return !data[field]?.trim();
    });

    if (allEmpty) {
        allFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const container = input?.parentElement;
            if (!container) return;

            container.classList.remove('error', 'success');

            const existingIcon = container.querySelector('.validation-icon');
            if (existingIcon) existingIcon.remove();
        });

        ['btn_save_customer', 'btn_update_customer', 'btn_delete_customer'].forEach(id => {
            document.getElementById(id).disabled = true;
        });

        return;
    }

    let validationData = { ...data };

    const result = validatedCustomerSchema.safeParse(validationData);

    fieldsToValidate.forEach(field => {
        if (field === 'customerCreditStatus') return;

        const input = document.querySelector(`[name="${field}"]`);
        const container = input?.parentElement;

        if (!container) return;

        container.classList.remove('error', 'success');
        const existingIcon = container.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();

        const fieldError = result.success ? null : result.error.issues.find(i => i.path[0] === field);

        if (fieldError) {
            container.classList.add('error');

            const errorIcon = document.createElement('span');
            errorIcon.className = 'validation-icon error';
            errorIcon.textContent = '❗';
            container.appendChild(errorIcon);

        } else if (data[field] && !fieldError) {
            container.classList.add('success');

            const successIcon = document.createElement('span');
            successIcon.className = 'validation-icon success';
            successIcon.textContent = '✔';
            container.appendChild(successIcon);
        }
    });

    const isFormValid = fieldsToValidate.every(field => {
        const fieldError = result.success ? null : result.error.issues.find(i => i.path[0] === field);

        let fieldValue;
        if (field === 'customerCreditStatus') {
            fieldValue = data[field];
        } else {
            fieldValue = data[field]?.trim();
        }

        const isFieldValid = fieldValue && !fieldError;

        return isFieldValid;
    });

    if (isEditModeCustomer) {
        document.getElementById('btn_save_customer').disabled = true;
        document.getElementById('btn_update_customer').disabled = !isFormValid;
        document.getElementById('btn_delete_customer').disabled = !isFormValid;
    } else {
        document.getElementById('btn_save_customer').disabled = !isFormValid;
        document.getElementById('btn_update_customer').disabled = true;
        document.getElementById('btn_delete_customer').disabled = true;
    }
});

//------------load all data to table------------ 
async function loadAllCustomerToTable(baseUrl, page, size) {
    try {
        const customersList =await loadAllCustomers(baseUrl,page,size)

       
        const customerData = customersList.data.data;
        const totalCount = customersList.data.totalCount;

        let customerList = "";

        let rowNumber = page * size + 1;

        for (let i = 0; i < customerData.length; i++) {
            const customer = customerData[i];
            const creditStatus = customer.creditStatus;

            const statusColor = creditStatus === "Disabled" ? "#101A24" : "#EA6D27";

            const isDisabled = customer.cusId === 1 && customer.cusName === "unKnown";

            customerList += `
                <tr ${isDisabled ? 'class="disabled-row"' : ''}>
                    <td>${rowNumber++}</td>
                    <td>${customer.cusId}</td>
                    <td>${customer.cusName}</td>
                    <td>${customer.cusMobileNo}</td>
                    <td style="color: ${statusColor}">${creditStatus}</td>
                </tr>
            `;
        }

        document.querySelector('#tblcustomer tbody').innerHTML = customerList;
        customerTableClickEvenetHandle();

        const totalPages = Math.ceil(totalCount / size);
        updateCustomerPaginationControls(baseUrl, page, size, totalPages);
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

function updateCustomerPaginationControls(baseUrl, currentPage, pageSize, totalPages) {
    let paginationHtml = "";

    // Previous Button
    paginationHtml += `<button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 0 ? "disabled" : ""}>Prev</button>`;

    // Page Buttons
    if (totalPages <= 5) {
        for (let i = 0; i < totalPages; i++) {
            paginationHtml += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i + 1}</button>`;
        }
    } else {
        paginationHtml += `<button class="pagination-btn ${currentPage === 0 ? "active" : ""}" data-page="0">1</button>`;

        if (currentPage > 2) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages - 2, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i + 1}</button>`;
        }

        if (currentPage < totalPages - 3) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        paginationHtml += `<button class="pagination-btn ${currentPage === totalPages - 1 ? "active" : ""}" data-page="${totalPages - 1}">${totalPages}</button>`;
    }

    // Next Button
    paginationHtml += `<button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages - 1 ? "disabled" : ""}>Next</button>`;

    const paginationControls = document.getElementById("customer-pagination-controls");
    paginationControls.innerHTML = paginationHtml;

    // Attach Click Event to Pagination Buttons
    const paginationButtons = document.querySelectorAll(".pagination-btn");
    paginationButtons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedPage = parseInt(this.getAttribute("data-page"));
            if (selectedPage >= 0 && selectedPage < totalPages) {
                loadAllCustomerToTable(baseUrl, selectedPage, pageSize);
            }
        });
    });
}



//------------customer save event handle------------ 
async function handleSaveCustomer(baseUrl) {


    if (customerCreditStatuslement.value == "") {
        Swal.fire({
            title: "Oops...",
            text: "Please select Credit Status",
            icon: "warning",
            customClass: {
                confirmButton: 'alert-orange-button',
            }
        });
        return;
    }


    const customerData = {
        cusName: customerNameElement.value.trim(),
        cusMobileNo: customerContactElement.value.trim(),
        creditStatus: customerCreditStatuslement.value.trim()
    };

    try {
        await saveCustomer(baseUrl, customerData);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Customer saved successfully!',
            showConfirmButton: false,
            timer: 1500
        });
        resetCustomerInput();
        
    } catch (error) {
        console.error('Error saving customer:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while saving the customer. Please try again.',
        });
    }
}





//------------reset inputs function-----------
function resetCustomerInput() {
    customerIdElement.value = '';
    customerNameElement.value = '';
    customerContactElement.value = '';
    customerCreditStatuslement.value = ""
    customerNameElement.focus();

   const fields = ['customerName', 'customerContact', 'customerCreditStatus'];

    fields.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        const container = input?.parentElement;
        if (!container) return;

        container.classList.remove('error', 'success');

        const existingIcon = container.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();
    });

    ['btn_save_customer', 'btn_update_customer', 'btn_delete_customer'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
    });
}



