import { getcardPaymentCountUrl, getcashPaymentCountUrl, getcreditPaymentCountUrl } from "../routes/paymentRoute.js";

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    'Content-Type': 'application/json'
});


export async function fetchCashCount(baseURL) {
    const response = await fetch(getcashPaymentCountUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
}

export async function fetchCardCount(baseURL) {
    const response = await fetch(getcardPaymentCountUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
}

export async function fetchCreditCount(baseURL) {
    const response = await fetch(getcreditPaymentCountUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
}