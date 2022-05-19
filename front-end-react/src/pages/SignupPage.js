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

function SignupPage() {
  
    const [inputNickNameError, setInputNickNameError] = useState(false);
    const [inputEmailError, setInputEmailError] = useState(false);
    const [inputPasswordError, setInputPasswordError] = useState(false);
    const [inputConfirmPasswordError, setInputConfirmPasswordError] = useState(false);
    const [inputAgreeError, setInputAgreeError] = useState(false);
    const validate = Yup.object({
        nickName: Yup.string()
        .required('必填'),

        email: Yup.string()
        .email("email地址格式错误")
        .required('必填'),

        password: Yup.string()
        .min(6, '密码至少要6位')
        .required('必填'),

        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], '密码必须一致')
        .required('必填'),

        agree: Yup.boolean().oneOf([true],'注册前请勾选同意条款').required('必选'),
    });

    let navigate = useNavigate();
    
    
    // navigate('/v1/search/result=' + result + '&filter=' + ignore);
    return (
        <>
        
        <AppBar style={{ background: '#1F618D' }} elevation={0}>
          <Toolbar >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a component={Link} href={"/"} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            <Button component={Link} color="inherit"
      to="/v1/login"><span style={{fontWeight:"800"}}>登录</span></Button>
          </Toolbar>
        </AppBar>
        <div style={{marginTop:"100px"}}></div>

        <div className="center">
        <div>
            <h1>注册</h1>
        </div>
        <div className="space40"></div>
        <Formik
      initialValues={{
        nickName: "",
        email:"",
        password:"",
        confirmPassword:"",
        agree: false,
      }}
      validationSchema={validate}

      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/signup',
          data: values,
      }).then(function (response) {
        console.log(JSON.stringify(response.data));
        alert(`注册成功！请登录！`)
        navigate('/v1/login');
      })
      .catch(function (error) {
        if (error.response) {
          alert(`email地址已经被注册！`)
        }
        
        console.log(error);
      })
      }}
    >
      {({ values,handleChange, touched, errors }) => (
        <Form>
            <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
            <TextField 
                className="signupBar" 
                id="nickName" 
                name="nickName" 
                type="text" 
                value={values.nickName} 
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon/>
                      </InputAdornment>
                    ),
                    style: { fontFamily:"Quicksand", fontWeight:"700"}
                  }}
                onChange={(e) => { handleChange(e); setInputNickNameError(false); }}
                error={inputNickNameError} 
                label="昵称" 
                variant="outlined" 
               />

                
        <div></div>
            {errors.nickName && touched.nickName ? (setInputNickNameError(true),
                <span className="errorMessage">{errors.nickName}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}
            
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
        
        <div></div>
            {errors.password && touched.password ? (setInputPasswordError(true), 
                <span className="errorMessage">{errors.password}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}

        <div className="space20"></div>
                
            <TextField 
                className="signupBar" 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={values.confirmPassword} 
                onChange={(e) => { setInputConfirmPasswordError(false); handleChange(e);  }}
                error={inputConfirmPasswordError}
                label="确认密码" 
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
            {errors.confirmPassword && touched.confirmPassword ? (setInputConfirmPasswordError(true), 
                <span className="errorMessage">{errors.confirmPassword}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}

        <div className="space20"></div>
                
            <Field 
                type="checkbox" 
                name="agree"
                onChange={(e) => { setInputAgreeError(false); handleChange(e);  }}/>
                
                <span 
                style={{fontSize:"15px"}}>&nbsp;&nbsp;我同意接受此网站的条款、数据使用政策和 Cookie 政策</span>
                
        <div></div>
            {errors.agree && touched.agree ? (setInputAgreeError(true), 
                <span className="errorMessage">{errors.agree}</span>
                ) : <div style={{visibility:"hidden",fontSize:"18px"}}>Hello</div>}

        <div className="space20"></div>
        <a component={Link} href={"/v1/login"}><p style={{fontSize:"12px"}}>已有账户？请登录</p></a>
            <Button variant="contained" size="large" type="submit" >注册</Button>
    
        </Form>
      )}
    </Formik>


     </div>
        
     </>
    )
}

export default SignupPage;