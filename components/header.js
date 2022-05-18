import { ShoppingCartIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const router = useRouter();
  const [ishomepage, setishomepage] = useState(true);
  const [cartCount, setcartCount] = useState(null);
  const cartItems = useSelector((state) => state.cart);

  useEffect(() => {
    if (cartItems && cartItems.length) {
      let count = 0;
      cartItems.map((item) => {
        count = count + item.count
      })
      setcartCount(count);
    }
  }, [cartItems])

  useEffect(() => {
    setishomepage(router.asPath === '/');
  }, [router.asPath]);

  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8 w-2/4 mx-auto my-4">
      <div>
        {
          !ishomepage && (
            <Link href="/">
              <a className="mb-4 inline-block"><ArrowLeftIcon className="w-4 h-4 inline-block"/> Go Back</a>
            </Link>
          )
        }
        
      </div>
      <div className="flex justify-end relative">
        <Link href="/cart">
          <a>
            <ShoppingCartIcon className="w-6 h-6"/>
            {
              cartCount && <span className="rounded-full bg-red-600 w-4 h-4 text-white text-xs flex items-center justify-center absolute -right-2 -top-2">{cartCount}</span>
            }
          </a>
        </Link>
      </div>
    </div>
  )
}
