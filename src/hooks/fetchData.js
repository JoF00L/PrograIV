const fetchData = async (url, options) => {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    if (!response.ok) {
        throw new Error(`Failed to ${options.method} data`);
    }
    const data = await response.text();
    return data ? JSON.parse(data) : {};
};

export default fetchData;