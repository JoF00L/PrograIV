import React from 'react';

const GenericModal = ({ showModal, setShowModal, mode, handleSubmit, formData, setFormData, title, fields }) => (
    <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
            <div className="modal-content modal-content bg-dark text-light">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                </div>
                <div className="modal-body">
                    {fields.map(field => (
                        <div className="form-group" key={field.id}>
                            <label htmlFor={field.id}>{field.label}</label>
                            <input
                                type={field.type}
                                className="form-control"
                                id={field.id}
                                value={formData[field.id]}
                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                            />
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>{mode === 'CREATE' ? 'Save changes' : 'Update changes'}</button>
                </div>
            </div>
        </div>
    </div>
);

export default GenericModal;
