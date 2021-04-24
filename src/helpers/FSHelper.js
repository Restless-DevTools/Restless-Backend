import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export default class FSHelper {
  constructor() {
    this.fs = fs;
    this.fsReadFile = promisify(this.fs.readFile);
    this.writeFile = promisify(this.fs.writeFile);
    this.fsExists = promisify(this.fs.exists);
    this.mkdir = promisify(this.fs.mkdir);
    this.deleteFile = promisify(this.fs.unlink);
    this.mkdir = promisify(this.fs.mkdir);
  }

  async createFile(filePath, buffer, encoding = 'utf8') {
    const fileName = path.basename(filePath);
    const dirPath = filePath.replace(fileName, '');

    const exists = await this.exists(dirPath);
    if (!exists && dirPath !== '') {
      await this.mkdir(dirPath, { recursive: true });
    }
    return this.writeFile(filePath, buffer, encoding);
  }

  exists(filepath) {
    return this.fsExists(filepath);
  }

  createWriteStream(filePath) {
    const fileName = path.basename(filePath);
    const dirPath = filePath.replace(fileName, '');
    const dirExists = this.fs.existsSync(dirPath);

    if (!dirExists && dirPath !== '') {
      this.fs.mkdirSync(dirPath, { recursive: true });
    }

    return this.fs.createWriteStream(filePath);
  }

  deleteFile(filePath) {
    return this.deleteFile(filePath);
  }

  readFile(filepath, encoding) {
    return this.fsReadFile(filepath, encoding);
  }

  createDir(dirPath) {
    return this.mkdir(dirPath, { recursive: true });
  }
}
