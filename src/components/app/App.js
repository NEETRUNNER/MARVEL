import { Component } from "react";

import React from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    // Для классовых компонентов контекст this обязателен, так класс-компонент понимает что этот метод или состояние пренадлежит классу в котором существует

    state = { // Создали начальное состояние вместо constructor
        selectedChar: null,
    }

    onCharSelected = (id) => { // Создали метод который будет устанавливать состояние для selectedChar и будет добавлять туда аргумент id
        this.setState({
            selectedChar: id
        })
    }

    render () {
        return (
            <div className="app">
                <AppHeader/>
                <main>

                    <ErrorBoundary>
                        <RandomChar/>
                    </ErrorBoundary>

                    <div className="char__content">

                    <ErrorBoundary>
                        <CharList onCharSelected={this.onCharSelected}/>
                    </ErrorBoundary>

                        <ErrorBoundary>
                            <CharInfo charId={this.state.selectedChar}/>
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}

export default App;