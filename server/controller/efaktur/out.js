const {
  user,
  npwp,
  efakturOut,
  efakturOutItem,
  company,
} = require("../../models");
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

  let EFAKTUR;
  if (permission.view === "all") {
    EFAKTUR = await efakturOut.findAll({
      where: { company_id: Company.id },
      include: [
        {
          model: efakturOutItem,
          as: "efakturOutItem",
          attributes: {
            exclude: ["id"],
          },
        },
      ],
      attributes: { exclude: ["id"] },
      order: [["id", "DESC"]],
    });
  } else {
    EFAKTUR = await efakturOut.findAll({
      where: {
        user_id: users_id,
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
      attributes: { exclude: ["id"] },
      order: [["id", "DESC"]],
    });
  }

  if (!EFAKTUR) {
    return res.json({
      message: "EFAKTUR not found",
    });
  }

  const data = EFAKTUR.map((val) => {
    return {
      // check: { checkbox: true, ceklist: val.proof },
      ceklist: val.proof,
      uuid: val.uuid,
      date: moment(val.date).format("DD MMM YYYY"),
      nameIdentitas: val.nameIdentitas,
      noFaktur:
        val.noFaktur.slice(0, 3) +
        "." +
        val.noFaktur.slice(3, 6) +
        "-" +
        val.noFaktur.slice(6, 8) +
        "." +
        val.noFaktur.slice(8),
      noIdentitas:
        val.noIdentitas + (val.noIdentitas.length == 15 ? " (NPWP)" : " (NIK)"),
      DPP: numeral(val.jumlahDPP).format("0,0"),
      PPN: numeral(val.jumlahPPN).format("0,0"),
      PPNBM: numeral(val.jumlahPPNBM).format("0,0"),
      item: val.efakturOutItem.length + " Item",
      itemJson: val.efakturOutItem,
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

  const EFAKTUR = await efakturOut.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: efakturOutItem,
        as: "efakturOutItem",
      },
    ],
  });

  if (!EFAKTUR) {
    return res.json({
      message: "Faktur not found",
    });
  }

  if (EFAKTUR) {
    require("fs").unlink(
      __dirname + `/../../public/upload/efaktur/${EFAKTUR.noFaktur}.pdf`,
      (err) => {
        console.log(err);
      }
    );

    await EFAKTUR.destroy();
  }

  res.json({
    massage: "Delete successful",
    data: EFAKTUR,
  });
};

