import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from 'react-leaflet/hooks';
import { useState, useEffect } from 'react';
import api from "./services/api";
import "./app.css";

function App() {

  const [input, setInput] = useState('');
  const [location, setLocation] = useState(null);

  if(input != ""){
    var inputValues = input.trim().split(' ');
    var result = inputValues.map((item) => {
      if(inputValues.indexOf(item) > 0) return `%20${item}`;
      
      return item;
    })
  };

  console.log(location)

  function MyComponent() {
    const map = useMapEvents({
      click: (event) => {
        event.setZoom(13);
        
        map.flyTo(event.latlng, map.getZoom());
      }
    })
    return null
  }
  // function MyComponent() {
  //   const map = useMapEvents({
  //     click: (event) => {
  //       if(locations.length >= 2){
  //         console.log(event);
  //       } else{
  //         setLocations((value) => [...value , event.latlng]);
  //       }
  //       map.flyTo(event.latlng, map.getZoom());
  //     }
  //   })
  //   return null
  // }
    
  async function handleSearch(e){
    e.preventDefault();

    if(input.length < 9){
      alert('Digite um Localização valida');
      return;
    }

    try {
      // const response = await api.get(`search?key=pk.a6364d20957b04aac85c76e812c5cff0&q=fortaleza%20aldeota&format=json`);
      const response = await api.get(`search?key=pk.a6364d20957b04aac85c76e812c5cff0&q=${result.join('')}&format=json`);
      response.data.hasOwnProperty('erro') ? alert('Localização invalida ou não encontrada') : setLocation(response.data);
      
    } catch (error) {
      alert('erro ao Buscar localização');
      setLocation("");
    }    
  }
    

  return (
    <div className="wrapper">
      Digite uma localização para visualizar no mapa
       <form onSubmit={handleSearch}>
          <input 
            type="text"
            value={input}
            placeholder="Digite um local"
            className='inputCep'
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />

          <button className='searchBtn' >
            enviar
          </button>
      </form>
      <MapContainer center={[-3.721413683872664, -38.510599136352546]} zoom={3} scrollWheelZoom={true} dragging={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MyComponent />
      </MapContainer>

    </div>
  )
}

export default App;
