import { Component, Fragment } from 'react';

import './charInfo.scss';
import Spinner from '../Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {

    state = { // Создали начальное состояние
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService(); // Импортировали экзмепляр класса, что даёт нам возможности работать с его методами

    componentDidMount() { // Используем хук который нужен для работы с данными, сюда мы помещаем всё что обновляется и имеет в себе данные, для того чтобы они монтировались на экран
        this.updateCharInfo();
    }

    componentDidUpdate(prevProps) { // Используем хук который нужен чтобы при повторном клике не уходили запросы на сервер
        if (this.props.charId !== prevProps.charId) { // Используем charId который вытащили из App, создали условие чтобы при повторном клике не повторялся запрос
            this.updateCharInfo();
            this.setState({
                loading: true
            })
        }
    }
    
    updateCharInfo = () => { // Метод который обновляет данные про персонажа
        const {charId} = this.props; // Передали charId как пропс из App
        if (!charId) {
            return;
        }

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => { // Метод загружает характеристику персонажа
        this.setState({ // Меняем состояние для char и для загрузки ставим false, то-есть при загрузке char loading будет переведен в false
            char, 
            loading: false,
        })
    }

    onError = () => { // Метод который изменит состояния и поставит загрузку в false, а ошибку в true
        this.setState({
            loading: false,
            error: true
        })
    }

    render () {

        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton></Skeleton>
        const errorMessage = error ? <ErrorMessage></ErrorMessage> : null;
        const loadingSpinner = loading ? <Spinner></Spinner> : null;
        const content = !(error || loading || !char) ? <RenderInfo char={char}></RenderInfo> : null;

        return (
            <div className="char__info">
                {loadingSpinner}
                {skeleton}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const RenderInfo = ({char}) => {

    const imgStyle = {
        objectFit: 'fill',
    }

    const {thumbnail, name, homepage, wiki, description, comics} = char;
    console.log(char)
    console.log(comics)


    // Определяем, что рендерить в зависимости от длины массива comics
    const comicsList = comics.length > 0 
        ? comics.slice(0, 10).map((item, i) => (
            <li key={i} className="char__comics-item">
                {item.name}
            </li>
        ))
        : <ErrorMessage></ErrorMessage>; // Если массив пустой

    return (
        <Fragment>
            <div className="char__basics">
            <img style={imgStyle} src={thumbnail} alt={name}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">wiki</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
            {comicsList}
        </ul>
        </Fragment>
    )
}

export default CharInfo;