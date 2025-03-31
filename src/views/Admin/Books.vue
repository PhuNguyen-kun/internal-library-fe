<template>
  <div>
    <h1 class="admin-page__title">Quản lý sách</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container" style="width: 700px">
        <el-input
          v-model="bookStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm theo tên sách"
          @change="handleSearch"
        />

        <button class="admin-icon-white" @click="toggleFilter">
          <el-icon size="medium"><Filter/></el-icon>
        </button>

        <transition name="fade-popover">
        <div
          v-show="filterVisible"
          ref="filterPopoverRef"
          class="custom-popover"
        >
          <div class="popover-inner">
            <el-select v-model="tempFilters.author" clearable filterable multiple placeholder="Chọn tác giả"
                       style="width: 100%; margin-bottom: 10px;">
              <el-option
                v-for="item in bookStore.authors"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-select v-model="tempFilters.publisher" clearable filterable multiple placeholder="Chọn NXB"
                       style="width: 100%; margin-bottom: 10px;">
              <el-option
                v-for="item in bookStore.publishers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-select v-model="tempFilters.category" clearable filterable multiple placeholder="Chọn danh mục"
                       style="width: 100%;">
              <el-option
                v-for="item in bookStore.categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-checkbox
              v-model="tempIncludeDeleted"
              size="default"
              style="margin-top: 15px"
            >
              Bao gồm sách đã xóa
            </el-checkbox>

            <div style="text-align: right;">
              <el-button size="small" @click="resetFilters">Xóa lọc</el-button>
              <el-button size="small" type="primary" @click="applyFilters">Áp dụng</el-button>
            </div>
          </div>
        </div>
        </transition>

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
        <Button v-if="selectedRows.length" class="btn btn--success" @click="openRestoreSelectedConfirm"
        >
          <el-icon class="btn--nicer">
            <RefreshLeft/>
          </el-icon>
          <span>Khôi phục các mục đã chọn</span>
        </Button>
        <Button class="btn btn--primary" @click="openCreateModal">
          <el-icon class="btn--nicer" style="margin-top: -3px;">
            <Plus/>
          </el-icon>
          <span>Thêm sách</span>
        </Button>
      </div>
    </div>

    <Table :columns="bookStore.columns" :data="bookStore.books" :loading="fetchLoading"
           :row-class-name="getRowClass" @selection-change="handleSelectionChange">
      <template #image_url="{ row }">
        <div class="image" style="width: 98px; height: 98px; margin: 0 auto">
          <img :src="row.image_url" alt="Book Image" style="width: 80px; height: 100px; object-fit: cover">
        </div>
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
          <el-button
            v-if="row.deleted_at"
            size="small"
            type="text"
            @click="bookStore.restoreBook(row.id)"
          >
            Khôi phục
          </el-button>
          <template v-else>
            <el-button link size="small" type="primary" @click="openEditModal(row)">
              <img alt="Edit" src="@/assets/img/Admin/edit.svg"/>
            </el-button>
            <div class="divider"></div>
            <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
              <img alt="Delete" src="@/assets/img/Admin/delete.svg"/>
            </el-button>
          </template>
        </div>
      </template>
    </Table>

    <Pagination
      :pagination="bookStore.pagination"
      @changePage="(page: number) => bookStore.handlePageChange(page)"
    />
  </div>

  <Modal
    :formRef="bookFormRef"
    :title="modalTitle"
    :visible="isModalVisible"
    class="big-modal"
    style="width: 830px"
    @close="resetBookForm"
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
        <el-input v-model="book.title" placeholder="Nhập tên sách"
                  @input="book.title=book.title.trimStart()"></el-input>
      </el-form-item>
      <el-form-item label="Thumbnail" prop="image_url">
        <el-upload
          :auto-upload="false"
          :file-list="uploadFileList"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :show-file-list="true"
          accept=".png, .jpeg, .webp, .jpg"
          action="#"
          list-type="picture-card">
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

      <el-form-item label="Ảnh phụ" prop="additional_images">
        <el-upload
          :auto-upload="false"
          :file-list="uploadAdditionalFileList"
          :limit="4"
          :on-change="handleAdditionalFileChange"
          :on-exceed="handleAdditionalFileExceed"
          :on-remove="handleAdditionalFileRemove"
          :show-file-list="true"
          accept="image/png, image/jpeg"
          action="#"
          list-type="picture-card"
          multiple>
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="Tác giả" prop="author">
        <el-select
          v-model="book.author"
          filterable
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
          filterable
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
          filterable
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
      <el-row>
        <el-col :span="9">
          <el-form-item label="Năm xuất bản" prop="published_year">
            <el-date-picker
              v-model="book.published_year"
              :disabledDate="time => time.getFullYear() < 1901 || time.getTime() > Date.now()"
              placeholder="Chọn năm xuất bản"
              type="year"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Số lượng" prop="stock_quantity">
            <el-input-number
              v-model="book.stock_quantity"
              :max="100"
              :min="1"
              controls-position="right"
              placeholder="Nhập số lượng"
              step-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Số trang" prop="page">
            <el-input-number
              v-model="book.page"
              :max="10000"
              :min="1"
              controls-position="right"
              placeholder="Nhập số trang"
              step-strictly
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Mô tả ngắn" prop="short_description">
        <!--        <el-input v-model="book.short_description" placeholder="Nhập mô tả ngắn" rows="4" type="textarea"></el-input>-->
        <ckeditor
          v-model="book.short_description"
          :config="config"
          :editor="editor"
        />

      </el-form-item>
      <el-form-item label="Mô tả đầy đủ" prop="description">
        <!-- <el-input v-model="book.description" placeholder="Nhập mô tả đầy đủ" rows="6" type="textarea"></el-input> -->
        <ckeditor
          v-model="book.description"
          :config="config"
          :editor="editor"
        />
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
  <Modal
    :title="'Xác nhận khôi phục'"
    :visible="restoreSelectedConfirmVisible"
    style="width: 500px"
    @submit="confirmRestoreSelectedBooks"
    @update:visible="restoreSelectedConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn khôi phục sách này?</span>
  </Modal>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch, onBeforeUnmount} from "vue";
