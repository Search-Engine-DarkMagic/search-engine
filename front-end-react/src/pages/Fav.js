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
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ErrorMessage, Formik, Field, Form, useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
function Fav(props) {

    const [favList, setFavList] = useState([]);
    const [option, setOption] = useState("");
    const [edit, setEdit] = useState(false);
    const [editColor, setEditColor] = useState("#1ABC9C");
    const [editKey, setEditKey] = useState("编辑");
    const [editFolderTrash, setEditFolderTrash] = useState("hidden");
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        boxShadow:'none'
      }));
    

      const Item2 = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign:"left",
        boxShadow:'none'
      }));


  const [email, setEmail] = useState('');
  const [dataValue, setDataValue] = useState([]);
  const [results, setResults] = useState([]);
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
      url: 'http://localhost:4000/v1/favFolderRetrieve',
      withCredentials: true,
   data: {
     email: email,
   }
  }).then(function (response) {
  
   console.log(response.data.message);
   setDataValue(response.data.message);
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


  let test;
  let showFolder;
  let showContent;
  let showUser;
  let showLogin;
  let showSignup;

  function handleEdit(){
    if (edit == false) {
      console.log("编辑状态开启");
      
      setEditKey("取消编辑");
      setEdit(true);
      setEditColor("#E74C3C");
      setEditFolderTrash("visible");
    }else{    
      console.log("编辑状态关闭");
      setEditKey("编辑");
      setEdit(false);
      setEditColor("#1ABC9C");
      setEditFolderTrash("hidden");
    }

  }
  

  //Eliminate duplicate folder name by using 'Set'
  const mySet1 = new Set()

  //Add all folder names into Set
  for (let i = 0; i < Object.keys(dataValue).length; i++) {
    mySet1.add(dataValue[i].folder);
  }

  //Convert Set to array
  const arr = Array.from(mySet1);

  //Print all folders
  test = arr.map((row) => (
    <>
    
    <Item2><Button><DeleteForeverIcon style={{color:"red", visibility:editFolderTrash}}/></Button>&nbsp;&nbsp;<Button><EditIcon style={{color:"#BB8FCE", visibility:editFolderTrash}}/></Button>&nbsp;&nbsp;<Button onClick={() => setOption(row)} disableRipple style={{background:"transparent", padding:"0px", margin:"0px"}}><h3>{row}<span> {">"} </span></h3></Button></Item2>
    </>
  ))


  if (Object.keys(dataValue).length === 0){
    showFolder = <h3>空</h3>
  }else{
    showFolder = dataValue.map((row) => (
      <>
<Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <Item><Button onClick={() => setOption(row.folder)} disableRipple style={{background:"transparent", padding:"0px", margin:"0px"}}><h3>{row.folder}<span> {">"} </span></h3></Button></Item>
        </Grid>
      </Grid>
    </Box>
      </>
    ))
  }

  
 showContent = dataValue.filter(val => val.folder == option).map((row) => (
   <>
  <Item><Button><DeleteForeverIcon style={{color:"red", visibility:editFolderTrash}}/></Button><span>{row.result}</span></Item>
  </>
 ))


  if (props.nickName !== ''){
    showUser = <>
        <Button component={Link} color="inherit"
    to="/"><span style={{fontWeight:"800"}}>返回搜索</span></Button>
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
        
        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item><h1>{props.nickName}的收藏夹:</h1></Item>
        </Grid>

        <Grid item xs={6}>
          <Item><h1><Button onClick={() => {handleEdit();}}><span style={{fontSize:"30px",color:editColor}}><EditIcon></EditIcon>&nbsp;{editKey}</span></Button></h1></Item>
        </Grid>
      
      </Grid>
    </Box>
        
     </div>
        <div className="space40"></div>
        <div className="space40"></div>
        <div>

        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
      <Grid item xs={1}>
          <Item></Item>
        </Grid>
        <Grid item xs={4}>
          <Item><h2>收藏夹列表</h2><hr></hr></Item>
        </Grid>
        <Grid item xs={1}>
          <Item></Item>
        </Grid>
        <Grid item xs={4}>
          <Item><h2>收藏夹内容</h2><hr></hr></Item>
        </Grid>
    </Grid>
    <Grid container spacing={1}>
      <Grid item xs={1}>
          <Item></Item>
        </Grid>
        <Grid item xs={4}>
          <Item><h3>{test}</h3></Item>

        </Grid>
        <Grid item xs={1}>
          <Item></Item>
        </Grid>
        <Grid item xs={4}>
          
          <Item2><span>{showContent}</span></Item2>
        </Grid>
    </Grid>
    
    </Box>

        </div>
     </>
    )
}

export default Fav;