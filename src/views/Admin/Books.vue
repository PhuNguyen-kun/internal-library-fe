<template>
  <div>
    <h1 class="admin-page__title">Quản lý sách</h1>

    <div class="admin-page__heading">
      <div class="admin-page__search-container" style="width: 700px">
        <el-input
          v-model="bookStore.searchTerm"
          class="admin-page__search-input"
          clearable
          placeholder="Tìm kiếm sách theo tên sách, tên tác giả, nhà xuất bản, danh mục"
          @change="handleSearch"
        />

        <Button class=" btn--primary" @click="handleSearch">
          <el-icon class="icon--nicer">
            <Search/>
          </el-icon>
        </Button>

        <el-checkbox
          v-model="bookStore.includeDeleted"
          @change="handleSearch"
          style="margin-left: 15px"
          size="default" border
        >
          Bao gồm sách đã xóa
        </el-checkbox>

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

    <Table :columns="bookStore.columns" :data="bookStore.books" :loading="fetchLoading"
           @selection-change="handleSelectionChange" :row-class-name="getRowClass">
      <template #image_url="{ row }">
        <div style="width: 98px; height: 98px; margin: 0 auto">
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
            type="text"
            size="small"
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
        <el-input @input="book.title=book.title.trimStart()" v-model="book.title" placeholder="Nhập tên sách"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="image_url">
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
          accept="image/png, image/jpeg">
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
          multiple
          :limit="4"
          :file-list="uploadAdditionalFileList"
          list-type="picture-card"
          :on-change="handleAdditionalFileChange"
          :on-remove="handleAdditionalFileRemove"
          :on-exceed="handleAdditionalFileExceed"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
          accept="image/png, image/jpeg"        >
          <el-icon><Plus/></el-icon>
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
          filterable
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
          filterable
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
          :min="1"
          :max="100"
          placeholder="Nhập số lượng"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Số trang" prop="page">
        <el-input-number
          v-model="book.page"
          :min="1"
          :max="10000"
          placeholder="Nhập số trang"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Mô tả ngắn" prop="short_description">
<!--        <el-input v-model="book.short_description" placeholder="Nhập mô tả ngắn" rows="4" type="textarea"></el-input>-->
        <ckeditor
          v-model="book.short_description"
          :editor="editor"
          :config="config"
        />

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
import {Delete, Plus, ZoomIn} from '@element-plus/icons-vue'
import type {UploadFile} from 'element-plus'
import {notifyError} from "@/composables/notifications";
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ref(ClassicEditor)
const bookStore = useBookStore();
const fetchLoading = ref<boolean>(false);
const isAllDeleted = ref(false);
const isAllNotDeleted = ref(false);

const config = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
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
    {max: 1000, message: 'Mô tả đầy đủ không vượt quá 1000 ký tự'}
  ]
}

// Fetch deleted books
const getRowClass = ({ row }: { row: Book }) => {
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

const handleAdditionalFileRemove = (file) => {
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

onMounted( () => {
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

<style lang="scss">
.el-upload-list__item {
  display: flex;
  justify-content: center;
}
</style>

<style scoped lang="scss">
.row-deleted {
  color: #b2b2b2;
  background-color: #f9f9f9;
}
</style>
