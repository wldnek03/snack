import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, Spin, Modal, Form} from "antd";
import ProductCard from "../components/productCard";

function ProductPage({ userNickname }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getProduct = useCallback(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then((result) => {
        setProduct(result.data.product);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const getRecommendations = useCallback(() => {
    axios.get(`${API_URL}/products/${id}/recommendation`)
      .then((result) => {
        setProducts(result.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const showPurchaseModal = () => {
    if (!userNickname) {
      message.warning("로그인이 필요합니다.");
      return;
    }
    setIsPurchaseModalVisible(true);
  };

  const addToCart = () => {
    if (!userNickname) {
      message.warning("로그인이 필요합니다.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
    const cartItems = userData.cartItems || [];
    
    const isAlreadyInCart = cartItems.some((item) => item.id === product.id);

    if (isAlreadyInCart) {
      message.warning("이미 장바구니에 있는 상품입니다.");
    } else {
      const updatedCartItems = [...cartItems, product];
      const updatedUserData = {
        ...userData,
        cartItems: updatedCartItems
      };
      localStorage.setItem(userNickname, JSON.stringify(updatedUserData));
      message.success("장바구니에 추가되었습니다.");
    }
  };

  // Ensure this function is used in the form's onFinish prop
  const handlePurchase = async (values) => {
    try {
      await axios.post(`${API_URL}/purchase/${id}`, {
        ...values,
        productId: id,
        userId: userNickname,
      });

      const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
      const purchasedItems = userData.purchasedItems || [];

      const purchasedProduct = {
        ...product,
        purchaseDate: new Date().toISOString(),
        purchaseDetails: values
      };

      const updatedUserData = {
        ...userData,
        purchasedItems: [...purchasedItems, purchasedProduct]
      };

      localStorage.setItem(userNickname, JSON.stringify(updatedUserData));
      
      setIsPurchaseModalVisible(false);
      setIsCompleteModalVisible(true);
      getProduct();
    } catch (error) {
      message.error(`구매 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleComplete = () => {
    setIsCompleteModalVisible(false);
    navigate('/');
  };

  useEffect(() => {
    getProduct();
    getRecommendations();
  }, [getProduct, getRecommendations]);

  if (product === null) {
    return (
      <div style={{ textAlign: "center", paddingTop: 32 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div id="image-box">
        <img src={`${API_URL}/${product.imageUrl}`} alt="상품 이미지" />
      </div>
      <div id="profile-box">
        <img src="/images/icons/avatar.png" alt="프로필 아이콘" />
        <span>{product.seller}</span>
      </div>
      <div id="contents-box">
        <div id="name">{product.name}</div>
        <div id="price">{product.price}원</div>
        <div id="quantity">재고: {product.quantity}개</div>
        <div id="createdAt">
          {dayjs(product.createdAt).format("YYYY년 MM월 DD일")}
        </div>
        <Button
          id="purchase-button"
          size="large"
          type="primary"
          danger
          onClick={showPurchaseModal}
          disabled={product.quantity <= 0}
          style={{ marginRight: "10px" }}
        >
          {product.quantity > 0 ? "구매하기" : "품절"}
        </Button>
        <Button
          id="add-to-cart-button"
          size="large"
          type="default"
          onClick={addToCart}
          disabled={product.quantity <= 0}
        >
          장바구니에 추가
        </Button>
        <div id="description-box">
          <pre id="description">{product.description}</pre>
        </div>

        <h1>추천 상품</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        
      </div>

      <Modal
        title="상품 구매"
        visible={isPurchaseModalVisible}
        onCancel={() => setIsPurchaseModalVisible(false)}
        footer={null}
      >
       {/* Ensure handlePurchase is connected here */}
       <Form form={form} layout="vertical" onFinish={handlePurchase}>
         {/* Form fields go here */}
         ...
       </Form>
     </Modal>

     <Modal
       title="구매 완료"
       visible={isCompleteModalVisible}
       onCancel={() => setIsCompleteModalVisible(false)}
       footer={[
         <Button key="home" type="primary" onClick={handleComplete}>
           홈으로 가기
         </Button>,
       ]}
     >
        <p>구매가 완료되었습니다.</p>
        <p>입금 확인 후 배송이 시작됩니다.</p>
      </Modal>
    </div>
  );
}

export default ProductPage;
