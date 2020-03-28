import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';
import logoImg from '../../assets/logo.svg';


export default function Profile() {
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    const [incidents, setIncidents] = useState([]);
    const history = useHistory();

    useEffect(() => {
        api.get('profile', {
            headers : {
                authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    authorization: ongId,
                }
               
            });
            setIncidents(incidents.filter(incident => incident.id !== id))
        } catch(err) {
            alert('Erro ao deletar caso, tente novamente.')
        }
    }

    function handleLogaut() {
        localStorage.clear();
        history.push('/')
    }
  return (
    <div className="profile-container">
        <header>
        <img src={logoImg} alt="Be The Hero"/> 
        <span>Bem Vinda, {ongName}</span>

            <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
            <button onClick={handleLogaut} type="button" >
                <FiPower size={18} color="#8e4dff" />
            </button>
        </header>

        <h1>Casos cadastrados</h1>
        <ul>
            {incidents.map(incident => (
                <li key={incident.id}>
                <strong>CASO:</strong>
                <p>{incident.title}</p>

                <strong>DESCRIÇÃO:</strong>
                <p>{incident.description}</p>

                <strong>VALOR:</strong>
                <p className="color-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                <button onClick={()=> handleDeleteIncident(incident.id)} type="button">
                    <FiTrash2 size={20} color="FFFFFF"/>
                </button>
            </li>
            ))}
        </ul>
    </div>
  );
}
