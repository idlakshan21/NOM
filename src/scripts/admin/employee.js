import { validatedEmployeeSchema } from '../../validation/employeeSchema.js';
import { validatedChangePasswordSchema } from '../../validation/changePasswordSchema.js';
import { saveEmployee, updateEmployee, fetchAllEmployees, deleteEmployee,changePassword } from '../../api/employeeApi.js';
import { countAllEmployee } from './dashboard.js'

const form = document.getElementById('employee_Form');
const employeeSaveBtn = document.querySelector('#btn_save_employee');
const employeeUpdateBtn = document.getElementById('btn_update_employee');
const employeeDeleteBtn = document.getElementById('btn_delete_employee');
const employeeIdElement = document.getElementById("employee_id");
const employeeNameElement = document.getElementById("employee_name");
const employeeContactElement = document.getElementById("employee_contact");
const employeeRoleElementOne = document.getElementById("user_role_one");
const employeeRoleElementTwo = document.getElementById("user_role_two");
const employeeAddressElement = document.getElementById("employee_address");
const employeePasswordElement = document.getElementById('employee_password');
const employeeConfirmPasswordElement = document.getElementById('employee_confrimPassword');
const popupEmployee = document.getElementById('open_changePassword_popup');
const btnOpenChangePassword = document.getElementById('btn_changePassword_popup');
const btnCloseChangePassword = document.getElementById('close_changePassword_popup');
const empBackgroundOverlay = document.querySelector(".empBackground");
const empSideNavBr = document.querySelector(".aside-nav-button-list");
const empNavbar = document.querySelector(".navbar");

const changePasswordForm = document.querySelector('.passwordPopup-form')
const empChangePasswordId = document.getElementById('emp_changepassword_id');
const currentPasswordElement = document.getElementById('employee_currentPassword');
const newPasswordElement = document.getElementById('employee_newPassword');
const confirmNewPasswordElement = document.getElementById('employee_confirm_newPassword');
const changePasswordBtn = document.getElementById('btn_changePassword');
const changePasswordEmpName = document.getElementById('selectedEmployeeName');



let isEditMode = false;

document.addEventListener('DOMContentLoaded', async function () {
    const baseUrl = await window.api.getBaseUrl();

    loadAllEmployees(baseUrl, 0, 15);
    selectEmployeeRolesEvent();
       initializeChangePasswordValidation();

    employeeSaveBtn.addEventListener('click', function () {
        onSaveEmployeeClick(baseUrl)
    });

    employeeUpdateBtn.addEventListener('click', function () {
        onUpdateEmployeeClick(baseUrl);
    });

    employeeDeleteBtn.addEventListener('click', function () {
        onDeleteEmployeeHandle(baseUrl);
    });

    employeeNameElement.addEventListener('input', clearEmployeeIdIfFieldsEmpty);
    employeeContactElement.addEventListener('input', clearEmployeeIdIfFieldsEmpty);
    employeeAddressElement.addEventListener('input', clearEmployeeIdIfFieldsEmpty);

    btnOpenChangePassword.addEventListener("click", function () {
        popupEmployee.style.display = 'block';
        empBackgroundOverlay.classList.add("overlay");
        empSideNavBr.style.pointerEvents = "none"
        empNavbar.style.pointerEvents = "none"
    });

    btnCloseChangePassword.addEventListener("click", function () {
        popupEmployee.style.display = 'none';
        empBackgroundOverlay.classList.remove("overlay")
        empSideNavBr.style.pointerEvents = "auto"
        empNavbar.style.pointerEvents = "auto"

    });

      changePasswordBtn.addEventListener("click", function () {
        employeeChangePasswordEvent(baseUrl);

    });

});

