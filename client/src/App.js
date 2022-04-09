import React, { useState, useEffect } from 'react';

import { Row, Form } from 'react-bootstrap';
import ControlledSelect from './modules/ControlledSelect';
import FileProcessor from './modules/FileProcessor';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import Select from 'react-select';

import "./styles.css";


// function TwoColumn(firstCol, secondCol) {
//   return (
// 		<div className="twoCol-container-flex">
// 			<div className="twoCol-left-flex">
// 				{firstCol}
// 			</div>
// 			<div className="twoCol-right-flex">
// 				{secondCol}
// 			</div>
// 		</div>
// 		// <div className="twoCol_container">
//   )
// }

// function FancySelect(props) {
// 	return (
// 			<div className="fancy-select">
// 			  <div>{props.label}</div>
// 			  <ControlledSelect control={props.control} onChange={props.onChange} name={props.name} options={props.options} isMulti={props.isMulti} defaultValue={props.defaultValue} />
// 			</div>
// 	);
// }

function FreeText(props) {
	return (
		<div className="free-text">
			<div>{props.label}</div>
		  <Controller
		  	control={props.control}
		  	name={props.name}
		  	render={({ field: { onChange, onBlur, value, ref} }) => (
		  		<Form.Control name={props.name} type="text" value={value}
		  			onChange={onChange}
		  			defaultValue={props.defaultValue}
		  		/>
		  	)}
		  />
	  </div>
	)
}

export const generativeOptions = [
    {value: "steer", label: "Steer the starting image towards the text prompt"},
    {value: "refine", label: "Refine the starting image"}
]

function App(props) {
	const { register, handleSubmit, control } = useForm();
    const [getMessage, setGetMessage] = useState({})
    const [image, setImage] = useState(null);
    const [prompt, setPrompt] = useState("a pretty logo");
    const [mode, setMode] = useState(null);
    const [type, setType] = useState(null);

    useEffect(()=>{
      axios.get('/flask/hello', {
              withCredentials: true,
              headers: {
              'Access-Control-Allow-Origin': "http://localhost:3000"
            }
          })
      .then(response => {
                console.log("SUCCESS", response)
                setGetMessage(response)
              }).catch(error => {
                        console.log(error)
                      })

    }, [])

	const updatePreferences = (data) => {
		console.log('form submitted!')
        console.log(data.prompt)
        setPrompt(data.prompt);
		console.log(data)
        const imagePost = {
            type:"one",
            prompt: data.prompt,
            image: image
        }
        console.log(imagePost)
        axios.post('/flask/hello', imagePost, {
            withCredentials: true,
            headers: {
            'Content-Type': type,
            'Access-Control-Allow-Origin': "http://localhost:3000"
          }
        })
	}

    function updateFile(e, updateDisplayURL) {
      const target = e.target;

      if (target.files && target.files[0]) {
        var file = target.files[0];
        
        const reader = new FileReader();
        reader.onload = (e) => {
          updateDisplayURL(e.target.result);
          setImage(e.target.result);
        } 
        reader.readAsDataURL(file);
        setType(file.type);
      }
    }
    function Copyright() {
          return (
                  <Typography variant="body2" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="https://mui.com/">
                      Your Website
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                  </Typography>
                );
    }
    
    console.log(mode);
	return (
        <>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
		  	    <div className="title"><b>logo-gen</b></div>
		  	  	<hr/>
              <small>
                Welcome! Do you have a logo that's just not good enough? Do you want to beautify your existing logo without paying a professional artist? Then try out <b>logo-gen</b> today!
              </small>
              <br/>
              <br/>
              <div>How should we reimagine your logo?</div>
		  	  <form onSubmit={handleSubmit(updatePreferences)}>
		  	  	<Select name="mode" control={control} name={mode} onChange={newMode => setMode(newMode.value)} defaultValue="" label="How should we reimagine your logo?" options={generativeOptions} isMulti={false}/>
                { (mode === "steer") ?
                  <FreeText name="prompt" control={control} defaultValue="" label="Prompt" value={prompt}/>
                  :
                  <></>
                }
		  	  	<hr/>
                  <FileProcessor type="image" updateFile={updateFile} initialURL={"https://www.csb.pitt.edu/wp-content/uploads/2013/09/cpcb-logo-e1386860509189.jpg"}/>
		  		<br/>
		  	  	<input className="submit-button" type="submit" value="Submit!"/>
		  	  </form>
              </Typography>
              <Copyright />
            </Box>
          </Container>
        </>
	)
}

export default App;
