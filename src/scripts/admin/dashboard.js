import { fetchEmployees, fetchOrders, fetchDishes, fetchIndoorTables, fetchOutdoorTables, fetchDashboardReport } from '../../api/dashboardApi.js';

async function countAllEmployee(baseUrl) {
    const countElement = document.getElementById('count_emp');
    countElement.innerText = '0';

    try {
        const data = await fetchEmployees(baseUrl);
        const totalEmployees = Array.isArray(data) ? data.length : parseInt(data, 10);
        countUpAnimationEmployee(countElement, totalEmployees);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        countElement.innerText = 'Error';
    }
}


function countUpAnimationEmployee(element, targetCount) {
    let currentCount = 0;
    const increment = 1;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / targetCount));

    const timer = setInterval(() => {
        currentCount += increment;
        element.innerText = currentCount;

        if (currentCount >= targetCount) {
            clearInterval(timer);
        }
    }, stepTime);
}


async function countAllOrdersId(baseUrl) {
    const countElement = document.getElementById('count_orders');
    countElement.innerText = '0';

    try {

        const data = await fetchOrders(baseUrl);
        const totalOrders = parseInt(data.data, 10);

        const displayCount = totalOrders >= 999 ? '999+' : totalOrders;

        countUpAnimationOrders(countElement, displayCount);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        countElement.innerText = 'Error';
    }
}


function countUpAnimationOrders(element, targetCount) {
    let currentCount = 0;
    const duration = 1000;
    let increment = 1;

    if (targetCount > 100) {
        increment = 50;
    } else if (targetCount > 10) {
        increment = 5;
    }

    const stepTime = Math.abs(Math.floor(duration / (targetCount / increment)));

    const timer = setInterval(() => {
        if (currentCount + increment > targetCount) {
            currentCount = targetCount;
            element.innerText = currentCount;
            clearInterval(timer);
        } else {
            currentCount += increment;
            element.innerText = currentCount;
        }
    }, stepTime);
}


async function countAllDishes(baseUrl) {
    const countElement = document.getElementById('count_dishes');
    countElement.innerText = '0';

    try {

        const data = await fetchDishes(baseUrl);
        const totalDishes = parseInt(data, 10);

        countUpAnimationDishes(countElement, totalDishes);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        countElement.innerText = 'Error';
    }
}


function countUpAnimationDishes(element, targetCount) {
    let currentCount = 0;
    const duration = 1000;
    let increment = 1;

    if (targetCount > 100) {
        increment = 20;
    } else if (targetCount > 10) {
        increment = 5;
    }

    const stepTime = Math.abs(Math.floor(duration / (targetCount / increment)));

    const timer = setInterval(() => {
        if (currentCount + increment > targetCount) {
            currentCount = targetCount;
            element.innerText = currentCount;
            clearInterval(timer);
        } else {

            currentCount += increment;
            element.innerText = currentCount;
        }
    }, stepTime);
}

async function loadAllInDoorTables(baseUrl) {

    const tableCardSection = document.getElementById('tableCardSection');
    tableCardSection.innerHTML = '';
    let tablesHtml = '';

    try {
        const tables = await fetchIndoorTables(baseUrl);
        tables.data.forEach(tableData => {
            let tableColor;
            switch (tableData.status) {
                case "Available":
                    tableColor = 'var(--color-order-panel)';
                    break;
                case "Occupied":
                case "Pending":
                    tableColor = 'var(--color-selected)';
                    break;
                case "Maintaince":
                    tableColor = 'var(-color-secondary)';
                    break;
                default:
                    tableColor = 'var(--color-default)';
            }

            tablesHtml += `
                <div class="dinein-table" data-name="${tableData.status}" style="width: 28%; height: 35%; margin-bottom: 3%;">
                    <div class="dinein-table-header" style="background-color:${tableColor};">
                        <h5 id="table_tableId" style="color:white;">${tableData.tableId}</h5>
                    </div>
                    <div class="dinein-table-body" style="height: 60%;">
                        <img src="../assets/images/table.jpg" style="height: 70px; width: 95%;" alt="">
                    </div>
                    <div class="dinein-table-footer" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 6px; height: 38%;">
                        <p id="tableSize">${tableData.tableSize}</p>
                    </div>
                </div>
            `;
        });

        tableCardSection.innerHTML = tablesHtml;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }







}


async function loadAllOutDoorTables(baseUrl) {
    const tableCardSection = document.getElementById('tableCardSection');
    tableCardSection.innerHTML = '';

    let tablesHtml = '';
    try {
        const tables = await fetchOutdoorTables(baseUrl);
        tables.data.forEach(tableData => {
            let tableColor;
            switch (tableData.status) {
                case "Available":
                    tableColor = 'var(--color-order-panel)';
                    break;
                case "Occupied":
                case "Pending":
                    tableColor = 'var(--color-selected)';
                    break;
                case "Maintaince":
                    tableColor = 'var(--color-secondary)';
                    break;
                default:
                    tableColor = 'var(--color-default)';
            }

            tablesHtml += `
                <div class="dinein-table" data-name="${tableData.status}" style="width: 28%; height: 35%; margin-bottom: 3%;">
                    <div class="dinein-table-header" style="background-color:${tableColor};">
                        <h5 id="table_tableId" style="color:white;">${tableData.tableId}</h5>
                    </div>
                    <div class="dinein-table-body" style="height: 60%;">
                        <img src="../assets/images/table.jpg" style="height: 70px; width: 95%;" alt="">
                    </div>
                    <div class="dinein-table-footer" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 6px; height: 38%;">
                        <p id="tableSize">${tableData.tableSize}</p>
                    </div>
                </div>
            `;
        });
          tableCardSection.innerHTML = tablesHtml;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


async function dashboardReport(baseUrl) {
    const ctx4 = document.getElementById('barchartTwo').getContext('2d'); 

    try {
     

        const chartData = await fetchDashboardReport(baseUrl);

        const labels = chartData.data.map(dayArray => dayArray[0]);
        const ordersData = chartData.data.map(dayArray => dayArray[4]);
        const card = chartData.data.map(dayArray => dayArray[2]);
        const creditData = chartData.data.map(dayArray => dayArray[3]);
        const cash = chartData.data.map(dayArray => dayArray[1]);


        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "orders",
                        backgroundColor: "#FF9D76",
                        data: ordersData
                    },
                    {
                        label: "card",
                        backgroundColor: "#51EAEA",
                        data: card
                    },
                    {
                        label: "credit",
                        backgroundColor: "orange",
                        data: creditData
                    },
                    {
                        label: "cash",
                        backgroundColor: "#5D6D7E",
                        data: cash
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Chart JS Grouped Bar Chart Example'
                }
            }
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const baseUrl = await window.api.getBaseUrl();

    window.api.checkUserAuthentication();
    countAllEmployee(baseUrl);
    countAllOrdersId(baseUrl);
    countAllDishes(baseUrl);
    loadAllInDoorTables(baseUrl);
     dashboardReport(baseUrl);


    document.getElementById('dashBoard-Tabl_toggle').addEventListener('click', function () {
        const checkbox = document.getElementById('dashBoard-Tabl_toggle');
        if (checkbox.checked) {
            loadAllInDoorTables(baseUrl);
        } else {
            loadAllOutDoorTables(baseUrl);
        }
    });
})