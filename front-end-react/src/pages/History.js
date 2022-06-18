import React,{useState,useEffect} from "react";
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
import axios from "axios";
import {useParams} from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function History(props) {
  const [email, setEmail] = useState('');
  const [dataValue, setDataValue] = useState([]);
  useEffect(() => {
    

      axios({
        method: 'get',
        url: 'http://localhost:4000/v1/userinfo',
        withCredentials: true,
    }).then(function (response) {
      setEmail(response.data.message.email);
      console.log(response.data.message.email);
      console.log(email);
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error);
      }
  
    })

    setTimeout(() => axios({
      method: 'post',
      url: 'http://localhost:4000/v1/history',
      withCredentials: true,
   data: {
     email: email,
   }
  }).then(function (response) {
   console.log(response.data.data);
   setDataValue(response.data.data);
   console.log(dataValue);

  })
  .catch(function (error) {
    console.log(error);
  }), 1000);
     
     
 }, [email]);

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
    const params = useParams();
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
      const search = () => {
        
        navigate('/v1/search/result=' + result + '&filter=' + ignore);
        window.location.reload(false);        
        
      }
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

    <MenuItem onClick={handleClose2} component={Link} to="/v1/Profile"><span>个人信息</span></MenuItem>
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
              <a component={Link} href={"/"} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            {showUser}
            {showLogin}
            {showSignup}

          </Toolbar>
        </AppBar>
        <div style={{marginTop:"100px"}}></div>
  
        <div className="center">
        <div></div>
        {showIgnore}
        <div></div>
        
      <h1>历史搜索记录:</h1>
        <hr style={{width:"50%"}}></hr>
     </div>
        
        <div>

        <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ width: 400, margin: 'auto' }}>
                    <TableHead>
                        <TableRow>
                      
                            <TableCell align="center">搜索关键字</TableCell>
                            <TableCell align="center">过滤词汇</TableCell>
                            <TableCell align="center">搜索时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataValue.slice(0).reverse().map((row) => (

                            <TableRow
                                key={row.date}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                
                           
                                <TableCell align="center">{row.result}</TableCell>
                                <TableCell align="center">{row.filter}</TableCell>
                                <TableCell align="center">{row.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
     </>
    )
}

export default History;