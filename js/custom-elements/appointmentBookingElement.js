class AppointmentBooking extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
                .appointment-booking {
                    border-radius: 0.375rem;
                    background-color: #fff;
                }
                .form-control, .form-select {
                    font-size: 1rem;
                    padding: 0.375rem 0.75rem;
                    border: 1px solid #ced4da;
                    border-radius: 0.375rem;
                    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                .form-control:focus, .form-select:focus {
                    border-color: #86b7fe;
                    outline: 0;
                    box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
                }
                .no-times {
                    color: #dc3545;
                    margin-top: 10px;
                }
                .form-label {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
            </style>
            <div class="appointment-booking">
                <div class="mb-3">
                    <label for="datepicker" class="form-label">Pick a Date:</label>
                    <input id="datepicker" type="date" class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="timeDropdown" class="form-label">Select Available Time:</label>
                    <select id="timeDropdown" class="form-select"></select>
                    <div id="no-times-message" class="no-times" style="display: none;">No available times on this day</div>
                </div>
            </div>
        `;
        this.availableTimes = [];
        this.selectedDate = this.getAttribute("date") || "";
        this.selectedTime = this.getAttribute("time") || "";
    }

    connectedCallback() {
        this.datepicker = this.shadowRoot.getElementById("datepicker");
        this.timeDropdown = this.shadowRoot.getElementById("timeDropdown");
        this.noTimesMessage = this.shadowRoot.getElementById("no-times-message");

        if (this.selectedDate) {
            this.datepicker.value = this.selectedDate;
            this.fetchAvailableTimes(this.selectedDate);
        }

        this.datepicker.addEventListener("change", () => {
            this.selectedDate = this.datepicker.value;
            this.dispatchEvent(new CustomEvent('date-selected', {
                detail: { date: this.selectedDate },
                bubbles: true,
                composed: true,
            }));

            this.fetchAvailableTimes(this.selectedDate);
        });

        this.timeDropdown.addEventListener("change", () => {
            this.dispatchEvent(new CustomEvent('time-selected', {
                detail: { datetime: this.getCombinedDateTime() },
                bubbles: true,
                composed: true,
            }));
        });
    }

    async fetchAvailableTimes(date) {
        const times = {
            "2024-10-15": ["09:00", "09:30", "10:00", "11:00", "13:00", "15:00"],
            "2024-10-16": ["10:30", "11:30", "14:00", "15:00", "16:00"],
            "2024-10-17": ["09:30", "10:30", "12:00", "16:00"],
            "2024-10-18": ["08:00", "09:00", "10:00", "13:00"],
            "2024-10-19": ["10:30", "11:00", "14:00"],
        };

        const availableTimes = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(times[date] || []);
            }, 500); 
        });

        this.availableTimes = availableTimes;
        this.updateAvailableTimes();
    }

    updateAvailableTimes() {
        const times = this.availableTimes;

        this.timeDropdown.innerHTML = "";
        this.noTimesMessage.style.display = times.length === 0 ? "block" : "none";

        if (times.length > 0) {
            this.noTimesMessage.style.display = "none";
            this.timeDropdown.style.display = "block";
            
            times.forEach((time) => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;

                if (time === this.selectedTime) {
                    option.selected = true;
                }

                this.timeDropdown.appendChild(option);
            });
        } else {
            const option = document.createElement("option");
            option.textContent = "No available times";
            option.disabled = true;
            this.timeDropdown.appendChild(option);
            this.timeDropdown.style.display = "none";
        }
    }

    getCombinedDateTime() {
        const selectedTime = this.timeDropdown.value;
        if (this.selectedDate && selectedTime) {
            return new Date(`${this.selectedDate}T${selectedTime}`);
        }
        return null;
    }

    get value() {
        return this.getCombinedDateTime();
    }

    static get observedAttributes() {
        return ["date", "time"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "date") {
            this.selectedDate = newValue;
            this.datepicker.value = this.selectedDate;
            this.fetchAvailableTimes(this.selectedDate);
        } else if (name === "time") {
            this.selectedTime = newValue;
            this.updateAvailableTimes();
        }
    }
}

customElements.define('appointment-booking', AppointmentBooking);
