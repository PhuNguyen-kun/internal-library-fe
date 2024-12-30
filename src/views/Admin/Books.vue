<template>
  <div>
    <h1 class="admin-page__title">Quản lý sách</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container" style="width: 550px">
        <el-input
          v-model="bookStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm sách theo tên sách, tên tác giả, nhà xuất bản, danh mục, mô tả"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>
      </div>
      <div class="admin-page__heading--right">
        <Button v-if="selectedRows.length" class="btn btn--danger" @click="openDeleteSelectedConfirm"
        >
          <el-icon class="btn--nicer">
            <Delete/>
          </el-icon>
          <span>Xóa các mục đã chọn</span>
        </Button>
        <Button class="btn btn--primary" @click="openCreateModal">
          <el-icon class="btn--nicer" style="margin-top: -3px;">
            <Plus/>
          </el-icon>
          <span>Thêm sách</span>
        </Button>
      </div>
    </div>

    <Table :columns="columns" :data="bookStore.books" :loading="fetchLoading"
           @selection-change="handleSelectionChange">
      <template #image_url="{ row }">
        <img :src="row.image_url" alt="Book Image" style="width: 98px; height: auto; object-fit: cover">
      </template>

      <template #author="{ row }">
        <el-tag
          v-for="(author, index) in row.author"
          :key="index"
          effect="light"
          style="margin: 0 5px 5px 0;"
          type="primary"
        >
          {{ author }}
        </el-tag>
      </template>

      <template #category="{ row }">
        <el-tag
          v-for="(category, index) in row.category"
          :key="index"
          style="margin: 0 5px 5px 0;"
          type="warning"
        >
          {{ category }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link size="small" type="primary" @click="openEditModal(row)">
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
      :pagination="bookStore.pagination"
      @changePage="(page: number) => bookStore.handlePageChange(page)"
    />
  </div>

  <Modal
    :formRef="bookStore.formRef"
    :title="bookStore.modalTitle"
    :visible="isModalVisible"
    class="big-modal"
    style="width: 700px"
    @close="bookStore.resetForm"
    @submit="handleSubmit"
    @update:visible="isModalVisible = $event"
  >
    <el-form
      ref="bookFormRef"
      :model="book"
      :rules="formRules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Tên sách" prop="title">
        <el-input v-model="book.title" placeholder="Nhập tên sách"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="image">
        <el-upload
          :auto-upload="false"
          :file-list="uploadFileList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-change="handleFileChange"
          action="#"
          list-type="picture-card"
          :limit="1"
          :show-file-list="true"
        >
          <el-icon>
            <Plus/>
          </el-icon>
          <template #file="{ file }">
            <div>
              <img :src="file.url" alt="" class="el-upload-list__item-thumbnail"/>
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <el-icon><zoom-in/></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download/></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete/></el-icon>
                </span>
              </span>
            </div>
          </template>

        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img :src="dialogImageUrl" alt="Preview Image" w-full/>
        </el-dialog>
      </el-form-item>
      <el-form-item label="Tác giả" prop="author">
        <el-select
          v-model="book.author"
          multiple
          placeholder="Chọn tác giả"
          style="width: 100%;"
        >
          <el-option
            v-for="item in bookStore.authors"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Nhà xuất bản" prop="publisher">
        <el-select
          v-model="book.publisher"
          placeholder="Chọn nhà xuất bản"
          style="width: 100%;"
        >
          <el-option
            v-for="item in bookStore.publishers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Danh mục" prop="category">
        <el-select
          v-model="book.category"
          multiple
          placeholder="Chọn danh mục"
          style="width: 100%;"
        >
          <el-option
            v-for="item in bookStore.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Số lượng" prop="stock_quantity">
        <el-input-number
          v-model="book.stock_quantity"
          :min="0"
          placeholder="Nhập số lượng"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Số trang" prop="page">
        <el-input-number
          v-model="book.page"
          :min="1"
          placeholder="Nhập số trang"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Mô tả ngắn" prop="short_description">
        <el-input v-model="book.short_description" placeholder="Nhập mô tả ngắn" rows="4" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả đầy đủ" prop="description">
        <el-input v-model="book.description" placeholder="Nhập mô tả đầy đủ" rows="6" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </Modal>

  <Modal
    :title="'Xác nhận xóa'"
    :visible="deleteConfirmVisible"
    style="width: 500px"
    @submit="handleDelete"
    @update:visible="deleteConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn xóa sách này?</span>
  </Modal>

  <Modal
    :title="'Xác nhận xóa'"
    :visible="deleteSelectedConfirmVisible"
    style="width: 500px"
    @submit="confirmDeleteSelectedBooks"
    @update:visible="deleteSelectedConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn xóa sách này?</span>
  </Modal>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {Book} from "@/types/Admin/book";
import Modal from "@/components/Admin/Common/Modal.vue";
import {useBookStore} from "@/stores/Admin/book.store";
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'
import type {UploadFile} from 'element-plus'
import {notifyError} from "@/composables/notifications";

const bookStore = useBookStore();
const fetchLoading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
const columns = [
  {prop: "title", label: "Tên sách", width: 200, type: "string", fixed: "left"},
  {prop: "image_url", label: "Ảnh", width: 200, align: "center"},
  {prop: "author", label: "Tác giả", width: 300, type: "string"},
  {prop: "publisher", label: "Nhà xuất bản", width: 210},
  {prop: "category", label: "Danh mục", width: 200},
  {prop: "stock_quantity", label: "Số lượng", width: 100, align: "center"},
  {prop: "page", label: "Số trang", width: 170, align: "center"},
  {prop: "short_description", label: "Mô tả ngắn", width: 300, lineClamp: 2},
  {prop: "description", label: "Mô tả đầy đủ", width: 400, lineClamp: 2},
  {prop: "actions", label: "Hành động", width: 125, align: "center", fixed: "right"}
];

const formRules = {
  title: [
    {required: true, message: 'Tiêu đề không được để trống', trigger: 'blur'},
    {
      max: 255,
      message: 'Tiêu đề không vượt quá 255 ký tự',
      trigger: 'blur'
    }
  ],
  image: [{required: true, message: 'Không được để trống ánh', trigger: 'change'}],
  author: [
    {required: true, message: 'Tác giả không được để trống', trigger: 'blur'},
  ],
  publisher: [
    {required: true, message: 'Không để trống tên nhà xuất bản', trigger: 'blur'},
  ],
  category: [
    {required: true, message: 'Không để trống tên danh mục', trigger: 'blur'},
  ],
  stock_quantity: [
    {required: true, message: 'Không để trống số lượng', trigger: 'blur'},
    {type: 'number', message: 'Số lượng phải là số', trigger: 'blur'}
  ],
  page: [
    {required: true, message: 'Không để trống số trang', trigger: 'blur'},
    {type: 'number', message: 'Số trang phải là số', trigger: 'blur'}
  ],
  short_description: [
    {required: true, message: 'Không để trống mô tả ngắn', trigger: 'blur'},
    {max: 255, message: 'Mô tả ngắn không vượt quá 255 ký tự'}
  ],
  description: [
    {required: true, message: 'Không để trống mô tả đầy đủ', trigger: 'blur'},
    {max: 255, message: 'Mô tả đầy đủ không vượt quá 255 ký tự'}
  ]
}

const book = reactive({
  id: 0,
  title: "",
  author: "",
  publisher: "",
  category: "",
  stock_quantity: 0,
  page: 0,
  short_description: "",
  description: "",
  image_url: "",
})

// Preview image
const uploadFileList = ref<UploadFile[]>([]);
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log("Removed file:", file);
  uploadFileList.value = [];
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList;
  console.log('File list updated:', uploadFileList.value);
};

