import React from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "../config/constants.js";
import { Carousel } from "antd";

dayjs.extend(relativeTime);

function MainPage() {
  const [products, setProducts] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
  React.useEffect(function () {
    axios
      .get(`${API_URL}/products`)
      .then(function (result) {
        const products = result.data.products;
        setProducts(products);
      })
      .catch(function (error) {
        console.error("에러발생: ", error);
      });
    axios
      .get(`${API_URL}/banners`)
      .then((result) => {
        const banners = result.data.banners;
        setBanners(banners);
      })
      .catch((error) => {
        console.error("에러 발생 : ", error);
      });
  }, []);
  return (
    <>
      <div>
        <Carousel autoplay autoplaySpeed={3000}>
          {banners.map((banner, index) => {
            return (
              <Link to={banner.href} key={index}>
                <div id="banner">
                  <img
                    src={`${API_URL}/${banner.imageUrl}`}
                    alt={`Banner ${index + 1}`} // alt 속성 추가
                  />
                </div>
              </Link>
            );
          })}
        </Carousel>
        <h1 id="product-headline">판매되는 상품들</h1>
        <div id="product-list">
          {products.map(function (products, index) {
            return (
              <div className="product-card" key={index}>
                {products.soldout === 1 && <div className="product-blur" />}
                <Link
                  style={{ color: "inherit" }}
                  className="product-link"
                  to={`/products/${products.id}`}
                >
                  <div>
                    <img
                      className="product-img"
                      src={`${API_URL}/${products.imageUrl}`}
                      alt={products.name} // alt 속성 추가
                    />
                  </div>
                  <div className="product-contents">
                    <span className="product-name">{products.name}</span>
                    <span className="product-price">{products.price}</span>
                    <div className="product-footer">
                      <div className="product-seller">
                        <img
                          className="product-avatar"
                          src="images/icons/avatar.png"
                          alt="Seller Avatar" // alt 속성 추가
                        />
                        <span>{products.seller}</span>
                      </div>
                      <span className="product-date">
                        {dayjs(products.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MainPage;