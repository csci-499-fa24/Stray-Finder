import Link from 'next/link'

const Breadcrumb = () => (
    <nav aria-label="breadcrumb" className="align-self-start px-5">
        <ol className="breadcrumb">
            <li className="breadcrumb-item">
                <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
                <Link href="/">Library</Link>
            </li>
        </ol>
    </nav>
)

export default Breadcrumb
