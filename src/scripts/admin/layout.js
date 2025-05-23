
const dateAndTimeElement = document.getElementById("currentDateAndTime");



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
