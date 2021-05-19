import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";
import { ShoppingCart, AccountCircle } from "@material-ui/icons";
import { Badge, AppBar, Paper, Typography } from "@material-ui/core";

function NavBar() {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Logged out!" } });
    return router.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt={auth.user.avatar}
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-3px)",
              marginRight: "3px",
            }}
          />{" "}
          {auth.user.name}
        </a>

        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <Link href="/profile">
            <a className="dropdown-item">Profile</a>
          </Link>
          {auth.user.role === "admin" && adminRouter()}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </li>
    );
  };

  return (
    <>
      <AppBar style={{ boxShadow: "none" }} position="sticky">
        <Paper
          position="sticky"
          style={{
            backgroundColor: "#0d7b73",
            color: "#fff",
            borderRadius: "0px",
          }}
        >
          <Typography variant="body2" align="center">
            При поръчки над 50лв, безплатна доставка
          </Typography>
        </Paper>
        <Paper
          style={{
            height: "4.5rem",
            minHeight: "4rem",
            borderRadius: "0px 0px 5px 5px",
          }}
        >
          <nav className="navbar navbar-expand-lg navbar-light">
            <Link href="/">
              <a className="navbar-brand">
                <img
                  src="../assets/images/logo-2.svg"
                  width="60%"
                  height="60%"
                />
              </a>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNavDropdown"
            >
              <ul className="navbar-nav p-1">
                <li className="nav-item">
                  <Link href="/cart">
                    <a className={"nav-link" + isActive("/cart")}>
                      <Badge badgeContent={cart.length} color="secondary">
                        <ShoppingCart />
                      </Badge>
                    </a>
                  </Link>
                </li>
                {Object.keys(auth).length === 0 ? (
                  <li className="nav-item">
                    <Link href="/signin">
                      <a className={"nav-link" + isActive("/signin")}>
                        <AccountCircle />
                      </a>
                    </Link>
                  </li>
                ) : (
                  loggedRouter()
                )}
              </ul>
            </div>
          </nav>
        </Paper>
      </AppBar>
    </>
  );
}

export default NavBar;
