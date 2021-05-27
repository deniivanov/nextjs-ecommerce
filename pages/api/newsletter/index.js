import connectDB from "../../../utils/connectDB";
import Newsletter from "../../../models/newsletterModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createNewsletter(req, res);
      break;
  }
};

const createNewsletter = async (req, res) => {
  try {
    const newNewsletter = new Newsletter({
      email: req.body.email,
    });
    await newNewsletter.save();
    console.log("Success!");
    return res.status(200).json("We made it bro!");
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
