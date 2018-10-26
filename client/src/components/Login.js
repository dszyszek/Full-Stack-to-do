import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import GoBack from './GoBack'

const handleForm = async (e) => {
    //e.preventDefault();
    console.log('send');


    let data = {
        email: document.querySelector('.emailInput').value,
        password: document.querySelector('.passwordInput').value
    };

    const token = await processRequest(data);

    const storageToken = JSON.stringify(token);
    localStorage.setItem('token', storageToken);
    console.log(token);
};


const processRequest = async (docs) => {

    console.log('inProcess');
    const post = await fetch( 'http://localhost:3000/users/login', {
        method: 'post',
        headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
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

            return res
        })
        .catch(e => console.log(e));

        console.log(post);
    return post[1]['x-auth'];
};

class Login extends React.Component {

    componentDidMount = () => {
                const oldStorage = localStorage.getItem('token');

                 if (oldStorage) {
                    localStorage.removeItem('token');
                }
    };

    render() {
        return (
            <div>
                <h1>Please log in</h1>
                    <form>
                        Email: <input type='text' className='emailInput'  />
                        Password: <input type='password' className='passwordInput' />  

                        <Link to='/users/me'>
                            <button onClick={handleForm}>Log in</button>
                        </Link>

                    </form>
                <GoBack />
            </div>
        );
    }

};

export {
    Login as default,
    handleForm
};