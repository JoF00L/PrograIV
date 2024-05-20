import React from 'react';

const GenericSearch = ({ searchTerm, setSearchTerm, handleSearch, placeholder = "Search..." }) => {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default GenericSearch;
