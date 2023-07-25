import multer from 'multer'
import * as path from 'path'
import fileDirName from './fileDirName.js'

const { __dirname } = fileDirName(import.meta)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'public' // default folder
    if (file.originalname.startsWith('profile-img')) {
      folder = path.join(__dirname, '..', 'public', 'profiles')
    } else if (file.originalname.startsWith('product-img')) {
      folder = path.join(__dirname, '..', 'public', 'products')
    } else if (file.originalname.startsWith('doc-address') || file.originalname.startsWith('doc-id') || file.originalname.startsWith('doc-account')) {
      folder = path.join(__dirname, '..', 'public', 'documents')
    }
    cb(null, folder)
  },
  filename: function (req, file, cb) {
    const originalname = path.parse(file.originalname).name
    const extension = path.parse(file.originalname).ext
    cb(null, `${originalname}-${Date.now()}${extension}`)
  }
})

export const multiUploader = multer({
  storage,
  limits: {
    files: 5 // número máximo de archivos permitidos
    // fileSize: 1024 * 1024 * 5 // tamaño máximo de archivo permitido (5MB)
  }
}).array('files', 5)
