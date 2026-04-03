import { Outlet, Link } from "react-router-dom";


import "./AdminPage.scss";
const AdminPage = () => {
    return (
        <div className="admin-page">
            <div className="container">
                <div className="row">
                    <div className="col-2 admin-page__menu">
                        <button>
                            <Link to="managerUser">Manager User</Link>
                        </button>
                        <button>
                            <Link to="managerTest">Manager Test</Link>
                        </button>
                    </div>
                    <div className="col-10 admin-page__content">
                        <Outlet />
                    </div>
                </div>

            </div>
        </div >
    );
};

export default AdminPage;
