import React,{useState} from "react";
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { ErrorMessage, Formik, Field, Form, useFormik } from 'formik';
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import * as Yup from 'yup';
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

function LoginPage(props) {
    
    const [inputEmailError, setInputEmailError] = useState(false);
    const [inputPasswordError, setInputPasswordError] = useState(false);

    const validate = Yup.object({
   
        email: Yup.string()
        .email("email地址格式错误")
        .required('必填'),

        password: Yup.string()
        .required('必填'),

    });

    let navigate = useNavigate();
    
    return (
        <>
        
        <AppBar style={{ background: '#1F618D' }} elevation={0}>
          <Toolbar >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a component={Link} href={"/"} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            <Button component={Link} color="inherit"
      to="/v1/signup"><span style={{fontWeight:"800"}}>注册</span></Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:"100px"}}></div>

        <div className="center">
        <div>
            <h1>登录</h1>
        </div>
        <div className="space40"></div>
        <Formik
      initialValues={{
        email:"",
        password:"",
        
      }}
      validationSchema={validate}

      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/login',
          data: values,
          withCredentials: true,
      }).then(function (response) {
        console.log(JSON.stringify(response.data));
        alert(`登录成功！`);
        navigate('/');
        window.location.reload();
        
        
      })
      .catch(function (error) {
        if (error.response) {
          alert(`email 或 密码错误!`)
        }
        
        console.log(error);
      })
      }}
    >
      {({ values,handleChange, touched, errors }) => (
        <Form>
            <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
            
        <div className="space20"></div>

            <TextField 
                className="signupBar" 
                id="email" 
                name="email" 
                type="text" 
                value={values.email} 
                onChange={(e) => { handleChange(e); setInputEmailError(false); }}
                error={inputEmailError} 
                label="电子邮箱" 
                variant="outlined" 
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon/>
                      </InputAdornment>
                    ),
                    style: { fontFamily:"Quicksand", fontWeight:"700"}
                  }} />

        <div></div>
            {errors.email && touched.email ? (setInputEmailError(true), 
                <span className="errorMessage">{errors.email}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}
            
        <div className="space20"></div>

            <TextField 
                className="signupBar" 
                id="password" 
                name="password" 
                type="password" 
                value={values.password} 
                onChange={(e) => { handleChange(e); setInputPasswordError(false); }}
                onFocus={setInputPasswordError(false)}
                error={inputPasswordError} 
                label="密码" 
                variant="outlined" 
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon/>
                      </InputAdornment>
                    ),
                    style: { fontFamily:"Quicksand", fontWeight:"700"}
                  }} />
            
        
        <div></div>
            {errors.password && touched.password ? (setInputPasswordError(true), 
                <span className="errorMessage">{errors.password}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}

        <div className="space20"></div>
        <a component={Link} href={"/v1/signup"}><p style={{fontSize:"12px"}}>创建账户？请点我</p></a>
            <Button variant="contained" size="large" type="submit">登录</Button>

        </Form>
      )}
    </Formik>


     </div>
        
     </>
    )
}

export default LoginPage;