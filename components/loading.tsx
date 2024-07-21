export default function Loading({loading}: {loading: boolean}) {
    return (
        <span className={`loading loading-dots loading-lg self-center ${!loading ? "opacity-0" : "opacity-100"}`}></span>
    )
}