const SearchBar = () => {
  return (
    <div className="relative mt-4 bg-secondary-color/60 m-auto rounded w-[calc(100%-1rem)] h-8">
      <input
        className="w-full bg-secondary-color/0 h-full p-2 outline-none"
        type="text"
        placeholder="Search field..."
      />
    </div>
  )
}

export default SearchBar
