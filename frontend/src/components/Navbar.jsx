import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="bg-white p-6 text-black ">
            <ul className="flex gap-2">
                <li className='p-2 border'>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className='p-2 border'> 
                    <Link to="/jobs">Jobs & Descriptions</Link>
                </li>
                <li className='p-2 border'> 
                    <Link to="/accounts">Accounts</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
