import type { ElMessageBoxOptions, MessageBoxData } from 'element-plus'

/**
 * @description: Create confirmation box
 */
function createConfirm(message: string, title: string, options: ElMessageBoxOptions): Promise<MessageBoxData> {
  return ElMessageBox.confirm(message, title, options)
}


function createSuccessModal(message: string, title: string, options: ElMessageBoxOptions = { type: 'success' }) {
  return ElMessageBox.confirm(message, title, options);
}

function createErrorModal(message: string, title: string, options: ElMessageBoxOptions = { type: 'error' }) {
  return ElMessageBox.confirm(message, title, options);
}

function createInfoModal(message: string, title: string, options: ElMessageBoxOptions = { type: 'info' }) {
  return ElMessageBox.confirm(message, title, options);
}

function createWarningModal(message: string, title: string, options: ElMessageBoxOptions = { type: 'warning' }) {
  return ElMessageBox.confirm(message, title, options);
}

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: ElMessage,
    notification: ElNotification,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}