function selectEmployeeRolesEvent() {
    employeeRoleElementOne.addEventListener('change', function () {
        const selectedRole = this.value;
        employeeRoleElementTwo.disabled = false;

        for (let i = 0; i < employeeRoleElementTwo.options.length; i++) {
            employeeRoleElementTwo.options[i].disabled = false;
        }
        const matchingOptionIndex = Array.from(employeeRoleElementTwo.options).findIndex(option => option.value === selectedRole);
        if (matchingOptionIndex !== -1) {
            employeeRoleElementTwo.options[matchingOptionIndex].disabled = true;
        }
    });
}

form.addEventListener('input', () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const allFields = ['employeeName', 'employeeContact', 'userAddress', 'userPassword', 'userConfrimPassword'];
    const editModeFields = ['employeeName', 'employeeContact', 'userAddress'];

    const fieldsToValidate = isEditMode ? editModeFields : allFields;

    const allEmpty = fieldsToValidate.every(field => !data[field]?.trim());

    if (allEmpty) {

        allFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const container = input?.parentElement;
            if (!container) return;

            container.classList.remove('error', 'success');

            const existingIcon = container.querySelector('.validation-icon');
            if (existingIcon) existingIcon.remove();
        });

        ['btn_save_employee', 'btn_update_employee', 'btn_delete_employee'].forEach(id => {
            document.getElementById(id).disabled = true;
        });

        return;
    }

    let validationData = { ...data };
    if (isEditMode) {

        delete validationData.userPassword;
        delete validationData.userConfrimPassword;
    }


    const result = validatedEmployeeSchema.safeParse(validationData);


    fieldsToValidate.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        const container = input?.parentElement;
        if (!container) return;

        container.classList.remove('error', 'success');
        const existingIcon = container.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();

        const fieldError = result.success ? null : result.error.issues.find(i => i.path[0] === field);

        if (fieldError) {
            container.classList.add('error');

            const errorIcon = document.createElement('span');
            errorIcon.className = 'validation-icon error';
            errorIcon.textContent = '❗';
            container.appendChild(errorIcon);

        } else if (data[field] && !fieldError) {
            container.classList.add('success');

            const successIcon = document.createElement('span');
            successIcon.className = 'validation-icon success';
            successIcon.textContent = '✔';
            container.appendChild(successIcon);
        }
    });

    const isFormValid = fieldsToValidate.every(field => {
        const fieldError = result.success ? null : result.error.issues.find(i => i.path[0] === field);
        return data[field]?.trim() && !fieldError;
    });

    if (isEditMode) {
        document.getElementById('btn_save_employee').disabled = true;
        document.getElementById('btn_update_employee').disabled = !isFormValid;
        document.getElementById('btn_delete_employee').disabled = !isFormValid;
    } else {

        document.getElementById('btn_save_employee').disabled = !isFormValid;
        document.getElementById('btn_update_employee').disabled = true;
        document.getElementById('btn_delete_employee').disabled = true;
    }
});

//----------Employee Save event-----------
async function onSaveEmployeeClick(baseUrl) {
    try {
        const roleIds = await window.api.getRoleIds();

        if (!roleIds) {
            console.error("Role IDs not found");
            return;
        }

        if (employeeRoleElementOne.value === employeeRoleElementTwo.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Role Conflict',
                text: 'Primary and secondary roles cannot be the same.',
                customClass: {
                    confirmButton: 'swal-button-orange',
                }
            });
            return;
        }

        const employeeData = {
            userName: employeeNameElement.value,
            userContact: employeeContactElement.value,
            userPassword: employeeConfirmPasswordElement.value,
            tblAuthUserRolesDTOS: [
                {
                    id: "",
                    userRoleId: roleIds[employeeRoleElementOne.value],
                    userId: ""
                },
            ],
            userAddress: employeeAddressElement.value
        };

        if (employeeRoleElementTwo.value !== "Empty") {
            employeeData.tblAuthUserRolesDTOS.push({
                id: "",
                userRoleId: roleIds[employeeRoleElementTwo.value],
                userId: ""
            });
        }

        const data = await saveEmployee(baseUrl, employeeData);

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Employee saved successfully!',
            showConfirmButton: false,
            timer: 1500
        });
        resetEmployeeInput()
        loadAllEmployees(baseUrl, 0, 10);
        countAllEmployee(baseUrl);
        return data;

    } catch (error) {
        console.error('Error saving employee:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while saving the employee. Please try again.',
        });
    }
}