import Button from "@/components/Admin/Common/Button.vue";
import Table from "@/components/Admin/Common/Table.vue";
import Pagination from "@/components/Admin/Common/Pagination.vue";
import type {Book} from "@/types/Admin/book";
import Modal from "@/components/Admin/Common/Modal.vue";
import {useBookStore} from "@/stores/Admin/book.store";
import {Delete, Plus, ZoomIn} from '@element-plus/icons-vue'
import type {UploadFile} from 'element-plus'
import {notifyError} from "@/composables/notifications";
import {Ckeditor} from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ref(ClassicEditor)
const bookStore = useBookStore();
const fetchLoading = ref<boolean>(false);
const isAllDeleted = ref(false);
const isAllNotDeleted = ref(false);
const filterVisible = ref(false);
const filterPopoverRef = ref(null);

// const filters = reactive({
//   author: null,
//   publisher: null,
//   category: null,
// });

const toggleFilter = () => {
  filterVisible.value = !filterVisible.value;

  tempFilters.author = bookStore.filters.author;
  tempFilters.publisher = bookStore.filters.publisher;
  tempFilters.category = bookStore.filters.category;
  tempIncludeDeleted.value = bookStore.includeDeleted;
};

const tempIncludeDeleted = ref(false);

const tempFilters = reactive({
  author: null,
  publisher: null,
  category: null,
  includeDeleted: false,
});

const resetFilters = () => {
  tempFilters.author = null;
  tempFilters.publisher = null;
  tempFilters.category = null;
  tempIncludeDeleted.value = false;
};

const applyFilters = () => {
  bookStore.includeDeleted = tempIncludeDeleted.value;
  bookStore.setFilters(tempFilters);

  filterVisible.value = false;
  bookStore.pagination.current_page = 1;
  bookStore.fetchBooks();
};

// Xử lý click outside
// onMounted(() => {
//   document.addEventListener("click", handleClickOutside);
// });

