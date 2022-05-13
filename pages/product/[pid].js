import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import Image from 'next/image'
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/solid";

const Product = () => {
  const router = useRouter()
  const { pid } = router.query
  
  const [product, setProduct] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (pid) {
      setLoading(true)
      fetch(`/api/product/${pid}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data)
          setLoading(false)
        })
    }
  }, [pid])

  if (isLoading) return <p>Loading...</p>
  if (!product) return <p>No profile data</p>

  return (
    <div key={product.id} className="group relative w-2/4 mx-auto my-4">
      
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:h-80 lg:aspect-none">
        <Image
          src={product.image}
          alt={product.title}
          width={325}
          height={325}
          className="w-full h-full object-center object-cover lg:w-full lg:h-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
              <h3 className="font-bold">{product.title}</h3>
              <br />
              {product.description}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">AED {product.price}</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Add to Cart
      </button>
    </div>
  )
}

export default Product