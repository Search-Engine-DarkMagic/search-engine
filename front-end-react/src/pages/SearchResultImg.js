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
import FolderIcon from '@mui/icons-material/Folder';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from "../pages/Modal";
import Pagination from '@mui/material/Pagination';

import Container from "@mui/material/Container";
import List from "@mui/material/List";
import * as Yup from 'yup';
import PanoramaIcon from '@mui/icons-material/Panorama';
function SearchResultImg(props) {
  const [searchTime, setSearchTime] = useState("");
  const [inputError, setInputError] = useState(false);
  const [dataValue, setDataValue] = useState([]);
  const validate = Yup.object({
    folder: Yup.string()
    .required('??????'),
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

  const Item3= styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow:'none',
    spacing: '1',

  }));
  const [age, setAge] = React.useState('');
  const [selectedImg, setSelectedImg] = useState(null);
  const searchImgAction = () => {
    navigate('/v1/searchImg/result=' + result + '&filter=' + ignore);
    window.location.reload(false);
  }

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [openImg, setOpenImg] = useState(false);
  const [largeImg, setLargeImg] = useState(null);
  const [searchImg, setSearchImg] = useState([]);
  const [searchKey, setSearchKey] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState([]);
  const [openFav, setOpenFav] = useState(false);
  const [openFav2, setOpenFav2] = useState(false);
  let showNewFavName;
  const [newFavName, setNewFavName] = useState('');


  const handleOpenImg = (rows) => {
    setOpenImg(true);
    setLargeImg(rows);
  }

  const handleCloseImg = () => {
    setOpenImg(false);
  }

  const handleFavClickOpen2 = () => {
    setOpenFav2(true);
  }

  const handleFavCloseNull2 = () => {
    setOpenFav2(false);
  };


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
      url: 'http://localhost:4000/v1/searchImg?result=' + params.keyword.slice(7) + '&filter=' + params.filter.slice(7),
      withCredentials: true,
   data: {
     email: email,
   }
  }).then(function (response) {
   
   if (!response.data.data.result){
     console.log("jesus");
     setSearchResult(['???']);
     setSearchTime((response.data.data.time / 1000000000).toFixed(3) + "???");
     
   }else {   
     console.log(response.data.data.url);
     setSearchResult(response.data.data.result);
     setSearchKey(response.data.data.key);
     setSearchTime((response.data.data.time / 1000000000).toFixed(3) + "???");
     setSearchImg(response.data.data.url);
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

  if (!response.data.message) {
    setDataValue("???");
  }else{
    console.log(response.data.message);
    setDataValue(response.data.message);
    console.log(dataValue);
  }

})
.catch(function (error) {

console.log(error);
}), 1000);
     
 }, [email],[searchResult],[searchKey]);



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

    const count = Math.ceil(searchImg.length / 30);
    const handlePageChange = (event, value) => {
      setPage(paginator(searchImg, value, 30).page);
    };
    const handleOnChange = (e, index) => {
      let prev = checked;
      let itemIndex = prev.indexOf(index);
      if (itemIndex !== -1) {
        prev.splice(itemIndex, 1);
      } else {
        prev.push(index);
      }
      setChecked([...prev]);
    };
    console.log(checked);
  
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

      const searchRelated = (key) => {
        
        navigate('/v1/searchImg/result=' + key + '&filter=');
        window.location.reload(false);        
        
      }

  if (ignore !== ''){
    showIgnore = <span>????????????????????????{ignore}</span>
  }else{
    showIgnore = <span style={{visibility:"hidden"}}>????????????????????????</span>
  }

  

  let resultShowing;
  let resultKeyShowing;
  let resultImgShowing;
  if (Object.keys(searchResult).length === 1 && searchResult=='???'){
    resultShowing = <p style={{paddingTop:"30px"}}>??????????????????????????????????????????</p>
    resultKeyShowing = <p></p>
  }else {
    resultKeyShowing = searchKey.map((rows) => (
      <>

        <Button color="warning" onClick={() => {searchRelated(rows)}}><span style={{fontSize:"20px"}}>{rows}</span></Button>
      </>
     
      
    ))
    
    resultShowing = searchResult.map((rows)=> (
      <>
      <div className="boxbox" key={rows.id}>

      <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item><span style={{marginTop:'30px'}}>{rows}</span></Item>
      </Grid>
      <Grid item xs={2}>
        <Item><Button onClick={() => {handleFavClickOpen(rows);}}><span style={{fontWeight:"700"}}>???????????????</span><StarIcon style={{color:"#F1C40F"}}/></Button></Item>
      </Grid>
    </Grid>
  </Box>
      </div>
      </>
   ))
  }

  if (Object.keys(searchResult).length === 1 && searchResult=='???'){
    resultShowing = <p style={{paddingTop:"30px"}}>??????????????????????????????????????????</p>
  }else {
    resultKeyShowing = searchKey.map((rows) => (
      <>
        <Button color="warning" onClick={() => {searchRelated(rows)}}><span style={{fontSize:"20px"}}>{rows}</span></Button>
      </>
      
    ))
    resultImgShowing =      <Container>
    {paginator(searchImg, page, 30).data.map((value, index) => {
      return (
<>

 <span>
    <img 
    src={value}
    alt="pic"
    width="200px"
    height="200px"
    onClick={() => handleOpenImg(value)}
    style={{margin:"25px"}}
    />
    </span> 

  </>
      );
    })}

  <div style={{ display: "flex", justifyContent: "center" }}>
    <Pagination
      count={count}
      page={page}
      onChange={handlePageChange}
      color="primary"
    />
  </div>

</Container>
    
    resultShowing = searchResult.map((rows)=> (
      <>
      <div className="boxbox" key={rows.id}>

      <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item><span style={{marginTop:'30px'}}>{rows}</span></Item>
      </Grid>
      <Grid item xs={2}>
        <Item><Button onClick={() => {handleFavClickOpen(rows);}}><span style={{fontWeight:"700"}}>???????????????</span><StarIcon style={{color:"#F1C40F"}}/></Button></Item>
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
          url: 'http://localhost:4000/v1/favFolderCreateNSave',
          data: {
            folder: values.folder,
            email: props.email,
            result: resultWantToSave,
            
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          alert(`????????????????????????`)
          setOpenFav(false);
          // window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
          alert(`?????????????????????????????????.`)
        }
      })
      }}
    >
      {({ values,handleChange, touched, errors }) => (
        <Form>
        <TextField
          label="???????????????"
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
            
            
    <Button type="submit">??????</Button>
    <Button onClick={cancelFavName}>??????</Button>
        </Form>
      )}
    </Formik>

    
    </>

}else {
  showNewFavName = <>
  <TextField label="???????????????" style={{visibility:"hidden"}}></TextField>
  <Button style={{visibility:"hidden"}}>??????</Button>
  </>
}

    let showUser;
  let showLogin;
  let showSignup;
  let test;

  if (props.nickName !== ''){
    showUser = <>
    <Button onClick={handleFavClickOpen2} color="inherit"><FolderIcon />&nbsp;<span style={{fontWeight:"800"}}>?????????</span></Button>&nbsp;&nbsp;
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
    <MenuItem onClick={handleClose2}><span>????????????</span></MenuItem>
    <MenuItem onClick={handleClose2} component={Link} to="/v1/history"><span>??????????????????</span></MenuItem>
    <MenuItem onClick={logout}><span>????????????</span></MenuItem>
  </Menu></>
    
    // <Button component={Link} color="inherit"
    // to="/v1/login"><span style={{fontWeight:"800"}}>{props.nickName}</span></Button>


  }else{
    showLogin = <Button component={Link} color="inherit"
    to="/v1/login"><span style={{fontWeight:"800"}}>??????</span></Button>
    showSignup = <Button component={Link} color="inherit"
    to="/v1/signup"><span style={{fontWeight:"800"}}>??????</span></Button>
  }

  if (isLoading) {
    return <div className="App"><p style={{textAlign:"center", fontSize:"50px"}}>???????????????...</p><img height= "200px" src={loadingLogo} alt="loading..." /></div>;
  }


    //Eliminate duplicate folder name by using 'Set'
    const mySet1 = new Set()

    //Add all folder names into Set

    if (Object.keys(dataValue).length == 0) {
      mySet1.add("???");
    }else{

      for (let i = 0; i < Object.keys(dataValue).length; i++) {
        mySet1.add(dataValue[i].folder);
      }
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
            email: email,
            folder: age,
            result: resultWantToSave,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
        alert(`???????????????`);
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
        <Button style={{minWidth: '50px', minHeight: '55px'}} onClick={handleClickOpen}>????????????</Button>
        <Dialog open={openFav} onClose={handleFavClose}>
        <DialogTitle>???????????????:</DialogTitle>
        <DialogContent>

          
         <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
      <Grid item xs={6}>
        <Item2><Button disableRipple={true}  style={{ backgroundColor: 'transparent' }}><StarIcon style={{color:"#F1C40F"}}/>&nbsp;??????????????????????????????</Button></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2>    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">?????????</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
          
        >

          {test}
         
        </Select>
        <Button onClick={addFavToDB} disableRipple = {true} style={{ backgroundColor: 'transparent' }} color="inherit">??????</Button>
      </FormControl>
    </Box></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2><Button onClick={inputFavName} style={{ backgroundColor: 'transparent' }}><CreateNewFolderIcon/>&nbsp;??????????????????????????????</Button></Item2>
        </Grid>
        <Grid item xs={6}>
          <Item2>{showNewFavName}</Item2>
        </Grid>
        
      </Grid>
    </Box>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleFavCloseNull}>??????</Button>
          
        </DialogActions>
      </Dialog>


        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>??????????????????:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ???????????????
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
          <div className="space40"><span style={{fontSize:"15px"}}>*?????????????????????????????????????????????????????????????????????</span></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>??????</Button>
          <Button onClick={handleCloseNull}>??????</Button>
          
        </DialogActions>
      </Dialog>
      <Dialog open={openFav2} onClose={handleFavClose}>
        <DialogTitle>???????????????:</DialogTitle>
        <DialogContent>  
         <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
       
        <Grid item xs={6}>
        <Item><Button component={Link} to="/v1/fav" style={{ backgroundColor: 'transparent' }}><ManageAccountsIcon/>&nbsp;?????????????????????</Button></Item>
        </Grid>
        <Grid item xs={6}>
          <Item>*???????????????????????????????????????????????????????????????????????????.</Item>
        </Grid>
      </Grid>
    </Box>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleFavCloseNull2}>??????</Button>
          
        </DialogActions>
      </Dialog>


      <Dialog open={openImg} onClose={handleCloseImg}>
      <img src={largeImg} />

    
      </Dialog>

        <div></div>
        <form>
     <TextField className="searchBar" value={result} onChange={e => setResult(e.target.value)} id="outlined-basic" label="??????" variant="outlined" InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }} />
     &nbsp;&nbsp;&nbsp;
  
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={search}><SearchIcon fontSize="large" className="searchButton"/>??????</Button>
     &nbsp;&nbsp;&nbsp;
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}} onClick={searchImgAction} color="success"><PanoramaIcon fontSize="large" className="searchButton"/> &nbsp;??????</Button>
     <div></div>
     <span>????????????:{searchTime} </span>
    <div style={{marginBottom:"40px"}}></div>
     </form>
     
       <div>
       <h3>??????????????????</h3>
      <div style={{marginTop:"20px"}}></div>
    {resultKeyShowing}

       
       </div>

       <div style={{marginBottom:"70px"}}></div>
      <h1>??????????????????:</h1>
        <hr style={{width:"50%"}}></hr>

        <Box sx={{ width: '100%' }}>
      <Grid container Spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

        {resultImgShowing}
       
      </Grid>
    </Box>
    {resultShowing}
     </div>
        



  <div className="space40" />

     </>
    )
}

function paginator(items, current_page, per_page_items) {
  let page = current_page || 1,
    per_page = per_page_items,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page_items),
    total_pages = Math.ceil(items.length / per_page);
  console.log("Anzahl: " + items.lgenth);

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}


export default SearchResultImg;