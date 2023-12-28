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
  const { company_id } = req.body;
  let data = [];
  const subject = [
    [
      "FK",
      "KD_JENIS_TRANSAKSI",
      "FG_PENGGANTI",
      "NOMOR_FAKTUR",
      "MASA_PAJAK",
      "TAHUN_PAJAK",
      "TANGGAL_FAKTUR",
      "NPWP",
      "NAMA",
      "ALAMAT_LENGKAP",
      "JUMLAH_DPP",
      "JUMLAH_PPN",
      "JUMLAH_PPNBM",
      "ID_KETERANGAN_TAMBAHAN",
      "FG_UANG_MUKA",
      "UANG_MUKA_DPP",
      "UANG_MUKA_PPN",
      "UANG_MUKA_PPNBM",
      "REFERENSI",
      "KODE_DOKUMEN_PENDUKUNG",
    ],
    [
      "LT",
      "NPWP",
      "NAMA",
      "JALAN",
      "BLOK",
      "NOMOR",
      "RT",
      "RW",
      "KECAMATAN",
      "KELURAHAN",
      "KABUPATEN",
      "PROPINSI",
      "KODE_POS",
      "NOMOR_TELEPON",
    ],
    [
      "OF",
      "KODE_OBJEK",
      "NAMA",
      "HARGA_SATUAN",
      "JUMLAH_BARANG",
      "HARGA_TOTAL",
      "DISKON",
      "DPP",
      "PPN",
      "TARIF_PPNBM",
      "PPNBM",
    ],
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

  const Efaktur = await efakturOut.findAll({
    where: {
      proof: null,
      company_id: Company.id,
    },
    include: [
      {
        model: efakturOutItem,
        as: "efakturOutItem",
        attributes: {
          exclude: ["id"],
        },
      },
    ],
  });

  Efaktur.map((val, i) => {
    let noId;
    let nameId;
    if (val.noIdentitas.length === 16) {
      noId = "000000000000000";
      nameId = `${val.noIdentitas}#NIK#NAMA#${val.nameIdentitas}`;
    } else if (val.noIdentitas.length === 15) {
      noId = val.noIdentitas;
      nameId = val.nameIdentitas;
    } else {
      return res.status(500).json({ massage: "No Identitas Tidak Valid" });
    }

    data.push([
      "FK",
      val.transaction,
      val.jenis_faktur,
      val.noFaktur.substring(3, val.noFaktur.length),
      moment(val.date, "YYYY-MM-DD").format("MM"),
      moment(val.date, "YYYY-MM-DD").format("YYYY"),
      moment(val.date, "YYYY-MM-DD").format("DD/MM/YYYY"),
      noId,
      nameId,
      val.address,
      val.jumlahDPP,
      val.jumlahPPN,
      val.jumlahPPNBM,
      val.IDKeteranganTambahan ?? "",
      val.FGUangMuka,
      val.uangMukaDPP,
      val.uangMukaPPN,
      val.uangMukaPPNBM,
      val.referensi ?? "",
      val.uangMukaDPP,
      "",
    ]);

    val.efakturOutItem.map((vall, ii) => {
      data.push([
        "OF",
        vall.kodeBarang,
        vall.nama,
        vall.hargaSatuan,
        vall.jumlahBarang,
        vall.hargaTotal,
        vall.diskon,
        vall.DPP,
        vall.PPN,
        vall.tarifPPNBM ?? "0",
        vall.PPNBM,
      ]);
    });
  });
  if (data.length) {
    res.json([...subject, ...data]);
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