async function loadAllEmployees(baseUrl, page, size) {
    try {
        const employeesList = await fetchAllEmployees(baseUrl, page, size);

        let groupedEmployees = {};
        let adminCount = 0;

        employeesList.data.data.forEach(employee => {
            const employeeId = employee[0];
            const role = employee[6]?.trim();

            if (!groupedEmployees[employeeId]) {
                groupedEmployees[employeeId] = {
                    id: employeeId,
                    name: employee[1],
                    contact: employee[2],
                    roles: [],
                    address: employee[3],
                };
            }

            groupedEmployees[employeeId].roles.push(role);

            if (role === "Admin") {
                adminCount++;
            }
        });

        let employeeList = "";
        let rowNumber = page * size + 1;

        for (const employeeId in groupedEmployees) {
            const employee = groupedEmployees[employeeId];
            const roles = employee.roles.join(',');
            employeeList += `
                <tr>
                    <td>${rowNumber++}</td>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.contact}</td>
                    <td>${roles}</td>
                    <td>${employee.address}</td>
                </tr>
            `;
        }

        document.getElementById("tbl_employee_body").innerHTML = employeeList;

        employeeTableClickEvenetHandle();
        const totalPages = employeesList.data.totalCount
            ? Math.ceil(employeesList.data.totalCount / size)
            : 10;

        updatePaginationControls(baseUrl, page, size, totalPages);

        return { groupedEmployees, adminCount };
    } catch (error) {
        console.error("Error loading employees:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load employees. Please try again.'
        });
    }
}

function updatePaginationControls(baseUrl, currentPage, pageSize, totalPages) {
    let paginationHtml = "";

    paginationHtml += `<button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 0 ? "disabled" : ""}>Prev</button>`;

    if (totalPages <= 5) {
        for (let i = 0; i < totalPages; i++) {
            paginationHtml += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i + 1}</button>`;
        }
    } else {
        paginationHtml += `<button class="pagination-btn ${currentPage === 0 ? "active" : ""}" data-page="0">1</button>`;

        if (currentPage > 2) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages - 2, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i + 1}</button>`;
        }

        if (currentPage < totalPages - 3) {
            paginationHtml += `<span class="dots">...</span>`;
        }

        paginationHtml += `<button class="pagination-btn ${currentPage === totalPages - 1 ? "active" : ""}" data-page="${totalPages - 1}">${totalPages}</button>`;
    }


    paginationHtml += `<button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages - 1 ? "disabled" : ""}>Next</button>`;

    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = paginationHtml;


    const paginationButtons = document.querySelectorAll(".pagination-btn");
    paginationButtons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedPage = parseInt(this.getAttribute("data-page"));
            if (selectedPage >= 0 && selectedPage < totalPages) {
                loadAllEmployees(baseUrl, selectedPage, pageSize);
            }
        });
    });
}

function employeeTableClickEvenetHandle() {
    const tblEmployeeRows = document.querySelectorAll('#tbl_employee_body tr');
    for (let i = 0; i < tblEmployeeRows.length; i++) {
        tblEmployeeRows[i].addEventListener('click', function () {

            isEditMode = true;

            const cells = tblEmployeeRows[i].getElementsByTagName("td");
            const empId = cells[1].textContent;
            const empName = cells[2].textContent;
            const empContact = cells[3].textContent;
            const empRoles = cells[4].textContent.trim();
            const empAddress = cells[5].textContent;

            const roles = empRoles.split(',');

            employeeRoleElementOne.value = roles[0];
            if (roles.length < 2) {
                employeeRoleElementTwo.value = "Empty";
            } else {
                employeeRoleElementTwo.value = roles[1];
            }

            employeeIdElement.value = empId;
            employeeNameElement.value = empName;
            employeeContactElement.value = empContact;
            employeeAddressElement.value = empAddress;

            employeePasswordElement.disabled = true;
            employeeConfirmPasswordElement.disabled = true;
            employeeRoleElementTwo.disabled = false;

            btnOpenChangePassword.disabled = false;
            empChangePasswordId.value = employeeIdElement.value;
            changePasswordEmpName.innerHTML = employeeNameElement.value



            const passwordFields = ['userPassword', 'userConfrimPassword'];
            passwordFields.forEach(field => {
                const input = document.querySelector(`[name="${field}"]`);
                const container = input?.parentElement;
                if (container) {
                    container.classList.remove('error', 'success');
                    const existingIcon = container.querySelector('.validation-icon');
                    if (existingIcon) existingIcon.remove();
                }
            });

            form.dispatchEvent(new Event('input'));
        });
    }
}

