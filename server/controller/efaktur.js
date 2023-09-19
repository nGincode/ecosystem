const { User, npwp, efaktur, efakturItem } = require("../models");
const moment = require("moment/moment");
const Crypto = require("crypto");

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
  const { users_id, users_uuid, email, username } = req.user;

  const EFAKTUR = await efaktur.findAll({
    include: [
      {
        model: efakturItem,
        as: "efakturItem",
        attributes: {
          exclude: ["id"],
        },
      },
    ],
    attributes: { exclude: ["id"] },
    order: [["id", "DESC"]],
  });

  if (!EFAKTUR) {
    return res.json({
      message: "EFAKTUR not found",
    });
  }

  const data = EFAKTUR.map((val) => {
    return {
      uuid: val.uuid,
      date: moment(val.date).format("DD/MM/YYYY"),
      noFaktur: val.noFaktur,
      noIdentitas:
        val.noIdentitas + (val.noIdentitas.length == 15 ? " (NPWP)" : " (NIK)"),
      nameIdentitas: val.nameIdentitas,
      DPP: val.jumlahDPP,
      PPN: val.jumlahPPN,
      PPNBM: val.jumlahPPNBM,
      totalItem: val.efakturItem.length,
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

  const EFAKTUR = await efaktur.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: efakturItem,
        as: "efakturItem",
      },
    ],
  });

  if (!EFAKTUR) {
    return res.json({
      message: "Faktur not found",
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
  } = req.body;

  let valAddress;
  let valNameIdentitas;
  if (typeIdentitas === "NPWP") {
    const Npwp = await npwp.findOne({
      where: { npwp: noIdentitas },
      attributes: ["uuid", "fullName", "address"],
    });
    if (!Npwp) {
      return res.json({
        status: 400,
        massage: "NPWP in database not found",
      });
    }

    valAddress = Npwp.address;
    valNameIdentitas = Npwp.name;
  } else {
    valAddress = addressIdentitas;
    valNameIdentitas = addressIdentitas;
  }

  let jumlahDPP = 0;
  let jumlahPPNBM = 0;
  let jumlahPPN = 0;
  let itemFaktur = item.map((val) => {
    jumlahDPP += Number(val.dpp);
    jumlahPPN += Number(val.ppn);
    jumlahPPNBM += Number(val.ppnbm);

    return {
      uuid: Crypto.randomUUID(),
      efaktur_id: null,
      user_id: users_id,
      kodeBarang: val.kode,
      nama: val.name,
      hargaSatuan: val.harga,
      jumlahBarang: val.qty,
      hargaTotal: Number(val.qty) * Number(val.harga),
      diskon: val.diskon !== "" || !val.diskon ? 0 : val.diskon,
      DPP: val.dpp !== "" || !val.diskon ? 0 : val.dpp,
      PPN: val.ppn !== "" || !val.ppn ? 0 : val.ppn,
      tarifPPN:
        val.tarif_ppnbm !== "" || !val.tarif_ppnbm ? 0 : val.tarif_ppnbm,
      PPNBM: val.ppnbm !== "" || !val.ppnbm ? 0 : val.ppnbm,
    };
  });
  const dataFaktur = {
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

  const dataEfaktur = await efaktur.create(dataFaktur);
  let postItemFaktur = itemFaktur.map((val) => {
    val.efaktur_id = dataEfaktur.id;
    return val;
  });
  const efakturItemData = await efakturItem.bulkCreate(postItemFaktur);

  res.json({
    status: 200,
    massage: "Create successful",
    data: { dataFaktur, efakturItem: efakturItemData },
  });
};

const proof = async (req, res) => {
  let data = [];
  for (let index = 0; index < req.body.length; index++) {
    const Efaktur = await efaktur.findOne({
      where: { noFaktur: req.body[index].noFaktur },
    });

    require("fs").writeFile(
      __dirname + `../../../public/upload/efaktur/${Efaktur.noFaktur}.pdf`,
      new Buffer.from(
        req.body[index].files.replace(/^data:application\/\w+;base64,/, ""),
        "base64"
      ),
      (err) => {
        console.log(err);
      }
    );

    data.push(Efaktur);
  }

  res.json(req.body);
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
  proof,
};
