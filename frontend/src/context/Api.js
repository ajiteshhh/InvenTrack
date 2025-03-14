export const BASE_URL = 'https://inventrack-api.onrender.com';
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const REQUEST_OPTIONS = { credentials: 'include' };

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // throw new Error(`Error: ${response.status} - ${response.statusText}`);
    throw new Error(`${data.message}`);
  }
  return data;
};

// ----------------Recent Activity-----------------
export const fetchRecentActivity = async () => {
  const response = await fetch(`${BASE_URL}/analytics/`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

// ---------------------Orders----------------------
export const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const fetchOrderItems = async (id) => {
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const placeOrder = async (order) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(order),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
}

export const updateStatus = async (order) => {
  console.log(order);
  const response = await fetch(`${BASE_URL}/orders/${order.id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(order),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};


// ------------------- SUPPLIERS -------------------

export const fetchSuppliers = async () => {
  const response = await fetch(`${BASE_URL}/suppliers`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const addSupplier = async (supplier) => {
  const response = await fetch(`${BASE_URL}/suppliers`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(supplier),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const updateSupplier = async (supplier) => {
  const response = await fetch(`${BASE_URL}/suppliers/${supplier.id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(supplier),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const deleteSupplier = async (id) => {
  const response = await fetch(`${BASE_URL}/suppliers/${id}`, {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

// ------------------- Category -------------------

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/category`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const addCategory = async (category) => {
  const response = await fetch(`${BASE_URL}/category`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({name: category}),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

// ------------------- PRODUCTS -------------------

export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const addProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(product),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const updateProduct = async (product) => {
  console.log(`${BASE_URL}/products/${product.id}`);
  const response = await fetch(`${BASE_URL}/products/${product.id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(product),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const deleteProduct = async (product_id) => {
  const response = await fetch(`${BASE_URL}/products/${product_id}`, {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

// ------------------- CUSTOMERS -------------------

export const fetchCustomers = async () => {
  const response = await fetch(`${BASE_URL}/customer`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const addCustomer = async (customer) => {
  const response = await fetch(`${BASE_URL}/customer`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(customer),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const updateCustomer = async (customer) => {
  const response = await fetch(`${BASE_URL}/customer/${customer.id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(customer),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const deleteCustomer = async (id) => {
  const response = await fetch(`${BASE_URL}/customer/${id}`, {
    method: 'DELETE',
    headers: DEFAULT_HEADERS,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

// ------------------- User -------------------
export const updateUserProfile = async (user) => {
  const response = await fetch(`${BASE_URL}/auth/update/user/profile`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(user),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};

export const updateUserPassword = async (userPassword) => {
  const response = await fetch(`${BASE_URL}/auth/update/user/password`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(userPassword),
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};
export const updateUserProfilePicture = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/update/user/profile/picture`, {
    method: 'POST',
    body: formData,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};
export const updateUserBusinessLogo = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/update/user/business/logo`, {
    method: 'POST',
    body: formData,
    ...REQUEST_OPTIONS,
  });
  return await handleResponse(response);
};