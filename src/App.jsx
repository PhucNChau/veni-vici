import { useState } from 'react';
import './App.css';

const App = () => {
  const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const [currentImage, setCurrentImage] = useState(null)
  const [catInfo, setCatInfo] = useState({
    breed_weight: "",
    breed_name: "",
    breed_origin: "",
    breed_life_span: "",
  })

  var listOfCurrentImages = null;

  const makeQuery = () => {
    let has_breeds = 1;
    let limit = 5;
    let query = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&has_breeds=${has_breeds}&limit=${limit}`;
    
    callAPI(query).catch(console.error);
  };

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    // console.log(typeof(json));
    listOfCurrentImages = json;
    console.log(listOfCurrentImages.pop());
    console.log(listOfCurrentImages);
    var index = 0;
    if (json[index].url == null) {
      alert("Oops! Something went wrong with that query, let's try again!")
    }
    else {
      setCurrentImage(json[index].url);
      setCatInfo({
        breed_weight: `${json[index].breeds[0].weight.imperial} lbs`,
        breed_name: json[index].breeds[0].name,
        breed_origin: json[index].breeds[0].origin,
        breed_life_span: `${json[index].breeds[0].life_span} years`,
      });
    }
  };

  return (
    <div className='app'>
      <h1>😻 MeowMatch 😻</h1>
      <h3>A place for discovering and exploring beloved cats!</h3>
      <div className='container'>
        <div className='cat-listing'>
          <div>
            {catInfo && catInfo.breed_name !== "" &&
              Object.entries(catInfo).map(([category, value], index) => (
                <button className='attribute' type="button" key={index}>{value}</button>
              ))
            }
          </div>
          {currentImage ? (
            <img
              className='cat-pic'
              src={currentImage}
              alt="Pic returned"
            />
          ) : (
            <div></div>
          )}
        </div>
        <button className='discover' type='button' onClick={makeQuery}>🔎 Discover</button>
      </div>
    </div>
  );
};

export default App;
