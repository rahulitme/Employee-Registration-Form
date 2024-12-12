document.addEventListener('DOMContentLoaded', () => {
    const app = {
        init() {
            this.cacheDOM();
            this.bindEvents();
            this.loadInitialPage();
        },

        cacheDOM() {
            // Navigation
            this.navRegister = document.getElementById('nav-register');
            this.navListing = document.getElementById('nav-listing');
            this.hamburger = document.getElementById('hamburger');
            this.navMenu = document.querySelector('.nav-menu');
            this.mainContent = document.getElementById('main-content');
            this.searchBar = document.getElementById('search-bar');
        },

        bindEvents() {
            this.navRegister.addEventListener('click', () => this.loadRegistrationPage());
            this.navListing.addEventListener('click', () => this.loadListingPage());
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            this.searchBar.addEventListener('input', () => this.searchEmployees());
        },

        loadInitialPage() {
            this.loadListingPage();
        },

        toggleMobileMenu() {
            this.navMenu.classList.toggle('active');
        },

        loadRegistrationPage() {
            this.mainContent.innerHTML = `
                <div id="registration-form">
                    <h2>Employee Registration</h2>
                    <form id="employee-form">
                        <input type="text" id="name" placeholder="Name" required>
                        <input type="text" id="position" placeholder="Position" required>
                        <textarea id="about" placeholder="About" required></textarea>
                        <input type="date" id="joining_date" required>
                        <button type="submit">Register Employee</button>
                    </form>
                </div>
            `;

            const form = document.getElementById('employee-form');
            form.addEventListener('submit', (e) => this.submitEmployeeForm(e));
        },

        submitEmployeeForm(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const position = document.getElementById('position').value;
            const about = document.getElementById('about').value;
            const joiningDate = document.getElementById('joining_date').value;

            const employee = {
                id: Date.now(),
                name,
                position,
                about,
                joiningDate
            };

            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees.push(employee);
            localStorage.setItem('employees', JSON.stringify(employees));

            this.loadListingPage();
        },

        loadListingPage(searchTerm = '') {
            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            
            if (searchTerm) {
                employees = employees.filter(emp => 
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            const itemsPerPage = 5;
            const totalPages = Math.ceil(employees.length / itemsPerPage);
            const currentPage = 1;  // Default to first page

            const paginatedEmployees = employees.slice(
                (currentPage - 1) * itemsPerPage, 
                currentPage * itemsPerPage
            );

            const tableHTML = `
                <div id="employee-listing">
                    <h2>Employee Listing</h2>
                    <table id="employee-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>About</th>
                                <th>Joining Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedEmployees.map(emp => `
                                <tr data-id="${emp.id}">
                                    <td>${emp.name}</td>
                                    <td>${emp.position}</td>
                                    <td>${emp.about}</td>
                                    <td>${emp.joiningDate}</td>
                                    <td>
                                        <button onclick="app.deleteEmployee(${emp.id})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="pagination">
                        ${this.renderPagination(currentPage, totalPages)}
                    </div>
                </div>
            `;

            this.mainContent.innerHTML = tableHTML;
        },

        renderPagination(currentPage, totalPages) {
            let paginationHTML = '';
            if (currentPage > 1) {
                paginationHTML += `<button onclick="app.changePage(${currentPage - 1})">Previous</button>`;
            }
            if (currentPage < totalPages) {
                paginationHTML += `<button onclick="app.changePage(${currentPage + 1})">Next</button>`;
            }
            return paginationHTML;
        },

        changePage(page) {
            // Implement page change logic
        },

        deleteEmployee(id) {
            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees = employees.filter(emp => emp.id !== id);
            localStorage.setItem('employees', JSON.stringify(employees));
            this.loadListingPage();
        },

        searchEmployees() {
            const searchTerm = this.searchBar.value;
            this.loadListingPage(searchTerm);
        }
    };

    // Make app globally accessible for event handlers
    window.app = app;
    app.init();
});