const post = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    date,
    referensi,
    noFaktur,
    item,
    detail,
    jenis,
    noIdentitas,
    addressIdentitas,
    nameIdentitas,
    typeIdentitas,
    keterangan_tambahan,
    excel,
    company_id,
  } = req.body;

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

  if (excel) {
    let err = "";
    for (let i = 0; i < excel.length; i++) {
      const val = excel[i];
      if (i > 2) {
        if (val[0] === "FK") {
          const NoFakturCek = await efakturOut.findOne({
            where: {
              noFaktur: val[1] + "0" + val[3],
            },
          });

          if (NoFakturCek) {
            err = err + "No Faktur Duplicate :" + NoFakturCek.noFaktur + "\n";
          }
        }
      }
    }
    if (err.length) {
      return res.status(400).json({
        massage: err,
      });
    }

    let fk = [];
    for (let i = 0; i < excel.length; i++) {
      const val = excel[i];
      if (i > 2) {
        let nameIdentitas;
        let noIdentitas;
        if (val[0] === "FK") {
          if (val[8].length > 15) {
            let split = val[8].split("#");
            nameIdentitas = split[3];
            noIdentitas = split[0];
          } else {
            nameIdentitas = val[8];
            noIdentitas = val[7];
          }

          const dataFaktur = {
            company_id: Company.id,
            user_id: users_id,
            uuid: Crypto.randomUUID(),
            transaction: val[1],
            jenis_faktur: val[2],
            noFaktur: val[1] + "0" + val[3],
            date: moment(val[6], "DD/MM/YYYY").format("YYYY-MM-DD"),
            noIdentitas: noIdentitas,
            nameIdentitas: nameIdentitas,
            address: val[9],
            jumlahDPP: val[10],
            jumlahPPN: val[11],
            jumlahPPNBM: val[12],
            IDKeteranganTambahan: val[13] !== "" ? val[13] : null,
            FGUangMuka: val[14],
            uangMukaDPP: val[15],
            uangMukaPPN: val[16],
            uangMukaPPNBM: val[17],
            referensi: val[18] !== "" ? val[18] : null,
          };

          const dataEfaktur = await efakturOut.create(dataFaktur);
          fk = dataEfaktur;
        } else if (val[0] === "OF") {
          const dataFakturIt = {
            company_id: Company.id,
            uuid: Crypto.randomUUID(),
            efaktur_out_id: fk.id,
            user_id: users_id,
            kodeBarang: val[1],
            nama: val[2],
            hargaSatuan: val[3],
            jumlahBarang: val[4],
            hargaTotal: val[5],
            diskon: val[6],
            DPP: val[7],
            PPN: val[8],
            tarifPPN: val[9],
            PPNBM: val[10],
          };
          await efakturOutItem.create(dataFakturIt);
        }
      }
    }
    res.json({
      status: 200,
      massage: "Create successful",
    });
  } else {
    let valAddress;
    let valNameIdentitas;
    if (typeIdentitas === "NPWP") {
      const Npwp = await npwp.findOne({
        where: { npwp: noIdentitas },
        attributes: ["uuid", "name", "address"],
      });
      if (!Npwp) {
        return res.json({
          status: 400,
          massage: "NPWP in database not found",
        });
      }

      valAddress =
        Npwp.address.jalan +
        " " +
        Npwp.address.block +
        " " +
        Npwp.address.no +
        " " +
        Npwp.address.rt +
        " " +
        Npwp.address.rw +
        " " +
        Npwp.address.kel +
        " " +
        Npwp.address.kec +
        " " +
        Npwp.address.kabkot +
        " " +
        Npwp.address.prov +
        " " +
        Npwp.address.kodepos;
      valNameIdentitas = Npwp.name;
    } else {
      valAddress = addressIdentitas;
      valNameIdentitas = nameIdentitas;
    }

    let jumlahDPP = 0;
    let jumlahPPNBM = 0;
    let jumlahPPN = 0;
    let itemFaktur = item.map((val) => {
      jumlahDPP += Number(val.dpp);
      jumlahPPN += Number(val.ppn);
      jumlahPPNBM += Number(val.ppnbm);

      return {
        company_id: Company.id,
        uuid: Crypto.randomUUID(),
        efaktur_out_id: null,
        user_id: users_id,
        kodeBarang: val.kode,
        nama: val.name,
        hargaSatuan: val.harga,
        jumlahBarang: val.qty,
        hargaTotal: Number(val.qty) * Number(val.harga),
        diskon: val.diskon === "" || !val.diskon ? 0 : val.diskon,
        DPP: val.dpp === "" || !val.diskon ? 0 : val.dpp,
        PPN: val.ppn === "" || !val.ppn ? 0 : val.ppn,
        tarifPPN:
          val.tarif_ppnbm === "" || !val.tarif_ppnbm ? 0 : val.tarif_ppnbm,
        PPNBM: val.ppnbm === "" || !val.ppnbm ? 0 : val.ppnbm,
      };
    });
    const dataFaktur = {
      company_id: Company.id,
      user_id: users_id,
      uuid: Crypto.randomUUID(),
      noIdentitas: noIdentitas,
      date: date,
      transaction: detail,
      jenis_faktur: jenis,
      referensi: referensi !== "" || !referensi ? null : referensi,
      noFaktur: noFaktur,
      address: valAddress,
      nameIdentitas: valNameIdentitas,
      jumlahDPP: jumlahDPP,
      jumlahPPNBM: jumlahPPNBM,
      jumlahPPN: jumlahPPN,
      IDKeteranganTambahan: keterangan_tambahan,
      FGUangMuka: 0,
      uangMukaDPP: 0,
      uangMukaPPN: 0,
      uangMukaPPNBM: 0,
    };

    const dataEfaktur = await efakturOut.create(dataFaktur);
    let postItemFaktur = itemFaktur.map((val) => {
      val.efaktur_out_id = dataEfaktur.id;
      return val;
    });
    const efakturItemOutData = await efakturOutItem.bulkCreate(postItemFaktur);

    res.json({
      status: 200,
      massage: "Create successful",
      data: { dataFaktur, efakturOutItem: efakturItemOutData },
    });
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
