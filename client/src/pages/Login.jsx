import {useState,useContext} from 'react';
import AuthContext from '../context/AuthContext.jsx';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';

const Login=()=>{
    const [formData,setFormData]= useState({email:"", password:""});

    const {login} = useContext (AuthContext);
    const  navigate = useNavigate();

    const {email,password} = formData;
    const onChange = (e) =>
        setFormData({...formData,[e.target.name]: e.target.value});
    const onSubmit = async (e) =>{
        e.preventDefault();
        try{
            // send form data to backed
            const res = await axios.post('/api/auth/login',formData);
            // res.data.token comes from the backend controllers
            login(res.data.token, res.data.user);
            toast.success("Login Successful");
            navigate('/dashboard');
        }catch(err){
            console.error(err.response.data);
            toast.error(err.response?.data?.message || "Login Failed");
        }
    };
    return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;