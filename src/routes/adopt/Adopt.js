import React from 'react';

import Adoption from '../../components/adoption/Adoption'

import peopleApiCalls from '../../services/people/peopleAPICalls'
import petsApiCalls from '../../services/pets/petsApiCalls'

class Adopt extends React.Component{

    state = {
        error : null,
        regInput : '',
        cat : {},
        dog : {},
        peopleInQueue : [],
        type : '',
        user : ''
    }

    componentDidMount(){
        peopleApiCalls.getListOfPeopleInQueue()
        .then(persons =>{
            this.setState({peopleInQueue : persons})
        })
        .catch(e => this.setState({error : e}));
        petsApiCalls.getNextPets()
        .then(pets => {
            this.setState({
                cat : pets.cat,
                dog : pets.dog
            })
        })
        .catch(e => this.setState({error : e}))
    }
    componentWillUnmount(){
        this.setState({error : null})
    }



    handleRegistration = () => {

        peopleApiCalls.postNewUserIntoQueue(this.state.regInput)
        .catch(e=> this.setState({error : e }))
        this.setState({regInput : ''});
    }

    handleRegistrationInput = (ev)=> {
        console.log(ev)
        ev.preventDefault();
        this.setState({regInput : ev.target.value})
    }

    handleAdoption = (ev) => {
        ev.preventDefault();
        //can only take in __cats__ or __dogs__  i.e. ev.target.id == cats  
        petsApiCalls.removePetFromQueue({ type : ev.target.id})
        petsApiCalls.getNextPets()
        .then(pets => {
            this.setState({
                cat : pets.cat,
                dog : pets.dog
            })
        })
        .catch(e => this.setState({error : e}))
    }

    /**
     * handles random pick of pet ad dequeueing 
     */
    handleRandomAdoption =()=>{
        const catOrDog = ['cats','dogs']
        let randomType = catOrDog[Math.floor(Math.random() * Math.floor(1))]
        petsApiCalls.removePetFromQueue({type :randomType});
        peopleApiCalls.dequeueUserFromQueue();
    }
    /**
     * should work only when user has made an user 
     */
    handleQueueMovement = () =>{
        if(this.state.user){
            while(this.state.peopleInQueue.length > 1){
                setTimeout(this.handleRandomAdoption(),5000)
            }
            while(this.state.user === this.state.peopleInQueue[0]){
                /**add new user */
            }
        }
    }

    render(){
        const {cat,dog,peopleInQueue} = this.state; 
        return(
            <div>
                <Adoption
                cat={cat}
                dog={dog}
                peopleInQueue={peopleInQueue}
                handleAdoption={this.handleAdoption}
                handleRegistrationInput={this.handleRegistrationInput}
                val={this.state.regInput}
                handleRegistration={this.handleRegistration}
                />
            </div>
        )
    }
}
export default Adopt;