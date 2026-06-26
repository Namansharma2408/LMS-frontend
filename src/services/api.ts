const BASE_API_URL = 'https://lms-backend-td88.onrender.com';
const API_BASE_URL = `${BASE_API_URL}/api`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON parsing failed, use default message
    }
    throw new Error(errorMessage);
  }

  // Handle empty or 204 responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Authentication APIs
export const authAPI = {
  login: async (credentials: any) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  signup: async (userData: any) => {
    const data = await fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  getMe: async () => {
    return fetchAPI('/auth/me');
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Courses APIs
export const coursesAPI = {
  getAll: async () => {
    return fetchAPI('/courses');
  },
  getById: async (id: string) => {
    return fetchAPI(`/courses/${id}`);
  },
  create: async (courseData: any) => {
    return fetchAPI('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },
  update: async (id: string, courseData: any) => {
    return fetchAPI(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },
  delete: async (id: string) => {
    return fetchAPI(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
  enroll: async (id: string, gatewayData: any = {}) => {
    return fetchAPI(`/courses/${id}/enroll`, {
      method: 'POST',
      body: JSON.stringify(gatewayData),
    });
  }
};

// Coupons APIs
export const couponsAPI = {
  getAll: async () => {
    return fetchAPI('/coupons');
  },
  create: async (couponData: any) => {
    return fetchAPI('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  },
  validate: async (code: string) => {
    return fetchAPI('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }
};

// Enrollments APIs
export const enrollmentsAPI = {
  getMy: async () => {
    return fetchAPI('/enrollments/my');
  },
  getAll: async () => {
    return fetchAPI('/enrollments');
  },
  grantAccess: async (grantData: { studentEmail: string; courseId: string; courseName: string }) => {
    return fetchAPI('/enrollments/grant', {
      method: 'POST',
      body: JSON.stringify(grantData),
    });
  },
  updateProgress: async (progressData: { courseId: string; progress: number }) => {
    return fetchAPI('/enrollments/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }
};

// Users APIs
export const usersAPI = {
  getAll: async () => {
    return fetchAPI('/users');
  },
  updateStatus: async (id: string, status: 'Active' | 'Suspended') => {
    return fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
};

// Payments APIs
export const paymentsAPI = {
  getTransactions: async () => {
    return fetchAPI('/payments/transactions');
  },
  createRazorpayOrder: async (courseId: string, couponCode?: string) => {
    return fetchAPI('/payments/razorpay/order', {
      method: 'POST',
      body: JSON.stringify({ courseId, couponCode }),
    });
  },
  verifyRazorpayPayment: async (verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    courseId: string;
  }) => {
    return fetchAPI('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }
};
