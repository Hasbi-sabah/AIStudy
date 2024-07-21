export default function Loading({loading}: {loading: boolean}) {
    return (
        loading && <h1>LOADING...</h1>
    )
}