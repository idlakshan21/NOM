import { getOrdersUrl } from "../routes/ordersRoute.js";

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    'Content-Type': 'application/json'
});


export async function fetchOrdersCount(baseURL) {
    const response = await fetch(getOrdersUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
}
