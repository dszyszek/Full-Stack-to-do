import React from 'react';
import {NavLink} from 'react-router-dom';



const processRequestS = (docs) => {
    fetch('http://localhost:3000/users', {
        method: 'post',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(docs)
    }).then(usr => usr.json()).then(usr => document.write(JSON.stringify(usr))).catch(e => console.log(e));
};


class SignUp extends React.Component {
    
    constructor (props) {
        super(props);

        this.handleSignUp = this.handleSignUp.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate = (docs) => {
        const validEmail = /^[A-Za-z0-9._\-*]+\@[A-Za-z0-9]+\.[A-Za-z]{2,3}$/g;
        const validPassword = /^[A-Za-z0-9]{6,}/g;


        if (validEmail.test(docs.email) && validPassword.test(docs.password)) {
            return true;
        }
        return false;
    }

    handleSignUp = async (e) => {
        e.preventDefault();
        let email = document.querySelector('.emailInputS');
        let password = document.querySelector('.passwordInputS');
    
        let data = {
            email: email.value,
            password: password.value
        };
       
        if (this.validate(data)) {
            await  processRequestS(data);
        } else {
            alert('Email or password is not valid!');
            email.value = '';
            password.value = '';
        };
    };

    render () {
        return (
            <div>
                <h1>Sign up page</h1>
                <form onSubmit={this.handleSignUp}>
                    Email: <input type='text' className='emailInputS' />
                    Password: <input type='password' className='passwordInputS' />  
                    <button>Sign up</button>
                </form>
                <NavLink to='/'>Go back</NavLink>
            
            </div>
        );
    }

};

export {
    SignUp as default
};