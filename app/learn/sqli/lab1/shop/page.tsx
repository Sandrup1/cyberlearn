"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { markModuleLabSolved } from "../../../progress-state";

const allProducts = [
  { id: 1, name: "Professional Football", price: "$29.99", category: "Football", released: 1, img: "" },
  { id: 2, name: "Training Cones", price: "$15.00", category: "Football", released: 1, img: "" },
  { id: 3, name: "Hidden Prototype Boot", price: "$199.99", category: "Football", released: 0, img: "" },
  { id: 4, name: "Referee Whistle", price: "$5.50", category: "Football", released: 1, img: "" },
  { id: 5, name: "Goalkeeper Gloves", price: "$45.00", category: "Football", released: 0, img: "" },
  { id: 6, name: "Standard Shinguards", price: "$12.00", category: "Other", released: 1, img: "" },
  { id: 7, name: "Lifestyle Hoodie", price: "$55.00", category: "Lifestyle", released: 1, img: "" },
  { id: 8, name: "Pet Jersey", price: "$25.00", category: "Pets", released: 1, img: "" },
];

export default function ShopLab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "";

  // Logic to determine if lab is solved
  const isSolved = categoryParam.toLowerCase().includes("' or 1=1") || categoryParam.includes("1=1");

  useEffect(() => {
    if (isSolved) {
      markModuleLabSolved("sqli", "lab1");
    }
  }, [isSolved]);

  const getFilteredProducts = () => {
    if (!categoryParam) return allProducts.filter(p => p.released === 1);
    
    if (isSolved) return allProducts; // Show everything if injected

    return allProducts.filter(p => 
      p.category.toLowerCase() === categoryParam.toLowerCase() && p.released === 1
    );
  };

  const filteredProducts = getFilteredProducts();

  // Helper to change category via URL
  const setCategory = (cat: string) => {
    if (cat === "All") {
      router.push("/learn/sqli/lab1/shop");
    } else {
      router.push(`/learn/sqli/lab1/shop?category=${cat}`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Updated Header with CyberLearn Branding */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black flex items-center gap-1 text-sm font-medium transition-colors"
          >
            ← Back
          </button>
          <span className="font-bold text-xl tracking-tighter">
            CyberLearn
          </span>
          <Link href="/learn/sqli/lab1" className="text-blue-600 hover:underline text-xs">
            Back to lab description
          </Link>
        </div>
        
        <div className={`px-4 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
          isSolved ? 'bg-green-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
        }`}>
          LAB: {isSolved ? "SOLVED" : "NOT SOLVED"}
        </div>
      </div>

      {/* Success Banner */}
      {isSolved && (
        <div className="bg-orange-500 text-white text-center py-3 font-bold text-lg shadow-inner animate-in slide-in-from-top duration-700">
          Congratulations, you solved the lab!
        </div>
      )}

      <main className="max-w-6xl mx-auto p-12">
        {/* Gray Logo Style */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-400 tracking-[0.2em] uppercase mb-1">WE LIKE TO</h1>
          <h2 className="text-8xl font-black text-gray-700 tracking-tighter">SHOP</h2>
        </div>

        {/* Clickable Refine Search Bar */}
        <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg mb-10 flex gap-6 items-center shadow-sm">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Refine search:</span>
          <div className="flex gap-6 text-sm">
            {["All", "Football", "Lifestyle", "Pets"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`transition-all hover:text-blue-600 ${
                  (categoryParam === cat || (cat === "All" && !categoryParam)) 
                    ? "font-bold text-black border-b-2 border-black" 
                    : "text-gray-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col group hover:border-gray-400 transition-all bg-white shadow-sm">
              <div className="h-44 bg-gray-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                {product.img}
              </div>
              <div className="p-5 border-t border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm text-gray-800">{product.name}</h3>
                  {product.released === 0 && (
                    <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black tracking-tighter">HIDDEN</span>
                  )}
                </div>
                <div className="flex text-yellow-400 text-[10px] mb-3">★★★★★</div>
                <p className="font-black text-xl text-gray-900">{product.price}</p>
              </div>
              <button className="w-full bg-gray-800 text-white py-3 text-xs font-bold mt-auto hover:bg-black transition-colors">
                View details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