//----------Employee update event-----------
async function onUpdateEmployeeClick(baseUrl) {
    try {
        const roleIds = await window.api.getRoleIds();
        if (!roleIds) {
            console.error("Role IDs not found");
            return;
        }

        if (employeeRoleElementOne.value === employeeRoleElementTwo.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Role Conflict',
                text: 'The primary and secondary roles cannot be the same.',
                customClass: { confirmButton: 'swal-button-orange' }
            });
            return;
        }

        const currentUserId = localStorage.getItem("userId");
        const currentRole = localStorage.getItem("userRole");

        const employeeData = {
            userId: employeeIdElement.value,
            userName: employeeNameElement.value,
            userContact: employeeContactElement.value,
            userPassword: employeeConfirmPasswordElement.value,
            userAddress: employeeAddressElement.value,
            tblAuthUserRolesDTOS: [
                {
                    id: "",
                    userRoleId: roleIds[employeeRoleElementOne.value],
                    userId: ""
                }
            ]
        };

        if (employeeRoleElementTwo.value !== "Empty") {
            employeeData.tblAuthUserRolesDTOS.push({
                id: "",
                userRoleId: roleIds[employeeRoleElementTwo.value],
                userId: ""
            });
        }

        const { adminCount } = await loadAllEmployees(baseUrl, 0, 20);
        // console.log(adminCount);

        const isRemovingAdmin =
            employeeData.userId === currentUserId &&
            employeeData.tblAuthUserRolesDTOS.every(role => role.userRoleId !== roleIds["Admin"]);

        //console.log(isRemovingAdmin);


        if (adminCount <= 1 && isRemovingAdmin) {
            Swal.fire({
                icon: "warning",
                title: "Cannot Change Role",
                text: "There must be at least one Admin in the system.",
                confirmButtonText: "OK",
                customClass: { confirmButton: 'swal-button-orange' }
            });
            return;
        }

        const data = await updateEmployee(baseUrl, employeeData);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Employee updated successfully!",
            showConfirmButton: false,
            timer: 1500
        });

        isEditMode = false;

        if (typeof btnOpenChangePassword !== 'undefined') {
            btnOpenChangePassword.disabled = true;
        }

        if (isRemovingAdmin) {
            Swal.fire({
                title: "Role Updated",
                html: `
          <div style="color: var(--primary-color); font-size: 3rem; margin-bottom: 20px;">
            <i class="fas fa-info-circle"></i>
          </div>
          <p>Your role has been updated. Please log in again.</p>
        `,
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: 'swal-button-orange',
                    popup: 'swal-custom-height'
                }
            }).then(() => {
                localStorage.clear();
                window.location.href = "login.html";
            });
        } else {
            loadAllEmployees(baseUrl, 0, 10);
            resetEmployeeInput();
        }

    } catch (error) {
        console.error('Error updating employee:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the employee. Please try again.'
        });
    }
}

