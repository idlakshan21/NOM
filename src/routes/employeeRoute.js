export function getEmployeesUrl(baseURL) {
    return `${baseURL}/user/users`;
}

export function getSaveEmployeeUrl(baseURL) {
  return `${baseURL}/user/signUp`;
}

export function getUpdateEmployeeUrl(baseURL) {
    return `${baseURL}/user`;
}

export function getAllEmployeesUrl(baseURL, page, size) {
    return `${baseURL}/user/usersAndRoles?page=${page}&size=${size}`;
}

export function getDeleteEmployeeUrl(baseURL, userId) {
    return `${baseURL}/user?userId=${userId}`;
}