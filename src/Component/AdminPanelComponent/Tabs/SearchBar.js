function SearchBar({ setState, state, useEffect }) {
    useEffect(() => {
        if (state.search !== "") {
            const debounceResult = setTimeout(() => {
                setState({ contentSearch: state.search })
            }, 750);
            return () => clearTimeout(debounceResult)
        } else {
            setTimeout(() => {
                setState({ contentSearch: null })
            }, 750);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.search])
    return (
        <form className="findSomething">
            <input onChange={(e) => setState({ search: e.target.value })} type="text" placeholder="Tìm kiếm..." required />
        </form>
    )
}
export default SearchBar