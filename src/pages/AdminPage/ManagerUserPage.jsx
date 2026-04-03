import { useState } from 'react';
import { authApi } from '../../api';

const ManagerUserPage = () => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [role, setRole] = useState("USER");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSelectFile = (e) => {
        const fileSelect = e.target.files[0];
        if (!fileSelect) return;

        const objectUrl = URL.createObjectURL(fileSelect);
        setFile(fileSelect);
        setPreview(objectUrl);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            alert("Email and password are required!");
            setIsLoading(false);
            return;
        }

        // Note: Backend currently expects JSON for registration
        // and doesn't handle images or roles in the basic register flow.
        try {
            await authApi.register({
                email,
                password
            });
            alert("User created successfully (Registration flow triggered)!");
        } catch (error) {
            console.error("Error creating user:", error);
            alert(error.response?.data?.message || "Failed to create user.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="manager-user-page">
            <h1 className="mb-4">User Management</h1>
            <form className="row g-3" onSubmit={handleCreateUser}>
                <div className="col-md-6">
                    <label htmlFor="inputEmail" className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword4"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="col-6">
                    <label htmlFor="inputUserName" className="form-label">Display Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputUserName"
                        placeholder="Full Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputRole" className="form-label">System Role</label>
                    <select
                        id="inputRole"
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div className="col-12">
                    <label className="form-label">Profile Picture (Preview only)</label>
                    <input type="file" onChange={onSelectFile} className="form-control" accept="image/*" />
                    {preview && (
                        <div className="mt-3">
                            <img src={preview} alt="Preview" style={{ width: "120px", height: "120px", objectFit: 'cover', borderRadius: '8px' }} />
                        </div>
                    )}
                </div>
                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManagerUserPage;
