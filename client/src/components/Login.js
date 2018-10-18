import React from 'react';

const handleForm = async (e) => {
    e.preventDefault();
    console.log('send');


    let data = {
        email: document.querySelector('.emailInput').value,
        password: document.querySelector('.passwordInput').value
    };

    processRequest(data);

};

const processRequest = async (docs) => {

    const post = fetch( 'http://localhost:3000/users/login', {
        method: 'post',
        headers: {
                "Content-type": "application/json"
                        },
        body: JSON.stringify(docs)
        })
        .then(res => {
            if (res.status === 400) {
                 document.write('Invalid credentials');
                 return;
            } 
           return res.json();
        })
        .then(res => { 
            if (!res) return;

           return document.write(JSON.stringify(res, undefined, 2))})
        .catch(e => console.log(e));

    return post;
};

const Login = () => {
    return (
        <div>
            { /*<h1>Please log in</h1> */}
            <form onSubmit={handleForm}>
                Email: <input type='text' className='emailInput' />
                Password: <input type='password' className='passwordInput' />  
                <button>Log in</button>
            </form>
        </div>
    );
};

export {
    Login as default
};