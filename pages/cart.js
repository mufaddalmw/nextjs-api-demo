import Head from 'next/head'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Header from "../components/header"
import { decrement, increment } from "../features/cart/cartSlice"
import styles from '../styles/Home.module.css'

export default function Home() {
  const [products, setProducts] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [productQty, setproductQty] = useState([]);
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartItems.length) {
      setLoading(true)
      const cartArray = [];
      cartItems.map((item) => {
        const { productId, count } = item;
        cartArray.push(`${productId}_${count}`);
      });
      const cartStr = cartArray.join('/');
      
      fetch(`api/cart/${cartStr}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data)
          setLoading(false)
          console.log(data);
        })
    }
  }, [])

  /* update product quantity state */
  useEffect(() => {
    if (products?.length) {
      products.map(({id, quantity}) => {
        const id_quantity = {id, quantity};
        setproductQty(prevState => [...prevState, id_quantity]);
      });
    }
  }, [products])

  /* increamentQty */
  const increamentQty = (id) => {
    // setproductQty();
    dispatch(decrement(id));
  }
  

  if (isLoading) return <p>Loading...</p>
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Shopping Cart</title>
        <meta name="description" content="Shopping Cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-1 xl:gap-x-8 w-2/4 mx-auto my-4">
          {
            products && products.map(product => (
              <div key={product.id} className="flex">
                <div>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={150}
                    height={150}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="ml-4 ">
                  <div className="font-bold text-gray-700">{product.title}</div>
                  <div className="text-gray-700 text-sm">AED {product.price}</div>
                  <div className="text-gray-700 text-sm flex items-center">
                    Qty: 
                    <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => dispatch(decrement(product.id))}>-</button> 
                    <span className="mx-1 inline-block">{product.quantity}</span>
                    <span className="mx-1 inline-block">{productQty.find( ({ id }) => id === product.id )?.quantity}</span>
                    <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => dispatch(increamentQty(product.id))}>+</button>
                  </div>
                  
                </div>
              </div>
            ))
          }
          {
            !products && <p>No Cart item</p>
          }
        </div>
      </main>

    </div>
  )
}
