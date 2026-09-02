import React, {useEffect,useState} from 'react';
import styles from "./Cart.module.css";
import api from "../api";

const Cart = () => {
    const [cart,setCart] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        api
           .get("/app/get-cart")
           .then(({data}) => {
              setCart(Array.isArray(data.cart) ? data.cart : []);
              console.log(data);
              setTotalPrice(data.totalCartPrice)
           })
           .catch((err) => {
             console.log(err);
           })
           .finally(() => {
              setLoading(false);
           })
    },[]);

    const handleBuy = () => {
        console.log("Buying cart:", cart);
    };

    if (loading) {
        return <div className={styles.status}>Loading cart...</div>;
    }
    
    if (cart.length === 0) {
        return <div className={styles.status}>Your cart is empty.</div>;
    }


  return (
    <main className={styles.cartPage}>
        <div className={styles.cartContainer}>
            <header className={styles.header}>
                <div>
                    <p className={styles.label}>Shopping Cart</p>
                    <h1>Your Cart</h1>
                </div>

                <span>
                    {cart.length} {cart.length === 1 ? "product" : "products"}
                </span>
            </header>

            <div className={styles.layout}>
                  <section className={styles.productList}>
                       {cart.map((item) => {
                           const product = item.productId;
                           const quantity = item.quantity || 1;
                           const productTotal = Number(product?.price || 0) * quantity;

                           return (
                            <article className={styles.productCart} key={item._id}>
                                <div className={styles.imageWrapper}>
                                    <img src={product?.imageUrl} alt={product?.name || "Product"} />
                                </div>

                                <div className={styles.productInfo}>
                                    <span className={styles.category}>{product?.category}</span>

                                    <h2>{product?.name}</h2>

                                    <p className={styles.description}>{product?.description}</p>

                                    <div className={styles.productFooter}>
                                        <span>Quantity: {quantity}</span>
                                        <strong>${productTotal.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </article>
                           );
                       })}
                  </section>

                  <aside className={styles.summary}>
                      <h2>Order Summary</h2>

                      <div className={styles.summaryRow}>
                        <span>Total products</span>
                        <strong>{cart.length}</strong>
                      </div>

                      <div className={styles.summaryRow}>
                        <span>Delivery</span>
                        <strong>Free</strong>
                      </div>

                      <div className={styles.total}>
                          <span>Total</span>
                          <strong>${totalPrice.toFixed(2)}</strong>
                      </div>

                      <button type="button" className={styles.buyButton} onClick={handleBuy}>
                        Buy Now
                      </button>

                  </aside>


            </div>
        </div>
    </main>
  )
}

export default Cart