function clearEmployeeIdIfFieldsEmpty() {
    const empName = employeeNameElement.value.trim();
    const empContact = employeeContactElement.value.trim();
    const empAddress = employeeAddressElement.value.trim();

    if (empName === '' && empContact === '' && empAddress === '') {

        isEditMode = false;

        employeeIdElement.value = '';
        employeeRoleElementOne.value = 'Admin';
        employeeRoleElementTwo.value = 'Empty';
        employeeRoleElementTwo.disabled = true;

        employeePasswordElement.disabled = false;
        employeeConfirmPasswordElement.disabled = false;

        const allFields = ['employeeName', 'employeeContact', 'userAddress', 'userPassword', 'userConfrimPassword'];
        allFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const container = input?.parentElement;
            if (container) {
                container.classList.remove('error', 'success');
                const existingIcon = container.querySelector('.validation-icon');
                if (existingIcon) existingIcon.remove();
            }
        });

        ['btn_save_employee', 'btn_update_employee', 'btn_delete_employee'].forEach(id => {
            document.getElementById(id).disabled = true;
        });
    }
}

//----------Employee delete event-----------
async function onDeleteEmployeeHandle(baseUrl) {
    try {
        const { groupedEmployees, adminCount } = await loadAllEmployees(baseUrl, 0, 10);
        const employeeId = employeeIdElement.value;
        const currentUserId = localStorage.getItem("userId");

        const employee = groupedEmployees[employeeId];

        if (!employee) throw new Error('Employee not found');

        const isAdmin = employee.roles.includes("Admin");
        const isDeletingSelf = employeeId === currentUserId;

        if (adminCount <= 1 && isAdmin) {
            return Swal.fire({
                icon: "warning",
                title: "Cannot Delete Admin",
                text: "There must be at least one Admin in the system.",
                confirmButtonColor: "#EA6D27"
            });
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EA6D27",
            cancelButtonColor: "#101A24",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEmployee(baseUrl, employeeId);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Employee deleted successfully.",
                        icon: "success",
                        confirmButtonColor: "#EA6D27"
                    });

                    //  btnOpenChangePassword.disabled = true;

                    if (isDeletingSelf) {
                        Swal.fire({
                            title: "Account Deleted",
                            html: `<div style="color: var(--primary-color); font-size: 3rem; margin-bottom: 20px;">
                                        <i class="fas fa-info-circle"></i>
                                    </div>
                                    <p>Your account has been deleted. Please log in again.</p>`,
                            confirmButtonText: "OK",
                            customClass: {
                                confirmButton: 'swal-button-orange',
                                popup: 'swal-custom-height'
                            }
                        }).then(() => {
                            localStorage.clear();
                            window.location.href = "login.html";
                        });
                    } else {
                        await loadAllEmployees(baseUrl, 0, 10);
                        resetEmployeeInput();
                        countAllEmployee(baseUrl);
                    }
                } catch (error) {
                    console.error('Error Deleting Employee:', error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "This employee may have already been deleted.",
                        confirmButtonColor: "#EA6D27"
                    });
                }
            }
        });

    } catch (error) {
        console.error('Error in deleteEmployee:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            confirmButtonColor: "#EA6D27"
        });
    }
}

function resetEmployeeInput() {
    isEditMode = false;

    employeeIdElement.value = '';
    employeeNameElement.value = '';
    employeeContactElement.value = '';
    employeeConfirmPasswordElement.value = '';
    employeePasswordElement.value = '';
    employeeAddressElement.value = '';
    employeeRoleElementOne.value = 'Admin';
    employeeRoleElementTwo.value = 'Empty';
    employeeRoleElementTwo.disabled = true;

    employeePasswordElement.disabled = false;
    employeeConfirmPasswordElement.disabled = false;

    employeeNameElement.focus();

    const fields = ['employeeName', 'employeeContact', 'userAddress', 'userPassword', 'userConfrimPassword'];

    fields.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        const container = input?.parentElement;
        if (!container) return;

        container.classList.remove('error', 'success');

        const existingIcon = container.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();
    });

    ['btn_save_employee', 'btn_update_employee', 'btn_delete_employee'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
    });
}

