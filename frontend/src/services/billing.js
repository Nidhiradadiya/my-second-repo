import api from './api';

// Company API
export const companyAPI = {
    get: async () => {
        const response = await api.get('/company');
        return response.data;
    },

    createOrUpdate: async (data) => {
        const response = await api.post('/company', data);
        return response.data;
    },

    uploadLogo: async (file) => {
        const formData = new FormData();
        formData.append('logo', file);
        const response = await api.post('/company/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    removeLogo: async () => {
        const response = await api.delete('/company/logo');
        return response.data;
    },

    uploadSignature: async (file) => {
        const formData = new FormData();
        formData.append('signature', file);
        const response = await api.post('/company/signature', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

// Customer API
export const customerAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/customers', { params });
        return response.data;
    },

    search: async (query) => {
        const response = await api.get(`/customers/search?q=${query}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/customers', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/customers/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },

    getLedger: async (id) => {
        const response = await api.get(`/customers/${id}/ledger`);
        return response.data;
    },
};

// Product API
export const productAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    search: async (query) => {
        const response = await api.get(`/products/search?q=${query}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/products', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};

// Bill API
export const billAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/bills', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bills/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/bills', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/bills/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/bills/${id}`);
        return response.data;
    },

    downloadPDF: async (id) => {
        const response = await api.get(`/bills/${id}/pdf`, {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bill-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};

// Payment API
export const paymentAPI = {
    getAll: async (params = {}) => {
        const response = await api.get('/payments', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/payments', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/payments/${id}`);
        return response.data;
    },

    getCustomerPayments: async (customerId) => {
        const response = await api.get(`/payments/customer/${customerId}`);
        return response.data;
    },
};
