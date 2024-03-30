interface SearchBarProps {
  setSearch: Function
  search: string
}

const SearchBar = ({ setSearch, search }: SearchBarProps) => {
  return (
    <div className="relative mt-4 bg-secondary-color/60 m-auto rounded w-[calc(100%-1rem)] h-8">
      <input
        className="w-full bg-secondary-color/0 h-full p-2 outline-none"
        type="text"
        value={search}
        placeholder="Search field..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
