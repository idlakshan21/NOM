
const dateAndTimeElement = document.getElementById("currentDateAndTime");


document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        'dashboard-section', 'credit-section', 'employee-section', 'dish-section',
        'stock-section', 'order-section', 'customer-section', 'report-section',
        'currentStockReport', 'creditReport', 'stockReport', 'cashSettlementReport',
        'salesReport', 'incomeReport', 'expensesReport', 'orderDetailsReport',
        'creditPaymentReport', 'table-section', 'dishReport'
    ];

    const hideAllSections = () => {
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    };

    const showSection = (id) => {
        hideAllSections();
        const section = document.getElementById(id);
        if (section) section.style.display = 'block';
    };

    document.getElementById('btn-adminDashboard').addEventListener('click', () => showSection('dashboard-section'));
    document.getElementById('btn-adminEmployer').addEventListener('click', () => showSection('employee-section'));
    document.getElementById('btn-adminDish').addEventListener('click', () => showSection('dish-section'));
    document.getElementById('btn-adminStock').addEventListener('click', () => showSection('stock-section'));
    document.getElementById('btn-adminOrder').addEventListener('click', () => showSection('order-section'));
    document.getElementById('btn-adminCustomer').addEventListener('click', () => showSection('customer-section'));
    document.getElementById('btn-adminReport').addEventListener('click', () => showSection('report-section'));
    document.getElementById('btn-adminTable').addEventListener('click', () => showSection('table-section'));
    document.getElementById('btn-adminCredit').addEventListener('click', () => showSection('credit-section'));
});




function updateTime() {
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const amOrpm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${day} ${month} ${year} | ${formattedHours}.${minutes.toString().padStart(2, '0')} ${amOrpm}`;
    dateAndTimeElement.innerHTML = formattedDate;
}


function navigationButtonClickEvent() {
    let nav = document.querySelector(".aside-nav-button-list"),
        navList = nav.querySelectorAll("li"),
        totalNav = navList.length;

    for (let i = 0; i < totalNav; i++) {
        const button = navList[i].querySelector("div");

        button.addEventListener('click', function () {
            for (let j = 0; j < totalNav; j++) {
                navList[j].querySelector("div").classList.remove("active");
            }

            this.classList.add("active");
        })

    }
}


document.addEventListener("DOMContentLoaded", function () {
    navigationButtonClickEvent();
    setInterval(updateTime, 1000);

});
