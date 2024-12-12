import React, { useState, useEffect } from "react";
import "./QAForm.css";

const QAForm = ({ isLoggedIn, userRole }) => {
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "환불",
    isPrivate: false,
  });
  const [replyData, setReplyData] = useState("");


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id; 
  const isAdmin = currentUser?.role === "admin"; 


  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleReplyChange = (e) => {
    setReplyData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {

      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = { ...formData, userId };
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {

      setQuestions([...questions, { ...formData, userId, reply: "" }]);
    }
    setFormData({ title: "", content: "", type: "환불", isPrivate: false });
    setIsPopupOpen(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(questions[index]);
    setIsPopupOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleReplySubmit = (index) => {
    if (!replyData.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    const updatedQuestions = [...questions];
    updatedQuestions[index].reply = replyData; 
    setQuestions(updatedQuestions);
    setReplyData(""); 
  };

  return (
    <div className="qa-container">
      <h1>Q&A</h1>

      {isLoggedIn ? (
        <button className="register-btn" onClick={() => setIsPopupOpen(true)}>
          문의 등록하기
        </button>
      ) : (
        <p>로그인 후 문의를 등록할 수 있습니다.</p>
      )}

      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            <h3>
              {question.isPrivate && !isAdmin && question.userId !== userId
                ? "비공개 문의"
                : question.title}
            </h3>
            <p>
              {question.isPrivate && !isAdmin && question.userId !== userId
                ? "비공개 내용입니다."
                : question.content}
            </p>
            <span>문의 유형: {question.type}</span>

            {(question.userId === userId || isAdmin) && (
              <div className="actions">
                <button onClick={() => handleEdit(index)}>수정</button>
                <button onClick={() => handleDelete(index)}>삭제</button>
              </div>
            )}

            {isAdmin && (
              <div className="reply-section">
                <textarea
                  placeholder="답변을 입력하세요"
                  value={replyData}
                  onChange={handleReplyChange}
                />
                <button onClick={() => handleReplySubmit(index)}>답변 등록</button>
              </div>
            )}

            {question.reply && (
              <div className="reply">
                <strong>관리자 답변:</strong>
                {question.isPrivate && question.userId !== userId && !isAdmin ? (
                  <p>비공개 답변입니다.</p>
                ) : (
                  <p>{question.reply}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{editingIndex !== null ? "문의 수정" : "문의 등록"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                제목:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                내용:
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                문의 유형:
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="환불">환불</option>
                  <option value="교환">교환</option>
                  <option value="파손">파손</option>
                </select>
              </label>
              <label>
                비공개:
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">
                {editingIndex !== null ? "수정 완료" : "등록하기"}
              </button>
              <button type="button" onClick={() => setIsPopupOpen(false)}>
                닫기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAForm;
