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
  }, []);

  /* update product quantity state */
  useEffect(() => {
    if (products?.length) {
      const id_quantity = [];
      products.map(({id, quantity}) => {
        id_quantity.push({id, quantity});
      });
      setproductQty(id_quantity);
    }
  }, [products]);

  /* updateQty */
  const updateQty = (productId, type) => {
    const productArr = productQty;
    const itemIndex = productArr.findIndex( ({ id }) => id === productId );
    const item = productArr[itemIndex]
    if (item.quantity > 1 || type === 'plus') {
      item.quantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
      productArr[itemIndex] = item
      setproductQty(productArr);
      dispatch(type === 'plus' ? increment(productId) : decrement(productId));
    }
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
              <div key={product.id} className="flex w-full">
                <div>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={150}
                    height={150}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="flex grow justify-between">
                  <div className="ml-4">
                    <div className="font-bold text-gray-700">{product.title}</div>
                    <div className="text-gray-700 text-sm">AED {product.price}</div>
                    <div className="text-gray-700 text-sm flex items-center">
                      Qty: 
                      <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => updateQty(product.id, 'minus')}>-</button> 
                      <span className="mx-1 inline-block">{productQty.find( ({ id }) => id === product.id )?.quantity}</span>
                      <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => updateQty(product.id, 'plus')}>+</button>
                    </div>                  
                  </div>
                  <div className="text-gray-700 font-bold">AED {productQty.find( ({ id }) => id === product.id )?.quantity * product.price}</div>
                </div>
              </div>
            ))
          }
          <div className="border-solid border-gray-200 border-t font-bold text-right pt-1">AED 2120</div>
          {
            !products && <p>No Cart item</p>
          }
        </div>
      </main>

    </div>
  )
}
