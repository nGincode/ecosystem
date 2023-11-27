const { user, npwp, efaktur, efakturIn, company } = require("../../models");
const moment = require("moment/moment");
const Crypto = require("crypto");
const numeral = require("numeral");

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
    EFAKTUR = await efakturIn.findAll({
      where: { company_id: Company.id },
      order: [["id", "DESC"]],
    });
  } else {
    // EFAKTUR = await efakturIn.findAll({
    //   where: {
    //     user_id: users_id,
    //     company_id: Company.id,
    //   },
    //   include: [
    //     {
    //       model: efakturItem,
    //       as: "efakturItem",
    //       attributes: {
    //         exclude: ["id"],
    //       },
    //     },
    //   ],
    //   attributes: { exclude: ["id"] },
    //   order: [["id", "DESC"]],
    // });
  }

  if (!EFAKTUR) {
    return res.json({
      message: "EFAKTUR not found",
    });
  }

  const data = EFAKTUR.map((val) => {
    return {
      uuid: val.uuid,
      noFaktur: val.NOMOR_FAKTUR,
      date: moment(val.TANGGAL_FAKTUR).format("DD MMM YYYY"),
      npwp: val.NPWP,
      nama: val.NAMA,
      address: val.ALAMAT_LENGKAP,
      amountDPP: numeral(val.JUMLAH_DPP).format("0,0"),
      amountPPN: numeral(val.JUMLAH_PPN).format("0,0"),
      amountPPNBM: numeral(val.JUMLAH_PPNBM).format("0,0"),
      json: val,
      docControl: "View",
      docControlJson: {
        SJ_NO: val.SJ_NO,
        SJ_TGLDOC: val.SJ_TGLDOC,
        SJ_TGLTRM: val.SJ_TGLTRM,
        TAG_NO: val.TAG_NO,
        TAG_TGLDOC: val.TAG_TGLDOC,
        TAG_TGLTRM: val.TAG_TGLTRM,
        PEL_TGL: val.PEL_TGL,
        PEL_NOM: val.PEL_NOM,
        VIA: val.VIA,
      },
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

  const EFAKTUR = await efakturIn.findOne({
    where: { uuid: uuid },
  });

  if (!EFAKTUR) {
    return res.status(500).json({
      message: "Faktur In not found",
    });
  }

  await EFAKTUR.destroy();

  res.json({
    massage: "Delete successful",
    data: EFAKTUR,
  });
};

const post = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { data, company_id } = req.body;

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

  let postData = data.map((val) => {
    val.user_id = users_id;
    val.company_id = Company.id;
    val.uuid = Crypto.randomUUID();
    return val;
  });

  try {
    const post = await efakturIn.bulkCreate(postData);
    res.json({
      status: 200,
      massage: "Create successful",
      data: post,
    });
  } catch (err) {
    if (err.errors) {
      let errRes = err.errors.map((val) => {
        return "(" + val.value + ") " + val.message;
      });

      res.json({
        status: 500,
        error: errRes,
      });
    }
  }
};

const proof = async (req, res) => {
  let success = [];
  let error = [];
  for (let index = 0; index < req.body.length; index++) {
    const Efaktur = await efaktur.findOne({
      where: { noFaktur: req.body[index].noFaktur },
    });

    if (Efaktur) {
      require("fs").writeFile(
        __dirname + `/../../public/upload/efaktur/${Efaktur.noFaktur}.pdf`,
        new Buffer.from(
          req.body[index].files.replace(/^data:application\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );

      await Efaktur.update({
        proof: `/upload/efaktur/${Efaktur.noFaktur}.pdf`,
      });

      success.push({ Efaktur: Efaktur.noFaktur });
    } else {
      error.push({ Efaktur: req.body[index].noFaktur });
    }
  }

  res.json({ success: success, error: error });
};

const export_doccon = async (req, res) => {
  const { company_id } = req.body;

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

  const Efaktur = await efakturIn.findAll({
    where: {
      company_id: Company.id,
    },
    attributes: [
      "NAMA",
      "NOMOR_FAKTUR",
      "TANGGAL_FAKTUR",
      "TAHUN_PAJAK",
      "MASA_PAJAK",
      "JUMLAH_DPP",
      "JUMLAH_PPN",
      "JUMLAH_PPNBM",
    ],
  });

  if (Efaktur) {
    res.json(Efaktur);
  } else {
    return res.status(400).json({
      message: "Efaktur data not found",
    });
  }
};

const import_doccon = async (req, res) => {
  const { company_id, data } = req.body;

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

  for (let index = 0; index < data.length; index++) {
    if (Company.id && data[index]?.tgl_faktur && data[index]?.no_faktur) {
      let Efaktur = await efakturIn.findOne({
        where: {
          company_id: Company.id,
          TANGGAL_FAKTUR: data[index].tgl_faktur,
          NOMOR_FAKTUR: data[index].no_faktur,
        },
      });

      if (Efaktur) {
        await Efaktur.update({
          SJ_NO: data[index].no_surat_jalan ?? Efaktur.SJ_NO,
          SJ_TGLDOC: data[index].tgl_surat_jalan ?? Efaktur.SJ_TGLDOC,
          SJ_TGLTRM: data[index].terima_surat_jalan ?? Efaktur.SJ_TGLTRM,
          TAG_NO: data[index].no_tagihan ?? Efaktur.TAG_NO,
          TAG_TGLDOC: data[index].tgl_tagihan ?? Efaktur.TAG_TGLDOC,
          TAG_TGLTRM: data[index].terima_tagihan ?? Efaktur.TAG_TGLTRM,
          PEL_TGL: data[index].tgl_lunas ?? Efaktur.PEL_TGL,
          PEL_NOM: data[index].nominal_lunas ?? Efaktur.PEL_NOM,
          VIA: data[index].via_lunas ?? Efaktur.VIA,
        });
      }
    }
  }

  res.json(true);
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
  proof,
  export_doccon,
  import_doccon,
};
