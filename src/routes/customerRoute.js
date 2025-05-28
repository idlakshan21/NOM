export function getSaveCustomerUrl(baseURL) {
  return `${baseURL}/customer/save`;
}

export function getAllCustomerUrl(baseURL,page,size) {
  return `${baseURL}/customer/paged?page=${page}&size=${size}`;
}

export function updateCustomerUrl(baseURL) {
  return `${baseURL}/customer/update`;
}

export function deleteCustomerUrl(baseURL,customerId) {
  return `${baseURL}/customer?cusId=${customerId}`;
}

export function searchCustomerUrl(baseURL,page,size) {
  return `${baseURL}/customer/paged?page=${page}&size=${size}`;
}
