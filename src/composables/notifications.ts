import {ElMessage, ElNotification} from 'element-plus'

const notifySuccess = (message: string, title = 'Thành công') => {
  ElNotification({
    title: title,
    message: message,
    type: 'success',
    offset: 80
  })
}

const notifyWarning = (message: string, title = 'Cảnh báo') => {
  ElNotification({
    title: title,
    message: message,
    type: 'warning',
    offset: 80
  })
}

const notifyInfo = (message: string, title = 'Thông báo') => {
  ElNotification({
    title: title,
    message: message,
    type: 'info',
    offset: 80
  })
}

const notifyError = (message: string, title = 'Có lỗi xảy ra') => {
  ElNotification({
    title: title,
    message: message,
    type: 'error',
    offset: 80
  })
}

const message = (message: string) => {
  ElMessage({
    message: message,
    offset: 120
  })
}

const messageSuccess = (message: string) => {
  ElMessage({
    message: message,
    type: 'success',
    offset: 120
  })
}

const messageError = (message: string, title = 'Error') => {
  ElMessage({
    message: message,
    type: 'error',
    offset: 120
  })
}

export { notifySuccess, notifyWarning, notifyInfo, notifyError, message, messageSuccess, messageError}
