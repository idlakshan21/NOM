import { getSaveCustomerUrl,getAllCustomerUrl,updateCustomerUrl,deleteCustomerUrl,searchCustomerUrl } from '../routes/customerRoute.js';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    'Content-Type': 'application/json'
});


export async function saveCustomer(baseURL, customerData) {
    const response = await fetch(getSaveCustomerUrl(baseURL), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(customerData)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    return data;
}

export async function loadAllCustomers(baseURL,page, size) {
    const response = await fetch(getAllCustomerUrl(baseURL,page, size), {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    return data;
}

export async function updateCustomer(baseURL, customerData) {
    const response = await fetch(updateCustomerUrl(baseURL), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(customerData)
    });

    if (!response.ok) {
        throw new Error("Failed to update customer");
    }

    return await response.json();
}

export async function deleteCustomer(baseURL, customerId) {
    const response = await fetch(deleteCustomerUrl(baseURL, customerId), {
        method: 'DELETE',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }

    return await response.json();
}

export async function searchCustomer(baseURL,page, size) {
    const response = await fetch(searchCustomerUrl(baseURL,page, size), {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    return data;
}