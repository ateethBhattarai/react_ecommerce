import { useEffect, useState } from "react";
import { useFilter } from "./context/FilterContext";

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}

const Sidebar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    minPrice,
    setMinPrice,
    keyword,
    setKeyword,
  } = useFilter();

  const [categories, setCategories] = useState<string[]>([]);
  const [keywords] = useState<string[]>(["apple", "watch", "fashion"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const data: FetchResponse = await res.json();
        const uniqueCategory = Array.from(
          new Set(data.products.map((product) => product.category))
        );
        setCategories(uniqueCategory);
      } catch (error) {
        console.log("Error occured fetching categories data." + error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterReset = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setKeyword("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  return (
    <div className="w-64 p-5 h-screen">
      <h1 className="text-2xl font-bold mb-10 mt-4">Ecommerce</h1>

      <section>
        <input
          type="text"
          name="searchProduct"
          id="searchProduct"
          className="border-2 rounded px-2 sm:mb-0"
          placeholder="Search Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex justify-center item-center">
          <input
            type="text"
            name="min"
            id="min"
            className="border-2 mr-2 px-5 py-3 mb-3 w-full"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
          <input
            type="text"
            name="max"
            id="max"
            className="border-2 mr-2 px-5 py-3 mb-3 w-full"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>

        <div className="mb-5">
          <h2 className="text-xl  font-semibold mb-3 ">Categories</h2>
        </div>

        <section>
          {categories.map((category, index) => (
            <label key={index} className="block mb-2">
              <input
                type="radio"
                name="category"
                value={category}
                className="mr-2 w-[16px] h-[16px]"
                onChange={() => setSelectedCategory(category)}
                checked={selectedCategory === category}
              />
              {category.toUpperCase()}
            </label>
          ))}
        </section>

        <div className="mb-5 mt-4">
          <h2 className="text-xl font-semibold mb-3">Keywords</h2>
          <div>
            {keywords.map((keyword, index) => (
              <button
                key={index}
                className="block mb-2 px-4 py-2 w-full text-left border rounded hover:bg-gray-200"
                onClick={() => setKeyword(keyword)}
              >
                {keyword.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full mb-[4rem] py-2 bg-black text-white rounded mt-5"
          onClick={handleFilterReset}
        >
          Reset Filters
        </button>
      </section>
    </div>
  );
};

export default Sidebar;
