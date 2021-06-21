import React, { useState } from "react";
import {
  Typography,
  Link,
  Container,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import MessengerChat from "../Messenger";

const NewsletterSchema = Yup.object().shape({
  email: Yup.string().email("Невалиден e-mail формат"),
});

export function Newsletter() {
  const [alert, setAlert] = useState(false);
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={NewsletterSchema}
        onSubmit={async (values) => {
          await axios
            .post(
              "/api/newsletter",
              {
                email: values.email,
              },
              options
            )
            .then(() => setAlert(true));
        }}
      >
        {({ errors, touched, handleBlur, handleChange, values }) => (
          <Form style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              style={{ backgroundColor: "#fff", borderRadius: "2px" }}
              name="email"
              type="email"
              variant="filled"
              label="E-mail"
              placeholder="ivanivanov@abv.bg"
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.email && touched.email ? errors.email : null}
              helperText={errors.email && touched.email ? errors.email : null}
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
              Запиши ме
            </Button>
            {alert ? (
              <Alert severity="success">Записан сте за бюлетина успешно!</Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function Footer() {
  return (
      <>
      <MessengerChat/>
    <div
      style={{ backgroundColor: "#0d7b73", color: "#fff", minHeight: "12rem" }}
    >
      <Grid container style={{ padding: "2rem" }}>
        <Grid
          item
          xs={12}
          md={3}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Typography
            style={{ padding: "15px", fontWeight: "bold" }}
            variant="body2"
          >
            Важни страници
          </Typography>
          <Link style={{ color: "#fff" }} href="/za-nas">
            За нас
          </Link>
          <Link style={{ color: "#fff" }} href="/dostavka">
            Доставка
          </Link>
          <Link style={{ color: "#fff" }} href="/nachini-na-plashtane">
            Начини на плащане
          </Link>
          <Link style={{ color: "#fff" }} href="/poveritelnost">
            Политика за лични данни
          </Link>
          <Link style={{ color: "#fff" }} href="/page">
            Връщане на стоки
          </Link>
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="body2"
            style={{ padding: "15px", fontWeight: "bold" }}
          >
            За Vitalize.bg
          </Typography>
          <Typography variant="body2">
            Нашата мисия е да облекчим болката и да върнем усмивката на лицето
            Ви, защото здравето не е самоцел, то е необходимост за щастлив живот
            и незабравими спомени!
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Container
            align="center"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Newsletter />
          </Container>
        </Grid>
      </Grid>
      <div>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          style={{ padding: "15px", fontWeight: "bold", color: "#FFF" }}
        >
          <Link color="inherit" href="https://vitalize.bg/">
            Vitalize.bg
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
      </div>
    </div>
      </>
  );
}
