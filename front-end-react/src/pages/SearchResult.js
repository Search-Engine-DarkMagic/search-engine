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
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import loadingLogo from '../images/loading.gif';
import StarIcon from '@mui/icons-material/Star';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { ErrorMessage, Formik, Field, Form, useFormik } from 'formik';
import InputLabel from '@mui/material/InputLabel';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as Yup from 'yup';
function SearchResult(props) {

  const [inputError, setInputError] = useState(false);
  const [dataValue, setDataValue] = useState([]);
  const validate = Yup.object({
    folder: Yup.string()
    .required('必填'),
});
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'left',
    boxShadow:'none',
    fontSize:'20px',
    marginLeft:'20%'
  }));

  const Item2= styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'left',
    boxShadow:'none',

  }));
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [searchResult, setSearchResult] = useState([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [openFav, setOpenFav] = useState(false);
  let showNewFavName;
  const [newFavName, setNewFavName] = useState('');
  const inputFavName = () => {
    setNewFavName(true);
  }

  const cancelFavName = () => {
    setNewFavName(false);
  }

  const handleFavCloseNull = () => {
    setOpenFav(false);
    setNewFavName(false);
  };

  const handleFavClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    
    setResult(params.keyword.slice(7));
    setIgnore(params.filter.slice(7));

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
      url: 'http://localhost:4000/v1/search?result=' + params.keyword.slice(7) + '&filter=' + params.filter.slice(7),
      withCredentials: true,
   data: {
     email: email,
   }
  }).then(function (response) {
   
   if (!response.data.data.result){
     console.log("jesus");
     setSearchResult(['空']);
   }else {   
     console.log(response.data.data.result);
    setSearchResult(response.data.data.result);
 }

   setIsLoading(false);
   console.log(searchResult);
  })
  .catch(function (error) {
    console.log(error);
  }), 1000);
     

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
     
 }, [email],[searchResult]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [resultWantToSave, setResultWantToSave] = useState('');
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

    function handleFavClickOpen(fav) {
      setOpenFav(true);
      console.log(fav);
      setResultWantToSave(fav);
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
      const search = () => {
        
        navigate('/v1/search/result=' + result + '&filter=' + ignore);
        window.location.reload(false);        
        
      }
  if (ignore !== ''){
    showIgnore = <span>当前过滤关键字：{ignore}</span>
  }else{
    showIgnore = <span style={{visibility:"hidden"}}>当前过滤关键字：</span>
  }
  let resultShowing;
  if (Object.keys(searchResult).length === 1 && searchResult=='空'){
    resultShowing = <p style={{paddingTop:"30px"}}>很抱歉，没有找到相关搜索结果</p>
  }else {
   
    resultShowing = searchResult.map((rows)=> (
      <>
      <div className="boxbox" key={rows.id}>

      <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item><span style={{marginTop:'30px'}}>{rows}</span></Item>
      </Grid>
      <Grid item xs={2}>
        <Item><Button onClick={() => {handleFavClickOpen(rows);}}><span style={{fontWeight:"700"}}>添加收藏夹</span><StarIcon style={{color:"#F1C40F"}}/></Button></Item>
      </Grid>
    </Grid>
  </Box>
      </div>
      </>
   ))
  }


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

    let showUser;
  let showLogin;
  let showSignup;
  let test;

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

  if (isLoading) {
    return <div className="App"><p style={{textAlign:"center", fontSize:"50px"}}>拼命搜索中...</p><img height= "200px" src={loadingLogo} alt="loading..." /></div>;
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
      <MenuItem value={row}>{row}</MenuItem>
    ))


      function addFavToDB(){
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/addFav',
          data: {
            email: "mayichong123@gmail.com",
            folder: age,
            result: resultWantToSave,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          setOpenFav(false);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
        }
      })
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
        <Button style={{minWidth: '50px', minHeight: '55px'}} onClick={handleClickOpen}>高级搜索</Button>
        <Dialog open={openFav} onClose={handleFavClose}>
        <DialogTitle>个人收藏夹:</DialogTitle>
        <DialogContent>

          
         <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
      <Grid item xs={6}>
        <Item2><Button disableRipple={true}  style={{ backgroundColor: 'transparent' }}><StarIcon style={{color:"#F1C40F"}}/>&nbsp;添加到哪个文件夹中？</Button></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2>    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">收藏夹</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
          
        >

          {test}
         
        </Select>
        <Button onClick={addFavToDB} disableRipple = {true} style={{ backgroundColor: 'transparent' }} color="inherit">保存</Button>
      </FormControl>
    </Box></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2><Button onClick={inputFavName} style={{ backgroundColor: 'transparent' }}><CreateNewFolderIcon/>&nbsp;新建并保存到此文件夹</Button></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2>{showNewFavName}</Item2>
        </Grid>
        
      </Grid>
    </Box>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleFavCloseNull}>取消</Button>
          
        </DialogActions>
      </Dialog>


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
     <TextField className="searchBar" value={result} onChange={e => setResult(e.target.value)} id="outlined-basic" label="搜索" variant="outlined" InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }} />
     &nbsp;&nbsp;&nbsp;
  
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={search}><SearchIcon fontSize="large" className="searchButton"/></Button>
    <div style={{marginBottom:"100px"}}></div>
     </form>
       
      <h1>搜索结果如下:</h1>
        <hr style={{width:"50%"}}></hr>

        {resultShowing}
     </div>

     
        
     </>
    )
}

export default SearchResult;