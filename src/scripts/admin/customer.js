import { validatedCustomerSchema } from '../../validation/customerSchema.js';

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
  //  loadAllCustomerToTable(baseUrl,page = 0, size = 8);

 
    customerSaveBtn.addEventListener('click', function () {
        saveCustomer(baseUrl)
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


//------------customer save event handle------------ 
function saveCustomer(baseUrl) {
    const cusName = customerNameElement.value.trim();
    const cusMobileNo = customerContactElement.value.trim();

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
        cusName: customerNameElement.value,
        cusMobileNo: customerContactElement.value,
        creditStatus: customerCreditStatuslement.value
    };

    fetch(baseUrl + "/customer/save", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(customerData)

    })
        // console.log(customerData);
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          //  console.log('Customer saved successfully:', data);
            checkCustomerInputs();
            loadAllCustomerToTable(baseUrl,page = 0, size = 8);
            resetInputStyles();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Customer saved successfully!",
                showConfirmButton: false,
                timer: 1500
            });

        })
        .catch(error => {
            console.error('Error saving Customer:', error);
           // alert('Failed to save customer. Please try again.');

            Swal.fire({
                title: "Oops...",
                text: "Failed to save customer. Please try again.",
                icon: "warning",
                customClass: {
                    confirmButton: 'alert-orange-button',
                }
            })
        });

}