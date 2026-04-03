import { useState } from 'react';
import { authApi } from '../../api';

const ManagerUserPage = () => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [role, setRole] = useState("USER"); // Default role
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const onSelectFile = (e) => {
        const fileSelect = e.target.files[0];
        if (!fileSelect) return;

        const objectUrl = URL.createObjectURL(fileSelect);
        setFile(fileSelect);
        setPreview(objectUrl);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!file || !email || !password || !userName) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("userImage", file);
        formData.append("role", role);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("userName", userName);


        try {
            const res = await authApi.register(formData);
            console.log("User created:", res);
        } catch (error) {
            console.error("Lỗi khi tạo user:", error);
        }
    };

    return (
        <div>
            <h1>Manager User Page</h1>
            <form className="row g-3" onSubmit={handleCreateUser}>
                <div className="col-md-6">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="col-6">
                    <label htmlFor="inputUserName" className="form-label">User Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputUserName"
                        placeholder="UserName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputRole" className="form-label">Role</label>
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
                    <label className="form-label">Upload Image</label>
                    <input type="file" onChange={onSelectFile} className="form-control" accept="image/*" />
                    {preview && <img style={{ width: "200px", height: "100px", marginTop: "10px" }} src={preview} alt="Preview" />}
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </div>
            </form>
        </div>
    );
};

export default ManagerUserPage;
