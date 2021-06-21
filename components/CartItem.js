import Link from "next/link";
import { decrease, increase } from "../store/Actions";
import { Typography, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const CartItem = ({ item, dispatch, cart }) => {
  const itemTotal = item.quantity * item.price;
  return (
    <tr style={{ padding: "1rem" }}>
      <td style={{ width: "100px", overflow: "hidden" }}>
        <img
          src={item.images[0].url}
          alt={item.images[0].url}
          className="img-thumbnail w-100"
          style={{ minWidth: "80px", height: "80px" }}
        />
      </td>

      <td style={{ minWidth: "200px" }} className="w-50 align-middle">
        <Typography variant="h6">
          <Link href={`/product/${item.url}`}>
            <a style={{ textDecoration: "none" }}>{item.title}</a>
          </Link>
        </Typography>
        <Typography variant="body1" style={{ color: "#7b0d3d" }}>
          {itemTotal.toFixed(2)} лева
        </Typography>
      </td>

      <td className="align-middle" style={{ minWidth: "150px" }}>
        <button
          className="btn btn-outline-secondary"
          onClick={() => dispatch(decrease(cart, item._id))}
          disabled={item.quantity === 1 ? true : false}
        >
          {" "}
          -{" "}
        </button>

        <span className="px-3">{item.quantity}</span>

        <button
          className="btn btn-outline-secondary"
          onClick={() => dispatch(increase(cart, item._id))}
          disabled={item.quantity === item.inStock ? true : false}
        >
          {" "}
          +{" "}
        </button>
      </td>

      <td
        className="align-middle"
        style={{ minWidth: "50px", cursor: "pointer" }}
      >
        <IconButton
          size="large"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: cart,
                  id: item._id,
                  title: item.title,
                  type: "ADD_CART",
                },
              ],
            })
          }
        >
          <Delete color={"secondary"} />
        </IconButton>
      </td>
    </tr>
  );
};

export default CartItem;