const handleExceed = () => {
  notifyError("Chỉ được tải lên 1 avatar"!);
};

// Modal
const resetUploadFileList = () => {
  uploadFileList.value = [];
};

const openCreateModal = () => {
  bookStore.modalTitle = "Thêm sách";
  isModalVisible.value = true;

  Object.assign(book, {
    id: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    stock_quantity: "",
    page: "",
    short_description: "",
    description: "",
    image_url: "",
  });

  resetUploadFileList();
};

const openEditModal = (selectedBook: Book) => {
  bookStore.selectedBook = selectedBook;
  console.log(selectedBook);

  Object.assign(book, {
    id: selectedBook.id,
    title: selectedBook.title,
    image_url: selectedBook.image_url,
    author: selectedBook.author,
    publisher: selectedBook.publisher,
    category: selectedBook.category,
    stock_quantity: selectedBook.stock_quantity,
    page: selectedBook.page,
    short_description: selectedBook.short_description,
    description: selectedBook.description
  });

  uploadFileList.value = [
    {
      name: selectedBook.title || "Book Image",
      url: selectedBook.image_url,
    },
  ];

  bookStore.modalTitle = "Chỉnh sửa sách";
  isModalVisible.value = true;
};

// Delete confirm
const deleteConfirmVisible = ref<boolean>(false);
const deleteBookId = ref();
const openDeleteConfirm = (id: number) => {
  deleteBookId.value = id;
  deleteConfirmVisible.value = true;
  console.log(deleteBookId.value);
};
const handleDelete = () => {
  if (deleteBookId.value) {
    bookStore.deleteBook(deleteBookId.value);
    deleteConfirmVisible.value = false;
  }
};

// Delete selected
const selectedRows = ref([]);
const deleteSelectedConfirmVisible = ref<boolean>(false);
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  console.log(selectedRows.value);
};

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true;
}

const confirmDeleteSelectedBooks = async () => {
  const selectedIds = selectedRows.value.map((book: any) => book.id);
  await bookStore.deleteSelectedBooks(selectedIds);
  deleteSelectedConfirmVisible.value = false;
};

const handleSearch = async () => {
  bookStore.pagination.current_page = 1;
  await bookStore.fetchBooks();
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('title', book.title);
  formData.append('author', book.author.join(', '));
  formData.append('category', book.category.join(', '));
  formData.append('publisher', book.publisher);
  formData.append('stock_quantity', book.stock_quantity);
  formData.append('page', book.page);
  formData.append('short_description', book.short_description);
  formData.append('description', book.description);

  console.log('Upload File List:', uploadFileList.value);

  if (uploadFileList.value.length > 0 && uploadFileList.value[0].raw) {
    const rawFile = uploadFileList.value[0].raw;
    formData.append('imageFile', rawFile);
    console.log('Added imageFile:', rawFile);
    console.log('File type:', rawFile.type);
  } else {
    console.log('Không có file avatar mới để upload.');
  }


  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    if (bookStore.selectedBook) {
      await bookStore.updateBook(book.id, formData); // Gửi payload
    } else {
      await bookStore.createBook(formData);
    }
    bookStore.resetForm();
    isModalVisible.value = false;
  } catch (error) {
    notifyError('Có lỗi xảy ra khi lưu dữ liệu.');
  }
};

onMounted( () => {
  bookStore.fetchBooks();
  bookStore.fetchAuthorsCategoriesPublishers()
});

watch(isModalVisible, (value) => {
  if (value) {
    if (!bookStore.selectedBook) {
      Object.assign(book, {
        id: "",
        title: "",
        author: "",
        publisher: "",
        category: "",
        stock_quantity: "",
        page: "",
        short_description: "",
        description: "",
        image_url: "",
      });
    }
  } else {
    bookStore.resetForm();
  }
});

</script>
