import React from "react";
import {
  Typography,
  Link,
  Container,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";

export default function Footer() {
  return (
    <Container
      style={{ backgroundColor: "#0d7b73", color: "#fff", minHeight: "12rem" }}
    >
      <Grid container>
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
          <Link style={{ color: "#fff" }} href="/page">
            Blabla
          </Link>
          <Link style={{ color: "#fff" }} href="/page">
            За нас
          </Link>
          <Link style={{ color: "#fff" }} href="/page">
            Политика за поверителност
          </Link>
          <Link style={{ color: "#fff" }} href="/page">
            Условия за доставка
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
        <Grid item xs={12} md={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            style={{ padding: "15px", fontWeight: "bold", color: "#FFF" }}
          >
            {"Copyright © "}
            <Link color="inherit" href="https://vitalize.bg/">
              Vitalize.bg
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
          <Container
            align="center"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <TextField
              style={{ backgroundColor: "#fff", borderRadius: "2px" }}
              variant="outlined"
              placeholder="Запиши се..."
            ></TextField>
            <Button color="secondary" size="sm" variant="contained">
              Записвам се
            </Button>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
}