function initializeChangePasswordValidation() {

    changePasswordBtn.disabled = true;
    
    changePasswordForm.addEventListener('input', () => {
        const formData = new FormData(changePasswordForm);
        const data = Object.fromEntries(formData.entries());
        
        const passwordFields = ['newPassowrd', 'confirmNewPassword']; 

        const currentPasswordEmpty = !data.currentPassword?.trim();
        
      
        const passwordFieldsEmpty = passwordFields.every(field => !data[field]?.trim());
        
        if (passwordFieldsEmpty) {
           
            passwordFields.forEach(field => {
                const input = document.querySelector(`[name="${field}"]`);
                const container = input?.parentElement;
                if (!container) return;
                
                container.classList.remove('error', 'success');
                
                const existingIcon = container.querySelector('.validation-icon');
                if (existingIcon) existingIcon.remove();
            });

            changePasswordBtn.disabled = true;
            return;
        }
        

        const result = validatedChangePasswordSchema.safeParse(data);
        

        passwordFields.forEach(field => {
            const input = document.querySelector(`[name="${field}"]`);
            const container = input?.parentElement;
            if (!container) return;
            
            container.classList.remove('error', 'success');
            const existingIcon = container.querySelector('.validation-icon');
            if (existingIcon) existingIcon.remove();
            
            const fieldError = result.success ? null : result.error.issues.find(i => i.path[0] === field);
            
            if (fieldError) {
                container.classList.add('error');
                
                const errorIcon = document.createElement('span');
                errorIcon.className = 'validation-icon error';
                errorIcon.textContent = '❗';
                errorIcon.title = fieldError.message;
                container.appendChild(errorIcon);
                
            } else if (data[field] && !fieldError) {
                container.classList.add('success');
                
                const successIcon = document.createElement('span');
                successIcon.className = 'validation-icon success';
                successIcon.textContent = '✔';
                container.appendChild(successIcon);
            }
        });
        
        const passwordsMatch = result.success && 
                             data.newPassowrd?.trim() && 
                             data.confirmNewPassword?.trim();
        
        changePasswordBtn.disabled = currentPasswordEmpty || !passwordsMatch;
    });
}


//----------Employee Change Password event-----------
async function employeeChangePasswordEvent(baseUrl) {
    const currentPassword = currentPasswordElement.value;
    const newPassword = newPasswordElement.value;
    const confirmPassword = confirmNewPasswordElement.value;

    if (newPassword !== confirmPassword) {
        return;
    }

    const employeePasswordData = {
        userId: empChangePasswordId.value,
        currentPassword: currentPassword,
        newPassword: newPassword,
    };

    try {
        const response = await changePassword(baseUrl,employeePasswordData);
       
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Employee's password has been changed successfully!",
            showConfirmButton: false,
            timer: 1500
        });

        resetEmployeeInput();
        resetChangePasswordForm();
        currentPasswordElement.value = '';
        newPasswordElement.value = '';
        confirmNewPasswordElement.value = '';
        popupEmployee.style.display = 'none';
        empBackgroundOverlay.classList.remove("overlay");
        empSideNavBr.style.pointerEvents = "auto";
        empNavbar.style.pointerEvents = "auto";
        btnOpenChangePassword.disabled = true;

    } catch (error) {
        console.error('Error changing password:', error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to change password. Please try again!",
            customClass: {
                confirmButton: 'swal-button--orange'
            }
        });

        currentPasswordElement.value = '';
        newPasswordElement.value = '';
        confirmNewPasswordElement.value = '';
          resetChangePasswordForm();
    }
}


function resetChangePasswordForm() {
    currentPasswordElement.value = '';
    newPasswordElement.value = '';
    confirmNewPasswordElement.value = '';
    
    const fieldsToValidate = ['newPassowrd', 'confirmNewPassword'];
    
    fieldsToValidate.forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        const container = input?.parentElement;
        if (!container) return;
        
        container.classList.remove('error', 'success');
        
        const existingIcon = container.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();
    });
    
    changePasswordBtn.disabled = true;
}