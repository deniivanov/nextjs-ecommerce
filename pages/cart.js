import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import CartItem from "../components/CartItem";
import Link from "next/link";
import {
  Button,
  Container,
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
} from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import { Lock, Business } from "@material-ui/icons";
import { getData, postData } from "../utils/fetchData";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const OrderSchema = Yup.object().shape({
  address: Yup.string().required("Адреса е задължителен"),
  mobile: Yup.string()
    .required("Моля въведете мобилен телефон")
    .min(10, "Трябва да е поне 10 цифри")
    .max(13, "Максимум 13 цифри"),
});

export function OrderForm() {
  const [alert, setAlert] = useState(false);
  return (
    <div>
      <Formik
        initialValues={{
          address: "",
          phone: "",
        }}
        validationSchema={OrderSchema}
        onSubmit={async (values) => {
          await axios
            .post(
              "/api/order",
              {
                values: values.address,
              },
              options
            )
            .then(() => setAlert(true));
        }}
      >
        {({ errors, touched, handleBlur, handleChange }) => (
          <Form style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              style={{ backgroundColor: "#fff", borderRadius: "2px" }}
              name="address"
              type="text"
              variant="filled"
              label="Адрес за доставка"
              placeholder="гр. Варна, ул. Дрин 6, ап.10"
              onBlur={handleBlur}
              /* onFocus={async = () => await axios
                .get(
                  "/api/offices"
                )
                .then((response) => {
                  const offices = response;
                });
              res.json("success");
            } catch (err) {
              return res.status(500).json({ err: err.message });
            } */
              onChange={handleChange}
              error={errors.address && touched.address ? errors.address : null}
              helperText={
                errors.address && touched.address ? errors.address : null
              }
            />
            <TextField
              style={{ backgroundColor: "#fff", borderRadius: "2px" }}
              name="phone"
              type="phone"
              variant="filled"
              label="Телефон за връзка"
              placeholder="0888123456"
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.phone && touched.phone ? errors.phone : null}
              helperText={errors.phone && touched.phone ? errors.phone : null}
            />
            <Button
              style={{
                marginTop: "20px",
                backgroundColor: "#adbc22",
                color: "#fff",
              }}
              variant="contained"
              fullWidth={true}
              type="submit"
            >
              Продължи към плащане
            </Button>
            {alert ? (
              <Alert severity="success">Избери начин на плащане</Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
}

const Cart = () => {
  function getOfficeData() {
    axios.get("/api/offices").then((response) => {
      setOffices(response.data);
    });
  }

  const [offices, setOffices] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;

  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [delivery, setDelivery] = useState(false);
  const [payment, setPayment] = useState(false);
  const [deliverToOffice, setDeliverToOffice] = useState("Доставка до Адрес");

  const handleChange = (event) => {
    setDeliverToOffice(event.target.value);
  };

  const [callback, setCallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__next__cart01__devat"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item.url}`);
          const { _id, url, title, images, price, inStock, sold } = res.product;
          if (inStock > 0) {
            newArr.push({
              _id,
              url,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }

        dispatch({ type: "ADD_CART", payload: newArr });
      };

      updateCart();
    }
  }, [callback]);

  const handlePayment = async () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });

    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "The product is out of stock or the quantity is insufficient.",
        },
      });
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    postData("order", { name, address, mobile, cart, total }, auth.token).then(
      (res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_CART", payload: [] });

        const newOrder = {
          ...res.newOrder,
          user: auth.user,
        };
        dispatch({ type: "ADD_ORDERS", payload: [...orders, newOrder] });
        dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        return router.push(`/order/${res.newOrder._id}`);
      }
    );
  };

  if (cart.length === 0)
    return (
      <img
        className="img-responsive w-100"
        src="/empty_cart.jpg"
        alt="not empty"
      />
    );

  return (
    <div className="row mx-auto">
      <Head>
        <title>Пазарска количка | Vitalize.bg</title>
      </Head>
      <div></div>
      <Container style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <Container>
              <Typography variant="h6">Продукти</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      dispatch={dispatch}
                      cart={cart}
                    />
                  ))}
                </TableBody>
              </Table>
            </Container>
          </Grid>
          <Grid item xs={12} md={4}>
            <Container>
              <Typography variant="h6">Общо:</Typography>
              <Typography variant="body2">
                Тотал:{" "}
                <span className="text-danger">{total.toFixed(2)} лева</span>
                {total.toFixed(2) <= 50 ? (
                  <Alert severity="warning">
                    Още {(50 - total.toFixed(2)).toFixed(2)} до безплатна
                    доставка
                  </Alert>
                ) : null}
              </Typography>
              {!auth.user ? (
                <>
                  <Button variant="outlined" fullWidth={true} color="primary">
                    Купи като гост
                  </Button>
                  <Link href="/signin">
                    <Button
                      variant="contained"
                      fullWidth={true}
                      color="primary"
                    >
                      Купи с профил
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  onClick={() => setDelivery(true)}
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                >
                  Финализирай поръчката
                </Button>
              )}
            </Container>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Accordion expanded={delivery}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography>Доставка 📦</Typography>
          </AccordionSummary>
          <div style={{ padding: "0.8rem" }}>
            <form>
              <h2>Доставка</h2>
              <p>Избери начи на доставка</p>
              <Select
                fullWidth={true}
                id="deliverToOffice"
                value={deliverToOffice}
                onChange={handleChange}
              >
                <MenuItem value={"Доставка до Адрес"}>
                  Доставка до Адрес
                </MenuItem>
                <MenuItem value={"Доставка до Офис"}>Доставка до Офис</MenuItem>
              </Select>
              {auth.user ? (
                <>
                  <TextField
                    label="Име на получател"
                    type="text"
                    name="name"
                    id="name"
                    value={auth.user.name}
                    fullWidth={true}
                  ></TextField>
                </>
              ) : (
                <>
                  <TextField
                    label="Име на получател"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth={true}
                  ></TextField>
                </>
              )}
              {deliverToOffice === "Доставка до Офис" ? (
                <>
                  <Autocomplete
                    onSelect={getOfficeData()}
                    options={offices}
                    getOptionLabel={(offices) => offices.address.fullAddress}
                    fullWidth={true}
                    id="address"
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth={true}
                        {...params}
                        label="Изберете офис на Еконт"
                      />
                    )}
                  />
                </>
              ) : (
                <TextField
                  label="Адрес за доставка"
                  fullWidth={true}
                  type="text"
                  name="address"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              )}

              <TextField
                label="Телефон за контакти"
                fullWidth={true}
                type="text"
                name="mobile"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </form>
            <Button
              onClick={() => {
                setDelivery(false), setPayment(true);
              }}
              variant="contained"
              color="primary"
              fullWidth={true}
            >
              Продължи към начини на плащане
            </Button>
          </div>
        </Accordion>
        <Accordion expanded={payment}>
          <AccordionSummary>Плащане 🧾</AccordionSummary>
          <AccordionDetails
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Select value="Наложен платеж" disabled={true}>
              <MenuItem value={`Наложен платеж`}>Наложен платеж</MenuItem>
            </Select>
            <Alert severity="warning">
              За момента не предлагаме други методи на плащане
            </Alert>
          </AccordionDetails>
        </Accordion>
        <Button
          onClick={async (options) =>
            await axios.post(
              "/api/order",
              {
                body: {
                  cart,
                  mobile,
                  address,
                  name,
                },
              },
              options
            )
          }
        >
          Завърши поръчка
        </Button>
      </Container>
    </div>
  );
};

export default Cart;
