import axiosInstance from "@/utils/axiosInstance";
import {notifyError} from "@/composables/notifications";

export interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const getEmployees = async (searchTerm: string = '', perPage, page): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get("/admin/employees", {
      params: {
        search_term: searchTerm,
        per_page: perPage,
        page: page
      },
    });
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await axiosInstance.get(`/admin/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee with id ${id}:`, error);
    throw error;
  }
};

export const getAllEmployeesEmails = async () => {
  try {
    const response = await axiosInstance.get('/admin/employees/emails');
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('No emails data found in response');
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch all employees' emails:", error);
    return [];
  }
};

export const getAllEmployeeCodes = async () => {
  try {
    const response = await axiosInstance.get('/admin/employees/codes');
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('No employee codes data found in response');
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch employee codes:', error);
    return [];
  }
};

export const createEmployee = async (employee: Partial<Employee>): Promise<Employee> => {
  try {
    console.log('Sending API request with data:', employee);
    const response = await axiosInstance.post("/admin/employees", employee);
    return response.data;
  } catch (error) {
    console.error("Failed to create employee:", error);
    throw error;
  }
};
export const updateEmployee = async (id: number, employee: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await axiosInstance.put(`/admin/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 422) {
       console.error('Failed to update employee', error.response.data);
    } else {
      console.error('Failed to update employee');
    }
    throw error;
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/employees/${id}`);
  } catch (error) {
    console.error(`Failed to delete employee with id ${id}:`, error);
    throw error;
  }
};

export const importEmployees = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/admin/employees/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.message;
  } catch (error) {
    console.error("Failed to import employees:", error);
    throw error;
  }
};
