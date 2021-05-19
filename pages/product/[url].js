import Head from "next/head";
import Link from "next/link";
import { useState, useContext } from "react";
import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";
import { Rating } from "@material-ui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import { ExpandMore } from "@material-ui/icons";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Grid,
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CardHeader,
  Card,
  CardContent,
} from "@material-ui/core";
import Footer from "../../components/Footer/Footer";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Името е твърде кратко")
    .max(50, "Името е твърде дълго!")
    .required("Required"),
  tel: Yup.string()
    .matches(phoneRegExp, "Невалиден формат")
    .min(8, "Невалиден формат, твърде малко цифри!")
    .max(13, "Невалиден формат, твърде много цифри")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

export const ValidationSchemaExample = () => (
  <div>
    <Formik
      initialValues={{
        name: "",
        tel: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched, handleBlur, handleChange, values }) => (
        <form style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            name="name"
            label="Имена"
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.name && touched.name ? errors.name : null}
            helperText={errors.name && touched.name ? errors.name : null}
          />
          <TextField
            name="tel"
            type="number"
            label="Телефонен Номер"
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.tel && touched.tel ? errors.tel : null}
            helperText={errors.tel && touched.tel ? errors.tel : null}
          />
          <Button
            onClick={() => setDialog(false)}
            style={{
              marginTop: "20px",
              backgroundColor: "#adbc22",
              color: "#fff",
            }}
            variant="contained"
            fullWidth={true}
          >
            Поръчвам 🚚
          </Button>
        </form>
      )}
    </Formik>
  </div>
);

