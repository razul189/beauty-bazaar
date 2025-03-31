//CosmeticLink.js
import React, { useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from "./UserContext"; 
import CosmeticEditForm from './CosmeticEditForm';


const CosmeticLink = ({ cosmetic }) => {
  const [formFlag, setFormFlag] = useState(false);
  const { deleteCosmetic } = useContext(UserContext);
  const { id } = useParams();
  return (
    <div>
      <Link to={`/categories/${cosmetic.category_id}/cosmetics/${cosmetic.id}`} key={cosmetic.id}>
        {cosmetic.title}
      </Link>
      <span>
        - <button onClick={() => deleteCosmetic(cosmetic)}>X</button>
        <button onClick={() => setFormFlag((formFlag) => !formFlag)}>Edit</button>
      </span>
      {formFlag ? <CosmeticEditForm cosmetic={cosmetic} setFormFlag={setFormFlag} /> : null}
    </div>
  );
};

export default CosmeticLink;