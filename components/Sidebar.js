import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link href="/">
                        Inicio
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;