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
        this._availability = [];
        this.selectedDate = null;
        this.selectedTime = null;

        this.datepicker = this.shadowRoot.getElementById("datepicker");
        this.timeDropdown = this.shadowRoot.getElementById("timeDropdown");
        this.noTimesMessage = this.shadowRoot.getElementById("no-times-message");
    }

    static get observedAttributes() {
        return ["disabled"];
    }

    connectedCallback() {
        this.datepicker.addEventListener("change", this.onDateChange.bind(this));
        this.timeDropdown.addEventListener("change", this.onTimeChange.bind(this));
        this.updateDisabledState();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "disabled") {
            this.updateDisabledState();
        }
    }

    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    get disabled() {
        return this.hasAttribute("disabled");
    }

    set availability(value) {
        this._availability = value;
        this.updateDisabledDays();
    }

    get availability() {
        return this._availability;
    }

    onDateChange() {
        this.selectedDate = this.datepicker.value;
        this.updateAvailableTimes();
        this.dispatchEvent(new CustomEvent("date-selected", {
            detail: { date: this.selectedDate },
            bubbles: true,
            composed: true,
        }));
    }

    onTimeChange() {
        this.selectedTime = this.timeDropdown.value;
        this.dispatchEvent(new CustomEvent("time-selected", {
            detail: { datetime: this.value },
            bubbles: true,
            composed: true,
        }));
    }

    updateDisabledState() {
        const isDisabled = this.disabled;
        this.datepicker.disabled = isDisabled;
        this.timeDropdown.disabled = isDisabled;
    }

    updateDisabledDays() {
        const enabledDays = this._availability.flatMap(dayObj => Object.keys(dayObj));
        this.datepicker.addEventListener("input", (e) => {
            const dayOfWeek = new Date(e.target.value).toLocaleString("en-US", { weekday: "short" });
            if (!enabledDays.includes(dayOfWeek)) {
                this.datepicker.setCustomValidity("Date is not selectable.");
            } else {
                this.datepicker.setCustomValidity("");
            }
        });
    }

    updateAvailableTimes() {
        const dayOfWeek = new Date(this.selectedDate).toLocaleString("en-US", { weekday: "short" });
        const dayTimes = this._availability.find(day => day[dayOfWeek])?.[dayOfWeek] || [];

        this.timeDropdown.innerHTML = "";
        if (dayTimes.length > 0) {
            this.noTimesMessage.style.display = "none";
            this.timeDropdown.style.display = "block";
            dayTimes.forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                this.timeDropdown.appendChild(option);
            });
        } else {
            this.noTimesMessage.style.display = "block";
            const option = document.createElement("option");
            option.textContent = "No available times";
            option.disabled = true;
            this.timeDropdown.appendChild(option);
        }
    }

    get value() {
        if (this.selectedDate && this.selectedTime) {
            return `${this.selectedDate}T${this.selectedTime}`;
        }
        return null;
    }
}

customElements.define("appointment-booking", AppointmentBooking);
