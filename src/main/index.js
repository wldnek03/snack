import React from 'react';
import './index.css';
import axios from "axios"; 
import {Link} from 'react-router-dom';

function MainPage() {
      const  [products, setProducts]= React.useState([]);
      React.useEffect(function(){
            axios
            .get("https://c73c1209-6ef5-4199-84a7-1a77f9f71a6d.mock.pstmn.io/products")
            .then(function(result){
                const products = result.data.products;
                setProducts(products);
            })
            .catch(function(error){
                console.error("에러발생: ", error);
            }); 
        }, []);
    return (
        <>
            <div id="header">
                <div id="header-area">
                    <img src="/images/icons/logo.png" alt="Logo" />
                </div>
            </div>
            <div id="body">
                <div id="banner">
                    <img src="/images/banners/banner1.png" alt="Banner" />
                </div>
                <h1>판매되는 상품들</h1>
                <div id="product-list">
                    {products.map(function (products, index){
                        return(
                            <div className='product-card'>
                                <Link className= "product-link" to={'/product/' + index}>
                        <div>
                        <img className='product-img' src={products.imageUrl} alt={products.name || "Product"} />
                        </div>
                        <div className='product-contents'>
                            <span className="product-name">{products.name}</span>
                            <span className='product-price'>{products.price}</span>
                            <div className='product-seller'>
                            <img className='product-avatar' src="images/icons/avatar.png" alt="User avatar" />
                                <span>{products.seller}</span>
                            </div>
                        </div>
                        </Link>
                    </div>
                        )
                    })}
                    
                </div>
            </div>
            <div id="footer"></div>
        </>
    );
}

export default MainPage;
