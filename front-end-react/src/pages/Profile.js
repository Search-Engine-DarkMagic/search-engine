import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import {useNavigate } from 'react-router-dom';
function Profile(props) {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open2 = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose2 = () => {
        setAnchorEl(null);
      }


      
    let showUser;
    let showLogin;
    let showSignup;
    if (props.nickName !== ''){
        showUser = <>
        <Button
        id="basic-button"
        aria-controls={open2 ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open2 ? 'true' : undefined}
        onClick={handleClick}
      >
        <AccountCircleIcon style={{color:"white"}} ></AccountCircleIcon> &nbsp;
       <span style={{color:"white", fontFamily: "Quicksand",
      fontWeight: "800"}}>{props.nickName}</span> 
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open2}
        onClose={handleClose2}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose2}><span>个人信息</span></MenuItem>
        <MenuItem onClick={handleClose2} component={Link} to="/v1/history"><span>历史搜索记录</span></MenuItem>
        
      </Menu></>
        
        // <Button component={Link} color="inherit"
        // to="/v1/login"><span style={{fontWeight:"800"}}>{props.nickName}</span></Button>
    
    
      }else{
        showLogin = <Button component={Link} color="inherit"
        to="/v1/login"><span style={{fontWeight:"800"}}>登录</span></Button>
        showSignup = <Button component={Link} color="inherit"
        to="/v1/signup"><span style={{fontWeight:"800"}}>注册</span></Button>
      }

    return(
        <>
         <AppBar style={{ background: '#1F618D' }} elevation={0}>
          <Toolbar >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a component={Link} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            <Button component={Link} color="inherit"
    to="/"><span style={{fontWeight:"800"}}>返回搜索</span></Button>
    
            {showUser}
            {showLogin}
            {showSignup}

          </Toolbar>
        </AppBar>
        <div style={{marginTop:"100px"}}></div>
        <div className="center">
        <h1>个人信息</h1>
        
        <hr style={{width:"50%"}}></hr>
        <div style={{marginTop:"40px"}}></div>
        <h2>昵称: {props.nickName}</h2>
        <h2>email地址: {props.email}</h2>
        

    
        
        </div>
        </>
    
    )
}

export default Profile;