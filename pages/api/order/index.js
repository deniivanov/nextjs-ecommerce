import connectDB from "../../../utils/connectDB";
import Orders from "../../../models/orderModel";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);

    let orders;
    if (result.role !== "admin") {
      orders = await Orders.find({ email: result.email }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Orders.find().populate("user", "-password");
    }

    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { address, mobile, cart, user, name, total } = req.body;
    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    const Order = await Orders.create({
      email: user,
      address: address,
      mobile: mobile,
      name: name,
      cart: cart,
      total: total,
    });
    res.status(200);
    res.json(`${Order._id}`);
    res.end();
  } catch (err) {
    return res.status(500).json({ err: err.message });
    res.end();
  }
};

const sold = async (id, quantity, oldInStock, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    }
  );
};
