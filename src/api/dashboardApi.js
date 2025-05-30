import {getEmployeesUrl} from '../routes/employeeRoute.js'; 
import {getOrdersUrl} from '../routes/ordersRoute.js'; 
import {getDishesUrl} from '../routes/dishesRoute.js'; 
import {getIndoorTablesUrl,getOutdoorTablesUrl} from '../routes/tablesRoute.js'; 
import {getDashboardReportUrl} from '../routes/reportsRoute.js'; 



const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    'Content-Type': 'application/json'
});


export async function fetchEmployees(baseURL) {
    const response = await fetch(getEmployeesUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    const data = await response.json();
    return data;
}


export async function fetchOrders(baseURL) {
    const response = await fetch(getOrdersUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
}


export async function fetchDishes(baseURL) {
    const response = await fetch(getDishesUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dishes");
    }

    return await response.json();
}


export async function fetchIndoorTables(baseURL) {
    const response = await fetch(getIndoorTablesUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch indoor tables");
    }

     const tables=await response.json();
     return tables;
}


export async function fetchOutdoorTables(baseURL) {
     const response = await fetch(getOutdoorTablesUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch outdoor tables");
    }

    return await response.json();
}


export async function fetchDashboardReport(baseURL) {
     const response = await fetch(getDashboardReportUrl(baseURL), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard report");
    }

    const data=await response.json();
    return data
}