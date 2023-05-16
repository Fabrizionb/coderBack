/*eslint-disable*/
import config from "../../data.js";
import mongoose from "mongoose";

class DaoFactory {
  static async getDao() {
    switch (config.PERSISTENCE) {
      case "mongo":
        mongoose.connect(config.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        const { default: ContactsMongo } = await import(
          "QUE DEBO IMPORTAR AQUI"
        );
        return ContactsMongo;
      case "file":
        const { default: ContactsMemory } = await import(
            "QUE DEBO IMPORTAR AQUI"
        );
        return ContactsMemory;
      default:
        throw new Error("Wrong config");
    }
  }
}

export default DaoFactory;