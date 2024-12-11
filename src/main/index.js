import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config/constants.js";
import { Carousel, Menu, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import ProductCard from "../components/productCard";

function MainPage() {
  const [products, setProducts] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  React.useEffect(function () {
    axios
      .get(`${API_URL}/products`)
      .then(function (result) {
        const products = result.data.products;
        setProducts(products);
      })
      .catch(function (error) {
        console.error("에러 발생 : ", error);
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

  const categories = [
    { title: "추억의 불량식품", link: "/category/snack", value: "snack" },
    { title: "일본간식", link: "/category/japan", value: "japan" },
    { title: "중국간식", link: "/category/china", value: "china" },
    { title: "동남아간식", link: "/category/asia", value: "asia" },
    { title: "유럽간식", link: "/category/europe", value: "europe" },
    { title: "미국간식", link: "/category/usa", value: "usa" },
    { title: "라면/컵라면", link: "/category/ramen", value: "ramen" },
    { title: "음료/커피", link: "/category/drink", value: "drink" },
  ];

  return (
    <div>
      <div
        className="menu-container"
        style={{
          display: "flex",
          backgroundColor: "#f5f5f5",
          padding: "10px 0",
          borderBottom: "1px solid #e8e8e8",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ position: "relative" }}>
            <Button
              icon={<MenuOutlined />}
              size="large"
              style={{
                backgroundColor: "#967a5d",
                color: "white",
                marginRight: "20px",
              }}
              onClick={() => setIsMenuVisible(!isMenuVisible)}
            >
              전체 카테고리
            </Button>
            {isMenuVisible && (
              <Menu
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "200px",
                  zIndex: 1000,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {categories.map((category, index) => (
                  <Menu.Item key={index}>
                    <Link to={category.link}>{category.title}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Link
              to="/new"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              신상품
            </Link>
            <Link
              to="/QAForm"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Q & A
            </Link>
            <a
              href="https://itwlsmdwjdqhrhdgkrrhk-68217.waveon.me/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                textDecoration: "none",
              }}
            >
              mbti
            </a>
          </div>
        </div>
      </div>

      <div id="body">
        <Carousel autoplay autoplaySpeed={3000}>
          {banners.map((banner, index) => {
            return (
              <Link to={banner.href} key={index}>
                <div id="banner">
                  <img src={`${API_URL}/${banner.imageUrl}`} alt="banner" />
                </div>
              </Link>
            );
          })}
        </Carousel>

        <h1 id="product-headline">전체 상품</h1>
        <div id="product-list">
          {products.map(function (product, index) {
            return <ProductCard product={product} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
