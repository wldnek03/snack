import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import "./index.css";

function LoginPage({ setIsLoggedIn }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinishLogin = (values) => {
    const userInfo = localStorage.getItem(values.id);
    
    if (!userInfo) {
      message.error("존재하지 않는 아이디입니다.");
      return;
    }

    const user = JSON.parse(userInfo);
    if (user.password !== values.password) {
      message.error("비밀번호가 일치하지 않습니다.");
      return;
    }


    localStorage.setItem("userToken", values.id);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setIsLoggedIn(true);
    message.success("로그인 성공!");
    navigate("/");
  };

  const onFinishRegister = (values) => {
    const existingUser = localStorage.getItem(values.id);
    if (existingUser) {
      message.error("이미 존재하는 아이디입니다.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      message.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    const userInfo = {
      nickname: values.nickname,
      id: values.id,
      password: values.password,
      role: "user"
    };
    
    localStorage.setItem(values.id, JSON.stringify(userInfo));
    message.success("회원가입이 완료되었습니다.");
    form.resetFields();
    setIsLoginView(true);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {isLoginView ? (
          <>
            <h2>로그인</h2>
            <Form form={form} onFinish={onFinishLogin}>
              <Form.Item
                name="id"
                rules={[{ required: true, message: "아이디를 입력해주세요" }]}
              >
                <Input placeholder="아이디" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
              >
                <Input.Password placeholder="비밀번호" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-button">
                  로그인
                </Button>
              </Form.Item>
            </Form>
            <div className="switch-form">
              계정이 없으신가요?{" "}
              <Button type="link" onClick={() => setIsLoginView(false)}>
                회원가입
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2>회원가입</h2>
            <Form form={form} onFinish={onFinishRegister}>
              <Form.Item
                name="nickname"
                rules={[{ required: true, message: "닉네임을 입력해주세요" }]}
              >
                <Input placeholder="닉네임" />
              </Form.Item>
              <Form.Item
                name="id"
                rules={[{ required: true, message: "아이디를 입력해주세요" }]}
              >
                <Input placeholder="아이디" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
              >
                <Input.Password placeholder="비밀번호" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "비밀번호를 다시 입력해주세요" },
                ]}
              >
                <Input.Password placeholder="비밀번호 확인" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-button">
                  회원가입
                </Button>
              </Form.Item>
            </Form>
            <div className="switch-form">
              이미 계정이 있으신가요?{" "}
              <Button type="link" onClick={() => setIsLoginView(true)}>
                로그인
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
