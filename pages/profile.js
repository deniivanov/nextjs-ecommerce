import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Container,
  TableBody,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import valid from "../utils/valid";
import { patchData } from "../utils/fetchData";

import { imageUpload } from "../utils/imageUpload";

const Profile = () => {
  const initialSate = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };
  const [data, setData] = useState(initialSate);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }

    if (name !== auth.user.name || avatar) updateInfo();
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });

    if (file.size > 1024 * 1024)
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1mb." },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect." },
      });

    setData({ ...data, avatar: file });
  };

  const updateInfo = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;
  return (
    <div className="profile_page">
      <Head>
        <title>Профил</title>
      </Head>
      <Container>
        <section className="row text-secondary my-3">
          <div className="col-md-4">
            <h3 className="text-center text-uppercase">
              {auth.user.role === "user"
                ? "Потребителски профил"
                : "Admin Profile"}
            </h3>

            <div className="avatar">
              <img
                src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                alt="avatar"
              />
              <span>
                <i className="fas fa-camera"></i>
                <p>Change</p>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  accept="image/*"
                  onChange={changeAvatar}
                />
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="name">Име</label>
              <input
                type="text"
                name="name"
                value={name}
                className="form-control"
                placeholder="Your name"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                defaultValue={auth.user.email}
                className="form-control"
                disabled={true}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Нова парола</label>
              <input
                type="password"
                name="password"
                value={password}
                className="form-control"
                placeholder="Вашата нова парола"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cf_password">Потвърди нова парола</label>
              <input
                type="password"
                name="cf_password"
                value={cf_password}
                className="form-control"
                placeholder="Потвърди нова парола"
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-info"
              disabled={notify.loading}
              onClick={handleUpdateProfile}
            >
              Запази
            </button>
          </div>

          <div className="col-md-8">
            <h3 className="text-uppercase">Поръчки</h3>
            <Table>
              <TableHead style={{ backgroundColor: "#adbc22", color: "#FFF" }}>
                <TableRow>
                  <TableCell>Номер на поръчка</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Сума</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Статус на плащане</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.total} лв</TableCell>
                    <TableCell>
                      {order.delivered === true
                        ? "Доставена"
                        : "Не е доставена"}
                    </TableCell>
                    <TableCell>
                      {order.paid === true ? (
                        <Alert severity={"success"}>Платена</Alert>
                      ) : (
                        <Alert severity={"error"}>Не е платена</Alert>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Profile;
