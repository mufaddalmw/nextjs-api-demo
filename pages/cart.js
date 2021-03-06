import Head from 'next/head'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Header from "../components/header"
import { decrement, increment, removeFromCart } from "../features/cart/cartSlice"
import styles from '../styles/Home.module.css'

export default function Home() {
  const [products, setProducts] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [productQty, setproductQty] = useState([]);
  const [removeItems, setremoveItems] = useState({});
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
        })
    }
  }, []);

  /* update product quantity state */
  useEffect(() => {
    if (products?.length) {
      const id_quantity = [];
      const removeObj = {};
      products.map(({id, quantity}) => {
        id_quantity.push({id, quantity});
        removeObj[id] = false;
      });
      setproductQty(id_quantity);
      setremoveItems(removeObj);
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

  /* TOTAL COST */
  const handleTotalCost = () => {
    let price = 0;
    products && products.forEach(element => {
      price += productQty.find( ({ id }) => id === element.id )?.quantity * element.price
    });
    return price.toFixed(2);
  }
  
  /* TOTAL SINGLE ITEM COST */
  const handleSingleItemCost = (pid, price) => {
    const cost = productQty.find( ({ id }) => id === pid )?.quantity * price;
    return cost.toFixed(2);
  }

  /* HANDLE REMOVE ITEMS */
  const handleRemoveItems = (id) => {
    setremoveItems(prevState => ({
      ...prevState,
      [id]: true
    }));
    dispatch(removeFromCart(id));
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
              <div key={product.id} className={`flex w-full ${removeItems[product.id] ? 'hidden' : ''}`}>
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
                    <div className="text-gray-700 text-sm flex items-center mt-2">
                      Qty: 
                      <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => updateQty(product.id, 'minus')}>-</button> 
                      <span className="mx-1 inline-block">{productQty.find( ({ id }) => id === product.id )?.quantity}</span>
                      <button className="w-5 h-5 bg-gray-200 text-gray-400 text-2xl inline-flex items-center justify-center mx-1 active:bg-gray-600" onClick={() => updateQty(product.id, 'plus')}>+</button>
                    </div>                  
                    <div className="mt-2">
                    <button className="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white text-xs py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={() => handleRemoveItems(product.id)}>
                      Remove
                    </button>
                    </div>
                  </div>                  
                  <div className="text-gray-700 font-bold">AED {handleSingleItemCost(product.id, product.price)}</div>
                </div>
              </div>
            ))
          }
          <div className="border-solid border-gray-200 border-t font-bold text-right pt-1">AED {handleTotalCost()}</div>
          {
            !products && <p>No Cart item</p>
          }
        </div>
      </main>

    </div>
  )
}
