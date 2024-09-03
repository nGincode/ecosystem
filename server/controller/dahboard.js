const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const {
  user,
  permissionUser,
  permission,
  company,
  npwp,
} = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const moment = require("moment/moment");
const fs = require("fs");
const path = require("path");

const get = async (req, res) => {
  const User = await user.findAll({
    attributes: [
      "uuid",
      "img",
      "fullName",
      "email",
      "username",
      "dateOfBirth",
      "phone",
      "address",
      "status",
    ],
  });
  const Company = await company.findAll();
  const Npwp = await npwp.findAll();

  const directoryPath = "public/files";
  const getFilesAndFolders = (dirPath) => {
    let idCounter = 1;

    const formatSize = (sizeInBytes) => {
      const sizeInKB = (sizeInBytes / 1024).toFixed(0);
      return sizeInKB;
    };

    const generateId = () => {
      return idCounter++;
    };

    const result = [];

    function readDirectory(currentPath) {
      try {
        const items = fs.readdirSync(currentPath);
        const stats = fs.statSync(currentPath);
        const currentFolder = {
          id: generateId(),
          name: path.basename(currentPath),
          location: currentPath
            .replace(directoryPath, "")
            .replace(path.join(directoryPath), ""),
          type: "folder",
          meta: {
            created: moment(stats.ctime).format("DD MMM YYYY"),
            modified: moment(stats.mtime).format("DD MMM YYYY"),
            size: 0,
          },
          children: [],
        };

        items.forEach((item) => {
          const itemPath = path.join(currentPath, item);
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            currentFolder.children.push(readDirectory(itemPath)); // Rekursif untuk membaca subfolder
          } else if (stats.isFile()) {
            currentFolder.children.push({
              id: generateId(),
              name: item,
              location: itemPath.replace(path.join(directoryPath), ""),
              type: "file",
              meta: {
                created: moment(stats.ctime).format("DD MMM YYYY"),
                modified: moment(stats.mtime).format("DD MMM YYYY"),
                size: formatSize(stats.size),
              },
            });
          }
        });

        // Hitung ukuran folder dengan menjumlahkan ukuran isi dalam KB
        const totalSizeInBytes = currentFolder.children.reduce(
          (total, content) =>
            total + parseFloat(content.meta.size.replace(" KB", "")) * 1024,
          0
        );
        currentFolder.meta.size = formatSize(totalSizeInBytes);
        return currentFolder;
      } catch (error) {
        console.log(error);
        return currentFolder;
      }
    }

    result.push(readDirectory(dirPath));
    return result;
  };

  res.json({
    massage: "Get data successful",
    data: {
      countUser: User.length,
      countCompany: Company.length,
      countNpwp: Npwp.length,
      User: User,
      Npwp: Npwp,
      Company: Company,
      // folder: getFilesAndFolders(directoryPath)?.[0].meta.size,
      folder: getFilesAndFolders(directoryPath),
    },
  });
};

module.exports = {
  get,
};
