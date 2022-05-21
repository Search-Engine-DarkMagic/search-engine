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

function AddFav(props) {


    return (
        <>
        <div className="center">
        <div className="space40"></div>
        <h1>添加</h1>
        <Formik
      initialValues={{
        folder: "",
        result: "",
      }}
      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/addFav',
          data: {
            email: "mayichong123@gmail.com",
            folder: values.folder,
            result: values.result,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
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
          onChange={(e) => { handleChange(e); }}
 
          />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<TextField
          label="搜索结果"
          id="result"
          name="result"
          type="text"
          value={values.result}
          InputProps={{
            style:{fontFamily:"Quicksand", fontWeight:"700"}
          }}
          onChange={(e) => { handleChange(e); }}
   
          />
        <div></div>     
    <Button type="submit">提交</Button>
   
        </Form>
      )}
    </Formik>

    <div className="space40"></div>
    <h1>删除</h1>
    <Formik
      initialValues={{
        folder: "",
        result: "",
      }}
      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/deleteFav',
          data: {
            email: "mayichong123@gmail.com",
            folder: values.folder,
            result: values.result,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
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
          onChange={(e) => { handleChange(e); }}
 
          />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<TextField
          label="搜索结果"
          id="result"
          name="result"
          type="text"
          value={values.result}
          InputProps={{
            style:{fontFamily:"Quicksand", fontWeight:"700"}
          }}
          onChange={(e) => { handleChange(e); }}
   
          />
        <div></div>     
    <Button type="submit">提交</Button>
   
        </Form>
      )}
    </Formik>
    <div className="space40"></div>
    <h1>删除文件夹</h1>
    <Formik
      initialValues={{
        folder: "",
        result: "",
      }}
      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/deleteFavFolder',
          data: {
            email: "mayichong123@gmail.com",
            folder: values.folder,
            result: values.result,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
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
          onChange={(e) => { handleChange(e); }}
 
          />


        <div></div>     
    <Button type="submit">提交</Button>
   
        </Form>
      )}
    </Formik>
    <div className="space40"></div>
    <h1>重命名文件夹</h1>
    <Formik
      initialValues={{
        oldFolder: "",
        newFolder: "",
      }}
      onSubmit={(values) => {
        console.log(values);
        axios({
          method: 'post',
          url: 'http://localhost:4000/v1/renameFolder',
          data: {
            email: "mayichong123@gmail.com",
            oldFolder: values.oldFolder,
            newFolder: values.newFolder,
          },
      }).then(function (response) {
        console.log(JSON.stringify(response.data.message));
          window.location.reload();
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error);
        }
      })
      }}
    >
      {({ values,handleChange, touched, errors }) => (
        <Form>
        <TextField
          label="旧文件夹名字"
          id="oldFolder"
          name="oldFolder"
          type="text"
          value={values.oldFolder}
          InputProps={{
            style:{fontFamily:"Quicksand", fontWeight:"700"}
          }}
          onChange={(e) => { handleChange(e); }}
 
          />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<TextField
          label="新文件夹名字"
          id="newFolder"
          name="newFolder"
          type="text"
          value={values.newFolder}
          InputProps={{
            style:{fontFamily:"Quicksand", fontWeight:"700"}
          }}
          onChange={(e) => { handleChange(e); }}
 
          />

        <div></div>   
          
    <Button type="submit">提交</Button>
   
        </Form>
      )}
    </Formik>
    </div>
     </>
    );
  }

export default AddFav;