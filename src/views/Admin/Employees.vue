<template>
  <div>
    <h1 class="admin-page__title">Quản lý nhân viên</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container">
        <el-input
          v-model="searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm nhân viên theo MSNV và họ tên"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>

      <div class="admin-page__heading--right">
        <Button v-if="selectedRows.length" class="btn btn--danger" @click="deleteSelectedEmployees"
        >
          <el-icon class="btn--nicer">
            <Delete/>
          </el-icon>
          <span>Xóa các NV đã chọn</span>
        </Button>
        <Button class="btn btn--primary" @click="openCreateModal">
          <el-icon class="btn--nicer">
            <Plus/>
          </el-icon>
          <span>Thêm nhân viên</span>
        </Button>
        <Button class="btn btn--success" @click="openImportModal">
          <el-icon class="btn--nicer">
            <Upload/>
          </el-icon>
          <span>Import danh sách NV</span>
        </Button>
      </div>
    </div>
    <Table :columns="columns" :data="employees" :loading="fetchLoading" @selection-change="handleSelectionChange">
      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditDialog(row)">
            <img alt="Edit" src="@/assets/img/Admin/edit.svg"/>
          </el-button>
          <div class="divider"></div>
          <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
            <img alt="Delete" src="@/assets/img/Admin/delete.svg"/>
          </el-button>
        </div>

      </template>
    </Table>

    <Pagination
      :pagination="pagination"
      @changePage="handlePageChange"
    />

    <!-- Delete confirm modal -->
    <Modal
      :title="'Xác nhận xóa'"
      :visible="deleteConfirmVisible"
      style="width: 500px"
      @submit="confirmDelete"
      @update:visible="deleteConfirmVisible = $event"
    >
      <span>Bạn có chắc chắn muốn xóa nhân viên này?</span>
    </Modal>

    <!-- Delete selected confirm modal -->
    <Modal
      :title="'Xác nhận xóa'"
      :visible="deleteSelectedConfirmVisible"
      style="width: 500px"
      @submit="confirmDeleteSelectedEmployees"
      @update:visible="deleteSelectedConfirmVisible = $event"
    >
      <span>Bạn có chắc chắn muốn xóa những nhân viên này?</span>
    </Modal>

    <!-- Edit modal -->
    <Modal
      :formRef="editFormRef"
      :title="'Chỉnh sửa nhân viên'"
      :visible="editModalVisible"
      style="width: 600px"
      @submit="confirmEdit"
      @update:visible="editModalVisible = $event"
    >
      <el-form
        ref="editFormRef"
        :model="editEmployee"
        :rules="formRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item label="Mã nhân viên" prop="employee_code">
          <el-input v-model="editEmployee.employee_code"></el-input>
        </el-form-item>
        <el-form-item label="Tên nhân viên" prop="full_name">
          <el-input v-model="editEmployee.full_name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editEmployee.email"></el-input>
        </el-form-item>
      </el-form>
    </Modal>

    <!--  Add new employee modal  -->
    <Modal
      :formRef="createFormRef"
      :title="'Thêm nhân viên'"
      :visible="createModalVisible"
      style="width: 600px"
      @close="resetCreateForm"
      @submit="confirmCreate"
      @update:visible="createModalVisible = $event"
    >
      <el-form
        ref="createFormRef"
        :model="newEmployee"
        :rules="formRules"
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item label="Mã nhân viên" prop="employee_code">
          <el-input v-model="newEmployee.employee_code"></el-input>
        </el-form-item>
        <el-form-item label="Tên nhân viên" prop="full_name">
          <el-input v-model="newEmployee.full_name"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="newEmployee.email"></el-input>
        </el-form-item>
      </el-form>
    </Modal>

    <!--  Add file Excel import employees -->
    <Modal
      :title="'Import danh sách nhân viên'"
      :visible="importModalVisible"
      class="big-modal"
      @submit="confirmImport"
      @update:visible="importModalVisible = $event"
    >
      <el-upload
        ref="upload"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleFileChange"
        action=""
        class="upload-demo"
        drag
        multiple
        accept=".csv, .xlsx"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">
          Kéo file vào đây <em>hoặc ấn để tải lên</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            <div>Chỉ tải lên file .csv</div>
            <div> Nội dung file gồm 3 cột: Mã nhân viên, Tên nhân viên và Email</div>
          </div>
        </template>
      </el-upload>

      <!-- Upload summary -->
      <div v-if="csvData.length" class="upload-summary">
        <p>Tổng số nhân viên tạo mới: {{ csvData.length }}</p>
        <p>Tổng số lỗi trong file: {{ totalErrors }}</p>
      </div>

      <!-- CSV Preview Table -->
      <el-table v-if="csvData.length" :data="paginatedCsvData" border class="preview-table">
        <el-table-column label="Mã nhân viên" prop="employee_code"></el-table-column>
        <el-table-column label="Tên nhân viên" prop="full_name"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="Lỗi">
          <template #default="scope">
            <div v-if="scope.row.errors.length">
              <ul>
                <li v-for="(error, index) in scope.row.errors" :key="index" class="error-message">{{ error }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-if="csvData.length"
        :pagination="modalPagination"
        @changePage="handleModalPageChange"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployeeCodes,
  getAllEmployeesEmails,
  getEmployees,
  importEmployees,
  updateEmployee
} from "@/services/Admin/employeeService";
import Table from "@/components/Admin/Common/Table.vue";
import Button from "@/components/Admin/Common/Button.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import Modal from "@/components/Admin/Common/Modal.vue";
import {notifyError, notifySuccess} from "@/composables/notifications";
import {UploadFilled} from '@element-plus/icons-vue';
import Papa from 'papaparse';

