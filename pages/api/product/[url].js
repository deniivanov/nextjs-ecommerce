import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  try {
    console.log(req.query);
    const { url } = req.query;

    const product = await Products.findOne({ url: url }).lean().exec();
    if (!product)
      return res.status(400).json({ err: "This product does not exist." });
    console.log(product);

    res.json({ product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const {
      title,
      price,
      originalPrice,
      inStock,
      description,
      content,
      category,
      images,
      whenToUse,
      howToUse,
    } = req.body;

    if (
      !title ||
      !price ||
      !originalPrice ||
      !inStock ||
      !description ||
      !content ||
      !howToUse ||
      !whenToUse ||
      category === "all" ||
      images.length === 0
    )
      return res.status(400).json({ err: "Please add all the fields." });

    await Products.findOneAndUpdate(
      { _id: id },
      {
        title: title.toLowerCase(),
        price,
        originalPrice,
        inStock,
        description,
        content,
        category,
        images,
        whenToUse,
        howToUse,
      }
    );

    res.json({ msg: "Success! Updated a product" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Products.findByIdAndDelete(id);
    res.json({ msg: "Deleted a product." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
