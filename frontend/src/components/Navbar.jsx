import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="bg-background p-6 text-black ">
            <ul className="flex gap-2">
                <li className='p-2 border'>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className='p-2 border'> 
                    <Link to="/staff">Staffs</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
