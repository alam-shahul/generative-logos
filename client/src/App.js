import React, { useState, useEffect } from 'react';

import { Container, Row, Form } from 'react-bootstrap';
import ControlledSelect from './modules/ControlledSelect';
import FileProcessor from './modules/FileProcessor';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'

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

function FancySelect(props) {
	return (
			<div className="fancy-select">
			  <div>{props.label}</div>
			  <ControlledSelect control={props.control} name={props.name} options={props.options} isMulti={props.isMulti} defaultValue={props.defaultValue} />
			</div>
	);
}

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

export const yesNoOptions = [
    {value: "yes", label: "Yes"},
    {value: "no", label: "No"}
]

function App(props) {
	const { register, handleSubmit, control } = useForm();
    const [getMessage, setGetMessage] = useState({})
    const [image, setImage] = useState(null);

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
		console.log(data)
	}

    function updateFile(e, updateDisplayURL) {
      const target = e.target;

      if (target.files && target.files[0]) {
        var file = target.files[0];
        
        const reader = new FileReader();
        reader.onload = (e) => {
          updateDisplayURL(e.target.result);
          setImage(e.target.result);
          const imagePost = {
              type:"one",
              image: e.target.result
          }
          console.log(imagePost)
          axios.post('/flask/hello', imagePost, {
              withCredentials: true,
              headers: {
              'Content-Type': file.type,
              'Access-Control-Allow-Origin': "http://localhost:3000"
            }
          })
        } 
        reader.readAsDataURL(file);
      }
    }
	
	return (
		<Container>
            <div>Welcome! Upload a picture of your starting logo.</div>
            <div>{getMessage.status === 200 ? 
                      <h3>{getMessage.data.message}</h3>
                      :
                      <h3>LOADING</h3>}
            </div>
            <br/>
			<Row className="flex-column align-items-center">
			  <Form onSubmit={handleSubmit(updatePreferences)}>
			    <div className="title">Drawing Logos with Generative Art</div>
			  	<hr/>
			    <FreeText name="name" control={control} defaultValue="" label="Name" value={props.name}/>
			  	<FreeText name="hobbies_freetext" control={control} defaultValue="" name="hobbiesFreeText" label="Metadata Tags" 
			  		value={props.hobbiesFreeText}/>
				<br/>
			  	<div className="subtitle">Dropdown select example</div>
			  	<FancySelect name="example" control={control} defaultValue="" label="Format options" options={yesNoOptions} isMulti={false}/>
			  	<hr/>
                <FileProcessor type="image" updateFile={updateFile} initialURL={"https://www.csb.pitt.edu/wp-content/uploads/2013/09/cpcb-logo-e1386860509189.jpg"}/>

				<br/>
			  	<input className="submit-button" type="submit" value="Submit!"/>
			  </Form>
			</Row>
		</Container>
	)
}

export default App;
