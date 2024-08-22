import { useEffect, useState } from "react";
import { useFilter } from "./context/FilterContext";
import { Tally3 } from "lucide-react";
import axios from "axios";

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } =
    useFilter();

  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const itemsPerPage = 10;

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${
      (currentPage - 1) * itemsPerPage
    }`;

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios
      .get(url)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => console.error("Error while fetching data: " + err));
  }, [currentPage, keyword]);

  const fetchFilteredProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice
      );
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPrice
      );
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "cheap":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "popular":
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  console.log(fetchFilteredProducts());

  return (
    <section className="xl:w-[55rem] lg:w-[55rem] sm:w-[40rem] xs:w-[20rem] p-5">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="relative mb-5 mt-5">
          <button
            className="border px-4 py-2 rounded-full flex items-center"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <Tally3 className="mr-2" />

            {filter === "all" ? "Filter" : filter.charAt(0).toLowerCase()}
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                onClick={() => setFilter("cheap")}
              >
                Cheap
              </button>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                onClick={() => setFilter("expensive")}
              >
                Expensive
              </button>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                onClick={() => setFilter("popular")}
              >
                Popular
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5">
          <p>My data</p>
        </div>
      </div>
    </section>
  );
};

export default MainContent;