// Error handling function
const handleError = (error: any, context: string) => {
  console.error(`Error during ${context}:`, error);
  if (error.response && error.response.status === 422) {
    const validationErrors = error.response.data.errors;
    console.error('Validation errors:', validationErrors);
    Object.values(validationErrors).forEach((messages: string[]) => {
      messages.forEach((message: string) => notifyError(message));
    });
  } else {
    notifyError(`An error occurred during ${context}`);
  }
};


const perPage = ref<number>(12);
const employees = ref([]);
const searchTerm = ref<string>("");
const pagination = ref({
  current_page: 1,
  total: 0,
  total_pages: 1,
  per_page: perPage.value
});

const modalPagination = ref({
  current_page: 1,
  total: 0,
  total_pages: 1,
  per_page: 10
});

const fetchLoading = ref(true);
const deleteConfirmVisible = ref(false);
const editModalVisible = ref(false);
const createModalVisible = ref(false);
const importModalVisible = ref(false);
const deleteSelectedConfirmVisible = ref(false);
const employeeIdToDelete = ref<number | null>(null);
const editFormRef = ref(null);
const createFormRef = ref(null);
const fileList = ref([]);
const csvData = ref([]);
const paginatedCsvData = ref([]);
const selectedRows = ref([]);

const editEmployee = ref({
  id: null,
  employee_code: "",
  full_name: "",
  email: ""
});

const newEmployee = reactive({
  employee_code: "",
  full_name: "",
  email: ""
});

const formRules = ref({
  employee_code: [
    {required: true, message: "Mã nhân viên không được để trống", trigger: ["blur", "change"]},
    {
      pattern: /^K\d{4}$/,
      message: "Mã nhân viên phải có định dạng K####, không vượt quá K9999",
      trigger: ["blur", "change"]
    }
  ],
  full_name: [
    {required: true, message: "Tên nhân viên không được để trống", trigger: ["blur", "change"]}
  ],
  email: [
    {
      required: true,
      message: "Email không được để trống",
      trigger: ["blur", "change"]
    },
    {
      pattern: /^(kiaisoft\..+|.+@kiaisoft\.com)$/,
      message: "Email không hợp lệ. Cần có hậu tố \"@kiaisoft.com\" hoặc tiền tố \"kiaisoft.\"",
      trigger: ["blur", "change"]
    }
  ]
});

