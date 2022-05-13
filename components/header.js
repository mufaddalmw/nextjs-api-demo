import { ShoppingCartIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function Header() {
  
  return (
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8 w-2/4 mx-auto my-4">
      <div>
        <Link href="/">
          <a className="mb-4 inline-block"><ArrowLeftIcon className="w-4 h-4 inline-block"/> Go Back</a>
        </Link>
      </div>
      <div className="flex justify-end"><ShoppingCartIcon className="w-6 h-6"/></div>
    </div>
  )
}
