import { fetchOrdersCount } from '../../api/orderApi.js';
import { fetchCashCount, fetchCardCount, fetchCreditCount } from '../../api/paymentApi.js';

const datepicker = document.getElementById('date-picker-order');
const OrderTable = document.getElementById('tblOrder');
const orderIdList = document.querySelector("#dropdown-menu-oid");
const tableIdList = document.querySelector("#dropdown-menu-tid");
const employeIdList = document.querySelector("#dropdown-menu-eid");


document.addEventListener("DOMContentLoaded", async function () {
    const baseUrl = await window.api.getBaseUrl();

    // loadAllOrders(baseUrl, page = 0, size = 5);

    countCashPayment(baseUrl);
    countCreditPayment(baseUrl);
    countCardPayment(baseUrl);
    countAllOrders(baseUrl);

    document.querySelector("#selectOrderId_order").addEventListener("input", () => {
        //filterOrderByOrderId(baseUrl, page = 0, size = 5)
        document.querySelector("#selectTable_order").value = ""
        document.querySelector("#selectCustomer_order").value = ""
        document.querySelector("#date-picker-order").value = ""
    });

    document.querySelector("#selectTable_order").addEventListener("input", () => {
        //filterOrderByTableId(baseUrl, page = 0, size = 5)
        document.querySelector("#selectCustomer_order").value = ""
        document.querySelector("#selectOrderId_order").value = ""
        document.querySelector("#date-picker-order").value = ""
    });

    document.querySelector("#selectCustomer_order").addEventListener("input", () => {
        // filterOrderByCustomer(baseUrl, page = 0, size = 5);
        document.querySelector("#selectOrderId_order").value = ""
        document.querySelector("#selectTable_order").value = ""
        document.querySelector("#date-picker-order").value = ""

    });
    document.querySelector("#date-picker-order").addEventListener("input", () => {
        // filterOrderByDate(baseUrl, page = 0, size = 5);
        document.querySelector("#selectTable_order").value = ""
        document.querySelector("#selectOrderId_order").value = ""
        document.querySelector("#selectCustomer_order").value = ""

    })

});




//--------- count cash payment-------------
async function countCashPayment(baseUrl) {
    try {
        const responseData = await fetchCashCount(baseUrl);
        const cash = responseData.data;
        if (cash > 999) {
            document.querySelector('#cashCount').textContent = '999+';
        } else {
            document.querySelector('#cashCount').textContent = cash;
        }
    } catch (error) {
        console.error('Error fetching cash count:', error);
    }
}

//--------- count credit payment-------------
async function countCreditPayment(baseUrl) {
    try {
        const responseData = await fetchCreditCount(baseUrl);
        const creditCount = responseData.data;

        if (creditCount > 999) {
            document.querySelector('#creditCount').textContent = '999+';
        } else {
            document.querySelector('#creditCount').textContent = creditCount;
        }

    } catch (error) {
        console.error('Error fetching credit count:', error);
    }
}

//--------- count card payment-------------
async function countCardPayment(baseUrl) {
    try {
        const responseData = await fetchCardCount(baseUrl);
        const cardCount = responseData.data;;


        if (cardCount > 999) {
            document.querySelector('#cardCount').textContent = '999+';
        } else {
            document.querySelector('#cardCount').textContent = cardCount;
        }

    } catch (error) {
        console.error('Error fetching card count:', error);
    }
}

//--------- count total orders-------------
async function countAllOrders(baseUrl) {
    try {
        const responseData = await fetchOrdersCount(baseUrl);
        const orderCount = responseData.data;

        if (orderCount > 999) {
            document.querySelector('#orderCount').textContent = '999+';
        } else {
            document.querySelector('#orderCount').textContent = orderCount;
        }


    } catch (error) {
        console.error('Error fetching order count:', error);
    }
}