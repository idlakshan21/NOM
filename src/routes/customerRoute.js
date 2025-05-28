export function getSaveCustomerUrl(baseURL) {
  return `${baseURL}/customer/save`;
}

export function getAllCustomerUrl(baseURL,page,size) {
  return `${baseURL}/customer/paged?page=${page}&size=${size}`;
}

