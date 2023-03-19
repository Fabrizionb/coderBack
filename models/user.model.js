import { Model } from '../models/model.js'
import { FileManager } from '../controller/fileManager.js'

class UserModel extends Model {

}
export const userModel = new UserModel(
  new FileManager('./data/products.json')
)
