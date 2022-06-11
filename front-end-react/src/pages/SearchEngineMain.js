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
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import * as Yup from 'yup';
import { ErrorMessage, Formik, Field, Form, useFormik } from 'formik';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PanoramaIcon from '@mui/icons-material/Panorama';
function SearchEngineMain(props) {
  const [inputError, setInputError] = useState(false);
  const validate = Yup.object({
    folder: Yup.string()
    .required('必填'),
});


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    boxShadow:'none',
  }));


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
  const [openFav, setOpenFav] = useState(false);
  const [ignore, setIgnore] = useState('');
  const [result, setResult] = useState('');
  const [newFavName, setNewFavName] = useState('');
  const search = () => {
    navigate('/v1/search/result=' + result + '&filter=' + ignore);
  }

  const searchImg = () => {
    navigate('/v1/searchImg/result=' + result + '&filter=' + ignore);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleFavClickOpen = () => {
    setOpenFav(true);
  }

  const handleClose = () => {
    setOpen(false);
    console.log(ignore);
  };

  const handleFavClose = () => {
    setOpen(false);
  };


  const handleCloseNull = () => {
    setOpen(false);
    setIgnore('');
  };

  const handleFavCloseNull = () => {
    setOpenFav(false);
    setNewFavName(false);
  };

  const inputFavName = () => {
    setNewFavName(true);
  }

  const cancelFavName = () => {
    setNewFavName(false);
  }

  let showIgnore;
  if (ignore !== ''){
    showIgnore = <span>当前过滤关键字：{ignore}</span>
  }else{
    showIgnore = <span style={{visibility:"hidden"}}>当前过滤关键字：</span>
  }

  let showUser;
  let showLogin;
  let showSignup;
  let showNewFavName;

  if (newFavName == true) {
    showNewFavName = <>
    <Formik
      initialValues={{
        folder: "",

      }}
      validationSchema={validate}
      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/favFolder',
          data: {
            folder: values.folder,
            email: props.email,
            
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          alert(`文件夹创建成功！`)
          window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
          alert(`创建失败！文件夹已存在.`)
        }
      })
      }}
    >
      {({ values,handleChange, touched, errors }) => (
        <Form>
        <TextField
          label="文件夹名字"
          id="folder"
          name="folder"
          type="text"
          value={values.folder}
          InputProps={{
            style:{fontFamily:"Quicksand", fontWeight:"700"}
          }}
          onChange={(e) => { handleChange(e); setInputError(false); }}
          error={inputError} 
            
          
             
          />
          
          <div></div>
            {errors.folder && touched.folder ? setInputError(true) : console.log("H")}
            
            
    <Button type="submit">确认</Button>
    <Button onClick={cancelFavName}>取消</Button>
        </Form>
      )}
    </Formik>

    
    </>
  }else {
    showNewFavName = <>
    <TextField label="文件夹名字" style={{visibility:"hidden"}}></TextField>
    <Button style={{visibility:"hidden"}}>确认</Button>
    </>
  }


  if (props.nickName !== ''){
    showUser = <>
    <Button onClick={handleFavClickOpen} color="inherit"><FolderIcon />&nbsp;<span style={{fontWeight:"800"}}>收藏夹</span></Button>&nbsp;&nbsp;
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
      <Dialog open={openFav} onClose={handleFavClose}>
        <DialogTitle>个人收藏夹:</DialogTitle>
        <DialogContent>
          
         <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item><Button onClick={inputFavName} style={{ backgroundColor: 'transparent' }}><CreateNewFolderIcon/>&nbsp;快速新建收藏夹</Button></Item>
        </Grid>
        <Grid item xs={6}>
          <Item>{showNewFavName}</Item>
        </Grid>
        <Grid item xs={6}>
        <Item><Button component={Link} to="/v1/fav" style={{ backgroundColor: 'transparent' }}><ManageAccountsIcon/>&nbsp;管理查看收藏夹</Button></Item>
        </Grid>
        <Grid item xs={6}>
          <Item>*管理文件夹包括：添加，删除，修改文件夹以及搜索结果.</Item>
        </Grid>
      </Grid>
    </Box>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleFavCloseNull}>取消</Button>
          
        </DialogActions>
      </Dialog>
        <div></div>
        <form>
     <TextField className="searchBar" onChange={e => setResult(e.target.value)} id="outlined-basic" label="搜索" variant="outlined" InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }} />
     &nbsp;&nbsp;&nbsp;
     <div className="space20"></div>
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={search}><SearchIcon fontSize="large" className="searchButton"/>文字</Button>
     &nbsp;&nbsp;&nbsp;
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={searchImg} color="success"><PanoramaIcon fontSize="large" className="searchButton"/> &nbsp;图片</Button>

     </form>
        <div className="space40"></div>
        
        
     </div>
     
     </>
    );
  }

export default SearchEngineMain;