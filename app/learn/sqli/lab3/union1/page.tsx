"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const products = [
  {
    id: 1,
    name: "Paddling Pool Shoes",
    price: "$9.89",
  },
  {
    id: 2,
    name: "First Impression Costumes",
    price: "$49.64",
  },
  {
    id: 3,
    name: "Dancing In The Dark",
    price: "$50.45",
  },
  {
    id: 4,
    name: "The Alternative Christmas Tree",
    price: "$83.81",
  },
];

export default function UnionLab() {

  const searchParams = useSearchParams();

  const category =
    searchParams.get("category") ||
    "Clothing, shoes and accessories";

  // Normalize payload
  const normalizedCategory = decodeURIComponent(category)
    .replace(/\+/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();

  // Correct payload = 3 columns
  const solved =
    normalizedCategory ===
    "'unionselectnull,null,null--";

  // Detect UNION attempts
  const attemptedUnion =
    normalizedCategory.includes("unionselect");

  // Wrong UNION payload = Internal Server Error
  if (attemptedUnion && !solved) {

    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center text-black">

        <div className="bg-white border border-gray-300 p-12 max-w-xl w-full text-center">

          <h1 className="text-4xl font-bold mb-6">
            Internal Server Error
          </h1>

          <p className="text-gray-600 text-lg">
            The UNION query returned an incorrect number of columns.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-black">

      {/* Header */}
      <div className="bg-white border-b border-orange-500">

        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-5">

          {/* Left */}
          <div>

            <h2 className="text-[28px] leading-9 max-w-[900px] font-light">
              SQL injection UNION attack, determining the number of columns returned by the query
            </h2>

            <div className="flex items-center gap-4 mt-5">

              <button className="bg-orange-500 text-white font-bold px-5 py-2 text-sm">
                Back to lab home
              </button>

              <span className="text-gray-400 text-sm">
                Back to lab description »
              </span>

            </div>

          </div>

          {/* Status */}
          <div className="border border-green-400 rounded-full flex overflow-hidden h-fit">

            <div className="bg-green-400 px-4 py-2 text-sm font-bold uppercase">
              Lab
            </div>

            <div className="px-5 py-2 text-sm">
              {solved ? "Solved" : "Not solved"}
            </div>

          </div>

        </div>

      </div>

      {/* Main */}
      <div className="max-w-[1200px] mx-auto px-8 py-10">

        {/* Top Nav */}
        <div className="flex justify-end gap-4 text-[#2f5da8] text-sm mb-16">

          <Link href="#">
            Home
          </Link>

          <span>|</span>

          <Link href="#">
            My account
          </Link>

        </div>

        {/* Shop Logo */}
        <div className="flex justify-center">

          <div className="text-center">

            <div className="text-gray-400 tracking-[10px] text-2xl mb-2">
              WE LIKE TO
            </div>

            <div className="flex items-center justify-center gap-6">

              <h1 className="text-[90px] font-bold text-[#2f5d85] leading-none">
                SHOP
              </h1>

              <div className="text-[120px] text-[#2f5d85]">
                ⌐
              </div>

            </div>

          </div>

        </div>

        {/* Category */}
        <h1 className="text-center text-[64px] font-light mt-10 mb-14">
          {category}
        </h1>

        {/* Filters */}
        <div className="bg-[#e7ebee] p-5 max-w-[950px] mx-auto">

          <h3 className="font-bold text-gray-500 mb-4 text-xl">
            Refine your search:
          </h3>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Clothing, shoes and accessories",
              "Corporate gifts",
              "Lifestyle",
              "Pets",
              "Toys & Games",
            ].map((item) => (

              <Link
                key={item}
                href={`?category=${encodeURIComponent(item)}`}
                className="border border-gray-300 bg-white px-3 py-2 text-[#2f5da8] hover:bg-gray-100"
              >
                {item}
              </Link>

            ))}

          </div>

        </div>

        {/* Products */}
        <div className="max-w-[950px] mx-auto mt-10">

          {products.map((product) => (

            <div
              key={product.id}
              className="grid grid-cols-[1fr_150px_150px] border-b border-gray-200 py-2 items-center"
            >

              <div className="text-[20px] font-semibold">
                {product.name}
              </div>

              <div className="text-[20px] text-center">
                {product.price}
              </div>

              <div className="flex justify-end">

                <button className="bg-[#2f5d85] hover:bg-[#274f72] text-white px-6 py-2 font-bold">
                  View details
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}