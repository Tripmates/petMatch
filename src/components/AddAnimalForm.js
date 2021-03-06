import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import allBreeds from '../../utils/DogBreeds.js'
import Dropzone from 'react-dropzone';
import request from 'superagent';

import { Route, Link, Redirect, BrowserRouter as Router } from 'react-router-dom';



class AddAnimalForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      age: '',
      animal: 'Dog',
      breed: '',
      address1: '',
      address2: '',
      city: '',
      email: '',
      phone: '',
      state: '',
      zip: '',
      description: '',
      photo: '',
      mix: '',
      name: '',
      sex: '',
      size: '',
      zipError: false,
      phoneError: false,
      emailError: false,
      sexError: false,
      sizeError: false,
      nameError: false,
      mixError: false,
      descriptionError: false,
      photoError: false,
      stateError: false,
      cityError: false,
      address1Error: false,
      breedError: false,
      ageError: false,
      showImageUploader: true,
      uploadedFile: null,
      uploadedFileCloudinaryUrl: '',
      uploadingImageSpinner: false,
      imageMatchSpinner: false,
      imageRecogMatch: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.recognizeImage = this.recognizeImage.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  handleSubmit(event) {
    console.log("handleSubmit called");
    this.setState({zipError: false, phoneError: false, emailError: false, sexError: false, sizeError: false, nameError: false, mixError: false, descriptionError: false, photoError: false, stateError: false, cityError: false, address1Error: false, breedError: false, ageError: false});

    var emailCheck = 0;
    var shouldPost = 0;
    for(var i = 0;i < this.state.email.length;i++) {
      if(this.state.email[i] === '@') {
        emailCheck = 1
      }
    }
    if(this.state.zip.length < 5)  {
      event.preventDefault();
      this.setState({zipError: true})
    }
    if(emailCheck !== 1)  {
      event.preventDefault();
      this.setState({emailError: true})
      shouldPost++
    }
    if(this.state.phone.length !== 12) {
      event.preventDefault();
      this.setState({phoneError: true})
      shouldPost++
    }
    if(this.state.city.length === 0) {
      event.preventDefault();
      this.setState({cityError: true})
      shouldPost++
    }
    if(this.state.breed.length === 0) {
      event.preventDefault();
      this.setState({breedError: true})
      shouldPost++
    }
    if(this.state.age.length === 0) {
      event.preventDefault();
      this.setState({ageError: true})
      shouldPost++
    }
    if(this.state.mix.length === 0) {
      event.preventDefault();
      this.setState({mixError: true})
      shouldPost++
    }
    if(this.state.address1.length === 0) {
      event.preventDefault();
      this.setState({address1Error: true})
      shouldPost++
    }
    if(this.state.state.length === 0) {
      event.preventDefault();
      this.setState({stateError: true})
      shouldPost++
    }
    if(this.state.description.length === 0) {
      event.preventDefault();
      this.setState({descriptionError: true})
      shouldPost++
    }
    if(this.state.name.length === 0) {
      event.preventDefault();
      this.setState({nameError: true})
      shouldPost++
    }
    if(this.state.sex.length === 0) {
      event.preventDefault();
      this.setState({sexError: true})
      shouldPost++
    }
    if(this.state.size.length === 0) {
      event.preventDefault();
      this.setState({sizeError: true})
      shouldPost++
    }
    if(this.state.photo.length === 0) {
      event.preventDefault();
      this.setState({photoError: true})
      shouldPost++
    }
    if(shouldPost === 0) {
      event.preventDefault();

      axios.post('/dog-tinder-api/dog', {
        age: this.state.age,
        animal: this.state.animal,
        breed: this.state.breed,
        address1: this.state.address1,
        address2: this.state.address2,
        city: this.state.city,
        email: this.state.email,
        phone: this.state.phone,
        state: this.state.state,
        zip: this.state.zip,
        description: this.state.description,
        photo: this.state.photo,
        mix: this.state.mix,
        name: this.state.name,
        sex: this.state.sex,
        size: this.state.size
      }).then((response) => {
        console.log("Inserted dog into DB");
        this.props.history.push('/');
      })
      .catch(()=> console.log("There was an error submitting this form."));
    }
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0],
      uploadingImageSpinner: true
    })
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(process.env.CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url,
          photo: response.body.secure_url,
          showImageUploader: false,
          uploadingImageSpinner: false
        });
      }
    });
  }

  recognizeImage(fileName) {
    console.log("recognizeImage called");
    this.setState({
      imageMatchSpinner: true
    })
    axios.get('/gCloudVision', {
      params: {
        imageURL: fileName
      }
    })
    .then((response) => {
        this.setState({
          imageRecogMatch: response.data,
          imageMatchSpinner: false
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  imageRecogMatchTooBroad(match) {
    var broadMatches = ["dog", "mammal", "vertebrate","dog breed", "bird", "chicken", "fauna", "beak", "bird of prey"];

    if (!broadMatches.includes(match)) {
      return true;
    };
  }

  render() {
    if (this.state.imageRecogMatch) {
      var qualityImageRecogMatches = this.state.imageRecogMatch.filter(this.imageRecogMatchTooBroad);
    }
    return (
      <div className="dog-form-container"><h1>Pet Tinder</h1>
        <h3>Add an animal to PetTinder</h3>
        <p>Please describe the animal and enter your shelter's contact information.</p>
        <form>
          <div className="form-group dog-form-short">
            <label className="form-group">Dog's Name</label>
            <input className="form-control" name="name" type="text" onChange={this.handleChange}/>
          </div>

          <div className="form-group dog-form">
            <label className="form-group">Dog's Breed</label>
            <select className="form-control" name="breed" onChange={this.handleChange}>
              <option defaultValue="breed" selected disabled>Breed</option>
              {allBreeds.map(breed => <option value={breed.$t} key={breed.$t} onChange={this.handleChange}>{breed.$t}</option>)}
            </select>
          </div>

          <div className="form-group dog-form">
            <label className="form-group">Description of Dog</label>
            <textarea className="form-control" name="description" rows="5" onChange={this.handleChange}></textarea>
          </div>

          <div className="form-group dog-form-short">
            <label className="form-group">Add a photo URL</label>
            <input className="form-control" name="photo" type="text" onChange={this.handleChange}/>
            <p>or</p>
            {this.state.showImageUploader && <div className="FileUpload">
              <Dropzone
                onDrop={this.onImageDrop.bind(this)}
                multiple={false}
                accept="image/*">
                <div id="image_uploader"></div>
              </Dropzone>
            </div>}

            {this.state.uploadingImageSpinner ? (
              <div><i className="kennel-spin fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>
            ) : (
              <div>
                {this.state.uploadedFileCloudinaryUrl === '' ? null :
                <div id="uploadedPic">
                  <img src={this.state.uploadedFileCloudinaryUrl} />
                    <button type="button" onClick={ ()=> this.recognizeImage(this.state.uploadedFileCloudinaryUrl) }>I'm a stray. Identify me!!</button>
                  </div>
                  }
                </div>
              )}

              {this.state.imageMatchSpinner ? (
                <div><i className="kennel-spin fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>
              ) : (
              <div>
              {qualityImageRecogMatches[0] ? (
                qualityImageRecogMatches.map((match, index) => {
                  return (
                    <div id="imageMatchResult" key={index}>This lil pup is probably a: <span>{match}</span></div>
                  )
                })) : null}
              </div>
            )}
            </div>
          <div className="form-group dog-form-x-short">
            <select className="form-control" name="mix" onChange={this.handleChange}>
              <option defaultValue="mixed" selected disabled>Mixed Breed?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group dog-form-x-short">
            <select className="form-control" name="sex" onChange={this.handleChange}>
              <option defaultValue="mixed" selected disabled>Sex</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </div>
          <div className="form-group dog-form-x-short">
            <select className="form-control" name="age" onChange={this.handleChange}>
              <option defaultValue="age" selected disabled>Age</option>
              <option value="Baby">Baby</option>
              <option value="Young">Young</option>
              <option value="Adult">Adult</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div className="form-group dog-form-x-short">
            <select className="form-control" name="size" onChange={this.handleChange}>
              <option defaultValue="size" selected disabled>Size</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">X-Large</option>
            </select>
          </div>
          <div className="form-group dog-form">
            <label className="form-group">Contact Address 1</label>
            <input className="form-control" name="address1" type="text" onChange={this.handleChange}/>
          </div>
          <div className="form-group dog-form">
            <label className="form-group">Address 2</label>
            <input className="form-control" name="address2" type="text" onChange={this.handleChange}/>
          </div>
          <div className="form-group dog-form-short">
            <label className="form-group">City</label>
            <input className="form-control" name="city" type="text" onChange={this.handleChange}/>
          </div>
          <div className="form-group dog-form-x-short">
            <select className="form-control" name="state" onChange={this.handleChange}>
              <option defaultValue="state" selected disabled>State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="form-group dog-form-short">
            <label className="form-group">Zip Code</label>
            <input className="form-control" name="zip" type="number" max="99999" onChange={this.handleChange}/>
          </div>
          <div className="form-group dog-form-short">
            <label className="form-group">Email</label>
            <input className="form-control" name="email" type="text" onChange={this.handleChange}/>
          </div>
          <div className="form-group dog-form-short">
            <label className="form-group">Phone (xxx-xxx-xxxx)</label>
            <input className="form-control" name="phone" type="text" onChange={this.handleChange}/>
          </div>
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
        </form>
        {this.state.zipError ? (<div >The zipcode field is invalid, please review</div>) : null}
        {this.state.phoneError ? (<div >The phone field is invalid, please review</div>) : null}
        {this.state.emailError ? (<div >The email field is invalid, please review</div>) : null}
        {this.state.sexError ? (<div >The sex field is required, please review</div>) : null}
        {this.state.sizeError ? (<div >The size field is required, please review</div>) : null}
        {this.state.nameError ? (<div >The name field is required, please review</div>) : null}
        {this.state.mixError ? (<div >The mix field is required, please review</div>) : null}
        {this.state.descriptionError ? (<div >The description field is required, please review</div>) : null}
        {this.state.photoError ? (<div >The photo field is required, please review</div>) : null}
        {this.state.stateError ? (<div >The state field is required, please review</div>) : null}
        {this.state.cityError ? (<div >The city field is required, please review</div>) : null}
        {this.state.address1Error ? (<div >The address1 field is required, please review</div>) : null}
        {this.state.breedError ? (<div >The breed field is required, please review</div>) : null}
        {this.state.ageError ? (<div >The city field is required, please review</div>) : null}
      </div>
    );
  }

}

module.exports = AddAnimalForm;