const handlePageChange = (page: number) => {
  pagination.value.current_page = page;
  fetchEmployees();
};

const handleModalPageChange = async (page: number) => {
  modalPagination.value.current_page = page;
  const start = (page - 1) * modalPagination.value.per_page;
  const end = start + modalPagination.value.per_page;
  modalPagination.value.total = csvData.value.length;
  modalPagination.value.total_pages = Math.ceil(modalPagination.value.total / modalPagination.value.per_page);
  paginatedCsvData.value = csvData.value.slice(start, end);
};

const handleFileChange = (file) => {
  fileList.value = [file.raw];
  parseCSV(file.raw);
};

const parseCSV = async (file) => {
  const existingEmployeeCodes = await getAllEmployeeCodes();
  const existingEmails = await getAllEmployeesEmails();
  const seenEmployeeCodes = new Set();
  const seenEmails = new Set();

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const normalizedData = results.data.map(row => {
        return {
          'employee_code': row['Mã nhân viên'] || row['employee_code'],
          'full_name': row['Tên nhân viên'] || row['full_name'],
          'email': row['Email'] || row['email']
        };
      });

      csvData.value = normalizedData
        .filter(row => row.employee_code || row.full_name || row.email)
        .map((row, index) => {
          const errors = validateRow(row, existingEmployeeCodes, existingEmails, seenEmployeeCodes, seenEmails);
          return {
            ...row,
            errors
          };
        });

      handleModalPageChange(1);
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
      notifyError("Lỗi khi phân tích tệp CSV");
    }
  });
};

const validateRow = (row, existingEmployeeCodes, existingEmails, seenEmployeeCodes, seenEmails) => {
  const errors = [];
  if (!row.employee_code) {
    errors.push(`Thiếu mã nhân viên.`);
  } else if (!/^K\d{1,4}$/.test(row.employee_code)) {
    errors.push(`Mã nhân viên không hợp lệ. Cần có định dạng "K" theo sau bởi 4 chữ số.`);
  } else if (existingEmployeeCodes.includes(row.employee_code) || seenEmployeeCodes.has(row.employee_code)) {
    errors.push(`Mã nhân viên đã tồn tại.`);
  } else {
    seenEmployeeCodes.add(row.employee_code);
  }

  if (!row.full_name) {
    errors.push(`Thiếu tên nhân viên.`);
  }

  if (!row.email) {
    errors.push(`Thiếu email.`);
  } else if (!/^(kiaisoft\..+|.+@kiaisoft\.com)$/.test(row.email)) {
    errors.push(`Email không có hậu tố "@kiaisoft.com" hoặc tiền tố "kiaisoft."`);
  } else if (existingEmails.includes(row.email) || seenEmails.has(row.email)) {
    errors.push(`Email đã tồn tại.`);
  } else {
    seenEmails.add(row.email);
  }

  return errors;
};

const totalErrors = computed(() => {
  return csvData.value.reduce((acc, row) => acc + (row.errors ? row.errors.length : 0), 0);
});

const columns = [
  {prop: "employee_code", label: "Mã nhân viên", width: 250},
  {prop: "full_name", label: "Họ tên", width: 370},
  {prop: "email", label: "Email", width: 500},
  {prop: "actions", label: "Hành động", width: 125, align: "center"}
];

