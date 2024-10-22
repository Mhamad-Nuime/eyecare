document.addEventListener("DOMContentLoaded", function () {
    fetchClinics();
});

async function fetchClinics(){

    const clinicContainer = document.getElementById("clinics-list");
    fetch(`${window.currentEnv.apiUrl}/api/clinics`)
    .then(res => res.json())
    .then(res => {
        res.$values.forEach(data => {
            fetch(`${window.currentEnv.apiUrl}/api/clinics/${data.clinicId}/settings`)
            .then(res => res.json())
            .then(res => {
                const clinic = {
                    name : data.name,
                    address : data.address,
                    daysOpen : res.daysOpen,
                    openTime : res.openTime,
                    closeTime : res.closeTime,
                    emergencyContact : res.emergencyContact
                }
                clinicContainer.appendChild(makeClinicMarkUp(clinic))
            })
            .catch((e) => showToast(`Fail To load Clinic : ${data.name}`, false))
        });
    })
    .catch((e) => showToast(`Fail To load Clinics`, false))
}

function makeClinicMarkUp(clinic){

    const openTimeDate = new Date(clinic.openTime)
    const closeTimeDate = new Date(clinic.closeTime)

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("col-md-4");
    card.classList.add("col-sm-6");

    //line
    const line = document.createElement("div");
    const hr = document.createElement("hr");
    hr.classList.add("line-clinic");
    line.appendChild(hr);

    // clinic Name
    const divName = document.createElement("div");
    divName.classList.add("clinic-name-wrapper")
    const name = document.createElement("h5");
    name.classList.add("clinic-name");
    name.textContent = clinic.name;
    divName.appendChild(name);
    card.appendChild(divName);
    card.appendChild(line);

    // Clinic schedule
    const divDayTime = document.createElement("div");
    divDayTime.classList.add("div-day-time");
    const divDays = document.createElement("div");
    divDays.classList.add("div-time")
    divDays.textContent = clinic?.daysOpen?.toUpperCase();
    divDayTime.appendChild(divDays);
    const divTime = document.createElement("div");
    divTime.classList.add("div-time");
    const divStartTime = document.createElement("span");
    divStartTime.textContent = openTimeDate.toLocaleTimeString();
    const dash = document.createElement("span");
    dash.textContent = " -> ";
    const divEndTime = document.createElement("span");
    divEndTime.textContent = closeTimeDate.toLocaleTimeString();
    divTime.appendChild(divStartTime);
    divTime.appendChild(dash);
    divTime.appendChild(divEndTime);
    divDayTime.appendChild(divTime);
    card.appendChild(divDayTime);
    card.appendChild(line);

    //clinic address
    const addressWrapper = document.createElement("div");
    addressWrapper.classList.add("div-day-time");
    const address = document.createElement("div");
    address.textContent = "Address";
    address.classList.add("div-days");
    const adressDetail = document.createElement("div");
    adressDetail.textContent = clinic.address;
    addressWrapper.appendChild(address)
    addressWrapper.appendChild(adressDetail)
    card.appendChild(addressWrapper);
    card.appendChild(line);

    const urgentWrapper = document.createElement("div");
    const needHelp = document.createElement("div"); 
    needHelp.textContent = "Need Urgent Help?"
    const UrgentNumber = document.createElement("h3"); 
    UrgentNumber.textContent = clinic.emergencyContact;
    UrgentNumber.classList.add("urgent-info");
    urgentWrapper.appendChild(needHelp)
    urgentWrapper.appendChild(UrgentNumber)
    card.appendChild(urgentWrapper);

    return card;
}