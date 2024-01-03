const {
  user,
  npwp,
  efakturOut,
  efakturOutItem,
  company,
  stock,
} = require("../models");
const moment = require("moment/moment");
const Crypto = require("crypto");
const numeral = require("numeral");
const { Op } = require("sequelize");
const fs = require("fs");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "npwp", "fullName", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  res.json({
    massage: "Get data successful",
    data: Npwp,
  });
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const { fullName, address, phone } = req.body;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  const data = {
    npwp: req.body.npwp,
    fullName: fullName,
    phone: phone,
    address: address,
  };

  await Npwp.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const get = async (req, res) => {
  const { users_id, users_uuid, email, username, permission } = req.user;
  const { company_id } = req.query;

  if (!company_id) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }
  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  let STOCK;
  if (permission.view === "all") {
    STOCK = await stock.findAll({
      where: { company_id: Company.id },
      attributes: { exclude: ["id"] },
      order: [["id", "DESC"]],
    });
  } else {
    STOCK = await stock.findAll({
      where: {
        user_id: users_id,
        company_id: Company.id,
      },
      attributes: { exclude: ["id"] },
      order: [["id", "DESC"]],
    });
  }

  if (!STOCK) {
    return res.json({
      message: "STOCK not found",
    });
  }

  const data = STOCK.map((val) => {
    return {
      uuid: val.uuid,
      noFaktur: val.no_faktur,
      invoiceDate: moment(val.invoice_date).format("DD MMM YYYY"),
      costumerName: val.costumer_name,
      address: val.address,
      area: val.area,
      productCode: val.product_code,
      productName: val.product_code,
      packaging: val.packaging,
      varian: val.varian,
      invoiceNo: val.invoice_no,
      qty: val.qty,
      price: val.price,
      grossAmount: val.gross_amount,
      discount: val.discount,
      dpp: val.dpp,
      tax: val.tax,
      netAmount: val.net_amount,
      qtyLast: val.qty_last,
    };
  });

  res.json({
    massage: "Get data successful",
    data: data,
  });
};

const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { fullName, address, phone } = req.body;

  const Npwp = await npwp.findOne({
    where: { uuid: uuid },
  });

  if (!Npwp) {
    return res.json({
      message: "NPWP not found",
    });
  }

  const data = {
    npwp: req.body.npwp,
    fullName: fullName,
    phone: phone,
    address: address,
  };

  await npwp.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const STOCK = await stock.findOne({
    where: { uuid: uuid },
  });

  if (!STOCK) {
    return res.json({
      message: "STOCK not found",
    });
  }

  if (STOCK) {
    await STOCK.destroy();
  }
  res.json({
    massage: "Delete successful",
    data: STOCK,
  });
};

const post = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { excel, company_id } = req.body;

  if (!company_id) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }
  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  let err = [];

  let postData = excel.map((val) => {
    val.invoice_date = moment(val.invoice_date).format("YYYY-MM-DD");
    val.user_id = users_id;
    val.company_id = Company.id;
    val.uuid = Crypto.randomUUID();
    return val;
  });

  if (excel) {
    try {
      const post = await stock.bulkCreate(postData);
      res.json({
        status: 200,
        massage: "Create successful",
        data: post,
      });
    } catch (err) {
      if (err.errors) {
        let errRes = err.errors.map((val) => {
          if (val.path == "Uniq2col") {
            return "(" + val.value + ") No Faktur & Invoice Date " + val.type;
          } else {
            return "(" + val.value + ") " + val.message;
          }
        });
        res.json({
          status: 500,
          error: errRes,
        });
      }
    }
  }
};

const proof = async (req, res) => {
  let success = [];
  let error = [];
  for (let index = 0; index < req.body.length; index++) {
    const Efaktur = await efakturOut.findOne({
      where: { noFaktur: req.body[index].noFaktur },
    });

    if (Efaktur) {
      let dirRoot = __dirname + `/../../../public/upload/efaktur/out`;
      let dirURL = `/upload/efaktur/out/${Efaktur.noFaktur}.pdf`;
      let nameFIle = `${Efaktur.noFaktur}.pdf`;

      if (!fs.existsSync(dirRoot)) {
        fs.mkdirSync(dirRoot);
      }

      fs.writeFile(
        dirRoot + "/" + nameFIle,
        new Buffer.from(
          req.body[index].files.replace(/^data:application\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );

      await Efaktur.update({
        proof: dirURL,
      });

      success.push({ Efaktur: Efaktur.noFaktur });
    } else {
      error.push({ Efaktur: req.body[index].noFaktur });
    }
  }

  res.json({ success: success, error: error });
};

const exprt = async (req, res) => {
  const { company_id, first_date, end_date } = req.body;
  let data = [];
  let data2 = [];
  const subject = [
    [
      "No Faktur",
      "Invoice Date",
      "Costumer Name",
      "Address",
      "Area",
      "Product Code",
      "Product Name",
      "Packaging",
      "Varian",
      "Invoice No",
      "Qty",
      "Price",
      "Groos Amount",
      "Discount",
      "DPP",
      "TAX",
      "Net Amount",
    ],
  ];

  const subject2 = [
    ["Product Name", "Packaging", "Varian", "Qty Last", "Date Last"],
  ];

  if (!company_id) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }
  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  const STOCK = await stock.findAll({
    where: {
      company_id: Company.id,
      invoice_date: {
        [Op.between]: [first_date, end_date],
      },
    },
  });

  STOCK.map((val, i) => {
    data.push([
      val.no_faktur,
      val.invoice_date,
      val.costumer_name ?? "",
      val.address ?? "",
      val.area ?? "",
      val.product_code ?? "",
      val.product_name,
      val.packaging,
      val.varian ?? "",
      val.invoice_no ?? "",
      val.qty,
      val.price,
      val.gross_amount ?? "",
      val.discount ?? "",
      val.dpp ?? "",
      val.tax ?? "",
      val.net_amount ?? "",
    ]);
    let cek = data2.find((va, key) => {
      if (va[2] == val.varian && va[0] == val.product_name) {
        return va;
      }
    });

    if (cek) {
      data2 = data2.map((mp) => {
        mp[3] = val.qty_last;
        mp[4] = val.invoice_date;
        return mp;
      });
    } else {
      data2.push([
        val.product_name,
        val.packaging,
        val.varian,
        val.qty_last,
        val.invoice_date,
      ]);
    }
  });

  if (data.length) {
    res.json([...subject, ...data, [], ...subject2, ...data2]);
  } else {
    res.status(400).json({ massage: "Data not result" });
  }
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
  proof,
  exprt,
};
