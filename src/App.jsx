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
  });
  const [banList, setBanList] = useState({
    breed_weight: new Set(),
    breed_name: new Set(),
    breed_origin: new Set(),
    breed_life_span: new Set(),
  });
  const [imageHistory, setImageHistory] = useState([{imageUrl: "", description: ""}]);

  const makeQuery = () => {
    let has_breeds = 1;
    let limit = 5;
    let query = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&has_breeds=${has_breeds}&limit=${limit}`;
    
    callAPI(query).catch(console.error);
  };

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    var item = filterImage(json);
    if (item == null) {
      callAPI();
    } else {
      if (item.url == null) {
        alert("Oops! Something went wrong with that query, let's try again!")
      }
      else {
        setCurrentImage(item.url);
        setCatInfo({
          breed_weight: `${item.breeds[0].weight.imperial} lbs`,
          breed_name: item.breeds[0].name,
          breed_origin: item.breeds[0].origin,
          breed_life_span: `${item.breeds[0].life_span} years`,
        });
        setImageHistory((prevState) => ([
          ...prevState,
          {
            imageUrl: item.url,
            description: `A ${item.breeds[0].name} cat from ${item.breeds[0].origin}`
          }
        ]));
        console.log(imageHistory);
      }
    }
  };

  const filterImage = (json) => {
    var filteredItem = null;
    for (let item of json) {
      if (banList.breed_life_span.has(`${item.breeds[0].life_span} years`) ||
      banList.breed_name.has(item.breeds[0].name) ||
      banList.breed_origin.has(item.breeds[0].origin) ||
      banList.breed_weight.has(`${item.breeds[0].weight.imperial} years`)) {
        continue;
      }
      else {
        filteredItem = item;
        break;
      }
    }
    return filteredItem;
  };

  const addToBanList = (e) => {
    setBanList((prevState) => ({
      ...prevState,
      [e.target.name]: new Set([...prevState[e.target.name], e.target.value])
    }));
  }

  const removeFromBanList = (e) => {
    console.log(e.target);
    setBanList((prevState) => ({
      ...prevState,
      [e.target.name]: new Set([...prevState[e.target.name], prevState[e.target.name].delete(e.target.value)])
    }));
  }

  return (
    <div className='app'>
      <div>
        <h1>😻 MeowMatch 😻</h1>
        <h3>A place for discovering and exploring beloved cats!</h3>
        <div className='container'>
          <div className='cat-listing'>
            <div>
              {catInfo && catInfo.breed_name !== "" &&
                Object.entries(catInfo).map(([category, value], index) => (
                  <button className='attribute' type="button" key={index} onClick={addToBanList} name={category} value={value}>{value}</button>
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
      <div className='left-sidebar'>
        <h2>Ban List</h2>
        <h4>Select an attribute to ban it from your search</h4>
        <div className="attributes-container">
          {banList && 
            Object.entries(banList).map(([category, values], index) => (
              values.size > 0 &&
              <div className="attributes-list" key={index}>
                {[...values].map((item, index) => (
                  item &&
                  <button className="ban-attribute" type="button" key={index} onClick={removeFromBanList} name={category} value={item}>{item}</button>
                ))}
              </div>
            ))
          }
        </div>
      </div>
      <div className='right-sidebar'>
        <h3>Our Exploration History!</h3>
        <div className='history'>
          {imageHistory &&
            imageHistory.map((item, index) => (
              item && item.imageUrl !== "" &&
              <div key={index}>
                <img src={item.imageUrl} alt="pic history" />
                <p>{item.description}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default App;
