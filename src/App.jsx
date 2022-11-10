import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMap } from 'react-leaflet/hooks';
import L from 'leaflet';
import { useState } from 'react';
import Local from "./components/Local"
import api from "./services/api";
import "leaflet/dist/leaflet.css";
import "./App.css";


function App() {

  const [input, setInput] = useState('');
  const [location, setLocation] = useState([]);

  if(input != ""){
    var inputValues = input.trim().split(' ');
    var result = inputValues.map((item) => {
      if(inputValues.indexOf(item) > 0) return `%20${item}`;
      
      return item;
    })
  };

  async function handleSearch(event){
    event.preventDefault();

    if(input.length < 9){
      alert('Digite um Localização valida');
      return;
    }

    try {
      const response = await api.get(`search?key=pk.a6364d20957b04aac85c76e812c5cff0&q=${result.join('')}&format=json`);
      response.data.hasOwnProperty('erro') ? alert('Localização invalida ou não encontrada') : setLocation(response.data);
      
    } catch (error) {
      alert('erro ao Buscar localização');
    }    
  }

  const MapControl = () =>{
    const map = useMap();

    if(location.length === 1){
      const {lat, lon} = location[0];
      map.flyTo([lat, lon], 16);
    } else{
      map.flyTo(map.getCenter(), 3);
    }
  }
  
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <span className="form-wrapper__title">
          Digite uma localização para visualizar no mapa
        </span>
        <form className="form-wrapper__form" onSubmit={handleSearch}>
            <input 
              type="text"
              value={input}
              placeholder="Digite um local"
              className='inputCep'
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />

            <button>
              Enviar
            </button>
        </form>
      </div>
      <MapContainer
        center={[-3.72, -38.51]}
        zoom={3}
        minZoom={3}
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        { 
          location.length === 1 && (
            <Marker position={[location[0].lat, location[0].lon]}>
              <Popup>
                Ponto de partida
              </Popup>
            </Marker>
          )
        }

        {
          location.length > 1 && (
            location.map((local) => {
              const { lat, lon, place_id } = local;
              return(
                <Marker position={[lat, lon]} key={place_id}>
                  <Popup>
                    Ponto de partida
                  </Popup>
                </Marker>
              )
            })
          )
        }

        <MapControl />
      </MapContainer>

      { location  && location.map((local) => {
          const { display_name, place_id } = local;
          return (
            <Local
              key={place_id}
              name={display_name}
            />
          )
        })
      }
      
    </div>
  )
}

export default App;
