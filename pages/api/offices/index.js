import axios from "axios";

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getOffices(req, res);
      break;
  }
};

const getOffices = async (req, res) => {
  try {
    const newData = await axios
      .get(
        "http://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json"
      )
      .then(async (response) => {
        const offices = response.data.offices;
        return offices;
      });
    await res.status(200), await res.json(JSON.stringify(newData)), res.end();
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
