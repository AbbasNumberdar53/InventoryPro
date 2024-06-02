

const HomeSearchInput = ({setData}) => {
  async function onSearchQueryChange(e) {

    if(e.target.value === ""){
      try {
        const response = await fetch(`/api/Search/empty`);
        if (!response.ok) {
          throw new Error("Response not ok while fetching search query");
        }
        const responseData = await response.json();
        setData(responseData.products);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }else{
      try {
        const response = await fetch(`/api/Search/${e.target.value}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData.products);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }
  }
  return (
    <div className="relative w-[80%]  mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            onChange={onSearchQueryChange}
          />
        </div>
  )
}

export default HomeSearchInput