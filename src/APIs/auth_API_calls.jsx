import api from "./base_API";

// Login function
export const login = async (username, password) => {
    const formdata = new URLSearchParams(); 
    formdata.append("username", username);
    formdata.append("password", password); 

    const response = await api.post('/auth/login', formdata, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });

    const token = response.data.access_token;
    if (token) {
        localStorage.setItem("token", token); 
    }

    return response.data; 
};


export const UserSignUp = async (username, password) => {
    try {
        const response = await api.post('/auth/signup', {
            "username": username,
            "password": password
        });
        return response.data; 
    } catch (error) {
        console.log(`Error :{error}`);
        throw error; 
    }
};
