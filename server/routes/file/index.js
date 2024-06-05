const express = require("express");
const router = express.Router();
const fs = require("fs");
const directoryPath = __dirname + "../../../../public/files/";
const path = require("path");
const moment = require("moment");

const formatSize = (sizeInBytes) => {
  const sizeInKB = (sizeInBytes / 1024).toFixed(0);
  return `${sizeInKB} KB`;
};

const getFilesAndFolders = (dirPath) => {
  let idCounter = 1;

  const generateId = () => {
    return idCounter++;
  };

  const result = [];

  function readDirectory(currentPath) {
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
        size: "0 KB",
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
  }

  result.push(readDirectory(dirPath));
  return result;
};

router.get("/:dir", async (req, res) => {
  const { dir } = req.params;
  if (!fs.existsSync(directoryPath + dir)) {
    fs.mkdirSync(directoryPath + dir);
  }
  const getFilesAndFolders = (dirPath) => {
    let idCounter = 1;

    const formatSize = (sizeInBytes) => {
      const sizeInKB = (sizeInBytes / 1024).toFixed(0);
      return `${sizeInKB} KB`;
    };

    const generateId = () => {
      return idCounter++;
    };

    const result = [];

    function readDirectory(currentPath) {
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
          size: "0 KB",
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
    }

    result.push(readDirectory(dirPath));
    return result;
  };

  res.json({
    massage: "Get data successful",
    data: getFilesAndFolders(directoryPath + dir),
  });
});
router.post("/", async (req, res) => {
  const { type, location, locationBefore, name } = req.body;
  if (type == "delete") {
    if (fs.existsSync(directoryPath + location)) {
      if (fs.lstatSync(directoryPath + location).isDirectory()) {
        fs.rm(directoryPath + location, { recursive: true });
        res.json({
          status: 200,
          massage: "Success Delete Folder",
          data:
            getFilesAndFolders(directoryPath + locationBefore)?.[0]?.children ??
            [],
        });
      } else {
        fs.unlinkSync(directoryPath + location);
        res.json({
          status: 200,
          massage: "Success Delete File",
          data:
            getFilesAndFolders(directoryPath + locationBefore)?.[0]?.children ??
            [],
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        massage: "Not found",
      });
    }
  } else if (type == "rename") {
  } else if (type == "create_folder") {
    if (!fs.existsSync(directoryPath + location + "/" + name)) {
      fs.mkdirSync(directoryPath + location + "/" + name);
    }
    res.json({
      status: 200,
      massage: "Success Create Folder",
      data: getFilesAndFolders(directoryPath + location)?.[0]?.children ?? [],
    });
  } else if (type == "upload") {
    const { files } = req.files;
    let dt = [];
    function move(fl) {
      try {
        fl.mv(directoryPath + location + "/" + fl.name);
        dt.push({
          id: directoryPath + location + "/" + fl.name,
          name: fl.name,
          location: directoryPath + location + "/" + fl.name,
          type: "file",
          meta: {
            created: moment().format("DD MMM YYYY"),
            modified: moment().format("DD MMM YYYY"),
            size: formatSize(fl.size),
          },
          children: [],
        });
      } catch (e) {
        return res.status(400).json({
          massage: "Upload Error",
        });
      }
    }

    Array.isArray(files) ? files.forEach((file) => move(file)) : move(files);

    return res.json({
      status: 200,
      massage: "uploaded successfully",
      data: [
        ...getFilesAndFolders(directoryPath + location)?.[0]?.children,
        ...dt,
      ],
    });
  }
});

module.exports = router;
