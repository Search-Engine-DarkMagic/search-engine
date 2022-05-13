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
function SearchEngineMain() {
  const [open, setOpen] = useState(false);
  const [ignore, setIgnore] = useState('');

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
  if (ignore != ''){
    showIgnore = <span>当前过滤关键字：{ignore}</span>
  }else{
    showIgnore = <span style={{visibility:"hidden"}}>当前过滤关键字：</span>
  }

    return (
        <>
        <AppBar style={{ background: '#1F618D' }} elevation={0}>
          <Toolbar >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a component={Link} className="home"><img src={require('../images/search-logo.jpg')} style={{height:"50px", paddingTop:"5px"}}/></a>
            </Typography>
            <Button component={Link} color="inherit"
      to="/login"><span style={{fontWeight:"800"}}>登录</span></Button>
      <Button component={Link} color="inherit"
      to="/login"><span style={{fontWeight:"800"}}>注册</span></Button>
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
     <TextField className="searchBar" id="outlined-basic" label="搜索" variant="outlined" InputProps={{ style: { fontFamily:"Quicksand", fontWeight:"700"} }} />
     &nbsp;&nbsp;&nbsp;
     
     <div className="space20"></div>
     <Button variant="contained" size="large" style={{minWidth: '50px', minHeight: '55px'}}><SearchIcon fontSize="large" className="searchButton"/></Button>

        <div className="space40"></div>
        
        
     </div>
     
     </>
    );
  }

export default SearchEngineMain;