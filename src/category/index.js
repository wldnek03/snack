import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/constants.js";
import ProductCard from "../components/productCard";

function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/products`)
      .then((result) => {
        const filteredProducts = result.data.products.filter(
          (product) => product.category === categoryId
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        setLoading(false);
      });
  }, [categoryId]);

  const getCategoryTitle = () => {
    const categoryMap = {
      snack: "추억의 불량식품",
      japan: "일본간식",
      china: "중국간식",
      asia: "동남아간식",
      europe: "유럽간식",
      usa: "미국간식",
      ramen: "라면/컵라면",
      drink: "음료/커피",
      box: "박스상품"
    };
    return categoryMap[categoryId] || "상품 목록";
  };

  return (
    <div>
      <h1 style={{ 
        padding: "20px", 
        borderBottom: "1px solid #e8e8e8",
        margin: "0 0 20px 0"
      }}>
        {getCategoryTitle()}
      </h1>
      <div id="product-list" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px"
      }}>
        {loading ? (
          <div>로딩중...</div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
