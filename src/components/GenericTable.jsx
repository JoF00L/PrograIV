import React from 'react';

const GenericTable = ({ data, columns, uniqueKey }) => {
    return (
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', margin: '20px auto' }}>
            <table className="table table-dark table-striped">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item[uniqueKey]}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {column.render ? column.render(item) : item[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenericTable;