const fetchEmployees = async () => {
  fetchLoading.value = true;
  try {
    const response = await getEmployees(searchTerm.value.trim(), perPage.value, pagination.value.current_page);
    employees.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
  fetchLoading.value = false;
};

const handleSearch = async () => {
  pagination.value.current_page = 1;
  try {
    await fetchEmployees();
  } catch (error) {
    console.error("Failed to search employees:", error);
  } finally {
    fetchLoading.value = false;
  }
};

const openCreateModal = () => {
  newEmployee.full_name = "";
  newEmployee.email = "";
  createFormRef.value?.resetFields();
  createModalVisible.value = true;
};

const openImportModal = () => {
  fileList.value = [];
  csvData.value = [];
  importModalVisible.value = true;
};

const resetCreateForm = () => {
  newEmployee.employee_code = "";
  newEmployee.full_name = "";
  newEmployee.email = "";
  createFormRef.value?.resetFields();
};

const openEditDialog = (employee: any) => {
  editEmployee.value = {...employee};
  editModalVisible.value = true;
};

const openDeleteConfirm = (employeeId: number) => {
  employeeIdToDelete.value = employeeId;
  deleteConfirmVisible.value = true;
};

const confirmDelete = async () => {
  if (employeeIdToDelete.value !== null) {
    try {
      await deleteEmployee(employeeIdToDelete.value);
      notifySuccess('Nhân viên được xóa thành công');
      await fetchEmployees();
    } catch (error) {
      notifyError('Xóa nhân viên thất bại!');
      console.error('Failed to delete employee:', error);
    } finally {
      deleteConfirmVisible.value = false;
    }
  }
};

const confirmEdit = async () => {
  if (editEmployee.value.id !== null) {
    try {
      await editFormRef.value.validate();
      await updateEmployee(editEmployee.value.id, editEmployee.value);
      notifySuccess('Nhân viên được cập nhật thành công');
      await fetchEmployees();
    } catch (error) {
      handleError(error, 'updating employee');
    } finally {
      editModalVisible.value = false;
    }
  }
};

const confirmCreate = async () => {
  try {
    await createEmployee(newEmployee);
    notifySuccess('Nhân viên được thêm thành công');
    await fetchEmployees();
    createModalVisible.value = false;
  } catch (error) {
    handleError(error, 'creating employee');
  }
};

const confirmImport = async () => {
  if (fileList.value.length === 0) {
    notifyError('Vui lòng chọn file để import');
    return;
  }

  const hasErrors = csvData.value.some(row => row.errors && row.errors.length > 0);
  if (hasErrors) {
    notifyError('Không thể import vì có lỗi trong file');
    return;
  }

  try {
    const response = await importEmployees(fileList.value[0]);

    if (response.errors) {
      Object.keys(response.errors).forEach((rowIndex) => {
        const errors = response.errors[rowIndex];
        if (csvData.value[rowIndex - 1]) {
          csvData.value[rowIndex - 1].errors = errors;
        }
        errors.forEach((error) => notifyError(`Row ${rowIndex}: ${error}`));
      });
      return;
    } else {
      notifySuccess("Import danh sách nhân viên thành công");
      importModalVisible.value = false;
      await fetchEmployees();
    }
  } catch (error) {
    console.error('Failed to import employees:', error);
    notifyError('Import danh sách nhân viên thất bại');
  }
};

// Delete selected employees
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

const deleteSelectedEmployees = () => {
  if (selectedRows.value.length === 0) {
    notifyError('Không có nhân viên nào được chọn');
    return;
  }
  deleteSelectedConfirmVisible.value = true;
};

const confirmDeleteSelectedEmployees = async () => {
  try {
    for (const employee of selectedRows.value) {
      await deleteEmployee(employee.id);
    }
    notifySuccess('Nhân viên được xóa thành công');
    await fetchEmployees();
  } catch (error) {
    notifyError('Xóa nhân viên thất bại!');
    console.error('Error deleting selected employees:', error);
  } finally {
    deleteSelectedConfirmVisible.value = false;
  }
};

onMounted(fetchEmployees);
</script>

<style lang="scss" scoped>
ol, ul {
  list-style: none;
  padding: 0;
}

.error-message {
  font-size: 14px !important;
}
</style>

<style lang="scss">
.el-upload-list__item {
  font-weight: 700;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 5px 7px 5px;
}

.preview-table {
  margin-top: 15px;
}

.upload-summary {
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
