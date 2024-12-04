import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import './index.css';

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(function() {
        axios
            .get("https://c73c1209-6ef5-4199-84a7-1a77f9f71a6d.mock.pstmn.io/product/" + id)
            .then(function(result) {
                console.log(result.data); 
                setProduct(result.data);
            })
            .catch(function(error) {
                console.error(error);
            });
    }, [id]);

    if (product == null) {
        return <h1>상품 정보를 받고 있습니다...</h1>;
    }
    return (
        <div>
            <div id="image-box">
                <img src={"/" + product.imageUrl} alt={product.name || "Product"} />
            </div>
            <div id="profile-box">
                <img src="/images/icons/avatar.png" alt="avator" />
                <span>{product.seller}</span>
            </div>
            <div id ="contents-box">
                <div id="name">{product.name}</div>
                <div id="price">{product.price}원</div>
                <div id="createdAt">2024년 12월 5일</div>
                <div id="description">{product.description}</div>
            </div>
        </div>
    );
}

export default ProductPage;