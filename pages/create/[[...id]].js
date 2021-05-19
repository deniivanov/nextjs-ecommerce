import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { imageUpload } from "../../utils/imageUpload";
import { postData, getData, putData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";

const ProductsManager = () => {
  const initialState = {
    title: "",
    price: "",
    originalPrice: "",
    inStock: "",
    description: "",
    content: "",
    whenToUse: "",
    howItWorks: "",
    howToUse: "",
    category: "",
  };
  const [product, setProduct] = useState(initialState);
  const {
    title,
    price,
    originalPrice,
    inStock,
    description,
    content,
    whenToUse,
    howToUse,
    howItWorks,
    category,
  } = product;

  const [images, setImages] = useState([]);

  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist." },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The largest image size is 1mb");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Image format is incorrect.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Select up to 5 images." },
      });
    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all"
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add all the fields." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    } else {
      res = await postData(
        "product",
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  return (
    <div className="products_manager">
      <Head>
        <title>Добави нов продукт</title>
      </Head>
      <div>
        <Typography style={{ padding: "10px" }} align="center" variant="h4">
          Добави продукт
        </Typography>
        <Grid direction="row" justify="center" alignItems="center">
          <Typography variant="h6">Описание на продукта</Typography>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12} md={6}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label="Име на продукт"
                  name="title"
                  variant="outlined"
                  value={title}
                  placeholder="Име на продукт"
                  onChange={handleChangeInput}
                />
                <TextField
                  label="Цена"
                  type="number"
                  name="price"
                  variant="outlined"
                  value={price}
                  placeholder="Цена"
                  onChange={handleChangeInput}
                />
                <TextField
                  label="Оригинална Цена"
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  variant="outlined"
                  value={originalPrice}
                  placeholder="Цена"
                  onChange={handleChangeInput}
                />
                <TextField
                  label="Наличност"
                  type="number"
                  name="inStock"
                  variant="outlined"
                  value={inStock}
                  placeholder="Наличност"
                  onChange={handleChangeInput}
                />
                <TextField
                  label="Описание"
                  name="description"
                  variant="outlined"
                  type="textarea"
                  id="description"
                  multiline
                  rows={3}
                  rowsMax={4}
                  placeholder="Description"
                  onChange={handleChangeInput}
                  value={description}
                />

                <TextField
                  label="Описание 2"
                  type="textarea"
                  name="content"
                  variant="outlined"
                  id="content"
                  multiline
                  rows={3}
                  rowsMax={4}
                  placeholder="Описание 2"
                  onChange={handleChangeInput}
                  value={content}
                />
                <TextField
                  label="Кога се ползва"
                  type="textarea"
                  name="whenToUse"
                  variant="outlined"
                  id="whenToUse"
                  multiline
                  rows={3}
                  rowsMax={4}
                  placeholder="Кога да ползваме"
                  onChange={handleChangeInput}
                  value={whenToUse}
                />
                <TextField
                  label="Как се ползва"
                  type="textarea"
                  name="howToUse"
                  variant="outlined"
                  id="howToUse"
                  multiline
                  rows={3}
                  rowsMax={4}
                  placeholder="Как се ползва"
                  onChange={handleChangeInput}
                  value={howToUse}
                />
                <TextField
                  label="Как работи"
                  type="textarea"
                  name="howItWorks"
                  variant="outlined"
                  id="howItWorks"
                  multiline
                  rows={3}
                  rowsMax={4}
                  placeholder="Как работи"
                  onChange={handleChangeInput}
                  value={howItWorks}
                />
                <div className="input-group-prepend px-0 my-2">
                  <Select
                    name="category"
                    id="category"
                    value={category}
                    fullWidth={true}
                    variant="outlined"
                    onChange={handleChangeInput}
                  >
                    <MenuItem value="all">Всички продукти</MenuItem>
                    {categories.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <Button type="submit" variant="contained" color="secondary">
                  {onEdit ? "Обнови" : "Добави"}
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Снимки на продукта</Typography>
              <div className="col-md-6 my-4">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Upload</span>
                  </div>
                  <div className="custom-file border rounded">
                    <input
                      type="file"
                      className="custom-file-input"
                      onChange={handleUploadInput}
                      multiple
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="row img-up mx-0">
                  {images.map((img, index) => (
                    <div key={index} className="file_img my-1">
                      <img
                        src={img.url ? img.url : URL.createObjectURL(img)}
                        alt=""
                        className="img-thumbnail rounded"
                      />
                      <span onClick={() => deleteImage(index)}>X</span>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default ProductsManager;
