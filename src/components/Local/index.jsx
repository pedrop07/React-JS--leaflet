import './index.css';

export default function Local({ name }){
    return(
        <div className="local-container">
          <h1>
            Resultado da pesquisa
          </h1>
          {name}
        </div>
    )
};