const DetailProduct = (props) => {
  const [dialog, setDialog] = useState(false);
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  const isActive = (index) => {
    if (tab === index) return " active";
    return "";
  };

  return (
    <>
      <div className="row detail_page">
        <Head>
          <title>{product.title} | Vitalize.bg</title>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300"
            rel="stylesheet"
            type="text/css"
            rel="preload"
          ></link>
        </Head>
        {/* Hero Goes here */}
        <Paper
          style={{
            backgroundColor: "#f8f9ed",
            width: "100%",
            height: "auto",
            margin: "1rem",
            padding: "1rem",
          }}
        >
          <Grid container>
            <Grid style={{ margin: "auto" }} item xs={12} md={6}>
              <Typography
                align="center"
                variant="h1"
                style={{
                  fontSize: "40px",
                  position: "relative",
                }}
              >
                Край на болките в гърба
              </Typography>
              <Typography
                align="center"
                variant="body1"
                style={{
                  fontSize: "18",
                  position: "relative",
                }}
              >
                Решение на проблема с шиповете, веднъж-завинаги
              </Typography>
            </Grid>
            <Grid style={{ margin: "auto" }} item xs={12} md={6}>
              <div align="center">
                <img
                  position="relative"
                  margin="auto"
                  src={`${product.images[0].url}`}
                  width="50%"
                  height="auto"
                ></img>
              </div>
            </Grid>
          </Grid>
        </Paper>
        {/* Hero Ends here */}
        <Container style={{ paddingTop: "10px", marginTop: "20px" }}>
          {/* Dialog Starts Here */}
          <Dialog
            maxWidth="lg"
            open={dialog}
            onClose={() => setDialog(false)}
            aria-labelledby="Quick Order"
          >
            <DialogTitle id="Quick Order">Бърза поръчка</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column" }}>
              <Typography>
                Поздравления за прекрасният избор! Вие избрахте да поръчате{" "}
                <b>{product.title}</b>.
              </Typography>
              <Typography variant="subtitle">
                Моля въведете своите данни в полетата долу, за да можем да
                обработим вашата поръчка възможно най-скоро
              </Typography>
              <ValidationSchemaExample />
            </DialogContent>
          </Dialog>
          {/* Dialog Ends Here */}
          <Grid container>
            <Grid item xs={12} md={6} style={{ padding: "15px" }}>
              <img
                src={product.images[tab].url}
                alt={product.images[tab].url}
                style={{ height: "350px" }}
              />

              <div className="row mx-0" style={{ cursor: "pointer" }}>
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={img.url}
                    className={`img-thumbnail rounded ${isActive(index)}`}
                    style={{ height: "80px", width: "20%" }}
                    onClick={() => setTab(index)}
                  />
                ))}
              </div>
            </Grid>
            <Grid item xs={12} md={6} style={{ padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  verticalAlign: "",
                }}
              >
                <Rating value={5} readOnly />
                <Typography
                  variant="body2"
                  style={{ fontFamily: "Open Sans", fontSize: "12px" }}
                >
                  <Link href={`${product.url}#reviews`}>
                    Оценки от (63) човека
                  </Link>
                </Typography>
              </div>
              <Typography variant="h1" style={{ fontSize: "2em" }}>
                {product.title}
              </Typography>
              <Typography
                variant="h2"
                style={{
                  fontSize: "20px",
                  fontFamily: "Open Sans",
                  fontWeight: "700",
                  color: "#9b1e45",
                }}
              >
                Цена {product.price} лв
              </Typography>
              <Typography
                variant="body2"
                style={{ textDecoration: "line-through" }}
              >
                Намалено от {product.originalPrice} лв
              </Typography>
              <Typography variant="h5">Описание</Typography>
              <Typography variant="body1">{product.description}</Typography>
              <Button
                fullWidth={true}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#adbc22",
                  color: "#fff",
                }}
                variant="contained"
                onClick={() => dispatch(addToCart(product, cart))}
              >
                Добави в количката 🛒
              </Button>
              <Divider />
              <Button
                style={{
                  border: "1px solid #adbc22",
                  color: "#000",
                  backgroundColor: "#e2d36b",
                }}
                variant="contained"
                fullWidth={true}
                onClick={() => setDialog(true)}
              >
                Бърза поръчка 🚀
              </Button>
            </Grid>
          </Grid>
          <Container>
            <div align="center">
              <Grid
                container
                style={{
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Grid item xs={4} md={4}>
                  <img
                    src="/assets/icons/bez-paraben.svg"
                    width="50%"
                    height="auto"
                  ></img>
                </Grid>
                <Grid item xs={4} md={4}>
                  <img
                    src="/assets/icons/naturalni-sustavki.svg"
                    width="50%"
                    height="auto"
                  ></img>
                </Grid>
                <Grid item xs={4} md={4}>
                  <img
                    src="/assets/icons/dostavka.svg"
                    width="50%"
                    height="auto"
                  ></img>
                </Grid>
              </Grid>
            </div>
          </Container>
          <Container
            style={{
              marginTop: "3rem",
              backgroundColor: "#f8f9ed",
              height: "10rem",
              borderLeft: "3px solid #adbc22",
              marginBottom: "2rem",
            }}
          >
            <div align="center">
              <Typography
                style={{
                  fontSize: "1.5em",
                  fontFamily: "Open Sans",
                  paddingTop: "2rem",
                }}
              >
                Може да заплатите своята поръчка чрез наложен платеж, като
                доставката при поръчки над 50 лв., за територията на цяла
                България е безплатна.
              </Typography>
            </div>
          </Container>
          <Container>
            <Typography
              align="center"
              variant="h4"
              pb="2rem"
              style={{ marginBottom: "2rem" }}
            >
              Как точно помага
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "100",
                    fontSize: "16px",
                  }}
                >
                  Хепатофелин е натурален продукт подкрепящ функциите на черния
                  дроб, който съдържа оптимална доза екстракт от бял трън
                  (силимарин), артишок, глухарче, соево и ленено масло. В черния
                  дроб се обработват и разграждат веществата, които приемаме.
                  Злоупотребата с алкохол, тютюнопушенето, лекарствата, както и
                  някои вируси и паразити, могат да предизвикат увреждания на
                  черния дроб. Билковата терапия често е решение на голяма част
                  от наблюдаваните проблеми, също е препоръчителна за
                  профилактика.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <div align="center">
                  <img
                    height="300px"
                    width="auto"
                    src="https://res.cloudinary.com/dvecmkagx/image/upload/v1620403827/BioVegan/murmeltier-vitalize_jzp0qu.jpg"
                  ></img>
                </div>
              </Grid>
            </Grid>
          </Container>
          <Container>
            <Typography
              align="center"
              variant="h4"
              style={{ marginBottom: "2rem" }}
            >
              Как се ползва
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <div align="center">
                  <img
                    height="300px"
                    width="auto"
                    src="https://vitaherb.bg/static/hep-milk-thistle-cd18e0cdf83f0311352cfbf35d3736e6.jpg"
                  ></img>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "100",
                    fontSize: "16px",
                  }}
                >
                  Хепатофелин е натурален продукт подкрепящ функциите на черния
                  дроб, който съдържа оптимална доза екстракт от бял трън
                  (силимарин), артишок, глухарче, соево и ленено масло. В черния
                  дроб се обработват и разграждат веществата, които приемаме.
                  Злоупотребата с алкохол, тютюнопушенето, лекарствата, както и
                  някои вируси и паразити, могат да предизвикат увреждания на
                  черния дроб. Билковата терапия често е решение на голяма част
                  от наблюдаваните проблеми, също е препоръчителна за
                  профилактика.
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <Container>
            <Typography
              align="center"
              variant="h4"
              style={{ marginBottom: "2rem" }}
            >
              При какви проблеми помага
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "100",
                    fontSize: "16px",
                  }}
                >
                  Хепатофелин е натурален продукт подкрепящ функциите на черния
                  дроб, който съдържа оптимална доза екстракт от бял трън
                  (силимарин), артишок, глухарче, соево и ленено масло. В черния
                  дроб се обработват и разграждат веществата, които приемаме.
                  Злоупотребата с алкохол, тютюнопушенето, лекарствата, както и
                  някои вируси и паразити, могат да предизвикат увреждания на
                  черния дроб. Билковата терапия често е решение на голяма част
                  от наблюдаваните проблеми, също е препоръчителна за
                  профилактика.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <div align="center">
                  <img
                    height="300px"
                    width="auto"
                    src="https://res.cloudinary.com/dvecmkagx/image/upload/v1620403819/BioVegan/murmeltier-2-vitalize_zguvn2.jpg"
                  ></img>
                </div>
              </Grid>
            </Grid>
          </Container>
          <Container>
            <Typography
              align="center"
              variant="h4"
              style={{ marginBottom: "2rem", marginTop: "1rem" }}
            >
              Как работи
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <div align="center">
                  <img
                    height="300px"
                    width="auto"
                    src="https://vitaherb.bg/static/hep-liver-prevention-1c5c61486683b3d3f23cd06028645a7b.jpg"
                  ></img>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: "100",
                    fontSize: "16px",
                  }}
                >
                  Хепатофелин е натурален продукт подкрепящ функциите на черния
                  дроб, който съдържа оптимална доза екстракт от бял трън
                  (силимарин), артишок, глухарче, соево и ленено масло. В черния
                  дроб се обработват и разграждат веществата, които приемаме.
                  Злоупотребата с алкохол, тютюнопушенето, лекарствата, както и
                  някои вируси и паразити, могат да предизвикат увреждания на
                  черния дроб. Билковата терапия често е решение на голяма част
                  от наблюдаваните проблеми, също е препоръчителна за
                  профилактика.
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <div align="center">
            <Button
              style={{
                marginTop: "20px",
                backgroundColor: "#adbc22",
                color: "#fff",
                height: "3rem",
              }}
              fullWidth={true}
              variant="contained"
              onClick={() => setDialog(true)}
            >
              Бърза поръчка 🚀
            </Button>
          </div>
          <Container style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Typography
              align="center"
              variant="h4"
              style={{ marginBottom: "2rem" }}
            >
              Мнения от клиенти
            </Typography>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Card style={{ backgroundColor: "#f8f9ed", margin: "0.5rem" }}>
                  <div align="center" style={{ marginTop: "1rem" }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://res.cloudinary.com/dvecmkagx/image/upload/v1619535915/BioVegan/ivan-georgiev_rotnp1.jpg"
                    />
                  </div>
                  <CardContent>
                    <Typography variant="subtitle">
                      Маста от мармот се използва в медицината и козметиката за
                      лечение на ревматоидни проблеми и кожни раздразнения.
                      Особено подходящ за масаж на раменете, облекчава артритни
                      и мускулни болки, навяхвания, при подагра, ревматизъм и
                      артрит, болки в гръбнака или възпаление на ставите.
                    </Typography>
                  </CardContent>
                  <div align="center">
                    <Rating value={5} readOnly size="small" />
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={{ backgroundColor: "#f8f9ed", margin: "0.5rem" }}>
                  <div align="center" style={{ marginTop: "1rem" }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://res.cloudinary.com/dvecmkagx/image/upload/v1619535889/BioVegan/petar-genchev_hxkm2l.jpg"
                    />
                  </div>
                  <CardContent>
                    <Typography variant="subtitle">
                      Маста от мармот се използва в медицината и козметиката за
                      лечение на ревматоидни проблеми и кожни раздразнения.
                      Особено подходящ за масаж на раменете, облекчава артритни
                      и мускулни болки, навяхвания, при подагра, ревматизъм и
                      артрит, болки в гръбнака или възпаление на ставите.
                    </Typography>
                  </CardContent>
                  <div align="center">
                    <Rating value={5} readOnly size="small" />
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={{ backgroundColor: "#f8f9ed", margin: "0.5rem" }}>
                  <div align="center" style={{ marginTop: "1rem" }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://res.cloudinary.com/dvecmkagx/image/upload/v1619535852/BioVegan/genka-pencheva_s94oyn.jpg"
                    />
                  </div>
                  <CardContent>
                    <Typography variant="subtitle">
                      Маста от мармот се използва в медицината и козметиката за
                      лечение на ревматоидни проблеми и кожни раздразнения.
                      Особено подходящ за масаж на раменете, облекчава артритни
                      и мускулни болки, навяхвания, при подагра, ревматизъм и
                      артрит, болки в гръбнака или възпаление на ставите.
                    </Typography>
                  </CardContent>
                  <div align="center">
                    <Rating value={5} readOnly size="small" />
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Container>
          <Container style={{ maringBottom: "1rem" }}>
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "2rem" }}
            >
              Допълнителна информация
            </Typography>
            <Accordion style={{ borderColor: "#61b29d" }} variant="h5">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                style={{
                  backgroundColor: "#daf2eb",
                  color: "#0d7b73",
                  borderRadius: "5px 5px 0px 0px",
                  fontFamily: "Open Sans",
                  fontWeight: "100",
                }}
              >
                Често задавани въпроси
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  style={{ fontFamily: "Open Sans", fontWeight: "100" }}
                >
                  {product.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion variant="h5">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                style={{
                  backgroundColor: "#daf2eb",
                  color: "#0d7b73",
                  fontFamily: "Open Sans",
                  fontWeight: "100",
                }}
              >
                Съдържание на продукта
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  style={{ fontFamily: "Open Sans", fontWeight: "100" }}
                  variant="body1"
                >
                  {product.howToUse}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion variant="h5">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                style={{
                  backgroundColor: "#daf2eb",
                  color: "#0d7b73",
                  fontFamily: "Open Sans",
                  fontWeight: "100",
                }}
              >
                Продуктови характеристики
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  style={{ fontFamily: "Open Sans", fontWeight: "100" }}
                  variant="body1"
                >
                  {product.whenToUse}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion variant="h5">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                style={{
                  backgroundColor: "#daf2eb",
                  color: "#0d7b73",
                  fontFamily: "Open Sans",
                  fontWeight: "100",
                }}
              >
                Важно
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  style={{ fontFamily: "Open Sans", fontWeight: "100" }}
                  variant="body1"
                >
                  {product.howItWorks}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Container>
        </Container>
        <Container style={{ marginBottom: "3rem" }}>
          <Typography
            align="center"
            variant="h5"
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          >
            Готов съм да поръчам
          </Typography>
          <div align="center">
            <Button
              style={{
                marginTop: "20px",
                backgroundColor: "#adbc22",
                color: "#fff",
                height: "3rem",
              }}
              fullWidth={true}
              variant="contained"
              onClick={() => setDialog(true)}
            >
              Бърза поръчка 🚀
            </Button>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export async function getServerSideProps({ params: { url } }) {
  const res = await getData(`product/${url}`);
  // server side rendering
  return {
    props: { product: res.product }, // will be passed to the page component as props
  };
}

export default DetailProduct;
