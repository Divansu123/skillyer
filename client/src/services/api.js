import axios from "axios";

// const API = axios.create({ baseURL: '/api' });

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillyer_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Courses
export const fetchCourses = (params) => API.get("/courses", { params });
export const fetchCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Categories
export const fetchCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Providers
export const fetchProviders = () => API.get("/providers");
export const createProvider = (data) => API.post("/providers", data);
export const updateProvider = (id, data) => API.put(`/providers/${id}`, data);
export const deleteProvider = (id) => API.delete(`/providers/${id}`);

// Jobs
export const fetchJobs = (params) => API.get("/jobs", { params });
export const createJob = (data) => API.post("/jobs", data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Enrollments
export const fetchEnrollments = (params) => API.get("/enrollments", { params });
export const createEnrollment = (data) => API.post("/enrollments", data);
export const updateEnrollmentStatus = (id, status) =>
  API.put(`/enrollments/${id}/status`, { status });
export const updateEnrollment = (id, data) =>
  API.put(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => API.delete(`/enrollments/${id}`);

// Applications — uses FormData for file upload
export const fetchApplications = (params) =>
  API.get("/applications", { params });
export const createApplication = (formData) =>
  API.post("/applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => API.delete(`/applications/${id}`);

// Counsel
export const fetchCounselRequests = (params) => API.get("/counsel", { params });
export const createCounselRequest = (data) => API.post("/counsel", data);
export const updateCounselStatus = (id, status) =>
  API.put(`/counsel/${id}/status`, { status });

// Testimonials
export const fetchTestimonials = () => API.get("/testimonials");

// ROI
export const fetchRoiData = () => API.get("/roi");

// Admin
export const adminLogin = (data) => API.post("/admin/login", data);
export const fetchAdminStats = () => API.get("/admin/stats");
export const fetchRecentActivity = () => API.get("/admin/recent-activity");

export default API;
