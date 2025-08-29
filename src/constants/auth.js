export const login = async (token, email, client) => {
    localStorage.setItem('token', token);
    if (email !== undefined) {
        localStorage.setItem('log-email', email || null);
    }
    if (client) {
        await client.clearStore();
        await client.cache.reset();
    }
};

export const logout = async client => {
    localStorage.removeItem('token');
    await client.clearStore();
    await client.cache.reset();
};
