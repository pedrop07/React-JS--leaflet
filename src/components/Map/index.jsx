import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
import { useState } from 'react';
import Local from '../Local';
import api from '../../services/api';
import 'leaflet/dist/leaflet.css';
import './index.css';

function Map() {

  const [input, setInput] = useState('');
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let result;
  if(input != ""){
    let inputValues = input.trim().split(' ');
    result = inputValues.map((item) => {
      return inputValues.indexOf(item) > 0 ? `%20${item}` : item;
    })
  };

	async function handleSearch(event){
    event.preventDefault();
    setIsLoading(true);

    try {
			const response = await api.get(`search?key=pk.a6364d20957b04aac85c76e812c5cff0&q=${result.join('')}&format=json`);

			if(response.data.hasOwnProperty('erro')) {
				alert('Localização invalida ou não encontrada');
			} else{
				setIsLoading(false);
				setLocation(response.data);
			}
    } catch (error) {
			setIsLoading(false);
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

  const inputChange = (event) => {
    setInput(event.target.value);
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
              onChange={inputChange}
            />

            <button>
              Enviar
            </button>
        </form>
      </div>

      {
        isLoading && (
            <img src="src/assets/images/Spinner.gif" alt="Loader" id="spinner" />
        )
      }

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
                {location[0].display_name}
              </Popup>
            </Marker>
          )
        }

        {
          location.length > 1 && location.map(({ lat, lon, display_name, place_id }) => {
            return(
              <Marker position={[lat, lon]} key={place_id}>
                <Popup>
                  {display_name}
                </Popup>
              </Marker>
            )
          })
        }

        <MapControl />
      </MapContainer>

      {
        location && location.map(({display_name, place_id}) => {
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

export default Map;
