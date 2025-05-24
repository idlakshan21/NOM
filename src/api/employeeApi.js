import { getSaveEmployeeUrl,getUpdateEmployeeUrl,getAllEmployeesUrl   } from '../routes/employeeRoute.js';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    'Content-Type': 'application/json'
});


export async function saveEmployee(baseURL,employeeData) {
    const response = await fetch(getSaveEmployeeUrl(baseURL), {
        method: 'POST',
        headers: getHeaders(),
        body:JSON.stringify(employeeData)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    const data = await response.json();
    return data;
}

export async function fetchAllEmployees(baseURL, page, size) {
    const response = await fetch(getAllEmployeesUrl(baseURL, page, size), {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
    }

    return await response.json();
}


export async function updateEmployee(baseURL, employeeData) {
  const response = await fetch(getUpdateEmployeeUrl(baseURL), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(employeeData)
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  return await response.json();
}

