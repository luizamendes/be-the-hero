import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";

import logoImg from "../../assets/logo.svg";
import { FiPower, FiTrash2 } from "react-icons/fi";

import "./styles.scss";

const Profile = () => {
  const [incidents, setIncidents] = useState([]);
  const history = useHistory();
  const ongName = localStorage.getItem("ongName");
  const ongId = localStorage.getItem("ongId");

  useEffect(() => {
    api
      .get("profile", {
        headers: {
          Authorization: ongId
        }
      })
      .then(response => {
        setIncidents(response.data);
      });
  }, [ongId]);

  const handleDeleteIncidente = async id => {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      });
      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch {
      alert("Erro ao deletar caso, tente novamente");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  const renderIncidents = incident => {
    const { id, title, description, value } = incident;
    return (
      <li key={id}>
        <strong>CASO:</strong>
        <p>{title}</p>

        <strong>DESCRIÇÃO:</strong>
        <p>{description}</p>

        <strong>VALOR:</strong>
        <p>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(value)}
        </p>
        <button
          type="button"
          onClick={() => {
            handleDeleteIncidente(id);
          }}
        >
          <FiTrash2 size={20} color="#a8a8b3" />
        </button>
      </li>
    );
  };

  return (
    <div className="profile__container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem-vinda, {ongName}</span>
        <Link className="button" to="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>
      <h1>Casos cadastrados</h1>
      <ul>{incidents.map(renderIncidents)}</ul>
    </div>
  );
};

export default Profile;
