import React from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "../config/constants.js";

dayjs.extend(relativeTime);

function MainPage() {
  const [products, setProducts] = React.useState([]);
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
  }, []);
  return (
    <>
      <div>
        <div id="banner">
          <img src="/images/banners/banner1.png" alt="Banner" />
        </div>
        <h1>판매되는 상품들</h1>
        <div id="product-list">
          {products.map(function (products, index) {
            return (
              <div className="product-card">
                <Link className="product-link" to={"/product/" + products.id}>
                  <div>
                  <img src={`${API_URL}/${products.imageUrl}`} />
                  </div>
                  <div className="product-contents">
                    <span className="product-name">{products.name}</span>
                    <span className="product-price">{products.price}</span>
                    <div className="product-footer">
                      <div className="product-seller">
                        <img
                          className="product-avatar"
                          src="images/icons/avatar.png"
                          alt="User avatar"
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
