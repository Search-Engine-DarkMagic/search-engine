import React,{useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";
function SearchEngineMain(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  }
  const logout = () => {
    setAnchorEl(null);

    axios({
      method: 'post',
      url: 'http://localhost:4000/v1/logout',
      withCredentials: true,
  }).then(function (response) {
    console.log(JSON.stringify(response.data));
    window.location.reload(false);
    navigate('/');
    
  })
  .catch(function (error) {
    if (error.response) {
      console.log(error);
    }
    
  })

  
  };

  let navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [ignore, setIgnore] = useState('');
  const [result, setResult] = useState('');
  const search = () => {
    navigate('/v1/search/result=' + result + '&filter=' + ignore);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log(ignore);
  };

  const handleCloseNull = () => {
    setOpen(false);
    setIgnore('');
  };

  let showIgnore;
  if (ignore !== ''){
    showIgnore = <span>当前过滤关键字：{ignore}</span>
  }else{
    showIgnore = <span style={{visibility:"hidden"}}>当前过滤关键字：</span>
  }

  let showUser;
  let showLogin;
  let showSignup;
  if (props.nickName !== ''){
    showUser = <><Button
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
    <MenuItem onClick={handleClose2}><span>历史搜索记录</span></MenuItem>
    <MenuItem onClick={logout}><span>退出登录</span></MenuItem>
  </Menu></>
    
    // <Button component={Link} color="inherit"
    // to="/v1/login"><span style={{fontWeight:"800"}}>{props.nickName}</span></Button>


  }else{
    showLogin = <Button component={Link} color="inherit"
    to="/v1/login"><span style={{fontWeight:"800"}}>登录</span></Button>
    showSignup = <Button component={Link} color="inherit"
    to="/v1/signup"><span style={{fontWeight:"800"}}>注册</span></Button>
  }
    return (
        <>
        <AppBar style={{ background: '#1F618D' }} elevation={0}>
          <Toolbar >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a component={Link} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            {showUser}
            {showLogin}
            {showSignup}

      
      
          </Toolbar>
        </AppBar>
        <div style={{marginTop:"100px"}}></div>
        <div className="space40"></div>
        
        <div className="center">
        <img src={require('../images/search-icon.png')} className="searchImage"/>
    
        
        <div className="space20"></div>

        <div></div>
        {showIgnore}
        <div></div>
        <Button style={{minWidth: '50px', minHeight: '55px'}} onClick={handleClickOpen}>高级搜索</Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>高级搜索设置:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            过滤关键词
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="keyword"
            type="keyword"
            fullWidth
            variant="standard"
            name="ignore"
            value={ignore}
            onChange={e => setIgnore(e.target.value)}
            InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }}
          />
          <div className="space40"><span style={{fontSize:"15px"}}>*过滤关键词：输入的关键词将不会出现在搜索结果中</span></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>确定</Button>
          <Button onClick={handleCloseNull}>取消</Button>
          
        </DialogActions>
      </Dialog>
        <div></div>
        <form>
     <TextField className="searchBar" onChange={e => setResult(e.target.value)} id="outlined-basic" label="搜索" variant="outlined" InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }} />
     &nbsp;&nbsp;&nbsp;
     <div className="space20"></div>
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={search}><SearchIcon fontSize="large" className="searchButton"/></Button>

     </form>
        <div className="space40"></div>
        
        
     </div>
     
     </>
    );
  }

export default SearchEngineMain;