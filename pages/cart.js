import Head from 'next/head'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Header from "../components/header"
import styles from '../styles/Home.module.css'

export default function Home() {
  const [products, setProducts] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const cartItems = useSelector((state) => state.cart);

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
  }, [cartItems])

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
