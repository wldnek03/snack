import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UploadPage from "./upload";
import ProductPage from "./product";
import MainPageComponent from "./main/index";
import CategoryPage from "./category/index.js";
import LoginPage from "./login";
import MyPage from "./mypage";
import NewProductsPage from "./new";
import QAForm from "./QAForm/index.js";
import { Button, Dropdown, Menu } from "antd";
import { DownloadOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        setUserNickname(currentUser.nickname || "");
        setUserRole(currentUser.role || "user");
      }
    } else {
      setIsLoggedIn(false);
      setUserNickname("");
      setUserRole("");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserNickname("");
    setUserRole("");
    navigate("/");
  };

  const isAdmin = () => userRole === "admin";

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/mypage")} icon={<UserOutlined />}>
        마이페이지
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout} icon={<LogoutOutlined />}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div id="header">
        <div id="header-area">
          <Link to="/">
            <img src="/images/icons/logo.png" alt="Logo" />
          </Link>
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            {isLoggedIn && isAdmin() && (
              <Button size="large" onClick={() => navigate("/upload")} icon={<DownloadOutlined />}>
                상품 업로드
              </Button>
            )}
            {isLoggedIn ? (
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <Button size="large" icon={<UserOutlined />}>
                  {userNickname}
                </Button>
              </Dropdown>
            ) : (
              <Button size="large" onClick={() => navigate("/login")} icon={<LoginOutlined />}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
      <div id="body">
        <Routes>
          <Route path="/" element={<MainPageComponent />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductPage userNickname={userNickname} />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/mypage" element={<MyPage userNickname={userNickname} isLoggedIn={isLoggedIn} />} />
          <Route path="/new" element={<NewProductsPage />} />
          <Route 
  path="/QAForm" 
  element={
    <QAForm 
      isLoggedIn={isLoggedIn} 
      userRole={userRole} 
      userNickname={userNickname} 
    />
  } 
/>

        </Routes>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