// onBeforeUnmount(() => {
//   document.removeEventListener("click", handleClickOutside);
// });

const handleClickOutside = (event: MouseEvent) => {
  const popover = filterPopoverRef.value;
  if (popover && !popover.contains(event.target as Node)) {
    filterVisible.value = false;
  }
};

const config = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'bulletedList',
    'numberedList',
    'blockQuote'
  ]
}

const book = reactive({
  id: 0,
  title: "",
  author: "",
  publisher: "",
  category: "",
  published_year: "",
  stock_quantity: 0,
  page: 0,
  short_description: "",
  description: "",
  image_url: "",
  additional_images: "",
})

const formRules = {
  title: [
    {required: true, message: 'Tiêu đề không được để trống', trigger: 'blur'},
    {
      max: 255,
      message: 'Tiêu đề không vượt quá 255 ký tự',
      trigger: 'blur'
    }
  ],
  image_url: [{required: true, message: 'Không được để trống ảnh', trigger: 'change'}],
  additional_images: [{required: true, message: 'Không được để trống ảnh phụ', trigger: 'change'},
    {
      validator: (rule, value, callback) => {
        if (!uploadAdditionalFileList.value || uploadAdditionalFileList.value.length !== 4) {
          callback(new Error("Upload đủ 4 ảnh phụ."));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  author: [
    {required: true, message: 'Tác giả không được để trống', trigger: 'blur'},
  ],
  publisher: [
    {required: true, message: 'Không để trống tên nhà xuất bản', trigger: 'blur'},
  ],
  category: [
    {required: true, message: 'Không để trống tên danh mục', trigger: 'blur'},
  ],
  published_year: [
    {required: true, message: 'Không để trống năm xuất bản', trigger: 'blur'},
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
    {max: 1000, message: 'Mô tả ngắn không vượt quá 1000 ký tự'}
  ],
  description: [
    {required: true, message: 'Không để trống mô tả đầy đủ', trigger: 'blur'},
    {max: 100000, message: 'Mô tả đầy đủ không vượt quá 100000 ký tự'}
  ]
}

// Fetch deleted books
const getRowClass = ({row}: { row: Book }) => {
  return row.deleted_at ? "row-deleted" : "";
};

// Upload avatar
const uploadFileList = ref<UploadFile[]>([]);
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log("Removed file:", file);
  uploadFileList.value = [];
  book.image_url = "";
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList;
  book.image_url = fileList[0]?.url || "";
  console.log('File list updated:', uploadFileList.value);
};

const handleExceed = () => {
  notifyError("Chỉ được tải lên 1 avatar"!);
};

// Upload additional images
const uploadAdditionalFileList = ref<UploadFile[]>([]);

const handleAdditionalFileChange = (file, fileList) => {
  uploadAdditionalFileList.value = fileList;
  book.additional_images = fileList.map(f => f.url || f.raw);
};

const deletedImageIds = ref<number[]>([]);

const handleAdditionalFileRemove = (file: any) => {
  if (!file.raw) {
    deletedImageIds.value.push(parseInt(file.uid));
  }
  uploadAdditionalFileList.value = uploadAdditionalFileList.value.filter((f) => f.uid !== file.uid);
};

const handleAdditionalFileExceed = () => {
  notifyError("Chỉ được tải lên tối đa 4 ảnh phụ!");
};

// Reset file list
const resetAdditionalUploadFileList = () => {
  uploadAdditionalFileList.value = [];
};


// Modal
const modalTitle = ref<string>("");
const bookFormRef = ref();
const isModalVisible = ref<boolean>(false);
const resetBookForm = () => {
  bookFormRef.value?.resetFields();
  bookStore.selectedBook = null;
};

const resetUploadFileList = () => {
  uploadFileList.value = [];
};

const openCreateModal = () => {
  modalTitle.value = "Thêm sách";
  isModalVisible.value = true;

  Object.assign(book, {
    id: "",
    title: "",
    author: "",
    publisher: "",
    category: "",
    published_year: "",
    stock_quantity: "",
    page: "",
    short_description: "",
    description: "",
    image_url: "",
    additional_images: "",
  });

  resetUploadFileList();
  resetAdditionalUploadFileList();
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
    published_year: selectedBook.published_year,
    stock_quantity: selectedBook.stock_quantity,
    page: selectedBook.page,
    short_description: selectedBook.short_description,
    description: selectedBook.description,
    additional_images: selectedBook.additional_images,
  });

  uploadFileList.value = [
    {
      name: selectedBook.title || "Book Image",
      url: selectedBook.image_url,
    },
  ];

  uploadAdditionalFileList.value = selectedBook.additional_images.map((img) => ({
    uid: String(img.id),
    url: img.url,
    name: `Additional Image #${img.id}`,
    status: "done"
  }));

  modalTitle.value = "Chỉnh sửa sách";
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

// Restore selected
const restoreSelectedConfirmVisible = ref<boolean>(false);
const openRestoreSelectedConfirm = async () => {
  restoreSelectedConfirmVisible.value = true;
}

const confirmRestoreSelectedBooks = async () => {
  const selectedIds = selectedRows.value.map((book: any) => book.id);
  await bookStore.restoreSelectedBooks(selectedIds);
  restoreSelectedConfirmVisible.value = false;
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
  formData.append('stock_quantity', book.stock_quantity.toString());
  formData.append('page', book.page.toString());
  formData.append('published_year', new Date(book.published_year).getFullYear().toString());
  formData.append('short_description', book.short_description);
  formData.append('description', book.description);
  formData.append('deleted_image_ids', JSON.stringify(deletedImageIds.value));

  console.log('Upload File List:', uploadFileList.value);

  if (uploadFileList.value.length > 0 && uploadFileList.value[0].raw) {
    const rawFile = uploadFileList.value[0].raw;
    formData.append('imageFile', rawFile);
    console.log('Added imageFile:', rawFile);
    console.log('File type:', rawFile.type);
  } else {
    console.log('Không có file avatar mới để upload.');
  }

  // Existing image IDs
  const existingImageIds = uploadAdditionalFileList.value
    .filter(file => !file.raw)
    .map(file => file.uid);
  formData.append('existing_images', JSON.stringify(existingImageIds));

  if (uploadAdditionalFileList.value.length > 0) {
    uploadAdditionalFileList.value.forEach(file => {
      if (file.raw) {
        formData.append('additional_images[]', file.raw);
      }
    });
  }

  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  if (bookStore.selectedBook) {
    await bookStore.updateBook(book.id, formData);
  } else {
    await bookStore.createBook(formData);
  }
  resetBookForm();
  isModalVisible.value = false;
};

onMounted(() => {
  bookStore.fetchBooks();
  bookStore.fetchAuthorsCategoriesPublishers()
});

watch(() => book.page, (newValue) => {
  if (newValue > 10000) {
    book.page = 10000;
  } else if (newValue < 1) {
    book.page = 1;
  }
});

watch(() => book.stock_quantity, (newValue) => {
  if (newValue > 100) {
    book.stock_quantity = 100;
  } else if (newValue < 1) {
    book.stock_quantity = 1;
  }
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
        additional_images: "",
      });
    }
  } else {
    resetBookForm();
  }
});
</script>

<style lang="scss" scoped>
.admin-page__search-input {
  width: 300px;
}
</style>

<style lang="scss">
.el-upload-list__item {
  display: flex;
  justify-content: center;
}

.row-deleted {
  color: #c7c7c7;

  .image, .el-tag {
    opacity: 0.4;
  }
}

.ck-content {
  min-height: 200px !important;
}

.custom-popover {
  position: absolute;
  top: 200px; /* chỉnh theo vị trí nút filter */
  left: 270px; /* chỉnh lại tuỳ layout */
  z-index: 999;
  background-color: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 400px;
}

.popover-inner {
  max-height: 500px;
  overflow-y: auto;
}

.fade-popover-enter-active,
.fade-popover-leave-active {
  transition: all 0.25s ease;
}

.fade-popover-enter-from,
.fade-popover-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-popover-enter-to,
.fade-popover-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
