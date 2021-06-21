import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import CartItem from "../components/CartItem";
import Link from "next/link";
import {
  LocalShipping,
  CheckCircle,
  Receipt,
  AccountBalance,
} from "@material-ui/icons";
import {
  Paper,
  Button,
  Container,
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  FormHelperText,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@material-ui/core";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import { getData, postData } from "../utils/fetchData";
import { useRouter } from "next/router";
import * as Yup from "yup";
import axios from "axios";
import { Form } from "formik";

const OrderSchema = Yup.object().shape({
  address: Yup.string().required("Адреса е задължителен"),
  mobile: Yup.string()
    .required("Моля въведете мобилен телефон")
    .min(10, "Трябва да е поне 10 цифри")
    .max(13, "Максимум 13 цифри"),
});

function getSteps() {
  return ["Продукти", "Доставка", "Плащане"];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Избор на продукти";
    case 1:
      return "Адрес и начин на доставка";
    case 2:
      return "Избор на начин за заплащане";
    default:
      return "Грешка";
  }
}

const Cart = () => {
  const [orderComplete, setOrderComplete] = useState(false);
  const [offices, setOffices] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState(false);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Наложен платеж");
  const [mobile, setMobile] = useState("");

  const [deliverToOffice, setDeliverToOffice] = useState("Доставка до Адрес");

  const changeDelivery = async (event) => {
    setDeliverToOffice(event.target.value);
    setAddress(null);
    setLoading(true);
    const response = await axios.get(`/api/offices`);

    if (!response) {
      setProblem(true);
    }
    const officesResponse = await response.data;
    setOffices(officesResponse);

    setLoading(false);
  };
  const changePayment = async (event) => {
    setPayment(event.target.value);
  };
  const options = {
    headers: { "Content-Type": "application/json" },
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
    const cartLocal = JSON.parse(localStorage.getItem("vitalizeCart"));
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
        <title>
          Пазарска количка {getStepContent(activeStep)} | Vitalize.bg
        </title>
      </Head>
      <Container style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {!orderComplete ? (
          <div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        ) : null}
        <Container>
          <Grid container>
            <Grid item xs={12} md={12}>
              {activeStep === 0 ? (
                <Container>
                  <Typography variant="h4">
                    Вашата пазарска количка съдържа
                  </Typography>
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
                  <Typography variant="h6" style={{ color: "#7b170d" }}>
                    Общо:{" "}
                    <span style={{ color: "#7b170d" }}>
                      {total.toFixed(2)} лева
                    </span>
                    {total.toFixed(2) <= 50 ? (
                      <Alert
                        icon={<LocalShipping />}
                        variant="outlined"
                        severity="warning"
                      >
                        Още {(50 - total.toFixed(2)).toFixed(2)} до безплатна
                        доставка.
                        <a style={{ textDecoration: "none" }} href={"/"}>
                          <b> Продължи да пазаруваш</b>
                        </a>
                      </Alert>
                    ) : (
                      <Alert
                        icon={<CheckCircle />}
                        variant="outlined"
                        severity="success"
                      >
                        Вашата поръчка се класира за безплатна доставка!
                      </Alert>
                    )}
                  </Typography>
                </Container>
              ) : null}
            </Grid>
          </Grid>
        </Container>
        {activeStep === 1 ? (
          <Container>
            <>
              <div style={{ padding: "0.8rem" }}>
                <form>
                  <Typography variant="h4">Доставка</Typography>
                  <FormHelperText>Изберете начин на доставка</FormHelperText>
                  <Select
                    fullWidth={true}
                    id="deliverToOffice"
                    value={deliverToOffice}
                    onChange={changeDelivery}
                    helperText="Some text"
                  >
                    <MenuItem value={"Доставка до Адрес"}>
                      Доставка до Адрес
                    </MenuItem>
                    <MenuItem value={"Доставка до Офис"}>
                      Доставка до Офис
                    </MenuItem>
                  </Select>
                  {deliverToOffice === "Доставка до Офис" ? (
                    <>
                      {loading ? <CircularProgress /> : null}
                      {!loading ? (
                        <>
                          <>
                            <FormHelperText>
                              Изберете офис на Еконт
                            </FormHelperText>
                            <Autocomplete
                              options={offices}
                              getOptionLabel={(offices) =>
                                offices.address.fullAddress
                              }
                              fullWidth={true}
                              name="address"
                              id="address"
                              style={{ width: "100%" }}
                              onChange={(e, value) => setAddress(value.address)}
                              renderInput={(params) => (
                                <TextField fullWidth={true} {...params} />
                              )}
                            />
                          </>
                        </>
                      ) : null}
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
                      {problem ? (
                        <Alert severity="error">There is a problem</Alert>
                      ) : null}
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
              </div>
              {!auth.user ? (
                <Link href="/signin">
                  <Button variant="contained" fullWidth={true} color="primary">
                    Купи с профил
                  </Button>
                </Link>
              ) : null}
            </>
          </Container>
        ) : null}
        {activeStep === 2 ? (
          <Container>
            <Typography variant="h4">Начини на плащане</Typography>
            <FormHelperText>Моля изберете начин на плащане</FormHelperText>
            <Select fullWidth={true} value={payment} onChange={changePayment}>
              <MenuItem value={`По банков път`}>По банков път</MenuItem>
              <MenuItem value={`Наложен платеж`}>Наложен платеж</MenuItem>
            </Select>
            {payment === "Наложен платеж" ? (
              <Alert icon={<Receipt />} severity="warning" variant="outlined">
                При избраният от вас метод, а именно наложен платеж, вие
                избирате да платите сумата по вашата поръчка на куриера, при
                приемането на доставката. Освен вашите покупки и документ за
                извършена доставка, вие ще получите от куриера и разписка за
                пощенски паричен превод, Моля, запазете разписката за
                направеното плащане, тъй като това е официалния документ, който
                гарантира вашите потребителски права.
              </Alert>
            ) : (
              <>
                <Alert
                  icon={<AccountBalance />}
                  severity="warning"
                  variant="outlined"
                >
                  При заплащане по банков път, поръчката бива обработена след
                  като сумата постъпи по банковата сметка на Виталайз ЕООД. Моля
                  преведете сумата по следната банкова сметка
                  <Typography>Банка : Банка ОББ</Typography>
                  <Typography>IBAN: 3831UBBS0291292991</Typography>
                </Alert>
              </>
            )}
          </Container>
        ) : null}
        {!orderComplete ? (
          <div>
            {activeStep === steps.length ? (
              <div align={"center"}>
                <Typography variant="h4">Обобщение на поръчката</Typography>
                <Grid container>
                  <Grid item md={6} xs={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {typeof address === "object"
                              ? "Офис на Еконт"
                              : "Адрес"}
                          </TableCell>
                          <TableCell>Получател</TableCell>
                          <TableCell>Мобилен</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {typeof address === "object"
                              ? address.fullAddress
                              : address}
                          </TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell>{mobile}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Продукти</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth={true}
                  onClick={async () => (
                    await setOrderComplete(true),
                    await axios.post("/api/order", {
                      user: auth?.user?.email,
                      name: name,
                      mobile: mobile,
                      payment: payment,
                      cart: cart,
                      address: address,
                      total: total,
                    }),
                    await localStorage.removeItem("vitalizeCart"),
                    await setTimeout(function () {
                      setOrderComplete(false), window.location.replace("/");
                    }, 6000)
                  )}
                >
                  Изпрати поръчката
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  fullWidth={true}
                  onClick={handleReset}
                >
                  Рестартирай поръчката
                </Button>
              </div>
            ) : (
              <div>
                <div align="center" style={{ paddingTop: "2rem" }}>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Завърши" : "Напред"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="outlined" severity="success">
            <AlertTitle>Успешна поръчка</AlertTitle>
            Поръчката е приета успешно —{" "}
            <strong>
              наш служител ще се свърже с вас на {mobile} за потвърждение!
            </strong>
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default Cart;
